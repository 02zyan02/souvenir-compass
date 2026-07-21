CREATE TABLE customs_information (
  id SERIAL PRIMARY KEY,
  country_id INTEGER NOT NULL UNIQUE REFERENCES countries(id) ON DELETE CASCADE,
  alcohol_limit TEXT NOT NULL,
  tobacco_limit TEXT NOT NULL,
  food_restrictions TEXT NOT NULL,
  additional_note TEXT NOT NULL,
  eligibility_note TEXT,
  last_reviewed DATE NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL
);

INSERT INTO customs_information (
  country_id, alcohol_limit, tobacco_limit, food_restrictions, additional_note,
  eligibility_note, last_reviewed, source_name, source_url
)
SELECT id,
  'Up to 1 litre total of wine, spirits, beer or malt liquor.',
  'Up to 225 g of tobacco, or the equivalent of 200 cigarettes.',
  'Food preparations with a total value of up to RM150. Other food may be subject to separate health, veterinary or agricultural controls.',
  'These traveller exemptions do not override prohibited or restricted-import rules. Check current permits and declarations before travelling.',
  'Traveller exemptions have eligibility conditions, including trip-duration requirements. Confirm your circumstances in the official guide.',
  DATE '2026-07-21',
  'Royal Malaysian Customs Department — Traveller''s Guide',
  'https://www.customs.gov.my/en/individu/pengembara/travelers-guide?highlight=WyJwb3J0Il0%3D'
FROM countries WHERE slug = 'malaysia';
