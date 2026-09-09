(function(window) {
  'use strict';

  // References to global services
  const formatters = typeof Formatters !== 'undefined' ? Formatters : (window.Formatters || {});
  const statesService = typeof StatesService !== 'undefined' ? StatesService : (window.StatesService || {});
  const verifierService = typeof VerifierService !== 'undefined' ? VerifierService : (window.VerifierService || {});
  const calculatorService = typeof CalculatorService !== 'undefined' ? CalculatorService : (window.CalculatorService || {});
  const historyService = typeof HistoryService !== 'undefined' ? HistoryService : (window.HistoryService || {});
  const uiComponents = typeof UIComponents !== 'undefined' ? UIComponents : (window.UIComponents || {});

  class App {
    constructor() {
      this.currentView = 'verifier'; // 'verifier' | 'calculator'
      this.itemCounter = 1;
      this.calcMode = 'exclusive'; // 'exclusive' (Without GST) | 'inclusive' (With GST)
      this.calcTransactionType = 'intra'; // 'intra' | 'inter'
      this.calcRate = 18;
      this.init();
    }

    init() {
      this.setupViewTabs();
      this.setupDateInputHandlers();
      this.populateStateDropdowns();
      this.setupJurisdictionListeners();
      this.setupGstinListeners();
      this.setupItemManagement();
      this.setupVerificationTrigger();
      this.setupCalculator();
      this.setupHistoryHandlers();
      this.setupResetButtons();
      this.updateHistoryBadge();
      console.log('GST Verifier & Calculator initialized successfully.');
    }

    // =========================================================================
    // NAVIGATION & TAB SWITCHING
    // =========================================================================

    /**
     * Setup Navigation Tabs (GST Verifier vs GST Calculator)
     */
    setupViewTabs() {
      const tabButtons = document.querySelectorAll('.tab-btn[data-view]');
      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetView = btn.dataset.view;
          this.switchView(targetView);
        });
      });
    }

    /**
     * Switch between Verifier and Calculator views
     * @param {'verifier'|'calculator'} targetView
     */
    switchView(targetView) {
      this.currentView = targetView;

      document.querySelectorAll('.tab-btn[data-view]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === targetView);
      });

      document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `view-${targetView}`);
      });

      const heroTitle = document.getElementById('hero-title');
      const heroSubtitle = document.getElementById('hero-subtitle');

      if (targetView === 'verifier') {
        if (heroTitle) heroTitle.innerHTML = '<span class="highlight">GST Invoice Verifier</span>';
        if (heroSubtitle) heroSubtitle.textContent = 'VERIFY YOUR INVOICE GST CALCULATIONS';
      } else if (targetView === 'calculator') {
        if (heroTitle) heroTitle.innerHTML = '<span class="highlight">GST Calculator</span>';
        if (heroSubtitle) heroSubtitle.textContent = 'CALCULATE GST QUICKLY AND ACCURATELY';
      }

      const mainContainer = document.querySelector('.main-content');
      if (mainContainer) {
        mainContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // =========================================================================
    // INVOICE INFORMATION, DATEPICKER & JURISDICTION
    // =========================================================================

    /**
     * Setup interactive calendar datepicker (DD/MM/YYYY)
     */
    setupDateInputHandlers() {
      const dateInput = document.getElementById('invoice-date');
      const btnTrigger = document.getElementById('btn-calendar-trigger');
      const calendarPopup = document.getElementById('custom-calendar-popup');
      const fmt = window.Formatters || formatters;

      let calViewYear = new Date().getFullYear();
      let calViewMonth = new Date().getMonth();

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const parseCurrentInputDate = () => {
        const val = (dateInput?.value || '').trim();
        const parts = val.replace(/[-.]/g, '/').split('/');
        if (parts.length === 3) {
          const d = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const y = parseInt(parts[2], 10);
          if (!isNaN(d) && !isNaN(m) && !isNaN(y) && y >= 1970 && y <= 2099 && m >= 0 && m <= 11) {
            return { day: d, month: m, year: y };
          }
        }
        const now = new Date();
        return { day: now.getDate(), month: now.getMonth(), year: now.getFullYear() };
      };

      const renderCalendar = (year, month) => {
        if (!calendarPopup) return;

        const selected = parseCurrentInputDate();
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

        const minYear = Math.min(2015, year, selected.year);
        const maxYear = Math.max(2035, year, selected.year);

        const monthOptions = monthNames.map((name, idx) =>
          `<option value="${idx}" ${idx === month ? 'selected' : ''}>${name}</option>`
        ).join('');

        let yearOptions = '';
        for (let y = minYear; y <= maxYear; y++) {
          yearOptions += `<option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>`;
        }

        let html = `
          <div class="cal-header">
            <button type="button" class="cal-nav-btn" id="cal-btn-prev" title="Previous Month" aria-label="Previous Month">‹</button>
            <div class="cal-selectors">
              <select class="cal-select cal-select-month" id="cal-select-month" aria-label="Select Month">
                ${monthOptions}
              </select>
              <select class="cal-select cal-select-year" id="cal-select-year" aria-label="Select Year">
                ${yearOptions}
              </select>
            </div>
            <button type="button" class="cal-nav-btn" id="cal-btn-next" title="Next Month" aria-label="Next Month">›</button>
          </div>
          <div class="cal-weekdays">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>
          <div class="cal-days-grid">
        `;

        for (let i = 0; i < firstDayIndex; i++) {
          html += `<div class="cal-day-cell empty"></div>`;
        }

        for (let day = 1; day <= totalDaysInMonth; day++) {
          const isSelected = selected.year === year && selected.month === month && selected.day === day;
          const isToday = isCurrentMonth && today.getDate() === day;
          const classes = [
            'cal-day-cell',
            isSelected ? 'selected' : '',
            isToday ? 'today' : ''
          ].filter(Boolean).join(' ');

          html += `<div class="${classes}" data-day="${day}">${day}</div>`;
        }

        html += `
          </div>
          <div class="cal-footer">
            <button type="button" class="cal-quick-btn" id="cal-btn-today">Today</button>
            <button type="button" class="cal-quick-btn" id="cal-btn-close">Close</button>
          </div>
        `;

        calendarPopup.innerHTML = html;
      };

      if (calendarPopup) {
        calendarPopup.addEventListener('change', (e) => {
          if (e.target.id === 'cal-select-month') {
            calViewMonth = parseInt(e.target.value, 10);
            renderCalendar(calViewYear, calViewMonth);
          } else if (e.target.id === 'cal-select-year') {
            calViewYear = parseInt(e.target.value, 10);
            renderCalendar(calViewYear, calViewMonth);
          }
        });

        calendarPopup.addEventListener('click', (e) => {
          e.stopPropagation();

          const cell = e.target.closest('.cal-day-cell:not(.empty)');
          if (cell) {
            const day = parseInt(cell.dataset.day, 10);
            const formatted = `${String(day).padStart(2, '0')}/${String(calViewMonth + 1).padStart(2, '0')}/${calViewYear}`;
            if (dateInput) dateInput.value = formatted;
            this.updateWizardStepState();
            calendarPopup.classList.remove('show');
            return;
          }

          if (e.target.closest('#cal-btn-prev')) {
            calViewMonth--;
            if (calViewMonth < 0) {
              calViewMonth = 11;
              calViewYear--;
            }
            renderCalendar(calViewYear, calViewMonth);
            return;
          }

          if (e.target.closest('#cal-btn-next')) {
            calViewMonth++;
            if (calViewMonth > 11) {
              calViewMonth = 0;
              calViewYear++;
            }
            renderCalendar(calViewYear, calViewMonth);
            return;
          }

          if (e.target.closest('#cal-btn-today')) {
            const t = new Date();
            const dStr = `${String(t.getDate()).padStart(2, '0')}/${String(t.getMonth() + 1).padStart(2, '0')}/${t.getFullYear()}`;
            if (dateInput) dateInput.value = dStr;
            this.updateWizardStepState();
            calendarPopup.classList.remove('show');
            return;
          }

          if (e.target.closest('#cal-btn-close')) {
            calendarPopup.classList.remove('show');
            return;
          }
        });
      }

      const toggleCalendar = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (!calendarPopup) return;

        const isShown = calendarPopup.classList.contains('show');
        if (isShown) {
          calendarPopup.classList.remove('show');
        } else {
          const parsed = parseCurrentInputDate();
          calViewYear = parsed.year;
          calViewMonth = parsed.month;
          renderCalendar(calViewYear, calViewMonth);
          calendarPopup.classList.add('show');
        }
      };

      if (btnTrigger) {
        btnTrigger.addEventListener('click', toggleCalendar);
      }

      if (dateInput) {
        dateInput.addEventListener('click', (e) => {
          e.stopPropagation();
          if (calendarPopup && !calendarPopup.classList.contains('show')) {
            const parsed = parseCurrentInputDate();
            calViewYear = parsed.year;
            calViewMonth = parsed.month;
            renderCalendar(calViewYear, calViewMonth);
            calendarPopup.classList.add('show');
          }
        });

        dateInput.addEventListener('input', (e) => {
          const val = e.target.value;
          if (fmt.formatDateInputMask) {
            const formatted = fmt.formatDateInputMask(val);
            if (formatted !== val) e.target.value = formatted;
          }
          this.updateWizardStepState();
        });
      }

      document.addEventListener('click', (e) => {
        if (!calendarPopup || !calendarPopup.classList.contains('show')) return;
        if (calendarPopup.contains(e.target) || (btnTrigger && btnTrigger.contains(e.target)) || e.target === dateInput) {
          return;
        }
        calendarPopup.classList.remove('show');
      });
    }

    /**
     * Populate Seller & Buyer State dropdowns
     */
    populateStateDropdowns() {
      const sellerSelect = document.getElementById('seller-state');
      const buyerSelect = document.getElementById('buyer-state');
      if (!sellerSelect || !buyerSelect) return;

      const states = statesService.getAllStates ? statesService.getAllStates() : [];
      if (!states || states.length === 0) return;

      const currentSeller = sellerSelect.value || '';
      const currentBuyer = buyerSelect.value || '';

      const createOptions = (defaultSelectedCode = '') => {
        let html = '<option value="">-- Select State / UT --</option>';
        states.forEach(state => {
          const isSelected = state.code === defaultSelectedCode ? 'selected' : '';
          const tag = state.isUT ? ' (UT)' : '';
          html += `<option value="${state.code}" ${isSelected}>${state.name}${tag}</option>`;
        });
        return html;
      };

      sellerSelect.innerHTML = createOptions(currentSeller);
      buyerSelect.innerHTML = createOptions(currentBuyer);

      this.updateJurisdictionUI();
    }

    /**
     * Setup listeners on Seller & Buyer State dropdowns and Invoice Number
     */
    setupJurisdictionListeners() {
      const sellerSelect = document.getElementById('seller-state');
      const buyerSelect = document.getElementById('buyer-state');
      const invoiceNumInput = document.getElementById('invoice-number');

      const handler = () => {
        this.updateJurisdictionUI();
        this.updateWizardStepState();
      };

      if (sellerSelect) sellerSelect.addEventListener('change', handler);
      if (buyerSelect) buyerSelect.addEventListener('change', handler);
      if (invoiceNumInput) invoiceNumInput.addEventListener('input', () => this.updateWizardStepState());
    }

    /**
     * Updates the 3-step wizard tracker state dynamically:
     * - Step 1 ("Invoice & States"): Active initially
     * - Step 2 ("Invoice Items"): Becomes active (dark green circle) as soon as invoice/state details or item details are added
     * - Step 3 ("Verification Result"): Becomes active when verification is executed
     */
    updateWizardStepState() {
      const stepNode1 = document.getElementById('step-node-1');
      const stepNode2 = document.getElementById('step-node-2');
      const stepNode3 = document.getElementById('step-node-3');
      const wizardBar = document.getElementById('wizard-progress-bar');
      const resultsContainer = document.getElementById('verification-results');

      // Check if Step 1 has details (Seller/Buyer State, Date, Invoice Number)
      const sellerCode = document.getElementById('seller-state')?.value;
      const buyerCode = document.getElementById('buyer-state')?.value;
      const invoiceDate = document.getElementById('invoice-date')?.value?.trim();
      const invoiceNum = document.getElementById('invoice-number')?.value?.trim();
      const hasStep1Details = Boolean(sellerCode || buyerCode || invoiceDate || invoiceNum);

      // Check if Step 2 has item details (or multiple items, or entered fields)
      const itemCards = document.querySelectorAll('#invoice-items-list .item-card');
      let hasStep2Details = itemCards.length > 1;
      itemCards.forEach(card => {
        const name = card.querySelector('.item-input-name')?.value?.trim();
        const taxable = card.querySelector('.item-input-taxable')?.value?.trim();
        const unitPrice = card.querySelector('.item-input-unit-price')?.value?.trim();
        const rate = card.querySelector('.item-input-rate')?.value?.trim();
        const gst = card.querySelector('.item-input-gst')?.value?.trim();
        const qty = card.querySelector('.item-input-qty')?.value?.trim();
        if (name || taxable || unitPrice || rate || gst || (qty && qty !== '1')) {
          hasStep2Details = true;
        }
      });

      const hasAddedDetails = hasStep1Details || hasStep2Details;

      if (hasAddedDetails) {
        if (stepNode2) stepNode2.classList.add('active');
      } else {
        if (stepNode2) stepNode2.classList.remove('active');
      }

      // Check if Step 3 (verified result) is visible
      const isVerified = resultsContainer && resultsContainer.classList.contains('visible') && resultsContainer.style.display !== 'none';
      if (isVerified) {
        if (stepNode1) stepNode1.classList.add('active');
        if (stepNode2) stepNode2.classList.add('active');
        if (stepNode3) stepNode3.classList.add('active');
        if (wizardBar) wizardBar.style.width = '80%';
      } else if (hasAddedDetails) {
        if (stepNode3) stepNode3.classList.remove('active');
        if (wizardBar) wizardBar.style.width = '40%';
      } else {
        if (stepNode3) stepNode3.classList.remove('active');
        if (wizardBar) wizardBar.style.width = '0%';
      }
    }

    /**
     * Update visual badge for Intra-State vs Inter-State supply
     */
    updateJurisdictionUI() {
      const sellerCode = document.getElementById('seller-state')?.value;
      const buyerCode = document.getElementById('buyer-state')?.value;
      const container = document.getElementById('jurisdiction-badge-container');
      const badge = document.getElementById('jurisdiction-badge');

      if (!sellerCode || !buyerCode) {
        if (container) container.style.display = 'none';
        return;
      }

      if (container && badge) {
        if (statesService.determineJurisdiction) {
          const jurisdiction = statesService.determineJurisdiction(sellerCode, buyerCode);
          container.style.display = 'block';
          badge.className = jurisdiction.isInterState ? 'badge badge-warning' : 'badge badge-info';
          badge.textContent = `📍 Jurisdiction: ${jurisdiction.label}`;
        }
      }
    }

    /**
     * Optional GSTIN validation & Auto-State resolution
     */
    setupGstinListeners() {
      const itemGstinInputs = document.querySelectorAll('.item-input-gstin');
      itemGstinInputs.forEach(input => {
        input.addEventListener('input', (e) => {
          e.target.value = e.target.value.toUpperCase();
        });
      });
    }

    // =========================================================================
    // DYNAMIC INVOICE ITEMS & AUTOMATIC CALCULATION
    // =========================================================================

    parseCleanNumber(val) {
      if (val === null || val === undefined) return NaN;
      if (typeof val === 'number') return isNaN(val) ? NaN : val;
      const cleaned = val.toString().replace(/[₹,%\s]/g, '').trim();
      if (cleaned === '') return NaN;
      const num = parseFloat(cleaned);
      return isNaN(num) ? NaN : num;
    }

    /**
     * Recalculates item values dynamically with two-way sync:
     * - Quantity × Unit Price = Total Taxable Value
     * - Expected GST = (Total Taxable Value × Rate) / 100
     * @param {HTMLElement} card - The .item-card element
     * @param {'qty'|'unitPrice'|'taxable'|'rate'|'gst'|'general'} [trigger='general']
     */
    calculateItemGst(card, trigger = 'general') {
      if (!card) return;

      const qtyInput = card.querySelector('.item-input-qty');
      const unitPriceInput = card.querySelector('.item-input-unit-price');
      const taxableInput = card.querySelector('.item-input-taxable');
      const rateInput = card.querySelector('.item-input-rate');
      const gstInput = card.querySelector('.item-input-gst');

      if (!taxableInput || !rateInput || !gstInput) return;

      let qty = this.parseCleanNumber(qtyInput?.value);
      if (isNaN(qty) || qty <= 0) qty = 1;

      let unitPrice = this.parseCleanNumber(unitPriceInput?.value);
      let taxable = this.parseCleanNumber(taxableInput?.value);
      const rate = this.parseCleanNumber(rateInput?.value);

      if (trigger === 'unitPrice') {
        if (!isNaN(unitPrice) && unitPrice >= 0) {
          taxable = Math.round((qty * unitPrice + Number.EPSILON) * 100) / 100;
          taxableInput.value = taxable.toFixed(2);
        }
      } else if (trigger === 'qty') {
        if (!isNaN(unitPrice) && unitPrice >= 0) {
          taxable = Math.round((qty * unitPrice + Number.EPSILON) * 100) / 100;
          taxableInput.value = taxable.toFixed(2);
        } else if (!isNaN(taxable) && taxable >= 0) {
          unitPrice = Math.round(((taxable / qty) + Number.EPSILON) * 100) / 100;
          if (unitPriceInput) unitPriceInput.value = unitPrice.toFixed(2);
        }
      } else if (trigger === 'taxable') {
        if (!isNaN(taxable) && taxable >= 0 && qty > 0) {
          unitPrice = Math.round(((taxable / qty) + Number.EPSILON) * 100) / 100;
          if (unitPriceInput) unitPriceInput.value = unitPrice.toFixed(2);
        }
      } else {
        // General / Initial sync
        if (!isNaN(unitPrice) && unitPrice > 0 && isNaN(taxable)) {
          taxable = Math.round((qty * unitPrice + Number.EPSILON) * 100) / 100;
          taxableInput.value = taxable.toFixed(2);
        } else if (!isNaN(taxable) && taxable > 0 && isNaN(unitPrice)) {
          unitPrice = Math.round(((taxable / qty) + Number.EPSILON) * 100) / 100;
          if (unitPriceInput) unitPriceInput.value = unitPrice.toFixed(2);
        }
      }

      // GST Calculation based on total taxable value across the entire quantity
      if (isNaN(taxable) || isNaN(rate)) {
        if (!gstInput.dataset.manualOverride) {
          gstInput.value = '';
        }
      } else if (taxable >= 0 && rate >= 0) {
        const expectedGst = (taxable * rate) / 100;
        if (!gstInput.dataset.manualOverride) {
          gstInput.value = (Math.round((expectedGst + Number.EPSILON) * 100) / 100).toFixed(2);
        }
      }

      this.updateCalculatedGrandTotal();
    }

    setupItemManagement() {
      const addBtn = document.getElementById('btn-add-item');
      if (addBtn) {
        addBtn.addEventListener('click', () => this.addNewItemCard());
      }

      const itemsContainer = document.getElementById('invoice-items-list');
      if (itemsContainer) {
        const handleContainerInput = (e) => {
          const target = e.target;
          const card = target.closest('.item-card');
          if (!card) return;

          if (target.classList.contains('item-input-qty')) {
            const gstInput = card.querySelector('.item-input-gst');
            if (gstInput) delete gstInput.dataset.manualOverride;
            this.calculateItemGst(card, 'qty');
          } else if (target.classList.contains('item-input-unit-price')) {
            const gstInput = card.querySelector('.item-input-gst');
            if (gstInput) delete gstInput.dataset.manualOverride;
            this.calculateItemGst(card, 'unitPrice');
          } else if (target.classList.contains('item-input-taxable')) {
            const gstInput = card.querySelector('.item-input-gst');
            if (gstInput) delete gstInput.dataset.manualOverride;
            this.calculateItemGst(card, 'taxable');
          } else if (target.classList.contains('item-input-rate')) {
            const gstInput = card.querySelector('.item-input-gst');
            if (gstInput) delete gstInput.dataset.manualOverride;
            this.calculateItemGst(card, 'rate');
          } else if (target.classList.contains('item-input-gst')) {
            target.dataset.manualOverride = 'true';
            this.updateCalculatedGrandTotal();
          }

          this.updateWizardStepState();
        };

        itemsContainer.addEventListener('input', handleContainerInput);
        itemsContainer.addEventListener('change', handleContainerInput);
      }

      const firstItem = document.getElementById('item-card-0');
      if (firstItem) {
        this.attachItemEventListeners(firstItem);
      }
      this.updateRemoveButtonsState();
    }

    addNewItemCard() {
      const itemsList = document.getElementById('invoice-items-list');
      if (!itemsList) return;

      const newIndex = this.itemCounter++;
      const card = document.createElement('div');
      card.className = 'item-card';
      card.id = `item-card-${newIndex}`;
      card.dataset.itemIndex = newIndex;

      card.innerHTML = `
        <div class="item-card-header">
          <span class="item-card-title">
            <span>🏷️</span> <span class="item-card-num-text">Item #${itemsList.children.length + 1}</span>
          </span>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <button type="button" class="btn btn-secondary btn-sm btn-add-item-card" title="Add another item">
              <span>+</span> Add Another Item
            </button>
            <button type="button" class="btn btn-secondary btn-sm btn-icon-only btn-remove-item" title="Remove Item">
              ✕
            </button>
          </div>
        </div>

        <div class="grid-3">
          <!-- Product / Service Description -->
          <div class="form-group">
            <label class="form-label" for="item-name-${newIndex}">
              Product / Service Description <span class="required-mark">*</span>
            </label>
            <input type="text" id="item-name-${newIndex}" class="form-input item-input-name" placeholder="e.g. Laptop, Consulting, Office Supplies..." autocomplete="off" required>
          </div>

          <!-- Optional HSN/SAC -->
          <div class="form-group">
            <label class="form-label" for="item-hsn-${newIndex}">
              HSN / SAC Code <span style="color:var(--text-muted); font-size:0.8rem;">(Optional)</span>
            </label>
            <input type="text" id="item-hsn-${newIndex}" class="form-input item-input-hsn" placeholder="e.g. 8471, 9983">
          </div>

          <!-- Optional GSTIN -->
          <div class="form-group">
            <label class="form-label" for="item-gstin-${newIndex}">
              Seller GSTIN <span style="color:var(--text-muted); font-size:0.8rem;">(Optional)</span>
            </label>
            <input type="text" id="item-gstin-${newIndex}" class="form-input item-input-gstin" placeholder="e.g. 29AAAAA0000A1Z5" maxlength="15" style="text-transform:uppercase;">
          </div>
        </div>

        <div class="grid-6">
          <!-- Quantity -->
          <div class="form-group">
            <label class="form-label" for="item-qty-${newIndex}">
              Quantity <span class="required-mark">*</span>
            </label>
            <input type="number" step="1" min="1" id="item-qty-${newIndex}" class="form-input item-input-qty" placeholder="1" required>
          </div>

          <!-- Unit of Measurement (UQC) -->
          <div class="form-group">
            <label class="form-label" for="item-unit-${newIndex}">
              Unit <span style="color:var(--text-muted); font-size:0.8rem;">(UQC)</span>
            </label>
            <select id="item-unit-${newIndex}" class="form-select item-input-unit">
              <option value="Pcs" selected>Pcs (Pieces)</option>
              <option value="Nos">Nos (Numbers)</option>
              <option value="Kg">Kg (Kilograms)</option>
              <option value="Gms">Gms (Grams)</option>
              <option value="Ltr">Ltr (Litres)</option>
              <option value="Mtr">Mtr (Metres)</option>
              <option value="Box">Box (Boxes)</option>
              <option value="Pkt">Pkt (Packets)</option>
              <option value="Set">Set (Sets)</option>
              <option value="Doz">Doz (Dozens)</option>
              <option value="Quintal">Quintal</option>
              <option value="Ton">Ton (Tonnes)</option>
              <option value="Bag">Bag (Bags)</option>
              <option value="Hrs">Hrs (Hours)</option>
              <option value="Month">Month</option>
              <option value="Units">Units (General)</option>
            </select>
          </div>

          <!-- Price per Unit -->
          <div class="form-group">
            <label class="form-label" for="item-unit-price-${newIndex}">
              Unit Price (₹)
            </label>
            <div class="input-with-prefix">
              <span class="input-prefix">₹</span>
              <input type="number" step="0.01" min="0" id="item-unit-price-${newIndex}" class="form-input item-input-unit-price" placeholder="10,000.00">
            </div>
          </div>

          <!-- Total Taxable Amount -->
          <div class="form-group">
            <label class="form-label" for="item-taxable-${newIndex}">
              Taxable Value (₹) <span class="required-mark">*</span>
            </label>
            <div class="input-with-prefix">
              <span class="input-prefix">₹</span>
              <input type="number" step="0.01" min="0" id="item-taxable-${newIndex}" class="form-input item-input-taxable" placeholder="10,000.00" required>
            </div>
          </div>

          <!-- Invoice GST Rate % -->
          <div class="form-group">
            <label class="form-label" for="item-rate-${newIndex}">
              GST Rate (%) <span class="required-mark">*</span>
            </label>
            <input type="number" step="0.01" min="0" id="item-rate-${newIndex}" class="form-input item-input-rate" placeholder="e.g. 18" required>
          </div>

          <!-- Invoice GST Amount Charged -->
          <div class="form-group">
            <label class="form-label" for="item-gst-${newIndex}">
              GST Charged (₹) <span class="required-mark">*</span>
            </label>
            <div class="input-with-prefix">
              <span class="input-prefix">₹</span>
              <input type="number" step="0.01" min="0" id="item-gst-${newIndex}" class="form-input item-input-gst" placeholder="e.g. 1,800.00" required>
            </div>
          </div>
        </div>
      `;

      itemsList.appendChild(card);
      this.attachItemEventListeners(card);
      this.updateItemNumbers();
      this.updateRemoveButtonsState();
      this.updateWizardStepState();

      const nameInput = card.querySelector('.item-input-name');
      if (nameInput) nameInput.focus();
    }

    removeItemCard(itemCard) {
      const itemsList = document.getElementById('invoice-items-list');
      if (!itemsList || itemsList.children.length <= 1) return;

      itemCard.remove();
      this.updateItemNumbers();
      this.updateRemoveButtonsState();
      this.updateCalculatedGrandTotal();
      this.updateWizardStepState();
    }

    updateItemNumbers() {
      const items = document.querySelectorAll('#invoice-items-list .item-card');
      items.forEach((card, index) => {
        const label = card.querySelector('.item-card-num-text');
        if (label) label.textContent = `Item #${index + 1}`;
      });
    }

    updateRemoveButtonsState() {
      const items = document.querySelectorAll('#invoice-items-list .item-card');
      const showRemove = items.length > 1;
      items.forEach(card => {
        const removeBtn = card.querySelector('.btn-remove-item');
        if (removeBtn) {
          removeBtn.style.display = showRemove ? 'inline-flex' : 'none';
        }
      });
    }

    attachItemEventListeners(itemCard) {
      const addBtn = itemCard.querySelector('.btn-add-item-card');
      if (addBtn) {
        addBtn.addEventListener('click', () => this.addNewItemCard());
      }

      const removeBtn = itemCard.querySelector('.btn-remove-item');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => this.removeItemCard(itemCard));
      }

      const gstinInput = itemCard.querySelector('.item-input-gstin');
      if (gstinInput) {
        gstinInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.toUpperCase();
        });
      }
    }

    updateCalculatedGrandTotal() {
      const totalInput = document.getElementById('invoice-grand-total');
      if (!totalInput) return;

      let totalSum = 0;
      let hasAnyVal = false;

      const itemCards = document.querySelectorAll('#invoice-items-list .item-card');
      itemCards.forEach(card => {
        const taxable = this.parseCleanNumber(card.querySelector('.item-input-taxable')?.value);
        const gst = this.parseCleanNumber(card.querySelector('.item-input-gst')?.value);

        if (!isNaN(taxable) && taxable > 0) {
          totalSum += taxable;
          hasAnyVal = true;
        }
        if (!isNaN(gst) && gst > 0) {
          totalSum += gst;
          hasAnyVal = true;
        }
      });

      if (hasAnyVal && totalSum > 0) {
        totalInput.value = (Math.round((totalSum + Number.EPSILON) * 100) / 100).toFixed(2);
        totalInput.dataset.autoCalculated = 'true';
      } else {
        totalInput.value = '';
        delete totalInput.dataset.autoCalculated;
      }
    }

    // =========================================================================
    // INVOICE VERIFICATION EXECUTION PIPELINE
    // =========================================================================

    setupVerificationTrigger() {
      const verifyBtn = document.getElementById('btn-verify-invoice');
      if (!verifyBtn) return;

      verifyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.executeInvoiceVerification();
      });
    }

    executeInvoiceVerification() {
      const dateInput = document.getElementById('invoice-date');
      const invoiceNumberInput = document.getElementById('invoice-number');
      const sellerSelect = document.getElementById('seller-state');
      const buyerSelect = document.getElementById('buyer-state');
      const grandTotalInput = document.getElementById('invoice-grand-total');
      const resultsContainer = document.getElementById('verification-results');

      const rawInvoiceDate = dateInput?.value?.trim() || '';
      const fmt = window.Formatters || formatters;
      const invoiceDate = (fmt.parseIndianDateToISO && rawInvoiceDate.includes('/'))
        ? fmt.parseIndianDateToISO(rawInvoiceDate)
        : (rawInvoiceDate || new Date().toISOString().split('T')[0]);

      const invoiceNumber = invoiceNumberInput?.value?.trim() || '';
      const sellerStateCode = sellerSelect?.value || '';
      const buyerStateCode = buyerSelect?.value || '';
      const invoiceGrandTotal = grandTotalInput?.value ? parseFloat(grandTotalInput.value) : null;

      if (!sellerStateCode || !buyerStateCode) {
        if (!sellerStateCode && sellerSelect) sellerSelect.style.borderColor = 'var(--status-error-border)';
        if (!buyerStateCode && buyerSelect) buyerSelect.style.borderColor = 'var(--status-error-border)';
        alert('Please select both Seller State and Buyer State to determine transaction type.');
        return;
      } else {
        if (sellerSelect) sellerSelect.style.borderColor = '';
        if (buyerSelect) buyerSelect.style.borderColor = '';
      }

      const itemCards = document.querySelectorAll('#invoice-items-list .item-card');
      const itemsData = [];
      let hasValidationError = false;
      let sellerGstinFirst = '';

      itemCards.forEach((card, index) => {
        let name = card.querySelector('.item-input-name')?.value?.trim();
        if (!name) name = `Item #${index + 1}`;

        const hsnSac = card.querySelector('.item-input-hsn')?.value?.trim() || '';
        const gstin = card.querySelector('.item-input-gstin')?.value?.trim()?.toUpperCase() || '';
        if (!sellerGstinFirst && gstin) sellerGstinFirst = gstin;

        const qtyVal = parseFloat(card.querySelector('.item-input-qty')?.value);
        const quantity = (!isNaN(qtyVal) && qtyVal > 0) ? qtyVal : 1;
        const unit = card.querySelector('.item-input-unit')?.value || 'Pcs';
        const unitPriceVal = parseFloat(card.querySelector('.item-input-unit-price')?.value);
        let taxable = parseFloat(card.querySelector('.item-input-taxable')?.value);
        let rate = parseFloat(card.querySelector('.item-input-rate')?.value);
        let gst = parseFloat(card.querySelector('.item-input-gst')?.value);

        // If unit price and quantity are set but taxable is missing
        if (isNaN(taxable) && !isNaN(unitPriceVal) && unitPriceVal >= 0) {
          taxable = quantity * unitPriceVal;
          const taxableIn = card.querySelector('.item-input-taxable');
          if (taxableIn) taxableIn.value = taxable.toFixed(2);
        }

        // If rate is missing default to 18
        if (isNaN(rate)) {
          rate = 18;
          const rateIn = card.querySelector('.item-input-rate');
          if (rateIn) rateIn.value = '18';
        }

        // If GST is missing, auto calculate
        if (isNaN(gst) && !isNaN(taxable) && taxable >= 0) {
          gst = Math.round(((taxable * rate) / 100) * 100) / 100;
          const gstIn = card.querySelector('.item-input-gst');
          if (gstIn) gstIn.value = gst.toFixed(2);
        }

        if (isNaN(taxable) || taxable < 0 || isNaN(rate) || isNaN(gst)) {
          hasValidationError = true;
          card.style.borderColor = 'var(--status-error-border)';
        } else {
          card.style.borderColor = '';
          const unitPrice = (!isNaN(unitPriceVal) && unitPriceVal > 0) ? unitPriceVal : (taxable / quantity);
          itemsData.push({
            name,
            hsnSac,
            quantity,
            unit,
            unitPrice,
            taxableAmount: taxable,
            invoiceGstRate: rate,
            invoiceGstAmount: gst
          });
        }
      });

      if (hasValidationError || itemsData.length === 0) {
        alert('Please enter valid taxable value, GST rate %, and GST charged for each invoice item.');
        return;
      }

      const vService = window.VerifierService || verifierService;
      const ui = window.UIComponents || uiComponents;
      const histService = window.HistoryService || historyService;

      if (!vService.verifyInvoice || !ui.renderVerificationResult) {
        console.error('Verifier service or UI components not loaded.');
        return;
      }

      const report = vService.verifyInvoice({
        invoiceDate,
        invoiceNumber,
        sellerStateCode,
        buyerStateCode,
        sellerGstin: sellerGstinFirst,
        items: itemsData,
        invoiceGrandTotal
      });

      // Update Step Wizard Visuals
      const stepNode2 = document.getElementById('step-node-2');
      const stepNode3 = document.getElementById('step-node-3');
      const wizardBar = document.getElementById('wizard-progress-bar');
      if (stepNode2) stepNode2.classList.add('active');
      if (stepNode3) stepNode3.classList.add('active');
      if (wizardBar) wizardBar.style.width = '80%';

      // Auto-save to History
      if (histService.saveInvoice) {
        histService.saveInvoice({
          invoiceDate,
          invoiceNumber,
          sellerStateCode,
          buyerStateCode,
          sellerGstin: sellerGstinFirst,
          items: itemsData,
          grandTotal: report.summary?.invoiceGrandTotal,
          verdict: report.summary?.overallVerdict,
          verdictTitle: report.summary?.verdictTitle,
          report
        });
        this.updateHistoryBadge();
      }

      const renderedHtml = ui.renderVerificationResult(report);
      if (resultsContainer) {
        resultsContainer.innerHTML = renderedHtml;
        resultsContainer.classList.add('visible');
        resultsContainer.style.display = 'block';

        this.attachReportActionListeners(report);
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // =========================================================================
    // GST CALCULATOR CONTROLLER
    // =========================================================================

    setupCalculator() {
      this.calcMode = 'exclusive'; // 'exclusive' | 'inclusive'
      this.calcRate = 18;

      const amountInput = document.getElementById('calc-amount');
      const customRateGroup = document.getElementById('calc-custom-rate-group');
      const customRateInput = document.getElementById('calc-custom-rate');
      const rateChips = document.querySelectorAll('#calc-rate-chips .rate-chip');
      const modeButtons = document.querySelectorAll('#calc-mode-toggle .mode-toggle-btn');
      const modeHint = document.getElementById('calc-mode-hint');
      const amountLabel = document.getElementById('calc-amount-label');

      // Price Mode Toggle: Exclusive vs Inclusive
      modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          modeButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.calcMode = btn.dataset.mode || 'exclusive';

          if (this.calcMode === 'inclusive') {
            if (modeHint) modeHint.textContent = 'GST is already included in the total price.';
            if (amountLabel) amountLabel.innerHTML = 'Total Amount (₹) <span class="required-mark">*</span>';
            if (amountInput) amountInput.placeholder = 'e.g. 11,800.00';
          } else {
            if (modeHint) modeHint.textContent = 'GST is added separately to the base price.';
            if (amountLabel) amountLabel.innerHTML = 'Taxable Amount (₹) <span class="required-mark">*</span>';
            if (amountInput) amountInput.placeholder = 'e.g. 10,000.00';
          }

          this.recalculateGst();
        });
      });

      // Rate Chips
      rateChips.forEach(chip => {
        chip.addEventListener('click', () => {
          rateChips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');

          const rateVal = chip.dataset.rate;
          if (rateVal === 'custom') {
            if (customRateGroup) customRateGroup.style.display = 'block';
            this.calcRate = parseFloat(customRateInput?.value) || 0;
            if (customRateInput) customRateInput.focus();
          } else {
            if (customRateGroup) customRateGroup.style.display = 'none';
            this.calcRate = parseFloat(rateVal) || 0;
          }

          this.recalculateGst();
        });
      });

      if (amountInput) amountInput.addEventListener('input', () => this.recalculateGst());
      if (customRateInput) {
        customRateInput.addEventListener('input', () => {
          this.calcRate = parseFloat(customRateInput.value) || 0;
          this.recalculateGst();
        });
      }

      this.recalculateGst();
    }

    recalculateGst() {
      const amountInput = document.getElementById('calc-amount');
      const resBase = document.getElementById('calc-res-base');
      const resTax = document.getElementById('calc-res-tax');
      const resSplit = document.getElementById('calc-res-split');
      const resTotal = document.getElementById('calc-res-total');
      const lblBase = document.getElementById('calc-lbl-base');
      const lblTax = document.getElementById('calc-lbl-tax');
      const lblSplit = document.getElementById('calc-lbl-split');
      const lblTotal = document.getElementById('calc-lbl-total');

      const rawAmount = amountInput?.value?.trim() || '';
      const amount = rawAmount ? (parseFloat(rawAmount) || 0) : 0;
      const rate = this.calcRate !== undefined ? this.calcRate : 18;
      const isInclusive = this.calcMode === 'inclusive';
      const calcService = window.CalculatorService || calculatorService;
      const fmt = window.Formatters || formatters;
      const formatINR = fmt.formatINR || (n => `₹${Number(n || 0).toFixed(2)}`);

      const halfRate = (rate / 2).toFixed(1).replace(/\.0$/, '');

      if (isInclusive) {
        if (lblBase) lblBase.textContent = 'Total Amount:';
        if (lblTax) lblTax.textContent = `GST Amount Included (${rate}%):`;
        if (lblTotal) lblTotal.textContent = 'Net Taxable Amount:';
      } else {
        if (lblBase) lblBase.textContent = 'Base Taxable Amount:';
        if (lblTax) lblTax.textContent = `Total GST Amount (${rate}%):`;
        if (lblTotal) lblTotal.textContent = 'Grand Total:';
      }

      if (lblSplit) lblSplit.textContent = `CGST (${halfRate}%) + SGST/UTGST (${halfRate}%):`;

      if (!rawAmount || isNaN(amount) || amount <= 0) {
        if (resBase) resBase.textContent = '₹0.00';
        if (resTax) resTax.textContent = '₹0.00';
        if (resSplit) resSplit.textContent = '₹0.00 + ₹0.00';
        if (resTotal) resTotal.textContent = '₹0.00';
        return;
      }

      const result = isInclusive
        ? (calcService.removeGst ? calcService.removeGst(amount, rate, 'intra') : { baseAmount: 0, gstAmount: 0, totalAmount: 0, cgst: 0, sgst: 0, igst: 0 })
        : (calcService.addGst ? calcService.addGst(amount, rate, 'intra') : { baseAmount: 0, gstAmount: 0, totalAmount: 0, cgst: 0, sgst: 0, igst: 0 });

      if (isInclusive) {
        if (resBase) resBase.textContent = formatINR(result.totalAmount);
        if (resTax) resTax.textContent = `− ${formatINR(result.gstAmount)}`;
        if (resTotal) resTotal.textContent = formatINR(result.baseAmount);
      } else {
        if (resBase) resBase.textContent = formatINR(result.baseAmount);
        if (resTax) resTax.textContent = `+ ${formatINR(result.gstAmount)}`;
        if (resTotal) resTotal.textContent = formatINR(result.totalAmount);
      }

      const halfCgst = formatINR(result.cgst);
      const halfSgst = formatINR(result.sgst);
      if (resSplit) resSplit.textContent = `${halfCgst} + ${halfSgst}`;
    }

    // =========================================================================
    // REPORT ACTIONS & PDF EXPORT GENERATORS
    // =========================================================================

    /**
     * Generate and print a comprehensive, high-quality A4 PDF Report
     * including full invoice details, line items, and mathematical audit
     * @param {object} report - Verifier result report
     */
    generateInvoicePdfReport(report) {
      if (!report || !report.summary) return;

      const fmt = window.Formatters || formatters;
      const formatINR = fmt.formatINR || (n => `₹${Number(n || 0).toFixed(2)}`);
      const displayDate = (fmt.formatDateToIndian && report.invoiceDate)
        ? (report.invoiceDate.includes('/') ? report.invoiceDate : fmt.formatDateToIndian(report.invoiceDate))
        : (report.invoiceDate || 'N/A');

      const isMatch = report.summary.overallVerdict === 'MATCH';
      const statusColor = isMatch ? '#00a896' : '#d97706';
      const statusBg = isMatch ? '#e0f2f1' : '#fef3c7';
      const statusText = isMatch ? '✓ GST CALCULATION MATCHES' : '⚠️ POSSIBLE GST CALCULATION MISMATCH';

      // Distinct GST rates
      const validRates = (report.items || [])
        .map(i => parseFloat(i.invoiceGstRate))
        .filter(r => !isNaN(r) && r >= 0);
      const distinctRates = [...new Set(validRates)];
      let ratesDisplay = '—';
      if (distinctRates.length === 1) {
        ratesDisplay = `${distinctRates[0]}%`;
      } else if (distinctRates.length > 1) {
        ratesDisplay = distinctRates.map(r => `${r}%`).join(', ');
      }

      let itemsRowsHtml = '';
      (report.items || []).forEach(item => {
        const itemMathOk = item.calculationCheck?.status === 'MATCH';
        const isInter = Boolean(item.taxBreakdown?.isInterState);
        const taxSplitStr = isInter
          ? `IGST: ${formatINR(item.taxBreakdown?.expectedIgst || 0)}`
          : `CGST: ${formatINR(item.taxBreakdown?.expectedCgst || 0)} + SGST: ${formatINR(item.taxBreakdown?.expectedSgst || 0)}`;

        itemsRowsHtml += `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 9px 8px; text-align: center; font-weight: bold;">${item.itemNumber}</td>
            <td style="padding: 9px 8px;">
              <strong>${item.productName}</strong>
              ${item.hsnSac && item.hsnSac !== 'Not specified' ? `<div style="font-size: 11px; color: #64748b;">HSN/SAC: ${item.hsnSac}</div>` : ''}
            </td>
            <td style="padding: 9px 8px; text-align: center;">${item.quantity} ${item.unit || 'Pcs'}</td>
            <td style="padding: 9px 8px; text-align: right; font-family: monospace;">${formatINR(item.unitPrice || (item.taxableAmount / item.quantity))}</td>
            <td style="padding: 9px 8px; text-align: right; font-family: monospace; font-weight: 600;">${formatINR(item.taxableAmount)}</td>
            <td style="padding: 9px 8px; text-align: center; font-weight: 600;">${item.invoiceGstRate}%</td>
            <td style="padding: 9px 8px; text-align: right; font-family: monospace;">${formatINR(item.expectedGst)}</td>
            <td style="padding: 9px 8px; text-align: right; font-family: monospace; color: ${itemMathOk ? 'inherit' : '#b91c1c'}; font-weight: 600;">${formatINR(item.invoiceGstAmount)}</td>
            <td style="padding: 9px 8px; text-align: right; font-family: monospace; color: ${item.difference > 0 ? '#b91c1c' : 'inherit'}; font-weight: 600;">${formatINR(item.difference)}</td>
            <td style="padding: 9px 8px; font-size: 11px; color: #475569;">${taxSplitStr}</td>
          </tr>
        `;
      });

      const sellerState = report.jurisdiction?.sellerStateName || (report.sellerStateCode ? `State Code ${report.sellerStateCode}` : 'Not Specified');
      const buyerState = report.jurisdiction?.buyerStateName || (report.buyerStateCode ? `State Code ${report.buyerStateCode}` : 'Not Specified');
      const sellerCode = report.jurisdiction?.sellerStateCode || report.sellerStateCode || '-';
      const buyerCode = report.jurisdiction?.buyerStateCode || report.buyerStateCode || '-';

      const sellerGstin = report.sellerGstinReport?.gstin || report.sellerGstin || 'Not Specified';
      const buyerGstin = report.buyerGstinReport?.gstin || report.buyerGstin || '';

      const printHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>GST Invoice Verification Report - ${report.invoiceNumber || 'INV'}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #0f172a; padding: 28px; background: #ffffff; font-size: 13px; line-height: 1.4; }
            .report-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #00a896; padding-bottom: 14px; margin-bottom: 18px; }
            .brand-title { font-size: 22px; font-weight: 800; color: #073b4c; }
            .brand-subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
            .meta-text { font-size: 12px; color: #64748b; text-align: right; }
            
            .verdict-banner { background: ${statusBg}; border-left: 5px solid ${statusColor}; padding: 12px 16px; border-radius: 4px; margin-bottom: 18px; }
            .verdict-heading { font-size: 15px; font-weight: 700; color: ${statusColor}; }
            .verdict-desc { font-size: 12px; color: #334155; margin-top: 3px; }
            
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; background: #f8fafc; padding: 14px; border-radius: 6px; border: 1px solid #e2e8f0; }
            .info-col h4 { font-size: 11px; text-transform: uppercase; color: #00a896; font-weight: 700; margin-bottom: 6px; }
            .info-row { display: flex; justify-content: space-between; font-size: 12px; padding: 2px 0; }
            .info-label { color: #64748b; }
            .info-val { font-weight: 600; color: #0f172a; text-align: right; }
            
            table { width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 12px; }
            th { background: #073b4c; color: #ffffff; padding: 9px 8px; text-align: left; font-weight: 600; font-size: 11px; text-transform: uppercase; }
            tfoot tr { background: #f1f5f9; font-weight: 700; }
            tfoot tr.grand-row { background: #e0f2f1; color: #073b4c; font-size: 13px; font-weight: 800; }
            
            .matrix-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px; }
            .matrix-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 4px; }
            .matrix-lbl { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; }
            .matrix-val { font-family: monospace; font-size: 15px; font-weight: 800; color: #073b4c; margin-top: 2px; }
            
            .disclaimer { font-size: 10px; color: #64748b; line-height: 1.4; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 18px; }
            @media print {
              body { padding: 15px; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="report-header">
            <div>
              <div class="brand-title">GST Verifier</div>
              <div class="brand-subtitle">GST Invoice Verification Report &bull; Informational Calculation Audit</div>
            </div>
            <div class="meta-text">
              <div><strong>Generated:</strong> ${new Date().toLocaleString('en-IN')}</div>
              <div><strong>Invoice Date:</strong> ${displayDate}</div>
              ${report.invoiceNumber ? `<div><strong>Invoice #:</strong> ${report.invoiceNumber}</div>` : ''}
            </div>
          </div>

          <div class="verdict-banner">
            <div class="verdict-heading">${statusText}</div>
            <div class="verdict-desc">${report.summary.verdictMessage}</div>
          </div>

          <div class="info-grid">
            <div class="info-col">
              <h4>Invoice & Supply Details</h4>
              <div class="info-row"><span class="info-label">Invoice Number:</span> <span class="info-val">${report.invoiceNumber || 'N/A'}</span></div>
              <div class="info-row"><span class="info-label">Invoice Date:</span> <span class="info-val">${displayDate}</span></div>
              <div class="info-row"><span class="info-label">Transaction Type:</span> <span class="info-val">${report.summary.transactionTypeLabel} (${report.jurisdiction?.isInterState ? 'IGST' : 'CGST + SGST'})</span></div>
              <div class="info-row"><span class="info-label">Total Items:</span> <span class="info-val">${(report.items || []).length}</span></div>
            </div>
            <div class="info-col">
              <h4>Location & GSTIN Information</h4>
              <div class="info-row"><span class="info-label">Seller State:</span> <span class="info-val">${sellerState} (Code ${sellerCode})</span></div>
              <div class="info-row"><span class="info-label">Buyer State:</span> <span class="info-val">${buyerState} (Code ${buyerCode})</span></div>
              <div class="info-row"><span class="info-label">Seller GSTIN:</span> <span class="info-val">${sellerGstin}</span></div>
              ${buyerGstin ? `<div class="info-row"><span class="info-label">Buyer GSTIN:</span> <span class="info-val">${buyerGstin}</span></div>` : ''}
            </div>
          </div>

          <div class="matrix-grid">
            <div class="matrix-box">
              <div class="matrix-lbl">Total Taxable Value</div>
              <div class="matrix-val">${formatINR(report.summary.totalTaxable)}</div>
            </div>
            <div class="matrix-box">
              <div class="matrix-lbl">Expected GST</div>
              <div class="matrix-val">${formatINR(report.summary.totalExpectedGst)}</div>
            </div>
            <div class="matrix-box">
              <div class="matrix-lbl">GST Charged</div>
              <div class="matrix-val" style="color:${isMatch ? '#00a896' : '#d97706'};">${formatINR(report.summary.totalInvoiceGst)}</div>
            </div>
            <div class="matrix-box">
              <div class="matrix-lbl">Difference</div>
              <div class="matrix-val" style="color:${report.summary.gstDifference > 0 ? '#b91c1c' : '#00a896'};">${formatINR(report.summary.gstDifference)}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 4%; text-align: center;">#</th>
                <th style="width: 25%;">Item Description</th>
                <th style="width: 9%; text-align: center;">Qty</th>
                <th style="width: 11%; text-align: right;">Unit Price</th>
                <th style="width: 12%; text-align: right;">Taxable Value</th>
                <th style="width: 8%; text-align: center;">GST Rate</th>
                <th style="width: 11%; text-align: right;">Expected GST</th>
                <th style="width: 11%; text-align: right;">GST Charged</th>
                <th style="width: 9%; text-align: right;">Difference</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRowsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="padding: 9px 8px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 9px 8px; text-align: right; font-family: monospace;">${formatINR(report.summary.totalTaxable)}</td>
                <td style="padding: 9px 8px; text-align: center; font-family: monospace; font-weight: 700;">${ratesDisplay}</td>
                <td style="padding: 9px 8px; text-align: right; font-family: monospace;">${formatINR(report.summary.totalExpectedGst)}</td>
                <td style="padding: 9px 8px; text-align: right; font-family: monospace; color: ${isMatch ? 'inherit' : '#d97706'};">${formatINR(report.summary.totalInvoiceGst)}</td>
                <td style="padding: 9px 8px; text-align: right; font-family: monospace; color: ${report.summary.gstDifference > 0 ? '#b91c1c' : 'inherit'};">${formatINR(report.summary.gstDifference)}</td>
              </tr>
              <tr class="grand-row">
                <td colspan="4" style="padding: 10px 8px; text-align: right;"><strong>Grand Total Invoice Amount:</strong></td>
                <td style="padding: 10px 8px; text-align: right; font-family: monospace;">${formatINR(report.summary.totalTaxable)}</td>
                <td style="padding: 10px 8px; text-align: center; font-family: monospace; font-weight: 800;">${ratesDisplay}</td>
                <td style="padding: 10px 8px; text-align: right; font-family: monospace;">${formatINR(report.summary.totalExpectedGst)}</td>
                <td style="padding: 10px 8px; text-align: right; font-family: monospace;">${formatINR(report.summary.totalInvoiceGst)}</td>
                <td style="padding: 10px 8px; text-align: right; font-family: monospace; font-size: 14px; font-weight: 800; color: #073b4c;">${formatINR(report.summary.invoiceGrandTotal)}</td>
              </tr>
            </tfoot>
          </table>

          <div class="disclaimer">
            <strong>Disclaimer:</strong> GST Verifier is an informational calculation-verification tool. Results are computed strictly from user-entered figures and standard GST arithmetic. Product classification, exemptions, reverse charge mechanisms, and other tax laws may apply. This report does not constitute legal, tax, or statutory audit certification.
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(printHtml);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 350);
      } else {
        window.print();
      }
    }

    /**
     * Generate and print a comprehensive Saved Invoices History Report
     */
    generateHistoryPdfReport() {
      const histService = window.HistoryService || historyService;
      const list = histService.getAllInvoices ? histService.getAllInvoices() : [];
      if (!list || list.length === 0) {
        alert('No saved invoice history to export.');
        return;
      }

      const fmt = window.Formatters || formatters;
      const formatINR = fmt.formatINR || (n => `₹${Number(n || 0).toFixed(2)}`);
      const states = window.StatesService || statesService;

      let summaryTableRows = '';
      let detailedCardsHtml = '';

      list.forEach((item, index) => {
        const rawDate = item.invoiceDate || '';
        const displayDate = (fmt.formatDateToIndian && rawDate)
          ? (rawDate.includes('/') ? rawDate : fmt.formatDateToIndian(rawDate))
          : (rawDate || 'N/A');

        const sellerObj = states.getState ? states.getState(item.sellerStateCode) : null;
        const buyerObj = states.getState ? states.getState(item.buyerStateCode) : null;
        const sellerName = sellerObj ? sellerObj.name : (item.sellerStateCode ? `Code ${item.sellerStateCode}` : '-');
        const buyerName = buyerObj ? buyerObj.name : (item.buyerStateCode ? `Code ${item.buyerStateCode}` : '-');

        const isMatch = item.verdict === 'MATCH' || item.verdict === 'VERIFIED';
        const totalStr = formatINR(item.grandTotal || 0);
        const invoiceNum = item.invoiceNumber || `INV-${String(index + 1).padStart(3, '0')}`;

        // Distinct GST rates in items
        const itemRates = (item.items || []).map(i => parseFloat(i.invoiceGstRate || i.rate)).filter(r => !isNaN(r) && r >= 0);
        const distinctRates = [...new Set(itemRates)];
        const rateStr = distinctRates.length > 0 ? distinctRates.map(r => `${r}%`).join(', ') : '—';

        let totalTaxable = 0;
        let totalChargedGst = 0;
        let totalExpectedGst = 0;

        let itemRows = '';
        (item.items || []).forEach((it, itIdx) => {
          const itName = it.name || it.productName || `Item #${itIdx + 1}`;
          const itQty = it.quantity || it.qty || 1;
          const itUnit = it.unit || 'Pcs';
          const itTaxable = parseFloat(it.taxableAmount || it.taxable) || 0;
          const itRate = parseFloat(it.invoiceGstRate || it.rate) || 0;
          const itGst = parseFloat(it.invoiceGstAmount || it.gst) || 0;
          const itExpected = it.expectedGst !== undefined ? parseFloat(it.expectedGst) : ((itTaxable * itRate) / 100);
          const itPrice = it.unitPrice !== undefined ? parseFloat(it.unitPrice) : (itTaxable / itQty);

          totalTaxable += itTaxable;
          totalChargedGst += itGst;
          totalExpectedGst += itExpected;

          itemRows += `
            <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
              <td style="padding: 5px 6px; text-align: center;">${itIdx + 1}</td>
              <td style="padding: 5px 6px;"><strong>${itName}</strong> ${it.hsnSac ? `<span style="color:#64748b;">(${it.hsnSac})</span>` : ''}</td>
              <td style="padding: 5px 6px; text-align: center;">${itQty} ${itUnit}</td>
              <td style="padding: 5px 6px; text-align: right; font-family: monospace;">${formatINR(itPrice)}</td>
              <td style="padding: 5px 6px; text-align: right; font-family: monospace;">${formatINR(itTaxable)}</td>
              <td style="padding: 5px 6px; text-align: center;">${itRate}%</td>
              <td style="padding: 5px 6px; text-align: right; font-family: monospace;">${formatINR(itExpected)}</td>
              <td style="padding: 5px 6px; text-align: right; font-family: monospace;">${formatINR(itGst)}</td>
            </tr>
          `;
        });

        summaryTableRows += `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px 6px; font-weight: bold; text-align: center;">${index + 1}</td>
            <td style="padding: 8px 6px; font-weight: 600;">${invoiceNum}</td>
            <td style="padding: 8px 6px;">${displayDate}</td>
            <td style="padding: 8px 6px;">${sellerName} &rarr; ${buyerName}</td>
            <td style="padding: 8px 6px; text-align: center;">${(item.items || []).length}</td>
            <td style="padding: 8px 6px; text-align: center; font-weight: 600;">${rateStr}</td>
            <td style="padding: 8px 6px; text-align: right; font-family: monospace; font-weight: bold;">${totalStr}</td>
            <td style="padding: 8px 6px; text-align: center;">
              <span style="display:inline-block; padding: 2px 7px; font-size: 10px; font-weight: bold; border-radius: 3px; background: ${isMatch ? '#e0f2f1' : '#fef3c7'}; color: ${isMatch ? '#00a896' : '#d97706'};">
                ${isMatch ? 'Match' : 'Mismatch'}
              </span>
            </td>
          </tr>
        `;

        detailedCardsHtml += `
          <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; margin-bottom: 16px; background: #ffffff; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 8px;">
              <div>
                <strong style="font-size: 14px; color: #073b4c;">Invoice #${invoiceNum}</strong>
                <span style="font-size: 12px; color: #64748b; margin-left: 8px;">📅 ${displayDate}</span>
              </div>
              <span style="display:inline-block; padding: 2px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; background: ${isMatch ? '#e0f2f1' : '#fef3c7'}; color: ${isMatch ? '#00a896' : '#d97706'};">
                ${item.verdictTitle || (isMatch ? '✓ GST Match' : '⚠️ GST Mismatch')}
              </span>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 11px; margin-bottom: 8px; background: #f8fafc; padding: 8px; border-radius: 4px;">
              <div><strong>Seller:</strong> ${sellerName} (Code ${item.sellerStateCode || '-'}) ${item.sellerGstin ? `<br><span style="color:#64748b;">GSTIN: ${item.sellerGstin}</span>` : ''}</div>
              <div><strong>Buyer:</strong> ${buyerName} (Code ${item.buyerStateCode || '-'})</div>
              <div style="text-align: right;"><strong>Grand Total:</strong> <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #073b4c;">${totalStr}</span></div>
            </div>

            <table style="margin-bottom: 0;">
              <thead>
                <tr style="background: #e2e8f0; color: #334155; font-size: 10px;">
                  <th style="padding: 4px 6px; text-align: center; width: 4%;">#</th>
                  <th style="padding: 4px 6px; width: 30%;">Item</th>
                  <th style="padding: 4px 6px; text-align: center; width: 12%;">Qty</th>
                  <th style="padding: 4px 6px; text-align: right; width: 13%;">Price</th>
                  <th style="padding: 4px 6px; text-align: right; width: 15%;">Taxable</th>
                  <th style="padding: 4px 6px; text-align: center; width: 8%;">Rate</th>
                  <th style="padding: 4px 6px; text-align: right; width: 9%;">Exp GST</th>
                  <th style="padding: 4px 6px; text-align: right; width: 9%;">Charged</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>
          </div>
        `;
      });

      const printHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>GST Invoices Verification History Report</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #0f172a; padding: 24px; background: #ffffff; font-size: 12px; line-height: 1.4; }
            .header { border-bottom: 2px solid #00a896; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
            .title { font-size: 20px; font-weight: 800; color: #073b4c; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
            th { background: #073b4c; color: #ffffff; padding: 8px 6px; text-align: left; font-weight: 600; text-transform: uppercase; font-size: 10px; }
            .section-title { font-size: 14px; font-weight: 700; color: #073b4c; margin: 18px 0 10px 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
            .footer { margin-top: 20px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; }
            @media print {
              body { padding: 12px; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">GST Verifier</div>
              <div class="subtitle">Saved Invoice Verification Audit History &bull; Total Records: ${list.length}</div>
            </div>
            <div style="font-size: 11px; color: #64748b; text-align: right;">
              <div><strong>Export Date:</strong> ${new Date().toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div class="section-title">1. Invoices Overview</div>
          <table>
            <thead>
              <tr>
                <th style="width: 4%; text-align: center;">#</th>
                <th style="width: 18%;">Invoice #</th>
                <th style="width: 12%;">Date</th>
                <th style="width: 26%;">Transaction (From &rarr; To)</th>
                <th style="width: 6%; text-align: center;">Items</th>
                <th style="width: 10%; text-align: center;">GST Rate</th>
                <th style="width: 14%; text-align: right;">Grand Total</th>
                <th style="width: 10%; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${summaryTableRows}
            </tbody>
          </table>

          <div class="section-title">2. Detailed Invoice Breakdowns</div>
          <div>
            ${detailedCardsHtml}
          </div>

          <div class="footer">
            GST Verifier &mdash; Informational Calculation Verification Audit Report. Generated automatically.
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(printHtml);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 350);
      } else {
        window.print();
      }
    }

    attachReportActionListeners(report) {
      const printBtn = document.getElementById('btn-print-audit-report');
      if (printBtn) {
        printBtn.addEventListener('click', () => {
          this.generateInvoicePdfReport(report);
        });
      }

      const copyBtn = document.getElementById('btn-copy-audit-summary');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const fmt = window.Formatters || formatters;
          const formatINR = fmt.formatINR || (n => `₹${Number(n || 0).toFixed(2)}`);
          const displayDate = fmt.formatDateToIndian ? fmt.formatDateToIndian(report.invoiceDate) : report.invoiceDate;

          let itemSummaryLines = '';
          (report.items || []).forEach((it, idx) => {
            itemSummaryLines += `  ${idx + 1}. ${it.productName} - Qty: ${it.quantity} ${it.unit}, Taxable: ${formatINR(it.taxableAmount)}, Rate: ${it.invoiceGstRate}%, Expected GST: ${formatINR(it.expectedGst)}, Charged GST: ${formatINR(it.invoiceGstAmount)}, Diff: ${formatINR(it.difference)} [${it.calculationCheck?.status}]\n`;
          });

          const textSummary = `================================================
GST INVOICE VERIFICATION REPORT
================================================
Invoice Date: ${displayDate}
Transaction Type: ${report.summary?.transactionTypeLabel || 'N/A'}
Result: ${report.summary?.verdictTitle || 'N/A'}
Total Taxable: ${formatINR(report.summary?.totalTaxable || 0)}
Expected GST: ${formatINR(report.summary?.totalExpectedGst || 0)}
GST Charged on Invoice: ${formatINR(report.summary?.totalInvoiceGst || 0)}
Difference: ${formatINR(report.summary?.gstDifference || 0)}
Grand Total: ${formatINR(report.summary?.invoiceGrandTotal || 0)}

Line Items:
${itemSummaryLines}
================================================
GST Verifier (Informational Calculation-Verification Tool)`;

          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textSummary).then(() => {
              const originalText = copyBtn.innerHTML;
              copyBtn.innerHTML = '<span>✓</span> Copied!';
              setTimeout(() => { copyBtn.innerHTML = originalText; }, 2000);
            }).catch(() => {
              alert('Summary copied to clipboard!');
            });
          } else {
            alert(textSummary);
          }
        });
      }

      const historyBtn = document.getElementById('btn-open-history-from-report');
      if (historyBtn) {
        historyBtn.addEventListener('click', () => {
          this.openHistoryModal();
        });
      }
    }

    // =========================================================================
    // INVOICE HISTORY CONTROLLER
    // =========================================================================

    setupHistoryHandlers() {
      const openBtn = document.getElementById('btn-open-history');
      const closeBtn = document.getElementById('btn-close-history-modal');
      const cancelBtn = document.getElementById('btn-cancel-history-modal');
      const modal = document.getElementById('history-modal');
      const exportPdfBtn = document.getElementById('btn-export-history-pdf') || document.getElementById('btn-export-history');
      const clearBtn = document.getElementById('btn-clear-history');
      const container = document.getElementById('history-items-container');

      if (openBtn) openBtn.addEventListener('click', () => this.openHistoryModal());
      if (closeBtn) closeBtn.addEventListener('click', () => this.closeHistoryModal());
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeHistoryModal());

      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) this.closeHistoryModal();
        });
      }

      if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => {
          this.generateHistoryPdfReport();
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (confirm('Are you sure you want to clear all saved invoice history? This cannot be undone.')) {
            if (historyService.clearAll) historyService.clearAll();
            this.updateHistoryBadge();
            if (container) container.innerHTML = uiComponents.renderHistoryList ? uiComponents.renderHistoryList([]) : '';
          }
        });
      }

      if (container) {
        container.addEventListener('click', (e) => {
          const loadBtn = e.target.closest('.btn-load-history');
          if (loadBtn) {
            const id = loadBtn.dataset.id;
            const entry = historyService.getInvoiceById ? historyService.getInvoiceById(id) : null;
            if (entry) {
              this.loadInvoiceIntoForm(entry);
              this.closeHistoryModal();
            }
            return;
          }

          const deleteBtn = e.target.closest('.btn-delete-history');
          if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            if (historyService.deleteInvoice) {
              historyService.deleteInvoice(id);
              this.updateHistoryBadge();
              const updatedList = historyService.getAllInvoices ? historyService.getAllInvoices() : [];
              container.innerHTML = uiComponents.renderHistoryList ? uiComponents.renderHistoryList(updatedList) : '';
            }
          }
        });
      }
    }

    updateHistoryBadge() {
      const badge = document.getElementById('history-badge-count');
      if (badge && historyService.getAllInvoices) {
        const count = historyService.getAllInvoices().length;
        badge.textContent = count;
      }
    }

    openHistoryModal() {
      const modal = document.getElementById('history-modal');
      const container = document.getElementById('history-items-container');
      if (!modal || !container) return;

      const list = historyService.getAllInvoices ? historyService.getAllInvoices() : [];
      container.innerHTML = uiComponents.renderHistoryList ? uiComponents.renderHistoryList(list) : '';
      modal.classList.add('visible');
    }

    closeHistoryModal() {
      const modal = document.getElementById('history-modal');
      if (modal) modal.classList.remove('visible');
    }

    loadInvoiceIntoForm(entry) {
      this.switchView('verifier');

      const dateInput = document.getElementById('invoice-date');
      if (dateInput && entry.invoiceDate) {
        const fmt = window.Formatters || formatters;
        const formatted = (fmt.formatDateToIndian && !entry.invoiceDate.includes('/'))
          ? fmt.formatDateToIndian(entry.invoiceDate)
          : entry.invoiceDate;
        dateInput.value = formatted;
      }

      const invoiceNumberInput = document.getElementById('invoice-number');
      if (invoiceNumberInput && entry.invoiceNumber) {
        invoiceNumberInput.value = entry.invoiceNumber;
      }

      const sellerSelect = document.getElementById('seller-state');
      const buyerSelect = document.getElementById('buyer-state');
      if (sellerSelect && entry.sellerStateCode) sellerSelect.value = entry.sellerStateCode;
      if (buyerSelect && entry.buyerStateCode) buyerSelect.value = entry.buyerStateCode;

      this.updateJurisdictionUI();

      const itemsList = document.getElementById('invoice-items-list');
      if (itemsList && entry.items && entry.items.length > 0) {
        itemsList.innerHTML = '';
        this.itemCounter = 0;

        entry.items.forEach((it, idx) => {
          this.addNewItemCard();
          const card = itemsList.children[idx];
          if (card) {
            const nameIn = card.querySelector('.item-input-name');
            const hsnIn = card.querySelector('.item-input-hsn');
            const qtyIn = card.querySelector('.item-input-qty');
            const unitIn = card.querySelector('.item-input-unit');
            const unitPriceIn = card.querySelector('.item-input-unit-price');
            const taxableIn = card.querySelector('.item-input-taxable');
            const rateIn = card.querySelector('.item-input-rate');
            const gstIn = card.querySelector('.item-input-gst');

            if (nameIn) nameIn.value = it.name || it.productName || '';
            if (hsnIn) hsnIn.value = it.hsnSac || it.hsn || '';
            if (qtyIn) qtyIn.value = it.quantity || it.qty || 1;
            if (unitIn) unitIn.value = it.unit || 'Pcs';
            if (unitPriceIn) unitPriceIn.value = it.unitPrice || '';
            if (taxableIn) taxableIn.value = it.taxableAmount || it.taxable || '';
            if (rateIn) rateIn.value = it.invoiceGstRate || it.rate || 18;
            if (gstIn) gstIn.value = it.invoiceGstAmount || it.gst || '';
          }
        });
      }

      const totalInput = document.getElementById('invoice-grand-total');
      if (totalInput) totalInput.value = entry.grandTotal || '';

      this.executeInvoiceVerification();
    }

    // =========================================================================
    // RESET BUTTONS
    // =========================================================================

    setupResetButtons() {
      const resetVerifierBtn = document.getElementById('btn-reset-verifier');
      if (resetVerifierBtn) {
        resetVerifierBtn.addEventListener('click', () => {
          this.resetVerifierForm();
        });
      }

      const resetCalcBtn = document.getElementById('btn-reset-calculator');
      if (resetCalcBtn) {
        resetCalcBtn.addEventListener('click', () => {
          this.resetCalculator();
        });
      }
    }

    resetVerifierForm() {
      const dateInput = document.getElementById('invoice-date');
      if (dateInput) dateInput.value = '';

      const invoiceNumberInput = document.getElementById('invoice-number');
      if (invoiceNumberInput) invoiceNumberInput.value = '';

      const sellerSelect = document.getElementById('seller-state');
      const buyerSelect = document.getElementById('buyer-state');
      if (sellerSelect) {
        sellerSelect.value = '';
        sellerSelect.style.borderColor = '';
      }
      if (buyerSelect) {
        buyerSelect.value = '';
        buyerSelect.style.borderColor = '';
      }

      const itemsContainer = document.getElementById('invoice-items-list');
      if (itemsContainer) {
        itemsContainer.innerHTML = '';
        this.itemCounter = 0;
        this.addNewItemCard();
        const firstCard = itemsContainer.firstElementChild;
        if (firstCard) {
          const nameIn = firstCard.querySelector('.item-input-name');
          const qtyIn = firstCard.querySelector('.item-input-qty');
          const unitPriceIn = firstCard.querySelector('.item-input-unit-price');
          const taxableIn = firstCard.querySelector('.item-input-taxable');
          const rateIn = firstCard.querySelector('.item-input-rate');
          const gstIn = firstCard.querySelector('.item-input-gst');

          if (nameIn) nameIn.value = '';
          if (qtyIn) qtyIn.value = '';
          if (unitPriceIn) unitPriceIn.value = '';
          if (taxableIn) taxableIn.value = '';
          if (rateIn) rateIn.value = '';
          if (gstIn) gstIn.value = '';
        }
      }

      const grandTotalInput = document.getElementById('invoice-grand-total');
      if (grandTotalInput) {
        grandTotalInput.value = '';
        delete grandTotalInput.dataset.autoCalculated;
      }

      const resultsContainer = document.getElementById('verification-results');
      if (resultsContainer) {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        resultsContainer.classList.remove('visible');
      }

      const stepNode2 = document.getElementById('step-node-2');
      const stepNode3 = document.getElementById('step-node-3');
      const wizardBar = document.getElementById('wizard-progress-bar');
      if (stepNode2) stepNode2.classList.remove('active');
      if (stepNode3) stepNode3.classList.remove('active');
      if (wizardBar) wizardBar.style.width = '0%';

      this.updateJurisdictionUI();
      this.updateWizardStepState();
    }

    resetCalculator() {
      const amountInput = document.getElementById('calc-amount');
      if (amountInput) {
        amountInput.value = '';
        amountInput.placeholder = 'e.g. 10,000.00';
      }

      const amountLabel = document.getElementById('calc-amount-label');
      if (amountLabel) amountLabel.innerHTML = 'Taxable Amount (₹) <span class="required-mark">*</span>';

      const modeHint = document.getElementById('calc-mode-hint');
      if (modeHint) modeHint.textContent = 'GST is added separately to the base price.';

      const modeButtons = document.querySelectorAll('#calc-mode-toggle .mode-toggle-btn');
      modeButtons.forEach(b => b.classList.toggle('active', b.dataset.mode === 'exclusive'));

      const rateChips = document.querySelectorAll('#calc-rate-chips .rate-chip');
      rateChips.forEach(c => c.classList.toggle('active', c.dataset.rate === '18'));

      const customRateGroup = document.getElementById('calc-custom-rate-group');
      const customRateInput = document.getElementById('calc-custom-rate');
      if (customRateGroup) customRateGroup.style.display = 'none';
      if (customRateInput) customRateInput.value = '';

      this.calcMode = 'exclusive';
      this.calcRate = 18;
      this.recalculateGst();
    }
  }

  // Bootstrap on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.gstApp = new App();
    });
  } else {
    window.gstApp = new App();
  }
})(typeof window !== 'undefined' ? window : this);
