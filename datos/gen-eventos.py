#!/usr/bin/env python3
"""Convierte datos/lunar.json en HTML estático.

Por qué: los rastreadores de ChatGPT, Claude y Perplexity NO ejecutan
JavaScript. Si las fechas se pintan con fetch(), para ellos la página
está vacía. Este script escribe las mismas fechas en el HTML.

Uso:  python3 gen-eventos.py 2026 8
Se vuelve a correr cuando se quiera adelantar la ventana de 12 meses.
"""
import json, pathlib, sys

REPO = pathlib.Path("/Users/juanescallier/Documents/zArchive/Planillas viejas/Github/May/Repo")
OUT  = pathlib.Path(__file__).parent
MES  = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto',
        'septiembre','octubre','noviembre','diciembre']
SIG  = ['Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio',
        'Sagitario','Capricornio','Acuario','Piscis']
NOM  = {'nueva':'Luna nueva','llena':'Luna llena',
        'creciente':'Cuarto creciente','menguante':'Cuarto menguante'}

j  = json.loads((REPO/'datos'/'lunar.json').read_text(encoding='utf-8'))
y0, m0 = int(sys.argv[1]), int(sys.argv[2])

def titulo(e):
    if e.get('p'):
        return f"{e['p']} {'entra retrógrado' if e['t']=='retro' else 'vuelve directo'}"
    return f"{NOM[e['t']]} en {SIG[e['s']]}"

def ventana(n):
    """n meses a partir de (y0, m0)."""
    for i in range(n):
        y, m = y0 + (m0 - 1 + i)//12, (m0 - 1 + i) % 12 + 1
        clave = f"{y}-{m:02d}"
        if clave in j['meses']:
            yield y, m, j['meses'][clave]['eventos']

# ── 1) caja "Eventos del mes" de herramientas.html: los 4 del mes en curso ──
_, _, ev = next(ventana(1))
caja = '\n'.join(
    f'        <div class="ev-item"><b>{titulo(e)}</b>'
    f'<span>{e["d"]} de {MES[m0-1]} · {e["h"]} h</span></div>'
    for e in ev)
(OUT/'frag-ev-lista.html').write_text(caja + '\n', encoding='utf-8')

# ── 2) lista de 12 meses para calendario-lunar.html ──
partes = []
for y, m, evs in ventana(12):
    filas = '\n'.join(
        f'          <li><b>{titulo(e)}</b> — {e["d"]} de {MES[m-1]} de {y}, {e["h"]} h</li>'
        for e in evs)
    partes.append(
        f'        <div class="mes-ev">\n'
        f'          <h3>{MES[m-1].capitalize()} de {y}</h3>\n'
        f'          <ul>\n{filas}\n          </ul>\n'
        f'        </div>')
(OUT/'frag-12-meses.html').write_text('\n'.join(partes) + '\n', encoding='utf-8')

n = sum(len(e) for _,_,e in ventana(12))
print(f"frag-ev-lista.html: {len(ev)} eventos de {MES[m0-1]} {y0}")
print(f"frag-12-meses.html: {n} eventos fechados en 12 meses")
