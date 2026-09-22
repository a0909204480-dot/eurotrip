/**
 * 40天行程專屬：各城市在地名產探索、小紅書熱門爆款 ＆ 採購攻略
 * 嚴格對應旅程 9 大國與精確城市：
 * 1. 葡萄牙 (里斯本 / 辛特拉 / 波多)
 * 2. 西班牙 (馬德里 / 巴塞隆納)
 * 3. 法國 (巴黎)
 * 4. 瑞士 (琉森 / 因特拉肯)
 * 5. 義大利 (威尼斯 / 佛羅倫斯 / 羅馬)
 * 6. 波蘭 (克拉科夫)
 * 7. 匈牙利 (布達佩斯)
 * 8. 捷克 (布拉格 / CK小鎮 庫倫洛夫)
 * 9. 奧地利 (維也納)
 */

const EuroSpecialtiesData = {
  countries: [
    {
      id: 'PT',
      name: '葡萄牙 Portugal',
      flag: '🇵🇹',
      city: '里斯本 (Lisbon) / 辛特拉 (Sintra) / 波多 (Porto)',
      currency: 'EUR',
      redBookHotSpots: 'Claus Porto 里斯本旗艦店、羅西烏廣場馬戲團沙丁魚罐頭、波多杜羅河畔酒莊、貝倫百年蛋塔店',
      taxRefund: {
        rateText: '約 12% ~ 14%',
        minSpend: 50,
        currency: 'EUR',
        tip: '葡萄牙退稅門檻為 €50，里斯本與波多機場設有電子自助退稅核驗機。'
      },
      shoppingTips: [
        '【香皂界的愛馬仕】Claus Porto 葡萄牙百年皇室手工皂，手繪復古包裝，洗完浴室留香整天。',
        '【專屬出生年份紀念】馬戲團沙丁魚罐頭店（O Mundo Fantástico da Sardinha），可以找到自己「出生年份」的限定金屬罐頭！',
        '【波多國寶波特酒】杜羅河畔木桶陳釀加烈酒（Taylor\'s / Sandeman），口感甜美焦糖香，下飛機前記得買！',
        '【百年正宗蛋塔肉桂粉】Pastéis de Belém（創始於 1837 年），現場撒上肉桂粉與糖粉熱騰騰吃最頂！',
        '【葡式藍白花磚工藝】Azulejo 藍白花磚結合天然軟木底座，防燙耐看，裝飾感極強。'
      ],
      specialties: [
        {
          name: 'Claus Porto 皇室復古手繪手工香氛皂禮盒',
          category: '藝術級香氛皂',
          priceEst: '約 18 ~ 26 EUR',
          desc: '1887 年創立的葡萄牙國寶級香皂，純天然乳木果油與植物精油，復古裝飾藝術包裝美如畫。',
          target: '高顏值送禮/文青收藏',
          spot: '里斯本旗艦店 (Rua da Misericórdia 135)'
        },
        {
          name: 'O Mundo Fantástico da Sardinha 出生年份沙丁魚罐頭',
          category: '年份紀念伴手禮',
          priceEst: '約 8 ~ 14 EUR',
          desc: '童話馬戲團風裝潢，每罐印有不同年份（從 1916 年到今年）及該年的重大歷史事件！',
          target: '生日紀念/朋友年份禮物',
          spot: '里斯本羅西烏廣場專賣店'
        },
        {
          name: 'Taylor\'s / Sandeman 波多波特酒 (Porto 10 Year Tawny)',
          category: '葡萄牙國寶名酒',
          priceEst: '約 16 ~ 45 EUR',
          desc: '波多杜羅河畔木桶陳釀加烈酒，口感圓潤甜美帶有葡萄乾與焦糖香氣，餐後配甜點極品。',
          target: '美酒品鑑/長輩禮物',
          spot: '波多加亞新城酒莊區 (Vila Nova de Gaia)'
        },
        {
          name: '葡式傳統藍白花磚軟木隔熱墊 / 杯墊 (Azulejo)',
          category: '經典葡式文創',
          priceEst: '約 4 ~ 10 EUR',
          desc: '里斯本標誌性藍白花磚結合天然軟木底座，防燙耐看，裝飾感極強。',
          target: '居家擺設/朋友手信',
          spot: '里斯本阿爾法瑪老城區 / 波多文創店'
        },
        {
          name: 'Couto 葡萄牙復古藥用牙膏 (經典黃白鋁管)',
          category: '復古文青選物',
          priceEst: '約 3.5 ~ 6 EUR',
          desc: '創立於 1932 年的葡萄牙國民牙膏，草本薄荷無氟配方，復古包裝百看不厭。',
          target: '文青朋友/日常自用',
          spot: '里斯本/波多老藥房與文創店'
        }
      ]
    },
    {
      id: 'ES',
      name: '西班牙 Spain',
      flag: '🇪🇸',
      city: '馬德里 (Madrid) / 巴塞隆納 (Barcelona)',
      currency: 'EUR',
      redBookHotSpots: '感恩大道 LOEWE 旗艦店、La Chinata 專賣店、Vicens 牛軋糖老店、英國宮百貨 (El Corte Inglés)、聖米格爾市場',
      taxRefund: {
        rateText: '最高 15.7% (累進階梯)',
        minSpend: 0,
        currency: 'EUR',
        tip: '西班牙已全面「取消最低退稅門檻」，哪怕買 €10 都能退稅！出境在馬德里或巴塞隆納機場 DIVA 機器掃描條碼即完成海關審核。'
      },
      shoppingTips: [
        '【全歐買 LOEWE 最便宜】西班牙是 LOEWE 發源地，定價全球最低＋無門檻退稅最高 15.7%，價差甚至能省一張機票！',
        '【平價送禮天花板】La Chinata 橄欖油專賣店，潤唇膏 €2.5、護手霜 €4，包裝精美天然好用，小紅書公認辦公室發送零踩雷。',
        '【頂級黑標橡果生火腿】Cinco Jotas (5J) 伊比利生火腿，油脂如大理石紋路，入口即化，肉食控此生必嚐！',
        '【百年牛軋糖免費試吃】Torrons Vicens 店內提供數十種口味免費試吃，黑松露牛軋糖、脆杏仁牛軋糖最熱門。',
        '【ZARA 高階品牌 Massmio Dutti】在西班牙定價約台灣 6 折，真皮皮衣與 100% 亞麻襯衫版型極佳。'
      ],
      specialties: [
        {
          name: 'LOEWE Puzzle / Flamenco 經典小牛皮包',
          category: '頂級國寶精品',
          priceEst: '約 1,900 ~ 2,800 EUR',
          desc: '西班牙皮件天花板！皮革溫潤柔韌，原產地退稅後相當於台灣專櫃 7 折以下。',
          target: '夢想清單/極致獎勵',
          spot: '巴塞隆納感恩大道 (Passeig de Gràcia) / 馬德里塞拉諾旗艦店'
        },
        {
          name: 'La Chinata 特級初榨橄欖油護唇膏 / 潤膚霜',
          category: '小紅書伴手禮王',
          priceEst: '約 2.5 ~ 6 EUR',
          desc: '天然冷壓橄欖油萃取，極度滋潤且帶淡淡果香，銅板價就能買到西班牙莊園級保養！',
          target: '同事/朋友大批送禮',
          spot: '馬德里 / 巴塞隆納 La Chinata 專賣店'
        },
        {
          name: 'Cinco Jotas (5J) 頂級 100% 橡果伊比利生火腿',
          category: '西班牙美食傳奇',
          priceEst: '約 18 ~ 35 EUR / 包',
          desc: '頂級黑標伊比利豬，油脂如大理石紋路，入口即化釋放濃郁橡果香氣與甘甜。',
          target: '老饕美食/下酒神器',
          spot: '馬德里聖米格爾市場 / 英國宮百貨超市'
        },
        {
          name: 'Natura Bissé 悅碧施 西班牙皇室鑽石極致修護霜',
          category: '貴婦黑科技抗老',
          priceEst: '約 180 ~ 320 EUR',
          desc: '西班牙皇室與奧斯卡紅毯御用保養品牌，緊緻撫紋效果驚艷，小紅書名媛瘋狂回購。',
          target: '媽媽/貴婦保養',
          spot: 'El Corte Inglés 英國宮百貨'
        },
        {
          name: 'Torrons Vicens 百年手工黑松露 / 杏仁牛軋糖',
          category: '傳統國寶甜點',
          priceEst: '約 6 ~ 12 EUR',
          desc: '1775 年創立老店，軟質杏仁膏濃香不黏牙，黑松露系列鹹甜交織極具特色。',
          target: '長輩/親友伴手',
          spot: '巴塞隆納大教堂前 Vicens 總店 / 馬德里太陽門店'
        }
      ]
    },
    {
      id: 'FR',
      name: '法國 France',
      flag: '🇫🇷',
      city: '巴黎 (Paris)',
      currency: 'EUR',
      redBookHotSpots: '塞納河左岸 Buly 1803、Citypharma 藥妝、聖奧諾雷路 Polène/Goyard、拉法葉百貨、Pierre Hermé',
      taxRefund: {
        rateText: '約 12%',
        minSpend: 100,
        currency: 'EUR',
        tip: '同一店家同一天滿 €100 即可開立 Tax Free 單。戴高樂機場有 PABLO 電子掃描退稅機，刷條碼綠勾即可，免排海關人工隊伍。'
      },
      shoppingTips: [
        '【小紅書爆火藥妝】巴黎左岸 Citypharma 價格約台灣 4~5 折，A313 A醇萬用膏、Biafine 曬後修復神霜、Caudalie 歐緹麗大葡萄噴霧、Embryolisse 神仙妝前乳必搶！',
        '【小眾神級美包】Polène 巴黎旗艦店（Numéro Dix 半月包 / Cyme 托特包），質感高級且不易撞包，歐洲定價退稅後極划算。',
        '【百年香氛美學】Buly 1803 總店（6 Rue Bonaparte），現場提供免費古典花體字燙金姓名手寫服務，送禮儀式感滿分。',
        '【超市平價挖寶】Monoprix 或拉法葉美食館買黑松露鹽、松露洋芋片、Angelina 栗子醬、瑪德蓮蛋糕。'
      ],
      specialties: [
        {
          name: 'Buly 1803 三度水香氛 / 護手霜 (客製花體燙金字)',
          category: '小紅書頂流香氛',
          priceEst: '約 40 ~ 130 EUR',
          desc: '巴黎百年古典香氛，水基底不含酒精。店員會手寫燙金英文姓名貼在盒上，顏值天花板！',
          target: '送女友/閨蜜/自己',
          spot: '巴黎左岸總店 6 Rue Bonaparte'
        },
        {
          name: 'Polène Paris 小眾真皮包 (Numéro Dix / Cyme)',
          category: '巴黎爆款美包',
          priceEst: '約 360 ~ 440 EUR',
          desc: '小紅書刷屏常客！西班牙頂級皮革在法國手工打造，線條圓潤優雅，退稅後超划算。',
          target: '自己/犒賞美包',
          spot: 'Polène 巴黎旗艦店 (1 Cr des Petites Écuries)'
        },
        {
          name: 'Longchamp Le Pliage 經典尼龍長柄水餃包',
          category: '法國國民神包',
          priceEst: '約 110 ~ 140 EUR',
          desc: '輕量、防潑水、耐磨、容量極大！法國定價＋退稅後約台灣專櫃 58 折。',
          target: '媽媽/自己/通勤',
          spot: '拉法葉百貨 / 戴高樂機場免稅店'
        },
        {
          name: 'A313 法國神級高濃度 A醇萬用膏',
          category: '藥妝抗老猛藥',
          priceEst: '約 7 ~ 10 EUR',
          desc: '小紅書封為「平價抗老神膏」，淡化細紋修護毛孔，在 Citypharma 常常整排被掃空。',
          target: '美肌抗老必備',
          spot: 'Citypharma 藥妝店 (26 Rue du Four)'
        },
        {
          name: 'Biafine 法國國民神級萬用修復霜',
          category: '急救修護神霜',
          priceEst: '約 4 ~ 6 EUR',
          desc: '法國家庭人手一條！曬後厚敷退紅、乾燥脫皮急救、燙傷修護，性價比極高。',
          target: '居家萬用常備',
          spot: '各大法國藥妝店 Pharmacie'
        },
        {
          name: 'Embryolisse 神仙妝前保濕隔離霜 (法國大寶)',
          category: '小紅書底妝救星',
          priceEst: '約 12 ~ 16 EUR',
          desc: '彩妝師人手一支的底妝打底神器，撫平乾紋不起皮，底妝服貼一整天。',
          target: '乾皮救星/彩妝必備',
          spot: 'Citypharma / 各大藥妝店'
        },
        {
          name: 'Pierre Hermé 玫瑰荔枝馬卡龍 (Ispahan)',
          category: '甜點界畢卡索',
          priceEst: '約 2.8 EUR / 顆',
          desc: '玫瑰香氣、清甜荔枝與酸甜覆盆子完美交融，口感外酥內軟流心，吃過就回不去！',
          target: '即時品嚐/甜點控',
          spot: 'PH 巴黎各專賣店'
        }
      ]
    },
    {
      id: 'CH',
      name: '瑞士 Switzerland',
      flag: '🇨🇭',
      city: '琉森 (Luzern) / 因特拉肯 (Interlaken)',
      currency: 'CHF',
      redBookHotSpots: '琉森天鵝廣場 Läderach、Victorinox 琉森湖畔旗艦店、因特拉肯 On 跑鞋專賣店、Coop 超市阿華田抹醬',
      taxRefund: {
        rateText: '約 7.7%',
        minSpend: 300,
        currency: 'CHF',
        tip: '⚠️ 瑞士非歐盟成員國！瑞士退稅單必須在「離開瑞士邊境火車站或瑞士機場海關蓋章」，不能帶去法國或義大利退！單店滿 300 CHF 門檻。'
      },
      shoppingTips: [
        '【瑞士必買生巧第一名】Läderach 現切秤重 FrischSchoggi，烤榛果牛奶巧與覆盆莓黑巧小紅書封神！',
        '【客製專屬瑞士軍刀】Victorinox 琉森湖畔旗艦店，可免費在軍刀上雷射雕刻英文名字、日期或雪山圖案。',
        '【瑞士國寶跑鞋 On】因特拉肯與琉森戶外店款式齊全，Cloudtilt 與 Cloudmonster 踩屎感腳感極佳，高山健行首選。',
        '【瑞士超市隱藏好物】Coop 超市買 Ovomaltine 阿華田顆粒抹醬、瑞士三角巧克力、Ricola 草本糖。'
      ],
      specialties: [
        {
          name: 'Läderach 瑞士現切手工生巧克力大片 (FrischSchoggi)',
          category: '小紅書生巧天花板',
          priceEst: '約 9 ~ 12 CHF / 100g',
          desc: '新鮮阿爾卑斯牛乳與整顆烘烤榛果，現切大塊秤重，口感絲滑濃郁，吃過再也看不上普通巧克力！',
          target: '摯友/最愛的人/自己',
          spot: '琉森車站 / 因特拉肯大道專賣店'
        },
        {
          name: 'Victorinox 瑞士軍刀 (免費雷射客製刻字)',
          category: '瑞士精工紀念',
          priceEst: '約 28 ~ 75 CHF',
          desc: '多功能瑞士原廠不鏽鋼刀具，現場刻上旅行日期與名字，陪伴一生的實用紀念品。',
          target: '男生/爸爸/實用收藏',
          spot: '琉森天鵝廣場 Victorinox 旗艦店'
        },
        {
          name: 'On 昂跑運動鞋 (Cloud 5 / Cloudmonster 瑞士版)',
          category: '瑞士國寶跑鞋',
          priceEst: '約 170 ~ 230 CHF',
          desc: '費德勒代言的瑞士專利 CloudTec 空心氣墊，歐洲每日兩萬步暴走救星！',
          target: '暴走健步/運動日常',
          spot: '因特拉肯 / 琉森運動戶外店'
        },
        {
          name: 'Ovomaltine 瑞士原產阿華田脆酷抹醬 (Crunchy Cream)',
          category: '小紅書早餐神醬',
          priceEst: '約 4 ~ 6 CHF',
          desc: '含有香脆麥芽顆粒與濃郁可可，塗抹在熱吐司或可頌上瞬間融化，全家搶著吃！',
          target: '早餐必備/小朋友',
          spot: '瑞士各大 Coop / Migros 超市'
        },
        {
          name: '阿爾卑斯山金車草本舒緩膏 (Arnica Gel)',
          category: '健行暴走神物',
          priceEst: '約 14 ~ 26 CHF',
          desc: '因特拉肯跳傘、健走後塗抹小腿與關節，天然阿爾卑斯草本精華迅速舒緩酸痛。',
          target: '健行必備/孝敬父母',
          spot: '因特拉肯 / 琉森各大 Apotheke 藥局'
        }
      ]
    },
    {
      id: 'IT',
      name: '義大利 Italy',
      flag: '🇮🇹',
      city: '威尼斯 (Venice) / 佛羅倫斯 (Florence) / 羅馬 (Rome)',
      currency: 'EUR',
      redBookHotSpots: '佛羅倫斯 SMN 百年修道院、蕾莉歐 Biffoli Shop、羅馬萬神殿金杯咖啡、威尼斯彩色島玻璃、Bialetti 摩卡壺',
      taxRefund: {
        rateText: '約 12.5%',
        minSpend: 70,
        currency: 'EUR',
        tip: '義大利退稅門檻已全面調降為 €70！單店消費滿 €70 記得出示護照索取 Tax Free 退稅單。'
      },
      shoppingTips: [
        '【全球最美百年藥局】佛羅倫斯 Santa Maria Novella (SMN)，建於 1221 年，撲鼻香陶罐與金盞花水必買！',
        '【蕾莉歐差價巨大】佛羅倫斯聖母百花大教堂旁 Biffoli Shop，海藻精華液與護手霜是台灣專櫃 3 折左右，送超多試用包。',
        '【羅馬萬神殿旁傳奇咖啡】金杯咖啡 (Tazza d\'Oro) 的女王咖啡豆與「巧克力裹咖啡豆」，小紅書萬人按讚！',
        '【超市白菜價伴手】Marvis 牙膏在 Conad 或 Coop 超市只要 €2~€3；冬季限定 Pocket Coffee 濃縮液體咖啡巧克力必囤！'
      ],
      specialties: [
        {
          name: 'Santa Maria Novella (SMN) 撲鼻陶罐香氛 (Pot-Pourri)',
          category: '文藝復興神仙香氛',
          priceEst: '約 35 ~ 110 EUR',
          desc: '托斯卡尼山丘草本花瓣浸泡在特製陶罐中發酵熟成，沉穩高級的修道院木質香氣，持久一整年。',
          target: '氣質自用/送禮首選',
          spot: '佛羅倫斯 SMN 總店 (Via della Scala 16)'
        },
        {
          name: 'L\'Erbolario 蕾莉歐 海藻多元植物精華保濕液',
          category: '草本保養差價王',
          priceEst: '約 28 ~ 35 EUR',
          desc: '小紅書人手一打的補水聖品！純天然海藻萃取，台灣專櫃一瓶 NT$ 3,000，義大利只要約 NT$ 1,000！',
          target: '媽媽/姐姐/自用囤貨',
          spot: '佛羅倫斯 Biffoli Shop (百花大教堂旁)'
        },
        {
          name: '羅馬金杯咖啡 女王咖啡豆 / 巧克力裹咖啡豆 (Tazza d\'Oro)',
          category: '羅馬必喝咖啡傳奇',
          priceEst: '約 6 ~ 14 EUR',
          desc: '萬神殿旁名揚全球的百年名店，濃郁堅果焦糖香氣，巧克力咖啡豆咬碎有整顆香脆咖啡豆！',
          target: '咖啡中毒者/親友手信',
          spot: '羅馬萬神殿旁金杯咖啡 (Via dei Pastini 11)'
        },
        {
          name: 'Ferrero Pocket Coffee 爆漿濃縮咖啡夾心巧克力',
          category: '秋冬限定爆漿神巧',
          priceEst: '約 3.5 ~ 6 EUR / 盒',
          desc: '小紅書封為「移動式濃縮咖啡」！咬破黑巧克力外殼直接湧出 100% 義大利液體 Espresso！',
          target: '提神必備/同事零食',
          spot: '義大利各大 Conad / Coop 超市'
        },
        {
          name: '威尼斯手作彩繪玻璃飾品 / 鳳尾船小擺件 (Murano Glass)',
          category: '威尼斯水都工藝',
          priceEst: '約 12 ~ 40 EUR',
          desc: '威尼斯千年玻璃工藝，手工吹製彩色墜飾與小擺件，色彩繽紛晶瑩剔透。',
          target: '好友/精緻擺飾',
          spot: '威尼斯聖馬可區 / 彩色島手工坊'
        },
        {
          name: 'Bialetti 雙閥加壓摩卡壺 (Brikka 2杯/4杯份)',
          category: '義式咖啡靈魂',
          priceEst: '約 38 ~ 52 EUR',
          desc: '八角壺身專利雙閥加壓技術，在家瓦斯爐上就能煮出厚厚一層綿密咖啡脂 Crema！',
          target: '咖啡愛好者/儀式感生活',
          spot: '羅馬 / 佛羅倫斯 Bialetti 專賣店'
        },
        {
          name: 'Marvis 義大利經典牙膏 (銀色亮白 / 紫色茉莉薄荷)',
          category: '牙膏界愛馬仕',
          priceEst: '約 2.5 ~ 4 EUR',
          desc: '復古宮廷鋁管包裝與細膩薄荷泡沫，超市銅板價即可整籃採購當高質感伴手禮。',
          target: '辦公室/親友大批發送',
          spot: '義大利各大 Coop / Conad 超市'
        }
      ]
    },
    {
      id: 'PL',
      name: '波蘭 Poland',
      flag: '🇵🇱',
      city: '克拉科夫 (Krakow)',
      currency: 'PLN',
      redBookHotSpots: '克拉科夫紡織會館、Bolesławiec 陶器街、老城琥珀工坊、Rossmann 藥妝店',
      taxRefund: {
        rateText: '約 12% ~ 16%',
        minSpend: 200,
        currency: 'PLN',
        tip: '波蘭退稅門檻為 200 PLN (約 45 EUR)，物價非常便宜，採購無負擔！'
      },
      shoppingTips: [
        '【手工彩繪波蘭陶】Bolesławiec 陶器耐高溫、可用烤箱與洗碗機，孔雀眼紋路極具收藏價值。',
        '【波羅的海琥珀】克拉科夫中央市集廣場旁的紡織會館 (Sukiennice) 挑選天然琥珀蜜蠟飾品。',
        '【波蘭平價藥妝 Ziaja】Rossmann 藥妝店買 Ziaja 齊葉雅山羊奶面膜與眼霜，小紅書封為「白菜價抗皺救星」！'
      ],
      specialties: [
        {
          name: 'Bolesławiec 波蘭手工彩繪陶器 (孔雀眼馬克杯 / 烤盤)',
          category: '小紅書家居美學',
          priceEst: '約 40 ~ 130 PLN',
          desc: '波蘭千年小鎮純手工蓋印彩繪，高溫燒製耐摔耐熱，每件都是獨一無二的生活藝術品。',
          target: '居家美學/烘焙愛好者',
          spot: '克拉科夫老城陶器專賣店 (Mila Bolesławiec)'
        },
        {
          name: 'Ziaja 齊葉雅 山羊奶緊緻撫紋眼霜 / 補水面膜',
          category: '小紅書白菜價神物',
          priceEst: '約 9 ~ 16 PLN',
          desc: '波蘭家喻戶曉的天然草本品牌，山羊奶富含維生素與蛋白質，滋潤不生肉芽，銅板價囤貨無壓力！',
          target: '日常囤貨/姊妹分享',
          spot: '克拉科夫各大 Rossmann / Hebe 藥妝店'
        },
        {
          name: '波羅的海天然琥珀蜜蠟吊墜 / 手鍊 (Baltic Amber)',
          category: '天然寶石首飾',
          priceEst: '約 90 ~ 350 PLN',
          desc: '千萬年樹脂化石，色澤溫潤如蜂蜜，波蘭產地保證且價格遠低於亞洲專櫃。',
          target: '媽媽/長輩尊貴心意',
          spot: '克拉科夫紡織會館市集 (Sukiennice)'
        },
        {
          name: 'Żubrówka 波蘭野牛草伏特加 (草本天然香氣)',
          category: '波蘭國寶烈酒',
          priceEst: '約 32 ~ 55 PLN',
          desc: '瓶中插有一根波蘭原始森林野牛草，帶有杏仁與香草清甜氣息，搭配蘋果汁是波蘭傳奇喝法！',
          target: '調酒愛好/聚會小酌',
          spot: '克拉科夫各大 Biedronka / Carrefour 超市'
        },
        {
          name: 'Krówka 波蘭傳統小牛牛奶軟糖 (外酥內流心)',
          category: '波蘭國民糖果',
          priceEst: '約 8 ~ 15 PLN / 包',
          desc: '波蘭語意為「小母牛」，咬開外層糖殼是濃郁爆漿太妃牛奶焦糖，甜蜜滿足。',
          target: '辦公室發送/全家零食',
          spot: '克拉科夫老城糖果鋪 / 超市'
        }
      ]
    },
    {
      id: 'HU',
      name: '匈牙利 Hungary',
      flag: '🇭🇺',
      city: '布達佩斯 (Budapest)',
      currency: 'HUF',
      redBookHotSpots: '布達佩斯中央大市場 (Great Market Hall)、瓦采街 (Váci Street)、Omorovicza 總店、紐約宮殿咖啡館',
      taxRefund: {
        rateText: '約 13% ~ 15%',
        minSpend: 75000,
        currency: 'HUF',
        tip: '匈牙利退稅門檻為 75,000 HUF (約 180 EUR)。'
      },
      shoppingTips: [
        '【貴婦級匈牙利溫泉保養】Omorovicza 匈牙利溫泉礦物活膚系列，皇后水噴霧與溫泉卸妝膏，產地定價全球最優！',
        '【國寶級貴腐甜白酒】Tokaji 托卡伊貴腐酒，路易十四譽為「王者之酒」，中央大市場 1 樓選購 5 Puttonyos 性價比最高。',
        '【匈牙利燉牛肉靈魂】紅椒粉 (Paprika) 買布袋刺繡款或木盒款，微甜甘香，回家做匈牙利燉牛肉神還原！'
      ],
      specialties: [
        {
          name: 'Omorovicza 匈牙利溫泉礦物皇后水噴霧 (Queen of Hungary Mist)',
          category: '貴婦溫泉活膚噴霧',
          priceEst: '約 24,000 ~ 36,000 HUF',
          desc: '布達佩斯百年溫泉水結合專利礦物傳導，細膩水霧提亮膚色，小紅書空瓶無數的貴婦神器。',
          target: '自用保養/閨蜜犒賞',
          spot: '布達佩斯安德拉什大街 Omorovicza 旗艦店'
        },
        {
          name: 'Tokaji 托卡伊 5 Puttonyos 貴腐甜白酒 (Aszú)',
          category: '匈牙利國寶酒王',
          priceEst: '約 6,500 ~ 15,000 HUF',
          desc: '「酒中之王，王者之酒」，天然貴腐菌濃縮出的琥珀色甘露，蜂蜜、杏桃與熱帶果香交織。',
          target: '長輩送禮/慶祝品鑑',
          spot: '布達佩斯中央大市場 1 樓 (Nagyvásárcsarnok)'
        },
        {
          name: '匈牙利傳統紅椒粉木盒禮盒 (Édes Paprika 甜味/辣味)',
          category: '國菜靈魂香料',
          priceEst: '約 1,800 ~ 3,500 HUF',
          desc: '匈牙利特產甜紅椒低溫研磨，色澤艷紅香氣濃郁而不辛辣，附精緻木匙與木盒。',
          target: '廚藝愛好者/平價伴手',
          spot: '中央大市場 / 瓦采街香料鋪'
        },
        {
          name: 'Unicum 匈牙利國寶草本利口酒 (Zwack 圓球黑瓶)',
          category: '百年皇室消化酒',
          priceEst: '約 4,500 ~ 7,800 HUF',
          desc: '1790 年御醫為國王調製，40 多種天然草本與橡木桶熟成，黑圓球玻璃瓶辨識度極高。',
          target: '酒類收藏/特色手信',
          spot: '布拉佩斯各大 Spar / CBA 超市'
        },
        {
          name: '匈牙利傳統 Matyó 手工花卉刺繡餐墊 / 蕾絲',
          category: '東歐民族工藝',
          priceEst: '約 2,500 ~ 6,000 HUF',
          desc: '布達佩斯傳統手工民俗刺繡，色彩明豔的手工花卉圖案，極具多瑙河民族風情。',
          target: '居家美學/長輩心意',
          spot: '中央大市場 2 樓手工藝市集'
        }
      ]
    },
    {
      id: 'CZ',
      name: '捷克 Czech Republic',
      flag: '🇨🇿',
      city: '布拉格 (Prague) / CK小鎮 庫倫洛夫 (Český Krumlov)',
      currency: 'CZK',
      redBookHotSpots: '布拉格舊城廣場提恩教堂後菠丹妮總店、曼菲蘿專賣店、火藥塔旁酷喜樂鉛筆、CK小鎮城堡手作街',
      taxRefund: {
        rateText: '約 11% ~ 14%',
        minSpend: 2000,
        currency: 'CZK',
        tip: '捷克退稅門檻為 2,000 CZK (約 80 EUR)。菠丹妮旗艦店可直接現場開立退稅單。'
      },
      shoppingTips: [
        '【小紅書爆火神皂】布拉格舊城廣場提恩教堂後方的「Botanicus 菠丹妮總店」，死海泥皂、玫瑰精華油大家都是整籃掃貨。',
        '【捷克傳統啤酒花保養】Manufaktura 曼菲蘿的啤酒花洗髮精，洗完蓬鬆乾爽帶有清爽麥芽香氣。',
        '【CK 小鎮手繪紀念品】庫倫洛夫石板小巷中的木造童話小房子手繪模型，擺在書桌超療癒。',
        '【波希米亞水晶指甲銼】布拉格舊城街頭挑選手工彩繪水晶玻璃銼刀，極致耐磨且不易磨損指甲。'
      ],
      specialties: [
        {
          name: 'Botanicus 菠丹妮 死海泥純天然手工皂',
          category: '小紅書戰神洗顏皂',
          priceEst: '約 135 ~ 180 CZK',
          desc: '深層清潔毛孔油光、洗完清爽不緊繃，天然死海泥純植物萃取，價格是台灣專櫃 3 折！',
          target: '油肌救星/必囤好物',
          spot: '布拉格舊城廣場菠丹妮總店 (Týn 3)'
        },
        {
          name: 'Botanicus 菠丹妮 頂級玫瑰純露 / 玫瑰眼霜',
          category: '植萃逆齡精華',
          priceEst: '約 280 ~ 580 CZK',
          desc: '純天然有機大馬士革玫瑰蒸餾精華，保濕提亮膚色，香氣純淨療癒。',
          target: '媽媽/姐姐/犒賞肌膚',
          spot: '布拉格菠丹妮總店'
        },
        {
          name: 'Koh-i-Noor 酷喜樂 魔術刺蝟彩色鉛筆 (木質刺蝟)',
          category: '超萌文創收藏',
          priceEst: '約 480 ~ 980 CZK',
          desc: '木雕刺蝟身上插滿 24 支三色混合魔術彩色鉛筆，畫出來是漸層夢幻色彩，擺在桌上超可愛！',
          target: '文具控/小朋友禮物',
          spot: '布拉格火藥塔旁 Koh-i-Noor 旗艦店 / CK小鎮分店'
        },
        {
          name: 'Manufaktura 曼菲蘿 捷克傳統啤酒花控油洗髮精',
          category: '啤酒草本洗沐',
          priceEst: '約 195 ~ 290 CZK',
          desc: '含捷克啤酒花與大麥萃取物，豐富維生素 B 群強健髮根，洗完頭髮蓬鬆豐盈。',
          target: '頭皮護理/送男生',
          spot: '布拉格 / CK小鎮 Manufaktura 分店'
        },
        {
          name: 'CK小鎮 手繪中世紀童話木造紅瓦小房子模型',
          category: '庫倫洛夫童話紀念',
          priceEst: '約 120 ~ 350 CZK',
          desc: '純手工木雕彩繪 CK 小鎮經典彩繪塔與紅瓦小屋，精緻小巧，重現童話世界回憶。',
          target: '旅行紀念/書桌擺設',
          spot: 'CK 小鎮城堡街區 (Latrán) 文創手工坊'
        },
        {
          name: '波希米亞水晶玻璃彩繪指甲銼刀 (精美手繪版)',
          category: '捷克國民實用伴手',
          priceEst: '約 60 ~ 120 CZK',
          desc: '捷克著名波希米亞強化玻璃技術，銼面永久細密不傷甲，小紅書推薦整把買回台送同事。',
          target: '女生必備/同事大批發送',
          spot: '布拉格哈維爾市集 / 舊城區禮品店'
        }
      ]
    },
    {
      id: 'AT',
      name: '奧地利 Austria',
      flag: '🇦🇹',
      city: '維也納 (Vienna)',
      currency: 'EUR',
      redBookHotSpots: '維也納 Sacher 飯店外帶店、格拉本大街 Demel 總店、聖史蒂芬教堂 Manner 旗艦店、Julius Meinl',
      taxRefund: {
        rateText: '約 10% ~ 13%',
        minSpend: 75,
        currency: 'EUR',
        tip: '奧地利退稅門檻為 €75。維也納國際機場退稅海關動線清晰，出境前預留時間辦理。'
      },
      shoppingTips: [
        '【茜茜公主最愛紫羅蘭糖】維也納百年皇家御用甜點店 Demel，天然紫羅蘭花瓣浸糖晶化，優雅至極。',
        '【維也納皇室蛋糕】Hotel Sacher 經典燙印木盒薩赫蛋糕，濃郁黑巧克力夾層酸甜杏桃果醬，保存期長。',
        '【維也納國民威化餅】Manner 粉紅榛果威化餅鐵盒版，聖史蒂芬大教堂旁買最齊全，辦公室分送人手一包。',
        '【百年小紅帽咖啡】Julius Meinl 經典阿拉比卡配方咖啡豆，微酸香醇，在維也納 Billa 超市買性價比最高。'
      ],
      specialties: [
        {
          name: 'Hotel Sacher 原裝小木盒薩赫蛋糕 (Sachertorte)',
          category: '皇家御用巧克力蛋糕',
          priceEst: '約 28 ~ 42 EUR',
          desc: '精美燙印木盒包裝，微苦濃醇黑巧克力糖霜搭配酸甜杏桃醬，佐無糖鮮奶油是奧地利經典吃法。',
          target: '儀式感下午茶/尊貴送禮',
          spot: '維也納 Sacher 飯店外帶店 (Philharmoniker Str. 4)'
        },
        {
          name: 'Demel 德梅爾皇家糖漬紫羅蘭糖 (Kandierte Veilchen)',
          category: '茜茜公主御用仙女糖',
          priceEst: '約 14 ~ 22 EUR',
          desc: '奧匈帝國皇后 Sisi 每日下午茶必備！真花花瓣包裹薄脆糖霜，放進香檳或直接品嚐都仙氣十足。',
          target: '送閨蜜/氣質自用',
          spot: '維也納格拉本大街 Demel 總店 (Kohlmarkt 14)'
        },
        {
          name: 'Manner 維也納粉紅榛果威化餅乾 (經典鐵盒版)',
          category: '維也納國民點心',
          priceEst: '約 3 ~ 8 EUR',
          desc: '維也納地標聖史蒂芬教堂圖案，五層薄脆威化夾滿那不勒斯烤榛果可可醬，甜而不膩。',
          target: '辦公室零食/全家大小',
          spot: '維也納聖史蒂芬大教堂旁 Manner 旗艦店'
        },
        {
          name: 'Julius Meinl 小紅帽維也納特選咖啡豆 (President)',
          category: '維也納百年咖啡',
          priceEst: '約 6 ~ 12 EUR',
          desc: '維也納咖啡文化象徵！小紅帽標誌經典阿拉比卡配方，香氣細膩微酸圓潤。',
          target: '手沖咖啡迷/長輩',
          spot: '維也納 Julius Meinl am Graben / Billa 超市'
        },
        {
          name: 'Mirabell 奧地利莫札特巧克力球 (八角禮盒版)',
          category: '奧地利經典手信',
          priceEst: '約 5 ~ 12 EUR',
          desc: '開心果杏仁膏、牛軋糖夾心與黑巧克力外層，維也納機場退稅前採購大宗伴手禮必備。',
          target: '親友手信/大批發送',
          spot: '維也納各大超市與機場免稅店'
        }
      ]
    }
  ]
};

// 暴露至全域物件
window.EuroSpecialtiesData = EuroSpecialtiesData;
