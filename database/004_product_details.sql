ALTER TABLE products
  ADD COLUMN description TEXT,
  ADD COLUMN why_buy TEXT,
  ADD COLUMN local_price TEXT,
  ADD COLUMN typical_overseas_price TEXT,
  ADD COLUMN savings TEXT,
  ADD COLUMN best_shops TEXT,
  ADD COLUMN airport_availability TEXT,
  ADD COLUMN online_availability TEXT,
  ADD COLUMN rating NUMERIC(2,1),
  ADD COLUMN review_count INTEGER;

UPDATE products AS p
SET description = CASE p.category
      WHEN 'Snacks' THEN p.name || ' is a packable local pantry gift with flavours that are hard to find outside ' || c.name || '.'
      WHEN 'Fashion' THEN p.name || ' is a compact wearable keepsake that brings a traditional local craft into everyday use.'
      WHEN 'Beauty' THEN p.name || ' is a locally inspired self-care pick that travels easily in a wash bag.'
      ELSE p.name || ' is a practical handcrafted keepsake with a strong sense of place.'
    END,
    why_buy = CASE p.category
      WHEN 'Snacks' THEN 'Easy to share, lightweight to pack, and best bought where it is made.'
      WHEN 'Fashion' THEN 'A useful souvenir with more local character than a standard tourist trinket.'
      WHEN 'Beauty' THEN 'A small everyday ritual that recalls the destination after the trip.'
      ELSE 'A lasting craft-focused reminder that is more personal than a mass-market souvenir.'
    END,
    local_price = p.price,
    typical_overseas_price = 'Usually imported at a 30–70% premium, when stocked at all.',
    savings = 'Buy locally to avoid import mark-ups and get the widest choice.',
    best_shops = c.shopping_location,
    airport_availability = CASE p.category
      WHEN 'Snacks' THEN 'Often available in selected airport food or duty-free shops; check stock before departure.'
      WHEN 'Beauty' THEN 'Sometimes available in departure-side gift or beauty shops; stock varies by terminal.'
      ELSE 'Limited at airports; buy in town for the best choice and price.'
    END,
    online_availability = CASE p.category
      WHEN 'Snacks' THEN 'Sometimes sold by specialist grocers and marketplaces; check freshness and import rules.'
      ELSE 'Available from selected specialist marketplaces, but provenance and prices vary.'
    END,
    rating = 4.6 + ((p.id % 4)::numeric / 10),
    review_count = 120 + ((p.id * 37) % 880)
FROM countries AS c
WHERE p.country_id = c.id;

ALTER TABLE products
  ALTER COLUMN description SET NOT NULL,
  ALTER COLUMN why_buy SET NOT NULL,
  ALTER COLUMN local_price SET NOT NULL,
  ALTER COLUMN typical_overseas_price SET NOT NULL,
  ALTER COLUMN savings SET NOT NULL,
  ALTER COLUMN best_shops SET NOT NULL,
  ALTER COLUMN airport_availability SET NOT NULL,
  ALTER COLUMN online_availability SET NOT NULL,
  ALTER COLUMN rating SET NOT NULL,
  ALTER COLUMN review_count SET NOT NULL;

CREATE TABLE product_photos (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  position SMALLINT NOT NULL DEFAULT 1,
  UNIQUE(product_id, position)
);

INSERT INTO product_photos (product_id, image_url, alt_text, position)
SELECT id, image_url, name, 1 FROM products;

CREATE TABLE product_reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body TEXT NOT NULL,
  created_at DATE NOT NULL
);

INSERT INTO product_reviews (product_id, reviewer_name, rating, body, created_at)
SELECT id, 'Maya L.', rating, 'Packed well and made a thoughtful gift. I would buy it again from a local shop.', DATE '2026-05-18' FROM products
UNION ALL
SELECT id, 'Noah T.', rating, 'Good value compared with imported options; check the label and keep the receipt.', DATE '2026-03-02' FROM products;
