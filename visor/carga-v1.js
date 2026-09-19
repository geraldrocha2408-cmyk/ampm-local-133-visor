// Counts actual downloaded bytes; preparation is reported separately.
window.loadingProgress = {
  async start(prefix) {
    this.received = 0; this.started = performance.now();
    const r = await fetch(`${prefix}.progress.json`);
    if (!r.ok) throw new Error('No se pudo consultar el tamaño del modelo');
    this.total = (await r.json()).bytes;
    this.element = document.querySelector('#loading');
    this.element.style.display = 'grid';
    this.element.innerHTML = `<div style="width:min(420px,85%);text-align:center;color:#04003f"><strong style="font-size:24px">Preparando tu recorrido</strong><p id="load-stage" style="font-size:15px">Descargando modelo y materiales</p><div style="height:14px;background:#e2e1e6;border-radius:20px;overflow:hidden"><div id="load-bar" role="progressbar" aria-label="Descarga del modelo" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" style="height:100%;width:0;background:#ff8300;transition:width .2s"></div></div><p id="load-percent" style="font-size:28px;font-weight:bold;margin:16px 0 6px">0%</p><p id="load-detail" style="font-size:13px;color:#596674">Conectando…</p><p style="font-size:12px;color:#69717d">La primera carga puede tardar unos minutos.<br>Mantén esta página abierta.</p></div>`;
  },
  update() {
    const percent = Math.min(100, Math.floor(this.received / this.total * 100));
    document.querySelector('#load-bar').style.width = percent + '%';
    document.querySelector('#load-bar').setAttribute('aria-valuenow', percent);
    document.querySelector('#load-percent').textContent = percent + '%';
    document.querySelector('#load-detail').textContent = `${(this.received/1e6).toFixed(1)} de ${(this.total/1e6).toFixed(1)} MB descargados`;
  },
  stage(text) { document.querySelector('#load-stage').textContent = text; },
  async download(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`No se pudo descargar ${url} (${r.status})`);
    const chunks = []; const reader = r.body.getReader();
    for (;;) {
      const {done, value} = await reader.read(); if (done) break;
      chunks.push(value); this.received += value.byteLength; this.update();
    }
    return new Blob(chunks);
  },
  async texture(loader, url) {
    const blob = await this.download(url); const objectURL = URL.createObjectURL(blob);
    try { return await loader.loadAsync(objectURL); }
    finally { URL.revokeObjectURL(objectURL); }
  }
};
