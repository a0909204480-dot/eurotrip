-- ==============================================================================
-- 歐洲 40 天多幣別旅行記帳 (EuroTrip Ledger) - Supabase 資料庫初始化腳本
-- 請在 Supabase Dashboard -> SQL Editor 中執行此腳本
-- ==============================================================================

-- 1. 建立記帳支出資料表 (expenses)
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL,          -- 類別：交通, 住宿, 餐飲, 門票景點, 購物, 通訊保險, 其他
    item_name TEXT NOT NULL,         -- 項目名稱
    currency TEXT NOT NULL,          -- 幣別代碼：EUR, USD, CHF, GBP, CZK, HUF, PLN, TWD
    foreign_amount NUMERIC(12, 2) NOT NULL, -- 外幣金額
    exchange_rate NUMERIC(10, 4) NOT NULL,  -- 當時換算匯率 (1 外幣 = ? TWD)
    twd_amount NUMERIC(12, 2) NOT NULL,     -- 折合台幣金額
    payment_method TEXT NOT NULL,    -- 支付方式：信用卡A, 信用卡B, 現金(EUR), 現金(CHF), Apple Pay, 其他
    payer TEXT DEFAULT '個人',       -- 付款人 / 分帳者
    split_type TEXT DEFAULT '個人',   -- 分帳模式：個人, 均分, 自訂
    city TEXT DEFAULT '',            -- 消費城市/地點 (如：巴黎, 馬德里, 琉森)
    notes TEXT DEFAULT '',           -- 備註與小提醒
    receipt_url TEXT DEFAULT '',     -- 收據相片 URL (可選)
    trip_day INTEGER DEFAULT NULL    -- 對應第幾天行程 (Day 1 - Day 40)
);

-- 2. 建立早鳥搶票與預訂追蹤資料表 (bookings)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,             -- 預訂項目：如 巴黎->瑞士 TGV Lyria
    category TEXT NOT NULL,          -- 類別：火車高鐵, 門票景點, 廉航行李, 極限運動, 住宿
    target_date DATE,                -- 預計使用日期
    booking_deadline DATE,           -- 搶票/早鳥截止日
    status TEXT DEFAULT '未預訂',     -- 狀態：未預訂, 待開搶, 已預訂, 已完成
    official_url TEXT DEFAULT '',    -- 官方搶票網址
    estimated_cost_twd NUMERIC(12, 2) DEFAULT 0, -- 預估費用 (TWD)
    is_booked BOOLEAN DEFAULT FALSE, -- 是否已完成付款
    notes TEXT DEFAULT ''            -- 搶票攻略備註
);

-- 3. 建立使用者全域設定表 (app_settings)
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. 插入預設系統設定（總預算、幣別自訂匯率等）
INSERT INTO public.app_settings (key, value)
VALUES 
    ('total_budget_twd', '200000'::jsonb),
    ('custom_exchange_rates', '{"EUR": 35.5, "USD": 32.2, "CHF": 36.8, "GBP": 41.5, "CZK": 1.45, "HUF": 0.09, "PLN": 8.1, "TWD": 1.0}'::jsonb),
    ('trip_start_date', '"2026-09-20"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 5. 啟用 Row Level Security (RLS) 並開放公開讀寫 (適合個人或旅遊小隊共用)
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- 允許任何人讀取與寫入（若不需要身分認證直接開放給旅伴）
CREATE POLICY "Allow public read-write for expenses" 
ON public.expenses FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read-write for bookings" 
ON public.bookings FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read-write for app_settings" 
ON public.app_settings FOR ALL USING (true) WITH CHECK (true);

-- 6. 啟用 Realtime 實時廣播通知 (支援多裝置即時同步)
ALTER PUBLICATION supabase_realtime ADD TABLE public.expenses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_settings;

-- 7. 插入示範支出資料
INSERT INTO public.expenses (date, category, item_name, currency, foreign_amount, exchange_rate, twd_amount, payment_method, payer, city, notes, trip_day)
VALUES 
    ('2026-09-20', '交通', '波多至馬德里跨國夜巴', 'EUR', 48.50, 35.50, 1721.75, '信用卡A (海外3%)', '小明', '波多', '車程 8 小時，備好頸枕', 1),
    ('2026-09-21', '餐飲', '馬德里經典西班牙海鮮飯 & Tapas', 'EUR', 32.00, 35.50, 1136.00, '現金(EUR)', '均分', '馬德里', '聖米格爾市場，刷卡選歐元計價防DCC', 2),
    ('2026-09-22', '門票景點', '巴塞隆納聖家堂登塔門票', 'EUR', 36.00, 35.50, 1278.00, '信用卡A (海外3%)', '小明', '巴塞隆納', '含受難立面塔樓導覽', 3),
    ('2026-09-28', '交通', '巴黎至蘇黎世 TGV Lyria 高鐵', 'EUR', 65.00, 35.50, 2307.50, '信用卡B', '小華', '巴黎', '法鐵早鳥特惠票', 9),
    ('2026-10-02', '門票景點', '瑞士因特拉肯高空跳傘 (含攝影)', 'CHF', 450.00, 36.80, 16560.00, '信用卡A (海外3%)', '小明', '因特拉肯', '預留 2 天天氣彈性緩衝', 13);
