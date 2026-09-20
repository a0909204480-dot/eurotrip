/**
 * 雲端持久化與多端同步模組 (Cloud Persistence Engine)
 * 支援：
 * 1. Supabase (PostgreSQL + Realtime API)
 * 2. Google Sheets Web App (Google Apps Script REST API)
 * 3. 本地 LocalStorage 快取與離線寫入隊列 (Offline-First)
 */

class CloudSyncManager {
  constructor() {
    this.storageMode = 'local'; // 'local' | 'supabase' | 'google_sheet'
    this.supabaseConfig = {
      url: '',
      anonKey: ''
    };
    this.googleSheetConfig = {
      webAppUrl: ''
    };
    this.supabaseClient = null;
    this.syncStatus = 'synced'; // 'synced' | 'syncing' | 'offline' | 'error'
    this.lastSyncTime = null;
    this.offlineQueue = [];
    this.statusListeners = [];
    this.dataChangeListeners = [];

    this.init();
  }

  // 初始化載入使用者儲存偏好
  init() {
    try {
      const savedMode = localStorage.getItem('eurotrip_storage_mode');
      if (savedMode) this.storageMode = savedMode;

      const savedSupa = localStorage.getItem('eurotrip_supabase_config');
      if (savedSupa) this.supabaseConfig = JSON.parse(savedSupa);

      const savedGSheet = localStorage.getItem('eurotrip_gsheet_config');
      if (savedGSheet) this.googleSheetConfig = JSON.parse(savedGSheet);

      const savedQueue = localStorage.getItem('eurotrip_offline_queue');
      if (savedQueue) this.offlineQueue = JSON.parse(savedQueue);

      // 初始化 Supabase 客戶端 (若有 CDN 物件與設定)
      if (this.storageMode === 'supabase' && this.supabaseConfig.url && this.supabaseConfig.anonKey) {
        this.initSupabaseClient();
      }

      // 監聽網路連線狀態
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));

      // 判斷初始連線狀態
      if (!navigator.onLine) {
        this.setStatus('offline');
      } else {
        this.setStatus('synced');
      }
    } catch (e) {
      console.warn('初始化 CloudSync 失敗:', e);
    }
  }

  // 初始化 Supabase SDK 客戶端
  initSupabaseClient() {
    if (window.supabase && this.supabaseConfig.url && this.supabaseConfig.anonKey) {
      try {
        this.supabaseClient = window.supabase.createClient(
          this.supabaseConfig.url,
          this.supabaseConfig.anonKey
        );
        console.log('✅ Supabase 客戶端初始化成功');
      } catch (err) {
        console.error('Supabase 客戶端建立失敗:', err);
        this.supabaseClient = null;
      }
    }
  }

  // 狀態變更監聽
  onStatusChange(fn) {
    if (typeof fn === 'function') this.statusListeners.push(fn);
  }

  onDataChange(fn) {
    if (typeof fn === 'function') this.dataChangeListeners.push(fn);
  }

  setStatus(status, message = '') {
    this.syncStatus = status;
    this.statusListeners.forEach(fn => fn(status, message, this.lastSyncTime));
  }

  notifyDataChange(source = 'cloud') {
    this.dataChangeListeners.forEach(fn => fn(source));
  }

  // 處理連線恢復
  handleNetworkChange(isOnline) {
    if (isOnline) {
      this.setStatus('syncing', '網路恢復，正在同步離線佇列...');
      this.processOfflineQueue().then(() => {
        this.setStatus('synced', '所有數據已與雲端同步');
      }).catch(err => {
        this.setStatus('error', `同步失敗: ${err.message}`);
      });
    } else {
      this.setStatus('offline', '無網路連線，已啟用離線本機快取');
    }
  }

  // 設定並切換雲端模式
  async configureBackend(mode, config = {}) {
    this.storageMode = mode;
    localStorage.setItem('eurotrip_storage_mode', mode);

    if (mode === 'supabase') {
      this.supabaseConfig = {
        url: (config.url || '').trim(),
        anonKey: (config.anonKey || '').trim()
      };
      localStorage.setItem('eurotrip_supabase_config', JSON.stringify(this.supabaseConfig));
      this.initSupabaseClient();
    } else if (mode === 'google_sheet') {
      this.googleSheetConfig = {
        webAppUrl: (config.webAppUrl || '').trim()
      };
      localStorage.setItem('eurotrip_gsheet_config', JSON.stringify(this.googleSheetConfig));
    }

    this.setStatus('syncing', '正在連接並拉取最新雲端數據...');
    return await this.syncAllData();
  }

  // 取得支出紀錄
  async getExpenses() {
    // 優先讀取本地快取
    let localExpenses = [];
    try {
      const saved = localStorage.getItem('eurotrip_expenses');
      if (saved) localExpenses = JSON.parse(saved);
    } catch (e) {
      console.warn('讀取本地支出失敗:', e);
    }

    // 若為本機模式或離線狀態，直接回傳本地資料
    if (this.storageMode === 'local' || !navigator.onLine) {
      return localExpenses;
    }

    try {
      this.setStatus('syncing');

      // 1. Supabase 模式
      if (this.storageMode === 'supabase' && this.supabaseClient) {
        const { data, error } = await this.supabaseClient
          .from('expenses')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        if (data) {
          localStorage.setItem('eurotrip_expenses', JSON.stringify(data));
          this.lastSyncTime = new Date();
          this.setStatus('synced');
          return data;
        }
      }

      // 2. Google Sheets Web App 模式
      if (this.storageMode === 'google_sheet' && this.googleSheetConfig.webAppUrl) {
        const url = `${this.googleSheetConfig.webAppUrl}?action=getExpenses`;
        const res = await fetch(url);
        const json = await res.json();
        if (json && json.success && Array.isArray(json.data)) {
          localStorage.setItem('eurotrip_expenses', JSON.stringify(json.data));
          this.lastSyncTime = new Date();
          this.setStatus('synced');
          return json.data;
        } else {
          throw new Error(json.error || 'Google 試算表格式不符');
        }
      }
    } catch (err) {
      console.warn('雲端獲取失敗，降級使用本地資料:', err);
      this.setStatus('error', `雲端讀取失敗: ${err.message}`);
    }

    return localExpenses;
  }

  // 儲存或更新單筆支出
  async saveExpense(expense) {
    if (!expense.id) {
      expense.id = 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }
    if (!expense.created_at) {
      expense.created_at = new Date().toISOString();
    }
    expense.updated_at = new Date().toISOString();

    // 1. 更新本地 LocalStorage
    let list = [];
    try {
      const saved = localStorage.getItem('eurotrip_expenses');
      if (saved) list = JSON.parse(saved);
    } catch (e) {}

    const index = list.findIndex(item => item.id === expense.id);
    if (index >= 0) {
      list[index] = expense;
    } else {
      list.unshift(expense);
    }
    localStorage.setItem('eurotrip_expenses', JSON.stringify(list));

    // 2. 異步同步至雲端
    if (this.storageMode === 'local' || !navigator.onLine) {
      this.enqueueOfflineAction({ type: 'saveExpense', payload: expense });
      this.setStatus(navigator.onLine ? 'synced' : 'offline');
      return expense;
    }

    try {
      this.setStatus('syncing');

      if (this.storageMode === 'supabase' && this.supabaseClient) {
        const { error } = await this.supabaseClient
          .from('expenses')
          .upsert(expense);
        if (error) throw error;
      } else if (this.storageMode === 'google_sheet' && this.googleSheetConfig.webAppUrl) {
        await fetch(this.googleSheetConfig.webAppUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'syncAll', payload: { expenses: list } })
        });
      }

      this.lastSyncTime = new Date();
      this.setStatus('synced');
    } catch (err) {
      console.error('雲端儲存失敗，加入離線隊列:', err);
      this.enqueueOfflineAction({ type: 'saveExpense', payload: expense });
      this.setStatus('error', `同步異常: ${err.message}`);
    }

    return expense;
  }

  // 刪除單筆支出
  async deleteExpense(expenseId) {
    // 1. 更新本地
    let list = [];
    try {
      const saved = localStorage.getItem('eurotrip_expenses');
      if (saved) list = JSON.parse(saved);
    } catch (e) {}

    list = list.filter(item => item.id !== expenseId);
    localStorage.setItem('eurotrip_expenses', JSON.stringify(list));

    // 2. 雲端同步
    if (this.storageMode === 'local' || !navigator.onLine) {
      this.enqueueOfflineAction({ type: 'deleteExpense', payload: { id: expenseId } });
      return true;
    }

    try {
      this.setStatus('syncing');
      if (this.storageMode === 'supabase' && this.supabaseClient) {
        const { error } = await this.supabaseClient
          .from('expenses')
          .delete()
          .eq('id', expenseId);
        if (error) throw error;
      } else if (this.storageMode === 'google_sheet' && this.googleSheetConfig.webAppUrl) {
        await fetch(this.googleSheetConfig.webAppUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'syncAll', payload: { expenses: list } })
        });
      }
      this.lastSyncTime = new Date();
      this.setStatus('synced');
    } catch (err) {
      console.error('雲端刪除失敗:', err);
      this.enqueueOfflineAction({ type: 'deleteExpense', payload: { id: expenseId } });
      this.setStatus('error', `刪除同步異常: ${err.message}`);
    }

    return true;
  }

  // 取得搶票清單 (Bookings)
  async getBookings() {
    let localBookings = [];
    try {
      const saved = localStorage.getItem('eurotrip_bookings');
      if (saved) {
        localBookings = JSON.parse(saved);
      } else {
        // 若本地無資料，載入內建預設搶票清單
        localBookings = window.EuroTripData.bookingWatchlist;
        localStorage.setItem('eurotrip_bookings', JSON.stringify(localBookings));
      }
    } catch (e) {
      localBookings = window.EuroTripData.bookingWatchlist;
    }

    if (this.storageMode === 'local' || !navigator.onLine) return localBookings;

    try {
      if (this.storageMode === 'supabase' && this.supabaseClient) {
        const { data, error } = await this.supabaseClient
          .from('bookings')
          .select('*');
        if (!error && data && data.length > 0) {
          localStorage.setItem('eurotrip_bookings', JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      console.warn('取得雲端搶票清單失敗:', e);
    }

    return localBookings;
  }

  // 儲存搶票清單
  async saveBooking(booking) {
    let list = await this.getBookings();
    const idx = list.findIndex(b => b.id === booking.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...booking };
    } else {
      list.push(booking);
    }
    localStorage.setItem('eurotrip_bookings', JSON.stringify(list));

    if (this.storageMode === 'supabase' && this.supabaseClient && navigator.onLine) {
      try {
        await this.supabaseClient.from('bookings').upsert(booking);
      } catch (e) {
        console.warn('同步搶票狀態失敗:', e);
      }
    }

    return list;
  }

  // 加入離線隊列
  enqueueOfflineAction(action) {
    this.offlineQueue.push(action);
    localStorage.setItem('eurotrip_offline_queue', JSON.stringify(this.offlineQueue));
  }

  // 處理離線隊列同步
  async processOfflineQueue() {
    if (this.offlineQueue.length === 0) return;
    const queue = [...this.offlineQueue];
    this.offlineQueue = [];
    localStorage.setItem('eurotrip_offline_queue', JSON.stringify([]));

    try {
      let list = [];
      const saved = localStorage.getItem('eurotrip_expenses');
      if (saved) list = JSON.parse(saved);

      if (this.storageMode === 'supabase' && this.supabaseClient) {
        if (list.length > 0) {
          await this.supabaseClient.from('expenses').upsert(list);
        }
      } else if (this.storageMode === 'google_sheet' && this.googleSheetConfig.webAppUrl) {
        await fetch(this.googleSheetConfig.webAppUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'syncAll', payload: { expenses: list } })
        });
      }
      this.lastSyncTime = new Date();
    } catch (err) {
      console.error('隊列重傳失敗，重回隊列:', err);
      this.offlineQueue = queue;
      localStorage.setItem('eurotrip_offline_queue', JSON.stringify(this.offlineQueue));
      throw err;
    }
  }

  // 完整同步所有數據（雙向整合）
  async syncAllData() {
    try {
      this.setStatus('syncing', '正在連接雲端數據庫...');
      const expenses = await this.getExpenses();
      const bookings = await this.getBookings();
      this.lastSyncTime = new Date();
      this.setStatus('synced', '雲端同步完成');
      this.notifyDataChange('syncAll');
      return { success: true, expenses, bookings };
    } catch (err) {
      this.setStatus('error', `同步失敗: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  // 匯出完整 JSON 備份檔
  exportJSONBackup() {
    const expenses = JSON.parse(localStorage.getItem('eurotrip_expenses') || '[]');
    const bookings = JSON.parse(localStorage.getItem('eurotrip_bookings') || '[]');
    const rates = JSON.parse(localStorage.getItem('eurotrip_custom_rates') || '{}');
    const budget = localStorage.getItem('eurotrip_total_budget') || '200000';

    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      budgetTwd: Number(budget),
      customRates: rates,
      expenses: expenses,
      bookings: bookings
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EuroTrip_記帳完整備份_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // 匯入 JSON 備份檔
  async importJSONBackup(fileContent) {
    try {
      const data = JSON.parse(fileContent);
      if (!data.expenses || !Array.isArray(data.expenses)) {
        throw new Error('無效的備份檔案格式：找不到支出紀錄');
      }

      localStorage.setItem('eurotrip_expenses', JSON.stringify(data.expenses));
      if (data.bookings) localStorage.setItem('eurotrip_bookings', JSON.stringify(data.bookings));
      if (data.customRates) localStorage.setItem('eurotrip_custom_rates', JSON.stringify(data.customRates));
      if (data.budgetTwd) localStorage.setItem('eurotrip_total_budget', data.budgetTwd.toString());

      await this.syncAllData();
      return { success: true, count: data.expenses.length };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

// 實例化全域同步管理器
window.cloudSync = new CloudSyncManager();
