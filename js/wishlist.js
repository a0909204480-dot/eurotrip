/**
 * 願望清單、小紅書熱門名產探索與退稅計算機核心模組 (Wishlist & Specialty Manager)
 * 支援：手動點選切換國家、GPS 手機自動定位、小紅書爆款推薦、踩點地標、一鍵轉記帳、退稅計算機
 */

class WishlistManager {
  constructor() {
    this.wishlist = [];
    this.currentCountryId = 'FR'; // 預設顯示法國
    this.detectedCityName = '';
    this.editingWishId = null;

    this.init();
  }

  // 初始化
  init() {
    try {
      const saved = localStorage.getItem('eurotrip_wishlist_v2');
      if (saved) {
        this.wishlist = JSON.parse(saved);
      } else {
        // 預設小紅書爆款願望清單
        this.wishlist = [
          {
            id: 'wish_1',
            name: 'Polène Paris Numéro Dix 經典半月包 (黑金配色)',
            countryId: 'FR',
            countryName: '法國 🇫🇷',
            currency: 'EUR',
            estimatedPrice: 380,
            targetRecipient: '自己',
            isBought: false,
            notes: '巴黎旗艦店購買，小紅書爆款神包，退稅 12%'
          },
          {
            id: 'wish_2',
            name: 'Buly 1803 三度水香氛 (燙金客製姓名禮盒)',
            countryId: 'FR',
            countryName: '法國 🇫🇷',
            currency: 'EUR',
            estimatedPrice: 130,
            targetRecipient: '女友/閨蜜',
            isBought: false,
            notes: '巴黎左岸總店 6 Rue Bonaparte，免費手寫花體燙金字'
          },
          {
            id: 'wish_3',
            name: 'Läderach 瑞士現切生巧克力 250g (烤榛果+覆盆莓)',
            countryId: 'CH',
            countryName: '瑞士 🇨🇭',
            currency: 'CHF',
            estimatedPrice: 25,
            targetRecipient: '自己',
            isBought: false,
            notes: '琉森天鵝廣場店購買，小紅書公認生巧天花板'
          },
          {
            id: 'wish_4',
            name: 'Santa Maria Novella (SMN) 撲鼻陶罐香氛 (Pot-Pourri)',
            countryId: 'IT',
            countryName: '義大利 🇮🇹',
            currency: 'EUR',
            estimatedPrice: 35,
            targetRecipient: '自己',
            isBought: false,
            notes: '佛羅倫斯 1221 年修道院總店，沉穩高級木質香'
          },
          {
            id: 'wish_5',
            name: 'La Chinata 西班牙頂級橄欖油護唇膏 x 10',
            countryId: 'ES',
            countryName: '西班牙 🇪🇸',
            currency: 'EUR',
            estimatedPrice: 25,
            targetRecipient: '同事伴手禮',
            isBought: false,
            notes: '巴塞隆納專賣店，單價 2.5 歐元，辦公室送禮零踩雷'
          },
          {
            id: 'wish_6',
            name: 'Botanicus 菠丹妮 死海泥純天然手工皂 x 6',
            countryId: 'CZ',
            countryName: '捷克 🇨🇿',
            currency: 'CZK',
            estimatedPrice: 850,
            targetRecipient: '自用/媽媽',
            isBought: false,
            notes: '布拉格提恩教堂後方總店，深層清潔控油神器'
          }
        ];
        localStorage.setItem('eurotrip_wishlist_v2', JSON.stringify(this.wishlist));
      }
    } catch (e) {
      console.warn('載入願望清單快取失敗:', e);
    }
  }

  // 儲存至本地快取
  saveLocal() {
    localStorage.setItem('eurotrip_wishlist_v2', JSON.stringify(this.wishlist));
    this.renderWishlist();
  }

  // 切換選取的國家
  selectCountry(countryId) {
    this.currentCountryId = countryId;
    this.renderCountryTabs();
    this.renderCountryHeaderAndTips();
    this.renderSpecialties();
    this.renderWishlist();
    this.updateTaxCalculator();
  }

  // GPS 手機自動定位所在城市
  async detectLocation() {
    if (!navigator.geolocation) {
      window.app.showToast('您的瀏覽器不支援 GPS 定位，請使用上方按鈕手動切換', 'warning');
      return;
    }

    window.app.showToast('📡 正在定位您目前所在的歐洲城市...', 'info');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=zh`);
          const data = await res.json();

          if (data && data.countryCode) {
            const code = data.countryCode.toUpperCase();
            const cityName = data.city || data.locality || data.principalSubdivision || '';
            this.detectedCityName = cityName;

            const countryMap = {
              'FR': 'FR',
              'ES': 'ES',
              'CH': 'CH',
              'IT': 'IT',
              'VA': 'IT',
              'PT': 'PT',
              'AT': 'AT',
              'CZ': 'CZ',
              'PL': 'PL',
              'HU': 'HU',
            };

            const matchedCountry = countryMap[code];

            if (matchedCountry) {
              this.selectCountry(matchedCountry);
              window.app.showToast(`📍 定位成功！目前位於【${cityName}】，已切換至當地小紅書爆款推薦 ✨`, 'success');
            } else {
              window.app.showToast(`📍 定位成功：【${cityName || data.countryName}】（可手動點擊上方切換）`, 'info');
            }
          }
        } catch (err) {
          console.warn('解析經緯度失敗:', err);
          window.app.showToast('定位解析失敗，請直接點擊上方國家按鈕切換', 'warning');
        }
      },
      (err) => {
        console.warn('GPS 定位被拒絕或超時:', err);
        window.app.showToast('無法取得 GPS 權限，請手動點選上方國家切換', 'info');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }

  // -------------------------------------------------------------
  // 願望清單 CRUD
  // -------------------------------------------------------------
  addWishItem(item) {
    if (!item.id) {
      item.id = 'wish_' + Date.now();
    }
    this.wishlist.unshift(item);
    this.saveLocal();
  }

  updateWishItem(item) {
    const idx = this.wishlist.findIndex(w => w.id === item.id);
    if (idx >= 0) {
      this.wishlist[idx] = { ...this.wishlist[idx], ...item };
      this.saveLocal();
    }
  }

  deleteWishItem(id) {
    this.wishlist = this.wishlist.filter(w => w.id !== id);
    this.saveLocal();
  }

  toggleBoughtStatus(id) {
    const item = this.wishlist.find(w => w.id === id);
    if (!item) return;

    item.isBought = !item.isBought;
    this.saveLocal();
    window.app.showToast(item.isBought ? '🎉 恭喜入手戰利品！太棒了！' : '已重設為待採購狀態', 'info');
  }

  // 一鍵從名產加入願望清單
  addFromSpecialty(countryId, specialtyName, priceStr, category, spot) {
    const country = window.EuroSpecialtiesData.countries.find(c => c.id === countryId);
    let priceNum = 0;
    const match = priceStr.match(/(\d+)/);
    if (match) {
      priceNum = parseFloat(match[1]);
    }

    const newItem = {
      id: 'wish_' + Date.now(),
      name: specialtyName,
      countryId: countryId,
      countryName: `${country ? country.name : ''} ${country ? country.flag : ''}`,
      currency: country ? country.currency : 'EUR',
      estimatedPrice: priceNum,
      targetRecipient: '自己',
      isBought: false,
      notes: `${category}・📍 購買地：${spot || '當地專賣店'}`
    };

    this.addWishItem(newItem);
    window.app.showToast(`✨ 已將小紅書熱門「${specialtyName}」存入願望清單！`, 'success');
  }

  // 一鍵轉記帳 (Buy & Log to Ledger)
  buyAndLogToExpense(id) {
    const item = this.wishlist.find(w => w.id === id);
    if (!item) return;

    // 開啟記帳 Modal 並預填資料
    window.app.openAddExpenseModal({
      item_name: item.name,
      category: '購物',
      currency: item.currency || 'EUR',
      foreign_amount: item.estimatedPrice || '',
      city: item.countryName || '',
      notes: `戰利品採購（託買人：${item.targetRecipient || '自己'}）`
    });

    // 將願望標記為已入手
    item.isBought = true;
    this.saveLocal();
  }

  // -------------------------------------------------------------
  // UI 渲染方法
  // -------------------------------------------------------------
  renderAll() {
    this.renderCountryTabs();
    this.renderCountryHeaderAndTips();
    this.renderSpecialties();
    this.renderWishlist();
    this.updateTaxCalculator();
  }

  // 渲染國家選擇頁籤 (含 GPS 一鍵定位按鈕)
  renderCountryTabs() {
    const container = document.getElementById('wishlist-country-tabs');
    if (!container) return;

    const countries = window.EuroSpecialtiesData.countries;

    container.innerHTML = `
      <button onclick="window.wishlistManager.detectLocation()" 
              class="px-3.5 py-1.5 rounded-xl text-xs font-black bg-[#EBF7EE] text-[#2D6A4F] border border-[#B7E4C7] hover:bg-[#D8F3DC] transition-all btn-cute flex items-center gap-1 shadow-sm whitespace-nowrap">
        <span>📍</span> GPS 自動定位
      </button>

      <button onclick="window.wishlistManager.selectCountry('ALL')" 
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all btn-cute whitespace-nowrap ${this.currentCountryId === 'ALL' ? 'bg-[#E88D67] text-white shadow-sm' : 'bg-white text-[#706258] border border-[#EFE4D6] hover:bg-[#FAF7F2]'}">
        🌐 全部願望
      </button>
      
      ${countries.map(c => `
        <button onclick="window.wishlistManager.selectCountry('${c.id}')" 
                class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all btn-cute flex items-center gap-1.5 whitespace-nowrap ${this.currentCountryId === c.id ? 'bg-[#E88D67] text-white shadow-sm' : 'bg-white text-[#706258] border border-[#EFE4D6] hover:bg-[#FAF7F2]'}">
          <span>${c.flag}</span> <span>${c.name.split(' ')[0]}</span>
        </button>
      `).join('')}
    `;
  }

  // 渲染當前國家介紹、退稅門檻、小紅書熱門踩點與採購防坑橫幅
  renderCountryHeaderAndTips() {
    const banner = document.getElementById('wishlist-country-banner');
    if (!banner) return;

    if (this.currentCountryId === 'ALL') {
      banner.innerHTML = `
        <div class="cream-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#FFF9F2] to-[#FFF4EC] border-2 border-[#FCD5B5]">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🧳</span>
            <div>
              <h3 class="font-black text-[#3A302A] text-sm sm:text-base">歐洲全境採購願望清單總覽 ✨</h3>
              <p class="text-xs text-[#8C7A6B] mt-0.5">匯集小紅書熱門爆款、在地名產、必踩地標與各國退稅攻略！</p>
            </div>
          </div>
          <button onclick="window.wishlistManager.openAddWishModal()" 
                  class="px-4 py-2 rounded-xl bg-[#E88D67] hover:bg-[#D96B43] text-white text-xs font-black shadow-md btn-cute flex items-center gap-1.5">
            <span>➕</span> 新增自訂願望
          </button>
        </div>
      `;
      return;
    }

    const country = window.EuroSpecialtiesData.countries.find(c => c.id === this.currentCountryId);
    if (!country) return;

    banner.innerHTML = `
      <div class="cream-card p-4 sm:p-5 space-y-3.5 bg-gradient-to-r from-[#FFF9F2] via-[#FFFDF9] to-[#FFF4EC] border-2 border-[#FCD5B5]">
        <div class="flex flex-wrap items-center justify-between gap-2.5">
          <div class="flex items-center gap-2.5">
            <span class="text-3xl sm:text-4xl">${country.flag}</span>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-black text-[#3A302A] text-base sm:text-lg">${country.name}</h3>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF0E6] text-[#D96B43] font-bold border border-[#FCD5B5]">
                  幣別：${country.currency}
                </span>
              </div>
              <p class="text-xs text-[#8C7A6B] font-medium">代表城市：${country.city}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="window.wishlistManager.openAddWishModal('${country.id}')" 
                    class="px-3.5 py-1.5 rounded-xl bg-[#E88D67] text-white text-xs font-black shadow-md btn-cute flex items-center gap-1">
              <span>➕</span> 記一筆願望
            </button>
          </div>
        </div>

        <!-- 小紅書熱門踩點標籤 -->
        ${country.redBookHotSpots ? `
          <div class="p-3 rounded-xl bg-[#FFF0F2] border border-[#FFCCD5] flex items-center gap-2 text-xs text-[#E0245E]">
            <span class="font-black flex-shrink-0">🔥 小紅書推薦踩點：</span>
            <span class="font-semibold">${country.redBookHotSpots}</span>
          </div>
        ` : ''}

        <!-- 退稅速報卡片 -->
        <div class="p-3.5 rounded-2xl bg-[#EBF7EE] border border-[#B7E4C7] flex items-start gap-2.5">
          <span class="text-xl flex-shrink-0">💶</span>
          <div>
            <div class="font-black text-[#2D6A4F] text-xs sm:text-sm flex items-center gap-1.5">
              <span>${country.name.split(' ')[0]}退稅速報：</span>
              <span class="px-2 py-0.5 rounded-md bg-white text-[#2D6A4F] font-mono font-black border border-[#B7E4C7]">
                ${country.taxRefund.minSpend > 0 ? `滿 ${country.taxRefund.minSpend} ${country.taxRefund.currency}` : '無最低門檻'} 退 ${country.taxRefund.rateText}
              </span>
            </div>
            <p class="text-[11px] text-[#406853] mt-1 leading-relaxed">
              💡 ${country.taxRefund.tip}
            </p>
          </div>
        </div>

        <!-- 小紅書採購防坑建議 -->
        <div class="space-y-1.5 pt-1">
          <div class="text-xs font-bold text-[#8C7A6B] flex items-center gap-1">
            <span>📕</span> 小紅書精選採購攻略：
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#706258]">
            ${country.shoppingTips.map(tip => `
              <div class="p-2.5 rounded-xl bg-white border border-[#EFE4D6] shadow-sm leading-relaxed">
                ${tip}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // 渲染所在地小紅書特色名產推薦清單
  renderSpecialties() {
    const container = document.getElementById('wishlist-specialties-container');
    if (!container) return;

    if (this.currentCountryId === 'ALL') {
      container.innerHTML = '';
      const parent = document.getElementById('wishlist-specialties-section');
      if (parent) parent.classList.add('hidden');
      return;
    }

    const parent = document.getElementById('wishlist-specialties-section');
    if (parent) parent.classList.remove('hidden');

    const country = window.EuroSpecialtiesData.countries.find(c => c.id === this.currentCountryId);
    if (!country || !country.specialties) return;

    container.innerHTML = country.specialties.map(s => `
      <div class="cream-card p-4 flex flex-col justify-between hover:border-[#FCD5B5] transition-all">
        <div>
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="text-[10px] px-2 py-0.5 rounded-md bg-[#FFF0F2] text-[#E0245E] font-bold border border-[#FFCCD5]">
              ${s.category}
            </span>
            <span class="text-[11px] font-mono font-bold text-[#D96B43] bg-white px-2 py-0.5 rounded-full border border-[#EFE4D6]">
              ${s.priceEst}
            </span>
          </div>
          
          <h4 class="font-black text-[#3A302A] text-sm sm:text-base mb-1">${s.name}</h4>
          <p class="text-xs text-[#706258] leading-relaxed mb-2.5">${s.desc}</p>
          
          ${s.spot ? `
            <div class="text-[11px] text-[#8C7A6B] bg-[#FFFDF9] p-2 rounded-lg border border-[#F0E6D8] mb-3 flex items-start gap-1">
              <span class="flex-shrink-0">📍</span>
              <span><strong>推薦地點：</strong>${s.spot}</span>
            </div>
          ` : ''}
        </div>

        <div class="flex items-center justify-between pt-2.5 border-t border-[#F0E6D8]">
          <span class="text-[11px] text-[#8C7A6B]">推薦：<strong class="text-[#3A302A]">${s.target}</strong></span>
          <button onclick="window.wishlistManager.addFromSpecialty('${country.id}', '${escapeHtml(s.name)}', '${s.priceEst}', '${s.category}', '${escapeHtml(s.spot || '')}')" 
                  class="px-2.5 py-1 rounded-xl bg-[#FFF6EE] hover:bg-[#FFEADA] text-[#D96B43] text-xs font-bold border border-[#FCD5B5] flex items-center gap-1 btn-cute">
            <span>➕</span> 存入清單
          </button>
        </div>
      </div>
    `).join('');
  }

  // 渲染我的個人願望清單
  renderWishlist() {
    const container = document.getElementById('wishlist-items-container');
    const statsContainer = document.getElementById('wishlist-summary-stats');
    if (!container) return;

    let items = [...this.wishlist];
    if (this.currentCountryId !== 'ALL') {
      items = items.filter(w => w.countryId === this.currentCountryId);
    }

    // 統計數據
    const totalCount = this.wishlist.length;
    const boughtCount = this.wishlist.filter(w => w.isBought).length;
    const completionRate = totalCount > 0 ? Math.round((boughtCount / totalCount) * 100) : 0;

    let totalEstTwd = 0;
    this.wishlist.forEach(w => {
      const rate = window.currencyManager ? window.currencyManager.getRate(w.currency) : 1;
      totalEstTwd += (parseFloat(w.estimatedPrice) || 0) * rate;
    });

    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-3 rounded-2xl bg-white border border-[#EFE4D6] shadow-sm">
            <div class="text-[11px] font-bold text-[#8C7A6B]">總願望項目</div>
            <div class="text-xl font-black text-[#3A302A]">${totalCount} 個願望 🎁</div>
          </div>
          <div class="p-3 rounded-2xl bg-white border border-[#EFE4D6] shadow-sm">
            <div class="text-[11px] font-bold text-[#8C7A6B]">已入手戰利品</div>
            <div class="text-xl font-black text-[#4A7C59]">${boughtCount} 個已買到 ✨</div>
          </div>
          <div class="p-3 rounded-2xl bg-white border border-[#EFE4D6] shadow-sm">
            <div class="text-[11px] font-bold text-[#8C7A6B]">願望達成率</div>
            <div class="text-xl font-black text-[#D96B43]">${completionRate}%</div>
          </div>
          <div class="p-3 rounded-2xl bg-white border border-[#EFE4D6] shadow-sm">
            <div class="text-[11px] font-bold text-[#8C7A6B]">預計採購總預算</div>
            <div class="text-xl font-black text-[#3A302A] font-mono">NT$ ${Math.round(totalEstTwd).toLocaleString('zh-TW')}</div>
          </div>
        </div>
      `;
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="py-10 text-center cream-card">
          <div class="text-3xl mb-2">🎁</div>
          <div class="text-sm font-black text-[#3A302A] mb-1">目前還沒有新增願望喔！</div>
          <p class="text-xs text-[#8C7A6B] mb-3">可以從上方小紅書爆款推薦「存入清單」，或點擊右上角手動新增！</p>
          <button onclick="window.wishlistManager.openAddWishModal('${this.currentCountryId === 'ALL' ? 'FR' : this.currentCountryId}')" 
                  class="px-4 py-2 rounded-xl bg-[#E88D67] text-white text-xs font-bold btn-cute">
            ➕ 新增第一個願望
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(w => {
      const rate = window.currencyManager ? window.currencyManager.getRate(w.currency) : 1;
      const twdEst = (parseFloat(w.estimatedPrice) || 0) * rate;

      return `
        <div class="cream-card p-4 flex flex-col justify-between ${w.isBought ? 'bg-[#F9FBF9] border-[#B7E4C7] opacity-80' : ''}">
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <div class="flex items-center gap-1.5">
                <span class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#FFF4EC] text-[#D96B43] border border-[#FCD5B5]">
                  ${w.countryName || '歐洲'}
                </span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-white text-[#706258] font-bold border border-[#EFE4D6]">
                  👤 ${w.targetRecipient || '自己'}
                </span>
              </div>
              <span class="text-xs px-2.5 py-0.5 rounded-full font-black ${w.isBought ? 'bg-[#EBF7EE] text-[#2D6A4F] border border-[#B7E4C7]' : 'bg-amber-100 text-amber-800 border border-amber-300'}">
                ${w.isBought ? '✅ 已入手' : '⏳ 待購買'}
              </span>
            </div>

            <h4 class="font-black text-[#3A302A] text-base mb-1 leading-snug ${w.isBought ? 'line-through text-stone-500' : ''}">
              ${escapeHtml(w.name)}
            </h4>

            <div class="flex items-baseline gap-2 my-2">
              <span class="text-sm font-black font-mono text-[#D96B43]">${CurrencyManager.formatAmount(w.estimatedPrice, w.currency)}</span>
              <span class="text-xs font-semibold text-[#8C7A6B]">約 NT$ ${Math.round(twdEst).toLocaleString('zh-TW')}</span>
            </div>

            ${w.notes ? `<p class="text-xs text-[#706258] bg-[#FFF9F2] p-2 rounded-xl border border-[#F5ECE1] mb-3 leading-relaxed">📝 ${escapeHtml(w.notes)}</p>` : ''}
          </div>

          <div class="flex items-center justify-between gap-2 pt-2.5 border-t border-[#F0E6D8]">
            <div class="flex items-center gap-1.5">
              <button onclick="window.wishlistManager.toggleBoughtStatus('${w.id}')" 
                      class="px-2.5 py-1.5 rounded-xl text-xs font-bold ${w.isBought ? 'bg-stone-200 text-stone-700' : 'bg-[#68A67D] text-white hover:bg-[#58926C]'} btn-cute">
                ${w.isBought ? '標示未買' : '✅ 買到了！'}
              </button>
              <button onclick="window.wishlistManager.buyAndLogToExpense('${w.id}')" 
                      class="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#FFF0E6] text-[#D96B43] border border-[#FCD5B5] hover:bg-[#FFE6D5] btn-cute" 
                      title="直接將這筆購買轉換為支出記帳">
                記帳 ✍️
              </button>
            </div>

            <div class="flex items-center gap-1">
              <button onclick="window.wishlistManager.openEditWishModal('${w.id}')" 
                      class="p-1.5 rounded-lg text-[#706258] hover:bg-[#F5ECE1]">
                <i class="fa-regular fa-pen-to-square text-xs"></i>
              </button>
              <button onclick="window.wishlistManager.deleteWishItem('${w.id}')" 
                      class="p-1.5 rounded-lg text-red-600 hover:bg-red-50">
                <i class="fa-regular fa-trash-can text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // -------------------------------------------------------------
  // 新增 / 編輯 願望 Modal
  // -------------------------------------------------------------
  openAddWishModal(defaultCountryId = 'FR') {
    this.editingWishId = null;
    const modal = document.getElementById('wish-modal');
    const title = document.getElementById('wish-modal-title');
    const form = document.getElementById('wish-form');

    if (title) title.innerText = '新增採購願望 🎁';
    if (form) form.reset();

    const countrySelect = document.getElementById('wish-country-select');
    if (countrySelect) countrySelect.value = defaultCountryId || 'FR';

    const curSelect = document.getElementById('wish-currency-select');
    if (curSelect) {
      const country = window.EuroSpecialtiesData.countries.find(c => c.id === defaultCountryId);
      curSelect.value = country ? country.currency : 'EUR';
    }

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  openEditWishModal(id) {
    const item = this.wishlist.find(w => w.id === id);
    if (!item) return;

    this.editingWishId = id;
    const modal = document.getElementById('wish-modal');
    const title = document.getElementById('wish-modal-title');

    if (title) title.innerText = '編輯願望項目 ✏️';

    document.getElementById('wish-name').value = item.name || '';
    document.getElementById('wish-country-select').value = item.countryId || 'FR';
    document.getElementById('wish-recipient').value = item.targetRecipient || '自己';
    document.getElementById('wish-currency-select').value = item.currency || 'EUR';
    document.getElementById('wish-price').value = item.estimatedPrice || '';
    document.getElementById('wish-notes').value = item.notes || '';

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeWishModal() {
    const modal = document.getElementById('wish-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    this.editingWishId = null;
  }

  handleWishFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('wish-name').value.trim();
    const countryId = document.getElementById('wish-country-select').value;
    const country = window.EuroSpecialtiesData.countries.find(c => c.id === countryId);
    const targetRecipient = document.getElementById('wish-recipient').value.trim() || '自己';
    const currency = document.getElementById('wish-currency-select').value;
    const estimatedPrice = parseFloat(document.getElementById('wish-price').value) || 0;
    const notes = document.getElementById('wish-notes').value.trim();

    if (!name) {
      window.app.showToast('請輸入想買的商品名稱 🛍️', 'warning');
      return;
    }

    const itemData = {
      id: this.editingWishId || 'wish_' + Date.now(),
      name,
      countryId,
      countryName: `${country ? country.name : ''} ${country ? country.flag : ''}`,
      currency,
      estimatedPrice,
      targetRecipient,
      isBought: false,
      notes
    };

    if (this.editingWishId) {
      this.updateWishItem(itemData);
      window.app.showToast('✨ 願望項目已更新！', 'success');
    } else {
      this.addWishItem(itemData);
      window.app.showToast('🎉 成功新增採購願望！', 'success');
    }

    this.closeWishModal();
  }

  // -------------------------------------------------------------
  // 歐洲各國退稅計算機
  // -------------------------------------------------------------
  updateTaxCalculator() {
    const select = document.getElementById('calc-tax-country');
    const amountInput = document.getElementById('calc-tax-amount');
    const refundOut = document.getElementById('calc-tax-refund-display');
    const noteOut = document.getElementById('calc-tax-rule-note');

    if (!select || !amountInput || !refundOut) return;

    const countryId = select.value || 'FR';
    const country = window.EuroSpecialtiesData.countries.find(c => c.id === countryId);
    if (!country) return;

    const amount = parseFloat(amountInput.value) || 0;
    let rateNum = 0.12; // 預設 12%

    if (countryId === 'FR') rateNum = 0.12;
    else if (countryId === 'ES') rateNum = 0.13;
    else if (countryId === 'CH') rateNum = 0.077;
    else if (countryId === 'IT') rateNum = 0.125;
    else if (countryId === 'PT') rateNum = 0.13;
    else if (countryId === 'AT') rateNum = 0.11;
    else if (countryId === 'CZ') rateNum = 0.12;
    else if (countryId === 'PL') rateNum = 0.14;
    else if (countryId === 'HU') rateNum = 0.14;

    const refundForeign = Math.round((amount * rateNum + Number.EPSILON) * 100) / 100;
    const rateTwd = window.currencyManager ? window.currencyManager.getRate(country.currency) : 35.5;
    const refundTwd = Math.round(refundForeign * rateTwd);

    refundOut.innerText = `${country.currency} ${refundForeign.toFixed(2)} (約 NT$ ${refundTwd.toLocaleString('zh-TW')})`;
    
    if (noteOut) {
      noteOut.innerText = `門檻：${country.taxRefund.minSpend > 0 ? `滿 ${country.taxRefund.minSpend} ${country.currency}` : '無門檻'} | 退稅率約 ${country.taxRefund.rateText}`;
    }
  }
}

// 實例化全域願望與名產管理器
window.wishlistManager = new WishlistManager();
