import { PrismaClient } from '@prisma/client';
import { isValidRole, Role } from '../src/lib/rbac';
import { logAuthAuditEvent } from '../src/lib/auditLog';

const prisma = new PrismaClient();

function getArg(flag: string): string | null {
  const index = process.argv.indexOf(flag);
  if (index !== -1 && index + 1 < process.argv.length) {
    return process.argv[index + 1];
  }
  const prefix = `${flag}=`;
  const found = process.argv.find((a) => a.startsWith(prefix));
  if (found) {
    return found.substring(prefix.length);
  }
  return null;
}

async function main() {
  const rawEmail = getArg('--email');
  const rawRole = getArg('--role');

  if (!rawEmail || !rawRole) {
    console.error('Kullanım: npm run admin:grant-role -- --email <email> --role <ROLE>');
    console.error('Mevcut roller: USER, EXPERT_REVIEWER, RESEARCHER, ADMIN, SUPER_ADMIN');
    process.exit(1);
  }

  const emailNormalized = rawEmail.trim().toLowerCase();
  const roleUpper = rawRole.trim().toUpperCase();

  if (!isValidRole(roleUpper)) {
    console.error(`Geçersiz rol: '${rawRole}'. Geçerli roller: USER, EXPERT_REVIEWER, RESEARCHER, ADMIN, SUPER_ADMIN`);
    process.exit(1);
  }

  const role = roleUpper as Role;

  // Lookup user
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { emailNormalized },
        { email: emailNormalized },
      ],
    },
  });

  if (!user) {
    console.error(`Kullanıcı bulunamadı: ${rawEmail}`);
    process.exit(1);
  }

  // Idempotent grant
  await prisma.userRole.upsert({
    where: {
      userId_role: {
        userId: user.id,
        role,
      },
    },
    create: {
      userId: user.id,
      role,
      grantedBy: 'CLI_BOOTSTRAP',
    },
    update: {
      grantedBy: 'CLI_BOOTSTRAP',
    },
  });

  await logAuthAuditEvent({
    eventType: 'ROLE_GRANTED',
    userId: user.id,
    actorUserId: 'CLI_BOOTSTRAP',
    success: true,
    metadata: { role, email: user.email },
  });

  console.log(`✅ '${role}' rolü başarıyla verildi: ${user.name} (${user.email || user.emailNormalized}) [ID: ${user.id}]`);
}

main()
  .catch((e) => {
    console.error('Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
