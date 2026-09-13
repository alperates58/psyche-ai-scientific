-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT NOT NULL,
    "isDemoUser" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domains" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameTr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descriptionTr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "color" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constructs" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "nameTr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descriptionTr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "constructs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facets" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "constructId" TEXT NOT NULL,
    "nameTr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descriptionTr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "facets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scientific_sources" (
    "id" TEXT NOT NULL,
    "shortKey" TEXT NOT NULL,
    "citation" TEXT NOT NULL,
    "year" INTEGER,
    "doi" TEXT,
    "url" TEXT,

    CONSTRAINT "scientific_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facet_scientific_sources" (
    "facetId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,

    CONSTRAINT "facet_scientific_sources_pkey" PRIMARY KEY ("facetId","sourceId")
);

-- CreateTable
CREATE TABLE "instruments" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT,
    "licenseType" TEXT NOT NULL,
    "licensingDecision" TEXT NOT NULL,
    "citation" TEXT,

    CONSTRAINT "instruments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facet_instruments" (
    "facetId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,

    CONSTRAINT "facet_instruments_pkey" PRIMARY KEY ("facetId","instrumentId")
);

-- CreateTable
CREATE TABLE "theory_lenses" (
    "id" TEXT NOT NULL,
    "lensId" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "theorist" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "primaryFocus" TEXT,

    CONSTRAINT "theory_lenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facet_theory_lenses" (
    "facetId" TEXT NOT NULL,
    "theoryLensId" TEXT NOT NULL,

    CONSTRAINT "facet_theory_lenses_pkey" PRIMARY KEY ("facetId","theoryLensId")
);

-- CreateTable
CREATE TABLE "theory_lens_scientific_sources" (
    "theoryLensId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,

    CONSTRAINT "theory_lens_scientific_sources_pkey" PRIMARY KEY ("theoryLensId","sourceId")
);

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "facetId" TEXT NOT NULL,
    "instrumentId" TEXT,
    "isKeyed" BOOLEAN NOT NULL DEFAULT true,
    "itemType" TEXT NOT NULL DEFAULT 'LIKERT_5',
    "isAttentionCheck" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_versions" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL DEFAULT 1,
    "promptTr" TEXT NOT NULL,
    "promptEn" TEXT NOT NULL,
    "validationStatus" TEXT NOT NULL DEFAULT 'RESEARCH_DRAFT',
    "licenseStatus" TEXT NOT NULL DEFAULT 'approved',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_version_options" (
    "id" TEXT NOT NULL,
    "itemVersionId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "labelTr" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "item_version_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_modules" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "titleTr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionTr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 15,

    CONSTRAINT "assessment_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_form_versions" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "versionCode" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "itemCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_form_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_form_items" (
    "id" TEXT NOT NULL,
    "formVersionId" TEXT NOT NULL,
    "itemVersionId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "assessment_form_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "formVersionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "totalDurationMs" INTEGER NOT NULL DEFAULT 0,
    "currentStep" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "assessment_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "response_records" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemVersionId" TEXT NOT NULL,
    "formItemId" TEXT NOT NULL,
    "selectedOptionVersionId" TEXT NOT NULL,
    "rawValue" INTEGER NOT NULL,
    "scoredValue" DOUBLE PRECISION NOT NULL,
    "revisionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "response_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "response_revisions" (
    "id" TEXT NOT NULL,
    "responseRecordId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "rawValue" INTEGER NOT NULL,
    "selectedOptionVersionId" TEXT NOT NULL,
    "durationMs" INTEGER,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "response_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "response_telemetry" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "responseRecordId" TEXT,
    "clientObservedDurationMs" INTEGER NOT NULL,
    "focusLostCount" INTEGER NOT NULL DEFAULT 0,
    "firstInteractionAt" TIMESTAMP(3),
    "serverReceivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "telemetryTrust" TEXT NOT NULL DEFAULT 'client_observed',

    CONSTRAINT "response_telemetry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "response_integrity_results" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "overallFlag" TEXT NOT NULL DEFAULT 'ACCEPTABLE',
    "speedViolations" INTEGER NOT NULL DEFAULT 0,
    "medianDurationMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "straightliningDetected" BOOLEAN NOT NULL DEFAULT false,
    "inconsistencyPairsCount" INTEGER NOT NULL DEFAULT 0,
    "inconsistencyViolations" INTEGER NOT NULL DEFAULT 0,
    "attentionCheckPassed" BOOLEAN NOT NULL DEFAULT true,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "response_integrity_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "norm_versions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNAVAILABLE',
    "isCalibrated" BOOLEAN NOT NULL DEFAULT false,
    "sampleSize" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "norm_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scoring_model_versions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL DEFAULT 'UNWEIGHTED_COMPOSITE_MEAN',
    "isPreCalibration" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scoring_model_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_snapshots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scoringModelVersionId" TEXT NOT NULL,
    "overallIntegrity" TEXT NOT NULL DEFAULT 'ACCEPTABLE',
    "provisionalComposite" DOUBLE PRECISION NOT NULL,
    "normStatus" TEXT NOT NULL DEFAULT 'UNAVAILABLE',
    "standardError" DOUBLE PRECISION,
    "ci95Lower" DOUBLE PRECISION,
    "ci95Upper" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_snapshot_sessions" (
    "profileSnapshotId" TEXT NOT NULL,
    "assessmentSessionId" TEXT NOT NULL,

    CONSTRAINT "profile_snapshot_sessions_pkey" PRIMARY KEY ("profileSnapshotId","assessmentSessionId")
);

-- CreateTable
CREATE TABLE "facet_scores" (
    "id" TEXT NOT NULL,
    "profileSnapshotId" TEXT NOT NULL,
    "facetId" TEXT NOT NULL,
    "rawMean" DOUBLE PRECISION NOT NULL,
    "itemCount" INTEGER NOT NULL,
    "standardError" DOUBLE PRECISION,
    "ci95Lower" DOUBLE PRECISION,
    "ci95Upper" DOUBLE PRECISION,
    "normVersionId" TEXT,

    CONSTRAINT "facet_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "construct_scores" (
    "id" TEXT NOT NULL,
    "profileSnapshotId" TEXT NOT NULL,
    "constructId" TEXT NOT NULL,
    "compositeScore" DOUBLE PRECISION NOT NULL,
    "facetCount" INTEGER NOT NULL,
    "standardError" DOUBLE PRECISION,
    "ci95Lower" DOUBLE PRECISION,
    "ci95Upper" DOUBLE PRECISION,
    "normVersionId" TEXT,

    CONSTRAINT "construct_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domain_scores" (
    "id" TEXT NOT NULL,
    "profileSnapshotId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "compositeScore" DOUBLE PRECISION NOT NULL,
    "constructCount" INTEGER NOT NULL,
    "standardError" DOUBLE PRECISION,
    "ci95Lower" DOUBLE PRECISION,
    "ci95Upper" DOUBLE PRECISION,
    "normVersionId" TEXT,

    CONSTRAINT "domain_scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "domains_code_key" ON "domains"("code");

-- CreateIndex
CREATE UNIQUE INDEX "constructs_code_key" ON "constructs"("code");

-- CreateIndex
CREATE UNIQUE INDEX "facets_code_key" ON "facets"("code");

-- CreateIndex
CREATE UNIQUE INDEX "scientific_sources_shortKey_key" ON "scientific_sources"("shortKey");

-- CreateIndex
CREATE UNIQUE INDEX "instruments_code_key" ON "instruments"("code");

-- CreateIndex
CREATE UNIQUE INDEX "theory_lenses_lensId_key" ON "theory_lenses"("lensId");

-- CreateIndex
CREATE UNIQUE INDEX "items_itemCode_key" ON "items"("itemCode");

-- CreateIndex
CREATE UNIQUE INDEX "item_versions_itemId_versionNumber_key" ON "item_versions"("itemId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "item_version_options_itemVersionId_value_key" ON "item_version_options"("itemVersionId", "value");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_modules_code_key" ON "assessment_modules"("code");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_form_versions_moduleId_versionCode_key" ON "assessment_form_versions"("moduleId", "versionCode");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_form_items_formVersionId_sortOrder_key" ON "assessment_form_items"("formVersionId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_form_items_formVersionId_itemVersionId_key" ON "assessment_form_items"("formVersionId", "itemVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "response_records_sessionId_formItemId_key" ON "response_records"("sessionId", "formItemId");

-- CreateIndex
CREATE UNIQUE INDEX "response_revisions_responseRecordId_sequence_key" ON "response_revisions"("responseRecordId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "norm_versions_code_key" ON "norm_versions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "scoring_model_versions_code_key" ON "scoring_model_versions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "facet_scores_profileSnapshotId_facetId_key" ON "facet_scores"("profileSnapshotId", "facetId");

-- CreateIndex
CREATE UNIQUE INDEX "construct_scores_profileSnapshotId_constructId_key" ON "construct_scores"("profileSnapshotId", "constructId");

-- CreateIndex
CREATE UNIQUE INDEX "domain_scores_profileSnapshotId_domainId_key" ON "domain_scores"("profileSnapshotId", "domainId");

-- AddForeignKey
ALTER TABLE "constructs" ADD CONSTRAINT "constructs_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "domains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facets" ADD CONSTRAINT "facets_constructId_fkey" FOREIGN KEY ("constructId") REFERENCES "constructs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_scientific_sources" ADD CONSTRAINT "facet_scientific_sources_facetId_fkey" FOREIGN KEY ("facetId") REFERENCES "facets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_scientific_sources" ADD CONSTRAINT "facet_scientific_sources_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "scientific_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_instruments" ADD CONSTRAINT "facet_instruments_facetId_fkey" FOREIGN KEY ("facetId") REFERENCES "facets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_instruments" ADD CONSTRAINT "facet_instruments_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "instruments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_theory_lenses" ADD CONSTRAINT "facet_theory_lenses_facetId_fkey" FOREIGN KEY ("facetId") REFERENCES "facets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_theory_lenses" ADD CONSTRAINT "facet_theory_lenses_theoryLensId_fkey" FOREIGN KEY ("theoryLensId") REFERENCES "theory_lenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theory_lens_scientific_sources" ADD CONSTRAINT "theory_lens_scientific_sources_theoryLensId_fkey" FOREIGN KEY ("theoryLensId") REFERENCES "theory_lenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theory_lens_scientific_sources" ADD CONSTRAINT "theory_lens_scientific_sources_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "scientific_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_facetId_fkey" FOREIGN KEY ("facetId") REFERENCES "facets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "instruments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_versions" ADD CONSTRAINT "item_versions_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_version_options" ADD CONSTRAINT "item_version_options_itemVersionId_fkey" FOREIGN KEY ("itemVersionId") REFERENCES "item_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_form_versions" ADD CONSTRAINT "assessment_form_versions_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "assessment_modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_form_items" ADD CONSTRAINT "assessment_form_items_formVersionId_fkey" FOREIGN KEY ("formVersionId") REFERENCES "assessment_form_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_form_items" ADD CONSTRAINT "assessment_form_items_itemVersionId_fkey" FOREIGN KEY ("itemVersionId") REFERENCES "item_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_sessions" ADD CONSTRAINT "assessment_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_sessions" ADD CONSTRAINT "assessment_sessions_formVersionId_fkey" FOREIGN KEY ("formVersionId") REFERENCES "assessment_form_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_records" ADD CONSTRAINT "response_records_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "assessment_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_records" ADD CONSTRAINT "response_records_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_records" ADD CONSTRAINT "response_records_itemVersionId_fkey" FOREIGN KEY ("itemVersionId") REFERENCES "item_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_records" ADD CONSTRAINT "response_records_formItemId_fkey" FOREIGN KEY ("formItemId") REFERENCES "assessment_form_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_records" ADD CONSTRAINT "response_records_selectedOptionVersionId_fkey" FOREIGN KEY ("selectedOptionVersionId") REFERENCES "item_version_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_revisions" ADD CONSTRAINT "response_revisions_responseRecordId_fkey" FOREIGN KEY ("responseRecordId") REFERENCES "response_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_revisions" ADD CONSTRAINT "response_revisions_selectedOptionVersionId_fkey" FOREIGN KEY ("selectedOptionVersionId") REFERENCES "item_version_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_telemetry" ADD CONSTRAINT "response_telemetry_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "assessment_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_telemetry" ADD CONSTRAINT "response_telemetry_responseRecordId_fkey" FOREIGN KEY ("responseRecordId") REFERENCES "response_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_integrity_results" ADD CONSTRAINT "response_integrity_results_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "assessment_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_snapshots" ADD CONSTRAINT "profile_snapshots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_snapshots" ADD CONSTRAINT "profile_snapshots_scoringModelVersionId_fkey" FOREIGN KEY ("scoringModelVersionId") REFERENCES "scoring_model_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_snapshot_sessions" ADD CONSTRAINT "profile_snapshot_sessions_profileSnapshotId_fkey" FOREIGN KEY ("profileSnapshotId") REFERENCES "profile_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_snapshot_sessions" ADD CONSTRAINT "profile_snapshot_sessions_assessmentSessionId_fkey" FOREIGN KEY ("assessmentSessionId") REFERENCES "assessment_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_scores" ADD CONSTRAINT "facet_scores_profileSnapshotId_fkey" FOREIGN KEY ("profileSnapshotId") REFERENCES "profile_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facet_scores" ADD CONSTRAINT "facet_scores_facetId_fkey" FOREIGN KEY ("facetId") REFERENCES "facets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "construct_scores" ADD CONSTRAINT "construct_scores_profileSnapshotId_fkey" FOREIGN KEY ("profileSnapshotId") REFERENCES "profile_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "construct_scores" ADD CONSTRAINT "construct_scores_constructId_fkey" FOREIGN KEY ("constructId") REFERENCES "constructs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domain_scores" ADD CONSTRAINT "domain_scores_profileSnapshotId_fkey" FOREIGN KEY ("profileSnapshotId") REFERENCES "profile_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domain_scores" ADD CONSTRAINT "domain_scores_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "domains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
