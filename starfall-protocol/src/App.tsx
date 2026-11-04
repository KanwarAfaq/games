import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { Stars, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import { create } from 'zustand'

type Screen = 'menu' | 'mission' | 'gameover' | 'victory'
type Weapon = 'blaster' | 'plasma' | 'pulse'
type Enemy = { id:number; type:'scout'|'guardian'|'sentinel'; pos:THREE.Vector3; hp:number; max:number; alive:boolean; phase:number }
type GameState = { screen:Screen; hp:number; shield:number; energy:number; progress:number; zone:number; objective:string; weapon:Weapon; paused:boolean; set:(v:Partial<GameState>)=>void; reset:()=>void }
const useGame = create<GameState>((set)=>({ screen:'menu', hp:100, shield:100, energy:100, progress:0, zone:0, objective:'Activate the orbital relay', weapon:'blaster', paused:false, set:(v)=>set(v), reset:()=>set({screen:'menu',hp:100,shield:100,energy:100,progress:0,zone:0,objective:'Activate the orbital relay',weapon:'blaster',paused:false}) }))

const palette = { cyan:'#69e5ff', violet:'#b477ff', amber:'#ffb85c', red:'#ff557f', green:'#58ffbf' }
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n))

function Player({ aim, fire, dash }:{aim:THREE.Vector3; fire:number; dash:number}) {
  const ref=useRef<THREE.Group>(null); const gun=useRef<THREE.Mesh>(null)
  useFrame((_,dt)=>{ if(!ref.current)return; ref.current.rotation.y=THREE.MathUtils.lerp(ref.current.rotation.y,Math.atan2(aim.x,aim.z),dt*10); if(gun.current)gun.current.scale.z=THREE.MathUtils.lerp(gun.current.scale.z,fire>0?1.8:1,dt*16); ref.current.position.y=0.35+Math.sin(performance.now()*.004)*.025+(dash>0?.08:0) })
  return <group ref={ref} position={[0,.35,3]}>
    <mesh castShadow position={[0,.85,0]}><capsuleGeometry args={[.38,.72,6,12]}/><meshStandardMaterial color="#d8e7ff" metalness={.85} roughness={.22}/></mesh>
    <mesh castShadow position={[0,1.45,0]}><sphereGeometry args={[.34,16,12]}/><meshStandardMaterial color="#2b3c58" metalness={.8} roughness={.18}/></mesh>
    <mesh position={[0,1.45,.27]}><boxGeometry args={[.28,.12,.02]}/><meshBasicMaterial color={palette.cyan} toneMapped={false}/></mesh>
    <mesh castShadow position={[.43,.9,0]} rotation={[0,0,-.2]}><boxGeometry args={[.14,.7,.18]}/><meshStandardMaterial color="#9fb2cc" metalness={.75}/></mesh>
    <mesh ref={gun} position={[.56,.85,-.15]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.09,.12,.9,10]}/><meshStandardMaterial color={palette.cyan} emissive={palette.cyan} emissiveIntensity={2}/></mesh>
    <mesh position={[-.43,.88,0]} rotation={[0,0,.2]}><boxGeometry args={[.14,.7,.18]}/><meshStandardMaterial color="#9fb2cc" metalness={.75}/></mesh>
    <pointLight color={palette.cyan} intensity={1.8} distance={4} position={[0,1,.4]}/>
  </group>
}

function EnemyMesh({ enemy }:{enemy:Enemy}) {
  const ref=useRef<THREE.Group>(null); const color=enemy.type==='sentinel'?palette.red:enemy.type==='guardian'?palette.amber:palette.violet
  useFrame((_,dt)=>{ if(ref.current){ref.current.position.lerp(enemy.pos,dt*5); ref.current.rotation.y+=dt*(enemy.type==='scout'?1.4:.35)}})
  return <group ref={ref} position={enemy.pos}>
    <mesh castShadow position={[0,enemy.type==='sentinel'?1.4:.8,0]}><boxGeometry args={enemy.type==='sentinel'?[1.6,1.8,1.2]:enemy.type==='guardian'?[.9,1.1,.85]:[.6,.55,.6]}/><meshStandardMaterial color="#242a42" metalness={.78} roughness={.25} emissive={color} emissiveIntensity={.16}/></mesh>
    <mesh position={[0,enemy.type==='sentinel'?1.85:1.2,.42]}><boxGeometry args={[.28,.12,.04]}/><meshBasicMaterial color={color} toneMapped={false}/></mesh>
    {enemy.type==='scout'&&<mesh rotation={[0,performance.now()*.002,0]}><torusGeometry args={[.55,.04,8,24]}/><meshBasicMaterial color={color} toneMapped={false}/></mesh>}
    <pointLight color={color} intensity={1.5} distance={4}/>
  </group>
}

function World({ enemies, playerPos, aim, fire }:{enemies:Enemy[]; playerPos:THREE.Vector3; aim:THREE.Vector3; fire:number}) {
  const scene=useThree(s=>s.scene); useEffect(()=>{scene.fog=new THREE.Fog('#070b19',10,40)},[scene])
  const columns=useMemo(()=>Array.from({length:18},(_,i)=>i),[])
  return <>
    <color attach="background" args={['#050813']}/><ambientLight intensity={.34} color="#7898ff"/><directionalLight castShadow position={[5,10,4]} intensity={2.6} color="#bcdcff"/>
    <Stars radius={55} depth={35} count={900} factor={1.7} saturation={.2} fade speed={.3}/>
    <mesh receiveShadow rotation={[-Math.PI/2,0,0]} position={[0,-.06,-10]}><planeGeometry args={[18,52]}/><meshStandardMaterial color="#0b1120" metalness={.5} roughness={.7}/></mesh>
    {columns.map(i=><group key={i} position={[i%2? -6.7:6.7,0,-i*3-3]}><mesh position={[0,1.6,0]}><boxGeometry args={[1.5,3.2,1.1]}/><meshStandardMaterial color="#141e35" metalness={.75} roughness={.3}/></mesh><mesh position={[i%2?-.76:.76,1.7,0]}><boxGeometry args={[.03,2.1,.7]}/><meshBasicMaterial color={i%3?palette.cyan:palette.violet} toneMapped={false}/></mesh></group>)}
    <mesh position={[0,4,-16]}><torusGeometry args={[4,.06,8,64]}/><meshBasicMaterial color={palette.cyan} toneMapped={false}/></mesh>
    {enemies.filter(e=>e.alive).map(e=><EnemyMesh key={e.id} enemy={e}/>)}<Player aim={aim} fire={fire} dash={0}/>
  </>
}

function CameraRig(){const cam=useThree(s=>s.camera); useFrame((_,dt)=>{const t=new THREE.Vector3(0,4.1,9);cam.position.lerp(t,dt*3);cam.lookAt(0,1,-8)}); return null}
function Scene({ enemies, aim, fire }:{enemies:Enemy[]; aim:THREE.Vector3; fire:number}) {
  return <Canvas shadows camera={{position:[0,4.1,9],fov:58}}><CameraRig/><World enemies={enemies} playerPos={new THREE.Vector3()} aim={aim} fire={fire}/><EffectComposer><Bloom intensity={1.2} luminanceThreshold={.2} mipmapBlur/><Vignette darkness={.85} eskil={false}/></EffectComposer></Canvas>
}

function Menu(){const set=useGame(s=>s.set); return <main className="menu"><div className="menu-stars"/><div className="brand">SFP<span>//</span>07</div><div className="menu-hero"><p className="eyebrow">COLONY DEFENSE NETWORK / 2189</p><h1>STARFALL<br/><em>PROTOCOL</em></h1><p className="tagline">The colony went dark. You are the last active signal.</p><button className="btn primary" onClick={()=>set({screen:'mission'})}>DEPLOY TO ECHO-9 <b>↗</b></button></div><div className="menu-footer"><span>BUILD 0.9.7 // ORBITAL SYSTEMS</span><span>WASD MOVE · MOUSE AIM · CLICK FIRE · Q DODGE · E INTERACT</span></div><div className="menu-orbit"/></main>}

function Hud({enemies,onPause}:{enemies:Enemy[];onPause:()=>void}){const g=useGame(); const boss=enemies.find(e=>e.type==='sentinel'&&e.alive); return <div className="hud"><div className="hud-top"><div className="status"><div className="agent"><span className="agent-icon">✦</span><div><b>R-17 // AURORA</b><small>EXPLORER FRAME / ONLINE</small></div></div><div className="meters"><label>VITALS <i><b style={{width:`${g.hp}%`}}/></i><strong>{g.hp}</strong></label><label>SHIELD <i className="shield"><b style={{width:`${g.shield}%`}}/></i><strong>{g.shield}</strong></label></div></div><button className="pause" onClick={onPause}>PAUSE <span>ESC</span></button></div><div className="objective"><span>PRIMARY OBJECTIVE</span><b>{g.objective}</b><i><em style={{width:`${g.progress}%`}}/></i></div><div className="reticle"><i/><i/><i/><i/><b/></div><div className="weapon-panel"><div className="weapon-energy"><span>ENERGY CELL</span><strong>{Math.round(g.energy)}%</strong><i><b style={{width:`${g.energy}%`}}/></i></div><div className="weapons"><button className={g.weapon==='blaster'?'selected':''} onClick={()=>g.set({weapon:'blaster'})}><small>01</small>ARC BLASTER</button><button className={g.weapon==='plasma'?'selected':''} onClick={()=>g.set({weapon:'plasma'})}><small>02</small>PLASMA LANCE</button><button className={g.weapon==='pulse'?'selected':''} onClick={()=>g.set({weapon:'pulse'})}><small>03</small>ION PULSE</button></div></div>{boss&&<div className="boss"><span>REACTOR SENTINEL // PHASE {boss.phase+1}</span><i><b style={{width:`${boss.hp/boss.max*100}%`}}/></i></div>}</div>}

function Mission(){const g=useGame(); const [keys,setKeys]=useState<Record<string,boolean>>({}); const [aim,setAim]=useState(new THREE.Vector3(0,0,-1)); const [fire,setFire]=useState(0); const [enemies,setEnemies]=useState<Enemy[]>(()=>[{id:1,type:'scout',pos:new THREE.Vector3(-3,.35,-5),hp:40,max:40,alive:true,phase:0},{id:2,type:'guardian',pos:new THREE.Vector3(3,.35,-11),hp:80,max:80,alive:true,phase:0},{id:3,type:'scout',pos:new THREE.Vector3(-4,.35,-16),hp:40,max:40,alive:true,phase:0},{id:4,type:'sentinel',pos:new THREE.Vector3(0,.35,-27),hp:260,max:260,alive:true,phase:0}]);
  useEffect(()=>{const d=(e:KeyboardEvent)=>{setKeys(k=>({...k,[e.key.toLowerCase()]:true}));if(e.key==='Escape')g.set({paused:!g.paused});if(e.key.toLowerCase()==='e'&&g.progress<100)g.set({progress:Math.min(100,g.progress+20)})};const u=(e:KeyboardEvent)=>setKeys(k=>({...k,[e.key.toLowerCase()]:false}));const m=(e:MouseEvent)=>setAim(new THREE.Vector3((e.clientX/innerWidth-.5)*2,0,-1));addEventListener('keydown',d);addEventListener('keyup',u);addEventListener('mousemove',m);return()=>{removeEventListener('keydown',d);removeEventListener('keyup',u);removeEventListener('mousemove',m)}},[g]);
  useEffect(()=>{const id=setInterval(()=>{if(g.paused)return;setFire(f=>Math.max(0,f-.12));g.set({energy:Math.min(100,g.energy+.35)});setEnemies(es=>es.map(e=>{if(!e.alive)return e;const to=new THREE.Vector3(0,.35,3).sub(e.pos);e.pos.addScaledVector(to.normalize(),.025);if(to.length()<4&&Math.random()<.08)g.set({shield:Math.max(0,g.shield-4),hp:Math.max(0,g.hp-1)});return {...e,pos:e.pos.clone()}}));if(g.hp<=0)g.set({screen:'gameover'});if(g.progress>=100&&enemies.filter(e=>e.type!=='sentinel'&&e.alive).length===0)g.set({objective:'Reach the reactor core'});if(enemies.some(e=>e.type==='sentinel'&&!e.alive))g.set({screen:'victory'});},120);return()=>clearInterval(id)},[g,enemies]);
  useEffect(()=>{const id=setInterval(()=>{if(g.paused||!keys['mouse'])return; if(g.energy<=0)return;setFire(1);g.set({energy:Math.max(0,g.energy-(g.weapon==='plasma'?5:2))});setEnemies(es=>{const target=es.find(e=>e.alive);if(!target)return es;const dmg=g.weapon==='plasma'?24:g.weapon==='pulse'?12:10;return es.map(e=>e.id===target.id?{...e,hp:e.hp-dmg,alive:e.hp-dmg>0,phase:e.type==='sentinel'&&e.hp-dmg<130?1:e.phase}:e)})},220);return()=>clearInterval(id)},[g,keys]);
  useEffect(()=>{const d=()=>setKeys(k=>({...k,mouse:true}));const u=()=>setKeys(k=>({...k,mouse:false}));addEventListener('mousedown',d);addEventListener('mouseup',u);return()=>{removeEventListener('mousedown',d);removeEventListener('mouseup',u)}},[])
  const defeated=enemies.filter(e=>!e.alive).length;
  if(g.paused)return <main className="mission"><Scene enemies={enemies} aim={aim} fire={fire}/><div className="pause-overlay"><p className="eyebrow">SYSTEM PAUSED</p><h2>Hold position.</h2><button className="btn primary" onClick={()=>g.set({paused:false})}>RESUME MISSION</button><button className="btn ghost" onClick={()=>g.reset()}>ABORT TO TITLE</button></div><Hud enemies={enemies} onPause={()=>g.set({paused:false})}/></main>
  return <main className="mission"><Scene enemies={enemies} aim={aim} fire={fire}/><Hud enemies={enemies} onPause={()=>g.set({paused:true})}/><div className="zone-chip">ZONE 01 <span>ORBITAL FACILITY</span></div><div className="enemy-counter">HOSTILES <b>{Math.max(0,4-defeated).toString().padStart(2,'0')}</b> / 04</div></main>
}

function End({victory}:{victory:boolean}){const g=useGame();return <main className="end"><div className="end-grid"/><p className="eyebrow">MISSION {victory?'COMPLETE':'FAILED'} // ECHO-9</p><h1>{victory?'THE COLONY':'SIGNAL LOST'}</h1><p>{victory?'Power restored. The stars are listening again.':'Aurora frame offline. The protocol can still be restarted.'}</p><button className="btn primary" onClick={()=>g.reset()}>{victory?'RETURN TO TITLE':'RETRY MISSION'} <b>↗</b></button></main>}

export default function App(){const screen=useGame(s=>s.screen); if(screen==='menu')return <Menu/>; if(screen==='mission')return <Mission/>; return <End victory={screen==='victory'}/>}
