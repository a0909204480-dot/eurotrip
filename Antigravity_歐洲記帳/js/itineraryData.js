/**
 * 歐洲 40 天多幣別旅行資料集 (EuroTrip Data & Strategy)
 * 包含：40天行程節奏預警、搶票清單、DCC 信用卡防雷、幣別清單與預設資料
 */

const EuroTripData = {
  // 幣別定義與符號
  currencies: [
    { code: 'EUR', name: '歐元 (EUR €)', symbol: '€', flag: '🇪🇺', defaultRate: 35.50, countries: '法國, 西班牙, 葡萄牙, 義大利, 奧地利, 德國' },
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

  // 支付方式預設
  paymentMethods: [
    '信用卡A (海外回饋 3% 無上限)',
    '信用卡B (高額海外刷卡備用卡)',
    '歐元現金 (EUR Cash)',
    '瑞郎現金 (CHF Cash)',
    '捷克克朗現金 (CZK Cash)',
    'Apple Pay / Google Pay',
    'Revolut / Wise 跨國多幣借記卡',
    'LINE Pay / 台灣網銀 (出發前預付)'
  ],

  // 歐洲 40 天行程節奏分析 (Pacing Strategy)
  pacingTimeline: [
    {
      phase: '第一階段：葡西高強度考驗期',
      days: 'Day 1 – Day 9',
      intensity: '高強度 (High Intensity 🔥)',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      description: '葡萄牙與西班牙地形起伏大、景點密集，含跨國夜巴與每日長距離步行。',
      warnings: [
        {
          title: '波多 (Porto) -> 馬德里 (Madrid) 跨國夜巴體力復原',
          detail: '車程約 8 小時且路況顛簸，抵達馬德里當日建議安排下午補眠或只逛麗池公園，嚴禁排滿緊湊行程，避免累積疲憊！'
        },
        {
          title: '馬德里與巴塞隆納「每日 20,000+ 步」高步行負擔',
          detail: '聖家堂、奎爾公園、普拉多博物館等景點腹地廣大，地鐵轉乘樓梯多。強烈建議穿著支撐性好的健走鞋，每晚抬腿放鬆。'
        },
        {
          title: '南歐地中海作息與防扒提醒',
          detail: '西班牙午餐約 14:00、晚餐 20:30 以後。巴塞隆納蘭布拉大道與地鐵為歐洲扒手最高發區域，防割斜背包請隨時置於胸前！'
        }
      ]
    },
    {
      phase: '第二階段：法瑞義東歐平穩深度期',
      days: 'Day 10 – Day 40',
      intensity: '平穩節奏 (Steady Pace 🌿)',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      description: '節奏轉為大城市連住 4 晚定點深度遊，保留彈性緩衝日，身心負擔大幅減輕。',
      warnings: [
        {
          title: '巴黎 (4晚) & 瑞士 (4晚) & 維也納 (4晚) 定點連住優勢',
          detail: '不用天天拖行李換飯店！利用放射狀一日遊玩法（例如琉森住 4 晚遊皮拉圖斯山/鐵力士山），保留體力享受生活。'
        },
        {
          title: '因特拉肯 (Interlaken) 跳傘氣候緩衝機制',
          detail: '阿爾卑斯山區氣候多變，跳傘與滑翔翼務必預留「至少 2 天彈性窗口」，首日遇雨或起霧可順延至隔日清晨。'
        },
        {
          title: '庫倫洛夫 (CK小鎮) 門對門穿梭巴士 (Door-to-Door Shuttle)',
          detail: 'CK 小鎮皆為石板路，強烈預訂 Bean Shuttle 或 CK Shuttle 直接從維也納/薩爾斯堡飯店門口接駁至 CK 民宿，避免拖行李走在碎石路輪胎報銷。'
        },
        {
          title: '東歐貨幣（捷克 CZK / 波蘭 PLN / 匈牙利 HUF）刷卡攻略',
          detail: '東歐普遍支援感應刷卡，換少量現金即可（如上廁所 10-20 CZK）。在東歐刷卡一樣選當地幣別結帳！'
        }
      ]
    }
  ],

  // 搶票與早鳥監控清單 (Early Bird Booking Watchlist)
  bookingWatchlist: [
    {
      id: 'tgv-paris-swiss',
      title: '巴黎 ➔ 瑞士 (蘇黎世/巴塞爾) TGV Lyria 高鐵',
      category: '火車高鐵',
      recommendedAdvance: '出發前 3~4 個月搶早鳥票',
      targetCity: '巴黎 / 瑞士',
      officialUrl: 'https://www.sncf-connect.com/',
      priceEst: '約 29~65 EUR (現場買破 150 EUR)',
      tips: '法鐵早鳥票價差極大，SNCF Connect 官網準時開搶可省下超過 60% 交通費。',
      status: '待開搶',
      isBooked: false
    },
    {
      id: 'ave-madrid-barca',
      title: '馬德里 ➔ 巴塞隆納 高速鐵路 (Renfe AVE / Iryo / Ouigo)',
      category: '火車高鐵',
      recommendedAdvance: '出發前 2~3 個月',
      targetCity: '西班牙',
      officialUrl: 'https://www.iryo.eu/',
      priceEst: '約 18~45 EUR',
      tips: '西班牙高鐵目前有 Renfe、Iryo、Ouigo 三家競爭，使用 Omio 或 Trainline 比價，Iryo 車廂最新最舒適。',
      status: '待開搶',
      isBooked: false
    },
    {
      id: 'eurocity-lucerne-venice',
      title: '琉森/米蘭 ➔ 威尼斯 EuroCity / Frecciarossa 跨國景觀列車',
      category: '火車高鐵',
      recommendedAdvance: '出發前 2 個月',
      targetCity: '瑞士 / 義大利',
      officialUrl: 'https://www.trenitalia.com/',
      priceEst: '約 35~50 EUR',
      tips: '穿越阿爾卑斯山脈景觀壯麗，義大利國鐵 Trenitalia 早鳥 Super Economy 票價最划算。',
      status: '待開搶',
      isBooked: false
    },
    {
      id: 'budget-flight-baggage',
      title: '歐洲境內廉航加購托運行李 (Ryanair / EasyJet / Vueling)',
      category: '廉航行李',
      recommendedAdvance: '訂機票時「同步加購」',
      targetCity: '跨國飛行',
      officialUrl: 'https://www.ryanair.com/',
      priceEst: '約 25~40 EUR (機場現場加收 70+ EUR)',
      tips: '歐洲廉航現場加購行李罰金極高！手提行李尺寸檢查極嚴（特別是 Ryanair），務必在官網提前買足 20kg 托運額度。',
      status: '待開搶',
      isBooked: false
    },
    {
      id: 'sagrada-familia-tower',
      title: '巴塞隆納聖家堂登塔門票 (Sagrada Família + Towers)',
      category: '門票景點',
      recommendedAdvance: '出發前 2 個月 (極度熱門)',
      targetCity: '巴塞隆納',
      officialUrl: 'https://sagradafamilia.org/en/tickets',
      priceEst: '約 36 EUR (含登塔與語音導覽)',
      tips: '登塔推薦「受難立面 (Passion Façade)」，下午光線佳且可搭電梯上樓走螺旋梯下樓。',
      status: '待開搶',
      isBooked: false
    },
    {
      id: 'vatican-museum',
      title: '羅馬梵蒂岡博物館與西斯汀禮拜堂 (Vatican Museums)',
      category: '門票景點',
      recommendedAdvance: '出發前 60 天 (官網搶票秒殺)',
      targetCity: '羅馬',
      officialUrl: 'https://tickets.museivaticani.va/',
      priceEst: '約 22 EUR (現場排隊 3 小時起跳)',
      tips: '建議預訂早晨 08:00 第一梯次或週五夜間開放場次，人潮最少，體驗米開朗基羅《創世紀》真跡。',
      status: '待開搶',
      isBooked: false
    },
    {
      id: 'auschwitz-tour',
      title: '波蘭奧斯威辛集中營官方英語導覽 (Auschwitz-Birkenau)',
      category: '門票景點',
      recommendedAdvance: '出發前 90 天',
      targetCity: '克拉科夫',
      officialUrl: 'https://visit.auschwitz.org/',
      priceEst: '約 90~110 PLN (約 800 TWD)',
      tips: '歷史深度極高，官方 Educator 導覽名額有限，強烈建議開賣當天立即預約上午英文團。',
      status: '待開搶',
      isBooked: false
    },
    {
      id: 'interlaken-skydive',
      title: '瑞士因特拉肯阿爾卑斯山雪山高空跳傘 (Skydive Interlaken)',
      category: '極限運動',
      recommendedAdvance: '出發前 1~2 個月',
      targetCity: '瑞士因特拉肯',
      officialUrl: 'https://www.skydiveinterlaken.ch/',
      priceEst: '約 450~520 CHF (含高空攝影)',
      tips: '飛越少女峰與雙湖景觀，震撼力一生必試！務必預留前後 1~2 天作為天候候補日。',
      status: '待開搶',
      isBooked: false
    }
  ],

  // 信用卡防雷與 DCC 警示指南
  creditCardGuide: {
    dccWarning: {
      title: '⚠️ 嚴禁動態貨幣轉換 (DCC, Dynamic Currency Conversion)',
      subtitle: '歐洲刷卡結帳第一鐵律：請一律堅定選擇「當地貨幣 (EUR / CHF / CZK / PLN)」！',
      explanation: '在歐洲刷卡時，刷卡機 (POS機) 若跳出「以 TWD 新台幣結帳」或「以 EUR 歐元結帳」，如果選了 TWD，商家收單銀行會以極差的黑市匯率轉換，並額外加收 5% ~ 10% 的 DCC 手續費！',
      goldenRule: '「在法國/西班牙刷 EUR」、「在瑞士刷 CHF」、「在捷克刷 CZK」—— 永遠只刷當地貨幣，由台灣發卡銀行按國際威士/萬事達公定匯率結算，才能拿到最優匯率與海外回饋！'
    },
    cardTips: [
      {
        icon: 'credit-card',
        title: '挑選海外消費回饋 > 3% 的信用卡',
        content: '台灣信用卡海外刷卡會收取 1.5% 國際交易手續費。選擇海外回饋 3% 以上且無上限的卡片（如富邦J卡、台新FlyGo、玉山熊本熊/星展eco等），倒賺 1.5%+ 淨回饋！'
      },
      {
        icon: 'shield-alert',
        title: '隨身準備 2~3 張不同發卡組織的實體卡片',
        content: '主刷卡、備用卡（Mastercard + Visa 各一）、跨國提款卡分開存放（一張放身上防割包、一張放飯店行李箱保險箱），避免單一卡片被吞卡、消磁或被鎖卡時陷入困境。'
      },
      {
        icon: 'smartphone',
        title: '出發前開通海外交易與預借現金密碼 (PIN碼)',
        content: '歐洲火車售票機、無人加油站、地鐵加值機常常要求輸入 4 位數或 6 位數 PIN 碼。出發前請聯絡發卡銀行客服設定「預借現金密碼」，此密碼即為歐洲無人機器的授權碼。'
      },
      {
        icon: 'lock',
        title: '防扒手與感應側錄防護 (RFID 防盜防割)',
        content: '巴黎地鐵、巴塞隆納蘭布拉大道、羅馬競技場為扒手熱區。請使用具備 RFID 防側錄功能的貼身隱形腰包，手機加裝防搶掛繩，切勿將皮夾置於後褲袋。'
      }
    ]
  },

  // 40 天行程範本參考
  sampleDays: [
    { day: 1, country: '葡萄牙', city: '里斯本 (Lisbon)', highlight: '熱羅尼莫斯修道院、百年蛋撻店、28號復古電車', intensity: '高' },
    { day: 2, country: '葡萄牙', city: '辛特拉 (Sintra)', highlight: '佩納宮、羅卡角歐陸最西端日落', intensity: '高' },
    { day: 3, country: '葡萄牙', city: '波多 (Porto)', highlight: '路易一世大橋、萊羅書店、杜羅河遊船', intensity: '中' },
    { day: 4, country: '葡萄牙/西班牙', city: '波多 ➔ 馬德里', highlight: '跨國夜巴挑戰 / 抵達馬德里麗池公園散步復原', intensity: '高 (夜巴)' },
    { day: 5, country: '西班牙', city: '馬德里 (Madrid)', highlight: '馬德里皇宮、普拉多博物館、聖米格爾市場', intensity: '高 (2萬步)' },
    { day: 6, country: '西班牙', city: '塞哥維亞 / 托雷多', highlight: '古羅馬水道橋、烤乳豬一日遊', intensity: '中' },
    { day: 7, country: '西班牙', city: '巴塞隆納 (Barcelona)', highlight: 'AVE 高鐵前往巴塞隆納、蘭布拉大道防扒巡禮', intensity: '中' },
    { day: 8, country: '西班牙', city: '巴塞隆納', highlight: '聖家堂登塔、米拉之家、巴特婁之家高第建築巡禮', intensity: '高 (2萬步)' },
    { day: 9, country: '西班牙', city: '巴塞隆納', highlight: '奎爾公園、蒙特惠奇城堡、哥德區小巷', intensity: '中' },
    { day: 10, country: '法國', city: '巴黎 (Paris) 4N 第1天', highlight: '飛抵巴黎戴高樂機場、羅浮宮夜景散步', intensity: '平穩' },
    { day: 11, country: '法國', city: '巴黎 4N 第2天', highlight: '艾菲爾鐵塔、塞納河遊船、凱旋門、香榭大道', intensity: '平穩' },
    { day: 12, country: '法國', city: '巴黎 4N 第3天', highlight: '奧賽美術館、瑪黑區早午餐、巴黎聖母院', intensity: '平穩' },
    { day: 13, country: '法國', city: '巴黎 4N 第4天', highlight: '凡爾賽宮鏡廳與花園漫步、蒙馬特聖心堂', intensity: '平穩' },
    { day: 14, country: '瑞士', city: '蘇黎世 ➔ 琉森 (Luzern) 4N', highlight: '搭乘 TGV Lyria 進瑞士、琉森卡貝爾橋、垂死獅子像', intensity: '平穩' },
    { day: 15, country: '瑞士', city: '琉森 (皮拉圖斯山)', highlight: '金色環遊世界最陡峭齒軌火車、皮拉圖斯山頂俯瞰', intensity: '平穩' },
    { day: 16, country: '瑞士', city: '因特拉肯 (Interlaken)', highlight: '阿爾卑斯高空跳傘 (預留首選日)、哈德昆觀景台', intensity: '平穩 (跳傘)' },
    { day: 17, country: '瑞士', city: '格林德瓦 / 少女峰', highlight: '艾格快線登歐洲之巔少女峰 (跳傘備用緩衝日)', intensity: '平穩 (彈性日)' },
    { day: 18, country: '瑞士/義大利', city: '策馬特 ➔ 米蘭', highlight: '馬特洪峰冰川天堂、跨國列車前往時尚之都米蘭', intensity: '中' },
    { day: 19, country: '義大利', city: '米蘭 ➔ 威尼斯 (Venice)', highlight: '米蘭大教堂登頂、艾曼紐二世迴廊、前往水都威尼斯', intensity: '平穩' },
    { day: 20, country: '義大利', city: '威尼斯 (Venice)', highlight: '聖馬可廣場、貢多拉鳳尾船、彩色島 (Burano)', intensity: '平穩' },
    { day: 21, country: '義大利', city: '佛羅倫斯 (Florence)', highlight: '聖母百花大教堂、烏菲茲美術館、托斯卡尼丁骨大牛排', intensity: '平穩' },
    { day: 22, country: '義大利', city: '比薩 / 佛羅倫斯', highlight: '比薩斜塔趣味擺拍、米開朗基羅廣場看浪漫日落', intensity: '平穩' },
    { day: 23, country: '義大利', city: '羅馬 (Rome) 4N 第1天', highlight: '羅馬競技場、古羅馬廣場、君士坦丁凱旋門', intensity: '中' },
    { day: 24, country: '義大利/梵蒂岡', city: '羅馬 4N 第2天', highlight: '梵蒂岡博物館早鳥入場、西斯汀禮拜堂、聖彼得大教堂', intensity: '平穩 (早鳥)' },
    { day: 25, country: '義大利', city: '羅馬 4N 第3天', highlight: '萬神殿、特雷維羅馬許願池投硬幣、西班牙階梯', intensity: '平穩' },
    { day: 26, country: '義大利', city: '羅馬 4N 第4天', highlight: '聖天使城堡、特拉斯提弗列品嚐正宗義大利麵', intensity: '平穩' },
    { day: 27, country: '奧地利', city: '維也納 (Vienna) 4N 第1天', highlight: '跨國飛行抵達維也納、聖史蒂芬大教堂', intensity: '平穩' },
    { day: 28, country: '奧地利', city: '維也納 4N 第2天', highlight: '美泉宮 (熊布朗宮) 皇家花園、中央咖啡館品薩赫蛋糕', intensity: '平穩' },
    { day: 29, country: '奧地利', city: '維也納 4N 第3天', highlight: '霍夫堡宮、藝術史博物館、金色大廳古典音樂會', intensity: '平穩' },
    { day: 30, country: '奧地利', city: '維也納 4N 第4天 / 瓦豪河谷', highlight: '瓦豪河谷多瑙河遊船、梅爾克修道院一日遊', intensity: '平穩' },
    { day: 31, country: '奧地利/捷克', city: '薩爾斯堡 ➔ CK小鎮', highlight: '莫札特故居、搭乘 CK Shuttle 門對門專車直達庫倫洛夫', intensity: '平穩 (Shuttle)' },
    { day: 32, country: '捷克', city: '庫倫洛夫 (Český Krumlov)', highlight: '彩繪塔登頂、伏爾塔瓦河泛舟、中世紀城堡漫步', intensity: '平穩' },
    { day: 33, country: '捷克', city: '布拉格 (Prague) 3N 第1天', highlight: '查理大橋清晨美景、舊城廣場天文鐘報時', intensity: '平穩' },
    { day: 34, country: '捷克', city: '布拉格 3N 第2天', highlight: '布拉格城堡區、聖維特大教堂、黃金巷卡夫卡故居', intensity: '平穩' },
    { day: 35, country: '捷克', city: '布拉格 3N 第3天 / 庫特納霍拉', highlight: '人骨教堂一日遊、品嚐捷克傳統烤鴨與皮爾森啤酒', intensity: '平穩' },
    { day: 36, country: '波蘭', city: '克拉科夫 (Krakow) 3N 第1天', highlight: '搭乘跨國列車前往波蘭克拉科夫、中央市集廣場', intensity: '平穩' },
    { day: 37, country: '波蘭', city: '克拉科夫 (奧斯威辛)', highlight: '奧斯威辛-比克瑙集中營官方導覽 (歷史深刻體驗)', intensity: '平穩 (早鳥預約)' },
    { day: 38, country: '波蘭', city: '克拉科夫 (維利奇卡鹽礦)', highlight: '世界遺產維利奇卡地下鹽礦地下教堂與鹽雕奇蹟', intensity: '平穩' },
    { day: 39, country: '波蘭/回程', city: '華沙 / 轉機回程', highlight: '蕭邦公園、瓦津基宮、免稅店最後伴手禮採購', intensity: '平穩' },
    { day: 40, country: '台灣', city: '台北 (Taipei)', highlight: '平安抵達台灣，完成 40 天歐陸壯遊記帳總結算！🎉', intensity: '圓滿完成' }
  ]
};

// 暴露至全域物件
window.EuroTripData = EuroTripData;
