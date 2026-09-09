(function(window) {
  'use strict';

  const HISTORY_STORAGE_KEY = 'gst_verifier_invoice_history_v1';
  const MAX_HISTORY_ITEMS = 25;

  const HistoryService = {
  /**
   * Save a verified invoice record to local storage
   * @param {object} invoiceRecord
   * @returns {object} saved item
   */
  saveInvoice(invoiceRecord) {
    if (!invoiceRecord) return null;

    const history = this.getAllInvoices();
    const id = 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const timestamp = new Date().toISOString();

    const entry = {
      id,
      timestamp,
      invoiceDate: invoiceRecord.invoiceDate || '',
      invoiceNumber: invoiceRecord.invoiceNumber || '',
      sellerStateCode: invoiceRecord.sellerStateCode || '',
      buyerStateCode: invoiceRecord.buyerStateCode || '',
      sellerGstin: invoiceRecord.sellerGstin || '',
      buyerGstin: invoiceRecord.buyerGstin || '',
      items: invoiceRecord.items || [],
      grandTotal: (invoiceRecord.grandTotal !== undefined && invoiceRecord.grandTotal !== null)
        ? invoiceRecord.grandTotal
        : (invoiceRecord.invoiceGrandTotal || 0),
      verdict: invoiceRecord.verdict || invoiceRecord.report?.summary?.overallVerdict || 'VERIFIED',
      verdictTitle: invoiceRecord.verdictTitle || invoiceRecord.report?.summary?.verdictTitle || 'Verified',
      report: invoiceRecord.report || null
    };

    // Prepend new entry and cap at MAX_HISTORY_ITEMS
    history.unshift(entry);
    if (history.length > MAX_HISTORY_ITEMS) {
      history.length = MAX_HISTORY_ITEMS;
    }

    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }

    return entry;
  },

  /**
   * Get all saved invoice records
   * @returns {Array<object>}
   */
  getAllInvoices() {
    try {
      const data = localStorage.getItem(HISTORY_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.warn('LocalStorage read failed:', err);
      return [];
    }
  },

  /**
   * Get single invoice record by ID
   * @param {string} id
   * @returns {object|undefined}
   */
  getInvoiceById(id) {
    const list = this.getAllInvoices();
    return list.find(it => it.id === id);
  },

  /**
   * Delete single invoice by ID
   * @param {string} id
   * @returns {boolean}
   */
  deleteInvoice(id) {
    const list = this.getAllInvoices();
    const filtered = list.filter(it => it.id !== id);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (err) {
      return false;
    }
  },

  /**
   * Clear all invoice history
   */
  clearAll() {
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      return true;
    } catch (err) {
      return false;
    }
  },

  /**
   * Export all history records as JSON string
   * @returns {string}
   */
  exportToJSON() {
    const list = this.getAllInvoices();
    return JSON.stringify(list, null, 2);
  }
};

  // Expose on window for direct file:/// script loading
  if (typeof window !== 'undefined') {
    window.HistoryService = HistoryService;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HistoryService };
  }
})(typeof window !== 'undefined' ? window : this);
