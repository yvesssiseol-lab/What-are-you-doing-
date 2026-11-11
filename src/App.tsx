import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, Html, OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { ArrowLeft, ArrowRight, AudioLines, BookOpen, CheckCircle2, ChevronRight, CircleHelp, Crown, Gamepad2, Ghost, Lock, Map, Mic, MicOff, Music2, RotateCcw, Sparkles, Star, Volume2, X } from 'lucide-react'

type Place = { id: number; name: string; subtitle: string; icon: string; color: string; x: number; z: number }
const places: Place[] = [
  { id: 0, name: 'Pumpkin Patch', subtitle: 'Listen, sing & move', icon: '🎃', color: '#ff9b42', x: -5, z: 3 },
  { id: 1, name: 'Haunted House', subtitle: 'Discover the grammar', icon: '🏚️', color: '#9b83ed', x: -2.7, z: -1 },
  { id: 2, name: "Witch's Carnival", subtitle: 'Spin, mime & describe', icon: '🎪', color: '#ed76b7', x: 0, z: 3 },
  { id: 3, name: 'Candy Forest', subtitle: 'Talk with a partner', icon: '🍭', color: '#65c9a5', x: 3, z: -1 },
  { id: 4, name: 'Monster Castle', subtitle: 'Take the 10-question quiz', icon: '🏰', color: '#8b9ff0', x: 5.4, z: 3 },
  { id: 5, name: 'News Studio', subtitle: 'Become a TV reporter', icon: '📺', color: '#f2c65e', x: 1, z: -5 }
]
const questions = [
  { q: 'Look! He _____ football.', options: ['play', 'is playing', 'are playing'], answer: 1, why: 'He + is + verb-ing: He is playing football.' },
  { q: 'She is _____ a book.', options: ['read', 'reading', 'reads'], answer: 1, why: 'After is, add -ing: reading.' },
  { q: 'They _____ dancing.', options: ['is', 'am', 'are'], answer: 2, why: 'Use are with they.' },
  { q: 'What is the girl doing? She is _____.', options: ['run', 'running', 'runs'], answer: 1, why: 'Running describes an action happening now.' },
  { q: 'I _____ eating an apple.', options: ['am', 'is', 'are'], answer: 0, why: 'Use am with I.' },
  { q: 'The boys are _____.', options: ['swim', 'swimming', 'swims'], answer: 1, why: 'Are + swimming.' },
  { q: 'Choose the correct sentence.', options: ['He is jump.', 'He jumping.', 'He is jumping.'], answer: 2, why: 'Subject + is + verb-ing.' },
  { q: 'Mum is _____ dinner.', options: ['cook', 'cooking', 'cooks'], answer: 1, why: 'Cooking is the -ing form.' },
  { q: 'What are they doing? They _____ singing.', options: ['am', 'is', 'are'], answer: 2, why: 'Use are with they.' },
  { q: 'The cat is _____.', options: ['sleeping', 'sleep', 'sleeps'], answer: 0, why: 'Is + sleeping.' }
]
const actionWords = ['jumping', 'dancing', 'reading', 'swimming', 'singing', 'sleeping', 'running', 'painting']
const sentences = ['He is jumping.', 'She is reading.', 'They are dancing.', 'The cat is sleeping.']

function Tree({ place, unlocked, onSelect }: { place: Place; unlocked: boolean; onSelect: (id: number) => void }) {
  const color = new THREE.Color(place.color)
  return <group position={[place.x, 0, place.z]} onClick={() => unlocked && onSelect(place.id)}>
    <Float speed={1.3} floatIntensity={0.12}>
      <mesh position={[0, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.68, 24, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.22} />
      </mesh>
      <Html position={[0, 2.0, 0]} center distanceFactor={11} style={{ pointerEvents: 'none' }}>
        <div className="map-icon">{place.icon}</div>
      </Html>
    </Float>
    <mesh position={[0, 0.45, 0]} castShadow>
      <cylinderGeometry args={[0.85, 1.05, 0.9, 8]} />
      <meshStandardMaterial color={place.id === 4 ? '#555078' : '#34304f'} />
    </mesh>
    <mesh position={[0, 0.94, 0]} castShadow>
      <cylinderGeometry args={[0.7, 0.85, 0.18, 8]} />
      <meshStandardMaterial color={place.color} />
    </mesh>
    <Html position={[0, -0.18, 0]} center distanceFactor={10}>
      <button className={`map-label ${unlocked ? '' : 'locked'}`} onClick={(e) => { e.stopPropagation(); if (unlocked) onSelect(place.id) }}>
        {unlocked ? '' : '🔒 '}{place.name}
      </button>
    </Html>
    {!unlocked && <mesh position={[0, 2.8, 0]}><torusGeometry args={[0.82, 0.035, 8, 28]} /><meshBasicMaterial color="#b8a9e8" /></mesh>}
  </group>
}

function World({ completed, onSelect }: { completed: number[]; onSelect: (id: number) => void }) {
  return <Canvas shadows camera={{ position: [10, 11, 14], fov: 42 }} dpr={[1, 1.5]}>
    <color attach="background" args={['#17152f']} />
    <fog attach="fog" args={['#17152f', 15, 31]} />
    <ambientLight intensity={1.1} />
    <directionalLight position={[5, 12, 7]} intensity={2.2} castShadow />
    <pointLight position={[-7, 5, 2]} color="#a58bff" intensity={22} />
    <Stars radius={55} depth={30} count={800} factor={3} fade speed={0.5} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
      <planeGeometry args={[30, 25]} />
      <meshStandardMaterial color="#272644" />
    </mesh>
    {Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[(i % 6) * 4.8 - 12, 0.02, Math.floor(i / 6) * 5.5 - 8]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.13, 8]} /><meshBasicMaterial color={i % 2 ? '#ffb15e' : '#9b83ed'} />
    </mesh>)}
    <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[2.4, 2.52, 64]} /><meshBasicMaterial color="#725da8" />
    </mesh>
    {places.map(p => <Tree key={p.id} place={p} unlocked={p.id === 0 || completed.includes(p.id - 1)} onSelect={onSelect} />)}
    <OrbitControls enablePan={false} minDistance={9} maxDistance={22} maxPolarAngle={Math.PI / 2.05} minPolarAngle={0.55} />
  </Canvas>
}

function App() {
  const [completed, setCompleted] = useState<number[]>(() => JSON.parse(localStorage.getItem('trick-tense-completed') || '[]'))
  const [candies, setCandies] = useState<number>(() => Number(localStorage.getItem('trick-tense-candies') || 0))
  const [active, setActive] = useState<number | null>(null)
  const [quizIndex, setQuizIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [feedback, setFeedback] = useState('')
  const [spinner, setSpinner] = useState('')
  const [talkIndex, setTalkIndex] = useState(0)
  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [survey, setSurvey] = useState('')
  const [name, setName] = useState('Little Reporter')
  const [actionDone, setActionDone] = useState(false)

  useEffect(() => { localStorage.setItem('trick-tense-completed', JSON.stringify(completed)); localStorage.setItem('trick-tense-candies', String(candies)) }, [completed, candies])
  const score = useMemo(() => answers.reduce((sum, a, i) => sum + (a === questions[i]?.answer ? 1 : 0), 0), [answers])
  const unlockedCount = Math.min(6, completed.length + 1)
  function finish(id: number, reward = 10) {
    if (!completed.includes(id)) { setCompleted(old => [...old, id]); setCandies(c => c + reward) }
    setActive(null); setFeedback(''); setActionDone(false)
  }
  function speak(text: string) { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(text)) } }
  function chooseAnswer(index: number) {
    if (answers.length > quizIndex) return
    const next = [...answers, index]; setAnswers(next)
    setFeedback(index === questions[quizIndex].answer ? 'Correct! Great work! 🍬' : `Not quite. ${questions[quizIndex].why}`)
  }
  function nextQuestion() { if (quizIndex < questions.length - 1) { setQuizIndex(i => i + 1); setFeedback('') } else { setFeedback(score >= 8 ? `Amazing! You scored ${score}/10. You passed!` : `You scored ${score}/10. Try again to reach 8/10.`) } }
  function resetQuiz() { setQuizIndex(0); setAnswers([]); setFeedback('') }
  const current = active === null ? null : places[active]
  return <main className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark">🎃</div><div><strong>TRICK OR TENSE</strong><small>HALLOWEEN ENGLISH ADVENTURE</small></div></div>
      <div className="top-stats"><span><CandyIcon /> {candies} candies</span><span><Star size={16} /> {completed.length}/6 quests</span></div>
    </header>
    <section className="hero-row">
      <div><div className="eyebrow"><Sparkles size={14} /> YEAR 3 • ENGLISH GRAMMAR</div><h1>Welcome to the<br /><em>Halloween Village!</em></h1><p>Explore, play and learn how to describe actions happening right now.</p></div>
      <div className="ghost-card"><div className="ghost-big">👻</div><div><b>Casper says...</b><p>“Ready, little learner? Complete each quest to collect sweet rewards!”</p></div></div>
    </section>
    <section className="game-layout">
      <div className="world-panel">
        <div className="world-heading"><span><Map size={17} /> YOUR ADVENTURE MAP</span><span className="map-hint">Drag to explore · Click a place to enter</span></div>
        <div className="world-canvas"><World completed={completed} onSelect={setActive} /></div>
        <div className="world-legend"><span>🟢 Available</span><span>🔒 Locked until previous quest</span><span>🍬 Complete quests to earn candies</span></div>
      </div>
      <aside className="side-panel">
        <div className="panel-title"><Gamepad2 size={18} /> QUEST JOURNEY</div>
        <div className="progress-track"><div style={{ width: `${completed.length / 6 * 100}%` }} /></div>
        <small className="muted">{completed.length} of 6 quests completed</small>
        {places.map(p => <button key={p.id} className={`quest-row ${completed.includes(p.id) ? 'done' : ''} ${p.id > 0 && !completed.includes(p.id - 1) ? 'disabled' : ''}`} onClick={() => (p.id === 0 || completed.includes(p.id - 1)) && setActive(p.id)} disabled={p.id > 0 && !completed.includes(p.id - 1)}>
          <span className="quest-icon">{p.icon}</span><span className="quest-copy"><b>{p.name}</b><small>{p.subtitle}</small></span>{completed.includes(p.id) ? <CheckCircle2 className="green" size={18} /> : p.id > 0 && !completed.includes(p.id - 1) ? <Lock size={16} /> : <ChevronRight size={18} />}
        </button>)}
        <div className="tip-card"><Ghost size={18} /><span><b>Learning tip</b><small>Remember: am / is / are + action-ing!</small></span></div>
      </aside>
    </section>
    <footer><span>Made for curious learners ✦ Present Continuous Tense</span><button onClick={() => { if (confirm('Reset all progress and candies?')) { setCompleted([]); setCandies(0); resetQuiz(); localStorage.clear() } }}><RotateCcw size={14} /> Reset progress</button></footer>

    {current && <div className="modal-backdrop" onClick={() => setActive(null)}><section className="activity-modal" onClick={e => e.stopPropagation()}>
      <button className="close-modal" onClick={() => setActive(null)}><X size={20} /></button>
      <div className="modal-kicker">QUEST {current.id + 1} OF 6</div><div className="modal-title"><span>{current.icon}</span><div><h2>{current.name}</h2><p>{current.subtitle}</p></div></div>
      {active === 0 && <div className="activity-content">
        <h3>🎵 Let's move and sing!</h3><p>Listen to the action words. Say each word and do the action.</p>
        <div className="action-grid">{actionWords.slice(0, 6).map(w => <button key={w} onClick={() => speak(w)}><span>{({ jumping: '🤸', dancing: '💃', reading: '📖', swimming: '🏊', singing: '🎤', sleeping: '😴' } as Record<string,string>)[w]}</span>{w}<Volume2 size={14} /></button>)}</div>
        <div className="callout">Try saying: “I am jumping!” or “I am dancing!”</div>
        <button className="primary-btn" onClick={() => finish(0)}>I sang and moved! <ArrowRight size={17} /></button>
      </div>}
      {active === 1 && <div className="activity-content">
        <h3>🪄 The present continuous spell</h3><p>We use the present continuous to talk about actions happening now.</p>
        <div className="formula"><span className="blue">WHO</span><b>+</b><span className="yellow">am / is / are</span><b>+</b><span className="red">VERB-ing</span></div>
        <div className="sentence-examples">{sentences.map(s => <div key={s}><span>{s}</span><button onClick={() => speak(s)} aria-label={`Listen to ${s}`}><Volume2 size={16} /></button></div>)}</div>
        <div className="callout"><b>Remember:</b> I am · He/She/It is · You/We/They are</div>
        <button className="primary-btn" onClick={() => finish(1)}>I know the grammar! <ArrowRight size={17} /></button>
      </div>}
      {active === 2 && <div className="activity-content">
        <h3>🎡 Spin the action wheel!</h3><p>Spin, mime the action and say a complete sentence.</p>
        <div className="spinner-display">{spinner || '🎃'}</div><button className="primary-btn" onClick={() => { setSpinner(actionWords[Math.floor(Math.random() * actionWords.length)]); setActionDone(false) }}>SPIN THE WHEEL</button>
        {spinner && <div className="callout">Mime <b>{spinner}</b> and say: “I am {spinner}!”</div>}
        {spinner && <button className="secondary-btn" onClick={() => finish(2)}>I described the action</button>}
      </div>}
      {active === 3 && <div className="activity-content">
        <h3>🍭 Partner talk time</h3><p>Take turns asking and answering. Read the model dialogue aloud.</p>
        <div className="dialogue-card"><div><b>👧 A:</b> What is he doing?</div><div><b>🧒 B:</b> He is {['jumping', 'reading', 'dancing', 'swimming'][talkIndex]}.</div></div>
        <button className="secondary-btn" onClick={() => setTalkIndex(i => (i + 1) % 4)}>Next action card <ArrowRight size={16} /></button>
        <button className="primary-btn" onClick={() => finish(3)}>We practised together! <ArrowRight size={17} /></button>
      </div>}
      {active === 4 && <div className="activity-content">
        <h3>🏰 Monster Castle Challenge</h3><p>Answer 10 questions. Score at least 8/10 to pass.</p>
        {answers.length < 10 ? <><div className="quiz-progress">QUESTION {quizIndex + 1} / 10 <span>{answers.length} answered</span></div><h4 className="question">{questions[quizIndex].q}</h4><div className="answer-list">{questions[quizIndex].options.map((o, i) => <button key={o} className={answers.length > quizIndex && answers[quizIndex] === i ? 'selected' : ''} disabled={answers.length > quizIndex} onClick={() => chooseAnswer(i)}>{String.fromCharCode(65 + i)}. {o}</button>)}</div>{feedback && <div className="feedback">{feedback}<button onClick={nextQuestion}>{quizIndex === 9 ? 'See result' : 'Next question'} <ArrowRight size={15} /></button></div>}</> : <div className="result-box"><div className="result-score">{score}/10</div><h3>{score >= 8 ? 'Castle cleared! 🎉' : 'Keep practising! 💜'}</h3><p>{score >= 8 ? 'You have mastered the grammar challenge.' : 'Try again and aim for 8 correct answers.'}</p><button className="primary-btn" onClick={() => score >= 8 ? finish(4, 20) : resetQuiz()}>{score >= 8 ? 'Collect my reward' : 'Try again'}</button></div>}
      </div>}
      {active === 5 && <div className="activity-content">
        <h3>📺 You are the news reporter!</h3><p>Describe three actions happening on your screen. Use “He/She is + verb-ing”.</p>
        <label className="field-label">Reporter name</label><input className="text-input" value={name} onChange={e => setName(e.target.value)} />
        <div className="news-scenes">{['👻 A ghost is dancing.', '🧙 A witch is flying.', '🧛 A vampire is reading.'].map(s => <div key={s}>{s}</div>)}</div>
        <div className="callout">Start your report: “Good morning! I am {name || 'a reporter'}. Look! The ghost is dancing...”</div>
        <button className="secondary-btn" onClick={() => speak(`Good morning! I am ${name}. Look! The ghost is dancing. The witch is flying. The vampire is reading.`)}><Volume2 size={16} /> Listen to model report</button>
        <button className="secondary-btn" onClick={() => { setRecording(!recording); setRecorded(true) }}>{recording ? <MicOff size={16} /> : <Mic size={16} />}{recording ? 'Stop practice' : 'Start speaking practice'}</button>
        {recorded && <p className="muted">Speaking practice selected. Use your device microphone or practise aloud with a teacher.</p>}
        <label className="field-label">How did you feel about this lesson?</label><select className="text-input" value={survey} onChange={e => setSurvey(e.target.value)}><option value="">Choose one...</option><option>It was fun and easy!</option><option>I learned something new.</option><option>I need more practice.</option></select>
        <button className="primary-btn" disabled={!survey} onClick={() => finish(5, 20)}>Submit my report <ArrowRight size={17} /></button>
      </div>}
    </section></div>}
  </main>
}

function CandyIcon() { return <span aria-hidden="true">🍬</span> }
export default App
