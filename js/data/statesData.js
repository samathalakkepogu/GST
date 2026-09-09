(function(window) {
  'use strict';

  const INDIAN_STATES = [
  { code: '35', name: 'Andaman & Nicobar Islands', isUT: true, hasLegislature: false },
  { code: '37', name: 'Andhra Pradesh', isUT: false },
  { code: '12', name: 'Arunachal Pradesh', isUT: false },
  { code: '18', name: 'Assam', isUT: false },
  { code: '10', name: 'Bihar', isUT: false },
  { code: '04', name: 'Chandigarh', isUT: true, hasLegislature: false },
  { code: '22', name: 'Chhattisgarh', isUT: false },
  { code: '26', name: 'Dadra & Nagar Haveli and Daman & Diu', isUT: true, hasLegislature: false },
  { code: '07', name: 'Delhi', isUT: true, hasLegislature: true },
  { code: '30', name: 'Goa', isUT: false },
  { code: '24', name: 'Gujarat', isUT: false },
  { code: '06', name: 'Haryana', isUT: false },
  { code: '02', name: 'Himachal Pradesh', isUT: false },
  { code: '01', name: 'Jammu & Kashmir', isUT: true, hasLegislature: true },
  { code: '20', name: 'Jharkhand', isUT: false },
  { code: '29', name: 'Karnataka', isUT: false },
  { code: '32', name: 'Kerala', isUT: false },
  { code: '38', name: 'Ladakh', isUT: true, hasLegislature: false },
  { code: '31', name: 'Lakshadweep', isUT: true, hasLegislature: false },
  { code: '23', name: 'Madhya Pradesh', isUT: false },
  { code: '27', name: 'Maharashtra', isUT: false },
  { code: '14', name: 'Manipur', isUT: false },
  { code: '17', name: 'Meghalaya', isUT: false },
  { code: '15', name: 'Mizoram', isUT: false },
  { code: '13', name: 'Nagaland', isUT: false },
  { code: '21', name: 'Odisha', isUT: false },
  { code: '34', name: 'Puducherry', isUT: true, hasLegislature: true },
  { code: '03', name: 'Punjab', isUT: false },
  { code: '08', name: 'Rajasthan', isUT: false },
  { code: '11', name: 'Sikkim', isUT: false },
  { code: '33', name: 'Tamil Nadu', isUT: false },
  { code: '36', name: 'Telangana', isUT: false },
  { code: '16', name: 'Tripura', isUT: false },
  { code: '09', name: 'Uttar Pradesh', isUT: false },
  { code: '05', name: 'Uttarakhand', isUT: false },
  { code: '19', name: 'West Bengal', isUT: false },
  { code: '97', name: 'Other Territory', isUT: true, hasLegislature: false },
];

const StatesService = {
  /**
   * Get all states sorted alphabetically by name
   * @returns {Array<{code: string, name: string, isUT: boolean}>}
   */
  getAllStates() {
    return [...INDIAN_STATES].sort((a, b) => a.name.localeCompare(b.name));
  },

  /**
   * Find state by code or name
   * @param {string} query
   * @returns {object|undefined}
   */
  getState(query) {
    if (!query) return undefined;
    const q = query.trim().toLowerCase();
    return INDIAN_STATES.find(s => s.code === q || s.name.toLowerCase() === q);
  },

  /**
   * Determine GST Jurisdiction between Seller and Buyer
   * @param {string} sellerCode
   * @param {string} buyerCode
   * @returns {{
   *   isInterState: boolean,
   *   taxType: 'IGST' | 'CGST_SGST' | 'CGST_UTGST',
   *   label: string,
   *   explanation: string
   * }}
   */
  determineJurisdiction(sellerCode, buyerCode) {
    if (!sellerCode || !buyerCode) {
      return {
        isInterState: false,
        taxType: 'CGST_SGST',
        label: 'Select States to Determine Jurisdiction',
        explanation: 'Select both seller and buyer states to check whether CGST+SGST or IGST applies.'
      };
    }

    const seller = this.getState(sellerCode);
    const buyer = this.getState(buyerCode);

    if (!seller || !buyer) {
      return {
        isInterState: false,
        taxType: 'CGST_SGST',
        label: 'Unknown State',
        explanation: 'Invalid state selection.'
      };
    }

    // Inter-State transaction (Different States/UTs)
    if (seller.code !== buyer.code) {
      return {
        isInterState: true,
        taxType: 'IGST',
        label: 'Inter-State (IGST Applied)',
        explanation: `Seller in ${seller.name} and Buyer in ${buyer.name} represents an Inter-State supply. Integrated GST (IGST 100%) applies.`
      };
    }

    // Intra-State transaction (Same State or UT)
    if (seller.isUT && !seller.hasLegislature) {
      return {
        isInterState: false,
        taxType: 'CGST_UTGST',
        label: 'Intra-UT (CGST + UTGST)',
        explanation: `Both parties located within ${seller.name} (UT without legislature). Central GST (50%) + Union Territory GST (50%) applies.`
      };
    }

    return {
      isInterState: false,
      taxType: 'CGST_SGST',
      label: 'Intra-State (CGST + SGST)',
      explanation: `Both parties located within ${seller.name}. Central GST (50%) + State GST (50%) applies.`
    };
  },

  /**
   * Validate Indian GSTIN format, state code, entity type, and Modulo 36 Checksum
   * @param {string} gstin 15-character GSTIN string
   * @param {string} [expectedStateCode] Optional expected 2-digit state code
   * @returns {{
   *   isValid: boolean,
   *   gstin: string,
   *   stateCode: string,
   *   stateName: string,
   *   pan: string,
   *   entityType: string,
   *   isChecksumValid: boolean,
   *   isStateMatched: boolean,
   *   message: string,
   *   status: 'VALID' | 'WARNING' | 'INVALID'
   * }}
   */
  validateGSTIN(gstin, expectedStateCode = '') {
    if (!gstin || typeof gstin !== 'string') {
      return {
        isValid: false,
        gstin: '',
        stateCode: '',
        stateName: '',
        pan: '',
        entityType: '',
        isChecksumValid: false,
        isStateMatched: false,
        message: 'No GSTIN entered.',
        status: 'INVALID'
      };
    }

    const clean = gstin.trim().toUpperCase();

    // Regex check: 2 digits + 5 alpha + 4 digits + 1 alpha + 1 entity num/alpha + 'Z' + 1 check digit
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    const formatValid = regex.test(clean);

    if (clean.length !== 15 || !formatValid) {
      return {
        isValid: false,
        gstin: clean,
        stateCode: clean.slice(0, 2),
        stateName: '',
        pan: clean.slice(2, 12),
        entityType: '',
        isChecksumValid: false,
        isStateMatched: false,
        message: clean.length !== 15
          ? `GSTIN must be 15 characters (currently ${clean.length}).`
          : 'Invalid GSTIN structure. Expected format: 22AAAAA0000A1Z5',
        status: 'INVALID'
      };
    }

    const stateCode = clean.slice(0, 2);
    const pan = clean.slice(2, 12);
    const panFourthChar = pan[3];
    const stateObj = this.getState(stateCode);
    const stateName = stateObj ? stateObj.name : 'Unknown State';

    // Entity type mapping based on PAN 4th character
    const entityTypes = {
      'C': 'Company / Corporate',
      'P': 'Individual / Proprietorship',
      'F': 'Partnership Firm / LLP',
      'H': 'Hindu Undivided Family (HUF)',
      'A': 'Association of Persons (AOP)',
      'T': 'Trust',
      'B': 'Body of Individuals (BOI)',
      'L': 'Local Authority',
      'J': 'Artificial Juridical Person',
      'G': 'Government Agency'
    };
    const entityType = entityTypes[panFourthChar] || 'Registered Entity';

    // Calculate official GST Modulo 36 Checksum
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let sum = 0;

    for (let i = 0; i < 14; i++) {
      const charVal = chars.indexOf(clean[i]);
      if (charVal === -1) {
        sum = -1;
        break;
      }
      const factor = (i % 2 === 0) ? 1 : 2;
      const product = charVal * factor;
      const quotient = Math.floor(product / 36);
      const remainder = product % 36;
      sum += (quotient + remainder);
    }

    let isChecksumValid = false;
    let expectedCheckChar = '';
    if (sum >= 0) {
      const checkDigitIndex = (36 - (sum % 36)) % 36;
      expectedCheckChar = chars[checkDigitIndex];
      isChecksumValid = (clean[14] === expectedCheckChar);
    }

    // State match check
    let isStateMatched = true;
    if (expectedStateCode) {
      const expClean = String(expectedStateCode).padStart(2, '0');
      isStateMatched = (stateCode === expClean);
    }

    let status = 'VALID';
    let message = `Valid ${stateName} GSTIN (${entityType})`;

    if (!stateObj) {
      status = 'INVALID';
      message = `Invalid state code (${stateCode}) in GSTIN.`;
    } else if (!isStateMatched) {
      status = 'WARNING';
      const expObj = this.getState(expectedStateCode);
      message = `GSTIN is for ${stateName} (${stateCode}), but invoice selected ${expObj ? expObj.name : expectedStateCode}.`;
    } else if (!isChecksumValid) {
      status = 'WARNING';
      message = `Valid ${stateName} format, but checksum digit mismatch (possible typo).`;
    }

    return {
      isValid: Boolean(stateObj && formatValid),
      gstin: clean,
      stateCode,
      stateName,
      pan,
      entityType,
      isChecksumValid,
      isStateMatched,
      message,
      status
    };
  }
};

  // Expose on window for direct file:/// script loading
  if (typeof window !== 'undefined') {
    window.INDIAN_STATES = INDIAN_STATES;
    window.StatesService = StatesService;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { INDIAN_STATES, StatesService };
  }
})(typeof window !== 'undefined' ? window : this);

