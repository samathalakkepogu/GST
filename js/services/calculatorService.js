(function(window) {
  'use strict';

  /**
   * GST Calculator Service (calculatorService.js)
   * Supports Intra-State (CGST + SGST) and Inter-State (IGST) calculation modes
   * for both Exclusive (Add GST) and Inclusive (Remove GST) amounts.
   * Rounding rule: Standard 2 decimal places using Math.round((val) * 100) / 100.
   */
  const CalculatorService = {
    /**
     * Add GST to Exclusive Taxable Amount
     * @param {number} baseAmount - Taxable Amount
     * @param {number} ratePercent - GST Rate in percentage (e.g. 18)
     * @param {'intra'|'inter'} [transactionType='intra'] - 'intra' (Intra-State) or 'inter' (Inter-State)
     * @returns {{
     *   mode: 'add',
     *   transactionType: 'intra'|'inter',
     *   baseAmount: number,
     *   ratePercent: number,
     *   gstAmount: number,
     *   totalAmount: number,
     *   cgst: number,
     *   sgst: number,
     *   igst: number
     * }}
     */
    addGst(baseAmount, ratePercent, transactionType = 'intra') {
      const amount = Math.max(0, Number(baseAmount) || 0);
      const rate = Math.max(0, Number(ratePercent) || 0);
      const isInter = transactionType === 'inter';

      // Expected GST = Taxable Amount × GST Rate ÷ 100
      const rawGst = (amount * rate) / 100;
      const gstAmount = Math.round(rawGst * 100) / 100;
      const totalAmount = Math.round((amount + gstAmount) * 100) / 100;
      const halfGst = Math.round((gstAmount / 2) * 100) / 100;

      return {
        mode: 'add',
        transactionType: isInter ? 'inter' : 'intra',
        baseAmount: Math.round(amount * 100) / 100,
        ratePercent: rate,
        gstAmount: gstAmount,
        totalAmount: totalAmount,
        cgst: isInter ? 0 : halfGst,
        sgst: isInter ? 0 : (gstAmount - halfGst),
        igst: isInter ? gstAmount : 0
      };
    },

    /**
     * Remove GST from Inclusive total amount to find Base Taxable Amount
     * Formula: Base = Total / (1 + Rate/100)
     * @param {number} totalAmount - Total Amount inclusive of GST
     * @param {number} ratePercent - GST Rate in percentage (e.g. 18)
     * @param {'intra'|'inter'} [transactionType='intra'] - 'intra' or 'inter'
     * @returns {{
     *   mode: 'remove',
     *   transactionType: 'intra'|'inter',
     *   baseAmount: number,
     *   ratePercent: number,
     *   gstAmount: number,
     *   totalAmount: number,
     *   cgst: number,
     *   sgst: number,
     *   igst: number
     * }}
     */
    removeGst(totalAmount, ratePercent, transactionType = 'intra') {
      const total = Math.max(0, Number(totalAmount) || 0);
      const rate = Math.max(0, Number(ratePercent) || 0);
      const isInter = transactionType === 'inter';

      const rawBase = rate > 0 ? total / (1 + (rate / 100)) : total;
      const baseAmount = Math.round(rawBase * 100) / 100;
      const gstAmount = Math.round((total - baseAmount) * 100) / 100;
      const halfGst = Math.round((gstAmount / 2) * 100) / 100;

      return {
        mode: 'remove',
        transactionType: isInter ? 'inter' : 'intra',
        baseAmount: baseAmount,
        ratePercent: rate,
        gstAmount: gstAmount,
        totalAmount: Math.round(total * 100) / 100,
        cgst: isInter ? 0 : halfGst,
        sgst: isInter ? 0 : (gstAmount - halfGst),
        igst: isInter ? gstAmount : 0
      };
    }
  };

  // Expose on window for direct file:/// script loading
  if (typeof window !== 'undefined') {
    window.CalculatorService = CalculatorService;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CalculatorService };
  }
})(typeof window !== 'undefined' ? window : this);
