// Cinematic shots use approved public-area viewpoints. Cuts avoid travelling through walls.
import {areas as tourShots} from './areas-v1.js';
const total = tourShots.reduce((s, x) => s + x[2], 0);
const panel = document.createElement('section');
panel.id = 'tour-panel';
panel.innerHTML = `<h3>Video del diseño</h3><button id="tour-play" disabled>▶ Iniciar recorrido</button><div style="display:flex;gap:6px"><button id="tour-restart" disabled>↺ Reiniciar</button><button id="tour-stop" disabled>Salir</button></div><label for="tour-chapter">Área del recorrido</label><select id="tour-chapter" disabled>${tourShots.map((s,i)=>`<option value="${i}">${s[1]}</option>`).join('')}</select><progress id="tour-progress" max="${total}" value="0" style="width:100%;accent-color:#ff8300;margin-top:14px"></progress><p id="tour-status" role="status">Disponible cuando termine de cargar el modelo.</p><p>Recorrido automático de ${Math.floor(total/60)} min ${total%60} s. Puedes pausarlo para observar cada área.</p>`;
document.querySelector('aside').prepend(panel);
const style = document.createElement('style');
style.textContent = '#tour-play{background:#04003f;color:white;border:0;font-weight:bold}#tour-panel button:disabled{opacity:.5;cursor:wait}#tour-panel label{margin-bottom:8px}.tour-fade{position:absolute;inset:0;background:#ecece8;opacity:0;pointer-events:none;z-index:3}.tour-label{position:absolute;top:18px;left:24px;z-index:4;background:#04003fee;color:white;border-left:4px solid #ff8300;padding:10px 16px;border-radius:5px;font-size:13px;pointer-events:none}.tour-label[hidden]{display:none}';
document.head.append(style);
const shade = document.createElement('div'); shade.className = 'tour-fade';
const badge = document.createElement('div'); badge.className = 'tour-label'; badge.hidden = true;
document.querySelector('.stage').append(shade,badge);
const play = panel.querySelector('#tour-play'), restart = panel.querySelector('#tour-restart'), stop = panel.querySelector('#tour-stop'), chapter = panel.querySelector('#tour-chapter'), progress = panel.querySelector('#tour-progress'), status = panel.querySelector('#tour-status');
let running=false, engaged=false, elapsed=0, last=0, frame=0, shot=-1, savedReference=true;
const fmt = s => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
function locate(t) { let start=0; for(let i=0;i<tourShots.length;i++){if(t<start+tourShots[i][2]||i===tourShots.length-1)return {i,start,u:Math.min(1,(t-start)/tourShots[i][2])};start+=tourShots[i][2];} }
function paint() {
  const v=window.viewer, a=locate(elapsed), item=tourShots[a.i], preset=v.views[item[0]];
  if(shot!==a.i){shot=a.i;v.view(item[0]);chapter.value=String(a.i);}
  // A gentle zoom, at most a few centimetres indoors, stays at the selected viewpoint.
  const ease=a.u*a.u*(3-2*a.u), distance=preset.mode==='orbit'?.18:.045;
  const direction=v.camera.position.clone().fromArray(preset.target).sub(v.camera.position.clone().fromArray(preset.pos)).normalize();
  v.camera.position.fromArray(preset.pos).addScaledVector(direction,distance*ease);
  v.camera.lookAt(...preset.target);v.render();
  shade.style.opacity=String(Math.max(0,1-a.u*item[2]/.45,1-(1-a.u)*item[2]/.45));
  document.querySelector('#refs').hidden=true;
  badge.textContent=`${a.i+1} / ${tourShots.length} · ${item[1]}`;badge.hidden=false;
  progress.value=elapsed;status.textContent=`${running?'Reproduciendo':'En pausa'} · ${fmt(elapsed)} / ${fmt(total)}`;
}
function tick(now){if(!running)return;elapsed=Math.min(total,elapsed+Math.min((now-last)/1000,.15));last=now;paint();if(elapsed>=total){running=false;play.textContent='▶ Repetir recorrido';status.textContent=`Recorrido completo · ${fmt(total)}`;shade.style.opacity='0';return;}frame=requestAnimationFrame(tick);}
function pause(){running=false;cancelAnimationFrame(frame);play.textContent='▶ Continuar';if(engaged)status.textContent=`En pausa · ${fmt(elapsed)} / ${fmt(total)}`;}
function start(){if(!window.viewer?.ready)return;if(!engaged){savedReference=document.querySelector('#reference').checked;engaged=true;}if(elapsed>=total){elapsed=0;shot=-1;}running=true;play.textContent='Ⅱ Pausar';restart.disabled=stop.disabled=false;last=performance.now();paint();frame=requestAnimationFrame(tick);}
function leave(){pause();if(engaged){const index=tourShots[Math.max(0,shot)][0];engaged=false;window.viewer.view(index);document.querySelector('#reference').checked=savedReference;document.querySelector('#reference').onchange();}badge.hidden=true;shade.style.opacity='0';elapsed=0;shot=-1;progress.value=0;play.textContent='▶ Iniciar recorrido';status.textContent='Listo para iniciar';stop.disabled=true;}
play.onclick=()=>running?pause():start();
restart.onclick=()=>{pause();elapsed=0;shot=-1;start();};
stop.onclick=leave;
chapter.onchange=()=>{pause();elapsed=tourShots.slice(0,Number(chapter.value)).reduce((s,x)=>s+x[2],0);shot=-1;start();};
document.querySelector('#views').addEventListener('click',()=>{if(engaged)leave();},true);
document.querySelector('canvas').addEventListener('pointerdown',()=>{if(engaged)leave();},true);
document.querySelector('canvas').addEventListener('wheel',()=>{if(engaged)leave();},true);
window.addEventListener('keydown',e=>{if(engaged && ['w','a','s','d','arrowleft','arrowright','escape'].includes(e.key.toLowerCase()))leave();},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)pause();});
const ready=setInterval(()=>{if(window.viewer?.ready){clearInterval(ready);play.disabled=chapter.disabled=false;status.textContent='Listo para iniciar';}},250);
