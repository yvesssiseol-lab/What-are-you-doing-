import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Html, OrbitControls, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { CheckCircle2, ChevronRight, Lock, Map, RotateCcw, Sparkles as Shine, Volume2, X } from 'lucide-react'

type Place={id:number;name:string;subtitle:string;emoji:string;pos:[number,number,number];color:string;kind:string}
const places:Place[]=[
{id:0,name:'Pumpkin Patch',subtitle:'Listen, sing & move',emoji:'🎃',pos:[-8,0,5],color:'#ff9b45',kind:'patch'},
{id:1,name:'Haunted House',subtitle:'Discover the grammar',emoji:'🏚️',pos:[-5,0,-3],color:'#8d78c8',kind:'house'},
{id:2,name:"Witch's Carnival",subtitle:'Spin, mime & describe',emoji:'🎪',pos:[0,0,5],color:'#ed8ebc',kind:'carnival'},
{id:3,name:'Candy Forest',subtitle:'Talk with a partner',emoji:'🍭',pos:[5,0,-3],color:'#65b88c',kind:'forest'},
{id:4,name:'Monster Castle',subtitle:'Take the 10-question quiz',emoji:'🏰',pos:[9,0,5],color:'#8c91ce',kind:'castle'},
{id:5,name:'News Studio',subtitle:'Become a TV reporter',emoji:'📺',pos:[3,0,-9],color:'#e9b95d',kind:'studio'}
]
const questions=[
{q:'Look! He _____ football.',o:['play','is playing','are playing'],a:1,e:'He + is + verb-ing: He is playing football.'},
{q:'She is _____ a book.',o:['read','reading','reads'],a:1,e:'After is, add -ing: reading.'},
{q:'They _____ dancing.',o:['is','am','are'],a:2,e:'Use are with they.'},
{q:'The girl is _____.',o:['run','running','runs'],a:1,e:'Running describes an action happening now.'},
{q:'I _____ eating an apple.',o:['am','is','are'],a:0,e:'Use am with I.'},
{q:'The boys are _____.',o:['swim','swimming','swims'],a:1,e:'Are + swimming.'},
{q:'Choose the correct sentence.',o:['He is jump.','He jumping.','He is jumping.'],a:2,e:'Subject + is + verb-ing.'},
{q:'Mum is _____ dinner.',o:['cook','cooking','cooks'],a:1,e:'Cooking is the -ing form.'},
{q:'They _____ singing.',o:['am','is','are'],a:2,e:'Use are with they.'},
{q:'The cat is _____.',o:['sleeping','sleep','sleeps'],a:0,e:'Is + sleeping.'}
]
const actions=['jumping','dancing','reading','swimming','singing','sleeping','running','painting']
const routePoints:THREE.Vector3[]=[new THREE.Vector3(-11,0.35,8),new THREE.Vector3(-9,0.35,6),new THREE.Vector3(-8,0.35,5),new THREE.Vector3(-6,0.35,0),new THREE.Vector3(-5,0.35,-3),new THREE.Vector3(-2,0.35,0),new THREE.Vector3(0,0.35,5),new THREE.Vector3(3,0.35,0),new THREE.Vector3(5,0.35,-3),new THREE.Vector3(8,0.35,0),new THREE.Vector3(9,0.35,5),new THREE.Vector3(6,0.35,7),new THREE.Vector3(3,0.35,3),new THREE.Vector3(3,0.35,-9)]
const route=new THREE.CatmullRomCurve3(routePoints)
const targets=[route.getPoint(.12),route.getPoint(.29),route.getPoint(.47),route.getPoint(.65),route.getPoint(.83),route.getPoint(1)]

function Building({p,available,onChoose}:{p:Place;available:boolean;onChoose:()=>void}){
 const base=p.pos
 return <group position={base} onClick={e=>{e.stopPropagation();if(available)onChoose()}}>
  <mesh position={[0,.12,0]} receiveShadow><cylinderGeometry args={[2.1,2.25,.3,12]}/><meshStandardMaterial color="#d6c09c"/></mesh>
  {p.kind==='patch'&&<>{Array.from({length:7},(_,i)=><group key={i} position={[(i%3-1)*.85,.5,Math.floor(i/3)*.8-.4]}><mesh castShadow><sphereGeometry args={[.42,16,12]}/><meshStandardMaterial color="#f58c35"/></mesh><mesh position={[0,.4,0]}><cylinderGeometry args={[.06,.09,.2,6]}/><meshStandardMaterial color="#477e45"/></mesh></group>)}</>}
  {p.kind==='house'&&<><mesh position={[0,1.2,0]} castShadow><boxGeometry args={[2.3,2.1,2]}/><meshStandardMaterial color="#76628f"/></mesh><mesh position={[0,2.55,0]} castShadow><coneGeometry args={[1.8,1.35,4]}/><meshStandardMaterial color="#493d69"/></mesh><mesh position={[0,.65,1.03]}><boxGeometry args={[.55,1.25,.08]}/><meshStandardMaterial color="#302543"/></mesh>{[-.65,.65].map(x=><mesh key={x} position={[x,1.45,1.04]}><boxGeometry args={[.4,.45,.08]}/><meshStandardMaterial color="#ffd477" emissive="#ffbf54" emissiveIntensity={.5}/></mesh>)}</>}
  {p.kind==='carnival'&&<><mesh position={[0,1.1,0]}><cylinderGeometry args={[1.45,1.45,1.6,24,1,true]}/><meshStandardMaterial color="#f3a1c6" side={THREE.DoubleSide}/></mesh><mesh position={[0,2.25,0]}><coneGeometry args={[1.6,1.25,24]}/><meshStandardMaterial color="#9e80db"/></mesh></>}
  {p.kind==='forest'&&[-1,0,1].map((x,i)=><group key={x} position={[x*.95,0,(i%2)*.5]}><mesh position={[0,.65,0]}><cylinderGeometry args={[.12,.2,1.3,7]}/><meshStandardMaterial color="#79553d"/></mesh><mesh position={[0,1.65,0]}><coneGeometry args={[.8,1.8,8]}/><meshStandardMaterial color={i%2?'#4eaa80':'#7ac58b'}/></mesh></group>)}
  {p.kind==='castle'&&<><mesh position={[0,1,0]} castShadow><boxGeometry args={[2.8,2,2]}/><meshStandardMaterial color="#8885b9"/></mesh>{[-1,1].map(x=><group key={x} position={[x*1.05,1.4,0]}><mesh position={[0,.65,0]}><cylinderGeometry args={[.43,.5,2.8,8]}/><meshStandardMaterial color="#a29bd2"/></mesh><mesh position={[0,2.1,0]}><coneGeometry args={[.58,1,8]}/><meshStandardMaterial color="#ec91b8"/></mesh></group>)}</>}
  {p.kind==='studio'&&<><mesh position={[0,1,0]}><boxGeometry args={[2.8,1.9,2]}/><meshStandardMaterial color="#7770a2"/></mesh><mesh position={[0,2.05,0]}><boxGeometry args={[3,.3,2.2]}/><meshStandardMaterial color="#f1c96e"/></mesh><mesh position={[0,1.1,1.02]}><boxGeometry args={[1.7,1,.08]}/><meshStandardMaterial color="#75d1c6" emissive="#53b8aa" emissiveIntensity={.4}/></mesh></>}
  <Html position={[0,3.1,0]} center distanceFactor={12}><button className={`world-label ${available?'':'locked'}`} onClick={e=>{e.stopPropagation();if(available)onChoose()}}>{available?'🦇':'🔒'} {p.name}</button></Html>
  {available&&<Float speed={2} floatIntensity={.2}><mesh position={[0,3.8,0]}><sphereGeometry args={[.18,12,12]}/><meshBasicMaterial color="#b78cff"/></mesh></Float>}
 </group>
}
function Player({target}:{target:number|null}){
 const ref=useRef<THREE.Group>(null);const progress=useRef(0);const start=useRef(new THREE.Vector3(-11,.5,8));const [unused]=useState(0);void unused
 useEffect(()=>{if(target!==null&&ref.current){start.current.copy(ref.current.position);progress.current=0}},[target])
 useFrame((_,delta)=>{if(!ref.current||target===null)return;progress.current=Math.min(1,progress.current+delta*.22);const point=route.getPointAt(THREE.MathUtils.lerp(Math.max(0,target===0?0:targets[Math.max(0,target-1)].distanceTo(route.getPointAt(0))/route.getLength()),target===0?.12:(target+1)/7,progress.current));const destination=targets[target];ref.current.position.lerp(destination,Math.min(1,delta*1.5));ref.current.position.y=.45+Math.abs(Math.sin(progress.current*30))*.08;ref.current.rotation.y=Math.sin(progress.current*20)*.08;void point})
 return <group ref={ref} position={[-11,.5,8]}>
  <mesh position={[0,.55,0]} castShadow><capsuleGeometry args={[.32,.5,4,8]}/><meshStandardMaterial color="#fff4ff"/></mesh>
  <mesh position={[0,1.08,0]}><sphereGeometry args={[.32,16,12]}/><meshStandardMaterial color="#fff8ff"/></mesh>
  <mesh position={[0,1.42,0]}><coneGeometry args={[.4,.65,8]}/><meshStandardMaterial color="#956ed2"/></mesh>
  <mesh position={[-.11,1.12,.28]}><sphereGeometry args={[.04,8,8]}/><meshBasicMaterial color="#322344"/></mesh><mesh position={[.11,1.12,.28]}><sphereGeometry args={[.04,8,8]}/><meshBasicMaterial color="#322344"/></mesh>
 </group>
}
function World({completed,onChoose,target}:{completed:number[];onChoose:(i:number)=>void;target:number|null}){
 const roadGeo=useMemo(()=>new THREE.TubeGeometry(route,180,.48,10,false),[])
 return <Canvas shadows camera={{position:[15,20,22],fov:39}} dpr={[1,1.5]}>
  <color attach="background" args={['#c9b8ed']}/><fog attach="fog" args={['#c9b8ed',28,55]}/>
  <ambientLight intensity={1.8}/><directionalLight position={[8,18,9]} intensity={2.2} castShadow/><pointLight position={[-8,7,2]} color="#ffc77a" intensity={25}/>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.35,0]} receiveShadow><circleGeometry args={[16,64]}/><meshStandardMaterial color="#78aa83"/></mesh>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.48,0]}><cylinderGeometry args={[16,16,.6,64]}/><meshStandardMaterial color="#8b6bb4"/></mesh>
  <mesh geometry={roadGeo}><meshStandardMaterial color="#e8d0a6" roughness={1}/></mesh>
  <mesh geometry={new THREE.TubeGeometry(route,180,.12,8,false)} position={[0,.12,0]}><meshStandardMaterial color="#fff0c8"/></mesh>
  <Sparkles count={100} scale={[28,5,25]} size={3} speed={.3} color="#fff0a8"/>
  {Array.from({length:35},(_,i)=><group key={i} position={[(i*13%29)-14,.1,(i*17%25)-12]}><mesh><sphereGeometry args={[.32+(i%3)*.12,8,8]}/><meshStandardMaterial color={['#4d9d76','#69b88b','#e8a6c8'][i%3]}/></mesh></group>)}
  {places.map(p=><Building key={p.id} p={p} available={p.id===0||completed.includes(p.id-1)} onChoose={()=>onChoose(p.id)}/>)}
  <Player target={target}/>
  <OrbitControls enablePan={false} minDistance={19} maxDistance={30} maxPolarAngle={Math.PI/2.15} minPolarAngle={.55}/>
 </Canvas>
}
export default function App(){
 const [completed,setCompleted]=useState<number[]>(()=>JSON.parse(localStorage.getItem('tt3-done')||'[]'))
 const [candies,setCandies]=useState(()=>Number(localStorage.getItem('tt3-candy')||0))
 const [active,setActive]=useState<number|null>(null),[moving,setMoving]=useState<number|null>(null)
 const [spin,setSpin]=useState(''),[q,setQ]=useState(0),[answers,setAnswers]=useState<number[]>([]),[feedback,setFeedback]=useState(''),[survey,setSurvey]=useState('')
 useEffect(()=>{localStorage.setItem('tt3-done',JSON.stringify(completed));localStorage.setItem('tt3-candy',String(candies))},[completed,candies])
 const score=answers.filter((a,i)=>a===questions[i]?.a).length
 function travel(id:number){setMoving(id);window.setTimeout(()=>{setActive(id);setMoving(null)},3300)}
 function finish(id:number,reward=10){if(!completed.includes(id)){setCompleted(v=>[...v,id]);setCandies(v=>v+reward)}setActive(null)}
 function say(s:string){if('speechSynthesis'in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(s))}}
 function answer(i:number){if(answers.length>q)return;setAnswers(v=>[...v,i]);setFeedback(i===questions[q].a?'Correct! Great work! 🍬':questions[q].e)}
 return <main className="app">
  <header className="nav"><div className="brand">🎃 <span>TRICK OR TENSE</span></div><div className="stats">🍬 {candies} candies　 ⭐ {completed.length}/6 quests</div></header>
  <section className="intro"><div><small>✨ A MAGICAL YEAR 3 ENGLISH ADVENTURE</small><h1>Explore the <em>Halloween Kingdom!</em></h1><p>Choose a flying bat to guide your little adventurer along the winding trail.</p></div><div className="guide">👻 <span><b>Casper says...</b><small>Click a purple bat to travel to your next quest!</small></span></div></section>
  <section className="layout"><div className="map-card"><div className="map-title"><b><Map size={17}/> YOUR ADVENTURE WORLD</b><span>Drag to explore · Click a bat to travel</span></div><div className="world"><World completed={completed} onChoose={travel} target={moving}/></div><div className="legend">🦇 Available quest　 🔒 Locked quest　 🍬 Collect rewards as you learn</div></div>
  <aside className="quests"><h2>🗺️ Quest trail</h2><div className="progress"><span style={{width:`${completed.length/6*100}%`}}/></div><small>{completed.length} of 6 quests complete</small>{places.map(p=><button className="quest" key={p.id} disabled={p.id>0&&!completed.includes(p.id-1)} onClick={()=>travel(p.id)}><span>{p.emoji}</span><div><b>{p.name}</b><small>{p.subtitle}</small></div>{completed.includes(p.id)?<CheckCircle2 color="#56ad80"/>:p.id>0&&!completed.includes(p.id-1)?<Lock size={15}/>:<ChevronRight size={18}/>}</button>)}<div className="tip">💡 Grammar spell: <b>Who + am/is/are + verb-ing</b></div></aside></section>
  <footer>Designed for Year 3 English · Present Continuous Tense <button onClick={()=>{if(confirm('Reset progress?')){setCompleted([]);setCandies(0);localStorage.removeItem('tt3-done');localStorage.removeItem('tt3-candy')}}}><RotateCcw size={13}/> Reset</button></footer>
  {active!==null&&<div className="overlay" onClick={()=>setActive(null)}><section className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setActive(null)}><X/></button><small className="kicker">QUEST {active+1} OF 6</small><h2>{places[active].emoji} {places[active].name}</h2><p>{places[active].subtitle}</p>
   {active===0&&<><h3>🎵 Listen, sing and move!</h3><p>Say each action word and show it with your body.</p><div className="words">{actions.map(w=><button key={w} onClick={()=>say(w)}>{w}<Volume2 size={14}/></button>)}</div><div className="note">Try saying: “I am jumping!” or “I am dancing!”</div><button className="primary" onClick={()=>finish(0)}>I sang and moved! 🍬</button></>}
   {active===1&&<><h3>🪄 The present continuous spell</h3><p>We use this tense for actions happening now.</p><div className="formula"><span>WHO</span> + <span>am / is / are</span> + <span>VERB-ing</span></div>{['He is jumping.','She is reading.','They are dancing.','The cat is sleeping.'].map(s=><button className="example" key={s} onClick={()=>say(s)}>{s} <Volume2 size={14}/></button>)}<div className="note">I am · He/She/It is · You/We/They are</div><button className="primary" onClick={()=>finish(1)}>I learned the grammar! 🍬</button></>}
   {active===2&&<><h3>🎡 Spin the action wheel!</h3><p>Mime the action and say a complete sentence.</p><div className="wheel">{spin||'🎃'}</div><button className="primary" onClick={()=>setSpin(actions[Math.floor(Math.random()*actions.length)])}>SPIN</button>{spin&&<><div className="note">Mime <b>{spin}</b> and say “I am {spin}!”</div><button className="secondary" onClick={()=>finish(2)}>I described it!</button></>}</>}
   {active===3&&<><h3>🍭 Partner talk</h3><div className="dialogue"><b>👧 A: What is he doing?</b><b>🧒 B: He is jumping.</b><small>Take turns asking and answering. Change the action word each time.</small></div><button className="primary" onClick={()=>finish(3)}>We practised together! 🍬</button></>}
   {active===4&&<><h3>🏰 Monster Castle quiz</h3><p>Answer 10 questions. You need 8/10 to pass.</p>{answers.length<10?<><small className="kicker">QUESTION {q+1} / 10</small><h3>{questions[q].q}</h3><div className="options">{questions[q].o.map((o,i)=><button key={o} disabled={answers.length>q} onClick={()=>answer(i)}>{String.fromCharCode(65+i)}. {o}</button>)}</div>{feedback&&<div className="note">{feedback}<button className="next" onClick={()=>{setQ(v=>v+1);setFeedback('')}}>{q===9?'Finish':'Next question'} →</button></div>}</>:<div className="result"><strong>{score}/10</strong><p>{score>=8?'You passed! Castle cleared!':'Keep practising and try again.'}</p><button className="primary" onClick={()=>{if(score>=8)finish(4,20);else{setQ(0);setAnswers([]);setFeedback('')}}}>{score>=8?'Collect reward':'Try again'}</button></div>}</>}
   {active===5&&<><h3>📺 Halloween News Studio</h3><p>Describe these actions like a TV reporter.</p><div className="scenes"><span>👻 A ghost is dancing.</span><span>🧙 A witch is flying.</span><span>🧛 A vampire is reading.</span></div><button className="secondary" onClick={()=>say('Good morning! The ghost is dancing. The witch is flying. The vampire is reading.')}>Listen to model report</button><label>How did you feel about this lesson?</label><select value={survey} onChange={e=>setSurvey(e.target.value)}><option value="">Choose one...</option><option>It was fun and easy!</option><option>I learned something new.</option><option>I need more practice.</option></select><button className="primary" disabled={!survey} onClick={()=>finish(5,20)}>Submit my report 🍬</button></>}
  </section></div>}
 </main>
}
