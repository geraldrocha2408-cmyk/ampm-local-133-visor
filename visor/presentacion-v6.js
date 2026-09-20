(() => {
 const style=document.createElement('style');
 style.textContent='#download-presentation{order:3;display:inline-flex;align-items:center;padding:10px 13px;border:1px solid #ff8300;border-radius:5px;background:#ff8300;color:#04003f;text-decoration:none;font:700 12px Montserrat,Arial,sans-serif;white-space:nowrap}#viewer-toolbar{flex-wrap:wrap}@media(max-width:700px){#download-presentation{font-size:11px;padding:8px}}';
 document.head.append(style);
 function insert(){const bar=document.getElementById('viewer-toolbar');if(!bar)return;const link=document.createElement('a');link.id='download-presentation';link.href='AMPM Layout RD - 136.42 m2 - Presentacion.pdf';link.download='AMPM Layout RD - 136.42 m2 - Presentacion.pdf';link.type='application/pdf';link.textContent='Descargar PDF';link.title='10 páginas: áreas principales y plano arquitectónico';bar.append(link);const plan=document.getElementById('plan-close');if(plan){const copy=link.cloneNode(true);copy.id='download-presentation-plan';plan.before(copy)}observer.disconnect();}
 const observer=new MutationObserver(insert);observer.observe(document.body,{childList:true,subtree:true});insert();
})();
