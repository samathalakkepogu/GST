/**
 * GST Invoice Verifier Engine (verifierService.js)
 * 
 * Primary Purpose:
 * Checks whether the GST amount shown on an invoice mathematically matches
 * the taxable amount, GST rate, and transaction type entered by the user.
 * 
 * Rounding Rule:
 * All calculations and comparisons use standard 2-decimal currency rounding:
 * Math.round(value * 100) / 100
 * A standard tolerance of ±₹0.50 is accepted for rounding precision differences.
 * 
 * Legal Disclaimer:
 * Informational calculation-verification tool only. Does not claim complete legal compliance.
 */

(function(window) {
  'use strict';

  const VerifierService = {
    /**
     * Standard 2-decimal rounding helper
     * @param {number} val
     * @returns {number}
     */
    round2(val) {
      return Math.round((Number(val) || 0) * 100) / 100;
    },

    /**
     * Main entry point to verify an invoice mathematically
     * @param {{
     *   invoiceDate?: string,
     *   invoiceNumber?: string,
     *   sellerStateCode: string,
     *   buyerStateCode: string,
     *   sellerGstin?: string,
     *   buyerGstin?: string,
     *   items: Array<{
     *     name?: string,
     *     hsnSac?: string,
     *     quantity?: number,
     *     unit?: string,
     *     unitPrice?: number,
     *     taxableAmount: number,
     *     invoiceGstRate: number,
     *     invoiceGstAmount: number
     *   }>,
     *   invoiceGrandTotal?: number | null
     * }} invoiceData
     * @returns {object} Comprehensive verification report
     */
    verifyInvoice(invoiceData) {
      if (!invoiceData || !Array.isArray(invoiceData.items) || invoiceData.items.length === 0) {
        return {
          status: 'ERROR',
          message: 'Please enter all required invoice details to verify the GST calculation.'
        };
      }

      const {
        invoiceDate = '',
        invoiceNumber = '',
        sellerStateCode = '',
        buyerStateCode = '',
        sellerGstin = '',
        buyerGstin = '',
        items = [],
        invoiceGrandTotal = null
      } = invoiceData;

      const statesService = window.StatesService || {};

      // 1. Determine Transaction Type (Intra-State vs Inter-State)
      let jurisdiction = {
        isInterState: false,
        taxType: 'CGST_SGST',
        label: 'Intra-State (CGST + SGST)',
        sellerStateName: '',
        buyerStateName: ''
      };

      if (statesService.determineJurisdiction && sellerStateCode && buyerStateCode) {
        jurisdiction = statesService.determineJurisdiction(sellerStateCode, buyerStateCode);
      } else if (sellerStateCode && buyerStateCode) {
        const isInter = String(sellerStateCode).trim() !== String(buyerStateCode).trim();
        jurisdiction = {
          isInterState: isInter,
          taxType: isInter ? 'IGST' : 'CGST_SGST',
          label: isInter ? 'Inter-State (IGST)' : 'Intra-State (CGST + SGST)'
        };
      }

      const sellerObj = statesService.getState ? statesService.getState(sellerStateCode) : null;
      const buyerObj = statesService.getState ? statesService.getState(buyerStateCode) : null;
      jurisdiction.sellerStateName = sellerObj ? sellerObj.name : (sellerStateCode ? `State Code ${sellerStateCode}` : '');
      jurisdiction.buyerStateName = buyerObj ? buyerObj.name : (buyerStateCode ? `State Code ${buyerStateCode}` : '');
      jurisdiction.sellerStateCode = sellerStateCode;
      jurisdiction.buyerStateCode = buyerStateCode;

      // 1b. Validate GSTINs if provided
      let sellerGstinReport = null;
      let buyerGstinReport = null;
      if (sellerGstin && statesService.validateGSTIN) {
        sellerGstinReport = statesService.validateGSTIN(sellerGstin, sellerStateCode);
      }
      if (buyerGstin && statesService.validateGSTIN) {
        buyerGstinReport = statesService.validateGSTIN(buyerGstin, buyerStateCode);
      }

      // 2. Mathematically verify each line item
      let totalTaxable = 0;
      let totalInvoiceGst = 0;
      let totalExpectedGst = 0;
      const verifiedItems = [];

      for (let i = 0; i < items.length; i++) {
        const itemReport = this.verifyLineItem(items[i], jurisdiction, i + 1);
        verifiedItems.push(itemReport);

        totalTaxable += itemReport.taxableAmount;
        totalInvoiceGst += itemReport.invoiceGstAmount;
        totalExpectedGst += itemReport.expectedGst;
      }

      totalTaxable = this.round2(totalTaxable);
      totalInvoiceGst = this.round2(totalInvoiceGst);
      totalExpectedGst = this.round2(totalExpectedGst);

      // 3. Difference between Total Expected GST and Total Invoice GST Charged
      const gstDifference = this.round2(Math.abs(totalInvoiceGst - totalExpectedGst));
      const hasItemMismatch = verifiedItems.some(it => it.calculationCheck.status === 'MISMATCH');
      const isGstMathMatch = !hasItemMismatch && gstDifference <= 0.50; // 50 paise tolerance for rounding

      // 4. Grand Total Verification
      const expectedGrandTotal = this.round2(totalTaxable + totalExpectedGst);
      const computedInvoiceGrandTotal = this.round2(totalTaxable + totalInvoiceGst);
      let totalCheck = {
        status: 'MATCH',
        expectedTotal: expectedGrandTotal,
        invoiceTotal: computedInvoiceGrandTotal,
        difference: 0,
        note: 'Grand total is mathematically calculated from taxable amount and GST.'
      };

      if (invoiceGrandTotal !== undefined && invoiceGrandTotal !== null && !isNaN(invoiceGrandTotal) && Number(invoiceGrandTotal) > 0) {
        const enteredTotal = this.round2(Number(invoiceGrandTotal));
        const grandDiff = this.round2(Math.abs(enteredTotal - computedInvoiceGrandTotal));
        totalCheck.invoiceTotal = enteredTotal;
        totalCheck.difference = grandDiff;

        if (grandDiff <= 1.00) {
          totalCheck.status = 'MATCH';
          totalCheck.note = grandDiff > 0
            ? `Invoice grand total matches within standard ₹${grandDiff.toFixed(2)} rounding tolerance.`
            : 'Invoice grand total matches taxable amount + GST charged.';
        } else {
          totalCheck.status = 'MISMATCH';
          totalCheck.note = `Discrepancy of ₹${grandDiff.toFixed(2)} found between sum of items (₹${computedInvoiceGrandTotal.toFixed(2)}) and entered invoice grand total (₹${enteredTotal.toFixed(2)}).`;
        }
      }

      // 5. Overall Result Message
      let overallVerdict = isGstMathMatch ? 'MATCH' : 'MISMATCH';
      let verdictTitle = isGstMathMatch ? 'GST calculation matches' : 'Possible GST calculation mismatch';
      let verdictMessage = isGstMathMatch
        ? 'GST calculation matches the entered invoice details.'
        : 'Possible GST calculation mismatch. Please compare the expected GST with the amount shown on the invoice.';
      let verdictBadge = isGstMathMatch ? 'success' : 'warning';

      return {
        invoiceDate,
        invoiceNumber,
        jurisdiction,
        sellerGstinReport,
        buyerGstinReport,
        items: verifiedItems,
        summary: {
          totalTaxable,
          totalInvoiceGst,
          totalExpectedGst,
          gstDifference,
          expectedGrandTotal,
          invoiceGrandTotal: totalCheck.invoiceTotal,
          totalCheck,
          overallVerdict,
          verdictTitle,
          verdictMessage,
          verdictBadge,
          transactionTypeLabel: jurisdiction.isInterState ? 'Inter-State' : 'Intra-State'
        }
      };
    },

    /**
     * Verify an individual line item mathematically
     * Expected GST = Taxable Amount × GST Rate ÷ 100
     * @param {object} item
     * @param {object} jurisdiction
     * @param {number} itemNumber
     * @returns {object}
     */
    verifyLineItem(item, jurisdiction, itemNumber = 1) {
      const quantity = Math.max(1, parseFloat(item.quantity) || 1);
      const unit = (item.unit || 'Pcs').trim();
      let taxableAmount = this.round2(parseFloat(item.taxableAmount) || 0);
      let unitPrice = parseFloat(item.unitPrice);

      if (isNaN(unitPrice) || unitPrice <= 0) {
        unitPrice = this.round2(taxableAmount / quantity);
      } else if (taxableAmount <= 0) {
        taxableAmount = this.round2(quantity * unitPrice);
      }

      const invoiceGstRate = Math.max(0, this.round2(parseFloat(item.invoiceGstRate) || 0));
      const invoiceGstAmount = Math.max(0, this.round2(parseFloat(item.invoiceGstAmount) || 0));
      const productName = (item.name || '').trim() || `Item #${itemNumber}`;
      const hsnSac = (item.hsnSac || '').trim();

      // Independent Mathematical Calculation: Expected GST = Taxable Amount × GST Rate ÷ 100
      const rawExpectedGst = (taxableAmount * invoiceGstRate) / 100;
      const expectedGst = this.round2(rawExpectedGst);
      const mathDiff = this.round2(Math.abs(invoiceGstAmount - expectedGst));
      const isMathCorrect = mathDiff <= 0.50; // 50 paise standard rounding tolerance

      const isInter = Boolean(jurisdiction && jurisdiction.isInterState);
      const halfGst = this.round2(expectedGst / 2);

      const calculationCheck = {
        status: isMathCorrect ? 'MATCH' : 'MISMATCH',
        expectedGst: expectedGst,
        invoiceGst: invoiceGstAmount,
        difference: mathDiff,
        note: isMathCorrect
          ? 'GST amount matches mathematical calculation on taxable amount.'
          : `Expected GST is ₹${expectedGst.toFixed(2)}, but invoice charged ₹${invoiceGstAmount.toFixed(2)} (Difference: ₹${mathDiff.toFixed(2)}).`
      };

      const taxBreakdown = {
        isInterState: isInter,
        taxType: isInter ? 'IGST' : 'CGST_SGST',
        label: isInter ? 'Inter-State (IGST 100%)' : 'Intra-State (CGST 50% + SGST 50%)',
        expectedCgst: isInter ? 0 : halfGst,
        expectedSgst: isInter ? 0 : this.round2(expectedGst - halfGst),
        expectedIgst: isInter ? expectedGst : 0
      };

      return {
        itemNumber,
        productName,
        hsnSac: hsnSac || 'Not specified',
        quantity,
        unit,
        unitPrice,
        taxableAmount,
        invoiceGstRate,
        invoiceGstAmount,
        itemTotal: this.round2(taxableAmount + invoiceGstAmount),
        expectedGst,
        expectedItemTotal: this.round2(taxableAmount + expectedGst),
        difference: mathDiff,
        calculationCheck,
        taxBreakdown
      };
    }
  };

  // Expose on window for direct script loading
  if (typeof window !== 'undefined') {
    window.VerifierService = VerifierService;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VerifierService };
  }
})(typeof window !== 'undefined' ? window : this);
