// Browser-free smoke testing for the two canvas engines. Run: node scripts/test-premium.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
const get = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
function smoke(id, globalName, frameCount=160) {
  const handlers = new Map(), elements = new Map(), frames = [];
  const ctx = new Proxy({}, {
    get(target,prop) {
      if(prop==='createLinearGradient'||prop==='createRadialGradient')return ()=>({addColorStop(){}});
      if(prop==='canvas')return {};
      if(prop in target)return target[prop];
      return ()=>{};
    },set(target,prop,value){target[prop]=value;return true;}
  });
  const element = name => {
    if(!elements.has(name))elements.set(name,{
      id:name,style:{},textContent:'',hidden:false,value:({variant:'classic',difficulty:'normal',skin:'aurora'}[name]||''),disabled:false,
      classList:{toggle(){}},getContext(){return ctx;},getBoundingClientRect(){return {left:0,top:0,width:960,height:600};},
      addEventListener(type,cb){handlers.set(name+':'+type,cb);},setAttribute(){},setPointerCapture(){},
      click(){if(this.onclick)this.onclick({});else handlers.get(name+':click')?.({preventDefault(){}});}
    });
    return elements.get(name);
  };
  const win={addEventListener(){}};
  const context={window:win,document:{getElementById:element},requestAnimationFrame:cb=>frames.push(cb),localStorage:{getItem:()=>null,setItem(){}},Math,console,PointerEvent:class {}};
  runInNewContext(get('assets/js/'+id+'.js'),context,{filename:id+'.js',timeout:2000});
  assert.ok(frames.length,'animation must be scheduled');
  assert.ok(win[globalName],'debug state available');
  assert.equal(win[globalName].state?.mode||win[globalName].S?.mode,'ready','must start paused by default');
  element('start').click();
  const state=win[globalName].state||win[globalName].S;
  assert.equal(state.mode,'running','start works');
  for(let i=0;i<frameCount;i++){const fn=frames.shift();assert.ok(fn,'animation frame missing');fn(i*16.666);}
  assert.ok(Number.isFinite(state.score),'score is finite');
  assert.ok(state.score>=0,'score is nonnegative');
  assert.ok(Number.isFinite(state.x)||Array.isArray(state.snake),'player or snake state is present');
  element('pause').click();assert.equal(state.mode,'paused','pause works');
  element('start').click();assert.equal(state.mode,'running','resume works');
  return state;
}
const a=smoke('aether-run','__aetherDebug');
assert.ok(a.meters>0,'racing advances distance');
const b=smoke('moonlit-grove','__groveDebug');
assert.ok(b.t>0,'survival timer advances');
const park=smoke('park-dash','__parkDebug',20);
assert.ok(park.distance>0,'kids foot race advances');
assert.equal(park.mode,'running');
const snake=smoke('serpent-studio','__serpentDebug',20);
assert.ok(snake.snake.length>=4,'snake is alive with growing body');
assert.ok(['classic','zen','sprint','maze'].includes(snake.variant),'valid snake mode');
for(const id of ['aether-run','moonlit-grove','park-dash','serpent-studio']){
  const html=get('games/'+id+'.html');
  assert.match(html,/<canvas id="game"/);
  assert.match(html,/id="start"/);
  assert.match(html,/id="overlay"/);
  assert.doesNotMatch(html,/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/i,'strict CSP forbids inline JavaScript');
  assert.match(html,new RegExp('../assets/js/'+id+'\\.js'));
  assert.match(html,/<meta name="description"/);
}
const index=get('index.html');
for(const id of ['aether-run','moonlit-grove','park-dash','serpent-studio'])assert.ok(index.includes('games/'+id+'.html'),'home listing '+id);
const sitemap=get('sitemap.xml');
for(const id of ['aether-run','moonlit-grove'])assert.ok(sitemap.includes('/games/'+id+'.html'),'sitemap listing '+id);
console.log('Premium smoke: four game loops, start/pause/resume, scores, home links and sitemap passed.');
