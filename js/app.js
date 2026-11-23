/* ==========================================================================
   CHUBBY’S, THE DESSERT STUDIO  |  js/app.js
   Load order in index.html: js/config.js, js/menu-data.js, js/app.js
   Settings are in config.js, menu and prices in menu-data.js.

   SECTIONS (search for the number)
   01. HELPERS AND STATE
   02. MENU RENDERING
   03. ORDER CART
   03b. ORDER PAGE (slip, details card, note chips, rolling total)
   04. GLOBAL CLICK HANDLER
   05. SEND ORDER ON WHATSAPP
   06. PAGE ROUTER AND PAGE TRANSITION
   07. SCROLL EFFECTS
   08. ORDER HELPERS
   09. PHOTO SLOTS
   10. PRELOADER
   11. HERO SWIRL STAGE
   12. REELS (VIDEO SECTION)
   13. SCROLL REVEAL
   14. MENU ACTIONS
   15. SPIN FEATURE (slot machine)
   ========================================================================== */

/* ======================================================================
   01. HELPERS AND STATE
   $ = find one element, $$ = find all, rs = format price, cart = what the customer has added.
   ====================================================================== */

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

const rs = n => '₹' + n;

let cart = {}, page = 'home', want = null, busy = false, mode = 'Dine in';

/* ======================================================================
   02. MENU RENDERING
   Builds the menu page list and the category chips from js/menu-data.js. IC = small line icons per category.
   ====================================================================== */

/* Item ids look like "categoryIndex-itemIndex" (see js/menu-data.js).
   The add-on and box buttons are found by NAME so reordering the menu cannot break them. */
const idOf = (c, name) => c + '-' + M[c].i.findIndex(x => x[0] === name);
const ID = {
    softChurros: idOf(1, 'Add a soft serve'),
    softCookie: idOf(3, 'Add a soft serve'),
    box3: idOf(3, 'Cookie box of 3'),
    box6: idOf(3, 'Cookie box of 6'),
};

const IC = ['<path d="M10 32 40 20 70 32 40 44Z"/><path d="M10 32v22l30 12V44M70 32v22L40 66M10 43l30 12 30-12"/>', '<path d="M14 62 36 16M26 66 48 20M38 68 60 22"/><path d="M52 52h18l-3 14H55z"/>', '<path d="M22 44h36l-6 28H28z"/><path d="M26 44c-4-8 4-10 6-14 2-6 8-8 12-8-2 4 0 6 2 8 6 0 10 6 6 14"/>', '<path d="M40 6a34 34 0 1 0 34 34 12 12 0 0 1-14-14A12 12 0 0 1 40 6z"/><circle cx="28" cy="30" r="3"/><circle cx="46" cy="48" r="3"/><circle cx="30" cy="54" r="2.5"/>', '<path d="M24 28h32l-5 40H29z"/><path d="M20 28h40M44 28l6-16h10M27 46q6-5 12 0t12 0"/>'];

$('#menuList').innerHTML = M.map((c, a) => `<section class="cat" id="c${a}"><div class="ch"><svg class="ic" viewBox="0 0 80 80" aria-hidden="true">${IC[a]}</svg><h2>${c.t}</h2><p>${c.d}</p></div><ul>${c.i.map((x, b) => `<li data-id="${a}-${b}"><span>${x[0]}</span><i></i><b>${rs(x[1])}</b><div class="st"></div></li>`).join('')}</ul></section>`).join('');

$('#chips').innerHTML = M.map((c, a) => `<button data-go="${a}">${c.t}<em class="cb"></em></button>`).join('');

/* ======================================================================
   03. ORDER CART
   draw() refreshes the order bar, order page and menu steppers every time the cart changes.
   ====================================================================== */

const lines = () => Object.values(cart);

function draw() {
    syncMenu();
    const L = lines(), n = L.reduce((a, x) => a + x.q, 0), t = L.reduce((a, x) => a + x.q * x.p, 0);
    $('#fab').classList.remove('bump');
    void $('#fab').offsetWidth;
    $('#fab').classList.add('bump');
    $('#fabt').textContent = n + (n == 1 ? ' item, ' : ' items, ') + rs(t);
    $('#fab').classList.toggle('show', n > 0 && page !== 'order');
    $('#empty').hidden = n > 0;
    upsell();
    $('#full').hidden = !n;
    drawOrder(L, n, t);
}

/* ======================================================================
   03b. ORDER PAGE
   drawOrder() fills the slip. roll() animates the total. noteChips() shows quick notes (dips appear when churros are in the cart).
   ====================================================================== */

const slipNo = String(1000 + (Math.random() * 8999 | 0));
const DIPS = ['Dark chocolate dip', 'White chocolate dip', 'Milk chocolate dip', 'Nutella dip', 'Pistachio dip', 'Biscoff dip'];

/* Counts a rupee amount from its current value to a new one */
function roll(el, to) {
    const from = +el.dataset.v || 0, id = (el._r = (el._r || 0) + 1);
    el.dataset.v = to;
    if (matchMedia('(prefers-reduced-motion:reduce)').matches || from === to) {
        el.textContent = rs(to);
        return;
    }
    const t0 = performance.now();
    (function s(now) {
        if (el._r !== id) return;
        const k = Math.min(1, (now - t0) / 380);
        el.textContent = rs(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(s);
    })(t0);
}

function drawOrder(L, n, t) {
    roll($('#total'), t);
    roll($('#dtot'), t);
    $('#cnt').textContent = n + (n == 1 ? ' item' : ' items');
    $('#slipno').textContent = 'No. ' + slipNo;
    $('#slipd').textContent = new Date().toLocaleString('en-IN', { weekday: 'short', hour: 'numeric', minute: '2-digit' });
    $('#dock').classList.toggle('show', n > 0 && page === 'order');
    $('#lines').innerHTML = L.map(x => {
        const c = +x.id.split('-')[0];
        return `<li><span class="oi"><svg viewBox="0 0 80 80" aria-hidden="true">${IC[c]}</svg></span><div class="od"><b class="nm">${x.n}</b><small>${rs(x.p)} each</small></div><div class="q"><button type="button" data-q="${x.id},-1" aria-label="Remove one ${x.n}">−</button><span>${x.q}</span><button type="button" data-q="${x.id},1" aria-label="Add one ${x.n}">+</button></div><b class="lt">${rs(x.q * x.p)}</b></li>`;
    }).join('');
    noteChips();
}

function noteChips() {
    const churros = Object.values(cart).some(x => x.id.split('-')[0] === '1' && x.n !== 'Add a soft serve');
    const cur = $('#note').value.split(',').map(s => s.trim()).filter(Boolean);
    const set = (churros ? DIPS : []).concat(['No nuts please', 'Less sweet']);
    $('#nchips').innerHTML = set.map(v => `<button type="button" data-note="${v}" class="${cur.includes(v) ? 'on' : ''}">${v}</button>`).join('');
}

$('#nchips').addEventListener('click', e => {
    const b = e.target.closest('[data-note]');
    if (!b) return;
    const t = $('#note'), v = b.dataset.note, p = t.value.split(',').map(s => s.trim()).filter(Boolean), k = p.indexOf(v);
    if (k < 0) p.push(v); else p.splice(k, 1);
    t.value = p.join(', ');
    noteChips();
});
$('#note').addEventListener('input', noteChips);

/* ======================================================================
   04. GLOBAL CLICK HANDLER
   One listener for add (+), stepper (- / +), category chips, dine in / takeaway and links that scroll to a category.
   ====================================================================== */

document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]');
    if (a)
        add(a.dataset.add, a);
    const q = e.target.closest('[data-q]');
    if (q) {
        const [id, d] = q.dataset.q.split(',');
        cart[id].q += +d;
        if (cart[id].q < 1)
            delete cart[id];
        draw();
    }
    const g = e.target.closest('[data-go]');
    if (g)
        $('#c' + g.dataset.go).scrollIntoView({ behavior: 'smooth' });
    const r = e.target.closest('[data-cat]');
    if (r)
        want = r.dataset.cat;
    const m = e.target.closest('[data-mode]');
    if (m) {
        mode = m.dataset.mode;
        $$('[data-mode]').forEach(b => b.classList.toggle('on', b === m));
        $('.seg2').dataset.on = mode;
    }
});

/* ======================================================================
   05. SEND ORDER ON WHATSAPP
   Builds the message and opens WhatsApp using WA_NUMBER from js/config.js.
   ====================================================================== */

const sendOrder = () => {
    const L = lines(), t = L.reduce((a, x) => a + x.q * x.p, 0), n = $('#note').value.trim();
    const nm = $('#nm').value.trim(), m = `Hi Chubby’s, I’m ${nm || 'a customer'} and I’d like to order (${mode}):\n` + L.map(x => `${x.q} x ${x.n} (${rs(x.q * x.p)})`).join('\n') + `\nTotal: ${rs(t)}` + (n ? `\nNote: ${n}` : '');
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(m)}`, '_blank');
    const sl = $('#slip');
    sl.classList.remove('stamp');
    void sl.offsetWidth;
    sl.classList.add('stamp');
};
$('#send').onclick = sendOrder;
$('#send2').onclick = sendOrder;

/* ======================================================================
   06. PAGE ROUTER AND PAGE TRANSITION
   Pages are #home, #menu, #order, #space. The wave wipe plays between pages.
   ====================================================================== */

/* Updates the tab title and meta description for the page being shown. Texts come from PAGE_META in js/config.js. */
function setPageMeta(p) {
    const m = PAGE_META[p] || PAGE_META.home;
    document.title = m.title;
    const d = $('meta[name="description"]');
    if (d) d.setAttribute('content', m.description);
}

function show(p) {
    page = p;
    setPageMeta(p);
    $$('.pg').forEach(s => s.classList.toggle('on', s.id === 'p-' + p));
    $$('[data-n]').forEach(a => a.classList.toggle('on', a.dataset.n === p));
    scrollTo(0, 0);
    if (want !== null && p === 'menu') {
        const w = want;
        want = null;
        setTimeout(() => $(w === 'spin' ? '#sm' : '#c' + w).scrollIntoView(), 30);
    }
    tick();
    draw();
}

function route(first) {
    const p = location.hash.slice(1), n = ['home', 'menu', 'order', 'space'].includes(p) ? p : 'home';
    if (first || n === page)
        return show(n);
    if (busy)
        return;
    busy = true;
    const w = $('#wipe');
    w.classList.add('go');
    setTimeout(() => show(n), 720);
    setTimeout(() => {
        w.classList.remove('go');
        busy = false;
        route(false);
    }, 1400);
}

addEventListener('hashchange', () => route(false));

/* ======================================================================
   07. SCROLL EFFECTS
   Header shadow and the moving waves at the bottom of the hero.
   ====================================================================== */

function tick() {
    const y = scrollY;
    $('#bar').classList.toggle('sc', y > 8);
    [['#w1', .5], ['#w2', .9], ['#w3', 1.4]].forEach(([s, k]) => $(s).style.setProperty('--x', -((y * k) % 800) / 24 + '%'));
}

addEventListener('scroll', () => requestAnimationFrame(tick), { passive: true });

route(true);

/* ======================================================================
   08. ORDER HELPERS
   upsell() = smart suggestions on the order page, burst() = dots that pop when something is added.
   ====================================================================== */

function upsell() {
    const L = lines(), ck = L.filter(x => x.id[0] == '3' && +x.id.slice(2) < 8).reduce((a, x) => a + x.q, 0), u = $('#up');
    let t = '', id = '';
    const ch = L.some(x => x.id[0] == '1'), co = L.some(x => x.id[0] == '3'), ss = L.some(x => x.n == 'Add a soft serve');
    if (ck >= 6) {
        t = 'A box of 6 cookies is ₹640. Six singles cost ₹900.';
        id = ID.box6;
    }
    else if (ck >= 3) {
        t = 'A box of 3 cookies is ₹360. Three singles cost ₹450.';
        id = ID.box3;
    }
    else if ((ch || co) && !ss) {
        t = 'Make it better with a soft serve for just ₹30.';
        id = ch ? ID.softChurros : ID.softCookie;
    }
    u.innerHTML = id ? `<span>${t}</span><button data-add="${id}">Add</button>` : '';
}

function burst(el) {
    const r = el.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
        const d = document.createElement('i'), a = i / 8 * 6.28;
        d.className = 'dot';
        d.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;background:${i % 2 ? '#E6472B' : '#B02F2C'};--dx:${Math.cos(a) * 48}px;--dy:${Math.sin(a) * 48}px`;
        document.body.append(d);
        setTimeout(() => d.remove(), 750);
    }
}

/* ======================================================================
   09. PHOTO SLOTS
   Any element with data-img shows that photo automatically once the file exists in assets/photos.
   ====================================================================== */

$$('.slot[data-img]').forEach(s => {
    const i = new Image();
    i.onload = () => {
        s.style.backgroundImage = `url(${s.dataset.img})`;
        s.classList.add('has');
    };
    i.src = s.dataset.img;
});

/* ======================================================================
   10. PRELOADER
   The "chubby’s" logo fills with liquid, then the red screen lifts away.
   ====================================================================== */

(function () {
    const R = matchMedia('(prefers-reduced-motion:reduce)').matches, NS = 'http://www.w3.org/2000/svg', wa = $('#wA'), wb = $('#wB'), G = $('#pbub'), D = R ? 300 : 2800, t0 = performance.now();
    for (let i = 0; i < 18; i++) {
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', 30 + (Math.random() * 580 | 0));
        c.setAttribute('cy', 190);
        c.setAttribute('r', (2.5 + Math.random() * 4).toFixed(1));
        c.setAttribute('class', 'bb');
        c.style.cssText = `--d:${(1.6 + Math.random() * 1.6).toFixed(1)}s;--dl:-${(Math.random() * 3).toFixed(1)}s`;
        G.append(c);
    }
    (function f(now) {
        const t = now - t0, p = Math.min(1, t / D), q = 1 - Math.pow(1 - p, 1.6), r = Math.min(1, q * 1.1);
        wa.setAttribute('transform', `translate(${-((t * .16) % 640)} ${240 - 240 * r})`);
        wb.setAttribute('transform', `translate(${-((t * .2 + 200) % 640)} ${240 - 240 * q})`);
        if (p < 1)
            requestAnimationFrame(f);
    })(t0);
    Promise.all([new Promise(r => setTimeout(r, R ? 500 : 3300)), new Promise(r => document.readyState == 'complete' ? r() : addEventListener('load', r))]).then(() => {
        $('#pl').classList.add('out');
        document.body.classList.remove('load');
        document.dispatchEvent(new Event('plout'));
        setTimeout(() => $('#pl').remove(), 1300);
    });
})();

/* ======================================================================
   11. HERO SWIRL STAGE
   The soft serve cup on the home page. The flavour list F points at soft serve items by position in menu-data.js.
   ====================================================================== */

(function () {
    const F = [['Vanilla', 0, '#FFF3D6'], ['Chocolate', 1, '#6A3322'], ['Choco Vanilla', 2, '#FFF3D6', '#6A3322'], ['Nutella', 3, '#8A4A2A'], ['Biscoff Crush', 5, '#C98A4B'], ['Straw-Bae', 6, '#F59CB0']], NS = 'http://www.w3.org/2000/svg';
    const L = $$('#stage .sl'), tip = $('#tip'), chy = $('#chy'), btn = $('#hold'), cap = $('#scap'), hts = $('#hts'), st = $('#stage'), cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), R = matchMedia('(prefers-reduced-motion:reduce)').matches;
    let f = 0, p = 0, raf = 0;
    $('#fch').innerHTML = F.map((x, i) => `<button data-f="${i}" class="${i ? '' : 'on'}">${x[0]}</button>`).join('');
    const cols = ['#FBEADB', '#F6B26B', '#E6472B', '#FFD1C9', '#8A2120'];
    for (let i = 0; i < 18; i++) {
        const r = document.createElementNS(NS, 'rect');
        r.setAttribute('x', 30 + (Math.random() * 240 | 0));
        r.setAttribute('y', 30);
        r.setAttribute('width', 4);
        r.setAttribute('height', 11);
        r.setAttribute('rx', 2);
        r.setAttribute('fill', cols[i % 5]);
        r.setAttribute('class', 'sp');
        r.style.cssText = `--d:${3 + Math.random() * 3}s;--dl:-${Math.random() * 5}s;--r:${(Math.random() * 540 - 270) | 0}deg`;
        $('#spr').append(r);
    }
    function paint() {
        const c = F[f], it = M[2].i[c[1]];
        L.forEach((e, i) => {
            e.style.transform = `scale(${cl(p * 6 - i)})`;
            e.style.fill = c[3] && i % 2 ? c[3] : c[2];
        });
        tip.style.transform = `scale(${cl((p - .83) * 6)})`;
        tip.style.fill = c[2];
        chy.style.transform = `scale(${p >= 1 ? 1 : 0})`;
        st.classList.toggle('full', p >= 1);
        btn.textContent = `Add ${c[0]}, ${rs(it[1])}`;
    }
    function hearts() {
        hts.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const h = document.createElementNS(NS, 'path');
            h.setAttribute('d', 'M0 -4C-8 -14 -22 -2 0 14C22 -2 8 -14 0 -4Z');
            h.setAttribute('transform', 'translate(150 70)');
            h.setAttribute('class', 'ht');
            h.style.setProperty('--dx', (i - 3.5) * 22 + 'px');
            h.style.animationDelay = i * 70 + 'ms';
            hts.append(h);
        }
    }
    function fill() {
        cancelAnimationFrame(raf);
        p = 0;
        paint();
        cap.textContent = 'Swirling it up...';
        const t0 = performance.now(), D = R ? 10 : 1600;
        (function s(now) {
            p = cl((now - t0) / D);
            paint();
            if (p < 1)
                raf = requestAnimationFrame(s);
            else {
                hearts();
                cap.textContent = 'Fresh swirl. Add it to your table?';
            }
        })(t0);
    }
    btn.addEventListener('click', () => {
        if (p < 1)
            return;
        const x = F[f][1], id = '2-' + x, it = M[2].i[x];
        cart[id] = cart[id] || { id, n: it[0], p: it[1], q: 0 };
        cart[id].q++;
        draw();
        burst(btn);
        cap.textContent = 'Added. Pick another flavour to swirl more.';
    });
    $('#fch').addEventListener('click', e => {
        const b = e.target.closest('[data-f]');
        if (!b)
            return;
        f = +b.dataset.f;
        $$('#fch button').forEach(x => x.classList.toggle('on', x === b));
        fill();
    });
    paint();
    document.addEventListener('plout', () => setTimeout(fill, R ? 0 : 350), { once: true });
})();

/* ======================================================================
   12. REELS (VIDEO SECTION)
   Autoplay when visible, pause when not, tap for sound. Videos live in assets/videos.
   ====================================================================== */

(function () {
    const R = matchMedia('(prefers-reduced-motion:reduce)').matches, V = $$('.rv video'), io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting)
            e.target.play().catch(() => {
            });
        else
            e.target.pause();
    }), { threshold: .55 });
    V.forEach(v => {
        v.querySelector('source').addEventListener('error', () => {
            v.style.display = v.nextElementSibling.style.display = 'none';
        });
        if (R)
            v.controls = true;
        else
            io.observe(v);
    });
    $$('.snd').forEach(b => b.addEventListener('click', () => {
        const v = b.previousElementSibling, on = v.muted;
        V.forEach(x => {
            x.muted = true;
            x.nextElementSibling.textContent = 'Tap for sound';
        });
        if (on) {
            v.muted = false;
            b.textContent = 'Sound on';
        }
        v.play().catch(() => {
        });
    }));
})();

/* ======================================================================
   13. SCROLL REVEAL
   Rows, cards and tiles fade up as they scroll into view.
   ====================================================================== */

if (!matchMedia('(prefers-reduced-motion:reduce)').matches) {
    const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
        }
    }), { threshold: .12 });
    $$('.rows a,.cat,.dl>div,.gl .slot,.rv').forEach((e, i) => {
        e.classList.add('rz');
        e.style.setProperty('--rd', (i % 4) * .08 + 's');
        io.observe(e);
    });
}

/* ======================================================================
   14. MENU ACTIONS
   add() adds to cart, fly() animates the dot to the order bar, jump() bounces the category icon, syncMenu() keeps steppers and chip counts right, then the scroll-spy for the category chips.
   ====================================================================== */

function add(id, el) {
    const [c, i] = id.split('-'), it = M[c].i[i];
    cart[id] = cart[id] || { id, n: it[0], p: it[1], q: 0 };
    cart[id].q++;
    if (el) {
        burst(el);
        fly(el);
    }
    jump(+c);
    draw();
}

function fly(el) {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches)
        return;
    const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, d = document.createElement('i');
    d.className = 'fd';
    d.style.cssText = `left:${x}px;top:${y}px`;
    document.body.append(d);
    if (!d.animate) {
        d.remove();
        return;
    }
    d.animate([{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${innerWidth / 2 - x}px,${innerHeight - 46 - y}px) scale(.35)` }], { duration: 650, easing: 'cubic-bezier(.5,0,.2,1)' }).onfinish = () => d.remove();
}

function jump(c) {
    const s = $$('.cat')[c], e = s && s.querySelector('.ic');
    if (!e)
        return;
    e.classList.remove('jump');
    void e.offsetWidth;
    e.classList.add('jump');
}

function syncMenu() {
    const cc = M.map(() => 0);
    $$('#menuList li').forEach(li => {
        const id = li.dataset.id, [a, b] = id.split('-'), q = cart[id] ? cart[id].q : 0;
        cc[+a] += q;
        if (li.dataset.q != q) {
            li.dataset.q = q;
            li.classList.toggle('in', q > 0);
            li.querySelector('.st').innerHTML = q ? `<button data-q="${id},-1" aria-label="Remove one">−</button><span>${q}</span><button data-q="${id},1" aria-label="Add one">+</button>` : `<button data-add="${id}" aria-label="Add ${M[a].i[b][0]}">+</button>`;
        }
    });
    $$('#chips .cb').forEach((e, i) => {
        e.textContent = cc[i] || '';
        e.classList.toggle('on', !!cc[i]);
    });
}

(function () {
    const sp = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting)
            return;
        const i = +e.target.id.slice(1), bs = $$('#chips button'), b = bs[i], ch = $('#chips');
        bs.forEach((x, k) => x.classList.toggle('on', k === i));
        ch.scrollTo({ left: b.offsetLeft - (ch.clientWidth - b.clientWidth) / 2, behavior: 'smooth' });
    }), { rootMargin: '-30% 0px -60% 0px' });
    $$('.cat').forEach(c => sp.observe(c));
})();

/* ======================================================================
   15. SPIN FEATURE (slot machine)
   The result is chosen first, then the reel animates to land exactly on it. Moods filter the pool, boxes and add-ons are excluded.
   ====================================================================== */

(function () {
    const R = matchMedia('(prefers-reduced-motion:reduce)').matches, sm = $('#sm'), strip = $('#strip'), go = $('#sgo'), ad = $('#sadd'), pr = $('#spair'), cap = $('#smc'), T = { all: () => 1, choc: n => /choc|nutella|oreo|monster|triple/i.test(n), nut: n => /nut|pistachio|peanut|pb/i.test(n), fruit: n => /berry|straw/i.test(n), cheap: (n, p) => p <= 150 }, pool = [];
    M.forEach((c, a) => c.i.forEach((x, b) => {
        if (!/^Add a|box/i.test(x[0]))
            pool.push({ id: a + '-' + b, c: a, n: x[0], p: x[1] });
    }));
    const msg = ['Locked in.', 'Fate has spoken. Spin again if you dare.', 'Third time’s the charm. Trust it.'], ctr = k => `translateY(calc(var(--rh) * ${1 - k}))`;
    let mood = 'all', busy = false, last = { n: 'Spin to find your next favourite', p: 0 }, pick = null, count = 0, fin = null;
    const row = r => `<div class="rr"><span class="rn">${r.n}</span>${r.p ? `<b>${rs(r.p)}</b>` : ''}</div>`;
    function hideAct() {
        ad.hidden = pr.hidden = true;
        pick = null;
    }
    function spin() {
        if (busy)
            return;
        const P = pool.filter(x => T[mood](x.n, x.p) && (!last.id || x.id !== last.id));
        if (!P.length)
            return;
        busy = true;
        hideAct();
        count++;
        const t = P[Math.random() * P.length | 0], N = 30, rows = [last];
        for (let i = 1; i < N - 1; i++) {
            let r;
            do {
                r = P[Math.random() * P.length | 0];
            } while (r === rows[i - 1] && P.length > 1);
            rows.push(r);
        }
        rows.push(t);
        rows.push(P[Math.random() * P.length | 0]);  /* one extra row below the winner so the window is never empty */
        strip.style.transition = 'none';
        strip.innerHTML = rows.map(row).join('');
        strip.style.transform = ctr(0);
        void strip.offsetWidth;
        sm.classList.remove('won');
        sm.classList.add('spinning');
        go.disabled = true;
        go.textContent = 'Spinning...';
        cap.textContent = 'Spinning...';
        strip.style.transition = `transform ${R ? .01 : 3.2}s cubic-bezier(.12,.72,.12,1)`;
        strip.style.transform = ctr(N - 1);
        clearTimeout(fin);
        fin = setTimeout(() => land(t, N), (R ? .05 : 3.3) * 1000);
    }
    function land(t, N) {
        if (!busy)
            return;
        busy = false;
        last = t;
        pick = t;
        strip.style.transition = 'none';
        strip.style.transform = ctr(N - 1);
        sm.classList.remove('spinning');
        sm.classList.add('won');
        go.disabled = false;
        go.textContent = 'Spin again';
        strip.children[N - 1].classList.add('win');
        cap.textContent = `${M[t.c].t}. ${msg[Math.min(count - 1, 2)]}`;
        ad.textContent = `Add it, ${rs(t.p)}`;
        ad.hidden = false;
        const pid = t.c == 1 ? ID.softChurros : t.c == 3 ? ID.softCookie : null;
        pr.hidden = !pid;
        if (pid)
            pr.textContent = `Add with soft serve, ${rs(t.p + 30)}`;
        navigator.vibrate && navigator.vibrate([18, 40, 18]);
        confetti($('#reel'));
    }
    function confetti(el) {
        if (R)
            return;
        const r = el.getBoundingClientRect(), C = ['#FBEADB', '#F6B26B', '#E6472B', '#FFD1C9', '#fff'];
        for (let i = 0; i < 28; i++) {
            const e = document.createElement('i'), a = Math.random() * 6.28, d = 70 + Math.random() * 140, w = 4 + Math.random() * 4;
            e.className = 'cf';
            e.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;width:${w}px;height:${w * 2}px;background:${C[i % 5]}`;
            document.body.append(e);
            if (!e.animate) {
                e.remove();
                continue;
            }
            e.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d - 40}px) rotate(${Math.random() * 540 | 0}deg)`, opacity: 0 }], { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = () => e.remove();
        }
    }
    go.onclick = spin;
    $('#reel').addEventListener('click', spin);
    $('#reel').addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            spin();
        }
    });
    $('#moods').addEventListener('click', e => {
        const b = e.target.closest('[data-m]');
        if (!b || busy)
            return;
        mood = b.dataset.m;
        $$('#moods button').forEach(x => x.classList.toggle('on', x === b));
        hideAct();
        cap.textContent = 'Ready? Hit spin.';
    });
    ad.onclick = () => {
        if (!pick)
            return;
        add(pick.id, ad);
        ad.textContent = 'Added. Add one more?';
        cap.textContent = 'On your table.';
    };
    pr.onclick = () => {
        if (!pick)
            return;
        add(pick.id, pr);
        add(pick.c == 1 ? ID.softChurros : ID.softCookie);
        pr.hidden = true;
        ad.textContent = 'Added both. One more?';
        cap.textContent = 'On your table, soft serve and all.';
    };
})();

