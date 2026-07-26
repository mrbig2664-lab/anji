import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import './styles.css'

const images = {
  hero: '/images/hero-postcard-mobile-v2.png',
}

const places = [
  {
    id: 'hotel-pool', name: '酒店泳池放空', type: 'PLAY', sticker: 'Day 1 · 先松下来', art: 'pool', mark: '≈',
    why: '第一天不赶景点，先换衣服、下水、看一会儿天。', best: '抵达后 · 傍晚', task: '互相拍一张刚到酒店、还没开始用力玩的照片。', feedback: '好，先把假期放进泳池里。',
  },
  {
    id: 'general-rafting', name: '安吉将军关漂流', type: 'PLAY', sticker: '待确认', art: 'river', mark: '⌁',
    why: '水流、夏天、轻微刺激。具体路线等我们确认距离和营业时间。', best: 'Day 2 · 中午后', task: '漂流后给对方拍一张“狼狈但快乐”的照片。', feedback: '这张小票先盖章，等你们确认路线。',
  },
  {
    id: 'xianlong-rafting', name: '仙龙峡漂流', type: 'PLAY', sticker: '漂流候选', art: 'river', mark: '≈',
    why: '如果想把夏天玩得更刺激一点，可以把它放进 Day 2 候选池。', best: 'Day 2 · 看体力', task: '漂流前先合照，漂流后再合照。对比谁更像夏天。', feedback: '收到，刺激程度交给当天心情。',
  },
  {
    id: 'waterfall-cafe', name: '安吉瀑布咖啡', type: 'CAFE', sticker: 'Day 3 · 有水声', art: 'waterfall', mark: '✦',
    why: '找一处有水声的咖啡，把下午交给山里，不用赶很多地方。', best: 'Day 3 · 中午前后', task: '各自拍一张不用露脸、但很像对方的照片。', feedback: '有水声的下午，已经很会安排了。',
  },
  {
    id: 'mountain-walk', name: '山里走走', type: 'PHOTO', sticker: '看体力', art: 'walk', mark: '↗',
    why: '瀑布咖啡之后，沿附近小路散一会儿步，走到不想走为止。', best: 'Day 3 · 下午后半段', task: '把手机交给对方十分钟，只记录风和脚步。', feedback: '好，今天不再塞更多景点。',
  },
  {
    id: 'comfortable-dinner', name: '舒服的晚饭', type: 'EAT', sticker: '不追求网红', art: 'dinner', mark: '♡',
    why: '漂流或徒步之后，热气腾腾的一顿饭就是最好的收尾。', best: 'Day 1 / 2 / 3 · 晚上', task: '点一道两个人都没吃过的当地菜。', feedback: '今晚的正式安排：好好吃饭。',
  },
  {
    id: 'hotel-breakfast', name: '酒店自然醒早餐', type: 'EAT', sticker: '慢慢来', art: 'breakfast', mark: '☼',
    why: '睡到自然醒、不设闹钟，早餐才是这趟旅行的第一项正式安排。', best: 'Day 2 / 4 · 上午', task: '给对方留一口你觉得最好吃的。', feedback: '自然醒已加入，不需要闹钟批准。',
  },
  {
    id: 'cover-photo', name: '这趟的封面照', type: 'PHOTO', sticker: 'Day 4 · 带回去', art: 'cover', mark: '✹',
    why: '最后一天不狼狈收尾，选一张最像你们的照片，留给以后。', best: 'Day 4 · 退房前', task: '选一张这趟旅行的封面照。', feedback: '这一张，留给以后某个普通周二。',
  },
]

const days = [
  {
    id: 'day1', label: 'Day 1', date: '7/28', ticket: 'ARRIVE SOFTLY', short: '抵达 · 游泳 · 晚饭 · 散步', mood: 'slow in',
    title: '抵达，把自己交给酒店', summary: '第一天不赶路。抵达、换衣服、游泳、吃饭、散步，让身体先相信：假期真的开始了。',
    plans: [['Afternoon', '上海自驾抵达安吉', '入住安吉中南度假 · 东非草原酒店。'], ['Late afternoon', '游泳 / 泳池边放空', '换衣服，熟悉酒店，拍几张还没开始用力玩的照片。'], ['Evening', '晚饭，然后散步', '看看酒店夜晚的氛围，第一天就到这里。']],
    softChoice: '今天想游泳还是散步？', choices: ['先游泳', '先散步'], task: '互相拍一张刚到酒店、还没开始用力玩的照片。', photo: '酒店第一张合照',
  },
  {
    id: 'day2', label: 'Day 2', date: '7/29', ticket: 'WATER DAY', short: '自然醒 · 漂流 · 洗澡 · 晚饭', mood: 'cool & loose',
    title: '自然醒，然后去漂流', summary: '睡到自然醒，再把自己交给水流。夏天的快乐有时候不用高级，够凉就行。',
    plans: [['Morning', '自然醒，不设闹钟', '酒店早餐，慢慢收拾，不用把上午排满。'], ['Noon / afternoon', '漂流候选', '安吉将军关 / 仙龙峡 / 十八道湾，先看距离、营业时间和当天体力。'], ['Evening', '回酒店洗澡休息', '吃一顿舒服的晚饭，今天不再安排新景点。']],
    softChoice: '漂流选刺激一点，还是轻松一点？', choices: ['想玩大一点', '今天轻松点'], task: '漂流后给对方拍一张“狼狈但快乐”的照片。', photo: '水花和湿头发',
  },
  {
    id: 'day3', label: 'Day 3', date: '7/30', ticket: 'WATERFALL HOURS', short: '瀑布咖啡 · 徒步 · 山里溜达', mood: 'listen to water',
    title: '瀑布咖啡与山里走走', summary: '这一天不用赶很多地方。找一处有水声的咖啡，把下午交给山里。',
    plans: [['Morning', '自然醒 / 酒店早餐', '看天气和体力，不急着出门。'], ['Noon / afternoon', '安吉瀑布咖啡', '具体店名待确认，先记住：喝咖啡、拍照、听水声。'], ['Late afternoon', '附近徒步 / 山里溜达', '走到刚刚好，傍晚再决定去哪里吃饭。']],
    softChoice: '瀑布咖啡后徒步，还是回酒店？', choices: ['去走走', '回去躺会儿'], task: '各自拍一张不用露脸、但很像对方的照片。', photo: '一杯咖啡和一段水声',
  },
  {
    id: 'day4', label: 'Day 4', date: '7/31', ticket: 'TAKE IT HOME', short: '自然醒 · 午饭 · 回上海', mood: 'leave slowly',
    title: '慢慢退房，回上海', summary: '最后一天不要急着把假期关掉。慢慢醒，慢慢吃，慢慢把安吉带回上海。',
    plans: [['Morning', '自然醒，酒店里再溜达一下', '补拍照片，把还没看完的角落再看一眼。'], ['Noon', '吃午饭', '不狼狈收尾，先好好吃一顿再出发。'], ['Afternoon', '自驾回上海', '把这几天的风、照片和一点困意带回去。']],
    softChoice: '最后一顿吃土菜，还是酒店舒服午餐？', choices: ['去吃土菜', '酒店里吃'], task: '选一张这趟旅行的封面照。', photo: '退房前收尾照',
  },
]

const foods = ['笋干老鸭煲', '安吉土鸡', '溪鱼 / 水库鱼头', '白茶入菜', '农家小炒肉', '安吉白茶', '山野咖啡']
const shots = ['刚到酒店，还没开始用力玩', '漂流后狼狈但快乐', '不用露脸但很像对方', '有水声的咖啡下午', '最后一顿饭的热气', '这趟旅行的封面照']

function useLocalState(key, fallback) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
  })
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value])
  return [value, setValue]
}

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(node => node.classList.add('is-visible'))
      return undefined
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: .08 })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

function SectionHeading({ eyebrow, title, copy, action }) {
  return <div className="section-heading">
    <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{copy && <p className="section-copy">{copy}</p>}</div>
    {action}
  </div>
}

function PostcardArt({ place }) {
  return <div className={`postcard-art art-${place.art}`}>
    <img src={images.hero} alt="" loading="lazy" />
    <div className="art-wash" />
    <span className="art-mark">{place.mark}</span>
    <span className="art-caption">ANJI / {place.type}</span>
  </div>
}

function PlaceCard({ place, votes, onVote }) {
  const count = votes[place.id] || 0
  return <article className="place-card reveal">
    <PostcardArt place={place} />
    <div className="place-body">
      <div className="place-title-row"><div><span className="place-type">{place.type}</span><h3>{place.name}</h3></div><span className="serial">0{places.indexOf(place) + 1}</span></div>
      <span className="sticker-label">{place.sticker}</span>
      <p className="why">{place.why}</p>
      <div className="place-meta"><span>Best moment</span><strong>{place.best}</strong></div>
      <div className="couple-task"><span className="task-mark">♡</span><p><b>Couple task</b>{place.task}</p></div>
      <button className={`vote-button ${count ? 'is-voted' : ''}`} onClick={() => onVote(place)} aria-label={`为${place.name}投票`}><span>{count ? '已盖章 · 想去' : '我想去'}</span><span className="button-heart">{count ? '♥' : '♡'}</span></button>
    </div>
  </article>
}

function DayTicket({ day, active, onClick }) {
  return <button className={`day-ticket ${active ? 'active' : ''}`} onClick={onClick} aria-expanded={active}>
    <span className="ticket-top"><b>{day.label}</b><small>{day.date}</small></span>
    <strong>{day.ticket}</strong><span>{day.short}</span><i>{active ? '↓' : '↗'}</i>
  </button>
}

function App() {
  const [votes, setVotes] = useLocalState('anji-votes', {})
  const [activeDay, setActiveDay] = useState('day1')
  const [completed, setCompleted] = useLocalState('anji-completed', {})
  const [memories, setMemories] = useLocalState('anji-memories', {})
  const [shotDone, setShotDone] = useLocalState('anji-shots', {})
  const [softChoices, setSoftChoices] = useLocalState('anji-soft-choices', {})
  const [navOpen, setNavOpen] = useState(false)
  const [voteNote, setVoteNote] = useState('')
  const active = days.find(day => day.id === activeDay)
  const champion = useMemo(() => places.reduce((winner, place) => (votes[place.id] || 0) > (votes[winner?.id] || 0) ? place : winner, places[0]), [votes])
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0)
  const doneCount = Object.values(completed).filter(Boolean).length
  useReveal()

  const vote = place => {
    setVotes(current => ({ ...current, [place.id]: (current[place.id] || 0) + 1 }))
    setVoteNote(place.feedback)
    window.setTimeout(() => setVoteNote(''), 2400)
  }
  const togglePlan = (dayId, index) => setCompleted(current => ({ ...current, [`${dayId}-${index}`]: !current[`${dayId}-${index}`] }))
  const saveMemory = (dayId, value) => setMemories(current => ({ ...current, [dayId]: value }))
  const choose = (dayId, choice) => setSoftChoices(current => ({ ...current, [dayId]: choice }))

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#top" onClick={() => setNavOpen(false)}><span className="brand-dot" /> Anji / Trip OS</a>
      <button className="menu-toggle" onClick={() => setNavOpen(value => !value)} aria-label="打开导航">{navOpen ? '×' : 'Menu'}</button>
      <nav className={navOpen ? 'nav-links is-open' : 'nav-links'}><a href="#rhythm" onClick={() => setNavOpen(false)}>Days</a><a href="#vote" onClick={() => setNavOpen(false)}>Choose</a><a href="#memory" onClick={() => setNavOpen(false)}>Notes</a></nav>
    </header>

    <main id="top">
      <section className="hero">
        <img src={images.hero} alt="安吉山野旅行明信片插画" className="hero-image" fetchPriority="high" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-sticker">JULY 28—31 · SHANGHAI → ANJI</div>
          <p className="hero-kicker">A little invitation for two</p>
          <h1>山里有风，<br />也有我们</h1>
          <p className="hero-en-title">Into the Green, With You</p>
          <div className="hero-meta"><span>Shanghai to Anji</span><span className="meta-line" /><span>July 28—31, 2026</span></div>
          <div className="hero-bottom"><a className="scroll-cue" href="#rhythm">开始选<br /><span>↓</span></a></div>
        </div>
      </section>

      <section className="intro-band reveal">
        <div className="intro-number">01</div><div><p className="eyebrow">The stay / field note</p><h2>安吉中南度假<br />· 东非草原酒店</h2><div className="intro-stamp"><span>FIELD NOTE / 001</span><strong>Shanghai → Anji / road trip 3—3.5h</strong></div></div>
        <p className="intro-copy">去山里偷几天，把时间还给风、竹林、咖啡和我们。<br /><small>这次不追景点，只把时间还给彼此。</small></p>
      </section>

      <section className="rhythm-section content-section" id="rhythm">
        <SectionHeading eyebrow="02 / Trip rhythm" title="四天，慢慢过" copy="先看一眼节奏，再决定今天到底想做什么。" action={<span className="section-count">4 little tickets</span>} />
        <div className="ticket-track">{days.map(day => <DayTicket key={day.id} day={day} active={activeDay === day.id} onClick={() => setActiveDay(day.id)} />)}</div>
        <div className="rhythm-note"><span>✳</span><p>票根可以展开，计划不用一次性全部决定。</p><small>swipe / tap a day</small></div>
      </section>

      <section className="itinerary-section content-section" id="itinerary">
        <SectionHeading eyebrow="03 / Itinerary field note" title={active.title} copy={active.summary} action={<span className="day-stamp">{active.date} · {active.mood}</span>} />
        <div className="itinerary-layout">
          <div className="plan-panel"><div className="panel-top"><span>DAY PLAN / {active.label}</span><b>{active.plans.filter((_, index) => completed[`${active.id}-${index}`]).length} / {active.plans.length} done</b></div><div className="plan-list">{active.plans.map((plan, index) => { const key = `${active.id}-${index}`; return <button className={`plan-item ${completed[key] ? 'done' : ''}`} key={key} onClick={() => togglePlan(active.id, index)}><span className="plan-time">{plan[0]}</span><span className="plan-check">{completed[key] ? '✓' : ''}</span><span className="plan-content"><b>{plan[1]}</b><small>{plan[2]}</small></span></button> })}</div></div>
          <div className="choice-stack"><div className="choice-card"><span className="eyebrow">Soft choice</span><h3>{active.softChoice}</h3><div className="choice-buttons">{active.choices.map(choice => <button className={softChoices[active.id] === choice ? 'chosen' : ''} key={choice} onClick={() => choose(active.id, choice)}>{choice}{softChoices[active.id] === choice && <span>✓</span>}</button>)}</div></div><div className="day-note"><span className="note-label">COUPLE TASK</span><p>{active.task}</p><span className="note-label">PHOTO MISSION</span><strong>{active.photo}</strong></div></div>
        </div>
      </section>

      <section className="vote-section content-section" id="vote">
        <SectionHeading eyebrow="04 / Choose together" title="一起决定的小卡池" copy="不需要把所有地方都去完。选出来的那一张，就先算我们的。" action={<span className="section-count">{totalVotes} stamps</span>} />
        <div className="champion-card"><div className="champion-copy"><p className="eyebrow">Current little favorite</p><h3>{champion.name}</h3><p>{champion.why}</p></div><div className="champion-seal">{votes[champion.id] || 0}<small>votes</small></div></div>
        {voteNote && <div className="vote-feedback" role="status"><span>✹</span>{voteNote}</div>}
        <div className="deck-hint"><span>swipe the postcards</span><span>→</span></div>
        <div className="place-grid">{places.map(place => <PlaceCard key={place.id} place={place} votes={votes} onVote={vote} />)}</div>
      </section>

      <section className="brief-section content-section">
        <SectionHeading eyebrow="05 / Photo contact sheet" title="这趟至少留 6 张" copy="不是任务，是给以后某个普通周二的一点回看。" action={<span className="section-count">{Object.values(shotDone).filter(Boolean).length} / 6</span>} />
        <div className="shot-grid">{shots.map((shot, index) => <button key={shot} className={`shot-item ${shotDone[index] ? 'done' : ''}`} onClick={() => setShotDone(current => ({ ...current, [index]: !current[index] }))}><span className="shot-thumb"><span>{shotDone[index] ? '✓' : '0' + (index + 1)}</span></span><span>{shot}</span><span className="shot-check">{shotDone[index] ? 'STAMPED' : '＋'}</span></button>)}</div>
      </section>

      <section className="food-section content-section">
        <SectionHeading eyebrow="06 / Eat something local" title="把味道也带回去" copy="先记住想吃什么，链接以后再补。" />
        <div className="food-layout"><div className="food-note"><span className="stamp-circle">EAT<br />LOCAL</span><p>笋、土鸡、溪鱼、热气，还有一顿不要急着拍的晚饭。</p><small>ANJI / FIELD NOTE 006</small></div><div className="food-list">{foods.map((food, index) => <div className="food-tag" key={food}><span>0{index + 1}</span>{food}<i>＋</i></div>)}</div></div>
      </section>

      <section className="memory-section" id="memory"><div className="memory-inner"><SectionHeading eyebrow="07 / Leave a little note" title="Couple Memory Log" copy="每天只留一句。不要写得完美，写得像你们。" /><div className="memory-grid">{days.map(day => <label className="memory-card" key={day.id}><span className="memory-day">{day.label} <i>{day.date}</i></span><strong>{day.title}</strong><div className="memory-lines"><textarea value={memories[day.id] || ''} onChange={event => saveMemory(day.id, event.target.value)} placeholder="今天最喜欢的瞬间是什么？" rows="3" /><span>from us, in Anji</span></div></label>)}</div></div></section>

      <section className="closing-section"><p className="eyebrow">One last thing</p><h2>How to make it<br /><em>more loving?</em></h2><p className="closing-copy">每天只问三个问题：<br />今天最想去哪里？<br />今天最舒服的瞬间是什么？<br />今天哪张照片最像我们？</p><div className="closing-mark">♡</div><p className="closing-note">OS 不负责把你们管得井井有条，<br />它负责把“我们一起选择过”留下来。</p></section>
    </main>
    <footer className="footer"><span>Anji / Trip OS</span><span>made for two · 2026</span><button onClick={() => setVoteNote(`已完成 ${doneCount} 个行程`) }>查看旅程进度 ↗</button></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
