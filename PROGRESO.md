# Progreso del sitio

Registro de lo que se fue haciendo y de lo que se publicó. Se actualiza en cada
commit que se sube a `main` (deploy). Cada sesión de trabajo empieza leyendo
este archivo.

Complementa a `ESTADO.md` (estado general y decisiones técnicas). Acá va la
bitácora cronológica.

## Cómo sumar una entrada

Cada vez que se sube algo a producción, agregar arriba de todo, con la fecha,
el commit y una línea por cambio:

```
## AAAA-MM-DD · <commit corto> · <título>
- qué cambió
- qué quedó pendiente o hay que verificar
```

## Pendientes abiertos

- [ ] **Rotar la deploy key de Formspree** (quedó escrita en el chat). Panel de Formspree → proyecto → Reset.
- [ ] Verificar en vivo el carrusel de experiencias con la reseña de Ale.
- [ ] Confirmar que los envíos de Web3Forms lleguen al email (y revisar spam la primera vez).
- [ ] Reseña de Lucas: no entra al carrusel porque se envió antes de las estrellas (no tiene calificación).
- [ ] Clave de solo lectura de Web3Forms (para leer envíos desde acá), guardada en `~/.config/w3f_key` con permisos 600. No pegar la clave en el chat.
- [ ] Revisión semanal de reseñas: Mayra revisa, y se pasan a `datos/testimonios.json` las que tengan 5 estrellas y permiso "Sí".

## Bitácora

## 2026-11-08 · 89b6fe5 · Ajustes de textos, oferta y 4 experiencias
- Consentimiento nuevo debajo del tilde en `recomendaciones.html`.
- Home: subtítulo nuevo, tercer tilde "Empezamos con una charla para conocernos", "Ganá claridad", línea en "Asistencia animal" y "Escribime y lo charlamos".
- Talleres: "Introducción al péndulo" (enero 2027) y tarot pasa a febrero 2027. Faltan las imágenes de las cards.
- Servicios: banner de oferta con reloj de ciclos de 5 días ($30.000, antes $50.000) en valores y en las cards.
- Carrusel: Sole, Lucero y Pedro sumados a `datos/testimonios.json`. Sin estrellas cuando no hay calificación.
- Pendiente: "Conectá con tu guía interior" sigue con fecha de abril 2026.

## 2026-11-07 · bba971b · Experiencia de Ale en el carrusel
- Se agregó la reseña de Ale ("Ale, 35", 5 estrellas, con permiso) a `datos/testimonios.json`.
- Publicado junto con el carrusel (bc66acc).

## 2026-11-07 · bc66acc · Carrusel de experiencias tipo chat
- Reemplaza las tres reseñas ilustrativas de la home por un carrusel que lee `datos/testimonios.json`.
- El JSON arranca vacío: mientras esté vacío, la sección "Experiencias" se oculta y el link de Servicios dice "Dejá tu experiencia".
- Pendiente de verificar en vivo.

## 2026-11-07 · 1e35b10 · Mensaje de agradecimiento con el obsequio
- Texto de la pantalla de gracias: "Tu experiencia para mí es muy valiosa, por eso te obsequio lo siguiente…" con el código de 15%.

## 2026-11-07 · ed48257 · Selector de estrellas y código de 15%
- Primer paso del formulario: calificación de 1 a 5 estrellas (obligatoria).
- Código legible al enviar: primer nombre + `15` + 2 caracteres al azar (ej. `LUCAS15K7`). Se muestra en gracias y viaja en el envío como `codigo_descuento`.
- El descuento es para cualquier calificación, para no sesgar las reseñas.

## 2026-11-07 · c4b4f3c · Envío de reseñas por Web3Forms
- Formspree no mandaba el email de notificación con el plan actual.
- El formulario de `recomendaciones.html` pasa a Web3Forms (access key en el `<form>`, asunto en `subject`, honeypot `botcheck`).
- `ESTADO.md` actualizado.

## 2026-11-07 · f217bff · Reseñas por email con Formspree
- La reseña deja de salir por WhatsApp y se envía por Formspree al proyecto "atravesdemi.com".
- Dominio permitido en Formspree: `atravesdemi.com` (sin `https://` ni ruta).
- Superado por c4b4f3c el mismo día.

## Antes del 7 de noviembre de 2026

Ver `ESTADO.md`: SEO/GEO, páginas nuevas (servicios, talleres, herramientas, blog, mercurio retrógrado), menú hamburguesa, pie de cuatro columnas, anuncio del oráculo y ajustes de header y pie.
