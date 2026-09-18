-- CreateEnum
CREATE TYPE "JournalEntryType" AS ENUM ('FREE_REFLECTION', 'EVENT', 'EMOTION', 'DECISION', 'RELATIONSHIP', 'WORK', 'GOAL', 'STRESS', 'SUCCESS', 'CHALLENGE', 'OTHER');

-- CreateEnum
CREATE TYPE "JournalInsightType" AS ENUM ('ENTRY_REFLECTION', 'REPEATED_THEME', 'PROFILE_ALIGNMENT', 'CONTEXTUAL_VARIATION', 'DECISION_REFLECTION', 'EMOTIONAL_PATTERN_REFLECTION', 'GOAL_REFLECTION', 'LONGITUDINAL_CONTEXT_LINK', 'OPEN_QUESTION');

-- CreateEnum
CREATE TYPE "JournalEvidenceClass" AS ENUM ('USER_REPORTED_CONTEXT', 'OBSERVATIONAL_DATA', 'AI_REFLECTIVE_HYPOTHESIS', 'THEORETICAL_INTERPRETATION');

-- CreateEnum
CREATE TYPE "JournalRelationshipType" AS ENUM ('ALIGNED_WITH_MEASUREMENT', 'DIFFERS_FROM_MEASUREMENT', 'CONTEXTUAL_VARIATION', 'UNMEASURED_RELEVANT_AREA', 'NO_CLEAR_RELATION');

-- CreateEnum
CREATE TYPE "JournalRelationshipStrength" AS ENUM ('WEAK', 'MODERATE', 'STRONG');

-- CreateEnum
CREATE TYPE "JournalLifeEventType" AS ENUM ('JOB_CHANGE', 'RELOCATION', 'RELATIONSHIP_TRANSITION', 'MAJOR_GOAL', 'HIGH_STRESS_PERIOD', 'OTHER');

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" VARCHAR(255),
    "body" TEXT NOT NULL,
    "entryType" "JournalEntryType" NOT NULL DEFAULT 'FREE_REFLECTION',
    "moodSelfReport" INTEGER,
    "energySelfReport" INTEGER,
    "stressSelfReport" INTEGER,
    "contextTags" TEXT[],
    "userTags" TEXT[],
    "isLifeEvent" BOOLEAN NOT NULL DEFAULT false,
    "lifeEventType" "JournalLifeEventType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_insights" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "insightType" "JournalInsightType" NOT NULL,
    "evidenceClass" "JournalEvidenceClass" NOT NULL DEFAULT 'USER_REPORTED_CONTEXT',
    "summaryTr" TEXT NOT NULL,
    "reflectivePrompt" TEXT,
    "isFallback" BOOLEAN NOT NULL DEFAULT false,
    "engineVersion" TEXT NOT NULL DEFAULT 'v1.0.0',
    "promptVersion" TEXT,
    "provider" TEXT,
    "modelId" TEXT,
    "sourceContentHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journal_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_profile_relationships" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "relationshipType" "JournalRelationshipType" NOT NULL,
    "evidenceType" "JournalEvidenceClass" NOT NULL DEFAULT 'OBSERVATIONAL_DATA',
    "strength" "JournalRelationshipStrength" NOT NULL DEFAULT 'WEAK',
    "relatedFacetIds" TEXT[],
    "relatedConstructIds" TEXT[],
    "relatedDomainIds" TEXT[],
    "narrativeTr" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journal_profile_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "journal_entries_userId_createdAt_idx" ON "journal_entries"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "journal_entries_userId_entryType_idx" ON "journal_entries"("userId", "entryType");

-- CreateIndex
CREATE INDEX "journal_entries_userId_isLifeEvent_idx" ON "journal_entries"("userId", "isLifeEvent");

-- CreateIndex
CREATE INDEX "journal_entries_userId_deletedAt_createdAt_idx" ON "journal_entries"("userId", "deletedAt", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "journal_insights_entryId_idx" ON "journal_insights"("entryId");

-- CreateIndex
CREATE INDEX "journal_insights_userId_createdAt_idx" ON "journal_insights"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "journal_profile_relationships_entryId_idx" ON "journal_profile_relationships"("entryId");

-- CreateIndex
CREATE INDEX "journal_profile_relationships_relationshipType_idx" ON "journal_profile_relationships"("relationshipType");

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_insights" ADD CONSTRAINT "journal_insights_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "journal_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_insights" ADD CONSTRAINT "journal_insights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_profile_relationships" ADD CONSTRAINT "journal_profile_relationships_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "journal_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
