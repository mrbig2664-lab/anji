import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import './styles.css'

const images = {
  hero: '/images/hero-postcard-mobile-v2.png',
  hotel: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=82',
  grass: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=82',
  quarry: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=82',
  bamboo: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=82',
  cloud: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=900&q=82',
  lake: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=900&q=82',
  food: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82',
  tea: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=82',
}

const places = [
  {
    id: 'hotel', name: '酒店草原慢游', type: 'Stay', tags: ['抵达日', '最适合拍照'], image: images.hotel,
    why: '把第一天交给酒店：房间、草原和刚刚抵达的好心情。', best: 'Day 1 · 傍晚', tip: '先拍环境，再拍彼此。让夕阳留一点空白。', task: '互相拍 9 张照片，只能删 3 张。',
  },
  {
    id: 'baicao', name: '中南百草原', type: 'Play', tags: ['离酒店近', '不费脑'], image: images.grass,
    why: '生态、动物、绿地和一点轻游乐，适合慢慢逛，不用做攻略。', best: 'Day 2 · 上午', tip: '找一段有风的草地，拍一张不用看镜头的照片。', task: '找一个最像你们当下状态的动物，并写一句说明。',
  },
  {
    id: 'quarry', name: '深蓝计划 / 矿坑咖啡', type: 'Cafe', tags: ['蓝色湖面', '下午去'], image: images.quarry,
    why: '岩壁、蓝色湖面和咖啡，像是安吉偷偷藏起来的一帧电影。', best: 'Day 2 · 15:30 后', tip: '别站在正中间，借岩壁留出一半天空。', task: '各点一杯饮料，给对方那杯取一个旅行外号。',
  },
  {
    id: 'bamboo', name: '中国大竹海', type: 'Photo', tags: ['经典竹林', '电影感'], image: images.bamboo,
    why: '安吉最应该留一张的照片：竹林、背影，还有不着急的下午。', best: 'Day 2 · 上午', tip: '沿着小路走远一点，让背影成为画面里的主角。', task: '拍一张“我们没有赶路”的背影照。',
  },
  {
    id: 'cloud', name: '云上草原', type: 'Play', tags: ['想要刺激', '山顶风很大'], image: images.cloud,
    why: '索道、高山草甸和悬崖项目，适合把心跳调高一点。', best: 'Day 3 · 全天', tip: '把人放小，让山和风替你们说话。', task: '选一个两个人都愿意挑战的项目，不要逞强。',
  },
  {
    id: 'lake', name: '江南天池 / 天荒坪', type: 'Drive', tags: ['山路', '日落'], image: images.lake,
    why: '不赶景点的一天：把车开上山，把歌放出来，看湖慢慢亮起来。', best: 'Day 3 · 下午', tip: '车窗侧脸和路边的光，比摆拍更像你们。', task: '路上每人放 3 首歌，做一个 Anji Mixtape。',
  },
  {
    id: 'food', name: '安吉土菜馆', type: 'Food', tags: ['笋 · 土鸡 · 溪鱼', '必吃'], image: images.food,
    why: '一顿热气腾腾的当地菜，才算真的到了安吉。', best: 'Day 1 / 2 · 晚上', tip: '先别急着拍，等热气起来时拍一张。', task: '点一道两个人都没吃过的当地菜。',
  },
  {
    id: 'tea', name: '白茶 / 山野咖啡', type: 'Cafe', tags: ['雨天备选', '修照片'], image: images.tea,
    why: '下雨或太热的时候，找一张舒服的桌子，聊聊天，给照片留时间。', best: 'Any day · 下午', tip: '咖啡杯和手就够了，别把画面塞满。', task: '给这趟旅行写一句标题，不超过 12 个字。',
  },
]

const days = [
  { id: 'day1', label: 'Day 1', date: '7/28', title: '抵达与草原开场', mood: 'easy does it', plans: [
    ['Morning', '上海自驾出发', '把歌放出来，先离开日常。'],
    ['Afternoon', '入住东非草原酒店', '拍房间、酒店和第一张合照。'],
    ['Evening', '酒店晚餐或附近土菜', '傍晚散步，看看第一天的风。'],
  ]},
  { id: 'day2', label: 'Day 2', date: '7/29', title: '竹林与蓝色矿坑', mood: 'green & blue', plans: [
    ['Morning', '中国大竹海 / 中南百草原', '选一个，不用把两个都赶完。'],
    ['Afternoon', '深蓝计划 / 矿坑咖啡', '等光线柔一点，再去看蓝色。'],
    ['Evening', '县城土菜晚餐', '点一道没吃过的当地菜。'],
  ]},
  { id: 'day3', label: 'Day 3', date: '7/30', title: '二选一：刺激或发呆', mood: 'choose your mood', plans: [
    ['Morning', 'A · 云上草原', '或 B · 江南天池自驾，交给当天心情。'],
    ['Afternoon', '山里慢慢开 / 玩到尽兴', '不用证明什么，舒服最重要。'],
    ['Night', '回酒店微醺', '选一张当天最喜欢的照片。'],
  ]},
  { id: 'day4', label: 'Day 4', date: '7/31', title: '慢慢退房，带一点安吉回去', mood: 'take it home', plans: [
    ['Morning', '酒店早餐和补拍', '留一张退房前的收尾照。'],
    ['Noon', '退房，买白茶或伴手礼', '把这几天的气味带回上海。'],
    ['Afternoon', '自驾回上海', '下次再来，也不需要理由。'],
  ]},
]

const foods = ['笋干老鸭煲', '安吉土鸡', '溪鱼 / 水库鱼头', '白茶入菜', '梅溪小伙子干挑面', '农家小炒肉', '山野咖啡', '安吉白茶']
const shots = ['酒店第一张合照', '竹林背影', '咖啡杯和手', '车窗侧脸', '晚餐热气', '退房前收尾照']

function useLocalState(key, fallback) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
  })
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value])
  return [value, setValue]
}

function Image({ src, alt, className = '' }) {
  return <img className={className} src={src} alt={alt} loading="lazy" />
}

function SectionHeading({ eyebrow, title, copy, action }) {
  return <div className="section-heading">
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
    </div>
    {action}
  </div>
}

function PlaceCard({ place, votes, onVote }) {
  const count = votes[place.id] || 0
  return <article className="place-card">
    <div className="place-image-wrap">
      <Image src={place.image} alt={place.name} className="place-image" />
      <span className="type-pill">{place.type}</span>
      {count > 0 && <span className="vote-badge">{count} 票</span>}
    </div>
    <div className="place-body">
      <div className="place-title-row"><h3>{place.name}</h3><span className="arrow">↗</span></div>
      <div className="tag-row">{place.tags.map(tag => <span key={tag} className="soft-tag">{tag}</span>)}</div>
      <p className="why">{place.why}</p>
      <div className="place-details">
        <div><span>Best moment</span><strong>{place.best}</strong></div>
        <div><span>Photo tip</span><strong>{place.tip}</strong></div>
      </div>
      <div className="couple-task"><span className="task-mark">♡</span><p><b>Couple task</b>{place.task}</p></div>
      <button className={`vote-button ${count ? 'is-voted' : ''}`} onClick={() => onVote(place.id)} aria-label={`为${place.name}投票`}>
        <span>{count ? '已加入想去清单' : '我想去'}</span><span className="button-heart">{count ? '♥' : '♡'}</span>
      </button>
    </div>
  </article>
}

function App() {
  const [votes, setVotes] = useLocalState('anji-votes', {})
  const [activeDay, setActiveDay] = useState('day1')
  const [completed, setCompleted] = useLocalState('anji-completed', {})
  const [memories, setMemories] = useLocalState('anji-memories', {})
  const [shotDone, setShotDone] = useLocalState('anji-shots', {})
  const [navOpen, setNavOpen] = useState(false)
  const [toast, setToast] = useState('')
  const active = days.find(day => day.id === activeDay)
  const champion = useMemo(() => places.reduce((winner, place) => (votes[place.id] || 0) > (votes[winner?.id] || 0) ? place : winner, places[0]), [votes])
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0)
  const doneCount = Object.values(completed).filter(Boolean).length

  const vote = id => setVotes(current => ({ ...current, [id]: (current[id] || 0) + 1 }))
  const togglePlan = (dayId, index) => setCompleted(current => ({ ...current, [`${dayId}-${index}`]: !current[`${dayId}-${index}`] }))
  const saveMemory = (dayId, value) => setMemories(current => ({ ...current, [dayId]: value }))
  const showToast = message => { setToast(message); window.setTimeout(() => setToast(''), 2200) }

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#top" onClick={() => setNavOpen(false)}><span className="brand-dot" /> Anji / Trip OS</a>
      <button className="menu-toggle" onClick={() => setNavOpen(value => !value)} aria-label="打开导航">{navOpen ? '×' : 'Menu'}</button>
      <nav className={navOpen ? 'nav-links is-open' : 'nav-links'}>
        <a href="#vote" onClick={() => setNavOpen(false)}>Vote</a><a href="#days" onClick={() => setNavOpen(false)}>Days</a><a href="#memory" onClick={() => setNavOpen(false)}>Memory</a>
      </nav>
    </header>

    <main id="top">
      <section className="hero">
        <Image src={images.hero} alt="安吉竹林山景" className="hero-image" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-sticker">JULY 28—31 · SHANGHAI → ANJI</div>
          <p className="hero-kicker">A little invitation for two</p>
          <h1>山里有风，<br />也有我们</h1>
          <p className="hero-en-title">Into the Green, With You</p>
          <div className="hero-meta"><span>Shanghai to Anji</span><span className="meta-line" /><span>July 28—31, 2026</span></div>
          <div className="hero-bottom"><a className="scroll-cue" href="#vote">开始选<br /><span>↓</span></a></div>
        </div>
      </section>

      <section className="intro-band">
        <div className="intro-number">01</div><div><p className="eyebrow">The stay / field note</p><h2>安吉中南度假<br />· 东非草原酒店</h2><div className="intro-stamp"><span>FIELD NOTE / 001</span><strong>Shanghai → Anji / road trip 3—3.5h</strong></div></div>
        <p className="intro-copy">去山里偷几天，把时间还给风、竹林、咖啡和我们。<br /><small>这次不追景点，只把时间还给彼此。</small></p>
      </section>

      <section className="content-section vote-section" id="vote">
        <SectionHeading eyebrow="01 / The shortlist" title="先选想去的地方" copy="票数会留在这台设备里。你们一起选过的，都算数。" action={<span className="vote-total">{totalVotes} votes</span>} />
        <div className="champion-card"><div className="champion-image"><Image src={champion.image} alt={champion.name} /></div><div className="champion-copy"><p className="eyebrow">Current favorite</p><h3>{champion.name}</h3><p>{champion.why}</p><span className="champion-count">{votes[champion.id] || 0} 票 <span>· 按下“我想去”加入</span></span></div><span className="champion-star">✳</span></div>
        <div className="place-grid">{places.map(place => <PlaceCard key={place.id} place={place} votes={votes} onVote={vote} />)}</div>
      </section>

      <section className="content-section days-section" id="days">
        <SectionHeading eyebrow="02 / Four days" title="四天三晚，不必塞满" copy="行程只是底稿。当天想改，就改。" />
        <div className="day-tabs" role="tablist">{days.map(day => <button key={day.id} className={activeDay === day.id ? 'active' : ''} onClick={() => setActiveDay(day.id)} role="tab" aria-selected={activeDay === day.id}><span>{day.label}</span><small>{day.date}</small></button>)}</div>
        <div className="day-panel"><div className="day-panel-header"><div><p className="eyebrow">{active.date} / {active.mood}</p><h3>{active.title}</h3></div><span className="progress-note">{active.plans.filter((_, index) => completed[`${active.id}-${index}`]).length} / 3 done</span></div><div className="plan-list">{active.plans.map((plan, index) => { const key = `${active.id}-${index}`; return <button className={`plan-item ${completed[key] ? 'done' : ''}`} key={key} onClick={() => togglePlan(active.id, index)}><span className="plan-time">{plan[0]}</span><span className="plan-check">{completed[key] ? '✓' : ''}</span><span className="plan-content"><b>{plan[1]}</b><small>{plan[2]}</small></span></button> })}</div></div>
      </section>

      <section className="content-section brief-section">
        <SectionHeading eyebrow="03 / Keep the light" title="这趟至少拍 6 张" copy="不是任务，是给以后某个普通周二的一点回看。" action={<span className="shot-count">{Object.values(shotDone).filter(Boolean).length} / 6</span>} />
        <div className="shot-grid">{shots.map((shot, index) => <button key={shot} className={`shot-item ${shotDone[index] ? 'done' : ''}`} onClick={() => setShotDone(current => ({ ...current, [index]: !current[index] }))}><span className="shot-index">0{index + 1}</span><span>{shot}</span><span className="shot-check">{shotDone[index] ? '✓' : '+'}</span></button>)}</div>
      </section>

      <section className="content-section food-section">
        <SectionHeading eyebrow="04 / Eat something local" title="必吃清单" copy="先记住味道，链接以后再补。" />
        <div className="food-layout"><div className="food-photo"><Image src={images.food} alt="安吉当地菜肴" /><span>somewhere in Anji</span></div><div className="food-list">{foods.map((food, index) => <div className="food-tag" key={food}><span>0{index + 1}</span>{food}<i>+</i></div>)}</div></div>
      </section>

      <section className="memory-section" id="memory"><div className="memory-inner"><SectionHeading eyebrow="05 / Leave a little note" title="Couple Memory Log" copy="每天只留一句。不要写得完美，写得像你们。" /><div className="memory-grid">{days.map(day => <label className="memory-card" key={day.id}><span className="memory-day">{day.label} <i>{day.date}</i></span><strong>{day.title}</strong><textarea value={memories[day.id] || ''} onChange={event => saveMemory(day.id, event.target.value)} placeholder="今天最喜欢的瞬间是什么？" rows="3" /></label>)}</div></div></section>

      <section className="closing-section"><p className="eyebrow">One last thing</p><h2>How to make it<br /><em>more loving?</em></h2><p className="closing-copy">每天只问三个问题：<br />今天最想去哪里？<br />今天最舒服的瞬间是什么？<br />今天哪张照片最像我们？</p><div className="closing-mark">♡</div><p className="closing-note">OS 不负责把你们管得井井有条，<br />它负责把“我们一起选择过”留下来。</p></section>
    </main>
    <footer className="footer"><span>Anji / Trip OS</span><span>made for two · 2026</span><button onClick={() => showToast(`已完成 ${doneCount} 个行程`) }>查看旅程进度 ↗</button></footer>
    {toast && <div className="toast" role="status">{toast}</div>}
  </div>
}

export default App

createRoot(document.getElementById('root')).render(<App />)
