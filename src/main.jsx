import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import { readState, writeState } from './storage'
import './styles.css'

const heroImage = '/images/hero-postcard-mobile-v2.png'
const stickers = {
  jennyWave: '/stickers/sticker-jenny-wave.png',
  richardCalm: '/stickers/sticker-richard-calm.png',
  cheekPinch: '/stickers/sticker-cheek-pinch.png',
  kiss: '/stickers/sticker-kiss.png',
  waterfallCoffee: '/stickers/sticker-waterfall-coffee.png',
  rafting: '/stickers/sticker-rafting.png',
  photoMission: '/stickers/sticker-photo-mission.png',
  roadTrip: '/stickers/sticker-road-trip.png',
}

const days = [
  { id: 'pre', label: 'Pre-trip', short: '出发前夜', date: '7/27', ticket: 'PACK LIGHT', mood: '先把松弛带上', title: '出发前夜', next: '收拾漂流和游泳要用的东西', summary: '先把该带的带上，别把松弛留在上海。', checklist: ['身份证', '充电器', '充电宝', '泳衣', '拖鞋', '手机防水袋', '防晒', '防蚊', '换洗衣服'], task: '各自选 3 首路上想听的歌。', pending: ['明天下午出发时间', '酒店入住信息', '第一晚晚饭'], plans: [['Evening', '收拾行李', '漂流、游泳和路上要用的东西先放到门口。']] },
  { id: 'day1', label: 'Day 1', short: '抵达酒店', date: '7/28', ticket: 'ARRIVE SOFTLY', mood: '先让身体相信假期开始了', title: '抵达，把自己交给酒店', next: '上海自驾到安吉，入住酒店', summary: '第一天不赶路。抵达、换衣服、游泳、吃饭、散步，让身体先相信：假期真的开始了。', checklist: ['导航到酒店', '办理入住', '换衣服', '游泳', '晚饭', '饭后散步'], task: '互相拍一张刚到酒店、还没开始用力玩的照片。', pending: ['晚饭在哪里吃', '游泳池开放时间', '酒店周边散步路线'], plans: [['Afternoon', '上海自驾抵达安吉', '入住安吉中南度假 · 东非草原酒店。'], ['Late afternoon', '游泳 / 泳池边放空', '换衣服，熟悉酒店，先别急着开始拍大片。'], ['Evening', '晚饭，然后散步', '看看酒店夜晚的氛围，第一天就到这里。']] },
  { id: 'day2', label: 'Day 2', short: '漂流日', date: '7/29', ticket: 'WATER DAY', mood: '睡到自然醒，再把自己交给水流', title: '自然醒，然后去漂流', next: '确认漂流地点和出发时间', summary: '睡到自然醒，再把自己交给水流。夏天的快乐有时候不用高级，够凉就行。', checklist: ['手机防水袋', '干衣服', '毛巾', '防滑拖鞋', '防晒', '防蚊', '漂流后洗澡换衣'], task: '漂流后给对方拍一张狼狈但快乐的照片。', pending: ['漂流地点：将军关 / 仙龙峡 / 十八道湾', '漂流门票和出发时间', '晚饭地点'], plans: [['Morning', '自然醒，不设闹钟', '酒店早餐，慢慢收拾，不用把上午排满。'], ['Noon / afternoon', '漂流候选', '将军关 / 仙龙峡 / 十八道湾，先看距离、营业时间和体力。'], ['Evening', '回酒店洗澡休息', '吃一顿舒服的晚饭，今天不再安排新景点。']] },
  { id: 'day3', label: 'Day 3', short: '瀑布咖啡', date: '7/30', ticket: 'WATERFALL HOURS', mood: '有水声的下午，适合把话说慢一点', title: '瀑布咖啡与山里走走', next: '去瀑布咖啡', summary: '这一天不用赶很多地方。找一处有水声的咖啡，把下午交给山里。', checklist: ['相机 / 手机电量', '防晒', '防蚊', '舒服的鞋', '纸巾', '小外套'], task: '各自拍一张不用露脸、但很像对方的照片。', pending: ['瀑布咖啡具体店名：待确认', '是否附近徒步', '晚饭选择'], plans: [['Morning', '自然醒 / 酒店早餐', '看天气和体力，不急着出门。'], ['Noon / afternoon', '安吉瀑布咖啡', '具体店名待确认，先记住：喝咖啡、拍照、听水声。'], ['Late afternoon', '附近徒步 / 山里溜达', '走到刚刚好，傍晚再决定去哪里吃饭。']] },
  { id: 'day4', label: 'Day 4', short: '回上海', date: '7/31', ticket: 'TAKE IT HOME', mood: '最后一天不要急着把假期关掉', title: '慢慢退房，回上海', next: '早餐、补拍照片、午饭后回上海', summary: '最后一天不要急着把假期关掉。慢慢醒，慢慢吃，慢慢把安吉带回上海。', checklist: ['收拾行李', '检查充电器', '补拍酒店照片', '退房', '午饭', '导航回上海'], task: '选一张这趟旅行的封面照。', pending: ['午饭吃哪里', '几点出发回上海'], plans: [['Morning', '自然醒，酒店里再溜达一下', '补拍照片，把还没看完的角落再看一眼。'], ['Noon', '吃午饭', '不狼狈收尾，先好好吃一顿再出发。'], ['Afternoon', '自驾回上海', '把这几天的风、照片和一点困意带回去。']] },
  { id: 'memory', label: 'Memory', short: '旅行回顾', date: '8/1+', ticket: 'KEEP THIS', mood: '照片证明来过，句子证明我们在一起', title: '我们真的去过山里', next: '挑一张封面照，写下还记得的那一句', summary: '照片负责证明来过，句子负责证明当时我们在一起。', checklist: ['整理四天照片', '选旅行封面照', '写一句旅行标题', '把最喜欢的照片发给对方'], task: '把这趟旅行写成一句不会过期的话。', pending: ['旅行封面照', 'Anji Mixtape', '下一次一起去哪里'], plans: [['After', '回看照片', '不用一次选完，先把最想留下的那张标出来。']] },
]

const dayMap = Object.fromEntries(days.filter(day => day.id !== 'memory').map(day => [day.id, day]))
const memoryData = {
  id: 'memory',
  label: 'Memory',
  date: '8/1+',
  title: '我们真的去过山里',
  mood: '照片负责证明来过，句子负责证明当时我们在一起。',
}

const decisionGroups = [
  { id: 'play', title: '玩什么', items: [['hotel-pool', '酒店游泳', '≈'], ['rafting', '漂流', '⌁'], ['general-pass', '将军关漂流', 'A'], ['xianlong-pass', '仙龙峡漂流', 'B'], ['shibadaowan-pass', '十八道湾漂流', 'C'], ['waterfall-cafe', '瀑布咖啡 · 店名待确认', '✦'], ['walk', '徒步溜达', '↗'], ['after-dinner-walk', '饭后散步', '→'], ['room-wine', '房间微醺', '♡']] },
  { id: 'eat', title: '吃什么', items: [['hotel-dinner', '酒店晚餐', '▦'], ['local-food', '安吉土菜', '♨'], ['coffee-dessert', '咖啡甜点', '☼'], ['return-lunch', '回程午饭', '→'], ['late-snack', '夜宵 / 小酒', '✹']] },
  { id: 'photo', title: '拍什么', items: [['first-photo', '酒店第一张合照', '01'], ['pool-photo', '泳池照', '02'], ['rafting-photo', '漂流后狼狈照', '03'], ['water-photo', '瀑布咖啡照', '04'], ['window-photo', '车窗侧脸', '05'], ['cover-photo', '回程封面照', '06']] },
]
const packGroups = [
  { id: 'basics', label: '证件与基础', items: ['身份证', '驾驶证', '车钥匙', '酒店预订信息', '少量现金', '纸巾', '湿巾'] },
  { id: 'tech', label: '电子设备', items: ['手机', '充电器', '充电宝', '数据线', '车载充电器', '耳机', '手机支架'] },
  { id: 'clothes', label: '衣物', items: ['换洗内衣', '睡衣', '第二天衣服', '回程舒服衣服', '薄外套', '袜子', '运动鞋', '拖鞋'] },
  { id: 'pool', label: '游泳', items: ['泳衣', '泳镜', '泳帽（如酒店要求）', '防水袋', '泳后换洗衣物', '干发帽 / 毛巾', '身体乳'] },
  { id: 'rafting', label: '漂流', items: ['手机防水袋', '干衣服一套', '毛巾', '防滑拖鞋 / 溯溪鞋', '防水包', '小塑料袋装湿衣服', '备用隐形眼镜 / 眼镜盒', '皮筋 / 发夹'] },
  { id: 'sun-bug', label: '防晒防蚊', items: ['防晒霜', '防晒喷雾', '墨镜', '草帽', '防蚊液', '止痒药膏', '晒后修复'] },
  { id: 'beauty', label: '洗护美妆', items: ['洗面奶', '护肤品', '卸妆', '化妆包', '口红', '梳子', '发圈', '香水 / 止汗', '牙刷牙膏'] },
  { id: 'medicine', label: '药品', items: ['肠胃药', '过敏药', '止痛药', '晕车药', '创可贴', '碘伏棉签', '蚊虫叮咬药', '个人常用药'] },
  { id: 'photo', label: '拍照', items: ['草帽', '墨镜', '配饰', '好看的包', '补妆小包', '手机支架', '可出片衣服'] },
  { id: 'car', label: '车上', items: ['水', '零食', '口香糖', '垃圾袋', '路上歌单', '车载香氛'] },
]
const photoTypes = ['Hero', 'Funny', 'Food', 'Hotel', 'Road', 'Us']
const dailyTasks = ['给对方拍一张“不用力但很好看”的照片。', '晚饭时说一个今天最好笑的瞬间。', '散步时 5 分钟不看手机。', '把今天最喜欢的那张照片发给对方。']
const questions = ['今天哪个瞬间最像假期真的开始了？', '你觉得我今天最可爱的瞬间是什么？', '明天你希望我们更刺激一点，还是更松弛一点？', '这趟旅行你最想记住什么？', '如果这趟旅行有一个主题曲，会是什么？', '你希望我们以后保留一个什么小传统？', '你觉得我们在一起最舒服的瞬间通常是什么？']

function useLocalState(key, fallback) {
  const [value, setValue] = useState(() => readState(key, fallback))
  useEffect(() => writeState(key, value), [key, value])
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
function SectionHeading({ eyebrow, title, copy, action }) { return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{copy && <p className="section-copy">{copy}</p>}</div>{action}</div> }
function PersonChoice({ person, checked, onClick, compact = false }) { return <button className={`person-choice ${person} ${checked ? 'checked' : ''} ${compact ? 'compact' : ''}`} onClick={onClick}>{person === 'jenny' ? '♥ Jenny' : '✦ Richard'}<span>{checked ? '已选 ✓' : '选择'}</span></button> }
function StageSwitcher({ selectedId, autoId, setSelectedId }) { return <div className="mode-switcher">{days.map(day => <button key={day.id} className={`${selectedId === day.id ? 'active' : ''} ${day.id === autoId ? 'auto' : ''}`} onClick={() => setSelectedId(day.id)}><b>{day.label}</b><small>{day.date}</small></button>)}</div> }

function TodayMode({ stage, autoId, selectedId, setSelectedId, checklist, toggleChecklist, ready, toggleReady }) {
  const bothReady = ready[selectedId]?.jenny && ready[selectedId]?.richard
  return <section className="today-section content-section" id="today"><SectionHeading eyebrow="01 / Today mode" title="今天要做什么" copy="自动按北京时间显示，也可以提前看明天。" action={<div className="today-heading-actions"><span className="time-badge">Asia / Shanghai</span><span className="weather-note">天气：出发前查看</span></div>} /><StageSwitcher selectedId={selectedId} autoId={autoId} setSelectedId={setSelectedId} /><div className="today-card reveal"><div className="today-head"><div><span className="today-date">{stage.date} · {stage.ticket}</span><h3>{stage.title}</h3><p>{stage.mood}</p></div><span className="auto-mark">{selectedId === autoId ? 'TODAY' : 'PREVIEW'}</span></div><div className="next-action"><span>下一件事</span><strong>{stage.next}</strong></div><div className="today-columns"><div><span className="field-label">今天最要紧</span><div className="today-checks">{stage.checklist.slice(0, 5).map(item => { const key = `${stage.id}-${item}`; return <button className={checklist[key] ? 'checked' : ''} key={item} onClick={() => toggleChecklist(key)}><i>{checklist[key] ? '✓' : ''}</i>{item}</button> })}</div></div><div><span className="field-label">今日待确认</span><ul className="pending-list">{stage.pending.map(item => <li key={item}>{item}</li>)}</ul></div></div><div className="today-task"><span>今日照片任务</span><p>{stage.task}</p></div><details className="practical-info"><summary>酒店与出发信息</summary><p>安吉中南度假 · 东非草原酒店</p><p>上海 → 安吉，自驾约 3–3.5 小时</p><a href="https://uri.amap.com/search?keyword=%E5%AE%89%E5%90%89%E4%B8%AD%E5%8D%97%E5%BA%A6%E5%81%87%20%E4%B8%9C%E9%9D%9E%E8%8D%89%E5%8E%9F%E9%85%92%E5%BA%97" target="_blank" rel="noreferrer">打开高德搜索 ↗</a></details><div className="ready-row"><span className="field-label">出发前，两个人都点一下</span><div><PersonChoice person="jenny" checked={ready[selectedId]?.jenny} onClick={() => toggleReady(selectedId, 'jenny')} /><PersonChoice person="richard" checked={ready[selectedId]?.richard} onClick={() => toggleReady(selectedId, 'richard')} /></div>{bothReady && <strong className="all-set">All set. 出发。</strong>}</div></div></section>
}

function MemoryMode({ autoId, selectedId, setSelectedId, photos, memories, decisions, completedTasks, seal, setSeal }) {
  const safePhotos = Array.isArray(photos) ? photos : []
  const safeMemories = memories && typeof memories === 'object' ? memories : {}
  const safeDecisions = decisions && typeof decisions === 'object' ? decisions : {}
  const safeCompletedTasks = completedTasks && typeof completedTasks === 'object' ? completedTasks : {}
  const safeSeal = seal && typeof seal === 'object' ? seal : {}
  const tripCover = safePhotos.find(photo => photo?.isTripCover)
  const matches = decisionGroups.flatMap(group => group.items.map(item => ({ label: item[1], state: safeDecisions[item[0]] })).filter(item => item.state?.jenny && item.state?.richard))
  const doneTasks = Object.entries(safeCompletedTasks).filter(([, value]) => value).map(([key]) => dailyTasks[Number(key)]).filter(Boolean)
  const travelDays = Object.values(dayMap).filter(day => day.id.startsWith('day'))
  return <section className="memory-mode-section content-section" id="today"><SectionHeading eyebrow="01 / Memory mode" title={memoryData.title} copy={memoryData.mood} action={<span className="time-badge">after 08/01</span>} /><StageSwitcher selectedId={selectedId} autoId={autoId} setSelectedId={setSelectedId} /><div className="memory-empty-note">这里还空着。旅行结束后，它会慢慢长成一本小纪念册。</div><div className="trip-cover reveal">{tripCover ? <img src={tripCover.src} alt={tripCover.caption || '旅行封面'} /> : <div className="cover-placeholder"><span>TRIP COVER</span><b>等一张这趟旅行的封面照</b><small>在 Photo Vault 里设为整趟封面</small></div>}<div className="cover-copy"><span>ANJI / MEMORY BOOK</span><h3>山里有风，也有我们</h3><p>Into the Green, With You</p></div></div><div className="memory-highlights"><div><b>{safePhotos.length}</b><span>photos kept</span></div><div><b>{matches.length}</b><span>matches</span></div><div><b>{doneTasks.length}</b><span>tiny tasks</span></div></div><div className="match-strip"><span className="field-label">Match 过的选择</span>{matches.length ? matches.map(item => <span className="match-stamp" key={item.label}>● {item.label}</span>) : <p>还没有 Match，先从 Decision Board 里一起点一张。</p>}</div><div className="done-task-strip"><span className="field-label">完成过的小任务</span>{doneTasks.length ? doneTasks.map(task => <span key={task}>✓ {task}</span>) : <p>旅行中完成的小任务会出现在这里。</p>}</div><div className="memory-glance"><div className="memory-glance-heading"><span className="field-label">Four day memory cards</span><a href="#memory">继续写 Memory Log →</a></div><div className="memory-glance-grid">{travelDays.map(day => { const dayPhotos = safePhotos.filter(photo => photo.day === day.id).slice(0, 6); const note = safeMemories[day.id] || {}; return <article className="memory-glance-card" key={day.id}><div className="glance-photos">{dayPhotos.length ? dayPhotos.map(photo => <img key={photo.id} src={photo.src} alt={photo.caption || `${day.label} photo`} />) : <div className="glance-placeholder">等一张{day.short}的照片</div>}</div><div className="glance-copy"><span>{day.label} · {day.date}</span><strong>{day.title}</strong><p>{note.jenny || note.richard || '这一页还空着，等你们各留一句。'}</p></div></article> })}</div></div><SealThisTrip seal={safeSeal} setSeal={setSeal} /></section>
}

function PlanSection({ activeDay, setActiveDay, completed, togglePlan }) {
  const day = dayMap[activeDay] || dayMap.day1
  const travelDays = Object.values(dayMap).filter(item => item.id.startsWith('day'))
  return <section className="plan-section content-section" id="plan"><SectionHeading eyebrow="02 / Four-day plan" title="四天慢慢走" copy="票根比行程表轻一点，展开之后才是细节。" /><div className="ticket-row">{travelDays.map(item => <button className={`plan-ticket ${activeDay === item.id ? 'active' : ''}`} key={item.id} onClick={() => setActiveDay(item.id)}><span>{item.label} · {item.date}</span><strong>{item.short}</strong><i>{activeDay === item.id ? '−' : '+'}</i></button>)}</div><div className={`plan-expanded plan-${day.id}`}><div className="expanded-heading"><span>{day.date} / {day.mood}</span><b>{day.title}</b></div><div className="expanded-plans">{day.plans.map((plan, index) => { const key = `${day.id}-${index}`; return <button className={`expanded-plan ${completed[key] ? 'done' : ''}`} key={key} onClick={() => togglePlan(key)}><span>{plan[0]}</span><i>{completed[key] ? '✓' : ''}</i><div><b>{plan[1]}</b><small>{plan[2]}</small></div></button> })}</div><div className="mini-notes"><div><span>COUPLE TASK</span><p>{day.task}</p></div><div><span>PHOTO MISSION</span><p>{day.id === 'day1' ? '酒店第一张合照' : day.id === 'day2' ? '漂流后狼狈照' : day.id === 'day3' ? '不用露脸但很像对方' : '这趟旅行的封面照'}</p></div></div></div></section>
}

function DecisionBoard({ decisions, toggleDecision }) {
  const [activeGroup, setActiveGroup] = useState('play')
  const group = decisionGroups.find(item => item.id === activeGroup)
  const statusFor = id => { const item = decisions[id] || {}; if (item.jenny && item.richard) return 'match'; if (item.jenny) return 'jenny'; if (item.richard) return 'richard'; return 'open' }
  return <section className="decision-section content-section" id="decisions"><SectionHeading eyebrow="03 / Decision board" title="一起决定，不用猜" copy="Jenny 和 Richard 各自点自己的大选项。两边都选，就是 Match。" /><div className="decision-tabs">{decisionGroups.map(item => <button className={activeGroup === item.id ? 'active' : ''} key={item.id} onClick={() => setActiveGroup(item.id)}>{item.title}<small>{item.items.length}</small></button>)}</div><div className="person-legend"><span className="legend-jenny">♥ Jenny</span><span className="legend-richard">✦ Richard</span><span className="legend-match">● Match</span></div><div className="decision-group reveal"><div className="group-heading"><span>{activeGroup === 'play' ? '01' : activeGroup === 'eat' ? '02' : '03'}</span><h3>{group.title}</h3></div><div className="decision-grid">{group.items.map(([id, label, icon]) => { const status = statusFor(id); return <div className={`decision-item ${status}`} key={id}><div className="decision-main"><span className="decision-icon">{icon}</span><strong>{label}</strong><em>{status === 'match' ? 'Match' : status === 'jenny' ? 'Jenny chose' : status === 'richard' ? 'Richard chose' : 'Open'}</em></div><div className="decision-people"><PersonChoice compact person="jenny" checked={decisions[id]?.jenny} onClick={() => toggleDecision(id, 'jenny')} /><PersonChoice compact person="richard" checked={decisions[id]?.richard} onClick={() => toggleDecision(id, 'richard')} /></div></div> })}</div></div></section>
}

function ChecklistSection({ checklist, toggleChecklist, activePack, setActivePack, packOwners, setPackOwners, customItems, setCustomItems }) {
  const [hideCompleted, setHideCompleted] = useState(false)
  const [onlyMine, setOnlyMine] = useState(false)
  const [viewer, setViewer] = useState('Jenny')
  const [customLabel, setCustomLabel] = useState('')
  const group = packGroups.find(item => item.id === activePack) || packGroups[0]
  const items = [...group.items.map(label => ({ id: `pack-${group.id}-${label}`, label })), ...customItems.filter(item => item.groupId === group.id)]
  const visibleItems = items.filter(item => (!hideCompleted || !checklist[item.id]) && (!onlyMine || packOwners[item.id] === viewer))
  const doneCount = items.filter(item => checklist[item.id]).length
  const addCustom = event => { event.preventDefault(); const label = customLabel.trim(); if (!label) return; setCustomItems(current => [...current, { id: `custom-${Date.now()}`, label, groupId: activePack }]); setCustomLabel('') }
  const assign = (id, person) => setPackOwners(current => ({ ...current, [id]: current[id] === person ? '' : person }))
  return <section className="packing-section content-section" id="packing"><SectionHeading eyebrow="04 / Master packing list" title="打包清单" copy="完整清单在这里，Today 只提醒今天最要紧的。" /><div className="pack-summary"><strong>{doneCount} / {items.length}</strong><span>已完成 · {group.label}</span><div className="pack-progress"><i style={{ width: `${items.length ? (doneCount / items.length) * 100 : 0}%` }} /></div></div><div className="pack-tabs">{packGroups.map(item => <button className={activePack === item.id ? 'active' : ''} key={item.id} onClick={() => setActivePack(item.id)}>{item.label}<small>{item.items.length + customItems.filter(custom => custom.groupId === item.id).length}</small></button>)}</div><div className="pack-tools"><button className={hideCompleted ? 'active' : ''} onClick={() => setHideCompleted(value => !value)}>{hideCompleted ? '显示已完成' : '隐藏已完成'}</button><button className={onlyMine ? 'active' : ''} onClick={() => setOnlyMine(value => !value)}>{onlyMine ? `只看 ${viewer}` : '只看我负责'}</button><div className="pack-viewer"><span>我是谁</span><button className={viewer === 'Jenny' ? 'active jenny' : ''} onClick={() => setViewer('Jenny')}>♥ Jenny</button><button className={viewer === 'Richard' ? 'active richard' : ''} onClick={() => setViewer('Richard')}>✦ Richard</button></div></div><div className="pack-card"><div className="pack-card-head"><span>{group.label}</span><b>{doneCount} / {items.length}</b></div><div className="pack-grid">{visibleItems.length ? visibleItems.map(item => <div className={`pack-item ${checklist[item.id] ? 'checked' : ''}`} key={item.id}><button className="pack-check" onClick={() => toggleChecklist(item.id)}><i>{checklist[item.id] ? '✓' : ''}</i><span>{item.label}</span></button><div className="pack-assignee"><button className={packOwners[item.id] === 'Jenny' ? 'active jenny' : ''} onClick={() => assign(item.id, 'Jenny')}>Jenny</button><button className={packOwners[item.id] === 'Richard' ? 'active richard' : ''} onClick={() => assign(item.id, 'Richard')}>Richard</button></div></div>) : <div className="pack-empty">这一类都整理好了。可以切换“显示已完成”，或者新增一项。</div>}</div><form className="pack-add" onSubmit={addCustom}><input value={customLabel} onChange={event => setCustomLabel(event.target.value)} placeholder={`给「${group.label}」新增一项`} /><button type="submit">＋ 添加</button></form></div></section>
}

function CoupleMode({ taskIndex, setTaskIndex, questionIndex, setQuestionIndex, taskDone, setTaskDone, couple, setCouple }) {
  const choose = (person, value) => setCouple(current => ({ ...current, tonight: { ...(current.tonight || {}), [person]: current.tonight?.[person] === value ? '' : value } }))
  return <section className="couple-section content-section" id="couple"><SectionHeading eyebrow="05 / Couple mode" title="给两个人的小按钮" copy="不测什么，只留一点今天的默契。" /><div className="couple-grid"><div className="couple-task-card"><span className="eyebrow">Today’s tiny task</span><h3>{dailyTasks[taskIndex]}</h3><div className="couple-task-actions"><button onClick={() => setTaskIndex((taskIndex + 1) % dailyTasks.length)}>更新小任务 ↻</button><button className={taskDone[taskIndex] ? 'done' : ''} onClick={() => setTaskDone(current => ({ ...current, [taskIndex]: !current[taskIndex] }))}>{taskDone[taskIndex] ? '已完成 ✓' : '完成这件小事'}</button></div></div><div className="question-card"><span className="eyebrow">Question card / {questionIndex + 1}</span><p>{questions[questionIndex]}</p><button onClick={() => setQuestionIndex((questionIndex + 1) % questions.length)}>换一个问题 →</button></div><div className="two-choice-card"><span className="eyebrow">Tonight / 二选一</span><h3>晚上想要什么节奏？</h3><div className="large-choice-grid"><div className="large-choice"><strong>散步</strong><small>把话说慢一点</small><PersonChoice person="jenny" checked={couple.tonight?.jenny === '散步'} onClick={() => choose('jenny', '散步')} /><PersonChoice person="richard" checked={couple.tonight?.richard === '散步'} onClick={() => choose('richard', '散步')} /></div><div className="large-choice"><strong>微醺</strong><small>回房间再聊一会儿</small><PersonChoice person="jenny" checked={couple.tonight?.jenny === '微醺'} onClick={() => choose('jenny', '微醺')} /><PersonChoice person="richard" checked={couple.tonight?.richard === '微醺'} onClick={() => choose('richard', '微醺')} /></div></div></div></div></section>
}

function PhotoVault({ photos, setPhotos }) {
  const [activeDay, setActiveDay] = useState('day1')
  const [uploader, setUploader] = useState('Jenny')
  const [photoType, setPhotoType] = useState('Us')
  const dayPhotos = photos.filter(photo => photo.day === activeDay)
  const updatePhoto = (id, patch) => setPhotos(current => current.map(photo => photo.id === id ? { ...photo, ...patch } : photo))
  const upload = event => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setPhotos(current => [{ id: `${Date.now()}-${file.name}`, day: activeDay, src: reader.result, caption: '', type: photoType, uploadedBy: uploader, isDayCover: current.filter(photo => photo.day === activeDay).length === 0, isTripCover: current.length === 0 }, ...current]); reader.readAsDataURL(file); event.target.value = '' }
  const setDayCover = id => setPhotos(current => current.map(photo => photo.day === activeDay ? { ...photo, isDayCover: photo.id === id } : photo))
  const setTripCover = id => setPhotos(current => current.map(photo => ({ ...photo, isTripCover: photo.id === id })))
  return <section className="vault-section content-section" id="vault"><SectionHeading eyebrow="06 / Photo vault" title="照片小抽屉" copy="每天收一两张就好。Demo 会先保存在这台设备里。" /><div className="vault-top"><div className="vault-tabs">{days.filter(day => day.id.startsWith('day')).map(day => <button className={activeDay === day.id ? 'active' : ''} key={day.id} onClick={() => setActiveDay(day.id)}>{day.label}<small>{day.date}</small></button>)}</div><div className="vault-controls"><span>我是谁</span><button className={uploader === 'Jenny' ? 'active jenny' : ''} onClick={() => setUploader('Jenny')}>♥ Jenny</button><button className={uploader === 'Richard' ? 'active richard' : ''} onClick={() => setUploader('Richard')}>✦ Richard</button></div><div className="vault-controls"><span>照片类型</span>{photoTypes.map(type => <button className={photoType === type ? 'active' : ''} key={type} onClick={() => setPhotoType(type)}>{type}</button>)}</div></div><label className="upload-sticker">＋ 添加今天的一张照片<input type="file" accept="image/*" onChange={upload} /></label>{dayPhotos.length === 0 ? <div className="vault-empty"><span>✹</span><b>这里还空着，等一张今天的我们。</b><small>点上面的贴纸，把照片放进 Day {activeDay.slice(-1)}。</small></div> : <div className="photo-grid">{dayPhotos.map(photo => <article className="photo-card" key={photo.id}><div className="photo-frame"><img src={photo.src} alt={photo.caption || `${activeDay} photo`} />{photo.isDayCover && <span className="cover-stamp">DAY COVER</span>}{photo.isTripCover && <span className="trip-stamp">TRIP COVER</span>}</div><div className="photo-card-body"><div className="photo-meta"><span>{photo.uploadedBy} · {photo.type}</span><button onClick={() => setDayCover(photo.id)}>{photo.isDayCover ? '已是当天封面' : '设为当天封面'}</button><button onClick={() => setTripCover(photo.id)}>{photo.isTripCover ? '整趟封面 ✓' : '设为整趟封面'}</button></div><textarea value={photo.caption} onChange={event => updatePhoto(photo.id, { caption: event.target.value })} placeholder="给这张照片留一句 caption" rows="2" /></div></article>)}</div>}</section>
}

function MemorySection({ memories, setMemories }) { return <section className="memory-section" id="memory"><div className="memory-inner"><SectionHeading eyebrow="07 / Memory log" title="每天留下三句话" copy="Jenny 和 Richard 都可以写，不用写得完美。" /><div className="memory-notes"><label>旅行备注<textarea value={memories.note || ''} onChange={event => setMemories(current => ({ ...current, note: event.target.value }))} placeholder="把还没决定的事、想补的链接、或者一句突然想到的话放在这里。" rows="2" /></label></div><div className="memory-grid">{days.filter(day => day.id.startsWith('day')).map(day => <article className="memory-card reveal" key={day.id}><div className="memory-card-head"><span>{day.label} · {day.date}</span><i>{day.mood}</i></div><strong>{day.title}</strong><label>Jenny 的一句话<textarea value={memories[day.id]?.jenny || ''} onChange={event => setMemories(current => ({ ...current, [day.id]: { ...(current[day.id] || {}), jenny: event.target.value } }))} placeholder="今天最喜欢的瞬间" rows="2" /></label><label>Richard 的一句话<textarea value={memories[day.id]?.richard || ''} onChange={event => setMemories(current => ({ ...current, [day.id]: { ...(current[day.id] || {}), richard: event.target.value } }))} placeholder="今天想记住什么" rows="2" /></label><label>最好笑的一刻<textarea value={memories[day.id]?.funny || ''} onChange={event => setMemories(current => ({ ...current, [day.id]: { ...(current[day.id] || {}), funny: event.target.value } }))} placeholder="不用完整" rows="2" /></label><label>最舒服的一刻<textarea value={memories[day.id]?.comfortable || ''} onChange={event => setMemories(current => ({ ...current, [day.id]: { ...(current[day.id] || {}), comfortable: event.target.value } }))} placeholder="留给以后" rows="2" /></label></article>)}</div></div></section> }

function SealThisTrip({ seal, setSeal }) { const update = (key, value) => setSeal(current => ({ ...current, [key]: value })); return <div className="seal-trip"><div className="seal-trip-head"><span>✹</span><div><b>Seal This Trip</b><small>ANJI / 2026 · MADE FOR TWO</small></div></div><label>这趟旅行的名字<input value={seal.title || ''} onChange={event => update('title', event.target.value)} placeholder="比如：山里有风，也有我们" /></label><label>最喜欢的一张照片<input value={seal.favoritePhoto || ''} onChange={event => update('favoritePhoto', event.target.value)} placeholder="写 Day / 照片 caption" /></label><label>最好笑的一刻<textarea value={seal.funny || ''} onChange={event => update('funny', event.target.value)} placeholder="以后看到还会笑的那一刻" rows="2" /></label><label>最舒服的一刻<textarea value={seal.comfortable || ''} onChange={event => update('comfortable', event.target.value)} placeholder="风、泳池、咖啡，或者某个普通瞬间" rows="2" /></label><label>下次还想一起做什么<textarea value={seal.next || ''} onChange={event => update('next', event.target.value)} placeholder="留给下一次" rows="2" /></label><label>一句话写给这几天的我们<textarea value={seal.note || ''} onChange={event => update('note', event.target.value)} placeholder="写给这趟旅行" rows="2" /></label><div className="seal-line">not ready to seal yet · keep adding</div></div> }

function BottomNav() { return <nav className="bottom-nav"><a href="#today"><span>☼</span>Today</a><a href="#plan"><span>▤</span>Plan</a><a href="#decisions"><span>✦</span>Decide</a><a href="#memory"><span>♡</span>Memory</a></nav> }

function App() {
  const autoId = autoStageId()
  const [selectedId, setSelectedId] = useState(autoId)
  const [checklist, setChecklist] = useLocalState('anji-checklist-v3', {})
  const [ready, setReady] = useLocalState('anji-ready-v3', {})
  const [completed, setCompleted] = useLocalState('anji-plan-v3', {})
  const [decisions, setDecisions] = useLocalState('anji-decisions-v3', {})
  const [memories, setMemories] = useLocalState('anji-memories-v3', {})
  const [photos, setPhotos] = useLocalState('anji-photos-v1', [])
  const [couple, setCouple] = useLocalState('anji-couple-v3', {})
  const [completedTasks, setCompletedTasks] = useLocalState('anji-tasks-v1', {})
  const [seal, setSeal] = useLocalState('anji-seal-v1', {})
  const [packOwners, setPackOwners] = useLocalState('anji-pack-owners-v1', {})
  const [customPackItems, setCustomPackItems] = useLocalState('anji-pack-custom-v1', [])
  const [activePack, setActivePack] = useState('before')
  const [taskIndex, setTaskIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [navOpen, setNavOpen] = useState(false)
  useReveal()
  const stage = dayMap[selectedId] || dayMap.pre
  const toggleChecklist = key => setChecklist(current => ({ ...current, [key]: !current[key] }))
  const toggleReady = (stageId, person) => setReady(current => ({ ...current, [stageId]: { ...(current[stageId] || {}), [person]: !current[stageId]?.[person] } }))
  const togglePlan = key => setCompleted(current => ({ ...current, [key]: !current[key] }))
  const toggleDecision = (id, person) => setDecisions(current => ({ ...current, [id]: { ...(current[id] || {}), [person]: !current[id]?.[person] } }))
  const safeDecisions = decisions && typeof decisions === 'object' ? decisions : {}
  const matchCount = useMemo(() => Object.values(safeDecisions).filter(item => item?.jenny && item?.richard).length, [safeDecisions])
  const doneCount = Object.values(completed).filter(Boolean).length
  const isMemory = selectedId === 'memory'
  return <div className="app-shell"><header className="topbar"><a className="brand" href="#top"><span className="brand-dot" /> Anji / Trip OS</a><button className="menu-toggle" onClick={() => setNavOpen(value => !value)}>{navOpen ? '×' : 'Menu'}</button><nav className={navOpen ? 'nav-links is-open' : 'nav-links'}><a href="#today" onClick={() => setNavOpen(false)}>Today</a><a href="#decisions" onClick={() => setNavOpen(false)}>Decide</a><a href="#vault" onClick={() => setNavOpen(false)}>Photos</a><a href="#memory" onClick={() => setNavOpen(false)}>Memory</a></nav></header><main id="top" className={isMemory ? 'memory-active' : ''}><section className="hero"><img src={heroImage} alt="安吉山野旅行明信片插画" className="hero-image" fetchPriority="high" /><div className="hero-overlay" /><div className="hero-content"><div className="hero-sticker">JULY 28—31 · SHANGHAI → ANJI</div><p className="hero-kicker">A little invitation for two</p><h1>山里有风，<br />也有我们</h1><p className="hero-en-title">Into the Green, With You</p><div className="hero-meta"><span>安吉中南度假 · 东非草原酒店</span></div><div className="hero-bottom"><a className="scroll-cue" href="#today">今天开始<br /><span>↓</span></a></div></div></section>{isMemory ? <MemoryMode autoId={autoId} selectedId={selectedId} setSelectedId={setSelectedId} photos={photos} memories={memories} decisions={decisions} completedTasks={completedTasks} seal={seal} setSeal={setSeal} /> : <TodayMode stage={stage} autoId={autoId} selectedId={selectedId} setSelectedId={setSelectedId} checklist={checklist} toggleChecklist={toggleChecklist} ready={ready} toggleReady={toggleReady} />}<PlanSection activeDay={isMemory ? 'day1' : selectedId === 'pre' || selectedId === 'memory' ? 'day1' : selectedId} setActiveDay={setSelectedId} completed={completed} togglePlan={togglePlan} /><DecisionBoard decisions={decisions} toggleDecision={toggleDecision} /><ChecklistSection checklist={checklist} toggleChecklist={toggleChecklist} activePack={activePack} setActivePack={setActivePack} packOwners={packOwners} setPackOwners={setPackOwners} customItems={customPackItems} setCustomItems={setCustomPackItems} /><CoupleMode taskIndex={taskIndex} setTaskIndex={setTaskIndex} questionIndex={questionIndex} setQuestionIndex={setQuestionIndex} taskDone={completedTasks} setTaskDone={setCompletedTasks} couple={couple} setCouple={setCouple} /><PhotoVault photos={photos} setPhotos={setPhotos} /><MemorySection memories={memories} setMemories={setMemories} /><section className="closing-section"><p className="eyebrow">A small proof</p><h2>{matchCount ? `${matchCount} 个 Match，` : '没有急着决定，'}<br /><em>也很好。</em></h2><p className="closing-copy">这里不是安排表，<br />是我们一起选过的证据。</p><div className="closing-mark">♡</div><p className="closing-note">有风、有水、还有两个人都点过的按钮。</p></section></main><footer className="footer"><span>Anji / Trip OS</span><span>{doneCount} plans checked · {matchCount} matches</span><a href="#today">回到 Today ↗</a></footer><BottomNav /></div>
}

createRoot(document.getElementById('root')).render(<App />)
