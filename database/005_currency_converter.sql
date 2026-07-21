ALTER TABLE products
  ADD COLUMN price_amount NUMERIC(12,2),
  ADD COLUMN currency_code CHAR(3);

UPDATE products AS p
SET price_amount = regexp_replace(p.local_price, '[^0-9.]', '', 'g')::NUMERIC,
    currency_code = CASE c.name
      WHEN 'Brunei' THEN 'BND'
      WHEN 'Cambodia' THEN 'USD'
      WHEN 'Indonesia' THEN 'IDR'
      WHEN 'Laos' THEN 'LAK'
      WHEN 'Malaysia' THEN 'MYR'
      WHEN 'Myanmar' THEN 'MMK'
      WHEN 'Philippines' THEN 'PHP'
      WHEN 'Singapore' THEN 'SGD'
      WHEN 'Thailand' THEN 'THB'
      WHEN 'Vietnam' THEN 'VND'
    END
FROM countries AS c
WHERE p.country_id = c.id;

ALTER TABLE products
  ALTER COLUMN price_amount SET NOT NULL,
  ALTER COLUMN currency_code SET NOT NULL;

CREATE TABLE exchange_rates (
  currency_code CHAR(3) PRIMARY KEY,
  rate_per_eur NUMERIC(16,6) NOT NULL CHECK (rate_per_eur > 0),
  as_of_date DATE NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL
);

-- Rates are currency units per EUR. USD, MYR and SGD use the ECB reference
-- rates dated 2026-07-20; the remaining local currencies are indicative.
INSERT INTO exchange_rates (currency_code, rate_per_eur, as_of_date, source_name, source_url) VALUES
('EUR',1,DATE '2026-07-20','ECB reference rates','https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html'),
('USD',1.1426,DATE '2026-07-20','ECB reference rates','https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html'),
('MYR',4.6761,DATE '2026-07-20','ECB reference rates','https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html'),
('SGD',1.4749,DATE '2026-07-20','ECB reference rates','https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html'),
('BND',1.4749,DATE '2026-07-20','Brunei–Singapore currency interchangeability','https://www.mas.gov.sg/'),
('KHR',4560,DATE '2026-07-20','Indicative mid-market rate','https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html'),
('IDR',19000,DATE '2026-07-20','Indicative mid-market rate','https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html'),
('LAK',24800,DATE '2026-07-20','Indicative mid-market rate','https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html'),
('MMK',2400,DATE '2026-07-20','Indicative mid-market rate','https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html'),
('PHP',68,DATE '2026-07-20','Indicative mid-market rate','https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html'),
('THB',37.4,DATE '2026-07-20','Indicative mid-market rate','https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html'),
('VND',30000,DATE '2026-07-20','Indicative mid-market rate','https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html');
