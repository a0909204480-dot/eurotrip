/**
 * 40天歐陸行程三階段節奏導覽與每日明細 (40-Day Itinerary Manager)
 * 奶油白簡約風・清爽不雜亂・支援階段切換與快速跳轉至名產願望
 */

class ItineraryManager {
  constructor() {
    this.currentSubView = 'itinerary'; // 'itinerary' or 'wishlist'
    this.currentPhaseId = 'phase-1';   // 'phase-1', 'phase-2', 'phase-3', 'ALL'
    this.isDayListExpanded = false;
  }

  // 初始化
  init() {
    this.renderAll();
  }

  // 切換第3頁子視圖 (行程節奏 VS 名產願望)
  switchSubView(viewName) {
    this.currentSubView = viewName;
    
    const itineraryPanel = document.getElementById('subview-itinerary-panel');
    const wishlistPanel = document.getElementById('subview-wishlist-panel');
    const btnItinerary = document.getElementById('btn-subview-itinerary');
    const btnWishlist = document.getElementById('btn-subview-wishlist');

    if (viewName === 'itinerary') {
      if (itineraryPanel) itineraryPanel.classList.remove('hidden');
      if (wishlistPanel) wishlistPanel.classList.add('hidden');
      
      if (btnItinerary) {
        btnItinerary.className = 'px-4 py-2 rounded-2xl text-xs sm:text-sm font-black bg-[#E88D67] text-white shadow-md transition-all btn-cute flex items-center gap-1.5';
      }
      if (btnWishlist) {
        btnWishlist.className = 'px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold bg-white text-[#706258] border border-[#EFE4D6] hover:bg-[#FAF7F2] transition-all btn-cute flex items-center gap-1.5';
      }
      this.renderItinerary();
    } else {
      if (itineraryPanel) itineraryPanel.classList.add('hidden');
      if (wishlistPanel) wishlistPanel.classList.remove('hidden');
      
      if (btnItinerary) {
        btnItinerary.className = 'px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold bg-white text-[#706258] border border-[#EFE4D6] hover:bg-[#FAF7F2] transition-all btn-cute flex items-center gap-1.5';
      }
      if (btnWishlist) {
        btnWishlist.className = 'px-4 py-2 rounded-2xl text-xs sm:text-sm font-black bg-[#E88D67] text-white shadow-md transition-all btn-cute flex items-center gap-1.5';
      }
      if (window.wishlistManager) {
        window.wishlistManager.renderAll();
      }
    }
  }

  // 切換所選的行程階段 (前期 / 中期 / 後期)
  selectPhase(phaseId) {
    this.currentPhaseId = phaseId;
    this.renderItinerary();
  }

  // 快速從行程跳轉至特定國家名產願望
  jumpToCountryWishlist(countryId) {
    this.switchSubView('wishlist');
    if (window.wishlistManager) {
      window.wishlistManager.selectCountry(countryId);
      // 平滑滾動至名產區
      const el = document.getElementById('wishlist-specialties-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // 渲染所有行程元件
  renderAll() {
    this.renderItinerary();
  }

  // 渲染行程主視圖
  renderItinerary() {
    const container = document.getElementById('subview-itinerary-panel');
    if (!container) return;

    const data = window.EuroTripData;
    if (!data || !data.phases) return;

    const currentPhase = data.phases.find(p => p.id === this.currentPhaseId) || data.phases[0];
    const filteredDays = this.currentPhaseId === 'ALL' 
      ? data.dailyItinerary 
      : data.dailyItinerary.filter(d => d.phaseId === this.currentPhaseId);

    container.innerHTML = `
      <!-- 1. 三大階段切換膠囊 (Phase Selector Pills) -->
      <div class="cream-card p-3 overflow-x-auto">
        <div class="flex items-center gap-2 min-w-max">
          ${data.phases.map(p => `
            <button onclick="window.itineraryManager.selectPhase('${p.id}')" 
                    class="px-4 py-2 rounded-xl text-xs font-black transition-all btn-cute flex items-center gap-1.5 whitespace-nowrap ${this.currentPhaseId === p.id ? 'bg-[#E88D67] text-white shadow-md' : 'bg-white text-[#706258] border border-[#EFE4D6] hover:bg-[#FAF7F2]'}">
              <span>${p.id === 'phase-1' ? '🏃' : p.id === 'phase-2' ? '🌿' : '🏰'}</span>
              <span>${p.title.split('：')[0]}</span>
              <span class="text-[10px] opacity-80">(${p.days.split(' ')[0]})</span>
            </button>
          `).join('')}

          <button onclick="window.itineraryManager.selectPhase('ALL')" 
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all btn-cute whitespace-nowrap ${this.currentPhaseId === 'ALL' ? 'bg-[#E88D67] text-white shadow-md' : 'bg-white text-[#706258] border border-[#EFE4D6] hover:bg-[#FAF7F2]'}">
            🌐 40 天全覽
          </button>
        </div>
      </div>

      <!-- 2. 階段核心橫幅與節奏評估卡片 -->
      ${this.currentPhaseId !== 'ALL' ? `
        <div class="cream-card p-4 sm:p-5 space-y-3.5 bg-gradient-to-r ${currentPhase.bannerBg} border-2 border-[#FCD5B5]">
          <div class="flex flex-wrap items-center justify-between gap-2.5">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h3 class="font-black text-[#3A302A] text-base sm:text-lg">${currentPhase.title}</h3>
                <span class="text-xs px-2.5 py-0.5 rounded-full font-bold border ${currentPhase.badgeClass}">
                  ${currentPhase.paceType}
                </span>
              </div>
              <p class="text-xs text-[#8C7A6B] font-medium">涵蓋範圍：${currentPhase.days} ｜ 國家：${currentPhase.countries.join('、')}</p>
            </div>

            <!-- 快速跳轉至本階段名產按鈕 -->
            <div class="flex items-center gap-1.5">
              ${currentPhase.countryIds.map(cid => {
                const cObj = window.EuroSpecialtiesData ? window.EuroSpecialtiesData.countries.find(c => c.id === cid) : null;
                return `
                  <button onclick="window.itineraryManager.jumpToCountryWishlist('${cid}')" 
                          class="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-[#D96B43] border border-[#FCD5B5] text-xs font-black shadow-sm btn-cute flex items-center gap-1"
                          title="查看 ${cObj ? cObj.name : cid} 名產與願望">
                    <span>${cObj ? cObj.flag : '🛍️'}</span> <span>${cObj ? cObj.name.split(' ')[0] : cid}名產</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <p class="text-xs text-[#706258] leading-relaxed bg-white/70 p-3 rounded-xl border border-[#F5ECE1]">
            💡 <strong>階段總結：</strong>${currentPhase.summary}
          </p>

          <!-- 核心交通與體力防坑提醒 (Core Notices) -->
          <div class="space-y-2 pt-1">
            <div class="text-xs font-black text-[#3A302A] flex items-center gap-1">
              <span>⚠️</span> 本階段核心注意事項與動線提示：
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              ${currentPhase.coreNotices.map(n => `
                <div class="p-3 rounded-2xl bg-white border border-[#EFE4D6] shadow-sm space-y-1">
                  <h4 class="font-black text-[#3A302A] text-xs flex items-center gap-1">
                    ${n.title}
                  </h4>
                  <p class="text-[11px] text-[#706258] leading-relaxed">
                    ${n.content}
                  </p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : `
        <div class="cream-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#FFF9F2] to-[#FFF4EC] border-2 border-[#FCD5B5]">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🗺️</span>
            <div>
              <h3 class="font-black text-[#3A302A] text-sm sm:text-base">40 天歐陸漫遊全景總覽 ✨</h3>
              <p class="text-xs text-[#8C7A6B] mt-0.5">三階段節奏：前期葡西緊湊 ➔ 中期法瑞放慢 ➔ 後期義大利東歐經典慢遊與退稅收尾</p>
            </div>
          </div>
          <button onclick="window.itineraryManager.switchSubView('wishlist')" 
                  class="px-4 py-2 rounded-xl bg-[#E88D67] hover:bg-[#D96B43] text-white text-xs font-black shadow-md btn-cute flex items-center gap-1.5">
            <span>🛍️</span> 查看各國名產願望
          </button>
        </div>
      `}

      <!-- 3. 每日行程明細清單 (獨立卡片區塊) -->
      <div class="cream-card p-4 sm:p-5 space-y-3.5">
        <div class="flex items-center justify-between pb-2.5 border-b border-[#F0E6D8]">
          <h3 class="text-sm sm:text-base font-black text-[#3A302A] flex items-center gap-1.5">
            <span>📅</span> ${this.currentPhaseId === 'ALL' ? '40 天每日行程規劃清單' : `${currentPhase.title.split('：')[0]}每日行程 (${filteredDays.length} 天)`}
          </h3>
          <span class="text-xs text-[#8C7A6B]">共 ${filteredDays.length} 天行程</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${filteredDays.map(d => `
            <div class="p-3.5 sm:p-4 rounded-2xl bg-[#FFFDF9] border border-[#EFE4D6] shadow-sm flex flex-col justify-between hover:border-[#FCD5B5] transition-all">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-lg bg-[#3A302A] text-white text-xs font-black font-mono">
                      Day ${d.day}
                    </span>
                    <span class="text-xs font-bold text-[#3A302A]">${d.country}</span>
                  </div>
                  <span class="text-[10px] px-2 py-0.5 rounded-md font-bold ${
                    d.tag.includes('⚠️') ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                    d.tag.includes('🔥') ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    d.tag.includes('🪂') || d.tag.includes('🌿') ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    'bg-[#FFF0E6] text-[#D96B43] border border-[#FCD5B5]'
                  }">
                    ${d.tag}
                  </span>
                </div>

                <div class="text-xs font-black text-[#3A302A] mb-1 flex items-center gap-1">
                  <span>📍</span> <span>${d.city}</span>
                </div>

                <p class="text-xs text-[#706258] leading-relaxed mb-2.5">
                  ${d.highlight}
                </p>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-[#F0E6D8] text-[11px] text-[#8C7A6B]">
                <span class="flex items-center gap-1">
                  <span>🏨</span> <span>${d.stay}</span>
                </span>
                
                <button onclick="window.app.openAddExpenseModal({ city: '${d.city.split(' ')[0]}', notes: 'Day ${d.day} 行程支出' })" 
                        class="px-2.5 py-1 rounded-lg bg-[#FFF4EC] hover:bg-[#FFE8D9] text-[#D96B43] font-bold border border-[#FCD5B5] btn-cute flex items-center gap-1">
                  <span>✍️</span> 記此日花費
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

// 實例化行程管理器
window.itineraryManager = new ItineraryManager();
