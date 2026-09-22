/**
 * 歐洲 40 天多幣別旅行資料集 (EuroTrip 40-Day Data & Pacing Architecture)
 * 包含：精確三階段行程配置（前期葡西、中期法瑞、後期義大利與東歐）、每日行程、防雷警示與幣別設定
 */

const EuroTripData = {
  // 幣別定義與符號
  currencies: [
    { code: 'EUR', name: '歐元 (EUR €)', symbol: '€', flag: '🇪🇺', defaultRate: 35.50, countries: '法國, 西班牙, 葡萄牙, 義大利, 奧地利' },
    { code: 'CHF', name: '瑞士法郎 (CHF)', symbol: 'CHF', flag: '🇨🇭', defaultRate: 36.80, countries: '瑞士 (蘇黎世, 琉森, 因特拉肯, 策馬特)' },
    { code: 'USD', name: '美元 (USD $)', symbol: '$', flag: '🇺🇸', defaultRate: 32.20, countries: '國際預訂, 跨國保險, 備用外幣' },
    { code: 'CZK', name: '捷克克朗 (CZK)', symbol: 'Kč', flag: '🇨🇿', defaultRate: 1.45, countries: '捷克 (布拉格, CK小鎮 庫倫洛夫)' },
    { code: 'GBP', name: '英鎊 (GBP £)', symbol: '£', flag: '🇬🇧', defaultRate: 41.50, countries: '英國, 轉機航廈購物' },
    { code: 'PLN', name: '波蘭茲羅提 (PLN)', symbol: 'zł', flag: '🇵🇱', defaultRate: 8.10, countries: '波蘭 (克拉科夫, 華沙, 奧斯威辛)' },
    { code: 'HUF', name: '匈牙利福林 (HUF)', symbol: 'Ft', flag: '🇭🇺', defaultRate: 0.09, countries: '匈牙利 (布達佩斯)' },
    { code: 'TWD', name: '新台幣 (TWD NT$)', symbol: 'NT$', flag: '🇹🇼', defaultRate: 1.00, countries: '台灣出發預付項目' }
  ],

  // 支出類別
  categories: [
    { id: 'transport', name: '交通 (機票/火車/巴士/地鐵)', icon: 'train', color: '#3B82F6' },
    { id: 'stay', name: '住宿 (飯店/Airbnb/青旅)', icon: 'bed', color: '#8B5CF6' },
    { id: 'food', name: '餐飲 (餐廳/咖啡/超市/點心)', icon: 'utensils', color: '#F59E0B' },
    { id: 'ticket', name: '門票景點 (博物館/高空活動/導覽)', icon: 'ticket', color: '#10B981' },
    { id: 'shopping', name: '購物紀念品 (藥妝/精品/伴手禮)', icon: 'shopping-bag', color: '#EC4899' },
    { id: 'telecom', name: '通訊保險 (網卡eSIM/申根保險)', icon: 'shield-check', color: '#6366F1' },
    { id: 'misc', name: '其他雜支 (小費/寄行李/廁所零錢)', icon: 'sparkles', color: '#64748B' }
  ],

  // 40 天行程三大階段核心配置與節奏評估 (3-Phase Trip Architecture)
  phases: [
    {
      id: 'phase-1',
      title: '前期：葡萄牙 ＆ 西班牙',
      days: 'Day 1 – Day 9 (共 9 天)',
      paceType: '偏趕緊湊・體力考驗 🏃',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      bannerBg: 'from-[#FFF0F2] via-[#FFF8F8] to-[#FFF4EC]',
      countries: ['葡萄牙 🇵🇹', '西班牙 🇪🇸'],
      countryIds: ['PT', 'ES'],
      summary: '前期節奏偏緊湊，包含波多跨國夜巴銜接與高第建築群高密度步行，需特別注意體力調節與補眠。',
      coreNotices: [
        {
          title: '🚌 夜巴銜接白天觀光（Day 4 ➔ Day 5）',
          type: 'warning',
          content: '搭乘 8.5 小時夜巴從波多抵達馬德里（08:05 到達），當天通常無法立即入住飯店。若直接接著進行緊湊市區行程，睡眠不足會直接影響後續體力！建議先至飯店寄放行李，找咖啡廳吃早餐放鬆，下午安排麗池公園慢步或短暫補眠。'
        },
        {
          title: '🚇 馬德里與巴塞隆納換城緊湊（Day 5 – Day 9）',
          type: 'info',
          content: '馬德里實際完整觀光僅約 1.5 天（Day 5 下午與 Day 6）；Day 7 早上搭高鐵至巴塞隆納；Day 8 需走完聖家堂登塔、桂爾公園與巴特婁之家。高第建築點與點之間需頻繁地鐵轉乘，且非常耗腿力，請務必穿著支撐性強的健走鞋！'
        }
      ]
    },
    {
      id: 'phase-2',
      title: '中期：法國 ＆ 瑞士',
      days: 'Day 10 – Day 17 (共 8 天)',
      paceType: '舒適轉換・放慢呼吸 🌿',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      bannerBg: 'from-[#EBF7EE] via-[#F4FAF5] to-[#FFFDF9]',
      countries: ['法國 🇫🇷', '瑞士 🇨🇭'],
      countryIds: ['FR', 'CH'],
      summary: '中期進入大城連住深度遊，節奏放緩，享受巴黎人文藝術與阿爾卑斯壯麗雪山。',
      coreNotices: [
        {
          title: '🎨 巴黎 4 晚定點慢遊（Day 10 – Day 13）',
          type: 'success',
          content: '羅浮宮、奧賽美術館、蒙馬特聖心堂與塞納河遊船分散在 4 天，節奏剛剛好，不會走馬看花，有充裕時間坐在露天咖啡館享受巴黎氛圍與藥妝購物。'
        },
        {
          title: '🪂 瑞士 4 晚與跳傘彈性備案（Day 14 – Day 17）',
          type: 'success',
          content: '因特拉肯預留跳傘備案日是絕佳安排！高山氣候多變，有備用天數可應對天候。高山健行與小鎮散步動線順暢，有足夠空間放慢呼吸。'
        }
      ]
    },
    {
      id: 'phase-3',
      title: '後期：義大利 ＆ 東歐四國',
      days: 'Day 18 – Day 40 (共 23 天)',
      paceType: '經典適中・採買退稅收尾 🏰',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      bannerBg: 'from-[#FFF8E7] via-[#FFFBF0] to-[#FFF4EC]',
      countries: ['義大利 🇮🇹', '波蘭 🇵🇱', '匈牙利 🇭🇺', '捷克 🇨🇿', '奧地利 🇦🇹'],
      countryIds: ['IT', 'PL', 'HU', 'CZ', 'AT'],
      summary: '義大利經典高鐵銜接，東歐大城慢步，最後在維也納留 4 晚從容應對名產採買與退稅。',
      coreNotices: [
        {
          title: '🚄 義大利三城經典高鐵動線（Day 18 – Day 24）',
          type: 'info',
          content: '威尼斯 2 晚、佛羅倫斯 2 晚、羅馬 3 晚，均為 1.5–2 小時高鐵銜接，屬於標準的經典順暢走法，免去長途拉車之苦。'
        },
        {
          title: '🏰 東歐慢遊與維也納退稅採買收尾（Day 25 – Day 40）',
          type: 'success',
          content: '克拉科夫、布達佩斯、布拉格各留 3 晚；CK 小鎮住 2 晚且利用接駁專車（Door-to-Door Shuttle）；維也納留 4 晚從容應對伴手禮大採購與機場退稅，整體節奏非常舒適，不易感到倉促。'
        }
      ]
    }
  ],

  // 40 天精準行程列表
  dailyItinerary: [
    // 前期 (Day 1 - 9)
    { day: 1, phaseId: 'phase-1', country: '葡萄牙', city: '里斯本 (Lisbon)', stay: '里斯本 1/2晚', highlight: '熱羅尼莫斯修道院、貝倫百年蛋撻店、28號復古電車', tag: '市區經典' },
    { day: 2, phaseId: 'phase-1', country: '葡萄牙', city: '辛特拉 ➔ 里斯本', stay: '里斯本 2/2晚', highlight: '佩納宮彩色城堡、羅卡角歐陸最西端看大西洋日落', tag: '近郊一日' },
    { day: 3, phaseId: 'phase-1', country: '葡萄牙', city: '波多 (Porto)', stay: '波多 1/1晚', highlight: '路易一世大橋、萊羅書店、杜羅河畔酒莊品波特酒', tag: '酒莊水岸' },
    { day: 4, phaseId: 'phase-1', country: '葡萄牙 ➔ 西班牙', city: '波多 ➔ 跨國夜巴', stay: '🚌 跨國夜巴 (車上過夜)', highlight: '波多老城最後漫步，晚間搭乘 8.5 小時跨國夜巴前往馬德里', tag: '⚠️ 跨國夜巴' },
    { day: 5, phaseId: 'phase-1', country: '西班牙', city: '馬德里 (Madrid)', stay: '馬德里 1/2晚', highlight: '清晨 08:05 抵達馬德里 ➔ 飯店寄放行李、早午餐補眠、午後麗池公園散步', tag: '⚠️ 補眠調息' },
    { day: 6, phaseId: 'phase-1', country: '西班牙', city: '馬德里 (Madrid)', stay: '馬德里 2/2晚', highlight: '馬德里皇宮、普拉多博物館、聖米格爾市場品嚐 Tapas', tag: '藝術宮殿' },
    { day: 7, phaseId: 'phase-1', country: '西班牙', city: '馬德里 ➔ 巴塞隆納', stay: '巴塞隆納 1/3晚', highlight: '搭乘 AVE 高鐵直達巴塞隆納，午後蘭布拉大道與哥德區巡禮（注意防扒）', tag: '高鐵換城' },
    { day: 8, phaseId: 'phase-1', country: '西班牙', city: '巴塞隆納 (Barcelona)', stay: '巴塞隆納 2/3晚', highlight: '高第朝聖：聖家堂登塔 ➔ 桂爾公園 ➔ 巴特婁之家（地鐵頻繁轉乘、體力大考驗）', tag: '🔥 2萬步高第' },
    { day: 9, phaseId: 'phase-1', country: '西班牙', city: '巴塞隆納 (Barcelona)', stay: '巴塞隆納 3/3晚', highlight: '米拉之家、加泰隆尼亞音樂宮、巴塞隆納海灘放鬆品嚐海鮮飯', tag: '地中海風情' },

    // 中期 (Day 10 - 17)
    { day: 10, phaseId: 'phase-2', country: '法國', city: '巴黎 (Paris)', stay: '巴黎 1/4晚', highlight: '飛抵巴黎 ➔ 塞納河遊船欣賞艾菲爾鐵塔點燈夜景', tag: '巴黎浪漫' },
    { day: 11, phaseId: 'phase-2', country: '法國', city: '巴黎 (Paris)', stay: '巴黎 2/4晚', highlight: '羅浮宮鎮館三寶（蒙娜麗莎/勝利女神/維納斯）➔ 杜樂麗花園午後漫步', tag: '羅浮宮巡禮' },
    { day: 12, phaseId: 'phase-2', country: '法國', city: '巴黎 (Paris)', stay: '巴黎 3/4晚', highlight: '奧賽美術館印象派大作 ➔ 瑪黑區小眾選品與左岸 Citypharma 藥妝掃貨', tag: '奧賽與購物' },
    { day: 13, phaseId: 'phase-2', country: '法國', city: '巴黎 (Paris)', stay: '巴黎 4/4晚', highlight: '蒙馬特聖心堂俯瞰巴黎全景 ➔ 愛牆 ➔ 香榭麗舍大道凱旋門', tag: '聖心堂美景' },
    { day: 14, phaseId: 'phase-2', country: '瑞士', city: '巴黎 ➔ 瑞士琉森', stay: '琉森/因特拉肯 1/4晚', highlight: '搭乘 TGV Lyria 高鐵進瑞士 ➔ 琉森卡貝爾木橋與垂死獅子像', tag: '阿爾卑斯進駐' },
    { day: 15, phaseId: 'phase-2', country: '瑞士', city: '琉森 / 皮拉圖斯山', stay: '琉森/因特拉肯 2/4晚', highlight: '金色環遊搭乘世界最陡齒軌火車登皮拉圖斯山頂俯瞰琉森湖', tag: '雪山湖泊' },
    { day: 16, phaseId: 'phase-2', country: '瑞士', city: '因特拉肯 (Interlaken)', stay: '因特拉肯 3/4晚', highlight: '因特拉肯雪山高空跳傘（首選日）➔ 哈德昆觀景台俯瞰雙湖', tag: '🪂 跳傘首選' },
    { day: 17, phaseId: 'phase-2', country: '瑞士', city: '格林德瓦 / 少女峰', stay: '因特拉肯 4/4晚', highlight: '艾格快線直達歐洲之巔少女峰健行（跳傘天候彈性備案日）', tag: '🌿 備案放慢' },

    // 後期 (Day 18 - 40)
    { day: 18, phaseId: 'phase-3', country: '義大利', city: '瑞士 ➔ 威尼斯 (Venice)', stay: '威尼斯 1/2晚', highlight: '跨國火車前往水都威尼斯 ➔ 聖馬可廣場與貢多拉鳳尾船穿梭運河', tag: '水都威尼斯' },
    { day: 19, phaseId: 'phase-3', country: '義大利', city: '威尼斯 (Venice)', stay: '威尼斯 2/2晚', highlight: '彩色島 (Burano) 蕾絲童話小鎮 ➔ 總督宮與嘆息橋夕陽', tag: '彩色島慢步' },
    { day: 20, phaseId: 'phase-3', country: '義大利', city: '威尼斯 ➔ 佛羅倫斯', stay: '佛羅倫斯 1/2晚', highlight: '高鐵 2h 抵達文藝復興之都 ➔ 聖母百花大教堂登頂 ➔ 享用托斯卡尼丁骨大牛排', tag: '百花大教堂' },
    { day: 21, phaseId: 'phase-3', country: '義大利', city: '佛羅倫斯 (Florence)', stay: '佛羅倫斯 2/2晚', highlight: '烏菲茲美術館 ➔ SMN 百年修道院藥局 ➔ 米開朗基羅廣場看日落', tag: '文藝復興' },
    { day: 22, phaseId: 'phase-3', country: '義大利', city: '佛羅倫斯 ➔ 羅馬', stay: '羅馬 1/3晚', highlight: '高鐵 1.5h 直達永恆之城羅馬 ➔ 萬神殿 ➔ 特雷維許願池投硬幣', tag: '古羅馬' },
    { day: 23, phaseId: 'phase-3', country: '義大利/梵蒂岡', city: '羅馬 (Rome)', stay: '羅馬 2/3晚', highlight: '梵蒂岡博物館早鳥入場 ➔ 西斯汀禮拜堂《創世紀》➔ 聖彼得大教堂', tag: '梵蒂岡朝聖' },
    { day: 24, phaseId: 'phase-3', country: '義大利', city: '羅馬 (Rome)', stay: '羅馬 3/3晚', highlight: '羅馬競技場與古羅馬廣場深度導覽 ➔ 西班牙階梯品嚐義式冰淇淋', tag: '競技場經典' },
    { day: 25, phaseId: 'phase-3', country: '波蘭', city: '羅馬 ➔ 克拉科夫', stay: '克拉科夫 1/3晚', highlight: '搭機前往波蘭文化古都克拉科夫 ➔ 中央市集廣場與紡織會館', tag: '波蘭古城' },
    { day: 26, phaseId: 'phase-3', country: '波蘭', city: '克拉科夫 (Krakow)', stay: '克拉科夫 2/3晚', highlight: '奧斯威辛-比克瑙集中營官方導覽（沉痛歷史深刻體驗）', tag: '歷史巡禮' },
    { day: 27, phaseId: 'phase-3', country: '波蘭', city: '克拉科夫 (Krakow)', stay: '克拉科夫 3/3晚', highlight: '維利奇卡地下鹽礦地下教堂奇蹟 ➔ 瓦維爾城堡', tag: '地下鹽礦' },
    { day: 28, phaseId: 'phase-3', country: '匈牙利', city: '克拉科夫 ➔ 布達佩斯', stay: '布達佩斯 1/3晚', highlight: '前往多瑙河明珠布達佩斯 ➔ 塞切尼鏈橋與國會大廈璀璨夜景遊船', tag: '多瑙河夜景' },
    { day: 29, phaseId: 'phase-3', country: '匈牙利', city: '布達佩斯 (Budapest)', stay: '布達佩斯 2/3晚', highlight: '漁夫堡童話迴廊看日出 ➔ 馬加什教堂 ➔ 布達皇宮全景', tag: '漁夫堡童話' },
    { day: 30, phaseId: 'phase-3', country: '匈牙利', city: '布達佩斯 (Budapest)', stay: '布達佩斯 3/3晚', highlight: '塞切尼百年露天溫泉放鬆 ➔ 紐約宮殿咖啡館品嚐貴婦下午茶', tag: '溫泉與咖啡' },
    { day: 31, phaseId: 'phase-3', country: '捷克', city: '布達佩斯 ➔ 布拉格', stay: '布拉格 1/3晚', highlight: '抵達百塔之城布拉格 ➔ 查理大橋夕陽漫步 ➔ 舊城廣場天文鐘', tag: '百塔之城' },
    { day: 32, phaseId: 'phase-3', country: '捷克', city: '布拉格 (Prague)', stay: '布拉格 2/3晚', highlight: '布拉格城堡區 ➔ 聖維特大教堂 ➔ 黃金巷 ➔ 提恩教堂後菠丹妮總店採購', tag: '城堡與菠丹妮' },
    { day: 33, phaseId: 'phase-3', country: '捷克', city: '布拉格 (Prague)', stay: '布拉格 3/3晚', highlight: '高堡區俯瞰伏爾塔瓦河 ➔ 佩特任山纜車 ➔ 享用捷克傳統烤鴨配皮爾森啤酒', tag: '布拉格慢步' },
    { day: 34, phaseId: 'phase-3', country: '捷克', city: '布拉格 ➔ CK 小鎮', stay: '庫倫洛夫 1/2晚', highlight: '搭乘 Door-to-Door Shuttle 接駁專車直達庫倫洛夫 ➔ 彩繪塔俯瞰中世紀紅瓦屋頂', tag: '🚐 接駁專車' },
    { day: 35, phaseId: 'phase-3', country: '捷克', city: '庫倫洛夫 (Český Krumlov)', stay: '庫倫洛夫 2/2晚', highlight: 'CK 城堡花園漫步 ➔ 伏爾塔瓦河畔咖啡館放空發呆，享受童話小鎮夜景', tag: '童話小鎮慢活' },
    { day: 36, phaseId: 'phase-3', country: '奧地利', city: 'CK 小鎮 ➔ 維也納', stay: '維也納 1/4晚', highlight: '接駁專車前往音樂之都維也納 ➔ 聖史蒂芬大教堂 ➔ 葛拉本大街', tag: '音樂之都' },
    { day: 37, phaseId: 'phase-3', country: '奧地利', city: '維也納 (Vienna)', stay: '維也納 2/4晚', highlight: '美泉宮（熊布朗宮）皇家花園與鏡廳 ➔ 薩赫飯店品嚐正宗薩赫蛋糕', tag: '美泉宮皇家' },
    { day: 38, phaseId: 'phase-3', country: '奧地利', city: '維也納 (Vienna)', stay: '維也納 3/4晚', highlight: '藝術史博物館欣賞名畫 ➔ 霍夫堡宮 ➔ 莫札特藍色巧克力與名產採購', tag: '伴手禮採購' },
    { day: 39, phaseId: 'phase-3', country: '奧地利', city: '維也納 (Vienna)', stay: '維也納 4/4晚', highlight: '市區最後採買整理行李 ➔ 提前前往維也納國際機場辦理全歐退稅與託運', tag: '💶 機場退稅' },
    { day: 40, phaseId: 'phase-3', country: '台灣', city: '台北 (Taipei)', stay: '溫暖的家 🏠', highlight: '平安抵達台灣！完成 40 天歐陸壯遊記帳總結算！🎉', tag: '🎉 圓滿賦歸' }
  ]
};

// 暴露至全域物件
window.EuroTripData = EuroTripData;
