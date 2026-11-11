import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, Html, OrbitControls, Stars } from '@react-three/drei'
import { CheckCircle2, ChevronRight, Lock, Map, Mic, RotateCcw, Sparkles, Star, Volume2, X } from 'lucide-react'
import * as THREE from 'three'

type Place = { id:number; name:string; subtitle:string; emoji:string; x:number; z:number; color:string; kind:string }
const places:Place[] = [
 {id:0,name:'Pumpkin Patch',subtitle:'Listen, sing & move',emoji:'🎃',x:-8,z:4,color:'#ff9b48',kind:'patch'},
 {id:1,name:'Haunted House',subtitle:'Discover the grammar',emoji:'🏚️',x:-5,z:-3,color:'#a78bfa',kind:'house'},
 {id:2,name:"Witch's Carnival",subtitle:'Spin, mime & describe',emoji:'🎪',x:0,z:4,color:'#f18bbd',kind:'carnival'},
 {id:3,name:'Candy Forest',subtitle:'Talk with a partner',emoji:'🍭',x:5,z:-3,color:'#71d3ad',kind:'forest'},
 {id:4,name:'Monster Castle',subtitle:'Take the 10-question quiz',emoji:'🏰',x:9,z:4,color:'#9caefb',kind:'castle'},
 {id:5,name:'News Studio',subtitle:'Become a TV reporter',emoji:'📺',x:2,z:-9,color:'#f2c86e',kind:'studio'}
]
const questions = [
 {q:'Look! He _____ football.',o:['play','is playing','are playing'],a:1,e:'He + is + verb-ing: He is playing football.'},
 {q:'She is _____ a book.',o:['read','reading','reads'],a:1,e:'After is, add -ing: reading.'},
 {q:'They _____ dancing.',o:['is','am','are'],a:2,e:'Use are with they.'},
 {q:'What is the girl doing? She is _____.',o:['run','running','runs'],a:1,e:'Running describes an action happening now.'},
 {q:'I _____ eating an apple.',o:['am','is','are'],a:0,e:'Use am with I.'},
 {q:'The boys are _____.',o:['swim','swimming','swims'],a:1,e:'Are + swimming.'},
 {q:'Choose the correct sentence.',o:['He is jump.','He jumping.','He is jumping.'],a:2,e:'Subject + is + verb-ing.'},
 {q:'Mum is _____ dinner.',o:['cook','cooking','cooks'],a:1,e:'Cooking is the -ing form.'},
 {q:'What are they doing? They _____ singing.',o:['am','is','are'],a:2,e:'Use are with they.'},
 {q:'The cat is _____.',o:['sleeping','sleep','sleeps'],a:0,e:'Is + sleeping.'}
]
const actions=['jumping','dancing','reading','swimming','singing','sleeping','running','painting']

function House({p}:{p:Place}) {
 const c=p.color
 return <group position={[p.x,0,p.z]}>
   {p.kind==='patch' && <>{Array.from({length:7},(_,i)=><group key={i} position={[(i%3-1)*1.15,0,Math.floor(i/3)*1.1-0.6]}><mesh position={[0,.45,0]} castShadow><sphereGeometry args={[.43,12,10]}/><meshStandardMaterial color="#f58a32"/></mesh><mesh position={[0,.9,0]}><cylinderGeometry args={[.07,.1,.22,6]}/><meshStandardMaterial color="#477b42"/></mesh></group>)}</>}
   {p.kind==='house' && <><mesh position={[0,1.35,0]} castShadow><boxGeometry args={[2.6,2.4,2.2]}/><meshStandardMaterial color="#6b5a91"/></mesh><mesh position={[0,2.9,0]} castShadow><coneGeometry args={[1.9,1.5,4]}/><meshStandardMaterial color="#44395f"/></mesh><mesh position={[0,.65,1.12]}><boxGeometry args={[.55,1.3,.08]}/><meshStandardMaterial color="#302747"/></mesh>{[-.7,.7].map(x=><mesh key={x} position={[x,1.65,1.14]}><boxGeometry args={[.42,.5,.08]}/><meshStandardMaterial color="#ffd36f" emissive="#ffb84d" emissiveIntensity={.6}/></mesh>)}</>}
   {p.kind==='carnival' && <><mesh position={[0,1.5,0]}><cylinderGeometry args={[1.5,1.5,2.1,24,1,true]}/><meshStandardMaterial color="#f2a0c6" side={THREE.DoubleSide}/></mesh><mesh position={[0,2.7,0]}><coneGeometry args={[1.65,1.4,24]}/><meshStandardMaterial color="#a88af0"/></mesh><mesh position={[0,.55,0]}><cylinderGeometry args={[1.65,1.65,.2,24]}/><meshStandardMaterial color="#ffd27c"/></mesh></>}
   {p.kind==='forest' && <>{[-1,0,1].map((x,i)=><group key={x} position={[x*1.05,0,(i%2)*.65]}><mesh position={[0,.8,0]}><cylinderGeometry args={[.13,.18,1.6,7]}/><meshStandardMaterial color="#75533f"/></mesh><mesh position={[0,1.9,0]}><coneGeometry args={[.85,2,8]}/><meshStandardMaterial color={i%2?'#56ad89':'#76c99b'}/></mesh></group>)}</>}
   {p.kind==='castle' && <><mesh position={[0,1.2,0]}><boxGeometry args={[3.1,2.3,2.2]}/><meshStandardMaterial color="#7773a8"/></mesh>{[-1.2,1.2].map(x=><group key={x} position={[x,1.8,0]}><mesh position={[0,.8,0]}><cylinderGeometry args={[.48,.55,3.3,8]}/><meshStandardMaterial color="#9a91d1"/></mesh><mesh position={[0,2.7,0]}><coneGeometry args={[.65,1.2,8]}/><meshStandardMaterial color="#ed8ab6"/></mesh></group>)}<mesh position={[0,.6,1.13]}><boxGeometry args={[.7,1.2,.08]}/><meshStandardMaterial color="#372b55"/></mesh></>}
   {p.kind==='studio' && <><mesh position={[0,1.1,0]}><boxGeometry args={[3.1,2.1,2.2]}/><meshStandardMaterial color="#6b6698"/></mesh><mesh position={[0,2.35,0]}><boxGeometry args={[3.35,.35,2.4]}/><meshStandardMaterial color="#f4c86f"/></mesh><mesh position={[0,1.3,1.14]}><boxGeometry args={[1.8,1.1,.08]}/><meshStandardMaterial color="#7ed8d1" emissive="#5bbfb5" emissiveIntensity={.4}/></mesh></>}
   <Html position={[0,3.55,0]} center distanceFactor={11}><div className="place-tag">{p.emoji} {p.name}</div></Html>
 </group>
}
function Avatar({position}:{position:[number,number,number]}) {
 return <group position={position}>
  <mesh position={[0,.7,0]} castShadow><capsuleGeometry args={[.36,.65,4,8]}/><meshStandardMaterial color="#f6f0ff"/></mesh>
  <mesh position={[0,1.22,0]}><sphereGeometry args={[.36,16,12]}/><meshStandardMaterial color="#fff8ff"/></mesh>
  <mesh position={[-.13,1.27,.31]}><sphereGeometry args={[.045,8,8]}/><meshBasicMaterial color="#34254b"/></mesh><mesh position={[.13,1.27,.31]}><sphereGeometry args={[.045,8,8]}/><meshBasicMaterial color="#34254b"/></mesh>
  <mesh position={[0,1.02,.33]}><sphereGeometry args={[.07,8,8]}/><meshBasicMaterial color="#ee83a7"/></mesh>
  <mesh position={[0,1.62,0]}><coneGeometry args={[.45,.65,8]}/><meshStandardMaterial color="#9b78e8"/></mesh>
 </group>
}
function World({completed,onSelect}:{completed:number[];onSelect:(id:number)=>void}) {
 const [pos,setPos]=useState<[number,number,number]>([-10,0,6])
 useEffect(()=>{const fn=(e:KeyboardEvent)=>{const d=.55;setPos(p=>[THREE.MathUtils.clamp(p[0]+(e.key==='ArrowRight'||e.key==='d'?d:e.key==='ArrowLeft'||e.key==='a'?-d:0),-12,12),0,THREE.MathUtils.clamp(p[2]+(e.key==='ArrowDown'||e.key==='s'?d:e.key==='ArrowUp'||e.key==='w'?-d:0),-11,9)])};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[])
 const roadPoints=useMemo(()=>[new THREE.Vector3(-10,.04,6),new THREE.Vector3(-8,.04,1),new THREE.Vector3(-5,.04,-3),new THREE.Vector3(-2,.04,1),new THREE.Vector3(0,.04,4),new THREE.Vector3(3,.04,0),new THREE.Vector3(5,.04,-3),new THREE.Vector3(8,.04,0),new THREE.Vector3(9,.04,4),new THREE.Vector3(6,.04,7),new THREE.Vector3(2,.04,5),new THREE.Vector3(2,.04,-9)],[])
 const road=new THREE.CatmullRomCurve3(roadPoints)
 return <Canvas shadows camera={{position:[15,18,20],fov:42}} dpr={[1,1.5]}>
  <color attach="background" args={['#b9a9e8']}/><fog attach="fog" args={['#b9a9e8',25,48]}/>
  <ambientLight intensity={1.7}/><directionalLight position={[8,15,8]} intensity={2.3} castShadow/><pointLight position={[-8,7,-5]} color="#ffd17a" intensity={30}/>
  <Stars radius={80} depth={35} count={500} factor={2} fade/>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.12,0]} receiveShadow><planeGeometry args={[34,30]}/><meshStandardMaterial color="#789d82"/></mesh>
  <mesh position={[0,-.04,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[14,48]}/><meshStandardMaterial color="#8bb38b"/></mesh>
  <mesh><tubeGeometry args={[road,180,.55,10,false]}/><meshStandardMaterial color="#d9c4a4"/></mesh>
  {Array.from({length:35},(_,i)=><mesh key={i} position={[(i*7%27)-13,.12,(i*11%23)-11]}><sphereGeometry args={[.15+(i%3)*.05,8,8]}/><meshStandardMaterial color={['#ffb45f','#f7d9a0','#a88ae8'][i%3]}/></mesh>)}
  {places.map(p=><group key={p.id} onClick={()=>{if(p.id===0||completed.includes(p.id-1))onSelect(p.id)}}><House p={p}/></group>)}
  <Avatar position={pos}/>
  <OrbitControls enablePan={false} minDistance={17} maxDistance={31} maxPolarAngle={Math.PI/2.15} minPolarAngle={.45}/>
 </Canvas>
}
export default function App(){
 const [completed,setCompleted]=useState<number[]>(()=>JSON.parse(localStorage.getItem('tt-done')||'[]'))
 const [candies,setCandies]=useState(()=>Number(localStorage.getItem('tt-candy')||0))
 const [active,setActive]=useState<number|null>(null)
 const [spin,setSpin]=useState('');const [qIndex,setQIndex]=useState(0);const [answers,setAnswers]=useState<number[]>([]);const [feedback,setFeedback]=useState('');const [survey,setSurvey]=useState('')
 useEffect(()=>{localStorage.setItem('tt-done',JSON.stringify(completed));localStorage.setItem('tt-candy',String(candies))},[completed,candies])
 const score=answers.filter((a,i)=>a===questions[i]?.a).length
 function finish(id:number,reward=10){if(!completed.includes(id)){setCompleted(v=>[...v,id]);setCandies(v=>v+reward)}setActive(null)}
 function say(t:string){if('speechSynthesis'in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(t))}}
 function answer(i:number){if(answers.length>qIndex)return;setAnswers(v=>[...v,i]);setFeedback(i===questions[qIndex].a?'Correct! You earned a spooky smile! 🍬':questions[qIndex].e)}
 const p=active===null?null:places[active]
 return <main className="app">
  <header className="nav"><div className="logo">🎃 <span>TRICK OR TENSE</span></div><div className="nav-right">🍬 {candies} candies　 ✨ {completed.length}/6 quests</div></header>
  <section className="welcome"><div><div className="eyebrow"><Sparkles size={14}/> A MAGICAL ENGLISH ADVENTURE</div><h1>Explore the <em>Halloween Village!</em></h1><p>Walk the candy trail, meet friendly monsters and learn to describe actions happening now.</p></div><div className="guide"><span>👻</span><div><b>Casper the Guide</b><small>Use W A S D or arrow keys to explore. Click an unlocked place to begin!</small></div></div></section>
  <section className="layout"><div className="map-card"><div className="map-head"><b><Map size={17}/> THE VILLAGE MAP</b><span>Drag to look around · Use W A S D to move</span></div><div className="world"><World completed={completed} onSelect={setActive}/></div><div className="map-foot">🎃 Pumpkin Patch　 🏚️ Haunted House　 🎪 Carnival　 🍭 Candy Forest　 🏰 Castle　 📺 Studio</div></div>
  <aside className="quests"><h2>✨ Your adventure</h2><div className="progress"><span style={{width:`${completed.length/6*100}%`}}/></div><small>{completed.length} of 6 adventures complete</small>{places.map(p=><button className="quest" key={p.id} disabled={p.id>0&&!completed.includes(p.id-1)} onClick={()=>setActive(p.id)}><span>{p.emoji}</span><div><b>{p.name}</b><small>{p.subtitle}</small></div>{completed.includes(p.id)?<CheckCircle2 color="#70d6a4"/>:p.id>0&&!completed.includes(p.id-1)?<Lock size={16}/>:<ChevronRight size={18}/>}</button>)}<div className="tip">💡 Remember: <b>am / is / are + action-ing!</b></div></aside></section>
  <footer>Made for Year 3 English learners · Present Continuous Tense <button onClick={()=>{if(confirm('Reset all your progress?')){setCompleted([]);setCandies(0);localStorage.removeItem('tt-done');localStorage.removeItem('tt-candy')}}}><RotateCcw size={13}/> Reset progress</button></footer>
  {p&&<div className="overlay" onClick={()=>setActive(null)}><section className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setActive(null)}><X/></button><div className="modal-eyebrow">ADVENTURE {p.id+1} OF 6</div><h2>{p.emoji} {p.name}</h2><p>{p.subtitle}</p>
   {active===0&&<><h3>🎵 Listen, sing and move!</h3><p>Say each action word and show it with your body.</p><div className="word-grid">{actions.map(w=><button onClick={()=>say(w)} key={w}>{w} <Volume2 size={14}/></button>)}</div><div className="note">Try: “I am jumping!” · “I am dancing!”</div><button className="primary" onClick={()=>finish(0)}>I sang and moved! 🍬</button></>}
   {active===1&&<><h3>🪄 Learn the grammar spell</h3><p>We use the present continuous for actions happening now.</p><div className="formula"><span>WHO</span> + <span>am / is / are</span> + <span>VERB-ing</span></div><div className="examples">{['He is jumping.','She is reading.','They are dancing.','The cat is sleeping.'].map(s=><button key={s} onClick={()=>say(s)}>{s} <Volume2 size={14}/></button>)}</div><div className="note">I am · He/She/It is · You/We/They are</div><button className="primary" onClick={()=>finish(1)}>I learned the grammar! 🍬</button></>}
   {active===2&&<><h3>🎡 Spin the action wheel</h3><p>Mime the action and say a full sentence.</p><div className="wheel">{spin||'🎃'}</div><button className="primary" onClick={()=>setSpin(actions[Math.floor(Math.random()*actions.length)])}>SPIN THE WHEEL</button>{spin&&<><div className="note">Mime <b>{spin}</b> and say “I am {spin}!”</div><button className="secondary" onClick={()=>finish(2)}>I described it!</button></>}</>}
   {active===3&&<><h3>🍭 Partner talk</h3><div className="dialogue"><b>👧 A: What is he doing?</b><b>🧒 B: He is jumping.</b><small>Take turns asking and answering with your partner. Try changing the action word.</small></div><button className="primary" onClick={()=>finish(3)}>We practised together! 🍬</button></>}
   {active===4&&<><h3>🏰 Monster Castle Quiz</h3><p>Answer all 10 questions. You need 8/10 to pass.</p>{answers.length<10?<><div className="qcount">QUESTION {qIndex+1} / 10</div><h3>{questions[qIndex].q}</h3><div className="options">{questions[qIndex].o.map((o,i)=><button disabled={answers.length>qIndex} onClick={()=>answer(i)} key={o}>{String.fromCharCode(65+i)}. {o}</button>)}</div>{feedback&&<div className="note">{feedback}<button className="text-btn" onClick={()=>{setQIndex(v=>v+1);setFeedback('')}}>{qIndex===9?'Finish':'Next question'} →</button></div>}</>:<div className="result"><strong>{score}/10</strong><p>{score>=8?'You passed! The castle gates are open!':'Keep practising and try again!'}</p><button className="primary" onClick={()=>{if(score>=8)finish(4,20);else{setAnswers([]);setQIndex(0);setFeedback('')}}}>{score>=8?'Collect reward':'Try again'}</button></div>}</>}
   {active===5&&<><h3>📺 Become a TV reporter!</h3><p>Describe these three actions using He/She is + verb-ing.</p><div className="scenes"><span>👻 A ghost is dancing.</span><span>🧙 A witch is flying.</span><span>🧛 A vampire is reading.</span></div><button className="secondary" onClick={()=>say('Good morning! The ghost is dancing. The witch is flying. The vampire is reading.')}> <Mic size={16}/> Listen to model report</button><label>How did you feel about this lesson?</label><select value={survey} onChange={e=>setSurvey(e.target.value)}><option value="">Choose one...</option><option>It was fun and easy!</option><option>I learned something new.</option><option>I need more practice.</option></select><button className="primary" disabled={!survey} onClick={()=>finish(5,20)}>Submit my report 🍬</button></>}
  </section></div>}
 </main>
}
