/**
 * ==============================================================================
 * 歐洲 40 天多幣別旅行記帳 (EuroTrip Ledger) - Google Apps Script 後端
 * 
 * 部署教學：
 * 1. 在 Google 雲端硬碟建立一個新的「Google 試算表」，命名為「歐洲40天記帳本」
 * 2. 點擊頂端選單「擴充功能」 ->「Apps Script」
 * 3. 將本檔案的所有程式碼貼入 Code.gs 中
 * 4. 點擊右上角「部署」 ->「新增部署作業」
 * 5. 類型選擇「網頁應用程式 (Web App)」
 * 6. 設定：
 *    - 說明：EuroTrip API
 *    - 執行身分：我 (您的 Google 帳號)
 *    - 誰可以存取：任何人 (Anyone)  <-- 非常重要！避免跨國隊友記帳需要 Google 登入驗證
 * 7. 點擊「部署」，並複製產生的「網頁應用程式網址 (Web App URL)」
 * 8. 回到記帳網頁 -> 點擊右上角「⚙️ 雲端設定」 -> 貼上此網址即可！
 * ==============================================================================
 */

// 初始化試算表分頁與標題
function initSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. 支出紀錄分頁 (expenses)
  let expSheet = ss.getSheetByName('expenses');
  if (!expSheet) {
    expSheet = ss.insertSheet('expenses');
    expSheet.appendRow([
      'id', 'created_at', 'date', 'category', 'item_name', 
      'currency', 'foreign_amount', 'exchange_rate', 'twd_amount', 
      'payment_method', 'payer', 'split_type', 'city', 'notes', 'receipt_url', 'trip_day'
    ]);
    expSheet.getRange(1, 1, 1, 16).setFontWeight('bold').setBackground('#4F46E5').setFontColor('#FFFFFF');
  }

  // 2. 搶票清單分頁 (bookings)
  let bookSheet = ss.getSheetByName('bookings');
  if (!bookSheet) {
    bookSheet = ss.insertSheet('bookings');
    bookSheet.appendRow([
      'id', 'created_at', 'title', 'category', 'target_date', 
      'booking_deadline', 'status', 'official_url', 'estimated_cost_twd', 'is_booked', 'notes'
    ]);
    bookSheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#059669').setFontColor('#FFFFFF');
  }

  // 3. 設定分頁 (settings)
  let setSheet = ss.getSheetByName('settings');
  if (!setSheet) {
    setSheet = ss.insertSheet('settings');
    setSheet.appendRow(['key', 'value', 'updated_at']);
    setSheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#D97706').setFontColor('#FFFFFF');
    setSheet.appendRow(['total_budget_twd', '200000', new Date().toISOString()]);
  }
}

// 處理 GET 請求 (取得資料)
function doGet(e) {
  try {
    initSheet();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = (e && e.parameter && e.parameter.action) || 'getAll';
    
    if (action === 'getExpenses' || action === 'getAll') {
      const expSheet = ss.getSheetByName('expenses');
      const data = expSheet.getDataRange().getValues();
      const headers = data[0];
      const expenses = [];
      
      for (let i = 1; i < data.length; i++) {
        let row = data[i];
        if (!row[0]) continue; // 跳過空行
        let obj = {};
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = row[j];
        }
        expenses.push(obj);
      }

      if (action === 'getExpenses') {
        return createJsonResponse({ success: true, data: expenses });
      }

      // 如果是 getAll，一併回傳 bookings 與 settings
      const bookSheet = ss.getSheetByName('bookings');
      const bookData = bookSheet.getDataRange().getValues();
      const bookHeaders = bookData[0];
      const bookings = [];
      for (let i = 1; i < bookData.length; i++) {
        let row = bookData[i];
        if (!row[0]) continue;
        let obj = {};
        for (let j = 0; j < bookHeaders.length; j++) {
          obj[bookHeaders[j]] = row[j];
        }
        bookings.push(obj);
      }

      const setSheet = ss.getSheetByName('settings');
      const setData = setSheet.getDataRange().getValues();
      const settings = {};
      for (let i = 1; i < setData.length; i++) {
        if (setData[i][0]) {
          settings[setData[i][0]] = setData[i][1];
        }
      }

      return createJsonResponse({
        success: true,
        data: {
          expenses: expenses,
          bookings: bookings,
          settings: settings
        }
      });
    }

    return createJsonResponse({ success: false, error: 'Unknown action' });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

// 處理 POST 請求 (新增、修改、刪除、批量同步)
function doPost(e) {
  try {
    initSheet();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    const action = body.action || 'sync';

    // 1. 同步所有資料 (覆寫或批量儲存)
    if (action === 'syncAll' && body.payload) {
      const { expenses, bookings, settings } = body.payload;

      if (expenses && Array.isArray(expenses)) {
        const expSheet = ss.getSheetByName('expenses');
        expSheet.clearContents();
        const headers = [
          'id', 'created_at', 'date', 'category', 'item_name', 
          'currency', 'foreign_amount', 'exchange_rate', 'twd_amount', 
          'payment_method', 'payer', 'split_type', 'city', 'notes', 'receipt_url', 'trip_day'
        ];
        expSheet.appendRow(headers);
        expSheet.getRange(1, 1, 1, 16).setFontWeight('bold').setBackground('#4F46E5').setFontColor('#FFFFFF');
        
        expenses.forEach(item => {
          expSheet.appendRow([
            item.id || Utilities.getUuid(),
            item.created_at || new Date().toISOString(),
            item.date || '',
            item.category || '',
            item.item_name || '',
            item.currency || 'EUR',
            item.foreign_amount || 0,
            item.exchange_rate || 1,
            item.twd_amount || 0,
            item.payment_method || '',
            item.payer || '',
            item.split_type || '',
            item.city || '',
            item.notes || '',
            item.receipt_url || '',
            item.trip_day || ''
          ]);
        });
      }

      if (bookings && Array.isArray(bookings)) {
        const bookSheet = ss.getSheetByName('bookings');
        bookSheet.clearContents();
        const bookHeaders = [
          'id', 'created_at', 'title', 'category', 'target_date', 
          'booking_deadline', 'status', 'official_url', 'estimated_cost_twd', 'is_booked', 'notes'
        ];
        bookSheet.appendRow(bookHeaders);
        bookSheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#059669').setFontColor('#FFFFFF');
        
        bookings.forEach(b => {
          bookSheet.appendRow([
            b.id || Utilities.getUuid(),
            b.created_at || new Date().toISOString(),
            b.title || '',
            b.category || '',
            b.target_date || '',
            b.booking_deadline || '',
            b.status || '未預訂',
            b.official_url || '',
            b.estimated_cost_twd || 0,
            b.is_booked ? true : false,
            b.notes || ''
          ]);
        });
      }

      return createJsonResponse({ success: true, message: 'Sync complete' });
    }

    // 2. 新增單筆支出
    if (action === 'addExpense' && body.expense) {
      const exp = body.expense;
      const expSheet = ss.getSheetByName('expenses');
      expSheet.appendRow([
        exp.id || Utilities.getUuid(),
        exp.created_at || new Date().toISOString(),
        exp.date || '',
        exp.category || '',
        exp.item_name || '',
        exp.currency || 'EUR',
        exp.foreign_amount || 0,
        exp.exchange_rate || 1,
        exp.twd_amount || 0,
        exp.payment_method || '',
        exp.payer || '',
        exp.split_type || '',
        exp.city || '',
        exp.notes || '',
        exp.receipt_url || '',
        exp.trip_day || ''
      ]);
      return createJsonResponse({ success: true, message: 'Expense added' });
    }

    return createJsonResponse({ success: false, error: 'Invalid POST action' });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

// 輔助函數：輸出 JSON 格式 (並設定 CORS 標頭)
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
