// Shared "source of truth" for health card records.
//
// NOTE: this is a static module-level array, not a real backend or global
// store. HealthCards.jsx keeps its own useState copy (seeded from this) so
// admin staff can confirm pending cards interactively within that page.
// Permits.jsx reads this same initial array to compute compliance. Because
// there's no shared state management (Context/Redux/etc.) yet, edits made
// on the Health Cards screen won't be reflected on the Permits screen until
// you wire up a real shared store or backend — flagged here so it's not a
// surprise later.

export const INITIAL_HEALTH_CARDS = [
  // Business owners' own personal sanitary permit is backed by their personal health card
  {
    id: 1,
    cardNo: 'HC-2026-001',
    holder: 'R. Dela Cruz',
    type: 'Personal',
    establishment: null,
    issued: 'Jan 5, 2026',
    expires: 'Jan 5, 2027',
    status: 'Valid',
  },
  {
    id: 2,
    cardNo: 'HC-2026-006',
    holder: 'J. Reyes',
    type: 'Personal',
    establishment: null,
    issued: 'Jan 10, 2026',
    expires: 'Jan 10, 2027',
    status: 'Valid',
  },
  {
    id: 3,
    cardNo: 'HC-2026-009',
    holder: 'L. Khan',
    type: 'Personal',
    establishment: null,
    issued: 'Jan 5, 2025',
    expires: 'Jan 5, 2026',
    status: 'Expired',
  },
  {
    id: 4,
    cardNo: 'HC-2026-012',
    holder: 'C. Horil',
    type: 'Personal',
    establishment: null,
    issued: 'Feb 1, 2026',
    expires: 'Feb 1, 2027',
    status: 'Valid',
  },
  {
    id: 5,
    cardNo: 'HC-2026-016',
    holder: 'K. Bernardo',
    type: 'Personal',
    establishment: null,
    issued: 'Jan 20, 2026',
    expires: 'Jan 20, 2027',
    status: 'Valid',
  },

  // Jollibee San Carlos — fully compliant
  {
    id: 6,
    cardNo: 'HC-2026-002',
    holder: 'A. Santos',
    type: 'Employee',
    establishment: 'Jollibee San Carlos',
    issued: 'Jan 5, 2026',
    expires: 'Jan 5, 2027',
    status: 'Valid',
  },
  {
    id: 7,
    cardNo: 'HC-2026-003',
    holder: 'B. Cruz',
    type: 'Employee',
    establishment: 'Jollibee San Carlos',
    issued: 'Jan 5, 2026',
    expires: 'Jan 5, 2027',
    status: 'Valid',
  },
  {
    id: 8,
    cardNo: 'HC-2026-004',
    holder: 'C. Reyes',
    type: 'Employee',
    establishment: 'Jollibee San Carlos',
    issued: 'Jan 5, 2026',
    expires: 'Jan 5, 2027',
    status: 'Valid',
  },
  {
    id: 9,
    cardNo: 'HC-2026-005',
    holder: 'D. Torres',
    type: 'Employee',
    establishment: 'Jollibee San Carlos',
    issued: 'Jan 5, 2026',
    expires: 'Jan 5, 2027',
    status: 'Valid',
  },

  // Sunshine Eatery — one employee's card has expired
  {
    id: 10,
    cardNo: 'HC-2026-007',
    holder: 'E. Ramos',
    type: 'Employee',
    establishment: 'Sunshine Eatery',
    issued: 'Jan 10, 2026',
    expires: 'Jan 10, 2027',
    status: 'Valid',
  },
  {
    id: 11,
    cardNo: 'HC-2026-008',
    holder: 'F. Cruz',
    type: 'Employee',
    establishment: 'Sunshine Eatery',
    issued: 'Nov 1, 2024',
    expires: 'Nov 1, 2025',
    status: 'Expired',
  },

  // Pala Sizzler — one employee card still pending admin confirmation
  {
    id: 12,
    cardNo: 'HC-2026-010',
    holder: 'G. Domingo',
    type: 'Employee',
    establishment: 'Pala Sizzler',
    issued: 'May 20, 2026',
    expires: 'May 20, 2027',
    status: 'Pending Confirmation',
  },
  {
    id: 13,
    cardNo: 'HC-2026-011',
    holder: 'H. Alonzo',
    type: 'Employee',
    establishment: 'Pala Sizzler',
    issued: 'Jan 10, 2026',
    expires: 'Jan 10, 2027',
    status: 'Valid',
  },

  // Carmel's Restaurant — fully compliant
  {
    id: 14,
    cardNo: 'HC-2026-013',
    holder: 'I. Bautista',
    type: 'Employee',
    establishment: "Carmel's Restaurant",
    issued: 'Feb 1, 2026',
    expires: 'Feb 1, 2027',
    status: 'Valid',
  },
  {
    id: 15,
    cardNo: 'HC-2026-014',
    holder: 'J. Villanueva',
    type: 'Employee',
    establishment: "Carmel's Restaurant",
    issued: 'Feb 1, 2026',
    expires: 'Feb 1, 2027',
    status: 'Valid',
  },
  {
    id: 16,
    cardNo: 'HC-2026-015',
    holder: 'K. Manalo',
    type: 'Employee',
    establishment: "Carmel's Restaurant",
    issued: 'Feb 1, 2026',
    expires: 'Feb 1, 2027',
    status: 'Valid',
  },

  // Mang Inasal San Carlos — fully compliant
  {
    id: 17,
    cardNo: 'HC-2026-017',
    holder: 'L. Fernandez',
    type: 'Employee',
    establishment: 'Mang Inasal San Carlos',
    issued: 'Jan 20, 2026',
    expires: 'Jan 20, 2027',
    status: 'Valid',
  },
  {
    id: 18,
    cardNo: 'HC-2026-018',
    holder: 'M. Aquino',
    type: 'Employee',
    establishment: 'Mang Inasal San Carlos',
    issued: 'Jan 20, 2026',
    expires: 'Jan 20, 2027',
    status: 'Valid',
  },

  // Canton Station — compliant (1 employee on file, valid)
  {
    id: 19,
    cardNo: 'HC-2026-019',
    holder: 'N. Castro',
    type: 'Employee',
    establishment: 'Canton Station',
    issued: 'Mar 1, 2026',
    expires: 'Mar 1, 2027',
    status: 'Valid',
  },
];

/**
 * Compliance for a BUSINESS sanitary permit: every employee on file for this
 * establishment must have a "Valid" health card, and there must be at least
 * one employee card recorded.
 */
export function getBusinessCompliance(establishment, cards = INITIAL_HEALTH_CARDS) {
  const employeeCards = cards.filter(
    (c) => c.type === 'Employee' && c.establishment === establishment
  );
  const validCount = employeeCards.filter((c) => c.status === 'Valid').length;
  const compliant = employeeCards.length > 0 && validCount === employeeCards.length;
  return { compliant, total: employeeCards.length, validCount, cards: employeeCards };
}

/**
 * Compliance for a PERSONAL sanitary permit: the holder's own health card
 * must be "Valid".
 */
export function getPersonalCompliance(holder, cards = INITIAL_HEALTH_CARDS) {
  const card = cards.find((c) => c.type === 'Personal' && c.holder === holder);
  return { compliant: card?.status === 'Valid', card };
}
