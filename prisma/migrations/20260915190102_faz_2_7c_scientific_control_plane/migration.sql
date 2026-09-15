-- AlterTable
ALTER TABLE "assessment_form_versions" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "isPublished" SET DEFAULT false;

-- AlterTable
ALTER TABLE "item_versions" ADD COLUMN     "authorType" TEXT,
ADD COLUMN     "deprecatedAt" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "sourceType" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "licenseStatus" SET DEFAULT 'UNKNOWN',
ALTER COLUMN "isActive" SET DEFAULT false;

-- CreateTable
CREATE TABLE "scientific_audit_events" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "actorUserId" TEXT,
    "targetEntityType" TEXT NOT NULL,
    "targetEntityId" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scientific_audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facet_validation_summaries" (
    "id" TEXT NOT NULL,
    "facetId" TEXT NOT NULL,
    "overallTurkishEvidenceLevel" TEXT NOT NULL DEFAULT 'NO_DIRECT',
    "overallStatus" TEXT NOT NULL DEFAULT 'NOT_ASSESSED',
    "measurementAlignmentLevel" TEXT NOT NULL DEFAULT 'NOT_APPLICABLE',
    "measurementInvarianceStatus" TEXT NOT NULL DEFAULT 'NOT_ASSESSED',
    "instrumentValidationEstablished" BOOLEAN NOT NULL DEFAULT false,
    "targetConstructInstrumentId" TEXT,
    "supportingEvidenceInstrumentId" TEXT,
    "sampleDescription" TEXT,
    "scientificNotes" TEXT,
    "humanVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "facet_validation_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facet_validation_study_evidences" (
    "id" TEXT NOT NULL,
    "validationSummaryId" TEXT NOT NULL,
    "sourceId" TEXT,
    "instrumentId" TEXT,
    "evidenceType" TEXT NOT NULL,
    "evidenceLevel" TEXT NOT NULL DEFAULT 'NO_DIRECT',
    "appliesToLevel" TEXT NOT NULL DEFAULT 'FACET',
    "measurementAlignmentLevel" TEXT NOT NULL DEFAULT 'NOT_APPLICABLE',
    "sampleN" INTEGER,
    "population" TEXT,
    "samplingMethod" TEXT,
    "doesNotEstablish" JSONB,
    "factorEvidenceLevel" TEXT,
    "factorEvidenceStatus" TEXT,
    "claimVerificationStatus" TEXT NOT NULL DEFAULT 'NOT_ASSESSED',
    "verificationMethod" TEXT,
    "humanVerified" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "facet_validation_study_evidences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facet_reliability_evidences" (
    "id" TEXT NOT NULL,
    "validationSummaryId" TEXT NOT NULL,
    "sourceId" TEXT,
    "instrumentId" TEXT,
    "metricType" TEXT NOT NULL,
    "metricName" TEXT,
    "value" DOUBLE PRECISION,
    "interval" TEXT,
    "location" TEXT,
    "evidenceLevel" TEXT NOT NULL DEFAULT 'NO_DIRECT',
    "claimVerificationStatus" TEXT NOT NULL DEFAULT 'NOT_ASSESSED',
    "humanVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "facet_reliability_evidences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scientific_audit_events_eventType_createdAt_idx" ON "scientific_audit_events"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "scientific_audit_events_targetEntityType_targetEntityId_idx" ON "scientific_audit_events"("targetEntityType", "targetEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "facet_validation_summaries_facetId_key" ON "facet_validation_summaries"("facetId");

-- CreateIndex
CREATE INDEX "facet_validation_study_evidences_validationSummaryId_idx" ON "facet_validation_study_evidences"("validationSummaryId");

-- CreateIndex
CREATE INDEX "facet_reliability_evidences_validationSummaryId_idx" ON "facet_reliability_evidences"("validationSummaryId");

-- CreateIndex
CREATE INDEX "assessment_form_versions_status_idx" ON "assessment_form_versions"("status");

-- CreateIndex
CREATE INDEX "item_versions_status_validationStatus_idx" ON "item_versions"("status", "validationStatus");

-- AddForeignKey
ALTER TABLE "scientific_audit_events" ADD CONSTRAINT "scientific_audit_events_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_validation_summaries" ADD CONSTRAINT "facet_validation_summaries_facetId_fkey" FOREIGN KEY ("facetId") REFERENCES "facets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_validation_summaries" ADD CONSTRAINT "facet_validation_summaries_targetConstructInstrumentId_fkey" FOREIGN KEY ("targetConstructInstrumentId") REFERENCES "instruments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_validation_summaries" ADD CONSTRAINT "facet_validation_summaries_supportingEvidenceInstrumentId_fkey" FOREIGN KEY ("supportingEvidenceInstrumentId") REFERENCES "instruments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_validation_summaries" ADD CONSTRAINT "facet_validation_summaries_verifiedByUserId_fkey" FOREIGN KEY ("verifiedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_validation_study_evidences" ADD CONSTRAINT "facet_validation_study_evidences_validationSummaryId_fkey" FOREIGN KEY ("validationSummaryId") REFERENCES "facet_validation_summaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_validation_study_evidences" ADD CONSTRAINT "facet_validation_study_evidences_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "scientific_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_validation_study_evidences" ADD CONSTRAINT "facet_validation_study_evidences_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "instruments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_reliability_evidences" ADD CONSTRAINT "facet_reliability_evidences_validationSummaryId_fkey" FOREIGN KEY ("validationSummaryId") REFERENCES "facet_validation_summaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_reliability_evidences" ADD CONSTRAINT "facet_reliability_evidences_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "scientific_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_reliability_evidences" ADD CONSTRAINT "facet_reliability_evidences_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "instruments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
