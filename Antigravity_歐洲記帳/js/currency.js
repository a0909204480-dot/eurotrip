/**
 * 即時匯率與多幣別換算模組 (Currency Engine)
 * 支援：即時匯率 API 抓取 (open.er-api.com / jsdelivr fallback)、手動自訂覆蓋、本地快取、精準四捨五入換算
 */

class CurrencyManager {
  constructor() {
    this.baseCurrency = 'TWD';
    this.rates = {
      EUR: 35.50,
      CHF: 36.80,
      USD: 32.20,
      CZK: 1.45,
      GBP: 41.50,
      PLN: 8.10,
      HUF: 0.09,
      TWD: 1.00
    };
    this.customRates = {};
    this.lastUpdated = null;
    this.isFetching = false;
    this.listeners = [];

    this.init();
  }

  // 初始化讀取本地快取
  init() {
    try {
      const savedRates = localStorage.getItem('eurotrip_currency_rates');
      if (savedRates) {
        this.rates = { ...this.rates, ...JSON.parse(savedRates) };
      }

      const savedCustom = localStorage.getItem('eurotrip_custom_rates');
      if (savedCustom) {
        this.customRates = JSON.parse(savedCustom);
      }

      const savedTime = localStorage.getItem('eurotrip_currency_updated');
      if (savedTime) {
        this.lastUpdated = new Date(savedTime);
      }
    } catch (e) {
      console.warn('載入匯率快取失敗:', e);
    }
  }

  // 註冊匯率更新回調
  onChange(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  notify() {
    this.listeners.forEach(fn => fn(this.getEffectiveRates()));
  }

  // 取得有效匯率（若有手動自訂覆蓋則優先使用手動匯率，否則用即時匯率）
  getRate(currencyCode) {
    if (!currencyCode || currencyCode === 'TWD') return 1.0;
    const code = currencyCode.toUpperCase();
    if (this.customRates[code] && Number(this.customRates[code]) > 0) {
      return Number(this.customRates[code]);
    }
    return this.rates[code] || 1.0;
  }

  // 取得所有幣別目前生效的匯率列表
  getEffectiveRates() {
    const effective = {};
    const allCurrencies = ['EUR', 'CHF', 'USD', 'CZK', 'GBP', 'PLN', 'HUF', 'TWD'];
    allCurrencies.forEach(code => {
      effective[code] = {
        rate: this.getRate(code),
        isCustom: !!(this.customRates[code] && Number(this.customRates[code]) > 0),
        liveRate: this.rates[code] || 1.0,
        customRate: this.customRates[code] || null
      };
    });
    return effective;
  }

  // 換算外幣至 TWD
  convertToTWD(amount, currencyCode) {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return 0;
    const rate = this.getRate(currencyCode);
    const twd = num * rate;
    // 四捨五入至小數點第 2 位
    return Math.round((twd + Number.EPSILON) * 100) / 100;
  }

  // 換算 TWD 至特定外幣
  convertFromTWD(twdAmount, targetCurrencyCode) {
    const num = parseFloat(twdAmount);
    if (isNaN(num) || num <= 0) return 0;
    const rate = this.getRate(targetCurrencyCode);
    if (rate <= 0) return 0;
    const foreign = num / rate;
    return Math.round((foreign + Number.EPSILON) * 100) / 100;
  }

  // 設定手動自訂匯率
  setCustomRate(currencyCode, rate) {
    const code = currencyCode.toUpperCase();
    const num = parseFloat(rate);
    if (isNaN(num) || num <= 0) {
      delete this.customRates[code];
    } else {
      this.customRates[code] = num;
    }
    localStorage.setItem('eurotrip_custom_rates', JSON.stringify(this.customRates));
    this.notify();
  }

  // 重設單一或全部自訂匯率
  resetCustomRates(currencyCode = null) {
    if (currencyCode) {
      delete this.customRates[currencyCode.toUpperCase()];
    } else {
      this.customRates = {};
    }
    localStorage.setItem('eurotrip_custom_rates', JSON.stringify(this.customRates));
    this.notify();
  }

  // 抓取線上即時匯率
  async fetchLiveRates() {
    if (this.isFetching) return this.rates;
    this.isFetching = true;

    try {
      // 主要來源：open.er-api.com 以 EUR 為基準
      const res = await fetch('https://open.er-api.com/v6/latest/EUR', { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data && data.rates && data.rates.TWD) {
        const eurToTwd = data.rates.TWD;
        this.rates.EUR = Math.round(eurToTwd * 1000) / 1000;
        
        // 計算其他幣別換算成 TWD (1 外幣 = ? TWD)
        const targetCurrencies = ['USD', 'CHF', 'GBP', 'CZK', 'PLN', 'HUF'];
        targetCurrencies.forEach(code => {
          if (data.rates[code]) {
            // 1 外幣 = (1 / EUR_to_Currency) * EUR_to_TWD
            const rateInEur = data.rates[code];
            const rateInTwd = eurToTwd / rateInEur;
            this.rates[code] = Math.round(rateInTwd * 10000) / 10000;
          }
        });

        this.rates.TWD = 1.0;
        this.lastUpdated = new Date();
        localStorage.setItem('eurotrip_currency_rates', JSON.stringify(this.rates));
        localStorage.setItem('eurotrip_currency_updated', this.lastUpdated.toISOString());
        this.notify();
        this.isFetching = false;
        return { success: true, rates: this.rates, timestamp: this.lastUpdated };
      } else {
        throw new Error('無效的匯率 API 回應資料格式');
      }
    } catch (primaryErr) {
      console.warn('主要匯率 API 失敗，嘗試備用來源:', primaryErr);
      try {
        // 備用來源：jsdelivr currency-api
        const fallbackRes = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json');
        if (!fallbackRes.ok) throw new Error(`Fallback HTTP ${fallbackRes.status}`);
        const fbData = await fallbackRes.json();
        
        if (fbData && fbData.eur && fbData.eur.twd) {
          const eurToTwd = fbData.eur.twd;
          this.rates.EUR = Math.round(eurToTwd * 1000) / 1000;
          
          const targets = ['usd', 'chf', 'gbp', 'czk', 'pln', 'huf'];
          targets.forEach(c => {
            if (fbData.eur[c]) {
              const rateInEur = fbData.eur[c];
              const rateInTwd = eurToTwd / rateInEur;
              this.rates[c.toUpperCase()] = Math.round(rateInTwd * 10000) / 10000;
            }
          });

          this.rates.TWD = 1.0;
          this.lastUpdated = new Date();
          localStorage.setItem('eurotrip_currency_rates', JSON.stringify(this.rates));
          localStorage.setItem('eurotrip_currency_updated', this.lastUpdated.toISOString());
          this.notify();
          this.isFetching = false;
          return { success: true, rates: this.rates, timestamp: this.lastUpdated, isFallback: true };
        }
      } catch (fallbackErr) {
        console.error('所有線上匯率來源連線失敗，啟用內建預設匯率:', fallbackErr);
      }
    }

    this.isFetching = false;
    this.notify();
    return { success: false, rates: this.rates, error: '線上連線失敗，已使用快取/預設安全匯率' };
  }

  // 格式化貨幣字串 (例如 "€ 45.00" 或 "NT$ 1,598")
  static formatAmount(amount, currencyCode = 'TWD', includeDecimals = true) {
    const num = parseFloat(amount) || 0;
    const isTwd = currencyCode === 'TWD';
    
    // TWD 預設不一定要小數點，外幣則保留 2 位小數
    const decimals = isTwd ? (includeDecimals ? 0 : 0) : 2;
    const formattedNum = num.toLocaleString('zh-TW', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    const symbolMap = {
      EUR: '€',
      CHF: 'CHF',
      USD: '$',
      CZK: 'Kč',
      GBP: '£',
      PLN: 'zł',
      HUF: 'Ft',
      TWD: 'NT$'
    };

    const symbol = symbolMap[currencyCode] || currencyCode;
    return `${symbol} ${formattedNum}`;
  }
}

// 實例化全域匯率管理器
window.currencyManager = new CurrencyManager();
