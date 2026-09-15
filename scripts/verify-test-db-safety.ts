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
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const devMatch = content.match(/^DEV_DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
    if (devMatch) return devMatch[1];
    const match = content.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
    if (match && !match[1].includes('psyche_ai_test')) return match[1];
  }
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('psyche_ai_test')) {
    return process.env.DATABASE_URL;
  }
  return undefined;
}

function getTestDatabaseUrl(): string | undefined {
  if (process.env.TEST_DATABASE_URL) return process.env.TEST_DATABASE_URL;
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('psyche_ai_test')) {
    return process.env.DATABASE_URL;
  }
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^TEST_DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
    if (match) return match[1];
  }
  return undefined;
}

export function validateTestDatabaseConfig(
  testUrl?: string,
  devUrl?: string
): { valid: boolean; error?: string; testMeta?: SafeDbMetadata; devMeta?: SafeDbMetadata | null } {
  if (!testUrl) {
    return { valid: false, error: 'SAFETY_ABORT: TEST_DATABASE_URL is not set.' };
  }

  const testMeta = parseSafeDbMetadata(testUrl);
  if (!testMeta) {
    return { valid: false, error: 'SAFETY_ABORT: TEST_DATABASE_URL could not be parsed.' };
  }

  const devMeta = parseSafeDbMetadata(devUrl);

  // Condition A: host is local (localhost or 127.0.0.1)
  const allowedHosts = new Set(['localhost', '127.0.0.1']);
  if (!allowedHosts.has(testMeta.host.toLowerCase())) {
    return {
      valid: false,
      error: `SAFETY_ABORT: TEST_DATABASE_URL host ('${testMeta.host}') must be strictly localhost or 127.0.0.1.`,
      testMeta,
      devMeta,
    };
  }

  // Condition B: port is exactly 5434
  if (testMeta.port !== '5434') {
    return {
      valid: false,
      error: `SAFETY_ABORT: TEST_DATABASE_URL port ('${testMeta.port}') must be exactly 5434.`,
      testMeta,
      devMeta,
    };
  }

  // Condition C: database name is exactly psyche_ai_test
  if (testMeta.database !== 'psyche_ai_test') {
    return {
      valid: false,
      error: `SAFETY_ABORT: Target test database name ('${testMeta.database}') must be exactly 'psyche_ai_test'.`,
      testMeta,
      devMeta,
    };
  }

  // Condition D: must not resolve to the same database identity as DEV
  if (
    devMeta &&
    testMeta.host === devMeta.host &&
    testMeta.port === devMeta.port &&
    testMeta.database === devMeta.database
  ) {
    return {
      valid: false,
      error: `SAFETY_ABORT: TEST_DATABASE_URL resolves to the same database identity as DEV database (${devMeta.host}:${devMeta.port}/${devMeta.database}).`,
      testMeta,
      devMeta,
    };
  }

  return { valid: true, testMeta, devMeta };
}

export function assertTestDatabaseSafety(
  customTestUrl?: string,
  customDevUrl?: string
): {
  devMeta: SafeDbMetadata | null;
  testMeta: SafeDbMetadata;
} {
  const devUrl = customDevUrl || getDevDatabaseUrl();
  const testUrl = customTestUrl || getTestDatabaseUrl();

  const validation = validateTestDatabaseConfig(testUrl, devUrl);

  console.log('DATABASE SAFETY GATE:');
  if (validation.devMeta) {
    console.log(
      `DEV: host=${validation.devMeta.host} port=${validation.devMeta.port} database=${validation.devMeta.database}`
    );
  } else {
    console.log('DEV: [not configured or unparseable]');
  }

  if (validation.testMeta) {
    console.log(
      `TEST: host=${validation.testMeta.host} port=${validation.testMeta.port} database=${validation.testMeta.database}`
    );
  } else {
    console.log('TEST: [not set]');
  }

  if (!validation.valid) {
    console.log(`SAFETY_GATE: FAIL (${validation.error})`);
    throw new Error(validation.error);
  }

  console.log('SAFETY_GATE: PASS');
  return { devMeta: validation.devMeta || null, testMeta: validation.testMeta! };
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
