// Keep the same controls and event handlers; move them into the top toolbar.
(() => {
 const bar=document.createElement('nav');bar.id='viewer-toolbar';bar.setAttribute('aria-label','Video y plano de la tienda');document.querySelector('header').after(bar);
 const style=document.createElement('style');style.textContent=`
 body{height:100dvh;display:flex;flex-direction:column;overflow:hidden}body>header{height:82px;flex:0 0 82px}body>main{height:auto;flex:1;min-height:0}
 #viewer-toolbar{display:flex;align-items:center;gap:18px;background:#fff;padding:10px 20px;border-bottom:1px solid #ddd;flex:none}
 #tour-panel{display:flex;align-items:center;gap:8px;flex:1;min-width:0;margin:0;flex-wrap:wrap}
 #tour-panel h3,#plan-entry h3,#plan-entry p,#tour-panel>p:last-child,#tour-panel>label{display:none}
 #tour-panel button,#open-plan{padding:10px 13px;border:1px solid #d8d8df;border-radius:5px;white-space:nowrap;font:600 12px Montserrat,Arial,sans-serif;margin:0}
 #tour-chapter{width:auto;max-width:240px;flex:1;min-width:150px;padding:10px}
 #tour-panel #tour-progress{width:100px!important;margin:0!important;height:7px}
 #tour-status{font-size:11px;color:#596674;margin:0;max-width:180px}
 #plan-entry{margin:0;flex:none;order:2}#open-plan{background:#fff7eb;border-color:#ff8300}
 body.presentation #viewer-toolbar{display:none}body.presentation>header{display:none}body.presentation main{height:100dvh}
 @media(max-width:1050px){#tour-status{display:none}#viewer-toolbar{gap:8px;padding:8px}#tour-panel #tour-progress{width:65px!important}}
 @media(max-width:700px){body>header{height:70px;flex-basis:70px}.brand img{width:105px}.project b{font-size:14px}#viewer-toolbar{flex-wrap:wrap}#tour-panel{flex-basis:100%}#tour-panel button,#open-plan{font-size:11px;padding:8px}#tour-chapter{max-width:none}#plan-entry{margin-left:auto}body>main{grid-template-columns:155px 1fr}aside{padding:12px 8px}.caption{left:10px;bottom:10px;padding:10px;max-width:85%}.refs{width:140px}}
 `;document.head.append(style);
 function move(){for(const id of ['tour-panel','plan-entry']){const e=document.getElementById(id);if(e&&e.parentElement!==bar)bar.append(e)}const views=document.querySelector('#views')?.closest('section');if(views&&views.parentElement.firstElementChild!==views)views.parentElement.prepend(views);if(document.getElementById('tour-panel')&&document.getElementById('plan-entry'))observer.disconnect()}
 const observer=new MutationObserver(move);observer.observe(document.body,{childList:true,subtree:true});move();
})();

