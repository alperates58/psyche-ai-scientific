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

echo "FAZ 2.7C-1 Bilimsel durum doğrulanıyor..."
if node ./scripts/verify-c1-state.js > /dev/null 2>&1; then
  echo "✅ Bilimsel durum (C1) eksiksiz ve doğrulanmış."
else
  echo "⚠️ Bilimsel durum (C1) henüz tamamlanmamış."
  if [ "$ALLOW_SCIENTIFIC_BACKFILL_2_7C1" = "YES" ] && [ "$SCIENTIFIC_BACKUP_VERIFIED" = "YES" ]; then
    echo "Otomatik üretim backfill yetkisi ve yedek onayı mevcut. Backfill çalıştırılıyor..."
    node ./prisma/backfill-runner.js --target=production
    echo "Backfill sonrası bilimsel durum yeniden doğrulanıyor..."
    node ./scripts/verify-c1-state.js
  else
    echo "❌ HATA: Bilimsel durum (C1) eksik ve üretim yetkilendirme bayrakları (ALLOW_SCIENTIFIC_BACKFILL_2_7C1=YES, SCIENTIFIC_BACKUP_VERIFIED=YES) tanımlanmamış." >&2
    echo "Yarım migrate edilmiş verinin kullanıcılara servis edilmesini önlemek için uygulama başlatılamadı." >&2
    exit 1
  fi
fi

echo "Uygulama başlatılıyor..."
exec node server.js
