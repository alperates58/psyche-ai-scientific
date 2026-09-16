#!/bin/sh
set -e

echo "PsycheAI container başlatılıyor..."

MAX_RETRIES=30
RETRY_INTERVAL=2
count=0

echo "Veritabanı bağlantısı kontrol ediliyor..."

until node -e '
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
prisma.$queryRaw`SELECT 1`
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
' > /dev/null 2>&1; do
  count=$((count + 1))
  if [ "$count" -ge "$MAX_RETRIES" ]; then
    echo "HATA: Veritabanına $MAX_RETRIES denemeden sonra bağlanılamadı. Çıkılıyor." >&2
    exit 1
  fi
  echo "Veritabanı henüz hazır değil ($count/$MAX_RETRIES). $RETRY_INTERVAL saniye bekleniyor..."
  sleep $RETRY_INTERVAL
done

echo "Veritabanı bağlantısı doğrulandı."

echo "Prisma veritabanı migration'ları uygulanıyor..."
npx prisma migrate deploy

echo "Değerlendirme formları ve modülleri doğrulanıyor..."
node -e '
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function check() {
  const count = await prisma.assessmentFormVersion.count({
    where: { isPublished: true, status: "PUBLISHED" }
  });
  if (count < 1) {
    console.log("Yayınlanmış form sayısı: " + count + ". Seed işlemi gereklidir.");
    process.exit(2);
  }
  console.log("✅ " + count + " yayınlanmış doğrulanmış değerlendirme formu mevcut.");
  process.exit(0);
}
check().catch(() => process.exit(2));
' || {
  echo "Değerlendirme formları seed ediliyor..."
  npx tsx scripts/seed-executable-assessments.ts || true
}

echo "Uygulama başlatılıyor..."
exec node server.js

