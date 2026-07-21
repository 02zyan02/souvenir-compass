import { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

type Product = { name: string; country: string; price: string; category: string; emoji: string; tag: string }
type Country = { name: string; flag: string; count: string; city: string; buy: string; tip: string; picks: string[]; where: string }

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
  { name: 'Brunei', flag: '🇧🇳', count: '216 finds', city: 'Bandar Seri Begawan', buy: 'Rattan baskets & kuih cincin', tip: 'Browse Pasarneka Tutong for locally made handicrafts and snacks.', picks: ['Rattan basketry', 'Kuih cincin', 'Local halal snacks'], where: 'Pasarneka Tutong or Tamu Bangar' },
  { name: 'Cambodia', flag: '🇰🇭', count: '493 finds', city: 'Siem Reap', buy: 'Silk, silverwork & ceramics', tip: 'Choose pieces sold by craft workshops and ask about the maker.', picks: ['Krama scarf', 'Kampot pepper', 'Handmade ceramics'], where: 'Craft workshops and central markets' },
  { name: 'Indonesia', flag: '🇮🇩', count: '1,120 finds', city: 'Yogyakarta', buy: 'Batik & regional coffee', tip: 'Look for hand-stamped or hand-drawn batik, not mass-printed copies.', picks: ['Batik cloth', 'Bakpia pastries', 'Single-origin coffee'], where: 'Yogyakarta craft shops and markets' },
  { name: 'Laos', flag: '🇱🇦', count: '302 finds', city: 'Luang Prabang', buy: 'Textiles & saa paper', tip: 'Local weaving, basketry and paper crafts make light luggage-friendly gifts.', picks: ['Woven textile', 'Lao coffee', 'Saa-paper crafts'], where: 'Luang Prabang night market' },
  { name: 'Malaysia', flag: '🇲🇾', count: '761 finds', city: 'Kuala Terengganu', buy: 'Batik, songket & snacks', tip: 'Pasar Payang is a good starting point for textiles and traditional snacks.', picks: ['White coffee', 'Beryl’s chocolate', 'Batik or pewter'], where: 'Central Market and major supermarkets' },
  { name: 'Myanmar', flag: '🇲🇲', count: '374 finds', city: 'Yangon', buy: 'Lacquerware & longyi', tip: 'Prioritise small, durable handmade pieces; check current travel guidance before planning.', picks: ['Lacquerware', 'Longyi textile', 'Tea-leaf snacks'], where: 'Independent craft shops; verify travel conditions' },
  { name: 'Philippines', flag: '🇵🇭', count: '688 finds', city: 'Manila', buy: 'Capiz craft & woven goods', tip: 'Protect fragile shell crafts in hand luggage, and ask how the material was sourced.', picks: ['Dried mango', 'Coconut products', 'Capiz shell craft'], where: 'Department stores and local craft markets' },
  { name: 'Singapore', flag: '🇸🇬', count: '852 finds', city: 'Singapore', buy: 'Kaya, tea & local design', tip: 'Design Orchard brings together proudly Singapore-made brands in one stop.', picks: ['Kaya spread', 'Local tea', 'Singapore-flavour snacks'], where: 'FairPrice and Design Orchard' },
  { name: 'Thailand', flag: '🇹🇭', count: '973 finds', city: 'Bangkok', buy: 'Silk, OTOP crafts & snacks', tip: 'OTOP products are a strong place to start for regional specialities.', picks: ['Herbal balm', 'Thai tea & snacks', 'OTOP silk'], where: 'Big C, 7-Eleven, and craft markets' },
  { name: 'Vietnam', flag: '🇻🇳', count: '1,044 finds', city: 'Hanoi', buy: 'Coffee, textiles & art', tip: 'Hanoi’s Old Quarter is a great place to compare craft shops; gentle haggling is expected.', picks: ['Coffee + phin filter', 'Cashews & dried fruit', 'Ao dai or silk'], where: 'Supermarkets, Old Quarter, and craft stores' },
]

const chineseNames: Record<string, string> = { Brunei: '文莱', Cambodia: '柬埔寨', Indonesia: '印度尼西亚', Laos: '老挝', Malaysia: '马来西亚', Myanmar: '缅甸', Philippines: '菲律宾', Singapore: '新加坡', Thailand: '泰国', Vietnam: '越南' }
const chineseNotes: Record<string, { buy: string; tip: string }> = {
  Brunei: { buy: '藤编篮与环形甜点 kuih cincin', tip: '可前往 Pasarneka Tutong 浏览当地手工艺品和小吃。' }, Cambodia: { buy: '真丝、银器与陶瓷', tip: '优先选择手工艺工坊售卖的作品，并向店家询问制作者。' }, Indonesia: { buy: '蜡染与区域咖啡', tip: '留意手绘或手工盖印蜡染，避开大批量印花仿品。' }, Laos: { buy: '纺织品与桑皮纸', tip: '织物、竹编和桑皮纸工艺品轻便，也很适合送礼。' }, Malaysia: { buy: '蜡染、宋吉锦与传统零食', tip: 'Pasar Payang 是寻找纺织品和传统小吃的好起点。' }, Myanmar: { buy: '漆器与笼基长裙', tip: '优先考虑小巧耐用的手作，并在出行前查看最新旅行建议。' }, Philippines: { buy: '卡皮兹贝工艺与编织品', tip: '易碎贝壳工艺品建议随身携带，并询问材料来源。' }, Singapore: { buy: '咖椰酱、茶与本地设计', tip: 'Design Orchard 汇集许多新加坡本土品牌，可一站式选购。' }, Thailand: { buy: '丝绸、OTOP 工艺品与零食', tip: '寻找地区特色商品时，OTOP 是很好的起点。' }, Vietnam: { buy: '咖啡、纺织品与艺术品', tip: '河内老城区适合比较不同工艺店；温和议价很常见。' },
}

function App() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [saved, setSaved] = useState<string[]>(['Tokyo Banana'])
  const [checked, setChecked] = useState<string[]>(['KitKat Exclusive Flavors'])
  const [showGuide, setShowGuide] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[7])
  const [language, setLanguage] = useState<'en' | 'zh'>('en')
  const zh = language === 'zh'
  const labels = zh ? { discover: '探索', trips: '我的行程', wishlist: '心愿单', eyebrow: '东盟购物指南 · 10 个国家', where: '下一站去哪里？', all: '查看全部好物 →', field: '东盟实用贴士', see: '查看好物', curated: '为好奇旅行者精选', pack: '值得带回家的好物', upcoming: '你的下一趟旅程', checklist: '购物清单', forget: '别忘了这些', saved: '你的收藏', savedFinds: '件已收藏，留待以后入手', guide: '打开行程指南', source: '灵感来自旅行者内容与官方旅游信息' } : { discover: 'Discover', trips: 'My trips', wishlist: 'Wishlist', eyebrow: 'ASEAN SHOPPING GUIDE · 10 COUNTRIES', where: 'Where are you headed?', all: 'Show all finds →', field: 'ASEAN FIELD NOTE', see: 'See finds', curated: 'CURATED FOR CURIOUS TRAVELERS', pack: 'What’s worth packing home', upcoming: 'YOUR UPCOMING TRIP', checklist: 'SHOPPING CHECKLIST', forget: 'Don’t forget these', saved: 'YOUR COLLECTION', savedFinds: 'finds saved for later', guide: 'Open trip guide', source: 'Inspired by traveler content and official tourism information' }
  const filtered = useMemo(() => products.filter(p => (activeCategory === 'All' || p.category === activeCategory) && `${p.name} ${p.country} ${p.category}`.toLowerCase().includes(query.toLowerCase())), [query, activeCategory])
  const toggleSaved = (name: string) => setSaved(items => items.includes(name) ? items.filter(x => x !== name) : [...items, name])
  const toggleChecked = (name: string) => setChecked(items => items.includes(name) ? items.filter(x => x !== name) : [...items, name])

  return <main>
    <nav className="nav shell"><a className="brand" href="#top"><span>✦</span> souvenir compass</a><div className="navlinks"><a href="#discover">{labels.discover}</a><a href="#trips">{labels.trips}</a><a href="#saved">{labels.wishlist} <b>{saved.length}</b></a><button className="language-toggle" onClick={() => setLanguage(zh ? 'en' : 'zh')}>{zh ? 'EN' : '中文'}</button></div><button className="avatar" aria-label="Profile">A</button></nav>
    <section id="top" className="hero"><div className="shell hero-grid"><div className="hero-copy"><p className="eyebrow">THE GLOBAL SHOPPING GUIDE</p><h1>Bring home the <em>good stuff.</em></h1><p className="lede">Thoughtful finds, local prices, and the little details that make a trip memorable.</p><div className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a country, product, or brand" /><button onClick={() => document.querySelector('#discover')?.scrollIntoView({ behavior: 'smooth' })}>Explore</button></div><p className="search-hint">Try “matcha”, “skincare”, or “Tokyo”</p></div><div className="postcard"><div className="stamp">JAPAN<br/><strong>2027</strong></div><div className="postcard-copy"><span>YOUR NEXT TAKE-HOME STORY</span><strong>Made in<br/>Japan</strong><small>Curated by locals</small></div><div className="sun">☀</div><div className="mountain">⌁⌁⌁</div></div></div></section>
    <section id="discover" className="shell content"><div className="section-heading"><div><p className="eyebrow">{labels.eyebrow}</p><h2>{labels.where}</h2></div><button className="text-btn" onClick={() => setQuery('')}>{labels.all}</button></div><div className="country-grid">{countries.map(country => <button className={`country-card ${selectedCountry.name === country.name ? 'chosen' : ''}`} key={country.name} onClick={() => { setSelectedCountry(country); setQuery(country.name) }}><span>{country.flag}</span><strong>{zh ? chineseNames[country.name] : country.name}</strong><small>{country.count}</small><i>→</i></button>)}</div>
      <div className="country-guide"><div className="guide-flag">{selectedCountry.flag}</div><div className="guide-copy"><p className="eyebrow">{selectedCountry.city.toUpperCase()} · {labels.field}</p><h3>{zh ? `推荐购买：${chineseNotes[selectedCountry.name].buy}` : `Buy ${selectedCountry.buy}`}</h3><p>{zh ? chineseNotes[selectedCountry.name].tip : selectedCountry.tip}</p><div className="quick-picks"><span>{zh ? '购物清单' : 'Quick picks'}</span>{selectedCountry.picks.map(pick => <b key={pick}>{pick}</b>)}<small>⌖ {zh ? '建议地点：' : 'Where: '}{selectedCountry.where}</small></div></div><button onClick={() => setQuery(selectedCountry.name)}>{labels.see} {zh ? chineseNames[selectedCountry.name] : selectedCountry.name} <span>→</span></button></div>
      <div className="section-heading finds"><div><p className="eyebrow">{labels.curated}</p><h2>{labels.pack}</h2></div><div className="pills">{['All', 'Snacks', 'Beauty', 'Fashion'].map(c => <button key={c} className={activeCategory === c ? 'active' : ''} onClick={() => setActiveCategory(c)}>{zh ? ({ All: '全部', Snacks: '零食', Beauty: '美妆', Fashion: '时尚' }[c] ?? c) : c}</button>)}</div></div>
      <div className="products">{filtered.map(product => <article className="product" key={product.name}><div className="product-art"><span>{product.emoji}</span><label>{product.tag}</label><button onClick={() => toggleSaved(product.name)} aria-label={`Save ${product.name}`} className={saved.includes(product.name) ? 'saved' : ''}>{saved.includes(product.name) ? '♥' : '♡'}</button></div><div className="product-info"><small>{product.country} · {product.category}</small><h3>{product.name}</h3><div><strong>{product.price}</strong><span> ★ 4.8</span></div></div></article>)}</div>
    </section>
    <section id="trips" className="shell trip-section"><div className="trip-card"><div><p className="eyebrow">YOUR UPCOMING TRIP</p><h2>Japan, spring 2027 <span>🇯🇵</span></h2><p>4 days to go · 4 things on your list</p></div><button onClick={() => setShowGuide(true)}>Open trip guide <span>→</span></button></div><div className="checklist"><div className="checklist-top"><div><p className="eyebrow">SHOPPING CHECKLIST</p><h3>Don’t forget these</h3></div><span>{checked.length}/4 packed</span></div>{['KitKat Exclusive Flavors', 'Nintendo Switch game', 'Muji notebook', 'Shiseido sunscreen'].map(item => <label key={item}><input type="checkbox" checked={checked.includes(item)} onChange={() => toggleChecked(item)} /><span>{item}</span></label>)}</div></section>
    <section id="saved" className="shell saved-strip"><div><p className="eyebrow">YOUR COLLECTION</p><h2>{saved.length} finds saved for later</h2></div><div className="saved-items">{saved.map(name => <span key={name}>♥ {name}</span>)}</div></section>
    <footer className="shell"><span className="brand"><i>✦</i> souvenir compass</span><span>Discover more. Pack better. Travel deeper.</span><span>© 2026</span></footer>
    {showGuide && <div className="modal-backdrop" onClick={() => setShowGuide(false)}><section className="modal" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setShowGuide(false)}>×</button><p className="eyebrow">JAPAN SPRING 2027</p><h2>Your shopping guide</h2><p>Download your checklist before you fly. Remember your passport for tax-free purchases over ¥5,000.</p><div className="modal-tip">✦ Tip: Don Quijote prices are often lower than airport duty free.</div><button className="primary" onClick={() => setShowGuide(false)}>Got it</button></section></div>}
  </main>
}

createRoot(document.getElementById('root')!).render(<App />)
