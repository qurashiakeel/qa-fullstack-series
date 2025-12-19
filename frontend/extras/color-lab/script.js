const toHex = (v) => parseInt(v).toString(16).padStart(2, '0').toUpperCase();
function copyVal(id) {
  const el = document.getElementById(id);
  navigator.clipboard.writeText(el.value);
  el.select();
}

function parseToRgb(str) {
  const t = document.createElement('div');
  t.style.color = str;
  document.body.appendChild(t);
  const style = window.getComputedStyle(t).color;
  document.body.removeChild(t);
  if (
    style === 'rgba(0, 0, 0, 0)' &&
    str !== 'transparent' &&
    str !== 'rgba(0,0,0,0)'
  )
    return null;
  return style.match(/[\d.]+/g).map(Number);
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max === min) h = s = 0;
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function syncToHexCard(r, g, b, a) {
  document.getElementById('hx-r-sl').value = r;
  document.getElementById('hx-g-sl').value = g;
  document.getElementById('hx-b-sl').value = b;
  document.getElementById('hx-a-sl').value = a;
  updateHX();
}
function syncToRgbCard(r, g, b, a) {
  document.getElementById('rg-r-sl').value = r;
  document.getElementById('rg-g-sl').value = g;
  document.getElementById('rg-b-sl').value = b;
  document.getElementById('rg-a-sl').value = a;
  updateRG();
}
function syncToHslCard(h, s, l, a) {
  document.getElementById('hs-h-sl').value = h;
  document.getElementById('hs-s-sl').value = s;
  document.getElementById('hs-l-sl').value = l;
  document.getElementById('hs-a-sl').value = a;
  updateHS();
}
function syncToOklchCard(l, c, h, a) {
  document.getElementById('ok-l-sl').value = l;
  document.getElementById('ok-c-sl').value = c;
  document.getElementById('ok-h-sl').value = h;
  document.getElementById('ok-a-sl').value = a;
  updateOK();
}

function syncEverythingFromColor(colorString, updateMasterSliders = false) {
  const rgb = parseToRgb(colorString);
  if (!rgb) return;

  const r = rgb[0],
    g = rgb[1],
    b = rgb[2],
    alpha = rgb[3] ?? 1;

  // Update standard cards
  syncToHexCard(r, g, b, alpha * 255);
  syncToRgbCard(r, g, b, alpha);

  const hsl = rgbToHsl(r, g, b);
  syncToHslCard(hsl.h, hsl.s, hsl.l, alpha);

  // Accurate OKLCH extraction via browser engine
  const temp = document.createElement('div');
  temp.style.color = `oklch(from ${colorString} l c h / alpha)`;
  document.body.appendChild(temp);
  const computed = window.getComputedStyle(temp).color;
  document.body.removeChild(temp);

  if (computed.startsWith('oklch')) {
    const parts = computed.match(/[\d.]+/g).map(Number);
    syncToOklchCard(parts[0], parts[1], parts[2], parts[3] ?? 1);
  } else {
    // Fallback for older browsers
    syncToOklchCard(hsl.l / 100, (hsl.s / 100) * 0.12, hsl.h, alpha);
  }

  if (updateMasterSliders) {
    document.getElementById('mH').value = hsl.h;
    document.getElementById('mS').value = hsl.s;
    document.getElementById('mL').value = hsl.l;
    document.getElementById('mA').value = alpha;
  }
}

function updateHX() {
  const r = document.getElementById('hx-r-sl').value,
    g = document.getElementById('hx-g-sl').value,
    b = document.getElementById('hx-b-sl').value,
    a = document.getElementById('hx-a-sl').value;
  document.getElementById('hx-r-in').value = toHex(r);
  document.getElementById('hx-g-in').value = toHex(g);
  document.getElementById('hx-b-in').value = toHex(b);
  document.getElementById('hx-a-in').value = toHex(a);
  const code = `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
  document.getElementById('hx-out').value = code;
  document.getElementById('hex-prev').style.backgroundColor = code;
}

function updateRG() {
  const r = document.getElementById('rg-r-sl').value,
    g = document.getElementById('rg-g-sl').value,
    b = document.getElementById('rg-b-sl').value,
    a = document.getElementById('rg-a-sl').value;
  document.getElementById('rg-r-in').value = r;
  document.getElementById('rg-g-in').value = g;
  document.getElementById('rg-b-in').value = b;
  document.getElementById('rg-a-in').value = a;
  const code = `rgba(${r}, ${g}, ${b}, ${a})`;
  document.getElementById('rgb-out').value = code;
  document.getElementById('rgb-prev').style.backgroundColor = code;
}

function updateHS() {
  const h = document.getElementById('hs-h-sl').value,
    s = document.getElementById('hs-s-sl').value,
    l = document.getElementById('hs-l-sl').value,
    a = document.getElementById('hs-a-sl').value;
  document.getElementById('hs-h-in').value = h;
  document.getElementById('hs-s-in').value = s;
  document.getElementById('hs-l-in').value = l;
  document.getElementById('hs-a-in').value = a;
  const code = `hsla(${h}, ${s}%, ${l}%, ${a})`;
  document.getElementById('hsl-out').value = code;
  document.getElementById('hsl-prev').style.backgroundColor = code;
}

function updateOK() {
  const l = document.getElementById('ok-l-sl').value,
    c = document.getElementById('ok-c-sl').value,
    h = document.getElementById('ok-h-sl').value,
    a = document.getElementById('ok-a-sl').value;
  document.getElementById('ok-l-in').value = l;
  document.getElementById('ok-c-in').value = c;
  document.getElementById('ok-h-in').value = h;
  document.getElementById('ok-a-in').value = a;
  const code = `oklch(${l} ${c} ${h} / ${a})`;
  document.getElementById('ok-out').value = code;
  document.getElementById('ok-prev').style.backgroundColor = code;
}

// Pasting logic for local cards
document.querySelectorAll('.code-input').forEach((input) => {
  input.onchange = (e) => {
    const val = e.target.value;
    const rgb = parseToRgb(val);
    if (!rgb) return;
    const cardType = e.target.closest('.card').dataset.type;
    if (cardType === 'hx')
      syncToHexCard(rgb[0], rgb[1], rgb[2], (rgb[3] ?? 1) * 255);
    if (cardType === 'rg') syncToRgbCard(rgb[0], rgb[1], rgb[2], rgb[3] ?? 1);
    if (cardType === 'hs') {
      const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
      syncToHslCard(hsl.h, hsl.s, hsl.l, rgb[3] ?? 1);
    }
    if (cardType === 'ok') {
      const temp = document.createElement('div');
      temp.style.color = `oklch(from ${val} l c h / alpha)`;
      document.body.appendChild(temp);
      const computed = window.getComputedStyle(temp).color;
      document.body.removeChild(temp);
      if (computed.startsWith('oklch')) {
        const p = computed.match(/[\d.]+/g).map(Number);
        syncToOklchCard(p[0], p[1], p[2], p[3] ?? 1);
      }
    }
  };
});

// Master Logic
document.getElementById('universal-input').onchange = (e) =>
  syncEverythingFromColor(e.target.value, true);
document.querySelectorAll('#mH, #mS, #mL, #mA').forEach(
  (m) =>
    (m.oninput = () => {
      const h = document.getElementById('mH').value,
        s = document.getElementById('mS').value,
        l = document.getElementById('mL').value,
        a = document.getElementById('mA').value;
      syncEverythingFromColor(`hsla(${h}, ${s}%, ${l}%, ${a})`, false);
    })
);

function bind(id, cb) {
  const s = document.getElementById(id + '-sl'),
    i = document.getElementById(id + '-in');
  s.oninput = () => {
    i.value =
      id.includes('-a') &&
      !id.startsWith('rg') &&
      !id.startsWith('hs') &&
      !id.startsWith('ok')
        ? toHex(s.value)
        : s.value;
    cb();
  };
  i.oninput = () => {
    s.value =
      id.includes('-a') &&
      !id.startsWith('rg') &&
      !id.startsWith('hs') &&
      !id.startsWith('ok')
        ? parseInt(i.value, 16) || 0
        : i.value;
    cb();
  };
}

function saveCol(id, prevId) {
  const code = document.getElementById(id).value;
  const color = document.getElementById(prevId).style.backgroundColor;
  const box = document.createElement('div');
  box.className = 'saved-box';
  box.style.backgroundColor = color;
  box.innerHTML = `<button class="del-btn" onclick="event.stopPropagation(); this.parentElement.remove()">✕</button><span>${code}</span>`;
  box.onclick = () => {
    navigator.clipboard.writeText(code);
  };
  document.getElementById('gallery').appendChild(box);
}

[
  'hx-r',
  'hx-g',
  'hx-b',
  'hx-a',
  'rg-r',
  'rg-g',
  'rg-b',
  'rg-a',
  'hs-h',
  'hs-s',
  'hs-l',
  'hs-a',
  'ok-l',
  'ok-c',
  'ok-h',
  'ok-a',
].forEach((id) =>
  bind(
    id,
    id.startsWith('hx')
      ? updateHX
      : id.startsWith('rg')
      ? updateRG
      : id.startsWith('hs')
      ? updateHS
      : updateOK
  )
);

// Initial Load
syncEverythingFromColor('hsla(200, 70%, 50%, 1)', true);
