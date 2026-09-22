/**
 * 應用程式核心控制器 (App Coordinator) - 奶油白可愛風
 * 負責：UI 頁籤切換、互動對話框、表單即時折算校驗、自訂刪除確認 Modal、願望清單轉記帳、通知 Toast 提示
 */

class AppController {
  constructor() {
    this.currentTab = 'dashboard';
    this.editingExpenseId = null;
    this.pendingDeleteId = null;

    this.init();
  }

  // 初始化
  async init() {
    this.setupEventListeners();
    this.setupCurrencySelectors();
    this.renderExchangeRatesPage();
    this.bindCloudSyncStatus();

    // 初始化行程與願望名產清單
    if (window.itineraryManager) {
      window.itineraryManager.init();
    }
    if (window.wishlistManager) {
      window.wishlistManager.renderAll();
    }

    // 啟動時自動嘗試拉取一次即時匯率
    window.currencyManager.fetchLiveRates().then(res => {
      if (res.success) {
        this.showToast('✨ 即時匯率已更新至最新報價', 'success');
      }
      this.renderExchangeRatesPage();
      window.ledgerManager.renderSummary();
      if (window.itineraryManager) window.itineraryManager.renderAll();
      if (window.wishlistManager) window.wishlistManager.renderAll();
    });

    // 監聽匯率與記帳連動
    window.currencyManager.onChange(() => {
      this.renderExchangeRatesPage();
      window.ledgerManager.renderSummary();
      this.updateExpenseFormTwdEstimate();
      if (window.wishlistManager) window.wishlistManager.renderAll();
    });
  }

  // 設置事件監聽
  setupEventListeners() {
    // 1. 頁籤切換 (桌面與手機底部導覽列)
    document.querySelectorAll('[data-tab-target]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-tab-target');
        this.switchTab(target);
      });
    });

    // 2. 支出表單外幣金額與幣別即時聯動換算
    const formAmount = document.getElementById('form-foreign-amount');
    const formCurrency = document.getElementById('form-currency');
    const formCustomRate = document.getElementById('form-custom-rate');
    
    if (formAmount) formAmount.addEventListener('input', () => this.updateExpenseFormTwdEstimate());
    if (formCurrency) formCurrency.addEventListener('change', () => this.handleExpenseCurrencyChange());
    if (formCustomRate) formCustomRate.addEventListener('input', () => this.updateExpenseFormTwdEstimate());

    // 3. 搜尋與過濾事件
    const searchInput = document.getElementById('search-keyword');
    const filterCat = document.getElementById('filter-category');
    const filterCur = document.getElementById('filter-currency');
    const filterDateFrom = document.getElementById('filter-date-from');
    const filterDateTo = document.getElementById('filter-date-to');
    const btnResetFilter = document.getElementById('btn-reset-filter');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        window.ledgerManager.setFilters({ keyword: e.target.value });
      });
    }
    if (filterCat) {
      filterCat.addEventListener('change', (e) => {
        window.ledgerManager.setFilters({ category: e.target.value });
      });
    }
    if (filterCur) {
      filterCur.addEventListener('change', (e) => {
        window.ledgerManager.setFilters({ currency: e.target.value });
      });
    }
    if (filterDateFrom) {
      filterDateFrom.addEventListener('change', (e) => {
        window.ledgerManager.setFilters({ dateFrom: e.target.value });
      });
    }
    if (filterDateTo) {
      filterDateTo.addEventListener('change', (e) => {
        window.ledgerManager.setFilters({ dateTo: e.target.value });
      });
    }
    if (btnResetFilter) {
      btnResetFilter.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (filterCat) filterCat.value = 'ALL';
        if (filterCur) filterCur.value = 'ALL';
        if (filterDateFrom) filterDateFrom.value = '';
        if (filterDateTo) filterDateTo.value = '';
        window.ledgerManager.resetFilters();
      });
    }

    // 4. 匯出 CSV 按鈕
    const btnExportCsv = document.getElementById('btn-export-csv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => {
        window.ledgerManager.exportToCSV();
        this.showToast('📁 已成功匯出 UTF-8 BOM CSV 明細檔案！', 'success');
      });
    }

    // 5. 快速計算機互動
    const calcAmount = document.getElementById('calc-input-amount');
    const calcFromCur = document.getElementById('calc-from-currency');
    if (calcAmount) calcAmount.addEventListener('input', () => this.runQuickCalculator());
    if (calcFromCur) calcFromCur.addEventListener('change', () => this.runQuickCalculator());

    // 6. 退稅計算機互動
    const taxCountry = document.getElementById('calc-tax-country');
    const taxAmount = document.getElementById('calc-tax-amount');
    if (taxCountry) taxCountry.addEventListener('change', () => window.wishlistManager.updateTaxCalculator());
    if (taxAmount) taxAmount.addEventListener('input', () => window.wishlistManager.updateTaxCalculator());
  }

  // 切換主要頁籤
  switchTab(tabId) {
    this.currentTab = tabId;
    
    // 隱藏所有頁籤內容
    document.querySelectorAll('.tab-content-panel').forEach(panel => {
      panel.classList.add('hidden');
    });

    // 顯示目標頁籤
    const targetPanel = document.getElementById(`tab-panel-${tabId}`);
    if (targetPanel) {
      targetPanel.classList.remove('hidden');
    }

    // 更新導覽列高亮 (桌面與手機)
    document.querySelectorAll('[data-tab-target]').forEach(btn => {
      const isCurrent = btn.getAttribute('data-tab-target') === tabId;
      if (isCurrent) {
        btn.classList.add('active-nav-tab');
        btn.classList.remove('text-[#706258]');
      } else {
        btn.classList.remove('active-nav-tab');
        btn.classList.add('text-[#706258]');
      }
    });

    // 若切換至儀表板，重新渲染圖表以修正尺寸
    if (tabId === 'dashboard') {
      window.ledgerManager.renderCharts();
    } else if (tabId === 'wishlist') {
      if (window.itineraryManager) window.itineraryManager.renderAll();
      if (window.wishlistManager) window.wishlistManager.renderAll();
    }

    // 手機平滑滾動至頂端
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 設置幣別下拉選單
  setupCurrencySelectors() {
    const currencies = window.EuroTripData.currencies;
    const formCurSelect = document.getElementById('form-currency');
    const filterCurSelect = document.getElementById('filter-currency');
    const calcCurSelect = document.getElementById('calc-from-currency');
    const wishCurSelect = document.getElementById('wish-currency-select');

    const optionsHtml = currencies.map(c => 
      `<option value="${c.code}">${c.flag} ${c.code} - ${c.name}</option>`
    ).join('');

    if (formCurSelect) formCurSelect.innerHTML = optionsHtml;
    if (calcCurSelect) calcCurSelect.innerHTML = optionsHtml;
    if (wishCurSelect) wishCurSelect.innerHTML = optionsHtml;
    if (filterCurSelect) {
      filterCurSelect.innerHTML = `<option value="ALL">全部幣別</option>` + optionsHtml;
    }
  }

  // 監聽雲端同步狀態並更新指示燈
  bindCloudSyncStatus() {
    const badge = document.getElementById('cloud-status-badge');
    const dot = document.getElementById('cloud-status-dot');
    const text = document.getElementById('cloud-status-text');

    window.cloudSync.onStatusChange((status, message) => {
      if (!badge || !dot || !text) return;

      if (status === 'synced') {
        dot.className = 'w-2 h-2 rounded-full bg-[#68A67D] animate-pulse';
        text.innerText = '雲端已同步';
        badge.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold cursor-pointer hover:bg-emerald-100 transition-all shadow-sm';
      } else if (status === 'syncing') {
        dot.className = 'w-2 h-2 rounded-full bg-[#E88D67] animate-ping';
        text.innerText = '正在同步...';
        badge.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold cursor-pointer hover:bg-orange-100 transition-all shadow-sm';
      } else if (status === 'offline') {
        dot.className = 'w-2 h-2 rounded-full bg-[#F3B664]';
        text.innerText = '離線快取中';
        badge.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold cursor-pointer hover:bg-amber-100 transition-all shadow-sm';
      } else if (status === 'error') {
        dot.className = 'w-2 h-2 rounded-full bg-[#FF6B6B]';
        text.innerText = '同步異常';
        badge.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-800 text-xs font-bold cursor-pointer hover:bg-red-100 transition-all shadow-sm';
      }
    });
  }

  // -------------------------------------------------------------
  // 記帳 Modal 與表單邏輯
  // -------------------------------------------------------------
  openAddExpenseModal(preset = {}) {
    this.editingExpenseId = null;
    const modal = document.getElementById('expense-modal');
    const title = document.getElementById('expense-modal-title');
    const form = document.getElementById('expense-form');

    if (title) title.innerText = '記下一筆新支出 ✍️';
    if (form) form.reset();

    // 預設今日日期
    const today = new Date().toISOString().slice(0, 10);
    const dateInput = document.getElementById('form-date');
    if (dateInput) dateInput.value = preset.date || today;

    // 預設幣別
    const curInput = document.getElementById('form-currency');
    if (curInput) curInput.value = preset.currency || 'EUR';

    // 預設項目名稱與金額
    if (preset.item_name) document.getElementById('form-item-name').value = preset.item_name;
    if (preset.foreign_amount) document.getElementById('form-foreign-amount').value = preset.foreign_amount;
    if (preset.category) document.getElementById('form-category').value = preset.category;
    if (preset.city) document.getElementById('form-city').value = preset.city;
    if (preset.notes) document.getElementById('form-notes').value = preset.notes;

    this.handleExpenseCurrencyChange();
    this.updateExpenseFormTwdEstimate();

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  openEditExpenseModal(id) {
    const item = window.ledgerManager.expenses.find(e => e.id === id);
    if (!item) return;

    this.editingExpenseId = id;
    const modal = document.getElementById('expense-modal');
    const title = document.getElementById('expense-modal-title');

    if (title) title.innerText = '編輯支出項目 ✏️';

    document.getElementById('form-date').value = item.date || '';
    document.getElementById('form-trip-day').value = item.trip_day || '';
    document.getElementById('form-category').value = item.category || '交通';
    document.getElementById('form-item-name').value = item.item_name || '';
    document.getElementById('form-currency').value = item.currency || 'EUR';
    document.getElementById('form-foreign-amount').value = item.foreign_amount || '';
    document.getElementById('form-custom-rate').value = item.exchange_rate || '';
    document.getElementById('form-payment-method').value = item.payment_method || '信用卡A (海外回饋 3% 無上限)';
    document.getElementById('form-payer').value = item.payer || '個人';
    document.getElementById('form-split-type').value = item.split_type || '個人';
    document.getElementById('form-city').value = item.city || '';
    document.getElementById('form-notes').value = item.notes || '';

    this.updateExpenseFormTwdEstimate();

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeExpenseModal() {
    const modal = document.getElementById('expense-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    this.editingExpenseId = null;
  }

  handleExpenseCurrencyChange() {
    const currency = document.getElementById('form-currency').value;
    const rateInput = document.getElementById('form-custom-rate');
    const currentRate = window.currencyManager.getRate(currency);
    
    if (rateInput) {
      rateInput.value = currentRate;
    }
    this.updateExpenseFormTwdEstimate();
  }

  updateExpenseFormTwdEstimate() {
    const amountInput = document.getElementById('form-foreign-amount');
    const rateInput = document.getElementById('form-custom-rate');
    const curSelect = document.getElementById('form-currency');
    const twdDisplay = document.getElementById('form-twd-display');

    if (!amountInput || !twdDisplay) return;

    const amount = parseFloat(amountInput.value) || 0;
    const currency = curSelect ? curSelect.value : 'EUR';
    let rate = parseFloat(rateInput ? rateInput.value : 0);
    
    if (!rate || rate <= 0) {
      rate = window.currencyManager.getRate(currency);
    }

    const twd = Math.round((amount * rate + Number.EPSILON) * 100) / 100;
    twdDisplay.innerText = `折合 NT$ ${Math.round(twd).toLocaleString('zh-TW')} (匯率 1 ${currency} ≈ ${rate.toFixed(2)} TWD)`;
  }

  async handleExpenseFormSubmit(e) {
    e.preventDefault();

    const date = document.getElementById('form-date').value;
    const tripDay = parseInt(document.getElementById('form-trip-day').value) || null;
    const category = document.getElementById('form-category').value;
    const itemName = document.getElementById('form-item-name').value.trim();
    const currency = document.getElementById('form-currency').value;
    const foreignAmount = parseFloat(document.getElementById('form-foreign-amount').value);
    const rate = parseFloat(document.getElementById('form-custom-rate').value) || window.currencyManager.getRate(currency);
    const paymentMethod = document.getElementById('form-payment-method').value;
    const payer = document.getElementById('form-payer').value.trim() || '個人';
    const splitType = document.getElementById('form-split-type').value;
    const city = document.getElementById('form-city').value.trim();
    const notes = document.getElementById('form-notes').value.trim();

    // 表單校驗
    if (!date) {
      this.showToast('請選擇消費日期 📅', 'warning');
      return;
    }
    if (!itemName) {
      this.showToast('請輸入消費項目名稱 📝', 'warning');
      return;
    }
    if (isNaN(foreignAmount) || foreignAmount <= 0) {
      this.showToast('請輸入大於 0 的金額 💰', 'warning');
      return;
    }

    const twdAmount = Math.round((foreignAmount * rate + Number.EPSILON) * 100) / 100;

    const expenseData = {
      id: this.editingExpenseId || undefined,
      date,
      trip_day: tripDay,
      category,
      item_name: itemName,
      currency,
      foreign_amount: foreignAmount,
      exchange_rate: rate,
      twd_amount: twdAmount,
      payment_method: paymentMethod,
      payer,
      split_type: splitType,
      city,
      notes
    };

    try {
      await window.ledgerManager.saveExpense(expenseData);
      this.closeExpenseModal();
      this.showToast(this.editingExpenseId ? '✨ 帳目已成功更新！' : '🎉 新增記帳成功！', 'success');
    } catch (err) {
      this.showToast(`儲存失敗: ${err.message}`, 'error');
    }
  }

  // -------------------------------------------------------------
  // 自訂可愛刪除確認 Modal
  // -------------------------------------------------------------
  askDeleteExpense(id, itemName) {
    this.pendingDeleteId = id;
    const modal = document.getElementById('delete-confirm-modal');
    const textEl = document.getElementById('delete-modal-item-text');
    
    if (textEl) {
      textEl.innerText = itemName ? `「${itemName}」` : '這筆帳目';
    }

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeDeleteModal() {
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    this.pendingDeleteId = null;
  }

  async executeDeleteExpense() {
    if (!this.pendingDeleteId) return;
    const id = this.pendingDeleteId;
    this.closeDeleteModal();

    try {
      await window.ledgerManager.deleteExpense(id);
      this.showToast('🗑️ 帳目已成功刪除！', 'info');
    } catch (err) {
      this.showToast(`刪除失敗: ${err.message}`, 'error');
    }
  }

  // -------------------------------------------------------------
  // 即時匯率管理與計算機
  // -------------------------------------------------------------
  renderExchangeRatesPage() {
    const listContainer = document.getElementById('exchange-rates-grid');
    const updateTimeEl = document.getElementById('rates-last-updated-time');

    if (updateTimeEl) {
      const t = window.currencyManager.lastUpdated;
      updateTimeEl.innerText = t ? `最後線上更新：${t.toLocaleTimeString('zh-TW')} (${t.toLocaleDateString('zh-TW')})` : '使用預設安全匯率';
    }

    if (!listContainer) return;

    const currencies = window.EuroTripData.currencies;
    const effectiveRates = window.currencyManager.getEffectiveRates();

    listContainer.innerHTML = currencies.map(c => {
      const rateInfo = effectiveRates[c.code] || { rate: c.defaultRate, isCustom: false };
      const isTwd = c.code === 'TWD';

      return `
        <div class="cream-card p-4 sm:p-5 flex flex-col justify-between ${rateInfo.isCustom ? 'border-[#F3B664] bg-[#FFFBF2]' : ''}">
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl">${c.flag}</span>
                <div>
                  <div class="font-black text-[#3A302A] text-sm">${c.code}</div>
                  <div class="text-[11px] text-[#706258]">${c.name}</div>
                </div>
              </div>
              ${rateInfo.isCustom ? `
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                  自訂匯率
                </span>
              ` : `
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-bold">
                  即時匯率
                </span>
              `}
            </div>
            
            <div class="my-3">
              <div class="text-[11px] text-[#8C7A6B] mb-0.5">1 ${c.code} ≈</div>
              <div class="text-2xl font-black font-mono text-[#4A7C59]">
                ${rateInfo.rate.toFixed(4)} <span class="text-xs font-sans font-bold text-[#8C7A6B]">TWD</span>
              </div>
            </div>

            <p class="text-[11px] text-[#706258] mb-3">
              📍 適用：${c.countries}
            </p>
          </div>

          ${!isTwd ? `
            <div class="pt-2.5 border-t border-[#F0E6D8] flex items-center justify-between gap-2">
              <button onclick="window.app.promptCustomRate('${c.code}')" 
                      class="text-xs px-2.5 py-1 rounded-xl bg-[#FFF6EE] hover:bg-[#FFEADA] text-[#D96B43] font-bold transition-colors btn-cute">
                ✏️ 修改
              </button>
              ${rateInfo.isCustom ? `
                <button onclick="window.app.resetSingleCustomRate('${c.code}')" 
                        class="text-xs px-2 py-1 rounded-xl text-red-600 hover:bg-red-50 font-bold transition-colors"
                        title="還原為線上即時匯率">
                  還原即時
                </button>
              ` : ''}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    this.runQuickCalculator();
  }

  promptCustomRate(code) {
    const current = window.currencyManager.getRate(code);
    const input = prompt(`請輸入 1 ${code} 兌換新台幣 (TWD) 的自訂匯率：`, current);
    if (input !== null) {
      const val = parseFloat(input);
      if (!isNaN(val) && val > 0) {
        window.currencyManager.setCustomRate(code, val);
        this.showToast(`✨ ${code} 匯率已手動設定為 ${val}`, 'success');
      } else {
        this.showToast('請輸入大於 0 的有效數字', 'warning');
      }
    }
  }

  resetSingleCustomRate(code) {
    window.currencyManager.resetCustomRates(code);
    this.showToast(`已還原 ${code} 為線上即時匯率`, 'info');
  }

  async refreshRatesOnline() {
    this.showToast('🔄 正在連線最新國際匯率報價...', 'info');
    const res = await window.currencyManager.fetchLiveRates();
    if (res.success) {
      this.showToast('✅ 即時匯率更新成功！', 'success');
    } else {
      this.showToast(res.error, 'warning');
    }
    this.renderExchangeRatesPage();
  }

  runQuickCalculator() {
    const amountInput = document.getElementById('calc-input-amount');
    const curSelect = document.getElementById('calc-from-currency');
    const resultDisplay = document.getElementById('calc-output-twd');
    const rateNote = document.getElementById('calc-rate-note');

    if (!amountInput || !resultDisplay) return;

    const amount = parseFloat(amountInput.value) || 0;
    const currency = curSelect ? curSelect.value : 'EUR';
    const rate = window.currencyManager.getRate(currency);
    const twd = Math.round((amount * rate + Number.EPSILON) * 100) / 100;

    resultDisplay.innerText = `NT$ ${Math.round(twd).toLocaleString('zh-TW')}`;
    if (rateNote) {
      rateNote.innerText = `當前生效匯率：1 ${currency} = ${rate.toFixed(4)} TWD`;
    }
  }

  // -------------------------------------------------------------
  // 雲端與資料庫設定 Modal
  // -------------------------------------------------------------
  openCloudSettingsModal() {
    const modal = document.getElementById('cloud-settings-modal');
    if (!modal) return;

    const currentMode = window.cloudSync.storageMode;
    const modeRadio = document.querySelector(`input[name="storage-mode"][value="${currentMode}"]`);
    if (modeRadio) modeRadio.checked = true;

    document.getElementById('setting-supabase-url').value = window.cloudSync.supabaseConfig.url || '';
    document.getElementById('setting-supabase-key').value = window.cloudSync.supabaseConfig.anonKey || '';
    document.getElementById('setting-gsheet-url').value = window.cloudSync.googleSheetConfig.webAppUrl || '';
    document.getElementById('setting-total-budget').value = window.ledgerManager.totalBudget || 200000;

    this.toggleBackendSettingsFields(currentMode);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  closeCloudSettingsModal() {
    const modal = document.getElementById('cloud-settings-modal');
    if (!modal) return;

    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  toggleBackendSettingsFields(mode) {
    const supaDiv = document.getElementById('settings-supabase-fields');
    const gsheetDiv = document.getElementById('settings-gsheet-fields');

    if (supaDiv) supaDiv.classList.toggle('hidden', mode !== 'supabase');
    if (gsheetDiv) gsheetDiv.classList.toggle('hidden', mode !== 'google_sheet');
  }

  async saveCloudSettings(e) {
    e.preventDefault();
    const mode = document.querySelector('input[name="storage-mode"]:checked').value;
    const supaUrl = document.getElementById('setting-supabase-url').value;
    const supaKey = document.getElementById('setting-supabase-key').value;
    const gsheetUrl = document.getElementById('setting-gsheet-url').value;
    const budget = parseFloat(document.getElementById('setting-total-budget').value) || 200000;

    window.ledgerManager.setTotalBudget(budget);

    const config = {
      url: supaUrl,
      anonKey: supaKey,
      webAppUrl: gsheetUrl
    };

    this.showToast('🔄 正在測試並同步雲端數據...', 'info');
    const res = await window.cloudSync.configureBackend(mode, config);
    
    if (res.success) {
      this.showToast('✅ 雲端設定成功並完成資料庫同步！', 'success');
      await window.ledgerManager.loadExpenses();
      this.closeCloudSettingsModal();
    } else {
      this.showToast(`連線提示: ${res.error || '已先儲存本機'}`, 'warning');
      this.closeCloudSettingsModal();
    }
  }

  // -------------------------------------------------------------
  // Toast 通知提醒元件 (可愛馬卡龍色系)
  // -------------------------------------------------------------
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const colorMap = {
      success: 'bg-[#EBF7EE] border-[#B7E4C7] text-[#2D6A4F]',
      error: 'bg-[#FFEBEE] border-[#FFCDD2] text-[#C62828]',
      warning: 'bg-[#FFF8E1] border-[#FFE082] text-[#F57F17]',
      info: 'bg-[#FFF5ED] border-[#FCD5B5] text-[#D96B43]'
    };

    toast.className = `flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-lg text-xs sm:text-sm font-bold transition-all duration-300 transform translate-y-2 opacity-0 ${colorMap[type] || colorMap.info}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// 頁面載入完成後啟動應用程式
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
