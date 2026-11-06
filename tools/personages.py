#!/usr/bin/env python3
"""Tekent de personages van het spel en zet ze in de kamers en de portretten.

Elk personage wordt hier één keer getekend, in zijn eigen assenstelsel (de oorsprong ligt tussen de voeten, of bij
zittende personages op het zitvlak), en daarna met translate/scale op de goede plek gezet. Zo zien Sinterklaas,
de Pieten, Ozosnel en de familie er overal hetzelfde uit: in de kamers én in de portretten naast de gesprekken.

In de kamers (scenes/*.svg) staat elk personage tussen twee commentaren:
    <!-- @personage naam --> … <!-- @einde naam -->
Dit script vervangt wat daartussen staat. Gebruik: python3 tools/personages.py
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---------------------------------------------------------------- kleuren
SKIN = {  # (huid, schaduw, wangen)
    'licht': ('#f6cfae', '#dca383', '#f29b8f'),
    'roze': ('#f3c2a4', '#d79c7c', '#ee8f86'),
    'midden': ('#d9a074', '#b67c52', '#e0806e'),
    'bruin': ('#a86b45', '#84502f', '#c8705e'),
    'donker': ('#7a4a2e', '#5e3720', '#a85a48'),
}
GOLD, GOLD_D, GOLD_L = '#e3b23c', '#a8781c', '#fbe39a'
RED, RED_D, RED_L = '#c8202d', '#8e1420', '#e8454c'
INK = '#2a1b14'


def grad(id_, c1, c2, x1=0, y1=0, x2=0, y2=1):
    return f'<linearGradient id="{id_}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient>'


def rgrad(id_, c1, c2, cx=.4, cy=.35, r=.75):
    return f'<radialGradient id="{id_}" cx="{cx}" cy="{cy}" r="{r}"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></radialGradient>'


# ---------------------------------------------------------------- gezicht
def face(p, cx, cy, r, skin='licht', mouth='smile', brows=INK, ears=True, cheeks=True, eyes='open', nose=True):
    """Een rond, vriendelijk gezicht: oren, ogen met een lichtpuntje, wenkbrauwen, neus, wangen en een mond."""
    s, sd, ck = SKIN[skin]
    g = [f'<defs>{rgrad(p + "Sk", s, sd, .42, .35, .8)}</defs>']
    if ears:
        for sx in (-1, 1):
            g.append(f'<ellipse cx="{cx + sx * r * .95:.1f}" cy="{cy + r * .08:.1f}" rx="{r * .2:.1f}" ry="{r * .26:.1f}" fill="{s}" stroke="{sd}" stroke-width="{r * .05:.2f}"/>')
    g.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{r}" ry="{r * 1.06:.1f}" fill="url(#{p}Sk)" stroke="{sd}" stroke-width="{r * .05:.2f}"/>')
    ex, ey = r * .36, cy - r * .02
    for sx in (-1, 1):
        x = cx + sx * ex
        if eyes == 'closed':
            g.append(f'<path d="M{x - r * .13:.1f} {ey:.1f} q{r * .13:.1f} {r * .12:.1f} {r * .26:.1f} 0" stroke="{INK}" stroke-width="{r * .07:.2f}" fill="none" stroke-linecap="round"/>')
        else:
            g.append(f'<ellipse cx="{x:.1f}" cy="{ey:.1f}" rx="{r * .11:.2f}" ry="{r * .15:.2f}" fill="{INK}"/>'
                     f'<circle cx="{x + r * .04:.1f}" cy="{ey - r * .05:.1f}" r="{r * .045:.2f}" fill="#fff"/>')
        if brows:
            g.append(f'<path d="M{x - r * .16:.1f} {ey - r * .27:.1f} q{r * .16:.1f} {-r * .1:.1f} {r * .32:.1f} {r * .02:.1f}" stroke="{brows}" stroke-width="{r * .08:.2f}" fill="none" stroke-linecap="round"/>')
    if cheeks:
        for sx in (-1, 1):
            g.append(f'<ellipse cx="{cx + sx * r * .55:.1f}" cy="{cy + r * .3:.1f}" rx="{r * .17:.1f}" ry="{r * .11:.1f}" fill="{ck}" opacity=".55"/>')
    if nose:
        g.append(f'<ellipse cx="{cx}" cy="{cy + r * .2:.1f}" rx="{r * .14:.1f}" ry="{r * .11:.1f}" fill="{sd}" opacity=".7"/>'
                 f'<circle cx="{cx - r * .04:.1f}" cy="{cy + r * .16:.1f}" r="{r * .04:.2f}" fill="#fff" opacity=".6"/>')
    my = cy + r * .48
    if mouth == 'smile':
        g.append(f'<path d="M{cx - r * .3:.1f} {my:.1f} q{r * .3:.1f} {r * .26:.1f} {r * .6:.1f} 0" stroke="#8a3a2a" stroke-width="{r * .07:.2f}" fill="none" stroke-linecap="round"/>')
    elif mouth == 'open':
        g.append(f'<path d="M{cx - r * .3:.1f} {my - r * .03:.1f} q{r * .3:.1f} {r * .02:.1f} {r * .6:.1f} 0 q{-r * .05:.1f} {r * .34:.1f} {-r * .3:.1f} {r * .34:.1f} q{-r * .25:.1f} 0 {-r * .3:.1f} {-r * .34:.1f}z" fill="#8a2a24"/>'
                 f'<path d="M{cx - r * .14:.1f} {my + r * .24:.1f} q{r * .14:.1f} {-r * .1:.1f} {r * .28:.1f} 0" fill="#e2706a"/>'
                 f'<path d="M{cx - r * .24:.1f} {my:.1f} h{r * .48:.1f} v{r * .06:.1f} h{-r * .48:.1f}z" fill="#fff"/>')
    return ''.join(g)


def soot(cx, cy, r):
    """Roetvegen van de schoorsteen: een paar zachte grijze vegen, geen geschminkt gezicht."""
    return (f'<g fill="#3a2e2a" opacity=".32"><ellipse cx="{cx - r * .55:.1f}" cy="{cy + r * .38:.1f}" rx="{r * .26:.1f}" ry="{r * .1:.1f}" transform="rotate(-18 {cx - r * .55:.1f} {cy + r * .38:.1f})"/>'
            f'<ellipse cx="{cx + r * .45:.1f}" cy="{cy - r * .5:.1f}" rx="{r * .2:.1f}" ry="{r * .08:.1f}" transform="rotate(12 {cx + r * .45:.1f} {cy - r * .5:.1f})"/>'
            f'<ellipse cx="{cx + r * .12:.1f}" cy="{cy + r * .2:.1f}" rx="{r * .1:.1f}" ry="{r * .07:.1f}"/></g>')


def hand(x, y, r, fill, stroke):
    return f'<ellipse cx="{x}" cy="{y}" rx="{r}" ry="{r * 1.1:.1f}" fill="{fill}" stroke="{stroke}" stroke-width="{r * .14:.2f}"/>' \
           f'<path d="M{x - r * .2:.1f} {y - r * .9:.1f} q{r * .9:.1f} {-r * .1:.1f} {r * .9:.1f} {r * .7:.1f}" stroke="{stroke}" stroke-width="{r * .14:.2f}" fill="none" opacity=".6"/>'


# ---------------------------------------------------------------- Sinterklaas
def sint(p, mitre=True, ids=None, staff=True):
    """Sinterklaas, staand, ongeveer 300 eenheden hoog (voeten op 0). ids: {'hair','mitre','staff'} voor de kamer."""
    ids = ids or {}
    d = (f'<defs>{grad(p + "Cape", RED_L, RED_D, 0, 0, 1, 1)}{grad(p + "Gold", GOLD_L, GOLD_D, 0, 0, 1, 0)}'
         f'{grad(p + "Alb", "#fffdf6", "#e2dccb", 0, 0, 1, 0)}{grad(p + "Beard", "#ffffff", "#dcdcdc")}{grad(p + "Mitre", "#e43a42", "#a3151f", 0, 0, 1, 0)}</defs>')
    gid = lambda k: f' id="{ids[k]}"' if k in ids else ''
    g = [d]
    # de staf
    st = (f'<g{gid("staff")}><path d="M58 4 V-258" stroke="{GOLD_D}" stroke-width="7" stroke-linecap="round"/><path d="M57 4 V-258" stroke="{GOLD}" stroke-width="4"/>'
          f'<path d="M58 -256 C58 -292 16 -296 14 -270 C12 -252 34 -248 38 -262" stroke="{GOLD_D}" stroke-width="7" fill="none" stroke-linecap="round"/>'
          f'<path d="M58 -256 C58 -290 18 -294 16 -270 C14 -254 33 -250 37 -262" stroke="{GOLD}" stroke-width="4" fill="none" stroke-linecap="round"/>'
          f'<circle cx="58" cy="-150" r="5" fill="{GOLD}" stroke="{GOLD_D}" stroke-width="1.5"/><circle cx="37" cy="-262" r="3" fill="{RED}"/></g>')
    # de mantel, van achteren
    g.append(f'<path d="M-36 -178 C-62 -150 -76 -60 -80 0 L80 0 C76 -60 62 -150 36 -178 Z" fill="{RED_D}"/>')
    # de mijterlinten
    if mitre:
        g.append(f'<path d="M-14 -226 L-20 -176 L-12 -176 L-6 -224Z M14 -226 L20 -176 L12 -176 L6 -224Z" fill="{RED_D}" stroke="{GOLD}" stroke-width="1.2"/>')
    # de albe (wit kleed) met plooien
    g.append(f'<path d="M-26 -160 L-36 0 L36 0 L26 -160Z" fill="url(#{p}Alb)" stroke="#cfc7b2" stroke-width="1.2"/>'
             f'<path d="M-14 -120 L-20 -2 M8 -110 L12 -2 M-2 -60 L-3 -2" stroke="#d6cfba" stroke-width="1.5" fill="none"/>')
    # de stola, met kruisjes
    for sx in (-1, 1):
        x0 = sx * 9
        g.append(f'<path d="M{x0 - 6} -168 L{x0 + sx * 3 - 7} -18 L{x0 + sx * 3 + 7} -18 L{x0 + 6} -168Z" fill="{RED}" stroke="url(#{p}Gold)" stroke-width="2.4"/>'
                 f'<path d="M{x0 + sx * 2} -46 v12 M{x0 + sx * 2 - 5} -40 h10 M{x0 + sx * 1} -96 v10 M{x0 + sx * 1 - 4} -91 h8" stroke="{GOLD}" stroke-width="2"/>'
                 f'<path d="M{x0 + sx * 3 - 7} -18 l2 8 M{x0 + sx * 3 - 2} -18 l1 8 M{x0 + sx * 3 + 3} -18 l0 8 M{x0 + sx * 3 + 7} -18 l-1 8" stroke="{GOLD}" stroke-width="1.6"/>')
    # de mantel, van voren: twee panden met een gouden rand
    g.append(f'<path d="M-36 -178 C-52 -140 -60 -70 -66 -2 L-34 -2 C-30 -60 -26 -120 -18 -168Z" fill="url(#{p}Cape)"/>'
             f'<path d="M-18 -168 C-26 -120 -30 -60 -34 -2" stroke="url(#{p}Gold)" stroke-width="6" fill="none"/>'
             f'<path d="M36 -178 C52 -140 60 -70 66 -2 L34 -2 C30 -60 26 -120 18 -168Z" fill="url(#{p}Cape)"/>'
             f'<path d="M18 -168 C26 -120 30 -60 34 -2" stroke="url(#{p}Gold)" stroke-width="6" fill="none"/>'
             f'<path d="M-66 -2 H-34 M34 -2 H66" stroke="{GOLD}" stroke-width="5"/>'
             f'<path d="M-50 -120 C-48 -90 -52 -50 -56 -10 M48 -110 C50 -80 54 -40 58 -8" stroke="{RED_D}" stroke-width="2" fill="none" opacity=".6"/>')
    # het schoudermanteltje met de gesp
    g.append(f'<path d="M-42 -170 C-30 -150 30 -150 42 -170 C34 -190 -34 -190 -42 -170Z" fill="url(#{p}Cape)" stroke="url(#{p}Gold)" stroke-width="3"/>'
             f'<circle cx="0" cy="-157" r="5" fill="{GOLD}" stroke="{GOLD_D}" stroke-width="1.5"/><circle cx="0" cy="-157" r="2" fill="{RED}"/>')
    # de linkerarm (gebaar) en de rechterarm (met de staf)
    g.append(f'<path d="M-34 -172 C-50 -150 -46 -126 -30 -118 L-20 -130 C-30 -136 -32 -150 -24 -160Z" fill="url(#{p}Cape)" stroke="{RED_D}" stroke-width="1"/>'
             f'<path d="M-30 -118 L-20 -130" stroke="#fff" stroke-width="5" stroke-linecap="round"/>'
             + hand(-18, -125, 7, '#fbfbf7', '#cfcfc8') + f'<circle cx="-12" cy="-121" r="2.2" fill="{GOLD}" stroke="{RED}" stroke-width="1"/>')
    if staff:
        g.append(st)
    g.append(f'<path d="M30 -170 C48 -160 58 -146 60 -134 L50 -122 C44 -134 36 -146 24 -152Z" fill="url(#{p}Cape)" stroke="{RED_D}" stroke-width="1"/>'
             f'<path d="M50 -122 L60 -134" stroke="#fff" stroke-width="5" stroke-linecap="round"/>' + hand(58, -128, 7.5, '#fbfbf7', '#cfcfc8'))
    # het hoofd: gezicht, haar, baard en snor
    g.append(f'<ellipse cx="-19" cy="-205" rx="7" ry="10" fill="#f4f4ee"/><ellipse cx="19" cy="-205" rx="7" ry="10" fill="#f4f4ee"/>')
    g.append(face(p + 'F', 0, -207, 19, 'roze', mouth=None, brows='#f4f4ee', ears=False))
    g.append(f'<path d="M-19 -204 C-26 -178 -22 -150 -10 -134 C-6 -128 -2 -126 0 -120 C2 -126 6 -128 10 -134 C22 -150 26 -178 19 -204 C14 -192 8 -188 0 -188 C-8 -188 -14 -192 -19 -204Z" fill="url(#{p}Beard)" stroke="#cfcfcf" stroke-width="1"/>'
             f'<path d="M-12 -180 q-3 18 2 32 M-4 -184 q-2 24 2 44 M6 -184 q2 22 -1 40 M13 -178 q2 16 -3 28" stroke="#d4d4d4" stroke-width="1.4" fill="none"/>'
             f'<path d="M0 -194 C-6 -200 -16 -199 -21 -189 C-14 -191 -7 -188 0 -190 C7 -188 14 -191 21 -189 C16 -199 6 -200 0 -194Z" fill="#fff" stroke="#cfcfcf" stroke-width="1"/>'
             f'<ellipse cx="0" cy="-198" rx="4.5" ry="3.8" fill="#e2a184"/>')
    hair = f'<g{gid("hair")}><path d="M-19 -212 C-20 -230 -8 -232 0 -230 C8 -232 20 -230 19 -212 C14 -224 8 -226 0 -226 C-8 -226 -14 -224 -19 -212Z" fill="#f4f4ee"/></g>'
    mit = (f'<g{gid("mitre")}><path d="M-21 -222 C-24 -250 -18 -272 0 -296 C18 -272 24 -250 21 -222Z" fill="url(#{p}Mitre)" stroke="url(#{p}Gold)" stroke-width="3"/>'
           f'<path d="M-21 -232 H21 V-222 H-21Z" fill="url(#{p}Gold)"/><path d="M0 -232 V-292" stroke="url(#{p}Gold)" stroke-width="4"/>'
           f'<path d="M0 -270 V-246 M-9 -260 H9" stroke="{GOLD_L}" stroke-width="4.5" stroke-linecap="round"/>'
           f'<circle cx="-12" cy="-227" r="2" fill="{RED}"/><circle cx="12" cy="-227" r="2" fill="{RED}"/><circle cx="0" cy="-227" r="2.4" fill="#2f6fb1"/></g>')
    g.append(hair)
    if mitre or 'mitre' in ids:
        g.append(mit)
    return ''.join(g)


# ---------------------------------------------------------------- Pieten
PIET_COLS = {
    'hoofd': dict(a='#5b2a86', b='#f2b631', cap='#5b2a86', plume='#ffffff', plume2='#f2b631', skin='midden', hair='#3a2414'),
    'klim': dict(a='#2e7d4f', b='#ef8a2e', cap='#2e7d4f', plume='#f2b631', plume2='#ffffff', skin='licht', hair='#5a3418'),
}


def piet_head(p, c, cx, cy, r, mouth='smile', cap_id=None):
    s, sd, _ = SKIN[c['skin']]
    g = []
    # krullen onder de muts
    for i, (dx, dy, rr) in enumerate([(-.95, .1, .32), (-.82, -.3, .34), (.95, .1, .32), (.82, -.3, .34), (-.5, -.7, .36), (.5, -.7, .36), (0, -.85, .38)]):
        g.append(f'<circle cx="{cx + dx * r:.1f}" cy="{cy + dy * r:.1f}" r="{rr * r:.1f}" fill="{c["hair"]}"/>')
    g.append(face(p, cx, cy, r, c['skin'], mouth=mouth))
    # krullen bovenop het hoofd (te zien als de muts wegwaait)
    g.append(''.join(f'<circle cx="{cx + dx * r:.1f}" cy="{cy + dy * r:.1f}" r="{rr * r:.1f}" fill="{c["hair"]}"/>' for dx, dy, rr in [(-.7, -.72, .3), (-.3, -.95, .32), (.15, -1.0, .32), (.58, -.82, .3), (.85, -.5, .26), (-.88, -.45, .26)]))
    g.append(soot(cx, cy, r))
    # de baret met een grote veer
    g.append((f'<g id="{cap_id}">' if cap_id else '<g>') + f'<path d="M{cx - r * 1.2:.1f} {cy - r * .62:.1f} C{cx - r * 1.3:.1f} {cy - r * 1.35:.1f} {cx + r * 1.2:.1f} {cy - r * 1.55:.1f} {cx + r * 1.32:.1f} {cy - r * .75:.1f} C{cx + r * .6:.1f} {cy - r * .45:.1f} {cx - r * .5:.1f} {cy - r * .4:.1f} {cx - r * 1.2:.1f} {cy - r * .62:.1f}Z" fill="{c["cap"]}" stroke="#1f1530" stroke-width="{r * .05:.2f}" stroke-opacity=".4"/>'
             f'<path d="M{cx - r * 1.15:.1f} {cy - r * .62:.1f} C{cx - r * .4:.1f} {cy - r * .38:.1f} {cx + r * .6:.1f} {cy - r * .42:.1f} {cx + r * 1.3:.1f} {cy - r * .76:.1f}" stroke="{GOLD}" stroke-width="{r * .14:.1f}" fill="none"/>'
             f'<path d="M{cx + r * .7:.1f} {cy - r * 1.05:.1f} C{cx + r * 1.4:.1f} {cy - r * 2.4:.1f} {cx + r * 2.6:.1f} {cy - r * 2.1:.1f} {cx + r * 2.7:.1f} {cy - r * 1.3:.1f} C{cx + r * 2.2:.1f} {cy - r * 1.9:.1f} {cx + r * 1.4:.1f} {cy - r * 1.7:.1f} {cx + r * .95:.1f} {cy - r * .95:.1f}Z" fill="{c["plume"]}" stroke="#bbb" stroke-width="{r * .03:.2f}"/>'
             f'<path d="M{cx + r * .85:.1f} {cy - r * 1.0:.1f} C{cx + r * 1.5:.1f} {cy - r * 1.9:.1f} {cx + r * 2.2:.1f} {cy - r * 1.9:.1f} {cx + r * 2.5:.1f} {cy - r * 1.45:.1f}" stroke="{c["plume2"]}" stroke-width="{r * .12:.1f}" fill="none"/>'
             f'<circle cx="{cx + r * .8:.1f}" cy="{cy - r * .92:.1f}" r="{r * .16:.1f}" fill="{GOLD}" stroke="{GOLD_D}" stroke-width="{r * .04:.2f}"/></g>')
    return ''.join(g)


def ruff(cx, cy, w, h):
    """De witte plooikraag."""
    n = 9
    arcs = ''.join(f'<path d="M{cx - w + i * 2 * w / n:.1f} {cy + h * .55:.1f} q{w / n:.1f} {h * .7:.1f} {2 * w / n:.1f} 0" fill="#fff" stroke="#d8d8d8" stroke-width="1"/>' for i in range(n))
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{w}" ry="{h}" fill="#fff" stroke="#d8d8d8" stroke-width="1.2"/>{arcs}' \
           f'<ellipse cx="{cx}" cy="{cy - h * .15:.1f}" rx="{w * .55:.1f}" ry="{h * .45:.1f}" fill="#efefef"/>'


def piet(p, kind='hoofd', pose='stand', cap_id=None):
    """Een Piet, staand (ongeveer 200 hoog, voeten op 0) met Hoofdpiets lijstje, of zittend (zitvlak op 0) en zwaaiend."""
    c = PIET_COLS[kind]
    s, sd, _ = SKIN[c['skin']]
    a, b = c['a'], c['b']
    d = f'<defs>{grad(p + "A", a, "#1d1430" if kind == "hoofd" else "#173f28", 0, 0, 1, 1)}{grad(p + "B", "#fff3c4", b, 0, 0, 1, 1)}</defs>'
    g = [d]
    if pose == 'stand':
        # benen in maillot, twee kleuren, en schoenen met een gesp
        g.append(f'<path d="M-15 -60 C-16 -40 -15 -20 -13 -6 L-5 -6 C-5 -24 -4 -42 -3 -60Z" fill="{a}"/><path d="M15 -60 C16 -40 15 -20 13 -6 L5 -6 C5 -24 4 -42 3 -60Z" fill="{b}"/>'
                 f'<path d="M-24 0 C-24 -8 -16 -10 -6 -8 C-2 -4 -2 0 -6 0Z" fill="#1d1d1d"/><path d="M24 0 C24 -8 16 -10 6 -8 C2 -4 2 0 6 0Z" fill="#1d1d1d"/>'
                 f'<rect x="-15" y="-8" width="6" height="5" rx="1" fill="{GOLD}"/><rect x="9" y="-8" width="6" height="5" rx="1" fill="{GOLD}"/>')
        # de pofbroek met splitten
        g.append(f'<path d="M-26 -92 C-38 -74 -34 -54 -16 -56 C-8 -52 8 -52 16 -56 C34 -54 38 -74 26 -92Z" fill="url(#{p}A)"/>'
                 f'<path d="M-18 -88 C-22 -74 -20 -62 -16 -58 M-6 -90 C-7 -76 -6 -62 -4 -56 M6 -90 C7 -76 6 -62 4 -56 M18 -88 C22 -74 20 -62 16 -58" stroke="{b}" stroke-width="3.2" fill="none"/>')
        body_y = 0
    else:
        # zittend: bovenbenen naar voren, onderbenen bungelen naar beneden
        g.append(f'<path d="M-14 -2 C-22 10 -26 30 -30 52 L-20 54 C-16 34 -10 16 -4 4Z" fill="{a}"/><path d="M14 -2 C22 10 26 30 30 52 L20 54 C16 34 10 16 4 4Z" fill="{b}"/>'
                 f'<path d="M-36 58 C-36 50 -28 48 -18 50 C-14 54 -14 58 -18 58Z" fill="#1d1d1d"/><path d="M36 58 C36 50 28 48 18 50 C14 54 14 58 18 58Z" fill="#1d1d1d"/>'
                 f'<path d="M-28 -24 C-40 -8 -34 10 -14 8 C-6 12 6 12 14 8 C34 10 40 -8 28 -24Z" fill="url(#{p}A)"/>'
                 f'<path d="M-18 -20 C-22 -8 -20 4 -16 8 M-6 -22 C-7 -8 -6 6 -4 10 M6 -22 C7 -8 6 6 4 10 M18 -20 C22 -8 20 4 16 8" stroke="{b}" stroke-width="3.2" fill="none"/>')
        body_y = 66
    # zittend schuift alles boven de broek 68 omlaag (de broek begint dan op -24 in plaats van -92)
    T = (lambda y: y) if pose == 'stand' else (lambda y: y + 68)
    # het wambuis met knopen en een riem
    g.append(f'<path d="M-21 {T(-136)} C-26 {T(-118)} -26 {T(-102)} -23 {T(-88)} L23 {T(-88)} C26 {T(-102)} 26 {T(-118)} 21 {T(-136)}Z" fill="url(#{p}B)" stroke="#b07a10" stroke-width="1"/>'
             f'<path d="M0 {T(-136)} V{T(-90)}" stroke="{a}" stroke-width="9"/>'
             + ''.join(f'<circle cx="0" cy="{T(y)}" r="2.2" fill="{GOLD}"/>' for y in (-128, -118, -108, -98))
             + f'<rect x="-24" y="{T(-94)}" width="48" height="6" rx="2" fill="#3a2414"/><rect x="-4" y="{T(-95)}" width="8" height="8" rx="1.5" fill="{GOLD}"/>')
    # pofmouwen en armen
    if pose == 'stand':
        # Hoofdpiet houdt zijn lijstje vast
        g.append(f'<ellipse cx="-24" cy="-126" rx="10" ry="12" fill="url(#{p}A)"/><path d="M-30 -132 v14 M-24 -136 v20 M-18 -132 v14" stroke="{b}" stroke-width="2.4"/>'
                 f'<ellipse cx="24" cy="-126" rx="10" ry="12" fill="url(#{p}A)"/><path d="M30 -132 v14 M24 -136 v20 M18 -132 v14" stroke="{b}" stroke-width="2.4"/>'
                 f'<path d="M-28 -116 C-32 -100 -22 -92 -6 -98" stroke="{b}" stroke-width="9" fill="none" stroke-linecap="round"/>'
                 f'<path d="M28 -116 C34 -104 30 -96 22 -94" stroke="{b}" stroke-width="9" fill="none" stroke-linecap="round"/>'
                 f'<g transform="rotate(-8 6 -108)"><rect x="-8" y="-132" width="34" height="44" rx="3" fill="#8a5a2a"/><rect x="-5" y="-128" width="28" height="38" rx="1.5" fill="#fffaf0"/>'
                 f'<rect x="3" y="-135" width="12" height="6" rx="2" fill="{GOLD}"/>'
                 + ''.join(f'<path d="M-1 {y} h3 M5 {y} h14" stroke="#6b4a2a" stroke-width="1.6"/>' for y in (-120, -113, -106, -99))
                 + f'<path d="M-1 -121 l1.5 2 l2.5 -4" stroke="#2e7d4f" stroke-width="1.4" fill="none"/><path d="M-1 -114 l1.5 2 l2.5 -4" stroke="#2e7d4f" stroke-width="1.4" fill="none"/></g>'
                 + hand(-6, -98, 6, '#fbfbf7', '#cfcfc8') + hand(22, -94, 6, '#fbfbf7', '#cfcfc8'))
    else:
        # Klimpiet zwaait met één hand en leunt op zijn knie met de andere
        g.append(f'<ellipse cx="-24" cy="{T(-126)}" rx="10" ry="12" fill="url(#{p}A)"/><path d="M-30 {T(-132)} v14 M-24 {T(-136)} v20 M-18 {T(-132)} v14" stroke="{b}" stroke-width="2.4"/>'
                 f'<ellipse cx="24" cy="{T(-126)}" rx="10" ry="12" fill="url(#{p}A)"/><path d="M30 {T(-132)} v14 M24 {T(-136)} v20 M18 {T(-132)} v14" stroke="{b}" stroke-width="2.4"/>'
                 f'<path d="M-30 {T(-120)} C-44 {T(-130)} -50 {T(-150)} -48 {T(-170)}" stroke="{b}" stroke-width="9" fill="none" stroke-linecap="round"/>'
                 f'<path d="M30 {T(-118)} C40 {T(-104)} 38 {T(-86)} 30 {T(-76)}" stroke="{b}" stroke-width="9" fill="none" stroke-linecap="round"/>'
                 + hand(-48, T(-174), 6.5, '#fbfbf7', '#cfcfc8') + hand(30, T(-74), 6.5, '#fbfbf7', '#cfcfc8'))
    g.append(ruff(0, T(-138), 25, 7.5))
    g.append(piet_head(p + 'H', c, 0, T(-160), 17, mouth='open' if pose != 'stand' else 'smile', cap_id=cap_id))
    return ''.join(g)


# ---------------------------------------------------------------- Ozosnel
def hoof(x):
    return f'<path d="M{x} -6 h12 l1 6 h-14z" fill="#4a4d55"/>'


def stepping(pair, body):
    """Een been dat kan stappen: de klasse hleg + a of b (diagonale paren: dichte voorbeen + verre achterbeen = a).
    Het draait vanuit de heup of de schouder als de kamer de klasse 'walking' op een ouder zet (css: .walking .hleg)."""
    return f'<g class="hleg {pair}">{body}</g>'


def horse_body(p):
    """De romp, de benen en de staart van Ozosnel (naar links kijkend; hoeven op 0)."""
    d = f'<defs>{grad(p + "Coat", "#ffffff", "#c9cbcf")}{grad(p + "Leg", "#f4f4f2", "#b9bcc2")}{grad(p + "Mane", "#c2c7cf", "#7d8590")}</defs>'
    leg = lambda pts, fill: f'<path d="{pts}" fill="{fill}" stroke="#a5a9b0" stroke-width="1.2"/>'
    g = [d]
    # de staart
    g.append(f'<path d="M86 -116 C112 -110 116 -80 108 -52 C104 -36 110 -26 104 -18 C96 -34 92 -46 94 -62 C96 -80 90 -96 80 -104Z" fill="url(#{p}Mane)"/>'
             f'<path d="M92 -104 C104 -88 102 -66 100 -48" stroke="#6d747e" stroke-width="1.5" fill="none"/>')
    # de benen aan de verre kant (iets donkerder)
    g.append(stepping('b', leg('M-40 -80 C-42 -56 -40 -36 -38 -16 L-36 -6 L-26 -6 L-27 -18 C-28 -40 -28 -60 -26 -80Z', '#d7d9dd') + hoof(-37))
             + stepping('a', leg('M50 -84 C58 -64 60 -50 52 -36 C48 -28 50 -16 50 -6 L60 -6 L60 -16 C62 -30 70 -48 66 -84Z', '#d7d9dd') + hoof(50)))
    # de romp
    g.append(f'<path d="M-66 -84 C-82 -100 -82 -128 -66 -140 C-46 -152 -10 -146 30 -146 C66 -146 92 -138 94 -110 C96 -88 82 -74 60 -72 C30 -68 -10 -68 -40 -72 C-52 -74 -60 -78 -66 -84Z" fill="url(#{p}Coat)" stroke="#a5a9b0" stroke-width="1.4"/>'
             f'<path d="M-40 -74 C-20 -82 30 -82 56 -76" stroke="#c4c7cc" stroke-width="2" fill="none"/>'
             f'<path d="M48 -138 C64 -132 76 -120 74 -100" stroke="#e1e3e6" stroke-width="5" fill="none" opacity=".8"/>')
    # appeltjes in de vacht (een schimmel)
    for x, y in [(-30, -110), (-10, -100), (14, -112), (34, -98), (56, -110), (70, -94), (-46, -98)]:
        g.append(f'<circle cx="{x}" cy="{y}" r="5" fill="none" stroke="#d3d6db" stroke-width="1.6"/>')
    # het rode zadelkleed met gouden franje, en het zadel
    g.append(f'<path d="M-36 -146 C-10 -150 22 -150 40 -146 L46 -96 C20 -90 -16 -90 -40 -96Z" fill="{RED}" stroke="{RED_D}" stroke-width="1.5"/>'
             f'<path d="M-40 -96 C-16 -90 20 -90 46 -96" stroke="{GOLD}" stroke-width="4" fill="none"/>'
             + ''.join(f'<path d="M{x} {-95 + abs(x - 3) * .03:.1f} v6" stroke="{GOLD}" stroke-width="2"/>' for x in range(-36, 46, 6))
             + f'<path d="M-36 -146 L-40 -96 M40 -146 L46 -96" stroke="{GOLD}" stroke-width="3"/>'
             f'<path d="M-18 -150 C-14 -166 18 -166 24 -150 C10 -146 -6 -146 -18 -150Z" fill="#6b3a1d" stroke="#3a1d0c" stroke-width="1.2"/>')
    # de benen aan de dichte kant, met knieën, kogels en hoeven
    g.append(stepping('a', leg('M-62 -84 C-64 -60 -60 -44 -58 -30 C-58 -22 -60 -14 -60 -6 L-48 -6 C-48 -16 -46 -24 -46 -32 C-46 -50 -46 -66 -44 -82Z', f'url(#{p}Leg)') + hoof(-60))
             + stepping('b', leg('M66 -86 C80 -70 80 -54 70 -40 C66 -32 68 -18 68 -6 L80 -6 C80 -18 78 -30 82 -40 C92 -58 90 -78 84 -94Z', f'url(#{p}Leg)') + hoof(68)))
    return ''.join(g)


def horse_head(p, bridle=True, eat=False):
    """De hals en het hoofd van Ozosnel, apart, zodat het hoofd kan knikken of grazen."""
    d = f'<defs>{grad(p + "Coat", "#ffffff", "#cfd1d5", 0, 0, 1, 1)}{grad(p + "Mane", "#c2c7cf", "#7d8590")}</defs>'
    g = [d]
    g.append(f'<path d="M-46 -146 C-56 -170 -70 -196 -88 -212 C-96 -220 -110 -222 -118 -214 C-128 -206 -136 -190 -146 -176 C-152 -168 -150 -158 -140 -156 C-130 -154 -122 -160 -112 -168 C-100 -178 -92 -170 -86 -158 C-80 -140 -76 -112 -66 -84 C-56 -100 -44 -120 -46 -146Z" fill="url(#{p}Coat)" stroke="#a5a9b0" stroke-width="1.4"/>'
             f'<path d="M-140 -168 C-146 -164 -146 -158 -140 -157" stroke="#9c9fa6" stroke-width="2" fill="none"/>'
             f'<ellipse cx="-142" cy="-166" rx="3" ry="2" fill="#6d6f76"/>'
             f'<path d="M-130 -158 q6 2 10 -2" stroke="#9c9fa6" stroke-width="1.6" fill="none"/>')
    # oren
    g.append(f'<path d="M-104 -216 L-100 -238 L-92 -214Z" fill="#eceef0" stroke="#a5a9b0" stroke-width="1.2"/><path d="M-102 -218 L-100 -232 L-96 -217Z" fill="#d6b2b2"/>'
             f'<path d="M-94 -214 L-86 -234 L-84 -210Z" fill="#e2e4e7" stroke="#a5a9b0" stroke-width="1.2"/>')
    # de manen en de kuif
    g.append(f'<path d="M-90 -214 C-74 -206 -60 -186 -52 -166 C-46 -150 -40 -140 -34 -132 C-46 -132 -54 -140 -58 -150 C-62 -140 -66 -132 -70 -130 C-70 -148 -76 -162 -82 -172 C-84 -160 -88 -154 -92 -150 C-90 -172 -92 -194 -98 -206Z" fill="url(#{p}Mane)"/>'
             f'<path d="M-104 -214 C-112 -210 -116 -202 -112 -194 C-108 -200 -104 -204 -98 -206Z" fill="url(#{p}Mane)"/>')
    # het oog, met wimpers
    g.append(f'<ellipse cx="-114" cy="-196" rx="4.2" ry="5" fill="{INK}" transform="rotate(-20 -114 -196)"/><circle cx="-112.6" cy="-198" r="1.6" fill="#fff"/>'
             f'<path d="M-119 -200 q4 -5 9 -2" stroke="{INK}" stroke-width="1.4" fill="none"/>')
    if bridle:
        g.append(f'<path d="M-142 -172 C-134 -168 -126 -170 -122 -176 M-122 -176 C-112 -192 -104 -206 -98 -214 M-118 -184 L-132 -160" stroke="{RED}" stroke-width="3" fill="none" stroke-linecap="round"/>'
                 f'<circle cx="-122" cy="-176" r="3" fill="{GOLD}"/>')
    return ''.join(g)


def horse(p, head_id=None, head_class=''):
    hid = f' id="{head_id}"' if head_id else ''
    hc = f' class="{head_class}"' if head_class else ''
    return horse_body(p) + f'<g{hid}{hc}>{horse_head(p + "Hd")}</g>'


def rider(p):
    """Sinterklaas te paard (voor de daken): het paard met een zittende Sint, zijn mantel over de flank."""
    g = [horse_body(p + 'B'), horse_head(p + 'Hd')]
    d = f'<defs>{grad(p + "Cape", RED_L, RED_D, 0, 0, 1, 1)}{grad(p + "Mitre", "#e43a42", "#a3151f", 0, 0, 1, 0)}</defs>'
    g.append(d)
    g.append(f'<path d="M-8 -150 C-26 -150 -34 -120 -30 -88 C-10 -80 26 -80 40 -90 C42 -120 30 -150 14 -152Z" fill="url(#{p}Cape)" stroke="{GOLD}" stroke-width="4"/>'
             f'<path d="M-6 -150 C-8 -180 -6 -208 4 -214 C14 -208 18 -180 16 -150Z" fill="url(#{p}Cape)"/>'
             f'<path d="M0 -152 L2 -200 L8 -200 L10 -152Z" fill="#fffdf6"/>'
             f'<path d="M-6 -196 C-20 -186 -26 -176 -30 -164" stroke="{RED}" stroke-width="9" fill="none" stroke-linecap="round"/>'
             + hand(-30, -162, 5.5, '#fbfbf7', '#cfcfc8'))
    g.append(f'<path d="M24 -96 V-262" stroke="{GOLD_D}" stroke-width="5"/><path d="M24 -258 C24 -284 -4 -286 -6 -266 C-8 -252 10 -250 12 -260" stroke="{GOLD}" stroke-width="5" fill="none" stroke-linecap="round"/>'
             f'<path d="M14 -194 C24 -186 26 -178 24 -168" stroke="{RED}" stroke-width="9" fill="none" stroke-linecap="round"/>' + hand(24, -166, 5.5, '#fbfbf7', '#cfcfc8'))
    g.append(face(p + 'F', 4, -226, 13, 'roze', mouth=None, brows='#f4f4ee', ears=False))
    g.append(f'<path d="M-9 -224 C-13 -206 -8 -192 4 -184 C16 -192 21 -206 17 -224 C12 -214 8 -212 4 -212 C0 -212 -4 -214 -9 -224Z" fill="#fff" stroke="#cfcfcf"/>'
             f'<path d="M4 -217 C0 -221 -6 -220 -9 -214 C-4 -215 0 -213 4 -215 C8 -213 12 -215 17 -214 C14 -220 8 -221 4 -217Z" fill="#fff" stroke="#cfcfcf"/>'
             f'<path d="M-10 -236 C-12 -256 -8 -270 4 -286 C16 -270 20 -256 18 -236Z" fill="url(#{p}Mitre)" stroke="{GOLD}" stroke-width="2.4"/>'
             f'<path d="M-10 -242 H18 V-236 H-10Z" fill="{GOLD}"/><path d="M4 -270 V-252 M-2 -262 H10" stroke="{GOLD}" stroke-width="3"/>')
    return ''.join(g)


# ---------------------------------------------------------------- mensen
def kid(p, skin, hair, style, shirt, hat=None, wave='r'):
    """Een kind achter het hek op de kade (alleen het bovenlijf; oorsprong onder aan het lijf)."""
    s, sd, _ = SKIN[skin]
    g = [f'<path d="M-15 0 C-17 -24 -14 -40 0 -42 C14 -40 17 -24 15 0Z" fill="{shirt}" stroke="#00000033" stroke-width="1"/>']
    # zwaaiende arm
    ax = 1 if wave == 'r' else -1
    g.append(f'<g class="sb-wave"><path d="M{ax * 12} -34 C{ax * 22} -42 {ax * 26} -56 {ax * 24} -70" stroke="{shirt}" stroke-width="8" stroke-linecap="round" fill="none"/>'
             + hand(ax * 24, -73, 4.5, s, sd) + '</g>')
    g.append(f'<path d="M{-ax * 12} -34 C{-ax * 16} -26 {-ax * 16} -16 {-ax * 14} -8" stroke="{shirt}" stroke-width="8" stroke-linecap="round" fill="none"/>')
    if style == 'long':
        g.append(f'<path d="M-14 -60 C-18 -40 -16 -30 -10 -26 L10 -26 C16 -30 18 -40 14 -60Z" fill="{hair}"/>')
    g.append(face(p, 0, -56, 12, skin))
    if style in ('short', 'long'):
        g.append(f'<path d="M-12.5 -58 C-14 -74 -4 -74 0 -72 C6 -76 14 -72 12.5 -58 C8 -66 4 -64 0 -66 C-6 -64 -10 -66 -12.5 -58Z" fill="{hair}"/>')
    elif style == 'curly':
        g.append(''.join(f'<circle cx="{x}" cy="{y}" r="5.5" fill="{hair}"/>' for x, y in [(-10, -64), (-4, -69), (3, -70), (9, -66), (12, -59), (-12, -57)]))
    elif style == 'bun':
        g.append(f'<path d="M-12.5 -58 C-14 -72 12 -74 12.5 -58 C8 -66 -8 -66 -12.5 -58Z" fill="{hair}"/><circle cx="0" cy="-72" r="6" fill="{hair}"/>')
    if hat == 'mitre':
        g.append(f'<path d="M-10 -64 L-8 -86 Q0 -96 8 -86 L10 -64Z" fill="{RED}" stroke="{GOLD}" stroke-width="2"/><path d="M0 -84 v12 M-5 -79 h10" stroke="{GOLD}" stroke-width="2"/>')
    elif hat == 'piet':
        g.append(f'<ellipse cx="0" cy="-67" rx="15" ry="5.5" fill="#2e7d4f"/><path d="M4 -70 C10 -86 22 -84 24 -76 C18 -80 12 -78 8 -68Z" fill="{GOLD}"/>')
    elif hat == 'beanie':
        g.append(f'<path d="M-12.5 -60 C-12 -76 12 -76 12.5 -60Z" fill="#c73f6d"/><rect x="-13" y="-63" width="26" height="5" rx="2" fill="#f3d2e0"/><circle cx="0" cy="-76" r="3.5" fill="#f3d2e0"/>')
    return ''.join(g)


def seated(p, skin, top, legs, hair_draw, extra_front='', extra_back='', mouth='smile', arms=None, shoes='#3a2a20'):
    """Een zittend mens (oorsprong op het zitvlak, hoofd rond y = -96)."""
    s, sd, _ = SKIN[skin]
    g = [extra_back, hair_draw[0]]   # haar aan de achterkant komt achter de schouders
    # benen: bovenbenen recht naar voren (van voren gezien kort), onderbenen naar beneden
    g.append(f'<path d="M-22 18 C-23 32 -22 44 -20 58 L-6 58 C-6 44 -5 32 -4 18Z" fill="{legs}"/><path d="M22 18 C23 32 22 44 20 58 L6 58 C6 44 5 32 4 18Z" fill="{legs}"/>'
             f'<path d="M-30 -12 C-34 6 -30 22 -13 24 C-6 25 -2 22 0 16 C2 22 6 25 13 24 C30 22 34 6 30 -12Z" fill="{legs}" stroke="#00000033" stroke-width="1.2"/>'
             f'<ellipse cx="-13" cy="16" rx="10" ry="7" fill="#ffffff" opacity=".12"/><ellipse cx="13" cy="16" rx="10" ry="7" fill="#ffffff" opacity=".12"/>'
             f'<path d="M0 0 V16" stroke="#00000030" stroke-width="1.4"/>'
             f'<path d="M-24 64 C-24 56 -16 54 -6 56 C-4 60 -4 64 -8 64Z" fill="{shoes}"/><path d="M24 64 C24 56 16 54 6 56 C4 60 4 64 8 64Z" fill="{shoes}"/>')
    # bovenlijf
    g.append(f'<path d="M-28 -6 C-32 -40 -30 -66 -16 -74 C-8 -78 8 -78 16 -74 C30 -66 32 -40 28 -6Z" fill="{top}" stroke="#00000026" stroke-width="1.2"/>'
             f'<path d="M-8 -76 Q0 -68 8 -76" stroke="{sd}" stroke-width="5" fill="none"/>')
    g.append(arms if arms is not None else
             f'<path d="M-25 -62 C-34 -44 -34 -20 -28 -6 C-26 0 -22 4 -18 6" stroke="{top}" stroke-width="12" fill="none" stroke-linecap="round"/>'
             f'<path d="M25 -62 C34 -44 34 -20 28 -6 C26 0 22 4 18 6" stroke="{top}" stroke-width="12" fill="none" stroke-linecap="round"/>'
             + hand(-15, 10, 6, s, sd) + hand(15, 10, 6, s, sd))
    g.append(f'<rect x="-6" y="-84" width="12" height="10" fill="{sd}"/>')
    g.append(face(p, 0, -100, 20, skin, mouth=mouth))
    g.append(hair_draw[1])
    g.append(extra_front)
    return ''.join(g)


def mama(p, mug=True):
    hair = '#d9a04a'   # blond met een gouden, rossige gloed
    back = f'<path d="M-24 -104 C-32 -80 -34 -62 -30 -50 L30 -50 C34 -62 32 -80 24 -104Z" fill="{hair}"/>'
    front = (f'<path d="M-21 -100 C-24 -126 -6 -128 2 -124 C14 -130 26 -120 21 -98 C14 -114 6 -112 -2 -116 C-10 -110 -16 -110 -21 -100Z" fill="{hair}"/>'
             f'<path d="M-20 -102 C-26 -84 -24 -66 -18 -56 M20 -102 C26 -84 24 -66 18 -56" stroke="{hair}" stroke-width="7" fill="none" stroke-linecap="round"/>'
             f'<path d="M-6 -122 C2 -126 10 -122 14 -114" stroke="#f2cf7a" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".8"/>')
    s, sd, _ = SKIN['roze']
    top = '#9b7fd0'
    if mug:
        arms = (f'<path d="M-24 -62 C-34 -44 -24 -30 -6 -34" stroke="{top}" stroke-width="12" fill="none" stroke-linecap="round"/>'
                f'<path d="M24 -62 C34 -44 26 -32 10 -36" stroke="{top}" stroke-width="12" fill="none" stroke-linecap="round"/>'
                f'<g class="wk-mug"><rect x="-6" y="-50" width="18" height="20" rx="3" fill="#f3efe6" stroke="#cfc6b2"/><path d="M12 -45 q8 0 8 6 q0 6 -8 6" stroke="#f3efe6" stroke-width="3" fill="none"/>'
                f'<path d="M-2 -52 h10" stroke="#8a5a3a" stroke-width="2"/><path class="wk-steam" d="M2 -56 q-5 -8 0 -14 q5 -6 0 -12" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/></g>'
                + hand(-6, -36, 6, s, sd) + hand(12, -36, 6, s, sd))
    else:
        arms = None
    return seated(p, 'roze', top, '#2b3f66', (back, front), arms=arms,
                  extra_front=f'<path d="M-18 -44 q18 8 36 0" stroke="#ffffff55" stroke-width="2" fill="none"/>')


def papa(p):
    hair = '#d8b56a'   # kort en blond
    front = (f'<path d="M-20 -104 C-22 -124 -4 -128 4 -124 C16 -128 24 -118 20 -104 C14 -114 6 -114 0 -116 C-8 -112 -14 -112 -20 -104Z" fill="{hair}"/>'
             # een mijter van krantenpapier
             f'<path d="M-18 -116 L-12 -150 Q0 -162 12 -150 L18 -116Z" fill="#efeadf" stroke="#9a9488" stroke-width="1.2"/>'
             + ''.join(f'<path d="M-12 {y} h{20 - (y + 150) * .1:.0f}" stroke="#8a8478" stroke-width="1.2"/>' for y in (-142, -136, -130, -124))
             + f'<rect x="-10" y="-148" width="8" height="5" fill="#8a8478"/>')
    sweater = '#f2f2ee'   # een wit overhemd
    return seated(p, 'licht', sweater, '#8a8478', ('', front),
                  extra_front=f'<path d="M0 -76 V-10" stroke="#c9c9c2" stroke-width="1.5"/><g fill="#5a5a5a"><circle cx="0" cy="-60" r="1.6"/><circle cx="0" cy="-46" r="1.6"/><circle cx="0" cy="-32" r="1.6"/></g><path d="M-8 -76 L0 -68 L8 -76" stroke="#c9c9c2" stroke-width="2" fill="none"/>')


def oma(p):
    hair = '#e8e8e8'
    back = f'<circle cx="0" cy="-126" r="11" fill="{hair}" stroke="#c9c9c9"/>'
    front = (f'<path d="M-21 -98 C-24 -126 -6 -126 0 -122 C8 -126 24 -124 21 -98 C16 -112 8 -114 0 -114 C-8 -114 -16 -112 -21 -98Z" fill="{hair}" stroke="#c9c9c9" stroke-width="1"/>'
             f'<g fill="none" stroke="#6b5a4a" stroke-width="1.8"><circle cx="-7" cy="-101" r="6"/><circle cx="7" cy="-101" r="6"/><path d="M-1 -101 h2 M-13 -102 l-7 -2 M13 -102 l7 -2"/></g>')
    s, sd, _ = SKIN['licht']
    arms = (f'<path d="M-24 -62 C-34 -44 -26 -30 -10 -32" stroke="#7a4fa0" stroke-width="12" fill="none" stroke-linecap="round"/>'
            f'<path d="M24 -62 C34 -44 26 -30 10 -32" stroke="#7a4fa0" stroke-width="12" fill="none" stroke-linecap="round"/>'
            # breinaalden met een oranje sjaal
            f'<path d="M-30 -20 C-10 -26 10 -26 30 -20 L32 -6 C10 -10 -10 -10 -32 -6Z" fill="#e8902e"/>'
            + ''.join(f'<path d="M{x} -22 v14" stroke="#c46a20" stroke-width="1.4"/>' for x in range(-26, 30, 6))
            + f'<path class="knit" d="M-20 -48 L4 -24" stroke="#b8b8b8" stroke-width="2.4"/><path class="knit b" d="M20 -48 L-4 -24" stroke="#b8b8b8" stroke-width="2.4"/>'
            + hand(-8, -32, 6, s, sd) + hand(8, -32, 6, s, sd))
    return seated(p, 'licht', '#7a4fa0', '#5a4a6a', (back, front), arms=arms, shoes='#5a3a2a',
                  extra_front='<g fill="#f2b631"><circle cx="-4" cy="-60" r="2"/><circle cx="-4" cy="-50" r="2"/></g>')


def sem(p):
    """Anne-Lieve, het kleine zusje, staand (oorsprong tussen de voeten), blond met een staartje boven op haar hoofd."""
    s, sd, _ = SKIN['licht']
    hair = '#ecd08a'
    g = [f'<path d="M-10 -30 L-10 -4 M10 -30 L10 -4" stroke="#c73f6d" stroke-width="8" stroke-linecap="round"/>'
         f'<ellipse cx="-11" cy="-2" rx="8" ry="4" fill="#c4302b"/><ellipse cx="11" cy="-2" rx="8" ry="4" fill="#c4302b"/>'
         f'<path d="M-25 -24 L-15 -66 C-8 -71 8 -71 15 -66 L25 -24Z" fill="#f2b631" stroke="#c48a10" stroke-width="1"/>'
         f'<path d="M-25 -24 h50" stroke="#c4302b" stroke-width="3"/>'
         f'<circle cx="0" cy="-50" r="7" fill="#c4302b"/><path d="M-7 -50 h14 M0 -57 v14" stroke="#fff" stroke-width="1.6"/>'
         f'<path d="M-14 -62 C-26 -70 -30 -84 -26 -92" stroke="#f2b631" stroke-width="8" fill="none" stroke-linecap="round"/>'
         f'<path d="M14 -62 C26 -70 30 -84 26 -92" stroke="#f2b631" stroke-width="8" fill="none" stroke-linecap="round"/>'
         + hand(-26, -95, 5.5, s, sd) + hand(26, -95, 5.5, s, sd)]
    # halflang haar, en een staartje boven op het hoofd
    g.append(f'<path d="M-17 -94 C-22 -80 -21 -70 -16 -64 M17 -94 C22 -80 21 -70 16 -64" stroke="{hair}" stroke-width="7" fill="none" stroke-linecap="round"/>')
    g.append(face(p, 0, -88, 17, 'licht', mouth='open'))
    g.append(f'<path d="M-17 -90 C-18 -108 -6 -108 0 -106 C6 -108 18 -108 17 -90 C12 -100 6 -98 0 -100 C-6 -98 -12 -100 -17 -90Z" fill="{hair}"/>')
    g.append(f'<circle cx="0" cy="-107" r="3" fill="#c73f6d"/><path d="M0 -108 C-4 -120 -12 -124 -8 -130 C-2 -126 2 -120 0 -108 C4 -120 12 -126 10 -132 C14 -124 6 -116 0 -108Z" fill="{hair}"/>')
    return ''.join(g)


def silvie(p):
    """Silvie, de grote zus, staand (oorsprong tussen de voeten), met lang goudblond haar en een wit jasje."""
    s, sd, _ = SKIN['licht']
    hair = '#dca24c'   # blond met een gouden, rossige gloed
    jacket, inner = '#f3ecdc', '#8a3fa0'
    g = [f'<path d="M-12 -4 C-13 -30 -12 -50 -10 -72 L-2 -72 C-2 -50 -3 -30 -4 -4Z M12 -4 C13 -30 12 -50 10 -72 L2 -72 C2 -50 3 -30 4 -4Z" fill="#2b3f66"/>'
         f'<ellipse cx="-9" cy="-2" rx="9" ry="4.5" fill="#f3efe6" stroke="#bdb6a6"/><ellipse cx="9" cy="-2" rx="9" ry="4.5" fill="#f3efe6" stroke="#bdb6a6"/>',
         # lang haar achter de schouders
         f'<path d="M-20 -150 C-28 -126 -28 -104 -22 -96 L22 -96 C28 -104 28 -126 20 -150Z" fill="{hair}"/>',
         f'<path d="M-18 -70 C-22 -96 -20 -118 -12 -124 C-6 -128 6 -128 12 -124 C20 -118 22 -96 18 -70Z" fill="{jacket}" stroke="#00000026" stroke-width="1.2"/>'
         f'<path d="M-7 -124 L0 -100 L7 -124Z M-6 -100 h12 v28 h-12z" fill="{inner}"/>'
         f'<path d="M-15 -118 C-24 -100 -24 -84 -20 -72" stroke="{jacket}" stroke-width="9" fill="none" stroke-linecap="round"/>'
         f'<path d="M15 -118 C24 -100 24 -84 20 -72" stroke="{jacket}" stroke-width="9" fill="none" stroke-linecap="round"/>'
         + hand(-20, -69, 5, s, sd) + hand(20, -69, 5, s, sd),
         f'<rect x="-5" y="-134" width="10" height="9" fill="{sd}"/>',
         face(p, 0, -148, 17, 'licht'),
         f'<path d="M-18 -146 C-20 -168 -6 -170 0 -167 C8 -170 20 -166 18 -146 C12 -158 4 -156 -2 -160 C-8 -156 -14 -156 -18 -146Z" fill="{hair}"/>'
         f'<path d="M-17 -148 C-21 -132 -20 -118 -16 -108 M17 -148 C21 -132 20 -118 16 -108" stroke="{hair}" stroke-width="6" fill="none" stroke-linecap="round"/>',
         # het kettinkje met de S
         f'<path d="M-6 -124 Q0 -114 6 -124" stroke="{GOLD}" stroke-width="1.4" fill="none"/><text x="0" y="-112" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="8" font-weight="700" fill="{GOLD}">S</text>']
    return ''.join(g)


def mayor(p):
    s, sd, _ = SKIN['licht']
    g = [f'<path d="M-12 -70 L-12 -4 M10 -70 L10 -4" stroke="#1f1f24" stroke-width="13"/>'
         f'<ellipse cx="-14" cy="-2" rx="10" ry="4" fill="#111"/><ellipse cx="12" cy="-2" rx="10" ry="4" fill="#111"/>'
         f'<path d="M-24 -124 C-28 -100 -26 -80 -22 -66 L22 -66 C26 -80 28 -100 24 -124 C14 -130 -14 -130 -24 -124Z" fill="#26262e"/>'
         f'<path d="M-8 -128 L0 -100 L8 -128Z" fill="#fff"/><path d="M-2 -122 L0 -104 L2 -122Z" fill="{RED}"/>'
         f'<path d="M-22 -122 C-32 -104 -30 -84 -20 -72" stroke="#26262e" stroke-width="11" fill="none" stroke-linecap="round"/>'
         f'<path d="M22 -122 C32 -104 30 -84 20 -72" stroke="#26262e" stroke-width="11" fill="none" stroke-linecap="round"/>'
         + hand(-19, -70, 5.5, s, sd) + hand(19, -70, 5.5, s, sd)
         + f'<path d="M-18 -126 C-14 -98 14 -98 18 -126" stroke="{GOLD}" stroke-width="3.5" fill="none" stroke-dasharray="4 2"/>'
         f'<circle cx="0" cy="-102" r="7" fill="{GOLD}" stroke="{GOLD_D}" stroke-width="1.5"/><path d="M-3 -102 h6 M0 -105 v6" stroke="{GOLD_D}" stroke-width="1.2"/>']
    g.append(face(p, 0, -146, 16, 'licht'))
    g.append(f'<path d="M-16 -146 C-18 -164 -4 -166 2 -164 C12 -166 18 -158 16 -146 C12 -156 6 -158 -2 -158 C-8 -156 -12 -152 -16 -146Z" fill="#9a9a9a"/>'
             f'<g fill="none" stroke="#3a3a3a" stroke-width="1.4"><rect x="-11" y="-151" width="9" height="7" rx="2"/><rect x="2" y="-151" width="9" height="7" rx="2"/><path d="M-2 -148 h4"/></g>')
    return ''.join(g)


def keeper(p):
    """De sluiswachter met griep, in zijn raam: een pet, een dikke sjaal en een rode neus."""
    g = [f'<path d="M-22 40 C-22 18 -14 10 0 10 C14 10 22 18 22 40Z" fill="#2f5a8a"/>'
         f'<path d="M-16 12 C-6 18 6 18 16 12 L16 22 C6 28 -6 28 -16 22Z" fill="#c4302b"/><path d="M8 22 L12 38 L18 36 L14 20Z" fill="#c4302b"/>']
    g.append(face(p, 0, -6, 15, 'licht', mouth='smile', eyes='closed'))
    g.append(f'<circle cx="0" cy="-3" r="4" fill="#e2483d"/>'
             f'<path d="M-16 -12 C-16 -26 16 -26 16 -12Z" fill="#1f3a5a"/><path d="M-4 -14 h26 q2 4 -2 5 h-24z" fill="#16304a"/>')
    return ''.join(g)


# ---------------------------------------------------------------- portretten
def portrait(name, title, bg, body, tx, ty, sc):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><title>{title}</title>'
            f'<defs><clipPath id="clip"><rect width="120" height="120" rx="14"/></clipPath>{rgrad("bg", bg[0], bg[1], .5, .3, .9)}</defs>'
            f'<g clip-path="url(#clip)"><rect width="120" height="120" fill="url(#bg)"/>'
            f'<g transform="translate({tx} {ty}) scale({sc})">{body}</g></g></svg>\n')


def you(p):
    """Jij, de Hulppiet: een kind met een groene Pietenmuts (alleen voor het portret)."""
    s, sd, _ = SKIN['licht']
    g = [f'<path d="M-40 60 C-40 20 -24 6 0 6 C24 6 40 20 40 60Z" fill="#4f9a4a"/>', ruff(0, 8, 24, 7)]
    g.append(face(p, 0, -20, 22, 'licht', mouth='open'))
    g.append(f'<path d="M-22 -24 C-26 -46 -6 -50 2 -46 C14 -50 26 -42 22 -24 C16 -36 8 -38 0 -38 C-8 -36 -16 -34 -22 -24Z" fill="#7a4a26"/>')
    g.append(f'<path d="M-28 -36 C-30 -62 26 -66 30 -40 C14 -34 -12 -32 -28 -36Z" fill="#2e7d4f"/><path d="M-28 -36 C-12 -32 14 -34 30 -40" stroke="{GOLD}" stroke-width="3" fill="none"/>'
             f'<path d="M14 -52 C24 -74 44 -72 48 -60 C40 -66 28 -64 20 -48Z" fill="{GOLD}"/>')
    return ''.join(g)


def koek(p):
    return (f'<path d="M0 -50a16 16 0 0 1 16 16 a16 16 0 0 1 -5 12 l22 12 -5 10 -19 -7 5 16 11 25 -10 5 -15 -22 -15 22 -10 -5 11 -25 5 -16 -19 7 -5 -10 22 -12 a16 16 0 0 1 -5 -12 a16 16 0 0 1 16 -16z" fill="#b8742f" stroke="#7a4518" stroke-width="3" stroke-linejoin="round"/>'
            f'<circle cx="-6" cy="-36" r="3" fill="#4a2a10"/><circle cx="6" cy="-36" r="3" fill="#4a2a10"/><circle cx="-5" cy="-37" r="1" fill="#fff"/><circle cx="7" cy="-37" r="1" fill="#fff"/>'
            f'<path d="M-7 -28 q7 6 14 0" stroke="#4a2a10" stroke-width="3" fill="none" stroke-linecap="round"/>'
            f'<ellipse cx="0" cy="-4" rx="4" ry="6" fill="#f3e2c4"/><ellipse cx="0" cy="10" rx="4" ry="6" fill="#f3e2c4"/>'
            f'<path d="M-20 -8 l8 4 M20 -8 l-8 4" stroke="#7a4518" stroke-width="3"/>'
            f'<path d="M-8 -48 q8 -4 16 0" stroke="#f3e2c4" stroke-width="2.4" fill="none"/>')


PORTRAITS = {
    'sint': ('Sinterklaas', ('#8e1c26', '#3e0a10'), lambda: sint('pS', staff=False), 60, 216, .72),
    'hoofd': ('Hoofdpiet', ('#6a3a96', '#2a1240'), lambda: piet('pH', 'hoofd'), 50, 296, 1.5),
    'piet': ('Klimpiet', ('#2e7d4f', '#10301e'), lambda: piet('pK', 'klim', 'sit'), 62, 214, 1.45),
    'paard': ('Ozosnel', ('#7e9fb4', '#2e4656'), lambda: horse_head('pP'), 196, 292, 1.2),
    'mama': ('Mama', ('#3c5c4a', '#162a20'), lambda: mama('pM', mug=False), 60, 222, 1.55),
    'burg': ('De burgemeester', ('#3a4a6a', '#141c2e'), lambda: mayor('pB'), 60, 284, 1.6),
    'you': ('Jij, de Hulppiet', ('#8e1c26', '#3e0a10'), lambda: you('pY'), 58, 82, 1.1),
    'koek': ('De speculaaspop', ('#7a4a26', '#2e1a0c'), lambda: koek('pC'), 60, 66, 1.05),
}

# ---------------------------------------------------------------- in de kamers
def place(body, tx, ty, sc=1, flip=False):
    sx = -sc if flip else sc
    return f'<g transform="translate({tx} {ty}) scale({sx} {sc})">{body}</g>'


SCENES = {
    'boot': {
        'sint': lambda: place(sint('sbS', mitre=False, ids={'hair': 'sb-hair', 'mitre': 'sb-mitre', 'staff': 'sb-staff'}), 589, 546, .84),
        'hoofd': lambda: place(piet('sbH', 'hoofd'), 1201, 546, 1.0),
        'paard': lambda: '<g id="sb-horsewalk">' + place(horse('sbP', head_id='sb-horsehead'), 1352, 546, .84) + '</g>',
        'mast': lambda: place(piet('sbM', 'klim', pose='sit'), 1001, 200, .5),
        'kids': lambda: ''.join(place(f'<g class="sb-kid{" b" if i % 2 else ""}">' + kid(f'sbK{i}', *a) + '</g>', x, 590, 1.05)
                                for i, (x, a) in enumerate([(26, ('licht', '#e5b84a', 'long', '#2f6fb1', 'mitre', 'r')), (74, ('bruin', '#1f1f1f', 'curly', '#e07a2e', None, 'l')),
                                                            (122, ('roze', '#8a4a20', 'short', '#4f9a4a', 'piet', 'r')), (168, ('midden', '#2a1a10', 'bun', '#c73f6d', 'beanie', 'l')),
                                                            (214, ('licht', '#c8682a', 'short', '#6a4fb0', 'mitre', 'r')), (258, ('donker', '#141414', 'curly', '#2f6fb1', 'piet', 'l'))])),
        'burg': lambda: place(mayor('sbB'), 331, 608, .92),
        'sluis': lambda: place(keeper('sbL'), 145, 506, .9),
    },
    'kamer': {
        'mama': lambda: place(mama('wkM'), 510, 560, 1.0),
    },
    'dak': {
        'piet': lambda: place(piet('dkP', 'klim', pose='sit', cap_id='dk-cap'), 945, 636, 1.3),
        'sint': lambda: place(rider('dkR'), 1180, 381, .42),
    },
    'dak2': {
        'piet': lambda: place(piet('d2P', 'klim', pose='sit'), 900, 436, .9),
    },
    'feest': {
        'papa': lambda: place(papa('paD'), 432, 560, 1.0),
        'oma': lambda: place(oma('paO'), 530, 560, .96),
        'mama': lambda: place(mama('paM', mug=False), 628, 560, 1.0),
        'sem': lambda: place(sem('paS'), 666, 724, .9),
        'silvie': lambda: place(silvie('paV'), 214, 812, 1.3),
        'zwaai': lambda: place(sint('paW', staff=True), 1296, 356, .15) + place(piet('paWP', 'klim', 'sit'), 1334, 343, .17),
    },
}


def main():
    for scene, parts in SCENES.items():
        path = os.path.join(ROOT, 'scenes', scene + '.svg')
        src = open(path, encoding='utf-8').read()
        for name, fn in parts.items():
            pat = re.compile(r'(<!--\s*@personage\s+' + re.escape(name) + r'\s*-->)(.*?)(<!--\s*@einde\s+' + re.escape(name) + r'\s*-->)', re.S)
            if not pat.search(src):
                raise SystemExit(f'{scene}.svg: geen plek voor personage "{name}"')
            src = pat.sub(lambda m: m.group(1) + fn() + m.group(3), src)
        open(path, 'w', encoding='utf-8').write(src)
    for name, (title, bg, fn, tx, ty, sc) in PORTRAITS.items():
        open(os.path.join(ROOT, 'portraits', name + '.svg'), 'w', encoding='utf-8').write(portrait(name, title, bg, fn(), tx, ty, sc))
    print('Personages getekend.')


if __name__ == '__main__':
    main()
