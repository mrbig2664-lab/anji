import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import './styles.css'

const heroImage = '/images/hero-postcard-mobile-v2.png'

const days = [
  {
    id: 'pre', label: 'Pre-trip', short: '出发前夜', date: '7/27', ticket: 'PACK LIGHT', mood: '先把松弛带上',
    title: '出发前夜', next: '收拾漂流和游泳要用的东西', summary: '先把该带的带上，别把松弛留在上海。',
    checklist: ['身份证', '充电器', '充电宝', '泳衣', '拖鞋', '手机防水袋', '防晒', '防蚊', '换洗衣服'],
    task: '各自选 3 首路上想听的歌。', pending: ['明天下午出发时间', '酒店入住信息', '第一晚晚饭'],
    plans: [['Evening', '收拾行李', '漂流、游泳和路上要用的东西先放到门口。']],
  },
  {
    id: 'day1', label: 'Day 1', short: '抵达酒店', date: '7/28', ticket: 'ARRIVE SOFTLY', mood: '先让身体相信假期开始了',
    title: '抵达，把自己交给酒店', next: '上海自驾到安吉，入住酒店', summary: '第一天不赶路。抵达、换衣服、游泳、吃饭、散步，让身体先相信：假期真的开始了。',
    checklist: ['导航到酒店', '办理入住', '换衣服', '游泳', '晚饭', '饭后散步'],
    task: '互相拍一张刚到酒店、还没开始用力玩的照片。', pending: ['晚饭在哪里吃', '游泳池开放时间', '酒店周边散步路线'],
    plans: [['Afternoon', '上海自驾抵达安吉', '入住安吉中南度假 · 东非草原酒店。'], ['Late afternoon', '游泳 / 泳池边放空', '换衣服，熟悉酒店，先别急着开始拍大片。'], ['Evening', '晚饭，然后散步', '看看酒店夜晚的氛围，第一天就到这里。']],
  },
  {
    id: 'day2', label: 'Day 2', short: '漂流日', date: '7/29', ticket: 'WATER DAY', mood: '睡到自然醒，再把自己交给水流',
    title: '自然醒，然后去漂流', next: '确认漂流地点和出发时间', summary: '睡到自然醒，再把自己交给水流。夏天的快乐有时候不用高级，够凉就行。',
    checklist: ['手机防水袋', '干衣服', '毛巾', '防滑拖鞋', '防晒', '防蚊', '漂流后洗澡换衣'],
    task: '漂流后给对方拍一张狼狈但快乐的照片。', pending: ['漂流地点', '漂流门票', '晚饭地点'],
    plans: [['Morning', '自然醒，不设闹钟', '酒店早餐，慢慢收拾，不用把上午排满。'], ['Noon / afternoon', '漂流候选', '将军关 / 仙龙峡 / 十八道湾，先看距离、营业时间和体力。'], ['Evening', '回酒店洗澡休息', '吃一顿舒服的晚饭，今天不再安排新景点。']],
  },
  {
    id: 'day3', label: 'Day 3', short: '瀑布咖啡', date: '7/30', ticket: 'WATERFALL HOURS', mood: '有水声的下午，适合把话说慢一点',
    title: '瀑布咖啡与山里走走', next: '去瀑布咖啡', summary: '这一天不用赶很多地方。找一处有水声的咖啡，把下午交给山里。',
    checklist: ['相机 / 手机电量', '防晒', '防蚊', '舒服的鞋', '纸巾', '小外套'],
    task: '各自拍一张不用露脸、但很像对方的照片。', pending: ['瀑布咖啡具体店名', '是否附近徒步', '晚饭选择'],
    plans: [['Morning', '自然醒 / 酒店早餐', '看天气和体力，不急着出门。'], ['Noon / afternoon', '安吉瀑布咖啡', '具体店名待确认，先记住：喝咖啡、拍照、听水声。'], ['Late afternoon', '附近徒步 / 山里溜达', '走到刚刚好，傍晚再决定去哪里吃饭。']],
  },
  {
    id: 'day4', label: 'Day 4', short: '回上海', date: '7/31', ticket: 'TAKE IT HOME', mood: '最后一天不要急着把假期关掉',
    title: '慢慢退房，回上海', next: '早餐、补拍照片、午饭后回上海', summary: '最后一天不要急着把假期关掉。慢慢醒，慢慢吃，慢慢把安吉带回上海。',
    checklist: ['收拾行李', '检查充电器', '补拍酒店照片', '退房', '午饭', '导航回上海'],
    task: '选一张这趟旅行的封面照。', pending: ['午饭吃哪里', '几点出发回上海'],
    plans: [['Morning', '自然醒，酒店里再溜达一下', '补拍照片，把还没看完的角落再看一眼。'], ['Noon', '吃午饭', '不狼狈收尾，先好好吃一顿再出发。'], ['Afternoon', '自驾回上海', '把这几天的风、照片和一点困意带回去。']],
  },
  {
    id: 'memory', label: 'Memory', short: '旅行回顾', date: '8/1+', ticket: 'KEEP THIS', mood: '照片证明来过，句子证明我们在一起',
    title: '我们真的去过山里', next: '挑一张封面照，写下还记得的那一句', summary: '照片负责证明来过，句子负责证明当时我们在一起。',
    checklist: ['整理四天照片', '选旅行封面照', '写一句旅行标题', '把最喜欢的照片发给对方'],
    task: '把这趟旅行写成一句不会过期的话。', pending: ['旅行封面照', 'Anji Mixtape', '下一次一起去哪里'],
    plans: [['After', '回看照片', '不用一次选完，先把最想留下的那张标出来。']],
  },
]

const decisionGroups = [
  { id: 'play', title: '玩什么', items: [['hotel-pool', '酒店游泳', '≈'], ['rafting', '漂流', '⌁'], ['waterfall-cafe', '瀑布咖啡', '✦'], ['walk', '徒步溜达', '↗'], ['after-dinner-walk', '饭后散步', '→'], ['room-wine', '房间微醺', '♡']] },
  { id: 'eat', title: '吃什么', items: [['hotel-dinner', '酒店晚餐', '▦'], ['local-food', '安吉土菜', '♨'], ['coffee-dessert', '咖啡甜点', '☼'], ['return-lunch', '回程午饭', '→'], ['late-snack', '夜宵 / 小酒', '✹']] },
  { id: 'photo', title: '拍什么', items: [['first-photo', '酒店第一张合照', '01'], ['pool-photo', '泳池照', '02'], ['rafting-photo', '漂流后狼狈照', '03'], ['water-photo', '瀑布咖啡照', '04'], ['window-photo', '车窗侧脸', '05'], ['cover-photo', '回程封面照', '06']] },
]

const packGroups = [
  { id: 'before', label: '出发前', items: ['身份证', '充电器', '充电宝', '墨镜', '防晒', '防蚊'] },
  { id: 'pool', label: '游泳', items: ['泳衣', '拖鞋', '防水袋', '换洗衣服'] },
  { id: 'rafting', label: '漂流', items: ['手机防水袋', '干衣服', '毛巾', '防滑拖鞋', '不怕湿的包', '备用隐形眼镜 / 眼镜盒'] },
  { id: 'photo', label: '拍照', items: ['口红', '草帽', '墨镜', '小相机 / 手机支架', '补妆小包'] },
]

const questions = [
  '今天哪个瞬间最像假期真的开始了？', '你觉得我今天最可爱的瞬间是什么？', '明天你希望我们更刺激一点，还是更松弛一点？', '这趟旅行你最想记住什么？', '如果这趟旅行有一个主题曲，会是什么？', '你希望我们以后保留一个什么小传统？', '你觉得我们在一起最舒服的瞬间通常是什么？',
]

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
    if (!('IntersectionObserver' in window)) { nodes.forEach(node => node.classList.add('is-visible')); return undefined }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) } }), { threshold: .08 })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

function getShanghaiKey() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function autoStageId() {
  const key = getShanghaiKey()
  if (key === '2026-07-28') return 'day1'
  if (key === '2026-07-29') return 'day2'
  if (key === '2026-07-30') return 'day3'
  if (key === '2026-07-31') return 'day4'
  if (key >= '2026-08-01') return 'memory'
  return 'pre'
}

function SectionHeading({ eyebrow, title, copy, action }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{copy && <p className="section-copy">{copy}</p>}</div>{action}</div>
}

function PersonButton({ person, checked, onClick }) {
  return <button className={`person-button ${person} ${checked ? 'checked' : ''}`} onClick={onClick}>{person === 'jenny' ? '♥ Jenny' : '✦ Richard'} {checked ? '✓' : 'pick'}</button>
}

function TodayMode({ stage, autoId, selectedId, setSelectedId, checklist, toggleChecklist, ready, toggleReady }) {
  const bothReady = ready[selectedId]?.jenny && ready[selectedId]?.richard
  return <section className="today-section content-section" id="today">
    <SectionHeading eyebrow="01 / Today mode" title="今天要做什么" copy="自动按北京时间显示；也可以提前偷看下一天。" action={<span className="time-badge">Asia / Shanghai</span>} />
    <div className="mode-switcher">{days.map(day => <button key={day.id} className={`${selectedId === day.id ? 'active' : ''} ${day.id === autoId ? 'auto' : ''}`} onClick={() => setSelectedId(day.id)}><b>{day.label}</b><small>{day.date}</small></button>)}</div>
    <div className="today-card reveal"><div className="today-head"><div><span className="today-date">{stage.date} · {stage.ticket}</span><h3>{stage.title}</h3><p>{stage.mood}</p></div><span className="auto-mark">{selectedId === autoId ? 'TODAY' : 'PREVIEW'}</span></div><div className="next-action"><span>下一件事</span><strong>{stage.next}</strong></div><div className="today-columns"><div><span className="field-label">今日 checklist</span><div className="today-checks">{stage.checklist.slice(0, 6).map(item => { const key = `${stage.id}-${item}`; return <button className={checklist[key] ? 'checked' : ''} key={item} onClick={() => toggleChecklist(key)}><i>{checklist[key] ? '✓' : ''}</i>{item}</button> })}</div></div><div><span className="field-label">待确认</span><ul className="pending-list">{stage.pending.map(item => <li key={item}>{item}</li>)}</ul></div></div><div className="today-task"><span>COUPLE TASK</span><p>{stage.task}</p></div><div className="ready-row"><span className="field-label">出门前，两个人都点一下</span><div><PersonButton person="jenny" checked={ready[selectedId]?.jenny} onClick={() => toggleReady(selectedId, 'jenny')} /><PersonButton person="richard" checked={ready[selectedId]?.richard} onClick={() => toggleReady(selectedId, 'richard')} /></div>{bothReady && <strong className="all-set">All set. 出发。</strong>}</div></div>
  </section>
}

function PlanSection({ activeDay, setActiveDay, completed, togglePlan }) {
  const day = days.find(item => item.id === activeDay)
  return <section className="plan-section content-section" id="plan"><SectionHeading eyebrow="02 / Four-day plan" title="四天慢慢走" copy="票根比行程表轻一点，展开之后才是细节。" /><div className="ticket-row">{days.filter(item => item.id !== 'pre' && item.id !== 'memory').map(item => <button className={`plan-ticket ${activeDay === item.id ? 'active' : ''}`} key={item.id} onClick={() => setActiveDay(item.id)}><span>{item.label} · {item.date}</span><strong>{item.short}</strong><i>{activeDay === item.id ? '−' : '+'}</i></button>)}</div><div className="plan-expanded"><div className="expanded-heading"><span>{day.date} / {day.mood}</span><b>{day.title}</b></div><div className="expanded-plans">{day.plans.map((plan, index) => { const key = `${day.id}-${index}`; return <button className={`expanded-plan ${completed[key] ? 'done' : ''}`} key={key} onClick={() => togglePlan(key)}><span>{plan[0]}</span><i>{completed[key] ? '✓' : ''}</i><div><b>{plan[1]}</b><small>{plan[2]}</small></div></button> })}</div><div className="mini-notes"><div><span>COUPLE TASK</span><p>{day.task}</p></div><div><span>PHOTO MISSION</span><p>{day.id === 'day1' ? '酒店第一张合照' : day.id === 'day2' ? '漂流后狼狈照' : day.id === 'day3' ? '不用露脸但很像对方' : '这趟旅行的封面照'}</p></div></div></div></section>
}

function DecisionBoard({ decisions, toggleDecision }) {
  const statusFor = id => { const item = decisions[id] || {}; if (item.jenny && item.richard) return 'match'; if (item.jenny) return 'jenny'; if (item.richard) return 'richard'; return 'open' }
  return <section className="decision-section content-section" id="decisions"><SectionHeading eyebrow="03 / Decision board" title="一起决定，不用猜" copy="Jenny 和 Richard 各自点自己的印章。两边都选，就是 Match。" /><div className="person-legend"><span className="legend-jenny">♥ Jenny</span><span className="legend-richard">✦ Richard</span><span className="legend-match">● Match</span></div><div className="decision-groups">{decisionGroups.map(group => <div className="decision-group reveal" key={group.id}><div className="group-heading"><span>{group.id === 'play' ? '01' : group.id === 'eat' ? '02' : '03'}</span><h3>{group.title}</h3></div><div className="decision-grid">{group.items.map(([id, label, icon]) => { const status = statusFor(id); return <div className={`decision-item ${status}`} key={id}><div className="decision-main"><span className="decision-icon">{icon}</span><strong>{label}</strong><em>{status === 'match' ? 'Match' : status === 'jenny' ? 'Jenny pick' : status === 'richard' ? 'Richard pick' : 'Open'}</em></div><div className="decision-people"><PersonButton person="jenny" checked={decisions[id]?.jenny} onClick={() => toggleDecision(id, 'jenny')} /><PersonButton person="richard" checked={decisions[id]?.richard} onClick={() => toggleDecision(id, 'richard')} /></div></div> })}</div></div>)}</div></section>
}

function ChecklistSection({ checklist, toggleChecklist, activePack, setActivePack }) {
  const group = packGroups.find(item => item.id === activePack)
  return <section className="packing-section content-section" id="packing"><SectionHeading eyebrow="04 / Practical checklist" title="出门前，少想一点" copy="勾过的东西会留在这台设备里。" /><div className="pack-tabs">{packGroups.map(item => <button className={activePack === item.id ? 'active' : ''} key={item.id} onClick={() => setActivePack(item.id)}>{item.label}<small>{item.items.length}</small></button>)}</div><div className="pack-card"><div className="pack-card-head"><span>{group.label}</span><b>{group.items.filter(item => checklist[`pack-${activePack}-${item}`]).length} / {group.items.length}</b></div><div className="pack-grid">{group.items.map(item => { const key = `pack-${activePack}-${item}`; return <button className={checklist[key] ? 'checked' : ''} key={item} onClick={() => toggleChecklist(key)}><i>{checklist[key] ? '✓' : ''}</i>{item}</button> })}</div></div></section>
}

function CoupleMode({ couple, setCouple, question, setQuestion }) {
  const chooseCouple = (key, person, value) => setCouple(current => ({ ...current, [key]: { ...(current[key] || {}), [person]: value } }))
  return <section className="couple-section content-section" id="couple"><SectionHeading eyebrow="05 / Couple mode" title="给两个人的小按钮" copy="不测什么，只留一点今天的默契。" /><div className="couple-grid"><div className="couple-task-card"><span className="eyebrow">Today’s tiny task</span><h3>{days.find(day => day.id === autoStageId())?.task || days[0].task}</h3><button onClick={() => setQuestion((question + 1) % questions.length)}>换一个轻任务 ↻</button></div><div className="question-card"><span className="eyebrow">Question card / {question + 1}</span><p>{questions[question]}</p><button onClick={() => setQuestion((question + 1) % questions.length)}>抽下一张 →</button></div><div className="two-choice-card"><span className="eyebrow">Tonight</span><h3>晚上想要什么节奏？</h3><div className="choice-person-row"><span>散步 / 微醺</span><PersonButton person="jenny" checked={couple.tonight?.jenny === '散步'} onClick={() => chooseCouple('tonight', 'jenny', couple.tonight?.jenny === '散步' ? '' : '散步')} /><PersonButton person="richard" checked={couple.tonight?.richard === '散步'} onClick={() => chooseCouple('tonight', 'richard', couple.tonight?.richard === '散步' ? '' : '散步')} /></div><div className="choice-person-row"><span>都可以，先看心情</span><span className="choice-spacer" /></div></div></div></section>
}

function MemorySection({ memories, setMemories }) {
  return <section className="memory-section" id="memory"><div className="memory-inner"><SectionHeading eyebrow="06 / Memory log" title="留下三句话就好" copy="今天最喜欢的瞬间、最好笑的一刻，还有想记住对方什么。" /><div className="memory-grid">{days.filter(day => day.id.startsWith('day')).map(day => <article className="memory-card reveal" key={day.id}><div className="memory-card-head"><span>{day.label} · {day.date}</span><i>POSTCARD</i></div><strong>{day.title}</strong><label>今天最喜欢的瞬间<textarea value={memories[day.id]?.favorite || ''} onChange={event => setMemories(current => ({ ...current, [day.id]: { ...(current[day.id] || {}), favorite: event.target.value } }))} placeholder="写一句就好" rows="2" /></label><label>今天最好笑的一刻<textarea value={memories[day.id]?.funny || ''} onChange={event => setMemories(current => ({ ...current, [day.id]: { ...(current[day.id] || {}), funny: event.target.value } }))} placeholder="不必完整" rows="2" /></label><label>今天想记住对方什么<textarea value={memories[day.id]?.remember || ''} onChange={event => setMemories(current => ({ ...current, [day.id]: { ...(current[day.id] || {}), remember: event.target.value } }))} placeholder="留给以后" rows="2" /></label></article>)}</div><div className="seal-card"><span>✹</span><div><b>Seal This Trip</b><p>四天的照片和句子，慢慢盖上属于你们的章。</p></div><button>Coming after the trip</button></div></div></section>
}

function QuickActions() {
  return <section className="quick-section content-section" id="quick"><SectionHeading eyebrow="07 / Quick actions" title="要用的时候，在这里" copy="真实链接确认后再补，先把位置留好。" /><div className="quick-grid"><a href="#top" className="quick-card"><span>⌂</span><b>酒店地址</b><small>安吉中南度假 · 东非草原酒店</small></a><a href="#top" className="quick-card"><span>↗</span><b>导航到酒店</b><small>链接待补</small></a><a href="#decisions" className="quick-card"><span>⌁</span><b>漂流地点</b><small>候选待确认</small></a><a href="#decisions" className="quick-card"><span>✦</span><b>瀑布咖啡</b><small>具体店名待确认</small></a><a href="#decisions" className="quick-card"><span>☼</span><b>天气查看</b><small>出发前再看一次</small></a><a href="#memory" className="quick-card"><span>＋</span><b>备注区</b><small>写在 Memory Log</small></a></div></section>
}

function App() {
  const autoId = autoStageId()
  const [selectedId, setSelectedId] = useState(autoId)
  const [checklist, setChecklist] = useLocalState('anji-checklist-v2', {})
  const [ready, setReady] = useLocalState('anji-ready-v2', {})
  const [completed, setCompleted] = useLocalState('anji-plan-v2', {})
  const [decisions, setDecisions] = useLocalState('anji-decisions-v2', {})
  const [memories, setMemories] = useLocalState('anji-memories-v2', {})
  const [couple, setCouple] = useLocalState('anji-couple-v2', {})
  const [activePack, setActivePack] = useState('before')
  const [question, setQuestion] = useState(0)
  const [navOpen, setNavOpen] = useState(false)
  useReveal()

  const stage = days.find(day => day.id === selectedId) || days[0]
  const toggleChecklist = key => setChecklist(current => ({ ...current, [key]: !current[key] }))
  const toggleReady = (stageId, person) => setReady(current => ({ ...current, [stageId]: { ...(current[stageId] || {}), [person]: !current[stageId]?.[person] } }))
  const togglePlan = key => setCompleted(current => ({ ...current, [key]: !current[key] }))
  const toggleDecision = (id, person) => setDecisions(current => ({ ...current, [id]: { ...(current[id] || {}), [person]: !current[id]?.[person] } }))
  const completedCount = Object.values(completed).filter(Boolean).length
  const matchCount = useMemo(() => Object.values(decisions).filter(item => item.jenny && item.richard).length, [decisions])

  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#top"><span className="brand-dot" /> Anji / Trip OS</a><button className="menu-toggle" onClick={() => setNavOpen(value => !value)}>{navOpen ? '×' : 'Menu'}</button><nav className={navOpen ? 'nav-links is-open' : 'nav-links'}><a href="#today" onClick={() => setNavOpen(false)}>Today</a><a href="#decisions" onClick={() => setNavOpen(false)}>Choose</a><a href="#packing" onClick={() => setNavOpen(false)}>Pack</a><a href="#memory" onClick={() => setNavOpen(false)}>Memory</a></nav></header>
    <main id="top">
      <section className="hero"><img src={heroImage} alt="安吉山野旅行明信片插画" className="hero-image" fetchPriority="high" /><div className="hero-overlay" /><div className="hero-content"><div className="hero-sticker">JULY 28—31 · SHANGHAI → ANJI</div><p className="hero-kicker">A little invitation for two</p><h1>山里有风，<br />也有我们</h1><p className="hero-en-title">Into the Green, With You</p><div className="hero-meta"><span>安吉中南度假 · 东非草原酒店</span></div><div className="hero-bottom"><a className="scroll-cue" href="#today">今天开始<br /><span>↓</span></a></div></div></section>
      <TodayMode stage={stage} autoId={autoId} selectedId={selectedId} setSelectedId={setSelectedId} checklist={checklist} toggleChecklist={toggleChecklist} ready={ready} toggleReady={toggleReady} />
      <PlanSection activeDay={selectedId === 'pre' || selectedId === 'memory' ? 'day1' : selectedId} setActiveDay={setSelectedId} completed={completed} togglePlan={togglePlan} />
      <DecisionBoard decisions={decisions} toggleDecision={toggleDecision} />
      <ChecklistSection checklist={checklist} toggleChecklist={toggleChecklist} activePack={activePack} setActivePack={setActivePack} />
      <CoupleMode couple={couple} setCouple={setCouple} question={question} setQuestion={setQuestion} />
      <MemorySection memories={memories} setMemories={setMemories} />
      <QuickActions />
      <section className="closing-section"><p className="eyebrow">A small proof</p><h2>{matchCount ? `${matchCount} 个 Match，` : '没有急着决定，'}<br /><em>也很好。</em></h2><p className="closing-copy">这里不是安排表，<br />是我们一起选过的证据。</p><div className="closing-mark">♡</div><p className="closing-note">有风、有水、还有两个人都点过的按钮。</p></section>
    </main>
    <footer className="footer"><span>Anji / Trip OS</span><span>{completedCount} plans checked · {matchCount} matches</span><a href="#today">回到 Today ↗</a></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
