import { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

type Product = { name: string; country: string; price: string; category: string; emoji: string; tag: string }

const products: Product[] = [
  { name: 'Tokyo Banana', country: 'Japan', price: '¥1,200', category: 'Snacks', emoji: '🍌', tag: 'Japan exclusive' },
  { name: 'Shiseido Sunscreen', country: 'Japan', price: '¥2,480', category: 'Beauty', emoji: '☀️', tag: 'Save 28%' },
  { name: 'Matcha KitKat', country: 'Japan', price: '¥540', category: 'Snacks', emoji: '🍵', tag: 'Limited flavour' },
  { name: 'Innisfree Clay Mask', country: 'South Korea', price: '₩15,000', category: 'Beauty', emoji: '🫧', tag: 'Travel favourite' },
  { name: 'Pineapple Cakes', country: 'Taiwan', price: 'NT$380', category: 'Snacks', emoji: '🍍', tag: 'Gift-ready' },
  { name: 'Thai Silk Scarf', country: 'Thailand', price: '฿790', category: 'Fashion', emoji: '🧣', tag: 'Handmade' },
]

const countries = [
  ['Japan', '🇯🇵', '1,248 finds'], ['South Korea', '🇰🇷', '894 finds'], ['Taiwan', '🇹🇼', '632 finds'],
  ['Thailand', '🇹🇭', '581 finds'], ['France', '🇫🇷', '747 finds'], ['Italy', '🇮🇹', '492 finds'],
]

function App() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [saved, setSaved] = useState<string[]>(['Tokyo Banana'])
  const [checked, setChecked] = useState<string[]>(['KitKat Exclusive Flavors'])
  const [showGuide, setShowGuide] = useState(false)
  const filtered = useMemo(() => products.filter(p => (activeCategory === 'All' || p.category === activeCategory) && `${p.name} ${p.country} ${p.category}`.toLowerCase().includes(query.toLowerCase())), [query, activeCategory])
  const toggleSaved = (name: string) => setSaved(items => items.includes(name) ? items.filter(x => x !== name) : [...items, name])
  const toggleChecked = (name: string) => setChecked(items => items.includes(name) ? items.filter(x => x !== name) : [...items, name])

  return <main>
    <nav className="nav shell"><a className="brand" href="#top"><span>✦</span> souvenir compass</a><div className="navlinks"><a href="#discover">Discover</a><a href="#trips">My trips</a><a href="#saved">Wishlist <b>{saved.length}</b></a></div><button className="avatar" aria-label="Profile">A</button></nav>
    <section id="top" className="hero"><div className="shell hero-grid"><div className="hero-copy"><p className="eyebrow">THE GLOBAL SHOPPING GUIDE</p><h1>Bring home the <em>good stuff.</em></h1><p className="lede">Thoughtful finds, local prices, and the little details that make a trip memorable.</p><div className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a country, product, or brand" /><button onClick={() => document.querySelector('#discover')?.scrollIntoView({ behavior: 'smooth' })}>Explore</button></div><p className="search-hint">Try “matcha”, “skincare”, or “Tokyo”</p></div><div className="postcard"><div className="stamp">JAPAN<br/><strong>2027</strong></div><div className="postcard-copy"><span>YOUR NEXT TAKE-HOME STORY</span><strong>Made in<br/>Japan</strong><small>Curated by locals</small></div><div className="sun">☀</div><div className="mountain">⌁⌁⌁</div></div></div></section>
    <section id="discover" className="shell content"><div className="section-heading"><div><p className="eyebrow">START WITH A DESTINATION</p><h2>Where are you headed?</h2></div><button className="text-btn">View all countries →</button></div><div className="country-grid">{countries.map(([country, flag, count]) => <button className="country-card" key={country} onClick={() => setQuery(country)}><span>{flag}</span><strong>{country}</strong><small>{count}</small><i>→</i></button>)}</div>
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
