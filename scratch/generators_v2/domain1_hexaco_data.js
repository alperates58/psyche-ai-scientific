/**
 * DOMAIN 1: CORE PERSONALITY (HEXACO) — FULL 24 FACETS (120 ITEMS)
 * Complete blueprints and original items.
 */

const { DOMAIN_1_PART1 } = require('./domain1_hexaco_part1.js');
const { DOMAIN_1_PART2 } = require('./domain1_hexaco_part2.js');

const DOMAIN_1_DATA = {
  domainId: "core_personality",
  domainNameTr: "Temel Kişilik Boyutları (HEXACO)",
  domainNameEn: "Core Personality (HEXACO)",
  constructs: [...DOMAIN_1_PART1.constructs, ...DOMAIN_1_PART2.constructs]
};

module.exports = { DOMAIN_1_DATA };
