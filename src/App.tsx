import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  AudioLines, BookOpen, Check, CheckCircle2, ChevronRight, CircleHelp,
  Crown, Gamepad2, LockKeyhole, Mic2, Music2, RotateCcw, Sparkles,
  Volume2, VolumeX, X, Zap, Trophy, WandSparkles, Trees, Castle,
  Clapperboard, Ticket, Footprints, Star, Play, RotateCw
} from 'lucide-react'

type Quest = { id: number; name: string; subtitle: string; reward: number; x: number; y: number; icon: 'music'|'book'|'ticket'|'trees'|'castle'|'studio' }
type Question = { prompt: string; options: string[]; answer: number; explain: string }

const quests: Quest[] = [
  { id: 0, name: 'Pumpkin Patch', subtitle: 'Listen, sing and move', reward: 5, x: 25.2, y: 66.0, icon: 'music' },
  { id: 1, name: 'Haunted House', subtitle: 'Discover the grammar', reward: 8, x: 20.7, y: 39.7, icon: 'book' },
  { id: 2, name: "Witch’s Carnival", subtitle: 'Spin, mime and describe', reward: 8, x: 39.6, y: 46.5, icon: 'ticket' },
  { id: 3, name: 'Candy Forest', subtitle: 'Talk with a partner', reward: 8, x: 64.8, y: 52.2, icon: 'trees' },
  { id: 4, name: 'Monster Castle', subtitle: 'Take the 10-question quiz', reward: 20, x: 70.7, y: 31.6, icon: 'castle' },
  { id: 5, name: 'Halloween News Studio', subtitle: 'Become a TV reporter', reward: 20, x: 85.7, y: 58.0, icon: 'studio' },
]

const actions = ['jumping', 'dancing', 'reading', 'swimming', 'singing', 'sleeping', 'running', 'painting']
const questions: Question[] = [
  { prompt: 'Look! He _____ football.', options: ['play', 'is playing', 'are playing'], answer: 1, explain: 'Use “is” with he, then add the -ing action: is playing.' },
  { prompt: 'She is _____ a book.', options: ['read', 'reading', 'reads'], answer: 1, explain: 'After “is”, use the action word with -ing: reading.' },
  { prompt: 'They _____ dancing.', options: ['is', 'am', 'are'], answer: 2, explain: 'Use “are” with they: They are dancing.' },
  { prompt: 'The girl is _____.', options: ['run', 'running', 'runs'], answer: 1, explain: 'The correct action word is running.' },
  { prompt: 'I _____ eating an apple.', options: ['am', 'is', 'are'], answer: 0, explain: 'Use “am” with I: I am eating.' },
  { prompt: 'The boys are _____.', options: ['swim', 'swimming', 'swims'], answer: 1, explain: 'After “are”, use swimming.' },
  { prompt: 'Choose the correct sentence.', options: ['He is jump.', 'He jumping.', 'He is jumping.'], answer: 2, explain: 'The pattern is He + is + verb-ing.' },
  { prompt: 'Mum is _____ dinner.', options: ['cook', 'cooking', 'cooks'], answer: 1, explain: 'Mum is cooking dinner.' },
  { prompt: 'We _____ singing.', options: ['am', 'is', 'are'], answer: 2, explain: 'Use “are” with we: We are singing.' },
  { prompt: 'The cat is _____.', options: ['sleeping', 'sleep', 'sleeps'], answer: 0, explain: 'The cat is sleeping.' },
]

const initialProgress = () => {
  try {
    const saved = localStorage.getItem('trick-or-tense-progress-v4')
    if (saved) {
      const parsed = JSON.parse(saved) as { completed?: number[]; candies?: number }
      return { completed: Array.isArray(parsed.completed) ? parsed.completed.filter(n => Number.isInteger(n) && n >= 0 && n < 6) : [], candies: Number.isFinite(parsed.candies) ? Math.max(0, Number(parsed.candies)) : 0 }
    }
  } catch { /* start a fresh game if local storage is unavailable */ }
  return { completed: [] as number[], candies: 0 }
}

function QuestIcon({ kind, size = 18 }: { kind: Quest['icon']; size?: number }) {
  const props = { size, strokeWidth: 2.1 }
  if (kind === 'music') return <Music2 {...props} />
  if (kind === 'book') return <BookOpen {...props} />
  if (kind === 'ticket') return <Ticket {...props} />
  if (kind === 'trees') return <Trees {...props} />
  if (kind === 'castle') return <Castle {...props} />
  return <Clapperboard {...props} />
}

function BatMark({ size = 50 }: { size?: number }) {
  return <svg width={size} height={size * .68} viewBox="0 0 100 68" aria-hidden="true" className="bat-art">
    <path className="bat-wing left-wing" d="M47 27 C34 8 14 3 4 8 C12 15 8 25 1 31 C16 29 18 43 28 49 C33 39 39 39 47 43 Z" />
    <path className="bat-wing right-wing" d="M53 27 C66 8 86 3 96 8 C88 15 92 25 99 31 C84 29 82 43 72 49 C67 39 61 39 53 43 Z" />
    <path d="M50 19 C38 19 35 32 39 42 L33 56 L46 51 L50 61 L54 51 L67 56 L61 42 C65 32 62 19 50 19Z" fill="#48275f" stroke="#d7a6f5" strokeWidth="2.5" />
    <circle cx="44" cy="34" r="3.3" fill="#ffd46f"/><circle cx="56" cy="34" r="3.3" fill="#ffd46f" />
    <path d="M47 42 Q50 46 53 42" fill="none" stroke="#f4a5bc" strokeWidth="2.3" strokeLinecap="round" />
  </svg>
}

function WitchMark() {
  return <svg viewBox="0 0 90 112" className="witch-art" role="img" aria-label="Your little witch adventurer">
    <ellipse cx="45" cy="104" rx="26" ry="6" fill="#1c1329" opacity=".28" />
    <path d="M28 71 Q45 60 62 71 L69 98 Q45 107 21 98Z" fill="#59336c" stroke="#2d1d43" strokeWidth="3" />
    <path d="M25 79 Q11 91 18 100 L31 98 L36 83Z" fill="#a56b43" />
    <path d="M63 79 Q75 89 70 100 L59 99 L54 83Z" fill="#a56b43" />
    <path d="M32 94 L30 105 L43 105 L45 98Z M49 98 L54 105 L68 105 L61 94Z" fill="#3a294d" />
    <path d="M29 77 Q44 68 61 77 L59 90 Q45 95 31 89Z" fill="#7b4a86" />
    <path d="M20 74 Q13 63 20 50 Q28 35 46 35 Q65 35 71 53 Q73 66 62 76 L59 88 Q45 95 30 87Z" fill="#7d492b" />
    <ellipse cx="46" cy="56" rx="19" ry="22" fill="#f4c69d" />
    <path d="M27 52 Q27 32 45 32 Q62 32 67 49 Q58 44 51 43 Q39 50 27 52Z" fill="#59304b" />
    <circle cx="39" cy="58" r="2.6" fill="#35243d"/><circle cx="53" cy="58" r="2.6" fill="#35243d" />
    <path d="M42 68 Q46 71 50 68" fill="none" stroke="#a95e62" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 39 Q21 18 46 10 Q69 12 77 35 Q57 31 41 36 Q30 42 16 39Z" fill="#563069" stroke="#2e1d45" strokeWidth="3" />
    <path d="M17 39 Q48 35 75 35 L72 43 Q44 47 18 46Z" fill="#e08c42" />
    <path d="M43 11 Q60 1 74 12 Q62 14 57 25Z" fill="#563069" />
    <path d="M33 76 L59 76 L66 93 L28 93Z" fill="#b78148" stroke="#70472d" strokeWidth="2" />
    <path d="M41 78 L51 78 L54 87 L38 87Z" fill="#e3ad62" />
  </svg>
}

function SceneModal({ children, title, subtitle, quest, onClose, className = '' }: {
  children: ReactNode; title: string; subtitle: string; quest: Quest; onClose: () => void; className?: string
}) {
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
    <section className={`quest-modal ${className}`} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-topline"><span>QUEST {quest.id + 1} <i>/</i> 6</span><button className="icon-btn close-btn" onClick={onClose} aria-label="Close activity"><X size={20} /></button></div>
      <div className="modal-heading"><div className="modal-emblem"><QuestIcon kind={quest.icon} size={25} /></div><div><h2>{title}</h2><p>{subtitle}</p></div></div>
      <div className="modal-content">{children}</div>
    </section>
  </div>
}

export default function App() {
  const saved = useMemo(initialProgress, [])
  const [completed, setCompleted] = useState<number[]>(saved.completed)
  const [candies, setCandies] = useState(saved.candies)
  const [active, setActive] = useState<number | null>(null)
  const [movingTo, setMovingTo] = useState<number | null>(null)
  const [playerPos, setPlayerPos] = useState(() => {
    const last = saved.completed.length ? quests[saved.completed[saved.completed.length - 1]] : null
    return last ? { x: last.x - 1.9, y: last.y + 7.5 } : { x: 36.0, y: 58.0 }
  })
  const [batPos, setBatPos] = useState(() => {
    const last = saved.completed.length ? quests[saved.completed[saved.completed.length - 1]] : null
    return last ? { x: last.x + 3.0, y: last.y - 4.0 } : { x: 42.0, y: 52.5 }
  })
  const [walking, setWalking] = useState(false)
  const [message, setMessage] = useState('')
  const [soundOn, setSoundOn] = useState(true)
  const [helpOpen, setHelpOpen] = useState(false)
  const [progressOpen, setProgressOpen] = useState(false)
  const [rewardsOpen, setRewardsOpen] = useState(false)
  const [wordChecks, setWordChecks] = useState<string[]>([])
  const [grammarSubject, setGrammarSubject] = useState('She')
  const [grammarAction, setGrammarAction] = useState('reading')
  const [spinWord, setSpinWord] = useState('')
  const [spinAnswer, setSpinAnswer] = useState('')
  const [pairRound, setPairRound] = useState(0)
  const [pairAction, setPairAction] = useState('jumping')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizFeedback, setQuizFeedback] = useState('')
  const [reportLines, setReportLines] = useState(['', '', ''])
  const travelTimer = useRef<number | null>(null)
  const toastTimer = useRef<number | null>(null)

  useEffect(() => {
    try { localStorage.setItem('trick-or-tense-progress-v4', JSON.stringify({ completed, candies })) } catch { /* progress remains available for this session */ }
  }, [completed, candies])

  useEffect(() => () => {
    if (travelTimer.current) window.clearTimeout(travelTimer.current)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }, [])

  const score = quizAnswers.reduce((sum, answer, i) => sum + (answer === questions[i]?.answer ? 1 : 0), 0)
  const unlockedId = quests.find(q => !completed.includes(q.id))?.id ?? 6
  const isUnlocked = (id: number) => id === 0 || completed.includes(id - 1)
  const allComplete = completed.length === 6
  const quizPassed = quizAnswers.length === 10 && score >= 8
  const reportValid = reportLines.every(line => /\b(am|is|are)\s+[a-z]+ing\b/i.test(line.trim()))

  function announce(text: string) {
    if (!soundOn || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.88
    utterance.pitch = 1.03
    window.speechSynthesis.speak(utterance)
  }

  function toast(text: string) {
    setMessage(text)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setMessage(''), 3200)
  }

  function resetActivityState() {
    setWordChecks([]); setGrammarSubject('She'); setGrammarAction('reading')
    setSpinWord(''); setSpinAnswer(''); setPairRound(0); setPairAction('jumping')
    setQuestionIndex(0); setQuizAnswers([]); setQuizFeedback('')
    setReportLines(['', '', ''])
  }

  function travelTo(id: number) {
    if (!isUnlocked(id) || id > 5) {
      const needed = quests[id - 1]?.name ?? 'the previous quest'
      toast(`Complete ${needed} first to unlock this destination.`)
      return
    }
    if (travelTimer.current) window.clearTimeout(travelTimer.current)
    const spot = quests[id]
    setMovingTo(id); setWalking(true)
    setPlayerPos({ x: spot.x - 1.9, y: spot.y + 7.5 })
    setBatPos({ x: spot.x + 3.0, y: spot.y - 4.0 })
    travelTimer.current = window.setTimeout(() => {
      setWalking(false); setMovingTo(null); resetActivityState(); setActive(id)
    }, 1150)
  }

  function guideToNext() {
    if (allComplete) { setRewardsOpen(true); return }
    travelTo(unlockedId)
  }

  function completeQuest(id: number) {
    if (!completed.includes(id)) {
      const reward = quests[id].reward
      setCompleted(prev => [...prev, id].sort((a, b) => a - b))
      setCandies(prev => prev + reward)
      toast(`Quest complete! You earned ${reward} candy points.`)
    }
    setActive(null)
    if (id === 5 && 'speechSynthesis' in window) window.speechSynthesis.cancel()
  }

  function answerQuiz(index: number) {
    if (quizAnswers.length > questionIndex) return
    const isCorrect = index === questions[questionIndex].answer
    setQuizAnswers(prev => [...prev, index])
    setQuizFeedback(isCorrect ? 'That is correct. Well done!' : questions[questionIndex].explain)
  }

  function startFresh() {
    if (!window.confirm('Reset all quest progress and candy points?')) return
    if (travelTimer.current) window.clearTimeout(travelTimer.current)
    setCompleted([]); setCandies(0); setActive(null); setMovingTo(null); setWalking(false); setPlayerPos({ x: 36, y: 58 }); setBatPos({ x: 42, y: 52.5 })
    try { localStorage.removeItem('trick-or-tense-progress-v4') } catch { /* ignore */ }
    toast('Your adventure has been reset.')
  }

  const avatarStyle = { left: `${playerPos.x}%`, top: `${playerPos.y}%` }
  const batStyle = { left: `${batPos.x}%`, top: `${batPos.y}%` }

  return <main className="game-page">
    <div className="page-topbar">
      <div className="top-brand"><span className="brand-seal"><WandSparkles size={16} /></span><span>LEARNING ADVENTURE <b>·</b> YEAR 3 ENGLISH</span></div>
      <div className="top-actions">
        <div className="top-stat"><Sparkles size={15} /><strong>{candies}</strong><span>candy points</span></div>
        <button className="top-icon" onClick={() => setSoundOn(v => !v)} aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}>{soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}</button>
        <button className="top-icon" onClick={() => setHelpOpen(true)} aria-label="How to play"><CircleHelp size={18} /></button>
        <button className="top-icon" onClick={startFresh} aria-label="Reset game"><RotateCcw size={17} /></button>
      </div>
    </div>

    <div className="game-layout">
      <section className="world-column">
        <div className="world-frame">
          <div className="world-art-wrap">
            <img className="world-art" src="/images/halloween-kingdom.webp" alt="A colourful three-dimensional Halloween island with six learning destinations joined by a glowing path" draggable="false" />
            <div className="world-shade" />
            <div className="dynamic-progress" aria-live="polite">
              <div className="progress-caption"><BookOpen size={14} /><span>QUEST PROGRESS</span></div>
              <div className="progress-count">{completed.length} <i>/</i> 6</div>
              <div className="progress-track"><span style={{ width: `${completed.length / 6 * 100}%` }} /></div>
            </div>
            {quests.map(q => {
              const done = completed.includes(q.id)
              const available = isUnlocked(q.id)
              return <button key={q.id} className={`map-hotspot ${available ? 'available' : 'locked'} ${done ? 'done' : ''} ${movingTo === q.id ? 'selected' : ''}`} style={{ left: `${q.x}%`, top: `${q.y}%` }} onClick={() => travelTo(q.id)} aria-label={`${q.name}, ${done ? 'completed' : available ? 'available' : 'locked'}`} title={q.name}>
                <span className="hotspot-ring" />
                <span className="hotspot-state">{done ? <Check size={13} /> : available ? <Play size={11} fill="currentColor" /> : <LockKeyhole size={12} />}</span>
              </button>
            })}
            <div className={`player-marker ${walking ? 'walking' : ''}`} style={avatarStyle}><WitchMark /></div>
            <button className={`bat-guide ${walking ? 'flying' : ''}`} style={batStyle} onClick={guideToNext} aria-label="Follow the bat to your next quest" title="Follow the bat to your next quest"><BatMark size={48} /><span className="bat-pulse" /></button>
            <button className="image-ui-hitbox progress-hit" onClick={() => setProgressOpen(true)} aria-label="Open my progress" />
            <button className="image-ui-hitbox progress-link-hit" onClick={() => setProgressOpen(true)} aria-label="Open my progress" />
            <button className="image-ui-hitbox rewards-hit" onClick={() => setRewardsOpen(true)} aria-label="Open rewards" />
            <button className="image-ui-hitbox settings-hit" onClick={() => setHelpOpen(true)} aria-label="Open game help" />
          </div>
        </div>
        <div className="map-underbar">
          <div className="map-key"><span className="key-item"><i className="key-dot active-dot" /> Available</span><span className="key-item"><i className="key-dot locked-dot"><LockKeyhole size={9} /></i> Locked</span><span className="key-item"><i className="key-dot done-dot"><Check size={9} /></i> Completed</span></div>
          <button className="follow-btn" onClick={guideToNext}><BatMark size={26} /> Follow the bat <ChevronRight size={16} /></button>
        </div>
      </section>

      <aside className="quest-sidebar">
        <div className="sidebar-heading"><div><span className="eyebrow">YOUR JOURNEY</span><h2>Quest Trail</h2></div><div className="sidebar-medal"><Crown size={19} /></div></div>
        <div className="sidebar-progress"><div className="sidebar-progress-line"><span style={{ width: `${completed.length / 6 * 100}%` }} /></div><span>{completed.length} of 6 destinations complete</span></div>
        <div className="quest-list">
          {quests.map(q => {
            const done = completed.includes(q.id)
            const available = isUnlocked(q.id)
            return <button key={q.id} className={`quest-row ${done ? 'complete' : ''} ${available ? 'unlocked' : 'locked'}`} onClick={() => travelTo(q.id)}>
              <span className="quest-icon"><QuestIcon kind={q.icon} size={17} /></span>
              <span className="quest-copy"><b>{q.name}</b><small>{q.subtitle}</small></span>
              <span className="quest-row-status">{done ? <CheckCircle2 size={19} /> : available ? <ChevronRight size={18} /> : <LockKeyhole size={15} />}</span>
            </button>
          })}
        </div>
        <div className="sidebar-tip"><div className="tip-symbol"><Zap size={16} /></div><div><b>Grammar spell</b><p>Who + am / is / are + action-ing</p></div></div>
        <div className="sidebar-bottom"><button onClick={() => setProgressOpen(true)}><BookOpen size={15} /> My progress</button><button onClick={() => setRewardsOpen(true)}><Trophy size={15} /> Rewards</button></div>
      </aside>
    </div>

    <footer className="game-footer"><span>TRICK OR TENSE <i>•</i> PRESENT CONTINUOUS TENSE</span><span>Designed for Year 3 English</span><button onClick={() => setHelpOpen(true)}>How to play <ChevronRight size={13} /></button></footer>

    {message && <div className="toast-message" role="status"><Sparkles size={16} />{message}</div>}

    {active !== null && <SceneModal quest={quests[active]} title={quests[active].name} subtitle={quests[active].subtitle} onClose={() => setActive(null)} className={`quest-${active}`}>
      {active === 0 && <>
        <div className="activity-intro"><div className="activity-emblem"><Music2 size={21} /></div><div><h3>Listen, sing and move!</h3><p>Tap an action word, listen carefully, then show the action with your body.</p></div></div>
        <div className="word-grid">{actions.map(word => <button key={word} className={`word-tile ${wordChecks.includes(word) ? 'checked' : ''}`} onClick={() => { setWordChecks(prev => prev.includes(word) ? prev : [...prev, word]); announce(word) }}><span>{word}</span>{wordChecks.includes(word) ? <CheckCircle2 size={17} /> : <Volume2 size={17} />}</button>)}</div>
        <div className="speech-note"><AudioLines size={18} /><span>Try saying: <b>“I am jumping!”</b> or <b>“I am dancing!”</b></span></div>
        <div className="modal-footer"><span>{wordChecks.length} of 3 action words practised</span><button className="primary-btn" disabled={wordChecks.length < 3} onClick={() => completeQuest(0)}>Complete warm-up <ChevronRight size={16} /></button></div>
      </>}

      {active === 1 && <>
        <div className="activity-intro"><div className="activity-emblem"><BookOpen size={21} /></div><div><h3>The present continuous spell</h3><p>We use the present continuous to talk about actions happening now.</p></div></div>
        <div className="grammar-mat"><div className="grammar-block who"><small>WHO?</small><b>{grammarSubject}</b></div><span className="grammar-plus">+</span><div className="grammar-block be"><small>AM / IS / ARE</small><b>{grammarSubject === 'I' ? 'am' : ['He', 'She', 'It'].includes(grammarSubject) ? 'is' : 'are'}</b></div><span className="grammar-plus">+</span><div className="grammar-block action"><small>WHAT ACTION?</small><b>{grammarAction}</b></div></div>
        <div className="builder-row"><label>Choose who <select value={grammarSubject} onChange={e => { setGrammarSubject(e.target.value) }}><option>I</option><option>He</option><option>She</option><option>They</option><option>We</option></select></label><label>Choose an action <select value={grammarAction} onChange={e => { setGrammarAction(e.target.value) }}>{actions.map(a => <option key={a}>{a}</option>)}</select></label></div>
        <div className="sentence-preview"><span>YOUR SENTENCE</span><b>{grammarSubject} {grammarSubject === 'I' ? 'am' : ['He', 'She', 'It'].includes(grammarSubject) ? 'is' : 'are'} {grammarAction}.</b><button className="listen-inline" onClick={() => announce(`${grammarSubject} ${grammarSubject === 'I' ? 'am' : ['He', 'She', 'It'].includes(grammarSubject) ? 'is' : 'are'} ${grammarAction}.`)} aria-label="Listen to sentence"><Volume2 size={17} /></button></div>
        <div className="rule-strip"><span><b>I</b> am</span><span><b>He / She / It</b> is</span><span><b>You / We / They</b> are</span></div>
        <div className="modal-footer"><span>Build a sentence, then read it aloud.</span><button className="primary-btn" onClick={() => completeQuest(1)}>I understand <ChevronRight size={16} /></button></div>
      </>}

      {active === 2 && <>
        <div className="activity-intro"><div className="activity-emblem"><Ticket size={21} /></div><div><h3>Spin the action wheel</h3><p>Get an action, mime it, and say a complete sentence.</p></div></div>
        <div className="carnival-stage"><div className={`wheel-disc ${spinWord ? 'spun' : ''}`}><span className="wheel-center">{spinWord || 'SPIN'}</span><span className="wheel-pointer" /></div><div className="carnival-lights"><i /><i /><i /><i /><i /><i /></div></div>
        <div className="center-controls"><button className="primary-btn spin-btn" onClick={() => { const next = actions[Math.floor(Math.random() * actions.length)]; setSpinWord(next); setSpinAnswer(''); announce(next) }}><RotateCw size={17} /> Spin for an action</button></div>
        {spinWord && <div className="spin-challenge"><p>Your action is <b>{spinWord}</b>. Mime it, then complete the sentence:</p><div className="sentence-input"><span>I am</span><input value={spinAnswer} onChange={e => setSpinAnswer(e.target.value)} placeholder="type the action" aria-label="Type the action word" /><span>.</span></div><div className="challenge-actions"><button className="listen-inline" onClick={() => announce(`I am ${spinWord}.`)}><Volume2 size={16} /> Listen</button><button className="primary-btn" disabled={spinAnswer.trim().toLowerCase() !== spinWord} onClick={() => completeQuest(2)}>I said it! <ChevronRight size={16} /></button></div></div>}
      </>}

      {active === 3 && <>
        <div className="activity-intro"><div className="activity-emblem"><Trees size={21} /></div><div><h3>Partner talk in the Candy Forest</h3><p>Take turns asking and answering. Use the present continuous.</p></div></div>
        <div className="talk-card"><div className="talk-speaker speaker-a"><span>A</span><div><small>ASK</small><b>What is he / she doing?</b></div></div><div className="talk-speaker speaker-b"><span>B</span><div><small>ANSWER</small><b>{pairAction === 'jumping' ? 'He is jumping.' : `She is ${pairAction}.`}</b></div><button onClick={() => announce(pairAction === 'jumping' ? 'He is jumping.' : `She is ${pairAction}.`)} aria-label="Listen to the answer"><Volume2 size={17} /></button></div></div>
        <div className="partner-prompt"><span>TRY A NEW ACTION</span><div className="prompt-actions">{['jumping', 'reading', 'dancing', 'sleeping'].map(a => <button key={a} className={pairAction === a ? 'selected' : ''} onClick={() => { setPairAction(a); setPairRound(v => v + 1) }}>{a}</button>)}</div></div>
        <div className="pair-tip"><Footprints size={17} /> Take turns. Your partner can ask about a different action each time.</div>
        <div className="modal-footer"><span>{Math.max(1, pairRound + 1)} practice prompt{pairRound === 0 ? '' : 's'} explored</span><button className="primary-btn" onClick={() => completeQuest(3)}>We practised together <ChevronRight size={16} /></button></div>
      </>}

      {active === 4 && <>
        <div className="activity-intro"><div className="activity-emblem"><Castle size={21} /></div><div><h3>Monster Castle challenge</h3><p>Answer 10 questions. You need at least 8 correct answers to unlock the castle reward.</p></div></div>
        {quizAnswers.length < 10 ? <>
          <div className="quiz-progress"><span>QUESTION {questionIndex + 1} OF 10</span><div>{questions.map((_, i) => <i key={i} className={i < quizAnswers.length ? 'filled' : i === questionIndex ? 'current' : ''} />)}</div></div>
          <div className="quiz-question"><h3>{questions[questionIndex].prompt}</h3><div className="quiz-options">{questions[questionIndex].options.map((option, i) => <button key={option} disabled={quizAnswers.length > questionIndex} className={quizAnswers.length > questionIndex && i === questions[questionIndex].answer ? 'correct' : quizAnswers.length > questionIndex && i === quizAnswers[questionIndex] ? 'incorrect' : ''} onClick={() => answerQuiz(i)}><span>{String.fromCharCode(65 + i)}</span>{option}{quizAnswers.length > questionIndex && i === questions[questionIndex].answer && <Check size={17} />}</button>)}</div></div>
          {quizFeedback && <div className={`quiz-feedback ${quizAnswers[quizAnswers.length - 1] === questions[questionIndex].answer ? 'good' : 'try-again'}`}><span>{quizAnswers[quizAnswers.length - 1] === questions[questionIndex].answer ? 'Correct' : 'Let’s learn'}</span><p>{quizFeedback}</p><button className="primary-btn" onClick={() => { setQuestionIndex(v => v + 1); setQuizFeedback('') }}>Next question <ChevronRight size={15} /></button></div>}
        </> : <div className="quiz-result"><div className="result-medal"><Trophy size={38} /></div><span className="eyebrow">YOUR CASTLE SCORE</span><strong>{score}<i>/10</i></strong><h3>{quizPassed ? 'Castle cleared!' : 'Keep practising!'}</h3><p>{quizPassed ? 'Excellent work. You have earned the Monster Castle reward.' : 'You need 8 correct answers. Review the grammar spell and try again.'}</p>{quizPassed ? <button className="primary-btn" onClick={() => completeQuest(4)}>Collect castle reward <Trophy size={16} /></button> : <button className="primary-btn" onClick={() => { setQuestionIndex(0); setQuizAnswers([]); setQuizFeedback('') }}>Try the quiz again <RotateCw size={16} /></button>}</div>}
      </>}

      {active === 5 && <>
        <div className="activity-intro"><div className="activity-emblem"><Mic2 size={21} /></div><div><h3>Live from the Halloween News Studio</h3><p>You are the reporter. Describe all three actions using the present continuous.</p></div></div>
        <div className="report-scenes"><div className="report-scene"><span className="scene-number">01</span><div className="scene-art ghost-scene"><span className="ghost-shape" /></div><div><b>The ghost</b><small>is dancing</small></div></div><div className="report-scene"><span className="scene-number">02</span><div className="scene-art witch-scene"><span className="hat-shape" /></div><div><b>The witch</b><small>is flying</small></div></div><div className="report-scene"><span className="scene-number">03</span><div className="scene-art cat-scene"><span className="cat-shape" /></div><div><b>The black cat</b><small>is sleeping</small></div></div></div>
        <div className="report-fields">{['The ghost is ...', 'The witch is ...', 'The black cat is ...'].map((placeholder, i) => <label key={placeholder}><span>{`REPORT ${i + 1}`}</span><input value={reportLines[i]} onChange={e => setReportLines(prev => prev.map((v, n) => n === i ? e.target.value : v))} placeholder={placeholder} /></label>)}</div>
        <div className="report-tools"><button className="listen-inline" onClick={() => announce('Good evening! The ghost is dancing. The witch is flying. The black cat is sleeping.') }><Volume2 size={16} /> Hear a model report</button><span className={reportValid ? 'validation-pass' : ''}>{reportLines.filter(line => /\b(am|is|are)\s+[a-z]+ing\b/i.test(line.trim())).length} / 3 sentences use the -ing form</span></div>
        <div className="modal-footer"><span>Check all three sentences before submitting.</span><button className="primary-btn" disabled={!reportValid} onClick={() => completeQuest(5)}>Submit my report <ChevronRight size={16} /></button></div>
      </>}
    </SceneModal>}

    {helpOpen && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setHelpOpen(false) }}><section className="small-modal"><button className="icon-btn close-btn" onClick={() => setHelpOpen(false)}><X size={19} /></button><div className="small-modal-icon"><CircleHelp size={24} /></div><span className="eyebrow">HOW TO PLAY</span><h2>Your Halloween adventure</h2><p>Visit each destination in order. Complete a learning activity to unlock the next place and collect candy points.</p><ol><li>Choose the glowing Pumpkin Patch to begin.</li><li>Follow the bat to travel to your next unlocked quest.</li><li>Complete all six learning activities.</li><li>Score at least 8 out of 10 in Monster Castle.</li><li>Finish the reporter challenge to complete the adventure.</li></ol><button className="primary-btn full-btn" onClick={() => setHelpOpen(false)}>Let’s explore <ChevronRight size={16} /></button></section></div>}

    {progressOpen && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setProgressOpen(false) }}><section className="small-modal"><button className="icon-btn close-btn" onClick={() => setProgressOpen(false)}><X size={19} /></button><div className="small-modal-icon"><BookOpen size={24} /></div><span className="eyebrow">MY PROGRESS</span><h2>Your quest record</h2><div className="summary-score"><strong>{completed.length}<i>/6</i></strong><span>destinations completed</span></div><div className="summary-bar"><span style={{ width: `${completed.length / 6 * 100}%` }} /></div><div className="progress-record">{quests.map(q => <div key={q.id}><span className={completed.includes(q.id) ? 'record-done' : ''}>{completed.includes(q.id) ? <CheckCircle2 size={16} /> : <span className="record-empty" />}</span><b>{q.name}</b><small>{completed.includes(q.id) ? 'Completed' : isUnlocked(q.id) ? 'Ready to play' : 'Locked'}</small></div>)}</div><button className="primary-btn full-btn" onClick={() => setProgressOpen(false)}>Back to map</button></section></div>}

    {rewardsOpen && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setRewardsOpen(false) }}><section className="small-modal"><button className="icon-btn close-btn" onClick={() => setRewardsOpen(false)}><X size={19} /></button><div className="small-modal-icon trophy-icon"><Trophy size={25} /></div><span className="eyebrow">REWARD CABINET</span><h2>Your candy collection</h2><div className="candy-total"><Sparkles size={22} /><strong>{candies}</strong><span>candy points collected</span></div><div className="reward-row"><span>Warm-up star</span><b>{completed.includes(0) ? 'Earned' : 'Not yet earned'}</b></div><div className="reward-row"><span>Grammar explorer</span><b>{completed.includes(1) ? 'Earned' : 'Not yet earned'}</b></div><div className="reward-row"><span>Castle champion</span><b>{completed.includes(4) ? 'Earned' : 'Not yet earned'}</b></div><div className="reward-row"><span>News reporter badge</span><b>{completed.includes(5) ? 'Earned' : 'Not yet earned'}</b></div><button className="primary-btn full-btn" onClick={() => setRewardsOpen(false)}>Back to map</button></section></div>}
  </main>
}
