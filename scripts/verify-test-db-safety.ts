import { URL } from 'url';
import fs from 'fs';
import path from 'path';

export interface SafeDbMetadata {
  host: string;
  port: string;
  database: string;
}

export function parseSafeDbMetadata(rawUrl?: string): SafeDbMetadata | null {
  if (!rawUrl) return null;
  try {
    const parsed = new URL(rawUrl);
    return {
      host: parsed.hostname,
      port: parsed.port || '5432',
      database: parsed.pathname.replace(/^\//, '').split('?')[0],
    };
  } catch {
    return null;
  }
}

function getDevDatabaseUrl(): string | undefined {
  if (process.env.DEV_DATABASE_URL) return process.env.DEV_DATABASE_URL;
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('psyche_ai_test')) {
    return process.env.DATABASE_URL;
  }
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
    if (match) return match[1];
  }
  return undefined;
}

export function assertTestDatabaseSafety(): {
  devMeta: SafeDbMetadata | null;
  testMeta: SafeDbMetadata;
} {
  const devUrl = getDevDatabaseUrl();
  const testUrl = process.env.TEST_DATABASE_URL || (process.env.DATABASE_URL?.includes('psyche_ai_test') ? process.env.DATABASE_URL : undefined);

  if (!testUrl) {
    throw new Error('SAFETY_ABORT: TEST_DATABASE_URL is not set.');
  }

  const testMeta = parseSafeDbMetadata(testUrl);
  if (!testMeta) {
    throw new Error('SAFETY_ABORT: TEST_DATABASE_URL could not be parsed.');
  }

  const devMeta = parseSafeDbMetadata(devUrl);

  console.log('--- DATABASE SAFETY GATE CHECK ---');
  if (devMeta) {
    console.log(`DATABASE_URL: host=${devMeta.host} port=${devMeta.port} database=${devMeta.database}`);
  } else {
    console.log('DATABASE_URL: [not set or unparseable]');
  }
  console.log(`TEST_DATABASE_URL: host=${testMeta.host} port=${testMeta.port} database=${testMeta.database}`);

  // 1. Assert TEST_DATABASE_URL database != DATABASE_URL database
  if (devMeta && testMeta.database === devMeta.database) {
    throw new Error(
      `SAFETY_ABORT: TEST_DATABASE_URL database ('${testMeta.database}') matches DATABASE_URL database. Aborting to protect DEV DB!`
    );
  }

  // 2. Assert TEST database name clearly identifies it as a test database
  if (!testMeta.database.toLowerCase().includes('test')) {
    throw new Error(
      `SAFETY_ABORT: TEST_DATABASE_URL database ('${testMeta.database}') does not contain 'test'. Aborting!`
    );
  }

  if (testMeta.database !== 'psyche_ai_test') {
    throw new Error(
      `SAFETY_ABORT: Target test database is not unequivocally 'psyche_ai_test' (found: '${testMeta.database}'). Aborting!`
    );
  }

  // 3. Assert TEST connection target != production
  const allowedLocalHosts = new Set(['localhost', '127.0.0.1', 'test-db', 'db']);
  if (!allowedLocalHosts.has(testMeta.host.toLowerCase())) {
    throw new Error(
      `SAFETY_ABORT: TEST_DATABASE_URL host ('${testMeta.host}') is not an allowed local container/host target. Aborting!`
    );
  }

  console.log('SAFETY_GATE: PASS (Test database is isolated, local, and unequivocally psyche_ai_test)');
  return { devMeta, testMeta };
}

// CLI direct execution
if (require.main === module) {
  try {
    assertTestDatabaseSafety();
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
}
