(function(window) {
  'use strict';

  const Formatters = {
  /**
   * Format number as Indian Currency (INR / ₹)
   * Example: 1000 -> ₹1,000.00, 100000 -> ₹1,00,000.00
   * @param {number|string} amount
   * @param {boolean} includeDecimals
   * @returns {string}
   */
  formatINR(amount, includeDecimals = true) {
    if (amount === null || amount === undefined || isNaN(Number(amount))) {
      return '₹0.00';
    }

    const num = Number(amount);
    const options = {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: includeDecimals ? 2 : 0,
      minimumFractionDigits: includeDecimals ? 2 : 0,
    };

    return new Intl.NumberFormat('en-IN', options).format(num);
  },

  /**
   * Format percentage string
   * Example: 18 -> 18%
   * @param {number|string} rate
   * @returns {string}
   */
  formatPercent(rate) {
    if (rate === null || rate === undefined || isNaN(Number(rate))) {
      return '0%';
    }
    return `${Number(rate)}%`;
  },

  /**
   * Get current date in DD/MM/YYYY format
   * @returns {string}
   */
  getTodayIndianDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  },

  /**
   * Format ISO date string (YYYY-MM-DD) to Indian Display format (DD/MM/YYYY)
   * @param {string} dateString
   * @returns {string}
   */
  formatDateToIndian(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
    return dateString;
  },

  /**
   * Parse Indian date (DD/MM/YYYY or DD-MM-YYYY) into ISO YYYY-MM-DD
   * @param {string} dateString
   * @returns {string}
   */
  parseIndianDateToISO(dateString) {
    if (!dateString) return '';
    const cleanStr = dateString.trim().replace(/[-.]/g, '/');
    const parts = cleanStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (year.length === 4 && day.length <= 2 && month.length <= 2) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    return dateString;
  },

  /**
   * Validate if a string is a valid DD/MM/YYYY date
   * @param {string} dateString
   * @returns {boolean}
   */
  isValidIndianDate(dateString) {
    if (!dateString) return false;
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.trim().match(regex);
    if (!match) return false;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    if (year < 2017 || year > 2099) return false; // GST effective from 01/07/2017
    if (month < 1 || month > 12) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    return day >= 1 && day <= daysInMonth;
  },

  /**
   * Auto-format user typing into DD/MM/YYYY format with slashes
   * @param {string} value
   * @returns {string}
   */
  formatDateInputMask(value) {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
  },

  /**
   * Sanitize numeric input (strips commas, currency symbols, spaces)
   * @param {string|number} val
   * @returns {number}
   */
  cleanNumber(val) {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.-]+/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
};

  // Expose on window for direct file:/// script loading
  if (typeof window !== 'undefined') {
    window.Formatters = Formatters;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Formatters };
  }
})(typeof window !== 'undefined' ? window : this);

