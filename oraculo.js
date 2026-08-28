/* ══════════════════════════════════════════════════════════════
   EL RITUAL DE LAS CARTAS — lógica compartida
   ══════════════════════════════════════════════════════════════
   Publica window.Oraculo con un solo método:

     Oraculo.abrir('oraculo')   → mensaje del día, arranca el ritual
     Oraculo.abrir('tarot')     → pide la pregunta y después el ritual
     Oraculo.abrir('anuncio')   → invita primero, el ritual si acepta

   Lo cargan tarot.html e index.html. El markup del <dialog> se
   inyecta desde acá, así no hay dos copias del HTML que mantener.

   Necesita sitio.js cargado antes (usa CONFIG, $, esc, reduceMotion).
   ══════════════════════════════════════════════════════════════ */
window.Oraculo = (function(){
'use strict';

/* Las 24 del oráculo: el mensaje viene impreso en la imagen */
var ORACULO = {
  carpeta: 'cartas/oraculo/',
  cartas: [
    {f:'01.jpg', n:'El cambio y la coherencia'},{f:'02.jpg', n:'Cada cosa a su tiempo'},
    {f:'03.jpg', n:'Crear lo que te propongas'},{f:'04.jpg', n:'Aun quieto estás evolucionando'},
    {f:'05.jpg', n:'Mirarte a vos primero'},{f:'06.jpg', n:'Estás a la altura del desafío'},
    {f:'07.jpg', n:'Un paso a la vez'},{f:'08.jpg', n:'La incomodidad es parte del proceso'},
    {f:'09.jpg', n:'Tu certeza interna'},{f:'10.jpg', n:'Expandí tus alas'},
    {f:'11.jpg', n:'Tu camino es único'},{f:'12.jpg', n:'La gratitud abre puertas'},
    {f:'13.jpg', n:'Hundirse para florecer'},{f:'14.jpg', n:'La bondad te rodea'},
    {f:'15.jpg', n:'Crear a tu tiempo'},{f:'16.jpg', n:'Tu valor es incomparable'},
    {f:'17.jpg', n:'Cuidar o soltar'},{f:'18.jpg', n:'Permeable a la emoción'},
    {f:'19.jpg', n:'La empatía está en vos'},{f:'20.jpg', n:'Reconocer tu lugar'},
    {f:'21.jpg', n:'Tenés protección'},{f:'22.jpg', n:'Calmar la mente'},
    {f:'23.jpg', n:'Tomar la iniciativa'},{f:'24.jpg', n:'No estás solo en esto'}
  ]
};

/* Los 22 arcanos mayores. La palabra clave es el arquetipo tradicional:
   damos el qué, la lectura aplicada a la pregunta es lo que se paga. */
var TAROT = {
  carpeta: 'cartas/tarot/',
  cartas: [
    {f:'00.jpg', n:'El Loco', r:'—',    c:'El salto sin garantías. Empezar de nuevo sin mapa y sin permiso.'},
    {f:'01.jpg', n:'El Mago', r:'I',    c:'Tenés las herramientas sobre la mesa. Falta decidirte a usarlas.'},
    {f:'02.jpg', n:'La Papisa', r:'II', c:'Lo que sabés en silencio y todavía no dijiste en voz alta.'},
    {f:'03.jpg', n:'La Emperatriz', r:'III', c:'Crear, cuidar, hacer crecer algo con tus propias manos.'},
    {f:'04.jpg', n:'El Emperador', r:'IIII', c:'Poner estructura y sostenerla, aunque canse sostenerla.'},
    {f:'05.jpg', n:'El Papa', r:'V',    c:'Buscar guía afuera, o darte cuenta de que la guía sos vos.'},
    {f:'06.jpg', n:'Los Enamorados', r:'VI', c:'Elegir. Y que elegir signifique dejar algo afuera.'},
    {f:'07.jpg', n:'El Carro', r:'VII', c:'Avanzar con fuerza, aunque los caballos tiren para lados distintos.'},
    {f:'08.jpg', n:'La Justicia', r:'VIII', c:'Mirar sin adornos lo que te toca y lo que hiciste.'},
    {f:'09.jpg', n:'El Ermitaño', r:'VIIII', c:'Bajar el ritmo, mirar para adentro, no apurar la respuesta.'},
    {f:'10.jpg', n:'La Rueda de la Fortuna', r:'X', c:'Algo se mueve solo y no depende de vos. Tu parte es cómo lo recibís.'},
    {f:'11.jpg', n:'La Fuerza', r:'XI', c:'La firmeza que no necesita gritar para imponerse.'},
    {f:'12.jpg', n:'El Colgado', r:'XII', c:'Quedarte quieto a propósito y ver todo desde el otro lado.'},
    {f:'13.jpg', n:'El arcano sin nombre', r:'XIII', c:'Lo que termina para que pueda empezar otra cosa. No es castigo, es corte.'},
    {f:'14.jpg', n:'La Templanza', r:'XIIII', c:'Mezclar lo que parecía incompatible, sin apuro y sin forzar.'},
    {f:'15.jpg', n:'El Diablo', r:'XV', c:'Lo que te ata y en el fondo elegís no soltar todavía.'},
    {f:'16.jpg', n:'La Torre', r:'XVI', c:'Lo que se cae de golpe para dejar ver lo que había detrás.'},
    {f:'17.jpg', n:'La Estrella', r:'XVII', c:'La esperanza después del derrumbe. Mostrarte sin escudo.'},
    {f:'18.jpg', n:'La Luna', r:'XVIII', c:'Lo que todavía no se ve claro. El miedo y la imaginación mezclados.'},
    {f:'19.jpg', n:'El Sol', r:'XVIIII', c:'La claridad y lo compartido. Alegría sin culpa.'},
    {f:'20.jpg', n:'El Juicio', r:'XX', c:'Un llamado que te despierta y te pide responder.'},
    {f:'21.jpg', n:'El Mundo', r:'XXI', c:'El ciclo que se cierra completo, antes de que empiece el siguiente.'}
  ]
};

/* ── El modal, inyectado una sola vez ──────────────────────── */
var MARKUP =
'<dialog class="modal" id="modal" aria-labelledby="m-titulo">' +
  '<div class="modal-in">' +
    '<button class="modal-x" type="button" id="cerrar" aria-label="Cerrar">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
    '</button>' +

    /* Paso 0: la invitación (solo cuando entra desde el home) */
    '<div class="anuncio" id="paso-anuncio" hidden>' +
      '<span class="eyebrow" style="color:var(--gold)">Gratis, todos los días</span>' +
      '<h3 id="m-titulo">Tu mensaje del día</h3>' +
      '<p class="sub">Diez segundos para intencionar una pregunta mientras se mezcla el mazo, y una carta del oráculo para hoy.</p>' +
      '<button class="btn btn-gold btn-block" id="anun-si" type="button">Sacar mi carta</button>' +
      '<button class="anun-no" id="anun-no" type="button">Ahora no</button>' +
    '</div>' +

    /* Paso 1: la pregunta (solo tarot) */
    '<div id="paso-preg" hidden>' +
      '<span class="eyebrow" style="color:var(--gold)">Tirada de tarot</span>' +
      '<h3>¿Qué querés preguntar?</h3>' +
      '<p class="sub">Escribila si querés. Le llega a Mayra junto con tu carta, y ahí la conversación arranca sabiendo de qué se trata.</p>' +
      '<div class="preg">' +
        '<label for="preg">Tu pregunta</label>' +
        '<input type="text" id="preg" maxlength="140" placeholder="¿Me conviene dejar el trabajo ahora?" autocomplete="off">' +
        '<p class="op">Podés dejarlo en blanco y pensarla en silencio.</p>' +
      '</div>' +
      '<div style="margin-top:var(--s3)">' +
        '<button class="btn btn-gold btn-block" id="ir-ritual" type="button">Mezclar el mazo</button>' +
      '</div>' +
    '</div>' +

    /* Paso 2: el ritual */
    '<div id="paso-ritual" hidden>' +
      '<span class="eyebrow" style="color:var(--gold)" id="r-kicker">Mensaje del día</span>' +
      '<h3>Pensá tu pregunta</h3>' +
      '<p class="sub">Formulá en silencio eso que necesitás saber. No hace falta que sea nada grande.</p>' +
      '<div class="escena">' +
        '<div class="mazo mezclando" id="mazo" aria-hidden="true"><b></b><b></b><b></b><b></b><b></b></div>' +
        '<div class="chispas" id="chispas" aria-hidden="true"></div>' +
      '</div>' +
      '<p class="timer"><span id="n">10</span><small>Respirá</small></p>' +
    '</div>' +

    /* Paso 3: la revelación */
    '<div id="paso-reveal" hidden>' +
      '<span class="eyebrow" style="color:var(--gold)" id="rev-kicker">Tu carta</span>' +
      '<div class="carta" id="carta">' +
        '<div class="flip" id="flip"><div class="dorso"></div><div class="cara" id="cara"></div></div>' +
      '</div>' +
      '<p class="nombre" id="rev-nombre"></p>' +
      '<p class="num" id="rev-num" hidden></p>' +
      '<p class="tu-preg" id="rev-preg" hidden></p>' +
      '<p class="clave" id="rev-clave"></p>' +
      '<a class="btn btn-gold btn-block" id="rev-cta" href="#">Quiero profundizar en esto</a>' +
      '<p class="nota" id="rev-nota">Mañana te espera otra carta.</p>' +
      '<a class="anun-no" id="rev-mas" href="tarot.html" hidden>Ver la tirada de tarot y qué más hay</a>' +
    '</div>' +
  '</div>' +
'</dialog>';

var modal, modo = 'oraculo', cuenta = null, pregunta = '', montado = false;

function montar(){
  if(montado) return;
  var d = document.createElement('div');
  d.innerHTML = MARKUP;
  document.body.appendChild(d.firstChild);
  modal = document.getElementById('modal');

  $('#chispas').innerHTML = [[12,18],[78,10],[46,4],[88,44],[6,52],[30,72],[70,80],[92,68],[20,38],[58,26],[40,90],[82,26]]
    .map(function(p,i){ return '<s style="left:'+p[0]+'%;top:'+p[1]+'%;animation-delay:'+(i*0.16).toFixed(2)+'s"></s>'; }).join('');

  $('#anun-si').addEventListener('click', function(){ modo = 'oraculo'; ritual(); });
  $('#anun-no').addEventListener('click', function(){ modal.close(); });
  $('#ir-ritual').addEventListener('click', function(){
    pregunta = $('#preg').value.trim();
    ritual();
  });
  $('#preg').addEventListener('keydown', function(e){
    if(e.key === 'Enter'){ e.preventDefault(); $('#ir-ritual').click(); }
  });
  $('#cerrar').addEventListener('click', function(){ modal.close(); });
  modal.addEventListener('click', function(e){ if(e.target === modal) modal.close(); });
  modal.addEventListener('close', function(){ clearInterval(cuenta); });
  montado = true;
}

function wa(t){ return 'https://wa.me/' + CONFIG.tel + '?text=' + encodeURIComponent(t); }
function hoy(){ var d = new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }

/* Una carta por día y por mazo: se guarda en el navegador.
   ⚠️ Escribe en localStorage la PRIMERA vez que corre. No llamarla
   antes de que la persona haya aceptado sacar la carta. */
function cartaDelDia(clave, mazo){
  var g = null;
  try{ g = JSON.parse(localStorage.getItem(clave) || 'null'); }catch(e){}
  if(g && g.d === hoy() && mazo[g.i]) return {carta: mazo[g.i], repetida: true};
  var i = Math.floor(Math.random() * mazo.length);
  try{ localStorage.setItem(clave, JSON.stringify({d: hoy(), i: i})); }catch(e){}
  return {carta: mazo[i], repetida: false};
}

function pintarCara(carpeta, c){
  var cara = $('#cara');
  cara.innerHTML = '<img src="'+carpeta+c.f+'" alt="'+esc(c.n)+'">';
  cara.querySelector('img').addEventListener('error', function(){
    cara.innerHTML = '<div class="ph">'+esc(c.n)+'</div>';
  });
}

function paso(cual){
  ['anuncio','preg','ritual','reveal'].forEach(function(p){
    $('#paso-'+p).hidden = (p !== cual);
  });
}

function revelar(r){
  var esTarot = (modo === 'tarot');
  var c = r.carta;
  $('#carta').classList.toggle('arcano', esTarot);
  pintarCara(esTarot ? TAROT.carpeta : ORACULO.carpeta, c);

  $('#rev-kicker').textContent = esTarot ? 'Tu arcano' : 'Tu mensaje de hoy';
  $('#rev-nombre').textContent = c.n;
  $('#rev-num').hidden = !esTarot;
  if(esTarot) $('#rev-num').textContent = 'Arcano ' + c.r;

  $('#rev-preg').hidden = !(esTarot && pregunta);
  if(esTarot && pregunta) $('#rev-preg').textContent = '“' + pregunta + '”';

  $('#rev-clave').textContent = esTarot
    ? c.c
    : (r.repetida
        ? 'Esta es la carta que sacaste hoy. Volvé mañana y el mazo se mezcla de nuevo.'
        : 'Dejala descansar un rato antes de sacar conclusiones. Lo que primero te molesta suele ser lo que más tenía para decirte.');

  if(esTarot){
    $('#rev-cta').textContent = 'Qué significa para mi pregunta';
    $('#rev-cta').href = wa('Hola Mayra, saqué ' + c.n + ' en la tirada de tarot de la web.' +
      (pregunta ? ' Mi pregunta fue: “' + pregunta + '”.' : '') + ' Quiero entender qué significa para mi caso.');
    $('#rev-nota').textContent = 'Mañana podés sacar otro arcano.';
  }else{
    $('#rev-cta').textContent = 'Quiero profundizar en esto';
    $('#rev-cta').href = wa('Hola Mayra, saqué "' + c.n + '" en el mensaje del día y me quedé pensando. Quiero profundizar en esto.');
    $('#rev-nota').textContent = 'Mañana te espera otra carta.';
  }

  /* Desde el home conviene ofrecer la página de tarot: ahí está la
     tirada de arcanos y las opciones para ir más hondo. */
  var mas = $('#rev-mas');
  if(mas) mas.hidden = !EN_HOME;

  paso('reveal');
  setTimeout(function(){ $('#flip').classList.add('girada'); }, 80);
}

function ritual(){
  var esTarot = (modo === 'tarot');
  var mazo    = esTarot ? TAROT.cartas  : ORACULO.cartas;
  var carpeta = esTarot ? TAROT.carpeta : ORACULO.carpeta;
  var r = cartaDelDia(esTarot ? 'atm_tarot' : 'atm_mdd', mazo);
  (new Image()).src = carpeta + r.carta.f;                     // precarga

  $('#r-kicker').textContent = esTarot ? 'Tirada de tarot' : 'Mensaje del día';
  $('#flip').classList.remove('girada');
  $('#mazo').classList.add('mezclando');
  paso('ritual');

  var n = reduceMotion ? 4 : 10;
  $('#n').textContent = n;
  clearInterval(cuenta);
  cuenta = setInterval(function(){
    n--;
    $('#n').textContent = Math.max(0, n);
    if(n <= 0){
      clearInterval(cuenta);
      $('#mazo').classList.remove('mezclando');
      setTimeout(function(){ revelar(r); }, reduceMotion ? 0 : 420);
    }
  }, 1000);
}

var EN_HOME = false;

function abrir(cual){
  montar();
  EN_HOME = (cual === 'anuncio');
  modo = (cual === 'tarot') ? 'tarot' : 'oraculo';
  pregunta = '';
  $('#preg').value = '';
  if(modal.showModal) modal.showModal();

  if(cual === 'tarot')        paso('preg');
  else if(cual === 'anuncio') paso('anuncio');
  else                        ritual();
}

return {abrir: abrir};
})();
