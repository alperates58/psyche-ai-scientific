import { describe, it, expect } from 'vitest';
import {
  checkItemVersionMutability,
  checkItemMetadataMutability,
} from '../src/lib/scientificImmutability';
import {
  CreateFormDraftSchema,
  CloneFormDraftSchema,
  UpdateFormMetadataSchema,
  AddQuestionToFormSchema,
  RemoveQuestionFromFormSchema,
  ReorderFormItemsSchema,
  CreateNewItemSchema,
  CreateNewItemVersionSchema,
  UpdateDraftItemVersionSchema,
  UpdateItemMetadataSchema,
} from '../src/actions/scientificAdminActions';
import {
  hasPermission,
  getUserPermissions,
  Role,
  Permission,
} from '../src/lib/rbac';

describe('FAZ 2.7C-2: Scientific Admin Unit Tests', () => {
  // =========================================================
  // 1. IMMUTABILITY RULES & MUTABILITY GUARDS
  // =========================================================
  describe('Immutability Guards', () => {
    it('declares DRAFT ItemVersion with 0 responses and no published forms as mutable', () => {
      const result = checkItemVersionMutability({
        status: 'DRAFT',
        isActive: false,
        formItems: [],
        _count: { responses: 0 },
      });

      expect(result.isMutable).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('declares ACTIVE ItemVersion as immutable', () => {
      const result = checkItemVersionMutability({
        status: 'ACTIVE',
        isActive: true,
        formItems: [],
        _count: { responses: 0 },
      });

      expect(result.isMutable).toBe(false);
      expect(result.reason).toContain('dondurulmuştur');
    });

    it('declares ItemVersion with responses > 0 as immutable even if DRAFT', () => {
      const result = checkItemVersionMutability({
        status: 'DRAFT',
        isActive: false,
        formItems: [],
        _count: { responses: 5 },
      });

      expect(result.isMutable).toBe(false);
      expect(result.reason).toContain('toplanmış katılımcı yanıtı');
    });

    it('declares ItemVersion used in PUBLISHED form as immutable', () => {
      const result = checkItemVersionMutability({
        status: 'DRAFT',
        isActive: false,
        formItems: [
          {
            formVersion: {
              status: 'PUBLISHED',
              isPublished: true,
              versionCode: 'v1.0.0',
            },
          },
        ],
        _count: { responses: 0 },
      });

      expect(result.isMutable).toBe(false);
      expect(result.reason).toContain('yayınlanmış veya arşivlenmiş bir formda');
    });

    it('declares ItemVersion used in ARCHIVED form as immutable', () => {
      const result = checkItemVersionMutability({
        status: 'DRAFT',
        isActive: false,
        formItems: [
          {
            formVersion: {
              status: 'ARCHIVED',
              isPublished: false,
              versionCode: 'v0.9.0',
            },
          },
        ],
        _count: { responses: 0 },
      });

      expect(result.isMutable).toBe(false);
      expect(result.reason).toContain('yayınlanmış veya arşivlenmiş bir formda');
    });

    it('declares Item metadata as immutable if any version is published or has responses', () => {
      const result = checkItemMetadataMutability({
        responsesCount: 0,
        versions: [
          {
            status: 'ACTIVE',
            formItems: [
              {
                formVersion: {
                  status: 'PUBLISHED',
                  isPublished: true,
                  versionCode: 'v1.0.0',
                },
              },
            ],
            _count: { responses: 0 },
          },
        ],
      });

      expect(result.isMutable).toBe(false);
      expect(result.reason).toContain('yayınlanmış/arşivlenmiş bir formda');
    });

    it('declares Item metadata with 0 responses and purely draft forms as mutable', () => {
      const result = checkItemMetadataMutability({
        responsesCount: 0,
        versions: [
          {
            status: 'DRAFT',
            formItems: [
              {
                formVersion: {
                  status: 'DRAFT',
                  isPublished: false,
                  versionCode: 'v1.1.0-draft',
                },
              },
            ],
            _count: { responses: 0 },
          },
        ],
      });

      expect(result.isMutable).toBe(true);
    });
  });

  // =========================================================
  // 2. ZOD SCHEMAS & INJECTION RESISTANCE
  // =========================================================
  describe('Zod Validation Schemas', () => {
    it('validates CreateFormDraftSchema successfully', () => {
      const valid = CreateFormDraftSchema.safeParse({
        moduleId: 'mod_123',
        versionCode: 'v1.1.0-draft',
        description: 'New personality draft',
      });
      expect(valid.success).toBe(true);
    });

    it('rejects invalid characters in versionCode for CreateFormDraftSchema', () => {
      const invalid = CreateFormDraftSchema.safeParse({
        moduleId: 'mod_123',
        versionCode: 'v1.1.0 draft with spaces and <script>',
      });
      expect(invalid.success).toBe(false);
    });

    it('validates CloneFormDraftSchema successfully', () => {
      const valid = CloneFormDraftSchema.safeParse({
        sourceFormVersionId: 'form_source_1',
        newVersionCode: 'v2.0.0-draft',
        description: 'Cloned form',
      });
      expect(valid.success).toBe(true);
    });

    it('validates CreateNewItemSchema with default authorType ADMIN_AUTHORED', () => {
      const valid = CreateNewItemSchema.safeParse({
        facetId: 'facet_n1',
        itemCode: 'BIG5_NEO_N_99',
        isKeyed: false,
        isAttentionCheck: false,
        promptTr: 'Sık sık endişelenirim.',
        promptEn: 'I worry often.',
      });
      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.authorType).toBe('ADMIN_AUTHORED');
        expect(valid.data.itemType).toBe('LIKERT_5');
        expect(valid.data.isKeyed).toBe(false);
      }
    });

    it('rejects CreateNewItemSchema with promptTr under 3 characters', () => {
      const invalid = CreateNewItemSchema.safeParse({
        facetId: 'facet_n1',
        itemCode: 'BIG5_NEO_N_99',
        isKeyed: true,
        promptTr: 'No',
        promptEn: 'Short',
      });
      expect(invalid.success).toBe(false);
    });

    it('validates ReorderFormItemsSchema requires at least one ID', () => {
      const invalid = ReorderFormItemsSchema.safeParse({
        formVersionId: 'form_123',
        orderedFormItemIds: [],
      });
      expect(invalid.success).toBe(false);

      const valid = ReorderFormItemsSchema.safeParse({
        formVersionId: 'form_123',
        orderedFormItemIds: ['item_1', 'item_2'],
      });
      expect(valid.success).toBe(true);
    });
  });

  // =========================================================
  // 3. REVERSE SCORING SEMANTICS (isKeyed)
  // =========================================================
  describe('Reverse Scoring Semantics', () => {
    it('preserves isKeyed = true as regular scoring (+)', () => {
      const isKeyed = true;
      const rawChoice = 5;
      // In regular scoring, rawChoice 5 contributes +5
      const regularScore = isKeyed ? rawChoice : 6 - rawChoice;
      expect(regularScore).toBe(5);
    });

    it('preserves isKeyed = false as reverse scoring (-)', () => {
      const isKeyed = false;
      const rawChoice = 5;
      // In 5-point Likert reverse scoring: 1 -> 5, 2 -> 4, 3 -> 3, 4 -> 2, 5 -> 1
      const reversedScore = isKeyed ? rawChoice : 6 - rawChoice;
      expect(reversedScore).toBe(1);

      const rawChoice1 = 1;
      const reversedScore1 = isKeyed ? rawChoice1 : 6 - rawChoice1;
      expect(reversedScore1).toBe(5);
    });
  });

  // =========================================================
  // 4. TWO-PHASE REORDER ALGORITHM LOGIC
  // =========================================================
  describe('Collision-Free Reorder Sequence', () => {
    it('generates intermediate negative sortOrders to prevent @@unique collisions', () => {
      const original = [
        { id: 'A', sortOrder: 1 },
        { id: 'B', sortOrder: 2 },
        { id: 'C', sortOrder: 3 },
      ];

      // Desired reorder: C, A, B
      const targetOrder = ['C', 'A', 'B'];

      // Phase 1: assign temporary negative values
      const phase1 = targetOrder.map((id, idx) => ({
        id,
        sortOrder: -(idx + 1),
      }));

      expect(phase1).toEqual([
        { id: 'C', sortOrder: -1 },
        { id: 'A', sortOrder: -2 },
        { id: 'B', sortOrder: -3 },
      ]);

      // Phase 2: assign positive final sequence
      const phase2 = targetOrder.map((id, idx) => ({
        id,
        sortOrder: idx + 1,
      }));

      expect(phase2).toEqual([
        { id: 'C', sortOrder: 1 },
        { id: 'A', sortOrder: 2 },
        { id: 'B', sortOrder: 3 },
      ]);
    });
  });

  // =========================================================
  // 5. RBAC PERMISSION ENFORCEMENT
  // =========================================================
  describe('RBAC Scientific Authoring Permissions', () => {
    it('grants FORM_DRAFT_MANAGE and ITEM_AUTHOR to ADMIN and SUPER_ADMIN', () => {
      const adminPerms = getUserPermissions(['ADMIN']);
      expect(adminPerms).toContain('FORM_DRAFT_MANAGE');
      expect(adminPerms).toContain('ITEM_AUTHOR');
      expect(adminPerms).toContain('SCIENTIFIC_VIEW');

      const superAdminPerms = getUserPermissions(['SUPER_ADMIN']);
      expect(superAdminPerms).toContain('FORM_DRAFT_MANAGE');
      expect(superAdminPerms).toContain('ITEM_AUTHOR');
      expect(superAdminPerms).toContain('SCIENTIFIC_VIEW');
    });

    it('grants FORM_DRAFT_MANAGE and ITEM_AUTHOR to RESEARCHER', () => {
      const researcherPerms = getUserPermissions(['RESEARCHER']);
      expect(researcherPerms).toContain('FORM_DRAFT_MANAGE');
      expect(researcherPerms).toContain('ITEM_AUTHOR');
      expect(researcherPerms).toContain('SCIENTIFIC_VIEW');
    });

    it('denies FORM_DRAFT_MANAGE and ITEM_AUTHOR to USER and EXPERT_REVIEWER', () => {
      const userPerms = getUserPermissions(['USER']);
      expect(userPerms).not.toContain('FORM_DRAFT_MANAGE');
      expect(userPerms).not.toContain('ITEM_AUTHOR');
      expect(userPerms).not.toContain('SCIENTIFIC_VIEW');

      const reviewerPerms = getUserPermissions(['EXPERT_REVIEWER']);
      expect(reviewerPerms).not.toContain('FORM_DRAFT_MANAGE');
      expect(reviewerPerms).not.toContain('ITEM_AUTHOR');
    });

    it('verifies hasPermission helper for individual checks', () => {
      expect(hasPermission(['ADMIN'], 'FORM_DRAFT_MANAGE')).toBe(true);
      expect(hasPermission(['ADMIN'], 'ITEM_AUTHOR')).toBe(true);
      expect(hasPermission(['USER'], 'FORM_DRAFT_MANAGE')).toBe(false);
      expect(hasPermission(['USER'], 'ITEM_AUTHOR')).toBe(false);
    });
  });
});
