import { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

type Product = { id: number; name: string; country: string; country_slug: string; price: string; category: string; image_url: string; tag: string; note: string; reference_url: string }
type Country = { id: number; name: string; chinese_name: string; flag: string; find_count: number; city: string; buy: string; chinese_buy: string; tip: string; chinese_tip: string; shopping_location: string; reference_url: string }
type Catalog = { countries: Country[]; products: Product[]; categories: string[]; checklist: string[] }

function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [saved, setSaved] = useState<string[]>([])
  const [checked, setChecked] = useState<string[]>([])
  const [showGuide, setShowGuide] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [language, setLanguage] = useState<'en' | 'zh'>('en')
  const zh = language === 'zh'

  useEffect(() => {
    fetch('/api/catalog').then(response => {
      if (!response.ok) throw new Error('Catalog request failed')
      return response.json()
    }).then((data: Catalog) => {
      setCatalog(data)
      setSelectedCountry(data.countries.find(country => country.name === 'Singapore') ?? data.countries[0] ?? null)
    }).catch(() => setLoadError('The catalogue could not be loaded. Start PostgreSQL and the API, then refresh.'))
  }, [])

  const labels = zh ? { discover: '探索', trips: '我的行程', wishlist: '心愿单', eyebrow: '东盟购物指南 · 10 个国家', where: '下一站去哪里？', all: '查看全部好物 →', field: '东盟实用贴士', see: '查看好物', curated: '为好奇旅行者精选', pack: '值得带回家的好物', guide: '打开行程指南' } : { discover: 'Discover', trips: 'My trips', wishlist: 'Wishlist', eyebrow: 'ASEAN SHOPPING GUIDE · 10 COUNTRIES', where: 'Where are you headed?', all: 'Show all finds →', field: 'ASEAN FIELD NOTE', see: 'See finds', curated: 'CURATED FOR CURIOUS TRAVELERS', pack: 'What’s worth packing home', guide: 'Open trip guide' }
  const filtered = useMemo(() => (catalog?.products ?? []).filter(product => (activeCategory === 'All' || product.category === activeCategory) && `${product.name} ${product.country} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [catalog, query, activeCategory])
  const picks = useMemo(() => selectedCountry ? (catalog?.products ?? []).filter(product => product.country === selectedCountry.name).slice(0, 5) : [], [catalog, selectedCountry])
  const toggleSaved = (name: string) => setSaved(items => items.includes(name) ? items.filter(item => item !== name) : [...items, name])
  const toggleChecked = (name: string) => setChecked(items => items.includes(name) ? items.filter(item => item !== name) : [...items, name])

  return <main>
    <nav className="nav shell"><a className="brand" href="#top"><span>✦</span> souvenir compass</a><div className="navlinks"><a href="#discover">{labels.discover}</a><a href="#trips">{labels.trips}</a><a href="#saved">{labels.wishlist} <b>{saved.length}</b></a><button className="language-toggle" onClick={() => setLanguage(zh ? 'en' : 'zh')}>{zh ? 'EN' : '中文'}</button></div><button className="avatar" aria-label="Profile">A</button></nav>
    <section id="top" className="hero"><div className="shell hero-grid"><div className="hero-copy"><p className="eyebrow">THE GLOBAL SHOPPING GUIDE</p><h1>Bring home the <em>good stuff.</em></h1><p className="lede">Thoughtful finds, local prices, and the little details that make a trip memorable.</p><div className="search"><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search a country, product, or brand" /><button onClick={() => document.querySelector('#discover')?.scrollIntoView({ behavior: 'smooth' })}>Explore</button></div><p className="search-hint">Try “coffee”, “silk”, or “snacks”</p></div><div className="postcard"><div className="stamp">JAPAN<br/><strong>2027</strong></div><div className="postcard-copy"><span>YOUR NEXT TAKE-HOME STORY</span><strong>Made in<br/>Japan</strong><small>Curated by locals</small></div><div className="sun">☀</div><div className="mountain">⌁⌁⌁</div></div></div></section>
    <section id="discover" className="shell content"><div className="section-heading"><div><p className="eyebrow">{labels.eyebrow}</p><h2>{labels.where}</h2></div><button className="text-btn" onClick={() => { setQuery(''); setActiveCategory('All') }}>{labels.all}</button></div>
      {loadError && <p className="catalog-error">{loadError}</p>}
      <div className="country-grid">{(catalog?.countries ?? []).map(country => <button className={`country-card ${selectedCountry?.name === country.name ? 'chosen' : ''}`} key={country.id} onClick={() => { setSelectedCountry(country); setQuery(country.name) }}><span>{country.flag}</span><strong>{zh ? country.chinese_name : country.name}</strong><small>{country.find_count} finds</small><i>→</i></button>)}</div>
      {selectedCountry && <div className="country-guide"><div className="guide-flag">{selectedCountry.flag}</div><div className="guide-copy"><p className="eyebrow">{selectedCountry.city.toUpperCase()} · {labels.field}</p><h3>{zh ? `推荐购买：${selectedCountry.chinese_buy}` : `Buy ${selectedCountry.buy}`}</h3><p>{zh ? selectedCountry.chinese_tip : selectedCountry.tip}</p><div className="quick-picks"><span>{zh ? '购物清单' : 'Quick picks'}</span>{picks.map(product => <b key={product.id}>{product.name}</b>)}<small>⌖ {zh ? '建议地点：' : 'Where: '}{selectedCountry.shopping_location} · <a href={selectedCountry.reference_url} target="_blank" rel="noreferrer">Source</a></small></div></div><button onClick={() => setQuery(selectedCountry.name)}>{labels.see} {zh ? selectedCountry.chinese_name : selectedCountry.name} <span>→</span></button></div>}
      <div className="section-heading finds"><div><p className="eyebrow">{labels.curated}</p><h2>{labels.pack}</h2></div><div className="pills">{['All', ...(catalog?.categories ?? [])].map(category => <button key={category} className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)}>{zh ? ({ All: '全部', Snacks: '零食', Beauty: '美妆', Fashion: '时尚', Home: '家居' }[category] ?? category) : category}</button>)}</div></div>
      <div className="products">{filtered.map(product => <article className="product" key={product.id}><div className="product-art"><img src={product.image_url} alt={product.name} /><label>{product.tag}</label><button onClick={() => toggleSaved(product.name)} aria-label={`Save ${product.name}`} className={saved.includes(product.name) ? 'saved' : ''}>{saved.includes(product.name) ? '♥' : '♡'}</button></div><div className="product-info"><small>{product.country} · {product.category}</small><h3>{product.name}</h3><p>{product.note}</p><div><strong>{product.price}</strong><span> ★ 4.8</span></div></div></article>)}</div>
    </section>
    <section id="trips" className="shell trip-section"><div className="trip-card"><div><p className="eyebrow">YOUR UPCOMING TRIP</p><h2>Japan, spring 2027 <span>🇯🇵</span></h2><p>4 days to go · {(catalog?.checklist.length ?? 0)} things on your list</p></div><button onClick={() => setShowGuide(true)}>{labels.guide} <span>→</span></button></div><div className="checklist"><div className="checklist-top"><div><p className="eyebrow">SHOPPING CHECKLIST</p><h3>Don’t forget these</h3></div><span>{checked.length}/{catalog?.checklist.length ?? 0} packed</span></div>{(catalog?.checklist ?? []).map(item => <label key={item}><input type="checkbox" checked={checked.includes(item)} onChange={() => toggleChecked(item)} /><span>{item}</span></label>)}</div></section>
    <section id="saved" className="shell saved-strip"><div><p className="eyebrow">YOUR COLLECTION</p><h2>{saved.length} finds saved for later</h2></div><div className="saved-items">{saved.map(name => <span key={name}>♥ {name}</span>)}</div></section>
    <footer className="shell"><span className="brand"><i>✦</i> souvenir compass</span><span>Discover more. Pack better. Travel deeper.</span><span>© 2026</span></footer>
    {showGuide && <div className="modal-backdrop" onClick={() => setShowGuide(false)}><section className="modal" onClick={event => event.stopPropagation()}><button className="close" onClick={() => setShowGuide(false)}>×</button><p className="eyebrow">JAPAN SPRING 2027</p><h2>Your shopping guide</h2><p>Download your checklist before you fly. Remember your passport for tax-free purchases over ¥5,000.</p><div className="modal-tip">✦ Tip: Don Quijote prices are often lower than airport duty free.</div><button className="primary" onClick={() => setShowGuide(false)}>Got it</button></section></div>}
  </main>
}

createRoot(document.getElementById('root')!).render(<App />)
