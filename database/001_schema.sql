CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT UNIQUE NOT NULL,
  chinese_name TEXT NOT NULL,
  flag TEXT NOT NULL,
  city TEXT NOT NULL,
  buy TEXT NOT NULL,
  chinese_buy TEXT NOT NULL,
  tip TEXT NOT NULL,
  chinese_tip TEXT NOT NULL,
  shopping_location TEXT NOT NULL,
  reference_url TEXT NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  country_id INTEGER NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tag TEXT NOT NULL,
  note TEXT NOT NULL,
  reference_url TEXT NOT NULL,
  UNIQUE(country_id, name)
);

CREATE TABLE shopping_checklist_items (
  id SERIAL PRIMARY KEY,
  trip_name TEXT NOT NULL,
  name TEXT NOT NULL,
  position SMALLINT NOT NULL,
  UNIQUE(trip_name, position)
);
