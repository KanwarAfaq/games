import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { Environment, OrbitControls, PerspectiveCamera, Stars, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cars, tracks, useGame, type CameraMode } from './store'

type Vec = [number, number, number]

const neon = (color: string, intensity = 4) => new THREE.MeshBasicMaterial({ color, toneMapped: false, transparent: true, opacity: 0.9 })

function Car({ color, accent, player = false, scale = 1, position = [0, 0.34, 0] as Vec, rotation = 0 }: { color: string; accent: string; player?: boolean; scale?: number; position?: Vec; rotation?: number }) {
  const body = useMemo(() => new THREE.MeshStandardMaterial({ color, metalness: 0.82, roughness: 0.18 }), [color])
  const glow = useMemo(() => neon(accent, 5), [accent])
  const wheels = [-0.72, 0.72].flatMap(x => [-0.92, 0.92].map(z => [x, 0.2, z] as Vec))
  return <group position={position} rotation={[0, rotation, 0]} scale={scale}>
    <mesh castShadow material={body} position={[0, 0.24, 0]}><boxGeometry args={[1.45, 0.34, 3.05]} /></mesh>
    <mesh castShadow material={body} position={[0, 0.48, -0.18]} rotation={[0.04, 0, 0]}><boxGeometry args={[1.08, 0.34, 1.42]} /></mesh>
    <mesh material={new THREE.MeshPhysicalMaterial({ color: '#152638', metalness: 0.2, roughness: 0.05, transmission: 0.1, transparent: true, opacity: 0.78 })} position={[0, 0.68, -0.18]} rotation={[0.05, 0, 0]}><boxGeometry args={[0.86, 0.24, 0.95]} /></mesh>
    <mesh material={glow} position={[0, 0.3, -1.54]}><boxGeometry args={[0.9, 0.06, 0.025]} /></mesh>
    <mesh material={new THREE.MeshBasicMaterial({ color: '#ff285f', toneMapped: false })} position={[0, 0.3, 1.54]}><boxGeometry args={[0.72, 0.07, 0.03]} /></mesh>
    {wheels.map((p, i) => <group key={i} position={p} rotation={[Math.PI / 2, 0, 0]}><mesh castShadow><cylinderGeometry args={[0.28, 0.28, 0.17, 16]} /><meshStandardMaterial color="#080b12" roughness={0.78} /></mesh><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.13, 0.13, 0.18, 12]} /><meshStandardMaterial color={accent} metalness={0.8} /></mesh></group>)}
    {player && <><mesh material={glow} position={[-0.38, 0.34, -1.61]}><boxGeometry args={[0.16, 0.08, 0.04]} /></mesh><mesh material={glow} position={[0.38, 0.34, -1.61]}><boxGeometry args={[0.16, 0.08, 0.04]} /></mesh></>}
  </group>
}

function Road({ trackId }: { trackId: string }) {
  const accent = trackId === 'city' ? '#36d9ff' : trackId === 'mountain' ? '#ffb256' : '#ff5b93'
  const side = useMemo(() => Array.from({ length: 32 }, (_, i) => i), [])
  const props = useMemo(() => side.map(i => ({ z: -i * 8, offset: 2.9 + (i % 2) * 0.9 })), [side])
  return <group>
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, -120]}><planeGeometry args={[8.4, 260]} /><meshStandardMaterial color="#161b2a" roughness={0.32} metalness={0.56} /></mesh>
    <mesh position={[-4.15, 0.02, -120]}><boxGeometry args={[0.08, 0.03, 260]} /><meshBasicMaterial color={accent} toneMapped={false} /></mesh>
    <mesh position={[4.15, 0.02, -120]}><boxGeometry args={[0.08, 0.03, 260]} /><meshBasicMaterial color={accent} toneMapped={false} /></mesh>
    {Array.from({ length: 26 }, (_, i) => <mesh key={i} position={[0, 0.015, -i * 10 - 3]}><boxGeometry args={[0.06, 0.02, 3.2]} /><meshBasicMaterial color="#d8eaff" transparent opacity={0.7} /></mesh>)}
    {props.map((p, i) => <StreetProp key={i} index={i} z={p.z} offset={p.offset} accent={accent} trackId={trackId} />)}
  </group>
}

function StreetProp({ index, z, offset, accent, trackId }: { index: number; z: number; offset: number; accent: string; trackId: string }) {
  const left = index % 2 === 0 ? -1 : 1
  if (trackId === 'mountain') return <group position={[left * offset, 0, z - 4]}><mesh position={[0, 1.2, 0]}><coneGeometry args={[1.15 + (index % 3) * .25, 2.8 + (index % 2), 6]} /><meshStandardMaterial color={index % 2 ? '#142e32' : '#243d38'} roughness={1} /></mesh><mesh position={[left * .35, 0.7, -2]} rotation={[0, 0, .25]}><boxGeometry args={[.08, 1.2, .08]} /><meshBasicMaterial color={accent} toneMapped={false} /></mesh></group>
  if (trackId === 'coast') return <group position={[left * offset, 0, z - 4]}><mesh position={[0, .8, 0]}><cylinderGeometry args={[.12, .18, 1.6, 8]} /><meshStandardMaterial color="#806249" /></mesh><mesh position={[0, 1.7, 0]}><sphereGeometry args={[.62, 10, 6]} /><meshStandardMaterial color="#2f8d68" roughness={.9} /></mesh><mesh position={[left * .4, .08, 0]}><boxGeometry args={[.65, .04, .12]} /><meshBasicMaterial color={accent} toneMapped={false} /></mesh></group>
  return <group position={[left * offset, 0, z - 4]}><mesh position={[0, 1.1, 0]}><boxGeometry args={[1.15 + (index % 2) * .5, 2.2 + (index % 3), 1.15]} /><meshStandardMaterial color={index % 3 === 0 ? '#1a2038' : '#242a49'} roughness={.82} /></mesh><mesh material={neon(index % 2 ? '#ff4da6' : accent, 3)} position={[0, 1.3 + (index % 3), .59]}><boxGeometry args={[.7, .14, .03]} /></mesh><mesh position={[left * .45, .55, .64]}><boxGeometry args={[.07, .7, .04]} /><meshBasicMaterial color="#ffe2ad" toneMapped={false} /></mesh></group>
}

function Rain() {
  const ref = useRef<THREE.Points>(null)
  const count = 280
  const positions = useMemo(() => { const a = new Float32Array(count * 3); for (let i = 0; i < count; i++) { a[i * 3] = (Math.random() - .5) * 18; a[i * 3 + 1] = Math.random() * 8; a[i * 3 + 2] = -Math.random() * 45; } return a }, [])
  useFrame((_, d) => { if (!ref.current) return; const p = ref.current.geometry.attributes.position.array as Float32Array; for (let i = 0; i < count; i++) { p[i * 3 + 1] -= d * 9; if (p[i * 3 + 1] < 0) p[i * 3 + 1] = 8; } ref.current.geometry.attributes.position.needsUpdate = true })
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} /></bufferGeometry><pointsMaterial color="#83c6ff" size={.035} transparent opacity={.48} /></points>
}

function World({ trackId, speed, cameraMode, carIndex }: { trackId: string; speed: number; cameraMode: CameraMode; carIndex: number }) {
  const carRef = useRef<THREE.Group>(null)
  const camera = useThree(s => s.camera)
  const playerCar = cars[carIndex]
  useFrame((_, dt) => {
    if (!carRef.current) return
    carRef.current.position.z = THREE.MathUtils.lerp(carRef.current.position.z, Math.min(4, speed * .02), dt * 4)
    carRef.current.rotation.z = THREE.MathUtils.lerp(carRef.current.rotation.z, Math.sin(performance.now() * .002) * speed * .0008, dt * 4)
    const target = cameraMode === 'cockpit' ? new THREE.Vector3(0, 1.08, .1) : cameraMode === 'hood' ? new THREE.Vector3(0, .95, 1.7) : new THREE.Vector3(0, 3.3, 7.5)
    target.applyMatrix4(carRef.current.matrixWorld)
    camera.position.lerp(target, dt * 3)
    camera.lookAt(new THREE.Vector3(0, .4, -10))
  })
  return <>
    <color attach="background" args={[trackId === 'city' ? '#070a1a' : trackId === 'mountain' ? '#19101c' : '#1b0d22']} />
    <fog attach="fog" args={[trackId === 'city' ? '#0b1230' : '#2a1727', 14, 65]} />
    <ambientLight intensity={trackId === 'city' ? .55 : .8} color={trackId === 'coast' ? '#ffc2a1' : '#8da7ff'} />
    <directionalLight position={[5, 10, 3]} intensity={3.5} color={trackId === 'city' ? '#7eabff' : '#ffd1a0'} castShadow shadow-mapSize={[1024, 1024]} />
    <Stars radius={50} depth={25} count={trackId === 'city' ? 900 : 1800} factor={1.2} saturation={0} fade speed={.2} />
    <Road trackId={trackId} />
    {trackId === 'coast' && <mesh position={[0, -1.8, -70]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[50, 200]} /><meshStandardMaterial color="#0b5264" metalness={.3} roughness={.35} /></mesh>}
    <group ref={carRef}><Car color={playerCar.color} accent={playerCar.accent} player position={[0, .34, 0]} /></group>
    <Car color="#ff395f" accent="#ffb0be" position={[-1.8, .34, -5]} scale={.94} rotation={-.03} />
    <Car color="#51d3ff" accent="#d2f7ff" position={[1.7, .34, -9]} scale={.9} rotation={.02} />
    <Car color="#f5a640" accent="#ffe6b0" position={[-1.5, .34, -15]} scale={.86} />
    {trackId === 'city' && <Rain />}
  </>
}

function Scene({ trackId, speed, cameraMode, carIndex }: { trackId: string; speed: number; cameraMode: CameraMode; carIndex: number }) {
  return <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }}>
    <PerspectiveCamera makeDefault position={[0, 3.4, 8]} fov={64} />
    <World trackId={trackId} speed={speed} cameraMode={cameraMode} carIndex={carIndex} />
  </Canvas>
}

function CornerMark() { return <div className="corner-mark"><span>NV</span><i>///</i></div> }

function Menu() {
  const { set } = useGame()
  return <main className="menu-screen"><div className="menu-backdrop"><div className="grid-floor" /><div className="menu-orb" /></div><CornerMark /><div className="menu-copy"><p className="eyebrow">SEASON 01 / NIGHT RUN</p><h1>NEON<br /><em>VELOCITY</em></h1><p className="lede">The city is asleep. The road is yours.</p><button className="primary-btn" onClick={() => set({ screen: 'tracks' })}>START ENGINE <span>↗</span></button><div className="menu-links"><button onClick={() => set({ screen: 'garage' })}>GARAGE</button><button onClick={() => set({ screen: 'tracks' })}>SELECT TRACK</button></div></div><div className="menu-meta"><span>01</span><span>ARCADE RACING / 3 TRACKS / 4 CARS</span><span>© 2025 NV STUDIOS</span></div></main>
}

function Garage() {
  const { carIndex, set } = useGame(); const car = cars[carIndex]
  return <main className="selection-screen"><Header title="GARAGE" back={() => set({ screen: 'menu' })} /><div className="selection-content"><div className="selection-intro"><p className="eyebrow">YOUR COLLECTION / {cars.length} VEHICLES</p><h1>Choose your<br /><em>weapon.</em></h1><p>Every chassis has a signature. Find the one that feels like you.</p></div><div className="garage-stage"><div className="stage-glow" style={{ background: car.accent }} /><Car color={car.color} accent={car.accent} scale={1.7} position={[0, 0, 0]} /></div><div className="car-list">{cars.map((item, i) => <button className={i === carIndex ? 'car-row active' : 'car-row'} key={item.id} onClick={() => set({ carIndex: i })}><span className="car-index">0{i + 1}</span><span><strong>{item.name}</strong><small>{item.class}</small></span><span className="bar-set"><i style={{ width: `${item.top}%` }} /><i style={{ width: `${item.accel}%` }} /><i style={{ width: `${item.grip}%` }} /></span><span className="arrow">{i === carIndex ? '●' : '○'}</span></button>)}</div></div><div className="selection-footer"><button className="ghost-btn" onClick={() => set({ screen: 'menu' })}>← BACK</button><button className="primary-btn" onClick={() => set({ screen: 'tracks' })}>SELECT {car.name} <span>↗</span></button></div></main>
}

function TrackSelect() {
  const { trackIndex, set, carIndex } = useGame(); const track = tracks[trackIndex]
  return <main className="selection-screen track-select"><Header title="RACE SELECT" back={() => set({ screen: 'menu' })} /><div className="track-content"><div className="track-copy"><p className="eyebrow">RACE ROUTE / 0{trackIndex + 1}</p><h1>{track.name}</h1><p>{track.description}</p><div className="track-specs"><span><b>{track.laps}</b> LAPS</span><span><b>{track.length}</b> DISTANCE</span><span><b>3:42</b> BEST TIME</span></div></div><div className="track-preview" style={{ '--track': track.tone } as React.CSSProperties}><div className="preview-sky" /><div className="preview-road" /><div className="preview-city" /><div className="preview-label">{track.location}</div></div><div className="track-tabs">{tracks.map((t, i) => <button className={i === trackIndex ? 'track-tab active' : 'track-tab'} key={t.id} onClick={() => set({ trackIndex: i })}><span>0{i + 1}</span>{t.name}</button>)}</div></div><div className="selection-footer"><button className="ghost-btn" onClick={() => set({ screen: 'garage' })}>← GARAGE</button><button className="primary-btn" onClick={() => { void carIndex; useGame.getState().startRace() }}>RACE NOW <span>↗</span></button></div></main>
}

function Header({ title, back }: { title: string; back: () => void }) { return <header className="app-header"><button className="brand-mini" onClick={back}><span>NV</span> NEON VELOCITY</button><span className="header-title">{title}</span><span className="header-right">ONLINE / LOCAL SAVE <i /></span></header> }

function Speedometer({ speed, nitro }: { speed: number; nitro: number }) { return <div className="speedometer"><div className="speed-number">{Math.round(speed)}<small>KM/H</small></div><div className="speed-ring" style={{ '--fill': `${Math.min(speed / 1.2, 100)}%` } as React.CSSProperties} /><div className="nitro-meter"><span>NITRO</span><i><b style={{ width: `${nitro}%` }} /></i></div></div> }

function Race() {
  const { trackIndex, carIndex, camera, speed, nitro, lap, position, elapsed, paused, set, resetRace } = useGame();
  const [countdown, setCountdown] = useState(3); const [keys, setKeys] = useState<Record<string, boolean>>({});
  useEffect(() => { const down=(e: KeyboardEvent)=>{setKeys(k=>({...k,[e.key.toLowerCase()]:true})); if(e.key.toLowerCase()==='c') set({camera: camera==='chase'?'hood':camera==='hood'?'cockpit':'chase'}); if(e.key==='Escape') set({paused:!paused})}; const up=(e: KeyboardEvent)=>setKeys(k=>({...k,[e.key.toLowerCase()]:false})); addEventListener('keydown',down); addEventListener('keyup',up); return()=>{removeEventListener('keydown',down);removeEventListener('keyup',up)} }, [camera, paused, set]);
  useEffect(() => { const t = window.setTimeout(() => setCountdown(c => c > 0 ? c - 1 : 0), 850); return () => clearTimeout(t) }, [countdown]);
  useEffect(() => { const t=window.setInterval(()=>{ const g=useGame.getState(); if(g.screen!=='race'||g.paused||countdown>0)return; const car=cars[carIndex]; const boosting=keys.shift&&g.nitro>0; const accel=keys.w||keys.arrowup; const brake=keys.s||keys.arrowdown; let next=g.speed+(accel?car.accel*.012: -1.5)-(brake?4:0); if(boosting) next+=3.2; next=THREE.MathUtils.clamp(next,0,boosting?120:100); const nextNitro=boosting?Math.max(0,g.nitro-1.8):Math.min(100,g.nitro+.22); const nextElapsed=g.elapsed+.1; if(nextElapsed>28){g.set({screen:'results',speed:next,nitro:nextNitro,elapsed:nextElapsed});return} g.set({speed:next,nitro:nextNitro,elapsed:nextElapsed,lap:Math.min(3,1+Math.floor(nextElapsed/10)),position:next>72?1:next>45?2:3,driftScore:g.driftScore+(keys[' ']&&next>40?.7:0)}); },100); return()=>clearInterval(t) }, [carIndex,countdown,keys]);
  return <main className="race-screen"><Scene trackId={tracks[trackIndex].id} speed={speed} cameraMode={camera} carIndex={carIndex} /><div className="race-vignette" /><div className="race-hud"><div className="hud-top"><div><span className="hud-label">POSITION</span><strong>{position}<small>/ 04</small></strong></div><div className="lap"><span className="hud-label">LAP</span><strong>{lap}<small>/ {tracks[trackIndex].laps}</small></strong></div><div className="race-time"><span className="hud-label">TIME</span><strong>{formatTime(elapsed)}</strong></div></div><div className="hud-bottom"><div className="drift"><span>DRIFT SCORE</span><b>{Math.floor(useGame.getState().driftScore).toLocaleString()}</b></div><Speedometer speed={speed} nitro={nitro} /></div><div className="mini-map"><span>ROUTE 0{trackIndex + 1}</span><i /><i /><i /><b /></div><div className="race-controls">WASD <span>DRIVE</span> · SPACE <span>DRIFT</span> · SHIFT <span>NITRO</span> · C <span>CAMERA</span></div></div>{countdown>0&&<div className="countdown"><span>{countdown}</span><small>GET READY</small></div>}{paused&&<div className="pause-card"><p className="eyebrow">RACE PAUSED</p><h2>Take a breath.</h2><button className="primary-btn" onClick={()=>set({paused:false})}>RESUME <span>↗</span></button><button className="ghost-btn" onClick={resetRace}>RESTART RACE</button><button className="ghost-btn" onClick={()=>set({screen:'menu'})}>EXIT TO MENU</button></div>}</main>
}

function Results() { const {elapsed, trackIndex, carIndex, set, resetRace}=useGame(); return <main className="results-screen"><div className="results-grid" /><CornerMark /><div className="results-copy"><p className="eyebrow">RACE COMPLETE / 01</p><h1>YOU<br /><em>MADE IT.</em></h1><div className="result-line"><span>FINISH TIME</span><b>{formatTime(elapsed)}</b></div><div className="result-line"><span>BEST LAP</span><b>01:12.84</b></div><div className="result-line"><span>VEHICLE</span><b>{cars[carIndex].name}</b></div><button className="primary-btn" onClick={resetRace}>REPLAY RACE <span>↗</span></button><button className="ghost-btn" onClick={()=>set({screen:'tracks'})}>CHANGE TRACK</button><button className="ghost-btn" onClick={()=>set({screen:'menu'})}>MAIN MENU</button></div><div className="results-side"><span>TRACK / {tracks[trackIndex].name}</span><div className="trophy">★</div><p>NEW PERSONAL<br />MOMENTUM</p></div></main> }

function formatTime(seconds: number) { const m=Math.floor(seconds/60).toString().padStart(2,'0'); const s=Math.floor(seconds%60).toString().padStart(2,'0'); const ms=Math.floor((seconds%1)*100).toString().padStart(2,'0'); return `${m}:${s}.${ms}` }

export default function App() { const screen=useGame(s=>s.screen); if(screen==='menu')return <Menu/>; if(screen==='garage')return <Garage/>; if(screen==='tracks')return <TrackSelect/>; if(screen==='race')return <Race/>; return <Results/> }
