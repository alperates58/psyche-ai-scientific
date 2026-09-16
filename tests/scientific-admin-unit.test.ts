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
  PublishFormVersionSchema,
} from '../src/actions/scientificAdminActions';
import {
  validateAssessmentFormForPublication,
} from '../src/lib/publicationValidator';
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
  // 2. STRICT ZOD SCHEMAS & INJECTION RESISTANCE
  // =========================================================
  describe('Strict Zod Validation Schemas', () => {
    it('validates CreateFormDraftSchema successfully and rejects extra injected fields', () => {
      const valid = CreateFormDraftSchema.safeParse({
        moduleId: 'mod_123',
        versionCode: 'v1.1.0-draft',
        description: 'New personality draft',
      });
      expect(valid.success).toBe(true);

      const injected = CreateFormDraftSchema.safeParse({
        moduleId: 'mod_123',
        versionCode: 'v1.1.0-draft',
        status: 'PUBLISHED', // Injected!
        isPublished: true, // Injected!
      });
      expect(injected.success).toBe(false);
    });

    it('rejects invalid characters in versionCode for CreateFormDraftSchema', () => {
      const invalid = CreateFormDraftSchema.safeParse({
        moduleId: 'mod_123',
        versionCode: 'v1.1.0 draft with spaces and <script>',
      });
      expect(invalid.success).toBe(false);
    });

    it('validates CloneFormDraftSchema and rejects unknown fields', () => {
      const valid = CloneFormDraftSchema.safeParse({
        sourceFormVersionId: 'form_source_1',
        newVersionCode: 'v2.0.0-draft',
        description: 'Cloned form',
      });
      expect(valid.success).toBe(true);

      const injected = CloneFormDraftSchema.safeParse({
        sourceFormVersionId: 'form_source_1',
        newVersionCode: 'v2.0.0-draft',
        isPublished: true, // Injected!
      });
      expect(injected.success).toBe(false);
    });

    it('validates CreateNewItemSchema and strictly rejects client-supplied authorType or lifecycle fields', () => {
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
        expect((valid.data as any).authorType).toBeUndefined(); // Must NOT be in payload
        expect(valid.data.itemType).toBe('LIKERT_5');
        expect(valid.data.isKeyed).toBe(false);
      }

      // Reject client authorType injection
      const injectedAuthor = CreateNewItemSchema.safeParse({
        facetId: 'facet_n1',
        itemCode: 'BIG5_NEO_N_99',
        isKeyed: false,
        promptTr: 'Sık sık endişelenirim.',
        promptEn: 'I worry often.',
        authorType: 'HUMAN_EXPERT', // Injected!
      });
      expect(injectedAuthor.success).toBe(false);

      // Reject lifecycle injection
      const injectedStatus = CreateNewItemSchema.safeParse({
        facetId: 'facet_n1',
        itemCode: 'BIG5_NEO_N_99',
        isKeyed: false,
        promptTr: 'Sık sık endişelenirim.',
        promptEn: 'I worry often.',
        status: 'ACTIVE', // Injected!
        validationStatus: 'VALIDATED', // Injected!
      });
      expect(injectedStatus.success).toBe(false);
    });

    it('validates CreateNewItemVersionSchema and strictly rejects client-supplied authorType or versionNumber', () => {
      const valid = CreateNewItemVersionSchema.safeParse({
        itemId: 'item_123',
        promptTr: 'Revize Türkçe metin.',
        promptEn: 'Revised English prompt.',
      });
      expect(valid.success).toBe(true);

      // Reject authorType injection
      const injectedAuthor = CreateNewItemVersionSchema.safeParse({
        itemId: 'item_123',
        promptTr: 'Revize Türkçe metin.',
        promptEn: 'Revised English prompt.',
        authorType: 'HUMAN_EXPERT', // Injected!
      });
      expect(injectedAuthor.success).toBe(false);

      // Reject versionNumber injection
      const injectedVerNum = CreateNewItemVersionSchema.safeParse({
        itemId: 'item_123',
        promptTr: 'Revize Türkçe metin.',
        promptEn: 'Revised English prompt.',
        versionNumber: 99, // Injected!
      });
      expect(injectedVerNum.success).toBe(false);
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

    it('validates ReorderFormItemsSchema requires at least one ID and rejects unknown fields', () => {
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

      const injected = ReorderFormItemsSchema.safeParse({
        formVersionId: 'form_123',
        orderedFormItemIds: ['item_1', 'item_2'],
        sortOrder: 1, // Injected!
      });
      expect(injected.success).toBe(false);
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

  // =========================================================
  // 6. PUBLISH & VERSION SAFETY (FAZ 2.7C-3)
  // =========================================================
  describe('FAZ 2.7C-3: Publish Form Version Safety & RBAC', () => {
    it('validates PublishFormVersionSchema and strictly rejects injection', () => {
      const valid = PublishFormVersionSchema.safeParse({
        formVersionId: 'form_123',
      });
      expect(valid.success).toBe(true);

      const injected = PublishFormVersionSchema.safeParse({
        formVersionId: 'form_123',
        status: 'PUBLISHED', // Injected!
        isPublished: true, // Injected!
      });
      expect(injected.success).toBe(false);
    });

    it('grants FORM_PUBLISH only to ADMIN and SUPER_ADMIN, denying USER, EXPERT_REVIEWER and RESEARCHER', () => {
      expect(hasPermission(['ADMIN'], 'FORM_PUBLISH')).toBe(true);
      expect(hasPermission(['SUPER_ADMIN'], 'FORM_PUBLISH')).toBe(true);
      expect(hasPermission(['USER'], 'FORM_PUBLISH')).toBe(false);
      expect(hasPermission(['EXPERT_REVIEWER'], 'FORM_PUBLISH')).toBe(false);
      expect(hasPermission(['RESEARCHER'], 'FORM_PUBLISH')).toBe(false);
    });
  });

  describe('FAZ 2.7C-3: Publication Validation Engine (validateAssessmentFormForPublication)', () => {
    const createMockForm = (overrides?: Partial<any>) => ({
      id: 'form_draft_1',
      versionCode: 'v1.1.0',
      status: 'DRAFT',
      isPublished: false,
      moduleId: 'mod_personality',
      module: {
        id: 'mod_personality',
        code: 'PERSONALITY',
        titleTr: 'Kişilik Değerlendirmesi',
      },
      items: [
        {
          id: 'fi_1',
          sortOrder: 1,
          itemVersionId: 'iv_1',
          itemVersion: {
            id: 'iv_1',
            versionNumber: 1,
            promptTr: 'Kendimi enerjik ve hayat dolu hissederim.',
            promptEn: 'I feel energetic and full of life.',
            status: 'DRAFT',
            validationStatus: 'VALIDATED',
            licenseStatus: 'PUBLIC_DOMAIN',
            options: [
              { value: 1, labelTr: 'Kesinlikle Katılmıyorum', sortOrder: 1 },
              { value: 2, labelTr: 'Katılmıyorum', sortOrder: 2 },
              { value: 3, labelTr: 'Kararsızım', sortOrder: 3 },
              { value: 4, labelTr: 'Katılıyorum', sortOrder: 4 },
              { value: 5, labelTr: 'Kesinlikle Katılıyorum', sortOrder: 5 },
            ],
            item: {
              id: 'item_1',
              itemCode: 'BIG5_E_01',
              itemType: 'LIKERT_5',
              isKeyed: true,
              isAttentionCheck: false,
              facet: {
                id: 'facet_e1',
                nameTr: 'Canlılık ve Coşku',
                construct: {
                  id: 'const_e',
                  nameTr: 'Dışadönüklük',
                  domain: {
                    id: 'dom_big5',
                    nameTr: 'Beş Faktör Kişilik',
                  },
                },
                validationSummary: {
                  overallTurkishEvidenceLevel: 'DIRECT',
                },
              },
              instrument: {
                id: 'inst_1',
                name: 'IPIP-NEO-TR',
                licensingDecision: 'verified',
              },
            },
          },
        },
      ],
      ...overrides,
    });

    it('returns publishable: true for a valid draft form', async () => {
      const mockTx = {
        assessmentFormVersion: {
          findUnique: async () => createMockForm(),
          findFirst: async () => ({
            id: 'form_published_old',
            versionCode: 'v1.0.0',
          }),
        },
      } as any;

      const result = await validateAssessmentFormForPublication('form_draft_1', mockTx);
      expect(result.publishable).toBe(true);
      expect(result.blockers.length).toBe(0);
      expect(result.details.existingPublishedFormId).toBe('form_published_old');
      expect(result.details.existingPublishedVersionCode).toBe('v1.0.0');
      expect(result.details.itemCount).toBe(1);
    });

    it('blocks publication if form is not found', async () => {
      const mockTx = {
        assessmentFormVersion: {
          findUnique: async () => null,
          findFirst: async () => null,
        },
      } as any;

      const result = await validateAssessmentFormForPublication('non_existent', mockTx);
      expect(result.publishable).toBe(false);
      expect(result.blockers.some((b) => b.includes('NOT_FOUND'))).toBe(true);
    });

    it('blocks publication if form is not DRAFT or already published', async () => {
      const mockTx = {
        assessmentFormVersion: {
          findUnique: async () =>
            createMockForm({ status: 'PUBLISHED', isPublished: true }),
          findFirst: async () => null,
        },
      } as any;

      const result = await validateAssessmentFormForPublication('form_draft_1', mockTx);
      expect(result.publishable).toBe(false);
      expect(result.blockers.some((b) => b.includes('FORM_NOT_DRAFT'))).toBe(true);
    });

    it('blocks publication if form has 0 items', async () => {
      const mockTx = {
        assessmentFormVersion: {
          findUnique: async () => createMockForm({ items: [] }),
          findFirst: async () => null,
        },
      } as any;

      const result = await validateAssessmentFormForPublication('form_draft_1', mockTx);
      expect(result.publishable).toBe(false);
      expect(result.blockers.some((b) => b.includes('EMPTY_FORM'))).toBe(true);
    });

    it('blocks publication if sortOrder is non-contiguous', async () => {
      const form = createMockForm();
      form.items.push({
        id: 'fi_2',
        sortOrder: 3, // Expected 2
        itemVersionId: 'iv_2',
        itemVersion: {
          ...form.items[0].itemVersion,
          id: 'iv_2',
          item: { ...form.items[0].itemVersion.item, id: 'item_2', itemCode: 'BIG5_E_02' },
        },
      });

      const mockTx = {
        assessmentFormVersion: {
          findUnique: async () => form,
          findFirst: async () => null,
        },
      } as any;

      const result = await validateAssessmentFormForPublication('form_draft_1', mockTx);
      expect(result.publishable).toBe(false);
      expect(result.blockers.some((b) => b.includes('SORT_ORDER_INCONSISTENCY'))).toBe(true);
    });

    it('blocks publication if duplicate item versions exist', async () => {
      const form = createMockForm();
      form.items.push({
        id: 'fi_2',
        sortOrder: 2,
        itemVersionId: 'iv_1', // Duplicate iv_1
        itemVersion: form.items[0].itemVersion,
      });

      const mockTx = {
        assessmentFormVersion: {
          findUnique: async () => form,
          findFirst: async () => null,
        },
      } as any;

      const result = await validateAssessmentFormForPublication('form_draft_1', mockTx);
      expect(result.publishable).toBe(false);
      expect(result.blockers.some((b) => b.includes('DUPLICATE_ITEM_VERSION'))).toBe(true);
    });

    it('blocks publication if item has REJECTED_PROPRIETARY license', async () => {
      const form = createMockForm();
      form.items[0].itemVersion.licenseStatus = 'REJECTED_PROPRIETARY';

      const mockTx = {
        assessmentFormVersion: {
          findUnique: async () => form,
          findFirst: async () => null,
        },
      } as any;

      const result = await validateAssessmentFormForPublication('form_draft_1', mockTx);
      expect(result.publishable).toBe(false);
      expect(result.blockers.some((b) => b.includes('LICENSE_REJECTED'))).toBe(true);
    });

    it('blocks publication if item has invalid Likert option count', async () => {
      const form = createMockForm();
      form.items[0].itemVersion.options = [
        { value: 1, labelTr: 'A', sortOrder: 1 },
        { value: 2, labelTr: 'B', sortOrder: 2 },
      ];

      const mockTx = {
        assessmentFormVersion: {
          findUnique: async () => form,
          findFirst: async () => null,
        },
      } as any;

      const result = await validateAssessmentFormForPublication('form_draft_1', mockTx);
      expect(result.publishable).toBe(false);
      expect(result.blockers.some((b) => b.includes('INVALID_OPTION_COUNT'))).toBe(true);
    });

    it('blocks publication if ontology chain is broken', async () => {
      const form = createMockForm();
      form.items[0].itemVersion.item.facet = null as any;

      const mockTx = {
        assessmentFormVersion: {
          findUnique: async () => form,
          findFirst: async () => null,
        },
      } as any;

      const result = await validateAssessmentFormForPublication('form_draft_1', mockTx);
      expect(result.publishable).toBe(false);
      expect(result.blockers.some((b) => b.includes('INVALID_ONTOLOGY_CHAIN'))).toBe(true);
    });

    it('generates non-blocking warnings for PRE_CALIBRATION status and NO_DIRECT evidence', async () => {
      const form = createMockForm();
      form.items[0].itemVersion.validationStatus = 'PRE_CALIBRATION';
      form.items[0].itemVersion.item.facet.validationSummary.overallTurkishEvidenceLevel = 'NO_DIRECT';

      const mockTx = {
        assessmentFormVersion: {
          findUnique: async () => form,
          findFirst: async () => null,
        },
      } as any;

      const result = await validateAssessmentFormForPublication('form_draft_1', mockTx);
      expect(result.publishable).toBe(true);
      expect(result.blockers.length).toBe(0);
      expect(result.warnings.some((w) => w.includes('PRE_CALIBRATION'))).toBe(true);
      expect(result.warnings.some((w) => w.includes('NO_DIRECT_EVIDENCE'))).toBe(true);
    });
  });
});

