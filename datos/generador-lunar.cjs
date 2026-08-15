globalThis.window=globalThis; require('./cnh.js');
const {Origin,Horoscope}=globalThis.CNH;
const TZ=-3, HORA=36e5, DIA=864e5;
const PLANETAS=['mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto'];
const NOM={mercury:'Mercurio',venus:'Venus',mars:'Marte',jupiter:'Júpiter',saturn:'Saturno',
           uranus:'Urano',neptune:'Neptuno',pluto:'Plutón'};
const cache=new Map();
function posUTC(ms){
  const k=Math.round(ms/6e4);
  if(cache.has(k)) return cache.get(k);
  const d=new Date(k*6e4);
  const o=new Origin({year:d.getUTCFullYear(),month:d.getUTCMonth(),date:d.getUTCDate(),
    hour:d.getUTCHours(),minute:d.getUTCMinutes(),latitude:0,longitude:0});
  const h=new Horoscope({origin:o,houseSystem:'whole-sign',zodiac:'tropical',aspectTypes:[],language:'es'});
  const r={sol:h.CelestialBodies.sun.ChartPosition.Ecliptic.DecimalDegrees,
           luna:h.CelestialBodies.moon.ChartPosition.Ecliptic.DecimalDegrees};
  PLANETAS.forEach(p=>{ r[p]=h.CelestialBodies[p].ChartPosition.Ecliptic.DecimalDegrees; });
  cache.set(k,r); return r;
}
const norm=a=>((a%360)+360)%360;
const elong=p=>norm(p.luna-p.sol);
const signo=l=>Math.floor(norm(l)/30);
const dif=(a,b)=>((a-b+540)%360)-180;                 // diferencia angular con signo
const vel=(pl,t)=>dif(posUTC(t+12*HORA)[pl], posUTC(t-12*HORA)[pl]);  // °/día, base 24 h

function cruce(t0,t1,fn){
  let a=t0,b=t1,fa=fn(a);
  if(fa===fn(b)) return null;
  for(let i=0;i<24;i++){ const m=(a+b)/2; fn(m)===fa ? a=m : b=m; }
  return Math.round(b/6e4)*6e4;
}
const local=ms=>new Date(ms+TZ*HORA);
const hhmm=ms=>{const d=local(ms);return String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0');};
const ymd=ms=>{const d=local(ms);return [d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate()];};

const DESDE=Date.UTC(2026,0,1)-TZ*HORA, HASTA=Date.UTC(2031,0,1)-TZ*HORA;
const meses={};
const mes=(y,m)=>{const k=y+'-'+String(m).padStart(2,'0');return meses[k]||(meses[k]={dias:[],eventos:[]});};

let prev=null, prevT=null, velPrev={};
for(let t=DESDE; t<HASTA; t+=DIA){
  const p=posUTC(t), pm=posUTC(t+12*HORA);
  const [Y,M,D]=ymd(t);
  const dia={d:D, f:Math.round((1-Math.cos(elong(pm)*Math.PI/180))/2*100),
             c:elong(pm)<180?1:0, s:signo(p.luna)};

  if(prev){
    // ingreso lunar: se guarda el signo de origen y el nuevo, sin rotular mal el día
    if(signo(prev.luna)!==signo(p.luna)){
      const s0=signo(prev.luna);
      const tt=cruce(prevT,t,x=>signo(posUTC(x).luna)===s0);
      if(tt!==null){
        const [yy,mo,dd]=ymd(tt);
        const md=mes(yy,mo), obj=md.dias.find(z=>z.d===dd);
        const marca={i:hhmm(tt), s2:signo(posUTC(tt+HORA).luna)};
        if(obj) Object.assign(obj,marca); else Object.assign(dia,marca);
      }
    }
    // fases lunares
    [[0,'nueva'],[90,'creciente'],[180,'llena'],[270,'menguante']].forEach(([ang,tipo])=>{
      if(norm(elong(prev)-ang)>300 && norm(elong(p)-ang)<60){
        const tt=cruce(prevT,t,x=>norm(elong(posUTC(x))-ang)>180);
        if(tt!==null){ const [yy,mo,dd]=ymd(tt);
          mes(yy,mo).eventos.push({t:tipo,d:dd,h:hhmm(tt),s:signo(posUTC(tt).luna)}); }
      }
    });
    // estaciones: barrido fino de la velocidad para no depender de los extremos
    PLANETAS.forEach(pl=>{
      const v=vel(pl,t);
      if(velPrev[pl]!==undefined && Math.sign(velPrev[pl])!==Math.sign(v)){
        let tt=null;
        for(let k=0;k<48 && tt===null;k++){
          const a=prevT+k*30*6e4, b=a+30*6e4;
          if(b>t+HORA) break;
          if(Math.sign(vel(pl,a))!==Math.sign(vel(pl,b))) tt=cruce(a,b,x=>vel(pl,x)>0);
        }
        if(tt===null) tt=prevT+12*HORA;                 // sin resolución fina: mediodía
        const [yy,mo,dd]=ymd(tt);
        mes(yy,mo).eventos.push({t:v<0?'retro':'directo', p:NOM[pl], d:dd, h:hhmm(tt), s:signo(posUTC(tt)[pl])});
      }
      velPrev[pl]=v;
    });
  }
  mes(Y,M).dias.push(dia);
  prev=p; prevT=t;
}
Object.values(meses).forEach(m=>{
  m.dias.sort((a,b)=>a.d-b.d);
  m.eventos.sort((a,b)=>a.d-b.d||a.h.localeCompare(b.h));
});
require('fs').writeFileSync('lunar.json',JSON.stringify({tz:TZ,desde:'2026-01',hasta:'2030-12',meses}));
console.log('meses:',Object.keys(meses).length,'| cache:',cache.size,'| tamaño:',(require('fs').statSync('lunar.json').size/1024).toFixed(0),'KB');
