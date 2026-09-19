(() => {
  const src='plano-r41.svg';
  const entry=document.createElement('section');entry.id='plan-entry';
  entry.innerHTML='<h3>Plano de la tienda</h3><button id="open-plan">▤ Ver plano arquitectónico</button><p>Planta con cotas, mobiliario y simbología. Amplía para ver los detalles.</p>';
  document.querySelector('aside').prepend(entry);
  const style=document.createElement('style');style.textContent=`
    #open-plan{background:#fff7eb;border:1px solid #ff8300;font-weight:700;color:#04003f}
    #plan-dialog{position:fixed;inset:0;z-index:100;background:#e3e6e9;color:#172333;display:flex;flex-direction:column}
    #plan-dialog[hidden]{display:none}#plan-toolbar{display:flex;align-items:center;flex-wrap:wrap;gap:8px;background:white;border-bottom:3px solid #ff8300;padding:12px 18px}
    #plan-toolbar h2{font-size:16px;margin:0 auto 0 0}#plan-toolbar button,#plan-toolbar a{font:600 12px Montserrat,Arial,sans-serif;border:1px solid #c9ced5;border-radius:5px;padding:9px 12px;background:white;color:#04003f;text-decoration:none;cursor:pointer}
    #plan-close{background:#04003f!important;color:white!important}#plan-viewport{flex:1;min-height:0;overflow:hidden;touch-action:none;cursor:grab;position:relative}#plan-viewport:active{cursor:grabbing}
    #plan-viewport svg{display:block;width:100%;height:100%;user-select:none}#plan-status{margin:0;padding:8px 18px;background:white;font-size:11px;color:#566170}#plan-message{position:absolute;inset:0;display:grid;place-items:center}#plan-message[hidden]{display:none}
    @media(max-width:600px){#plan-toolbar{padding:8px;gap:5px}#plan-toolbar h2{flex-basis:100%;font-size:14px}#plan-toolbar button,#plan-toolbar a{font-size:11px;padding:8px}#plan-status{font-size:10px}}
    @media print{@page{size:A2 landscape;margin:0}body>*:not(#plan-dialog){display:none!important}#plan-dialog{position:static;background:white;display:block!important}#plan-toolbar,#plan-status{display:none!important}#plan-viewport{width:594mm;height:420mm;overflow:visible}#plan-viewport svg{width:594mm;height:420mm}}
  `;document.head.append(style);
  const dialog=document.createElement('div');dialog.id='plan-dialog';dialog.hidden=true;dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','plan-title');
  dialog.innerHTML=`<div id="plan-toolbar"><h2 id="plan-title">Planta arquitectónica · AutoCAD · R41 · Superficies</h2><button id="plan-minus" aria-label="Alejar plano">−</button><output id="plan-zoom" aria-live="polite">100%</output><button id="plan-plus" aria-label="Acercar plano">+</button><button id="plan-fit">Ver lámina completa</button><button id="plan-print">Imprimir</button><a href="${src}" download="AMPM-Local133-Planta-R41.svg">Descargar plano</a><button id="plan-close">Volver al 3D</button></div><div id="plan-viewport" tabindex="0" aria-label="Plano ampliable. Usa más y menos para acercar o alejar, flechas para desplazar."><div id="plan-message" role="status">Cargando plano…</div></div><p id="plan-status">Rueda o botones para ampliar · arrastra para desplazar · escala de impresión 1:40 en A2 · cotas del modelo, verificar en sitio.</p>`;
  document.body.append(dialog);
  const $=s=>dialog.querySelector(s),viewport=$('#plan-viewport');let svg,opening,backFocus,box=[0,0,594,420],drag,pointers=new Map(),pinch;
  function draw(){if(svg)svg.setAttribute('viewBox',box.join(' '));$('#plan-zoom').textContent=Math.round(594/box[2]*100)+'%';}
  function fit(){box=[0,0,594,420];draw();}
  function zoom(factor){const z=Math.max(1,Math.min(10,594/box[2]*factor)),w=594/z,h=420/z;box=[box[0]+(box[2]-w)/2,box[1]+(box[3]-h)/2,w,h];draw();}
  async function open(){backFocus=document.activeElement;dialog.hidden=false;document.body.style.overflow='hidden';document.querySelector('main').inert=true;document.querySelector('header').inert=true;document.querySelector('#viewer-toolbar')?.setAttribute('inert','');const play=document.querySelector('#tour-play');if(play?.textContent.includes('Pausar'))play.click();$('#plan-close').focus();
    try{if(!svg){opening??=fetch(src).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.text();});const xml=await opening;const doc=new DOMParser().parseFromString(xml,'image/svg+xml');if(doc.querySelector('parsererror'))throw Error('Plano inválido');svg=document.importNode(doc.documentElement,true);viewport.append(svg);$('#plan-message').hidden=true;fit();}}
    catch(e){opening=null;$('#plan-message').textContent='No se pudo cargar el plano. Cierra y vuelve a abrir para reintentar.';}
  }
  function close(){dialog.hidden=true;document.body.style.overflow='';document.querySelector('main').inert=false;document.querySelector('header').inert=false;document.querySelector('#viewer-toolbar')?.removeAttribute('inert');backFocus?.focus();}
  document.querySelector('#open-plan').onclick=open;$('#plan-close').onclick=close;$('#plan-plus').onclick=()=>zoom(1.35);$('#plan-minus').onclick=()=>zoom(1/1.35);$('#plan-fit').onclick=fit;
  $('#plan-print').onclick=()=>{fit();window.print();};
  viewport.addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(-e.deltaY*.0015));},{passive:false});
  viewport.onpointerdown=e=>{pointers.set(e.pointerId,[e.clientX,e.clientY]);viewport.setPointerCapture(e.pointerId);drag=[e.clientX,e.clientY];if(pointers.size===2){const [a,b]=[...pointers.values()];pinch=Math.hypot(a[0]-b[0],a[1]-b[1]);}};
  viewport.onpointermove=e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size===2){const[a,b]=[...pointers.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch)zoom(d/pinch);pinch=d;return;}const r=viewport.getBoundingClientRect(),units=Math.max(box[2]/r.width,box[3]/r.height);box[0]-=(e.clientX-drag[0])*units;box[1]-=(e.clientY-drag[1])*units;drag=[e.clientX,e.clientY];draw();};
  viewport.onpointerup=viewport.onpointercancel=e=>{pointers.delete(e.pointerId);pinch=null;if(pointers.size){drag=[...pointers.values()][0];}};
  window.addEventListener('keydown',e=>{if(dialog.hidden)return;if(e.key==='Tab'){const els=[...dialog.querySelectorAll('button,a,[tabindex]')];if(e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===els.at(-1)){e.preventDefault();els[0].focus();}return;}e.stopImmediatePropagation();if(e.key==='Escape')close();if(['+','=','-','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();if(e.key==='+'||e.key==='=')zoom(1.2);else if(e.key==='-')zoom(1/1.2);else{const delta=box[2]*.05;if(e.key==='ArrowLeft')box[0]-=delta;if(e.key==='ArrowRight')box[0]+=delta;if(e.key==='ArrowUp')box[1]-=delta;if(e.key==='ArrowDown')box[1]+=delta;draw();}}},true);
  if(new URLSearchParams(location.search).get('plano')==='1')open();
})();
