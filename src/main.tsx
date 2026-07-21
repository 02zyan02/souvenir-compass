import { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

type Product = { name: string; country: string; price: string; category: string; emoji: string; tag: string }
type Country = { name: string; flag: string; count: string; city: string; buy: string; tip: string }

const products: Product[] = [
  { name: 'Tokyo Banana', country: 'Japan', price: '¥1,200', category: 'Snacks', emoji: '🍌', tag: 'Japan exclusive' },
  { name: 'Shiseido Sunscreen', country: 'Japan', price: '¥2,480', category: 'Beauty', emoji: '☀️', tag: 'Save 28%' },
  { name: 'Matcha KitKat', country: 'Japan', price: '¥540', category: 'Snacks', emoji: '🍵', tag: 'Limited flavour' },
  { name: 'Innisfree Clay Mask', country: 'South Korea', price: '₩15,000', category: 'Beauty', emoji: '🫧', tag: 'Travel favourite' },
  { name: 'Pineapple Cakes', country: 'Taiwan', price: 'NT$380', category: 'Snacks', emoji: '🍍', tag: 'Gift-ready' },
  { name: 'Thai Silk Scarf', country: 'Thailand', price: '฿790', category: 'Fashion', emoji: '🧣', tag: 'Handmade' },
  { name: 'Batik Tote', country: 'Indonesia', price: 'Rp180k', category: 'Fashion', emoji: '👜', tag: 'Made by artisans' },
  { name: 'Vietnamese Coffee', country: 'Vietnam', price: '₫145k', category: 'Snacks', emoji: '☕', tag: 'Packable gift' },
  { name: 'Capiz Shell Coasters', country: 'Philippines', price: '₱280', category: 'Home', emoji: '🫧', tag: 'Island-made' },
  { name: 'Khmer Silk Scarf', country: 'Cambodia', price: '៛80k', category: 'Fashion', emoji: '🧵', tag: 'Traditional weave' },
  { name: 'Saa Paper Notebook', country: 'Laos', price: '₭65k', category: 'Stationery', emoji: '📒', tag: 'Handcrafted' },
  { name: 'Rattan Basket', country: 'Brunei', price: 'B$22', category: 'Home', emoji: '🧺', tag: 'Market find' },
  { name: 'Lacquerware Box', country: 'Myanmar', price: 'K30k', category: 'Home', emoji: '🎁', tag: 'Heritage craft' },
]

const countries: Country[] = [
  { name: 'Brunei', flag: '🇧🇳', count: '216 finds', city: 'Bandar Seri Begawan', buy: 'Rattan baskets & kuih cincin', tip: 'Browse Pasarneka Tutong for locally made handicrafts and snacks.' },
  { name: 'Cambodia', flag: '🇰🇭', count: '493 finds', city: 'Siem Reap', buy: 'Silk, silverwork & ceramics', tip: 'Choose pieces sold by craft workshops and ask about the maker.' },
  { name: 'Indonesia', flag: '🇮🇩', count: '1,120 finds', city: 'Yogyakarta', buy: 'Batik & regional coffee', tip: 'Look for hand-stamped or hand-drawn batik, not mass-printed copies.' },
  { name: 'Laos', flag: '🇱🇦', count: '302 finds', city: 'Luang Prabang', buy: 'Textiles & saa paper', tip: 'Local weaving, basketry and paper crafts make light luggage-friendly gifts.' },
  { name: 'Malaysia', flag: '🇲🇾', count: '761 finds', city: 'Kuala Terengganu', buy: 'Batik, songket & snacks', tip: 'Pasar Payang is a good starting point for textiles and traditional snacks.' },
  { name: 'Myanmar', flag: '🇲🇲', count: '374 finds', city: 'Yangon', buy: 'Lacquerware & longyi', tip: 'Prioritise small, durable handmade pieces; check current travel guidance before planning.' },
  { name: 'Philippines', flag: '🇵🇭', count: '688 finds', city: 'Manila', buy: 'Capiz craft & woven goods', tip: 'Protect fragile shell crafts in hand luggage, and ask how the material was sourced.' },
  { name: 'Singapore', flag: '🇸🇬', count: '852 finds', city: 'Singapore', buy: 'Kaya, tea & local design', tip: 'Design Orchard brings together proudly Singapore-made brands in one stop.' },
  { name: 'Thailand', flag: '🇹🇭', count: '973 finds', city: 'Bangkok', buy: 'Silk, OTOP crafts & snacks', tip: 'OTOP products are a strong place to start for regional specialities.' },
  { name: 'Vietnam', flag: '🇻🇳', count: '1,044 finds', city: 'Hanoi', buy: 'Coffee, textiles & art', tip: 'Hanoi’s Old Quarter is a great place to compare craft shops; gentle haggling is expected.' },
]

function App() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [saved, setSaved] = useState<string[]>(['Tokyo Banana'])
  const [checked, setChecked] = useState<string[]>(['KitKat Exclusive Flavors'])
  const [showGuide, setShowGuide] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[7])
  const filtered = useMemo(() => products.filter(p => (activeCategory === 'All' || p.category === activeCategory) && `${p.name} ${p.country} ${p.category}`.toLowerCase().includes(query.toLowerCase())), [query, activeCategory])
  const toggleSaved = (name: string) => setSaved(items => items.includes(name) ? items.filter(x => x !== name) : [...items, name])
  const toggleChecked = (name: string) => setChecked(items => items.includes(name) ? items.filter(x => x !== name) : [...items, name])

  return <main>
    <nav className="nav shell"><a className="brand" href="#top"><span>✦</span> souvenir compass</a><div className="navlinks"><a href="#discover">Discover</a><a href="#trips">My trips</a><a href="#saved">Wishlist <b>{saved.length}</b></a></div><button className="avatar" aria-label="Profile">A</button></nav>
    <section id="top" className="hero"><div className="shell hero-grid"><div className="hero-copy"><p className="eyebrow">THE GLOBAL SHOPPING GUIDE</p><h1>Bring home the <em>good stuff.</em></h1><p className="lede">Thoughtful finds, local prices, and the little details that make a trip memorable.</p><div className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a country, product, or brand" /><button onClick={() => document.querySelector('#discover')?.scrollIntoView({ behavior: 'smooth' })}>Explore</button></div><p className="search-hint">Try “matcha”, “skincare”, or “Tokyo”</p></div><div className="postcard"><div className="stamp">JAPAN<br/><strong>2027</strong></div><div className="postcard-copy"><span>YOUR NEXT TAKE-HOME STORY</span><strong>Made in<br/>Japan</strong><small>Curated by locals</small></div><div className="sun">☀</div><div className="mountain">⌁⌁⌁</div></div></div></section>
    <section id="discover" className="shell content"><div className="section-heading"><div><p className="eyebrow">ASEAN SHOPPING GUIDE · 10 COUNTRIES</p><h2>Where are you headed?</h2></div><button className="text-btn" onClick={() => setQuery('')}>Show all finds →</button></div><div className="country-grid">{countries.map(country => <button className={`country-card ${selectedCountry.name === country.name ? 'chosen' : ''}`} key={country.name} onClick={() => { setSelectedCountry(country); setQuery(country.name) }}><span>{country.flag}</span><strong>{country.name}</strong><small>{country.count}</small><i>→</i></button>)}</div>
      <div className="country-guide"><div className="guide-flag">{selectedCountry.flag}</div><div><p className="eyebrow">{selectedCountry.city.toUpperCase()} · ASEAN FIELD NOTE</p><h3>Buy {selectedCountry.buy}</h3><p>{selectedCountry.tip}</p></div><button onClick={() => setQuery(selectedCountry.name)}>See {selectedCountry.name} finds <span>→</span></button></div>
      <div className="section-heading finds"><div><p className="eyebrow">CURATED FOR CURIOUS TRAVELERS</p><h2>What’s worth packing home</h2></div><div className="pills">{['All', 'Snacks', 'Beauty', 'Fashion'].map(c => <button key={c} className={activeCategory === c ? 'active' : ''} onClick={() => setActiveCategory(c)}>{c}</button>)}</div></div>
      <div className="products">{filtered.map(product => <article className="product" key={product.name}><div className="product-art"><span>{product.emoji}</span><label>{product.tag}</label><button onClick={() => toggleSaved(product.name)} aria-label={`Save ${product.name}`} className={saved.includes(product.name) ? 'saved' : ''}>{saved.includes(product.name) ? '♥' : '♡'}</button></div><div className="product-info"><small>{product.country} · {product.category}</small><h3>{product.name}</h3><div><strong>{product.price}</strong><span> ★ 4.8</span></div></div></article>)}</div>
    </section>
    <section id="trips" className="shell trip-section"><div className="trip-card"><div><p className="eyebrow">YOUR UPCOMING TRIP</p><h2>Japan, spring 2027 <span>🇯🇵</span></h2><p>4 days to go · 4 things on your list</p></div><button onClick={() => setShowGuide(true)}>Open trip guide <span>→</span></button></div><div className="checklist"><div className="checklist-top"><div><p className="eyebrow">SHOPPING CHECKLIST</p><h3>Don’t forget these</h3></div><span>{checked.length}/4 packed</span></div>{['KitKat Exclusive Flavors', 'Nintendo Switch game', 'Muji notebook', 'Shiseido sunscreen'].map(item => <label key={item}><input type="checkbox" checked={checked.includes(item)} onChange={() => toggleChecked(item)} /><span>{item}</span></label>)}</div></section>
    <section id="saved" className="shell saved-strip"><div><p className="eyebrow">YOUR COLLECTION</p><h2>{saved.length} finds saved for later</h2></div><div className="saved-items">{saved.map(name => <span key={name}>♥ {name}</span>)}</div></section>
    <footer className="shell"><span className="brand"><i>✦</i> souvenir compass</span><span>Discover more. Pack better. Travel deeper.</span><span>© 2026</span></footer>
    {showGuide && <div className="modal-backdrop" onClick={() => setShowGuide(false)}><section className="modal" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setShowGuide(false)}>×</button><p className="eyebrow">JAPAN SPRING 2027</p><h2>Your shopping guide</h2><p>Download your checklist before you fly. Remember your passport for tax-free purchases over ¥5,000.</p><div className="modal-tip">✦ Tip: Don Quijote prices are often lower than airport duty free.</div><button className="primary" onClick={() => setShowGuide(false)}>Got it</button></section></div>}
  </main>
}

createRoot(document.getElementById('root')!).render(<App />)
