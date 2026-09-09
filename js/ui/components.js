(function(window) {
  'use strict';

  const formatters = typeof Formatters !== 'undefined' ? Formatters : (window.Formatters || {});

  const UIComponents = {
    /**
     * Render complete invoice verification report
     * Shows Transaction Type, Expected GST, GST Charged on Invoice, Difference, and Result.
     * @param {object} report - output from VerifierService.verifyInvoice()
     * @returns {string} HTML string
     */
    renderVerificationResult(report) {
      if (!report || !report.summary) return '';

      const { summary, items, jurisdiction, invoiceDate, invoiceNumber } = report;
      const formatINR = formatters.formatINR || (n => `₹${Number(n || 0).toFixed(2)}`);
      const displayDate = formatters.formatDateToIndian ? formatters.formatDateToIndian(invoiceDate) : (invoiceDate || 'N/A');
      const currentTimestamp = new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      const isMatch = summary.overallVerdict === 'MATCH';
      const summaryCardClass = isMatch ? 'match' : 'mismatch';
      const summaryIcon = isMatch ? '✅' : '⚠️';
      const verdictBadgeClass = isMatch ? 'badge-success' : 'badge-warning';

      // Build Item Breakdown Table Rows (Simple, Clean, Borderless)
      let tableRows = '';
      items.forEach((item) => {
        const itemMathOk = item.calculationCheck.status === 'MATCH';
        const mathStatus = itemMathOk
          ? `<span style="font-family:var(--font-mono); font-weight:600; color:var(--text-primary);">${formatINR(item.invoiceGstAmount)}</span>`
          : `<span style="font-family:var(--font-mono); color:var(--status-error-text); font-weight:700;">${formatINR(item.invoiceGstAmount)}</span> <span style="font-size:0.75rem; color:var(--text-muted); display:block;">(Exp: ${formatINR(item.expectedGst)})</span>`;

        let taxSplitText = '';
        if (item.taxBreakdown.isInterState) {
          taxSplitText = `<div><strong>IGST:</strong> ${formatINR(item.taxBreakdown.expectedIgst)}</div><div style="font-size:0.75rem; color:var(--text-secondary);">Inter-State (100%)</div>`;
        } else {
          taxSplitText = `<div><strong>CGST:</strong> ${formatINR(item.taxBreakdown.expectedCgst)} | <strong>SGST:</strong> ${formatINR(item.taxBreakdown.expectedSgst)}</div><div style="font-size:0.75rem; color:var(--text-secondary);">Intra-State (50% + 50%)</div>`;
        }

        tableRows += `
          <tr style="border:none;">
            <td style="padding:0.85rem 1rem; border:none; vertical-align:top; font-weight:700; color:var(--ocean-dark);">${item.itemNumber}</td>
            <td style="padding:0.85rem 1rem; border:none; vertical-align:top;">
              <div style="font-weight:700; color:var(--text-primary); font-size:0.95rem;">${item.productName}</div>
              <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">
                HSN/SAC: <strong style="color:var(--ocean-deep);">${item.hsnSac}</strong> &bull; Qty: ${item.quantity} ${item.unit}
              </div>
            </td>
            <td style="padding:0.85rem 1rem; border:none; vertical-align:top; text-align:right; font-family:var(--font-mono); font-weight:600;">
              ${formatINR(item.taxableAmount)}
            </td>
            <td style="padding:0.85rem 1rem; border:none; vertical-align:top; text-align:center; font-weight:700; color:var(--text-primary);">
              ${item.invoiceGstRate}%
            </td>
            <td style="padding:0.85rem 1rem; border:none; vertical-align:top; text-align:right; font-family:var(--font-mono); font-weight:600;">
              ${formatINR(item.expectedGst)}
            </td>
            <td style="padding:0.85rem 1rem; border:none; vertical-align:top; text-align:right;">
              ${mathStatus}
            </td>
            <td style="padding:0.85rem 1rem; border:none; vertical-align:top; text-align:right; font-family:var(--font-mono); font-weight:600; color:${item.difference > 0 ? 'var(--status-error-text)' : 'inherit'};">
              ${formatINR(item.difference)}
            </td>
            <td style="padding:0.85rem 1rem; border:none; vertical-align:top; font-size:0.85rem;">
              ${taxSplitText}
            </td>
          </tr>
        `;
      });

      // Distinct GST rates calculation
      const validRates = items
        .map(i => parseFloat(i.invoiceGstRate))
        .filter(r => !isNaN(r) && r >= 0);
      const distinctRates = [...new Set(validRates)];
      let ratesDisplay = '—';
      if (distinctRates.length === 1) {
        ratesDisplay = `${distinctRates[0]}%`;
      } else if (distinctRates.length > 1) {
        ratesDisplay = distinctRates.map(r => `${r}%`).join(', ');
      }

      return `
        <!-- Action Toolbar -->
        <div class="result-action-toolbar no-print" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-bottom:1.25rem; background:var(--ocean-tint); padding:0.75rem 1.25rem; border-radius:var(--radius-md); border:none;">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-weight:700; color:var(--text-primary); font-size:0.95rem;">⚡ Verification Summary:</span>
            <span class="badge ${verdictBadgeClass}">${isMatch ? '✓ Verified' : '⚠️ Discrepancy Found'}</span>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button type="button" class="btn btn-primary btn-sm" id="btn-print-audit-report" title="Print this verification result or save as PDF">
              <span>📄</span> Export PDF
            </button>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-copy-audit-summary" title="Copy verification summary text to clipboard">
              <span>📋</span> Copy Summary
            </button>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-open-history-from-report" title="View saved verifications">
              <span>📜</span> View History
            </button>
          </div>
        </div>

        <!-- Main Verification Summary Card -->
        <div class="result-summary-card ${summaryCardClass}" style="border:none; box-shadow:none; margin-bottom:1.25rem;">
          <div class="result-icon">${summaryIcon}</div>
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem;">
              <h3 class="result-summary-title" style="color:var(--text-primary); margin:0;">${summary.verdictTitle}</h3>
              <span class="badge ${verdictBadgeClass}" style="font-weight:700; font-size:0.85rem;">
                ${isMatch ? 'GST MATCH' : 'GST MISMATCH'}
              </span>
            </div>
            <p class="result-summary-desc" style="margin:0.35rem 0 0.75rem 0; font-size:0.95rem; font-weight:500;">
              ${summary.verdictMessage}
            </p>

            <!-- Key 4-Point Verification Overview Matrix -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.75rem; background:#ffffff; padding:0.9rem 1.1rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); margin-top:0.5rem;">
              <div>
                <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Transaction Type</div>
                <div style="font-weight:700; color:var(--ocean-deep); font-size:1rem; margin-top:2px;">
                  ${summary.transactionTypeLabel}
                </div>
                <div style="font-size:0.75rem; color:var(--text-secondary);">${jurisdiction.isInterState ? 'IGST Applies' : 'CGST + SGST Applies'}</div>
              </div>
              <div>
                <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Expected GST</div>
                <div style="font-family:var(--font-mono); font-weight:700; color:var(--ocean-dark); font-size:1.1rem; margin-top:2px;">
                  ${formatINR(summary.totalExpectedGst)}
                </div>
                <div style="font-size:0.75rem; color:var(--text-secondary);">Taxable × Rate ÷ 100</div>
              </div>
              <div>
                <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">GST Charged on Invoice</div>
                <div style="font-family:var(--font-mono); font-weight:700; color:${isMatch ? 'var(--status-success-text)' : 'var(--status-warning-text)'}; font-size:1.1rem; margin-top:2px;">
                  ${formatINR(summary.totalInvoiceGst)}
                </div>
                <div style="font-size:0.75rem; color:var(--text-secondary);">From Invoice</div>
              </div>
              <div>
                <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Difference</div>
                <div style="font-family:var(--font-mono); font-weight:800; color:${summary.gstDifference > 0 ? 'var(--status-error-text)' : 'var(--status-success-text)'}; font-size:1.1rem; margin-top:2px;">
                  ${formatINR(summary.gstDifference)}
                </div>
                <div style="font-size:0.75rem; color:var(--text-secondary);">${summary.gstDifference === 0 ? 'Exact Match' : 'Discrepancy'}</div>
              </div>
            </div>

            <!-- Context Badges -->
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.75rem;">
              <span class="badge badge-info">📅 Date: ${displayDate}</span>
              ${invoiceNumber ? `<span class="badge badge-info">🧾 Invoice #: ${invoiceNumber}</span>` : ''}
              <span class="badge badge-info">📍 ${jurisdiction.label}</span>
              <span class="badge ${summary.totalCheck.status === 'MATCH' ? 'badge-success' : 'badge-warning'}">
                💵 Grand Total: ${formatINR(summary.invoiceGrandTotal)}
              </span>
            </div>
          </div>
        </div>

        <!-- Simple Borderless Verification Table (Without Result Column) -->
        <div class="simple-table-wrapper">
          <table class="simple-borderless-table" style="border:none;">
            <thead>
              <tr style="border:none;">
                <th style="width:4%; border:none;">#</th>
                <th style="width:28%; border:none;">Item Description</th>
                <th style="width:13%; text-align:right; border:none;">Taxable Value</th>
                <th style="width:9%; text-align:center; border:none;">GST Rate</th>
                <th style="width:13%; text-align:right; border:none;">Expected GST</th>
                <th style="width:13%; text-align:right; border:none;">GST Charged</th>
                <th style="width:10%; text-align:right; border:none;">Difference</th>
                <th style="width:10%; border:none;">Tax Split</th>
              </tr>
            </thead>
            <tbody style="border:none;">
              ${tableRows}
            </tbody>
            <tfoot style="border:none;">
              <tr style="background:var(--ocean-tint); font-weight:700; border:none;">
                <td colspan="2" style="border:none;">Total (${items.length} ${items.length === 1 ? 'Item' : 'Items'})</td>
                <td style="border:none; text-align:right; font-family:var(--font-mono);">${formatINR(summary.totalTaxable)}</td>
                <td style="border:none; text-align:center; font-family:var(--font-mono); font-weight:700;">${ratesDisplay}</td>
                <td style="border:none; text-align:right; font-family:var(--font-mono);">${formatINR(summary.totalExpectedGst)}</td>
                <td style="border:none; text-align:right; font-family:var(--font-mono); color:${isMatch ? 'inherit' : 'var(--status-warning-text)'};">${formatINR(summary.totalInvoiceGst)}</td>
                <td style="border:none; text-align:right; font-family:var(--font-mono); color:${summary.gstDifference > 0 ? 'var(--status-error-text)' : 'inherit'};">${formatINR(summary.gstDifference)}</td>
                <td style="border:none; font-size:0.85rem; font-weight:normal;">${summary.transactionTypeLabel}</td>
              </tr>
              <tr style="background:var(--ocean-light); font-weight:800; font-size:0.95rem; color:var(--ocean-deep); border:none;">
                <td colspan="2" style="border:none;">Grand Total Invoice Amount</td>
                <td style="border:none; text-align:right; font-family:var(--font-mono);">${formatINR(summary.totalTaxable)}</td>
                <td style="border:none; text-align:center; font-family:var(--font-mono); font-weight:800; color:var(--ocean-deep);">${ratesDisplay}</td>
                <td style="border:none; text-align:right; font-family:var(--font-mono);">${formatINR(summary.totalExpectedGst)}</td>
                <td style="border:none; text-align:right; font-family:var(--font-mono);">${formatINR(summary.totalInvoiceGst)}</td>
                <td style="border:none; text-align:right; font-family:var(--font-mono); color:${summary.gstDifference > 0 ? 'var(--status-error-text)' : 'inherit'};">${formatINR(summary.gstDifference)}</td>
                <td style="border:none; text-align:right; font-family:var(--font-mono); font-size:1.05rem; color:var(--ocean-dark);">${formatINR(summary.invoiceGrandTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        ${this.renderGstinReport(report.sellerGstinReport, report.buyerGstinReport)}

        <!-- Informational Disclaimer Box -->
        <div style="margin-top:1.25rem; font-size:0.8rem; color:var(--text-secondary); background:var(--ocean-light); padding:0.85rem 1rem; border-radius:var(--radius-sm); line-height:1.45; border:1px solid #bce1e1;">
          <strong>Disclaimer:</strong> GST Verifier is an informational calculation-verification tool. Results are based on the invoice information entered by the user and the calculation rules implemented in the application. Product classification, exemptions, conditions, place-of-supply rules, and other transaction-specific provisions may affect the actual GST treatment. This tool does not constitute legal, accounting, or tax advice.
        </div>
      `;
    },

    /**
     * Render GSTIN & Entity Details (Optional / When Entered)
     * @param {object|null} sellerGstinReport
     * @param {object|null} buyerGstinReport
     * @returns {string} HTML string
     */
    renderGstinReport(sellerGstinReport, buyerGstinReport) {
      if (!sellerGstinReport && !buyerGstinReport) return '';

      let html = `
        <div style="margin-top:1.25rem; padding:1rem 1.25rem; background:var(--ocean-tint); border-radius:var(--radius-md); border:none;">
          <h4 style="font-family:var(--font-heading); font-size:0.95rem; font-weight:700; margin-bottom:0.75rem; color:var(--text-primary); display:flex; align-items:center; gap:0.5rem;">
            <span>🏛️</span> GSTIN & Entity Details
          </h4>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem;">
      `;

      if (sellerGstinReport) {
        const isOk = sellerGstinReport.status === 'VALID';
        const badgeClass = isOk ? 'badge-success' : (sellerGstinReport.status === 'WARNING' ? 'badge-warning' : 'badge-error');
        const badgeText = isOk ? '✅ Valid GSTIN' : (sellerGstinReport.status === 'WARNING' ? '⚠️ Check Required' : '❌ Invalid Format');

        html += `
          <div style="background:#ffffff; padding:0.85rem; border-radius:var(--radius-sm); border:none;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
              <span style="font-size:0.85rem; color:var(--ocean-deep);">Seller: <strong>${sellerGstinReport.gstin}</strong></span>
              <span class="badge ${badgeClass}">${badgeText}</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:0.2rem;">
              <div><strong>State:</strong> ${sellerGstinReport.stateName || 'Unknown'} (Code ${sellerGstinReport.stateCode || '-'})</div>
              <div><strong>Entity Type:</strong> ${sellerGstinReport.entityType || 'Registered Entity'}</div>
              <div><strong>Checksum:</strong> ${sellerGstinReport.isChecksumValid ? '✓ Verified (Modulo 36)' : '⚠️ Checksum Mismatch'}</div>
              <div style="margin-top:0.25rem; color:var(--text-primary);">${sellerGstinReport.message}</div>
            </div>
          </div>
        `;
      }

      if (buyerGstinReport) {
        const isOk = buyerGstinReport.status === 'VALID';
        const badgeClass = isOk ? 'badge-success' : (buyerGstinReport.status === 'WARNING' ? 'badge-warning' : 'badge-error');
        const badgeText = isOk ? '✅ Valid GSTIN' : (buyerGstinReport.status === 'WARNING' ? '⚠️ Check Required' : '❌ Invalid Format');

        html += `
          <div style="background:#ffffff; padding:0.85rem; border-radius:var(--radius-sm); border:none;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
              <span style="font-size:0.85rem; color:var(--ocean-deep);">Buyer: <strong>${buyerGstinReport.gstin}</strong></span>
              <span class="badge ${badgeClass}">${badgeText}</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:0.2rem;">
              <div><strong>State:</strong> ${buyerGstinReport.stateName || 'Unknown'} (Code ${buyerGstinReport.stateCode || '-'})</div>
              <div><strong>Entity Type:</strong> ${buyerGstinReport.entityType || 'Registered Entity'}</div>
              <div><strong>Checksum:</strong> ${buyerGstinReport.isChecksumValid ? '✓ Verified (Modulo 36)' : '⚠️ Checksum Mismatch'}</div>
              <div style="margin-top:0.25rem; color:var(--text-primary);">${buyerGstinReport.message}</div>
            </div>
          </div>
        `;
      }

      html += `
          </div>
        </div>
      `;

      return html;
    },

    /**
     * Render saved invoice history list for modal
     * @param {Array<object>} historyEntries
     * @returns {string} HTML string
     */
    renderHistoryList(historyEntries) {
      if (!historyEntries || historyEntries.length === 0) {
        return `
          <div style="text-align:center; padding:3rem 1.5rem; color:var(--text-secondary);">
            <div style="font-size:3rem; margin-bottom:0.5rem;">📜</div>
            <h4 style="font-family:var(--font-heading); font-size:1.15rem; color:var(--text-primary); margin-bottom:0.35rem;">No Saved Invoices Yet</h4>
            <p style="font-size:0.875rem;">When you verify an invoice, it will be automatically saved here for quick reload, printing, and reference.</p>
          </div>
        `;
      }

      const formatINR = formatters.formatINR || (n => `₹${Number(n || 0).toFixed(2)}`);

      let html = `<div style="display:flex; flex-direction:column; gap:0.75rem;">`;

      historyEntries.forEach((entry) => {
        const isMatch = entry.verdict === 'MATCH' || entry.verdict === 'VERIFIED';
        const badgeClass = isMatch ? 'badge-success' : 'badge-warning';
        const formattedDate = entry.invoiceDate ? (entry.invoiceDate.includes('/') ? entry.invoiceDate : (formatters.formatDateToIndian ? formatters.formatDateToIndian(entry.invoiceDate) : entry.invoiceDate)) : 'N/A';
        const savedTime = entry.timestamp ? new Date(entry.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

        html += `
          <div class="glass-panel history-item-card" style="padding:1rem 1.25rem; background:#ffffff; border:1.5px solid var(--border-subtle); border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
            <div style="flex:1; min-width:240px;">
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem; flex-wrap:wrap;">
                <span class="badge ${badgeClass}" style="font-size:0.75rem;">${entry.verdictTitle || (isMatch ? 'GST Match' : 'GST Mismatch')}</span>
                <span style="font-size:0.85rem; font-weight:700; color:var(--text-primary);">📅 Date: ${formattedDate}</span>
                ${entry.invoiceNumber ? `<span style="font-size:0.8rem; color:var(--ocean-deep); font-weight:600;">🧾 #${entry.invoiceNumber}</span>` : ''}
                <span style="font-size:0.75rem; color:var(--text-muted);">&bull; Saved: ${savedTime}</span>
              </div>
              <div style="font-size:0.825rem; color:var(--text-secondary); display:flex; gap:0.75rem; flex-wrap:wrap;">
                <span>📦 <strong>${entry.items ? entry.items.length : 1}</strong> Item(s)</span>
                <span>💵 Total: <strong style="color:var(--ocean-deep); font-family:var(--font-mono);">${formatINR(entry.grandTotal || 0)}</strong></span>
                ${entry.sellerGstin ? `<span>🏛️ Seller: ${entry.sellerGstin}</span>` : ''}
              </div>
            </div>
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <button type="button" class="btn btn-secondary btn-sm btn-load-history" data-id="${entry.id}" title="Load this invoice data into verifier form">
                <span>🔄</span> Load into Form
              </button>
              <button type="button" class="btn btn-secondary btn-sm btn-delete-history" data-id="${entry.id}" title="Delete this saved invoice" style="color:var(--status-error-text); border-color:var(--status-error-border);">
                <span>🗑️</span>
              </button>
            </div>
          </div>
        `;
      });

      html += `</div>`;
      return html;
    }
  };

  // Expose on window for direct file:/// script loading
  if (typeof window !== 'undefined') {
    window.UIComponents = UIComponents;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIComponents };
  }
})(typeof window !== 'undefined' ? window : this);
