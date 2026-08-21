/* ══════════════════════════════════════════════════════════════
   A través de Mí — mecánica compartida por todas las páginas
   ══════════════════════════════════════════════════════════════
   Acá vive lo que se repite en todo el sitio: la configuración,
   los ayudantes, el header, el pie, el splash y los reveals.
   Lo propio de cada página (la rueda natal, el ritual de cartas,
   la grilla del calendario) va en el <script> de esa página.

   Se carga ANTES del script de cada página, porque le deja
   disponibles CONFIG, $, $$, esc, ic, waLink, money y mount.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════
   ⚙️ CONFIGURACIÓN — lo único que hace falta editar
   ══════════════════════════════════════════════════════════════ */
var CONFIG = {
  // Formato para wa.me: 54 (país) + 9 (móvil) + 351 (Córdoba) + número, sin espacios.
  // Cambiarlo acá actualiza el pie y TODOS los links de WhatsApp del sitio.
  tel: '5493512040561',

  // Texto visible del teléfono en el pie. Debe coincidir con `tel`.
  telVisible: '+54 9 351 204-0561',

  // Endpoint del formulario de email (Formspree, Getform, Basin…).
  // Ej: 'https://formspree.io/f/xxxxxxxx'. Vacío = cae a WhatsApp.
  formEndpoint: '',

  // ID de Google Analytics 4. Ej: 'G-XXXXXXXXXX'. Vacío = sin analytics.
  ga4: '',

  // Perfil de TikTok. Vacío = no se muestra el ícono.
  tiktok: '',

  moneda: '$'
};

/* ══════════════════════════════════════════════════════════════
   AYUDANTES
   ══════════════════════════════════════════════════════════════ */
var $  = function(s,c){ return (c||document).querySelector(s); };
var $$ = function(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };
var esc = function(s){
  return String(s).replace(/[&<>"']/g, function(m){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
  });
};
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Monta HTML en un nodo SOLO si el nodo existe.
   Sin esto, un selector que no está en esta página tira TypeError
   y todo lo que viene después en el script muere en silencio. */
function mount(sel, html){
  var n = $(sel);
  if(n) n.innerHTML = html;
  return !!n;
}
function setText(sel, txt){
  var n = $(sel);
  if(n) n.textContent = txt;
  return !!n;
}

var ICONS = {
  sparkle:'<path d="M12 2c1.2 7 3 8.8 10 10-7 1.2-8.8 3-10 10-1.2-7-3-8.8-10-10 7-1.2 8.8-3 10-10Z"/>',
  zap:'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  cards:'<rect x="3" y="3" width="11" height="16" rx="2"/><path d="M17.5 5.6 21 6.9a1.6 1.6 0 0 1 1 2l-3.4 9.6a1.6 1.6 0 0 1-2 1L14 18.5"/>',
  planet:'<circle cx="12" cy="11" r="5.2"/><path d="M4.6 16.6c-1.9 1.6-2.9 3-2.5 3.8.7 1.2 5.1-.2 9.9-3s8.2-6.1 7.5-7.3c-.4-.8-2.1-.7-4.4.1"/>',
  wheel:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.4"/><path d="M12 3v3.6M12 17.4V21M3 12h3.6M17.4 12H21"/>',
  calendar:'<rect x="3" y="4.5" width="18" height="16.5" rx="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
  star:'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1L12 2z"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>'
};
function ic(name, color, size){
  return '<svg width="'+(size||20)+'" height="'+(size||20)+'" viewBox="0 0 24 24" fill="none" stroke="'+(color||'#5B3F8C')+'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICONS[name]+'</svg>';
}
function waLink(text){
  return 'https://wa.me/'+CONFIG.tel+'?text='+encodeURIComponent(text || 'Hola Mayra, me gustaría hacerte una consulta.');
}
function money(v){
  if(v === '' || v === null || v === undefined) return null;
  return CONFIG.moneda + Number(v).toLocaleString('es-AR');
}

/* ══════════════════════════════════════════════════════════════
   ANALYTICS
   ══════════════════════════════════════════════════════════════ */
window.dataLayer = window.dataLayer || [];
function track(name, params){
  var p = Object.assign({}, params || {});
  window.dataLayer.push(Object.assign({event:name}, p));
  if(typeof window.gtag === 'function') window.gtag('event', name, p);
}
if(CONFIG.ga4){
  var gs = document.createElement('script');
  gs.async = true;
  gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.ga4;
  document.head.appendChild(gs);
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', CONFIG.ga4);
}

/* ══════════════════════════════════════════════════════════════
   WHATSAPP — un solo lugar arma todos los links
   ══════════════════════════════════════════════════════════════ */
function wireWa(root){
  $$('[data-wa]', root).forEach(function(a){ a.href = waLink(a.dataset.text); });
}
wireWa(document);
document.addEventListener('click', function(e){
  var a = e.target.closest('a[href*="wa.me"]');
  if(!a) return;
  track('whatsapp_click', {ubicacion: a.dataset.loc || 'desconocida', texto: (a.textContent||'').trim().slice(0,40)});
});

/* ══════════════════════════════════════════════════════════════
   MARQUEE
   ══════════════════════════════════════════════════════════════ */
(function(){
  var items = ['Método ATM','Psicofísica','Tarot evolutivo','Carta natal',
               'Equilibrio energético','Bienestar animal','Online'];
  var html = '';
  for(var r=0;r<3;r++) items.forEach(function(i){ html += '<i>'+esc(i)+'<span class="sep">·</span></i>'; });
  mount('#marquee', html);
})();

/* ══════════════════════════════════════════════════════════════
   HEADER — ítem activo según la URL, no según el hash
   ══════════════════════════════════════════════════════════════ */
var SECCION = (function(){
  var p = location.pathname.replace(/\/+$/,'') || '/';
  var f = p.split('/').pop().replace(/\.html$/,'');
  if(p === '/' || f === '' || f === 'index') return 'home';
  if(f === 'mercurio-retrogrado' || p.indexOf('/blog') === 0) return 'blog';
  if(['carta-natal','calendario-lunar','tarot'].indexOf(f) > -1) return 'herramientas';
  return f;
})();

(function(){
  $$('#nav [data-nav]').forEach(function(el){
    var on = el.dataset.nav === SECCION ||
             (el.dataset.nav === 'servicios' && SECCION === 'talleres');
    if(el.tagName === 'A'){
      on ? el.setAttribute('aria-current','page') : el.removeAttribute('aria-current');
    }else{
      on ? el.setAttribute('data-active','') : el.removeAttribute('data-active');
    }
  });
})();

/* ══════════════════════════════════════════════════════════════
   MENÚ MÓVIL (hamburguesa)
   El panel es el mismo <nav> del escritorio: acá solo se abre y
   se cierra. En escritorio el botón está oculto por CSS, así que
   nada de esto llega a correr.
   ══════════════════════════════════════════════════════════════ */
var hdr  = $('.hdr');
var hamb = $('.nav-hamb');

function cerrarMenu(){
  if(!hdr || !hamb) return;
  hdr.classList.remove('abierto');
  hamb.setAttribute('aria-expanded','false');
  hamb.setAttribute('aria-label','Abrir el menú');
}
function abrirMenu(){
  if(!hdr || !hamb) return;
  hdr.classList.add('abierto');
  hamb.setAttribute('aria-expanded','true');
  hamb.setAttribute('aria-label','Cerrar el menú');
}

if(hdr && hamb){
  hamb.addEventListener('click', function(e){
    e.stopPropagation();
    hdr.classList.contains('abierto') ? cerrarMenu() : abrirMenu();
  });

  // Tocar un link del panel navega: cerramos para que al volver
  // con el botón Atrás el menú no aparezca abierto.
  $$('#nav a').forEach(function(a){
    a.addEventListener('click', cerrarMenu);
  });

  // Escape cierra y devuelve el foco a la hamburguesa
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && hdr.classList.contains('abierto')){
      cerrarMenu();
      hamb.focus();
    }
  });

  // Un toque fuera del header cierra
  document.addEventListener('click', function(e){
    if(hdr.classList.contains('abierto') && !e.target.closest('.hdr')) cerrarMenu();
  });

  // Si se agranda la ventana hasta el layout de escritorio, el panel
  // deja de tener sentido: se cierra para no dejar clases colgadas.
  var anchoDesktop = window.matchMedia('(min-width:721px)');
  var alCambiar = function(m){ if(m.matches) cerrarMenu(); };
  anchoDesktop.addEventListener
    ? anchoDesktop.addEventListener('change', alCambiar)
    : anchoDesktop.addListener(alCambiar);
}

/* ══════════════════════════════════════════════════════════════
   DESPLEGABLES DEL MENÚ
   Hover en escritorio; click y teclado en cualquier dispositivo.
   Si hay un chevrón aparte, ese abre y el texto queda para navegar.
   ══════════════════════════════════════════════════════════════ */
var hoverFino = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
var navDrops = $$('.nav-drop');
function closeNavDrop(){
  navDrops.forEach(function(d){
    var b = $('.nav-drop-toggle', d) || $('.nav-drop-btn', d), m = $('.nav-drop-menu', d);
    if(b && b.tagName === 'BUTTON') b.setAttribute('aria-expanded','false');
    if(m) m.hidden = true;
    clearTimeout(d._t);
  });
}
navDrops.forEach(function(drop){
  var menu = $('.nav-drop-menu', drop);
  var btn  = $('.nav-drop-toggle', drop) || $('.nav-drop-btn', drop);
  if(!btn || !menu) return;
  function abrir(){
    closeNavDrop();
    clearTimeout(drop._t);
    if(btn.tagName === 'BUTTON') btn.setAttribute('aria-expanded','true');
    menu.hidden = false;
  }
  if(btn.tagName === 'BUTTON'){
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      btn.getAttribute('aria-expanded') === 'true' ? closeNavDrop() : abrir();
    });
  }
  if(hoverFino){
    drop.addEventListener('mouseenter', abrir);
    drop.addEventListener('mouseleave', function(){ drop._t = setTimeout(closeNavDrop, 180); });
  }
  drop.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ closeNavDrop(); btn.focus(); }
  });
});
document.addEventListener('click', function(e){
  if(!e.target.closest('.nav-drop')) closeNavDrop();
});

/* ══════════════════════════════════════════════════════════════
   REVEAL AL HACER SCROLL
   ══════════════════════════════════════════════════════════════ */
var revealObserver = null;
function observeReveals(){
  if(reduceMotion || !('IntersectionObserver' in window)){
    $$('[data-reveal]').forEach(function(el){ el.classList.add('in'); });
    return;
  }
  if(!revealObserver){
    revealObserver = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, {rootMargin:'0px 0px -8% 0px', threshold:.05});
  }
  $$('[data-reveal]:not(.in)').forEach(function(el){ revealObserver.observe(el); });
}
observeReveals();

/* ══════════════════════════════════════════════════════════════
   BARRA MÓVIL
   Se esconde al llegar al CTA final. Si la página no tiene CTA
   final, queda visible siempre en vez de romperse.
   ══════════════════════════════════════════════════════════════ */
(function(){
  var bar = $('#mbar');
  if(!bar) return;
  var target = $('#cta-final');
  if(!target || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function(entries){
    entries.forEach(function(en){ bar.classList.toggle('hide', en.isIntersecting); });
  }, {threshold:.25}).observe(target);
})();

/* ══════════════════════════════════════════════════════════════
   SPLASH — 800 ms, una vez por sesión, saltable
   Decide por la URL, no por el hash: sin esto aparecería en
   todas las páginas del sitio y no solo al entrar por la puerta.
   ══════════════════════════════════════════════════════════════ */
(function(){
  var sp = $('#splash');
  if(!sp) return;
  var seen = false;
  try{ seen = sessionStorage.getItem('atm_splash') === '1'; }catch(e){}

  if(reduceMotion || seen || SECCION !== 'home'){ sp.remove(); return; }
  try{ sessionStorage.setItem('atm_splash','1'); }catch(e){}

  var done = false;
  function kill(){
    if(done) return;
    done = true;
    sp.classList.add('out');
    setTimeout(function(){ sp.remove(); }, 320);
  }
  setTimeout(kill, 800);
  window.addEventListener('pointerdown', kill, {once:true});
  window.addEventListener('keydown', kill, {once:true});
  window.addEventListener('wheel', kill, {once:true, passive:true});
})();

/* ══════════════════════════════════════════════════════════════
   PIE
   ══════════════════════════════════════════════════════════════ */
setText('#year', new Date().getFullYear());
if(CONFIG.telVisible) setText('#ftr-tel', CONFIG.telVisible);

if(CONFIG.tiktok && $('#ftr-social')){
  var tk = document.createElement('a');
  tk.href = CONFIG.tiktok; tk.target = '_blank'; tk.rel = 'noopener';
  tk.setAttribute('aria-label','TikTok');
  tk.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-1.8V15a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.1A3 3 0 1 0 13 15V4h3z"/></svg>';
  $('#ftr-social').appendChild(tk);
}
