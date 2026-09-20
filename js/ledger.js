/**
 * 記帳核心業務邏輯與統計分析模組 (Ledger Engine) - 奶油白可愛風
 * 支援：CRUD 交易管理、手機專用卡片列表與桌面表格雙模渲染、精確刪除、圖表視覺化、Excel/CSV 匯出
 */

class LedgerManager {
  constructor() {
    this.expenses = [];
    this.filteredExpenses = [];
    this.totalBudget = 200000; // 預設 40 天總預算 20 萬台幣
    this.tripDays = 40;
    this.filterState = {
      keyword: '',
      category: 'ALL',
      currency: 'ALL',
      paymentMethod: 'ALL',
      dateFrom: '',
      dateTo: ''
    };
    
    // 圖表實例參照
    this.categoryChart = null;
    this.trendChart = null;

    this.init();
  }

  // 初始化
  async init() {
    const savedBudget = localStorage.getItem('eurotrip_total_budget');
    if (savedBudget) {
      this.totalBudget = parseFloat(savedBudget) || 200000;
    }

    // 載入支出紀錄
    await this.loadExpenses();
  }

  // 設定總預算
  setTotalBudget(amount) {
    this.totalBudget = parseFloat(amount) || 0;
    localStorage.setItem('eurotrip_total_budget', this.totalBudget.toString());
    this.renderSummary();
  }

  // 載入所有支出紀錄
  async loadExpenses() {
    this.expenses = await window.cloudSync.getExpenses();
    const hasInitialized = localStorage.getItem('eurotrip_has_initialized');

    // 只有在從未初始化過且沒有任何資料時，才注入初始範例資料一次
    if (!hasInitialized && (!this.expenses || this.expenses.length === 0)) {
      this.expenses = [
        {
          id: 'exp_demo_1',
          created_at: new Date().toISOString(),
          date: '2026-09-20',
          category: '交通',
          item_name: '波多至馬德里跨國夜巴 (ALSA)',
          currency: 'EUR',
          foreign_amount: 48.50,
          exchange_rate: 35.50,
          twd_amount: 1721.75,
          payment_method: '信用卡A (海外回饋 3% 無上限)',
          payer: '小明',
          split_type: '個人',
          city: '波多 ➔ 馬德里',
          notes: '車程 8 小時，備好頸枕與耳塞',
          trip_day: 1
        },
        {
          id: 'exp_demo_2',
          created_at: new Date().toISOString(),
          date: '2026-09-21',
          category: '餐飲',
          item_name: '馬德里聖米格爾市場 Tapas 與海鮮飯',
          currency: 'EUR',
          foreign_amount: 32.00,
          exchange_rate: 35.50,
          twd_amount: 1136.00,
          payment_method: '歐元現金 (EUR Cash)',
          payer: '均分',
          split_type: '均分',
          city: '馬德里',
          notes: '刷卡機提示選歐元結帳防 DCC 剝削',
          trip_day: 2
        },
        {
          id: 'exp_demo_3',
          created_at: new Date().toISOString(),
          date: '2026-09-22',
          category: '門票景點',
          item_name: '巴塞隆納聖家堂登塔門票 (受難立面)',
          currency: 'EUR',
          foreign_amount: 36.00,
          exchange_rate: 35.50,
          twd_amount: 1278.00,
          payment_method: '信用卡A (海外回饋 3% 無上限)',
          payer: '小明',
          split_type: '個人',
          city: '巴塞隆納',
          notes: '早鳥預訂含語音導覽',
          trip_day: 3
        },
        {
          id: 'exp_demo_4',
          created_at: new Date().toISOString(),
          date: '2026-09-28',
          category: '交通',
          item_name: '巴黎至蘇黎世 TGV Lyria 早鳥高鐵',
          currency: 'EUR',
          foreign_amount: 65.00,
          exchange_rate: 35.50,
          twd_amount: 2307.50,
          payment_method: '信用卡B (高額海外刷卡備用卡)',
          payer: '小華',
          split_type: '均分',
          city: '巴黎 ➔ 蘇黎世',
          notes: 'SNCF 官網搶購二等座',
          trip_day: 9
        },
        {
          id: 'exp_demo_5',
          created_at: new Date().toISOString(),
          date: '2026-10-02',
          category: '門票景點',
          item_name: '瑞士因特拉肯雪山跳傘 (含攝影)',
          currency: 'CHF',
          foreign_amount: 450.00,
          exchange_rate: 36.80,
          twd_amount: 16560.00,
          payment_method: '信用卡A (海外回饋 3% 無上限)',
          payer: '小明',
          split_type: '個人',
          city: '因特拉肯',
          notes: '預留前後 2 天天氣彈性緩衝',
          trip_day: 13
        }
      ];
      localStorage.setItem('eurotrip_expenses', JSON.stringify(this.expenses));
      localStorage.setItem('eurotrip_has_initialized', 'true');
    } else {
      localStorage.setItem('eurotrip_has_initialized', 'true');
    }

    this.applyFilters();
  }

  // 新增或更新支出
  async saveExpense(expenseData) {
    const saved = await window.cloudSync.saveExpense(expenseData);
    await this.loadExpenses();
    return saved;
  }

  // 刪除支出 (修正：徹底同步並重新載入)
  async deleteExpense(id) {
    await window.cloudSync.deleteExpense(id);
    this.expenses = this.expenses.filter(item => item.id !== id);
    localStorage.setItem('eurotrip_expenses', JSON.stringify(this.expenses));
    this.applyFilters();
  }

  // 設定篩選條件
  setFilters(newFilters) {
    this.filterState = { ...this.filterState, ...newFilters };
    this.applyFilters();
  }

  // 重設篩選條件
  resetFilters() {
    this.filterState = {
      keyword: '',
      category: 'ALL',
      currency: 'ALL',
      paymentMethod: 'ALL',
      dateFrom: '',
      dateTo: ''
    };
    this.applyFilters();
  }

  // 執行篩選
  applyFilters() {
    let result = [...this.expenses];

    // 關鍵字搜尋 (搜尋項目、城市、備註、付款人)
    if (this.filterState.keyword.trim()) {
      const q = this.filterState.keyword.trim().toLowerCase();
      result = result.filter(item => {
        return (item.item_name && item.item_name.toLowerCase().includes(q)) ||
               (item.city && item.city.toLowerCase().includes(q)) ||
               (item.notes && item.notes.toLowerCase().includes(q)) ||
               (item.payer && item.payer.toLowerCase().includes(q));
      });
    }

    // 類別篩選
    if (this.filterState.category && this.filterState.category !== 'ALL') {
      result = result.filter(item => item.category === this.filterState.category);
    }

    // 幣別篩選
    if (this.filterState.currency && this.filterState.currency !== 'ALL') {
      result = result.filter(item => item.currency === this.filterState.currency);
    }

    // 支付方式篩選
    if (this.filterState.paymentMethod && this.filterState.paymentMethod !== 'ALL') {
      result = result.filter(item => item.payment_method === this.filterState.paymentMethod);
    }

    // 日期區間篩選
    if (this.filterState.dateFrom) {
      result = result.filter(item => item.date >= this.filterState.dateFrom);
    }
    if (this.filterState.dateTo) {
      result = result.filter(item => item.date <= this.filterState.dateTo);
    }

    // 依日期由新至舊排序
    result.sort((a, b) => new Date(b.date) - new Date(a.date));

    this.filteredExpenses = result;
    this.renderSummary();
    this.renderList();
    this.renderCharts();
  }

  // 計算所有統計數據
  calculateStatistics() {
    let totalSpentTwd = 0;
    const currencyTotals = {};
    const categoryTotals = {};
    const dailyTotals = {};
    const uniqueDates = new Set();

    this.expenses.forEach(item => {
      const twd = parseFloat(item.twd_amount) || 0;
      totalSpentTwd += twd;

      // 幣別加總 (外幣原幣)
      const cur = item.currency || 'TWD';
      currencyTotals[cur] = (currencyTotals[cur] || 0) + (parseFloat(item.foreign_amount) || 0);

      // 類別加總 (折合 TWD)
      const cat = item.category || '其他';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + twd;

      // 每日加總
      if (item.date) {
        uniqueDates.add(item.date);
        dailyTotals[item.date] = (dailyTotals[item.date] || 0) + twd;
      }
    });

    const daysCount = Math.max(uniqueDates.size, 1);
    const dailyAvg = totalSpentTwd / daysCount;
    const remainingBudget = this.totalBudget - totalSpentTwd;
    const budgetBurnRate = this.totalBudget > 0 ? (totalSpentTwd / this.totalBudget) * 100 : 0;
    
    // 40 天進度預估 (安全每日預算)
    const remainingDays = Math.max(this.tripDays - uniqueDates.size, 1);
    const safeDailyBudget = remainingBudget > 0 ? (remainingBudget / remainingDays) : 0;

    return {
      totalSpentTwd,
      remainingBudget,
      budgetBurnRate,
      dailyAvg,
      daysRecorded: uniqueDates.size,
      safeDailyBudget,
      currencyTotals,
      categoryTotals,
      dailyTotals
    };
  }

  // 渲染頂部摘要卡片
  renderSummary() {
    const stats = this.calculateStatistics();

    const elTotalSpent = document.getElementById('stat-total-spent');
    const elTotalBudget = document.getElementById('stat-total-budget');
    const elRemaining = document.getElementById('stat-remaining-budget');
    const elProgressBar = document.getElementById('stat-budget-progress');
    const elProgressLabel = document.getElementById('stat-budget-percent');
    const elDailyAvg = document.getElementById('stat-daily-avg');
    const elSafeDaily = document.getElementById('stat-safe-daily');

    if (elTotalSpent) elTotalSpent.innerText = `NT$ ${Math.round(stats.totalSpentTwd).toLocaleString('zh-TW')}`;
    if (elTotalBudget) elTotalBudget.innerText = `NT$ ${Math.round(this.totalBudget).toLocaleString('zh-TW')}`;
    
    if (elRemaining) {
      elRemaining.innerText = `NT$ ${Math.round(stats.remainingBudget).toLocaleString('zh-TW')}`;
      if (stats.remainingBudget < 0) {
        elRemaining.className = 'text-2xl sm:text-3xl font-black font-mono text-[#FF6B6B]';
      } else if (stats.remainingBudget < this.totalBudget * 0.15) {
        elRemaining.className = 'text-2xl sm:text-3xl font-black font-mono text-[#F3B664]';
      } else {
        elRemaining.className = 'text-2xl sm:text-3xl font-black font-mono text-[#68A67D]';
      }
    }

    if (elProgressBar) {
      const clampPercent = Math.min(Math.max(stats.budgetBurnRate, 0), 100);
      elProgressBar.style.width = `${clampPercent}%`;
      if (stats.budgetBurnRate > 100) {
        elProgressBar.className = 'h-2.5 rounded-full bg-[#FF6B6B] transition-all duration-500';
      } else if (stats.budgetBurnRate > 80) {
        elProgressBar.className = 'h-2.5 rounded-full bg-[#F3B664] transition-all duration-500';
      } else {
        elProgressBar.className = 'h-2.5 rounded-full bg-[#E88D67] transition-all duration-500';
      }
    }

    if (elProgressLabel) {
      elProgressLabel.innerText = `${stats.budgetBurnRate.toFixed(1)}%`;
    }

    if (elDailyAvg) {
      elDailyAvg.innerText = `NT$ ${Math.round(stats.dailyAvg).toLocaleString('zh-TW')}`;
    }

    if (elSafeDaily) {
      elSafeDaily.innerText = `NT$ ${Math.round(stats.safeDailyBudget).toLocaleString('zh-TW')}`;
    }

    // 幣別卡片渲染
    this.renderCurrencyBadges(stats.currencyTotals);
  }

  // 渲染幣別累積卡片
  renderCurrencyBadges(currencyTotals) {
    const container = document.getElementById('stat-currency-breakdown');
    if (!container) return;

    const currencies = [
      { code: 'EUR', label: '歐元 EUR', symbol: '€', flag: '🇪🇺', color: 'border-blue-200 bg-blue-50/70 text-blue-800' },
      { code: 'CHF', label: '瑞郎 CHF', symbol: 'CHF', flag: '🇨🇭', color: 'border-red-200 bg-red-50/70 text-red-800' },
      { code: 'USD', label: '美元 USD', symbol: '$', flag: '🇺🇸', color: 'border-emerald-200 bg-emerald-50/70 text-emerald-800' },
      { code: 'CZK', label: '克朗 CZK', symbol: 'Kč', flag: '🇨🇿', color: 'border-amber-200 bg-amber-50/70 text-amber-800' },
      { code: 'PLN', label: '波蘭 PLN', symbol: 'zł', flag: '🇵🇱', color: 'border-purple-200 bg-purple-50/70 text-purple-800' },
      { code: 'GBP', label: '英鎊 GBP', symbol: '£', flag: '🇬🇧', color: 'border-orange-200 bg-orange-50/70 text-orange-800' }
    ];

    container.innerHTML = currencies.map(cur => {
      const amount = currencyTotals[cur.code] || 0;
      const rate = window.currencyManager ? window.currencyManager.getRate(cur.code) : 1;
      const twdVal = amount * rate;
      return `
        <div class="p-3.5 rounded-2xl border ${cur.color} flex flex-col justify-between shadow-sm hover:shadow transition-all">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold">${cur.flag} ${cur.label}</span>
            <span class="text-[10px] opacity-75 font-mono">匯率 ${rate.toFixed(2)}</span>
          </div>
          <div class="text-base sm:text-lg font-black font-mono my-0.5">
            ${cur.symbol} ${amount.toLocaleString('zh-TW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div class="text-[11px] opacity-80">
            約 NT$ ${Math.round(twdVal).toLocaleString('zh-TW')}
          </div>
        </div>
      `;
    }).join('');
  }

  // 渲染交易列表 (同時渲染：手機專用可愛卡片流 + 桌面端精緻表格)
  renderList() {
    const mobileContainer = document.getElementById('expense-mobile-list');
    const tableBody = document.getElementById('expense-table-body');
    const emptyState = document.getElementById('expense-empty-state');
    const countBadge = document.getElementById('filter-result-count');

    if (countBadge) {
      countBadge.innerText = `共 ${this.filteredExpenses.length} 筆帳目 ☕`;
    }

    if (this.filteredExpenses.length === 0) {
      if (mobileContainer) mobileContainer.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    const categoryBadges = {
      '交通': { icon: '🚂', bg: 'bg-blue-100 text-blue-800 border-blue-200' },
      '住宿': { icon: '🏨', bg: 'bg-purple-100 text-purple-800 border-purple-200' },
      '餐飲': { icon: '🥐', bg: 'bg-amber-100 text-amber-800 border-amber-200' },
      '門票景點': { icon: '🎟️', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      '購物': { icon: '🛍️', bg: 'bg-pink-100 text-pink-800 border-pink-200' },
      '通訊保險': { icon: '🛡️', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      '其他': { icon: '✨', bg: 'bg-stone-100 text-stone-800 border-stone-200' }
    };

    // 1. 手機端可愛卡片列表渲染
    if (mobileContainer) {
      mobileContainer.innerHTML = this.filteredExpenses.map(item => {
        const cat = categoryBadges[item.category] || categoryBadges['其他'];
        const foreignFormatted = CurrencyManager.formatAmount(item.foreign_amount, item.currency);
        const twdFormatted = `NT$ ${Math.round(item.twd_amount).toLocaleString('zh-TW')}`;

        return `
          <div class="expense-mobile-card p-4 rounded-2xl bg-white/95 border border-[#F0E6D8] shadow-sm flex flex-col justify-between gap-3">
            <!-- 頂部資訊：日期、天數、類別標籤 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-xl text-xs font-bold border ${cat.bg} flex items-center gap-1">
                  <span>${cat.icon}</span> <span>${item.category}</span>
                </span>
                ${item.trip_day ? `<span class="text-[11px] px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 font-bold border border-amber-200">Day ${item.trip_day}</span>` : ''}
              </div>
              <span class="text-xs font-semibold text-[#8C7A6B]">${item.date}</span>
            </div>

            <!-- 中間項目名稱與地點備註 -->
            <div>
              <h4 class="font-extrabold text-[#3A302A] text-base leading-snug">${escapeHtml(item.item_name)}</h4>
              <div class="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#706258]">
                ${item.city ? `<span class="inline-flex items-center gap-1 bg-[#FDF8F3] px-2 py-0.5 rounded-md border border-[#EFE4D6]">📍 ${escapeHtml(item.city)}</span>` : ''}
                ${item.payer ? `<span class="inline-flex items-center gap-1 bg-[#FDF8F3] px-2 py-0.5 rounded-md border border-[#EFE4D6]">👤 ${escapeHtml(item.payer)}</span>` : ''}
                ${item.notes ? `<span class="text-[#8C7A6B] text-[11px] truncate max-w-[200px]">💬 ${escapeHtml(item.notes)}</span>` : ''}
              </div>
            </div>

            <!-- 底部金額與操作按鈕 -->
            <div class="flex items-center justify-between pt-2.5 border-t border-[#F5ECE1]">
              <div>
                <div class="text-xs text-[#8C7A6B] font-mono font-medium">${foreignFormatted} <span class="text-[10px] text-stone-400">(匯率 ${Number(item.exchange_rate).toFixed(2)})</span></div>
                <div class="text-base font-black font-mono text-[#4A7C59]">${twdFormatted}</div>
              </div>

              <div class="flex items-center gap-1.5">
                <button onclick="window.app.openEditExpenseModal('${item.id}')" 
                        class="p-2.5 rounded-xl bg-[#FFF6EE] text-[#D96B43] hover:bg-[#FFEADA] active:scale-90 transition-transform font-bold text-xs flex items-center gap-1" 
                        title="編輯">
                  <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button onclick="window.app.askDeleteExpense('${item.id}', '${escapeHtml(item.item_name)}')" 
                        class="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 active:scale-90 transition-transform font-bold text-xs flex items-center gap-1" 
                        title="刪除">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // 2. 桌面端表格渲染
    if (tableBody) {
      tableBody.innerHTML = this.filteredExpenses.map(item => {
        const cat = categoryBadges[item.category] || categoryBadges['其他'];
        const foreignFormatted = CurrencyManager.formatAmount(item.foreign_amount, item.currency);
        const twdFormatted = `NT$ ${Math.round(item.twd_amount).toLocaleString('zh-TW')}`;

        return `
          <tr class="border-b border-[#F0E6D8] hover:bg-[#FFF9F2] transition-colors group">
            <td class="py-3.5 px-4 text-xs font-semibold text-[#5A4B40]">
              <div>${item.date}</div>
              ${item.trip_day ? `<span class="inline-block mt-0.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Day ${item.trip_day}</span>` : ''}
            </td>
            <td class="py-3.5 px-4 text-xs whitespace-nowrap">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border ${cat.bg} font-bold text-xs">
                ${cat.icon} <span>${item.category}</span>
              </span>
            </td>
            <td class="py-3.5 px-4 text-xs">
              <div class="font-bold text-[#3A302A] text-sm">${escapeHtml(item.item_name)}</div>
              <div class="flex items-center gap-2 mt-0.5 text-[11px] text-[#706258]">
                ${item.city ? `<span>📍 ${escapeHtml(item.city)}</span>` : ''}
                ${item.notes ? `<span class="truncate max-w-[200px]" title="${escapeHtml(item.notes)}">・${escapeHtml(item.notes)}</span>` : ''}
              </div>
            </td>
            <td class="py-3.5 px-4 text-xs text-right font-mono font-bold text-[#D96B43] whitespace-nowrap">
              ${foreignFormatted}
              <div class="text-[10px] font-normal text-stone-400">匯率 ${Number(item.exchange_rate).toFixed(2)}</div>
            </td>
            <td class="py-3.5 px-4 text-xs text-right font-mono font-bold text-[#4A7C59] whitespace-nowrap text-sm">
              ${twdFormatted}
            </td>
            <td class="py-3.5 px-4 text-xs text-[#5A4B40] whitespace-nowrap">
              <div class="truncate max-w-[130px] text-[11px]">${escapeHtml(item.payment_method)}</div>
              <div class="text-[10px] text-amber-700/80 font-semibold mt-0.5">👤 ${escapeHtml(item.payer || '個人')}</div>
            </td>
            <td class="py-3.5 px-4 text-right whitespace-nowrap">
              <div class="flex items-center justify-end gap-1.5">
                <button onclick="window.app.openEditExpenseModal('${item.id}')" 
                        class="p-2 rounded-lg text-[#D96B43] hover:bg-[#FFEADA] active:scale-90 transition-transform" 
                        title="編輯此筆帳目">
                  <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button onclick="window.app.askDeleteExpense('${item.id}', '${escapeHtml(item.item_name)}')" 
                        class="p-2 rounded-lg text-red-600 hover:bg-red-50 active:scale-90 transition-transform" 
                        title="刪除此筆帳目">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // 渲染圖表 (Chart.js 奶油色系配置)
  renderCharts() {
    const stats = this.calculateStatistics();

    // 1. 類別圓餅圖
    const catCanvas = document.getElementById('category-doughnut-chart');
    if (catCanvas && window.Chart) {
      const labels = Object.keys(stats.categoryTotals);
      const dataValues = Object.values(stats.categoryTotals);
      
      const categoryColorMap = {
        '交通': '#74B3CE',
        '住宿': '#B39DDB',
        '餐飲': '#FF9E7D',
        '門票景點': '#81C784',
        '購物': '#FF7B90',
        '通訊保險': '#F3B664',
        '其他': '#A3968B'
      };

      const backgroundColors = labels.map(l => categoryColorMap[l] || '#D8C7B5');

      if (this.categoryChart) {
        this.categoryChart.destroy();
      }

      this.categoryChart = new Chart(catCanvas, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: dataValues,
            backgroundColor: backgroundColors,
            borderColor: '#FFFFFF',
            borderWidth: 3,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: '#3A302A',
                font: { family: 'Plus Jakarta Sans, Noto Sans TC, sans-serif', size: 12, weight: '600' },
                boxWidth: 14,
                padding: 10
              }
            },
            tooltip: {
              backgroundColor: '#3A302A',
              padding: 10,
              cornerRadius: 10,
              callbacks: {
                label: function(context) {
                  const val = context.raw || 0;
                  const total = dataValues.reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                  return ` NT$ ${Math.round(val).toLocaleString('zh-TW')} (${pct}%)`;
                }
              }
            }
          },
          cutout: '68%'
        }
      });
    }

    // 2. 每日花費走勢長條圖
    const trendCanvas = document.getElementById('daily-trend-chart');
    if (trendCanvas && window.Chart) {
      const sortedDates = Object.keys(stats.dailyTotals).sort();
      const dailyAmounts = sortedDates.map(d => stats.dailyTotals[d]);

      if (this.trendChart) {
        this.trendChart.destroy();
      }

      this.trendChart = new Chart(trendCanvas, {
        type: 'bar',
        data: {
          labels: sortedDates.map(d => d.slice(5)), // MM-DD
          datasets: [{
            label: '當日支出 (TWD)',
            data: dailyAmounts,
            backgroundColor: 'rgba(232, 141, 103, 0.85)',
            borderColor: '#E88D67',
            borderWidth: 1,
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: { color: '#706258', font: { size: 11, weight: '500' } },
              grid: { color: 'rgba(240, 230, 216, 0.6)' }
            },
            y: {
              ticks: {
                color: '#706258',
                callback: function(value) { return 'NT$ ' + (value >= 1000 ? (value/1000) + 'k' : value); }
              },
              grid: { color: 'rgba(240, 230, 216, 0.6)' }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#3A302A',
              padding: 10,
              cornerRadius: 10,
              callbacks: {
                label: function(context) {
                  return ` 當日支出：NT$ ${Math.round(context.raw).toLocaleString('zh-TW')}`;
                }
              }
            }
          }
        }
      });
    }
  }

  // 匯出 CSV 檔案
  exportToCSV() {
    const headers = [
      '日期', '行程天數', '消費類別', '項目名稱', '幣別', 
      '外幣金額', '匯率', '折合台幣(TWD)', '支付方式', '付款人', '分攤方式', '城市/地點', '備註'
    ];

    const rows = this.expenses.map(item => [
      item.date || '',
      item.trip_day ? `Day ${item.trip_day}` : '',
      item.category || '',
      `"${(item.item_name || '').replace(/"/g, '""')}"`,
      item.currency || 'EUR',
      item.foreign_amount || 0,
      item.exchange_rate || 1,
      item.twd_amount || 0,
      `"${(item.payment_method || '').replace(/"/g, '""')}"`,
      `"${(item.payer || '').replace(/"/g, '""')}"`,
      `"${(item.split_type || '').replace(/"/g, '""')}"`,
      `"${(item.city || '').replace(/"/g, '""')}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EuroTrip_歐洲記帳明細_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

// 輔助防 XSS 函數
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 實例化全域記帳管理器
window.ledgerManager = new LedgerManager();
