// Stable entry points fetch the publication manifest again on every refresh.
(async () => {
  const status = document.getElementById('status');
  try {
    const response = await fetch(`actual.json?t=${Date.now()}`, {cache: 'no-store'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const current = await response.json();
    if (!/^index-r\d+-archivo\.html$/.test(current.file)) throw new Error('Revisión no válida');
    const url = new URL(current.file, location.href);
    const params = new URLSearchParams(location.search);
    // A previously shared model parameter must not pin the fixed link to an old model.
    params.delete('model');
    params.set('actualizacion', current.updated);
    url.search = params.toString();
    const frame = document.createElement('iframe');
    frame.title = `Tienda AM:PM · ${current.revision}`;
    frame.src = url.href;
    frame.addEventListener('load', () => { status.hidden = true; });
    document.body.append(frame);
    document.title = `AM:PM · Última revisión · ${current.revision}`;
  } catch (error) {
    status.textContent = `No se pudo cargar la revisión actual. Vuelve a refrescar. (${error.message})`;
  }
})();
