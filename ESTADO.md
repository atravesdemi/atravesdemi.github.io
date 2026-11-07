# Estado del proyecto — atravesdemi.com

Actualizado el **27 de agosto de 2026**.

## Dónde vive el repo

`~/Projects/atravesdemi/`

Se movió desde `~/Documents/zArchive/Planillas viejas/Github/May/Repo/` porque
macOS protege `~/Documents` con TCC y bloqueaba archivos sueltos al azar
(`Operation not permitted` con permisos Unix normales). Pasó tres veces y la
tercera fue bloqueante. **No devolverlo a `~/Documents`, `~/Desktop` ni
`~/Downloads`.**

## Qué se hizo en esta etapa: SEO + GEO

El problema que redefinió el trabajo: los rastreadores de ChatGPT, Claude y
Perplexity **no ejecutan JavaScript**. Como todo el contenido de valor vivía en
arrays de JS, había alrededor de 2.000 palabras ya escritas que ningún motor
generativo podía leer. Google sí las veía, porque ejecuta JS.

Se invirtió el modelo: **el contenido está en el HTML y el JavaScript solo
agrega comportamiento.**

### Lo que ve un rastreador que no ejecuta JavaScript

| página | antes | ahora |
|---|---|---|
| `/` | — | 455 |
| `/servicios` | no existía | **1.084** |
| `/herramientas` | no existía | **843** |
| `/talleres` | no existía | 429 |
| `/blog` | no existía | 206 |
| `/mercurio-retrogrado` | no existía | **976** |
| `/tarot` | 398 | **1.099** |
| `/calendario-lunar` | **146** | **1.326** |
| `/recomendaciones` | 383 | 383 |
| `/carta-natal` | 440 | **pendiente** |

### Arquitectura

- Se pasó de rutas por hash (`#/servicios`) a URLs reales. GitHub Pages sirve
  `/servicios` sin extensión y devuelve 200.
- `index.html` bajó de 118.623 a 28.145 bytes.
- `estilos.css` y `sitio.js` compartidos por las 10 páginas.
- El header y el pie están duplicados pero son **byte-idénticos** en las 9
  páginas con menú (verificado por hash). Todo lo variable lo pone `sitio.js`.
- Las FAQ usan `<details>` nativo: pliegan sin una línea de JavaScript.
- Redireccionador inline en el `<head>` de `index.html` para los links viejos
  `#/servicios` que siguen circulando por WhatsApp. Los 9 casos probados
  aterrizan bien, incluido `#/servicios#valores` y las rutas inventadas.

### Datos estructurados

| página | schema |
|---|---|
| `/` | `WebSite` + `ProfessionalService` + `Person` con `knowsAbout` |
| `/servicios` | `BreadcrumbList` + `Service`×2 + `FAQPage` |
| `/talleres` | `BreadcrumbList` + `Course`×2 |
| `/herramientas` | `BreadcrumbList` + `CollectionPage` con `ItemList` + `FAQPage` |
| `/blog` | `BreadcrumbList` + `Blog` |
| `/mercurio-retrogrado` | `BreadcrumbList` + `BlogPosting` |
| `/tarot` | `BreadcrumbList` + `WebApplication` + `FAQPage` |
| `/calendario-lunar` | `BreadcrumbList` + `WebApplication` + `FAQPage` |

**Sin `aggregateRating` ni `Review`.** Los tres testimonios de la home son
ilustrativos, no reseñas reales: marcarlos como reseñas sería falsear datos
estructurados. Cuando `recomendaciones.html` junte testimonios reales con
permiso, ahí sí corresponde.

**`Course` en vez de `Event`** para los talleres, porque `Event` exige
`startDate` concreto y las fechas dicen "Abril 2026".

### Solo online

Se eliminaron las menciones a atención presencial. Las etiquetas "Presencial"
pasaron a "Por videollamada", el título de la home dejó de decir "en Buenos
Aires", y el schema perdió `GeoCoordinates` y `OpeningHoursSpecification`.
Entró `areaServed` con Argentina, Uruguay, Chile, México, Colombia, Perú y
España, más `availableChannel` virtual. Se mantiene "Buenos Aires, Argentina"
como origen: una entidad sin lugar es más débil para Google y para las IA.

### Correcciones de fondo

- **El artículo de Mercurio retrógrado tenía las fechas mal.** Decía "7 al 31 de
  julio de 2026"; el motor de efemérides del sitio dice **29 de junio al 23 de
  julio**. Y ese período ya pasó. Se reescribió con el próximo real: **24 de
  octubre al 13 de noviembre de 2026, entero en Escorpio** (verificado: entra en
  el grado 21 y sale en el 5, sin cambiar de signo). Se le agregó una tabla con
  los seis períodos de 2026 y 2027; en tres de los de 2027 Mercurio sí cruza de
  signo y va indicado.
- **Typo en `tarot.html`**: "aunque cansé sostenerla" → "aunque canse
  sostenerla".
- **Dos nombres del oráculo estaban en femenino** ("Estás protegida", "Vas
  acompañada"), contra el criterio de no dar por sentado que quien lee es mujer.
  Ahora son "Tenés protección" y "No estás solo en esto".

## Ronda de ajustes del 20 de agosto (feedback de Juan)

**Copy de la home.** Se sacó la pill "Psicofísica" de la foto, "Profesional
psicofísica" pasó a "Técnica psicofísica", y los cuatro tildes de Quién soy
dejaron de ser credenciales para ser beneficios: *Descubrí tu potencial ·
Eliminá tu incertidumbre · Autosuficiencia y autovaloración · Asistencia
animal*. Las menciones visibles a "psicofísica" en la home bajaron de 9 a 6;
las 8 del `<head>` quedan, porque son las que trabajan para SEO.

**Servicios.** El gancho del Método ATM es "Método propio único y personalizado
para acompañarte". El servicio "Psicofísica" pasó a llamarse **"Armonización"**
en todos los títulos visibles; en las descripciones y en el schema se mantiene
"armonización psicofísica", para no perder el término de búsqueda.

**Menú móvil nuevo.** Hamburguesa a la izquierda, logo centrado, y el mismo
`<nav>` del escritorio se despliega como panel a lo ancho. El texto de
"Servicios" y "Herramientas" navega; el chevrón despliega los subítems. Es el
mismo HTML en los dos tamaños: solo cambia el CSS, así que el header sigue
siendo byte-idéntico en las 10 páginas.

**Espaciado móvil.** Entre bandas había 84 px de scroll vacío; quedó en 64. Se
verificó que ninguna página desborda a lo ancho en 390 px.

**Link "Saltar al contenido"** agregado a las 7 páginas que no lo tenían.

**La encuesta.** Obligatorias: 03, 04 (las tres palabras), 06 y el nombre.
Opcionales: 01, 02, 05, 07. Se eliminó el campo de email/WhatsApp y la línea
"Gracias por tomarte el rato". Se corrigió el femenino: la ayuda de la 07 decía
"la que todavía dudaba" y los ejemplos de los radios eran todos nombres de
mujer.

**Pie nuevo en cuatro columnas** (marca · Servicios · Gratis y sin registro ·
Más), inspirado en la estructura de miastral.com. Pasó de 7 a **16 enlaces
internos**, y como está en las 10 páginas, reparte enlaces a todo el sitio.

**`mayra.jpg` era un PNG con extensión `.jpg`**, 913 KB. Convertido a JPEG q86:
179 KB, visualmente indistinguible.

## Anuncio del mensaje del día (22 de agosto)

El home invita a sacar la carta del oráculo, una vez por día, **cuando la
persona scrollea hasta "Quién soy"** — no al entrar. Un modal que tapa el
contenido en la primera pantalla es lo que Google llama *intrusive
interstitial* y pesa en contra en la experiencia de página; además el home ya
tenía un splash de 800 ms y serían dos interrupciones seguidas.

Para no duplicar el ritual en dos páginas se extrajo a un módulo compartido:

- **`oraculo.css`** (6,2 KB) — modal, mazo, chispas, carta.
- **`oraculo.js`** (13,4 KB) — la lógica y los dos mazos. **Inyecta el
  `<dialog>` desde JavaScript**, así tampoco hay dos copias del HTML. Publica
  `Oraculo.abrir('oraculo' | 'tarot' | 'anuncio')`.

`tarot.html` bajó de 48,7 KB a 34,6 KB al quedarse solo con lo suyo.

El modal abre con un paso de invitación y el conteo arranca recién si la
persona acepta. No es un detalle estético: `cartaDelDia()` escribe en
localStorage la primera vez que corre, así que un ritual que empezara solo le
habría gastado la carta del día a quien cerrara el modal sin verla.

Cuando la carta sale desde el home, aparece además un link a `/tarot`, que es
donde están la tirada de arcanos y las opciones para ir más hondo.

Dos cosas que se arreglaron en el camino: `.btn-gold` y `.btn-lav` vivían solo
en el CSS inline de `tarot.html`, así que el botón del modal salía sin estilo en
el home — pasaron a `estilos.css`. Y `.btn-block` estaba definido dos veces.

## Ronda del 27 de agosto: header y pie

### El header salía distinto en cuatro páginas

En `carta-natal`, `tarot`, `calendario-lunar` y `recomendaciones` el header se
veía roto: en escritorio aparecían dos botones ("Escribime por WhatsApp" y
"Escribime") y en móvil el "Escribime" seguía arriba y el logo perdía el
nombre. En el resto del sitio se veía bien.

El HTML del header **era byte-idéntico en las 10 páginas**: el problema estaba
en el CSS. Esas cuatro páginas arrastraban de la etapa anterior una copia de
las reglas de botones dentro de su `<style>` inline, que va **después** del
`<link>` a `estilos.css`. Con la misma especificidad gana el que está último,
así que:

| regla inline duplicada | qué pisaba | qué se veía |
|---|---|---|
| `.btn{display:inline-flex}` | `.hdr-cta{display:none}` de móvil | el "Escribime" de la barra superior en el celular |
| `.btn-block{display:flex}` | `.nav-cta{display:none}` de escritorio | el "Escribime por WhatsApp" duplicado |
| `.brand-name{display:none}` | `.brand-name{display:block}` de móvil | el logo sin "A través de Mí" |

Se borraron esas reglas de las cuatro páginas. Todas viven en `estilos.css` y
el reset ya cubre `button{font:inherit;cursor:pointer}`, así que no hacía falta
repetirlas. En `recomendaciones.html` lo único propio era que el botón de
enviar va más grande: quedó como `#enviar,.gracias .btn{padding:15px 32px}`.

**No se tocó el HTML del header.** Verificado por hash: sigue siendo idéntico
en las 10 páginas, y el pie también.

### El anuncio del oráculo tardaba muy poco

Se abría en el mismo instante en que "Quién soy" asomaba en pantalla, o sea
justo encima del texto que la persona recién empezaba a leer. Ahora exige
`DEMORA` (8 segundos) **de lectura efectiva**: el reloj corre sólo mientras la
sección está a la vista y la pestaña al frente, y se pausa si scrollea de largo
o se va a otra pestaña.

El tiempo se acumula en vez de reiniciarse, para no perder a quien pasa rápido
y vuelve. Se cayó el piso viejo de 1.600 ms desde la carga, que quedó cubierto.
Verificado en el navegador: a los 4 s no hay modal, a los 14 s sí, y sin bajar
a "Quién soy" no aparece nunca.

### El pie

- **Se sacó el teléfono escrito.** La franja de abajo dice sólo "Buenos Aires,
  Argentina · 2026". Se cayó el `<a id="ftr-tel">` de las 10 páginas, el número
  a mano de `404.html`, la línea que lo escribía en `sitio.js` y
  `CONFIG.telVisible`, que quedaba sin uso. `CONFIG.tel` sigue: es el que arma
  todos los links de WhatsApp del sitio.
- **Los íconos de Instagram y WhatsApp quedaron centrados en su círculo.**
  `.ftr-marca svg{margin-bottom:12px}` es la regla que separa el logo de la
  marca del texto, pero por ser un selector descendente también alcanzaba a los
  dos SVG sociales: dentro de un círculo de 38px con `place-items:center`, ese
  margen de 12px los subía 6px. Pasó a `.ftr-marca > svg`, que sólo toma el
  logo, que es hijo directo.

## Estado del despliegue

**Desplegado y en producción:** todo el trabajo de SEO/GEO, las 5 páginas
nuevas, el menú hamburguesa, el pie de cuatro columnas, la encuesta corregida
y los ajustes de copy.

**Listo pero SIN desplegar** — se acumularon dos rondas: el anuncio del
mensaje del día en el home (22 de agosto) y los arreglos de header y pie (27 de
agosto). Como el pie cambió en todas las páginas, hay que subir el sitio entero
menos las imágenes:

| | |
|---|---|
| nuevos | `oraculo.css` · `oraculo.js` |
| modificados | las 11 páginas `.html` · `estilos.css` · `sitio.js` · `guia-edicion.txt` · `ESTADO.md` |

Sin cambios (no hace falta volver a subirlos): `mayra.jpg`, `og-image.jpg`, los
favicons, `sitemap.xml`, `robots.txt`, `llms.txt`, `CNAME`, `cartas/`, `datos/`
y `vendor/`.

Está probado de punta a punta en local: header verificado en escritorio y en
390px, pie verificado con captura, y `estilos.css` y los `<style>` inline con
las llaves balanceadas.

## Lo que falta

### Necesita una URL de Juan

Sin esto tres cosas quedan a medias, y son de las más importantes:

| dónde | qué falta | si queda vacío |
|---|---|---|
| ~~`recomendaciones.html`, `CONFIG.endpoint`~~ | **Resuelto (7 nov 2026):** la encuesta ahora manda cada reseña por email vía Formspree (`formspree.io/p/<proyecto>/f/resenas`), sin pasar por WhatsApp ni por la planilla | — |
| `sitio.js`, `CONFIG.formEndpoint` | Formspree, Getform o similar | la guía gratuita cae a WhatsApp |
| `sitio.js`, `CONFIG.ga4` | el ID `G-XXXXXXXXXX` | sin analytics: no hay forma de medir si todo esto funcionó |

El Apps Script se descartó: las reseñas llegan por email. Para publicar una, mirar "Cómo aparecer" y "permiso_publicar" en el mail; solo con Sí se pega en el HTML.

### Después de desplegar

- [ ] Subir `sitemap.xml` en Search Console y pedir inspección de las URLs
      nuevas: `/servicios`, `/talleres`, `/herramientas`, `/blog`,
      `/mercurio-retrogrado`.
- [ ] Verificar en producción:
      `curl -s -A "GPTBot/1.0" https://atravesdemi.com/calendario-lunar | wc -w`
      Tiene que dar cerca de 1.300. Si da 146, el deploy no tomó.
- [ ] Confirmar que los `.html` y las URLs sin extensión devuelven 200.
- [ ] Probar `atravesdemi.com/#/servicios` desde el celular: tiene que saltar
      solo a `/servicios`.

### Contenido pendiente de Mayra

- [ ] Su biografía (el HTML de la home dice **BORRADOR** en un comentario).
- [ ] El copy del Método ATM.
- [ ] **Los 36 textos de signos de la carta natal.** Ahora están en el HTML, así
      que Google los indexa: antes solo los veía quien calculaba una carta.
      Es el más urgente de esta lista.
- [ ] Los 24 nombres del oráculo.
- [ ] Los precios: 2 en servicios, 2 en tarot, 2 en carta natal.
- [ ] Confirmar que el teléfono +54 9 351 204-0561 recibe mensajes.

### Decisiones técnicas abiertas

- [ ] Nodo lunar medio o verdadero en la carta natal.
- [ ] El desvío de 24' en Quirón.
- [ ] Imágenes de tarot en mayor resolución.
- [ ] Igualar alturas en las tarjetas de `carta-natal.html`.
- [ ] La escalera de precios de tres niveles (gratis / informe / sesión) está
      acordada pero sin construir, y **sin el contador que se reinicia**: es
      urgencia falsa. Alternativas honestas anotadas en `guia-edicion.txt`.

### Propuestas para el home, sin construir

Salieron de mirar miastral.com como referencia. Ninguna está hecha:

1. **Un dato del cielo de hoy, arriba de todo.** Los 5 años de calendario ya
   están calculados: el home podría abrir con "Hoy: Luna en Escorpio, cuarto
   creciente". Cambia solo y da razón para volver. Es la de mejor relación
   esfuerzo/resultado.
2. **Subir las herramientas antes de Servicios.** Hoy están cuartas. Son el
   gancho gratis y lo que más tráfico va a traer.
3. **La guía gratuita en el home.** Hoy está enterrada en `/herramientas`.

Lo que NO conviene copiar de miastral: carrito, membresía, buscador y menú de
20 subítems. Es una tienda con 15 años de archivo; acá hay dos servicios, y esa
densidad haría parecer el sitio vacío.

## Cómo se despliega

Juan sube los archivos a mano por la interfaz web de GitHub. No hacer push
automático.
