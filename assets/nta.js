// NTA — script comune: tema chiaro/scuro e stato della revisione (stato.json, generato dal CMS
// con `npm run export:nta-stato`).
(function () {
  var root = document.documentElement;
  try { var t = localStorage.getItem('nta-tema'); if (t) root.dataset.theme = t; } catch (e) {}

  window.NTA = {
    num: function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); },
    pct: function (a, b) { return b ? Math.round((a / b) * 100) : 0; },
    STATI: { 'rivisto': 'Rivisto', 'in-revisione': 'In revisione', 'da-fare': 'Da fare' },

    stato: function (base) {
      return fetch((base || '') + 'stato.json', { cache: 'no-cache' }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      });
    },

    // riempie gli elementi con data-s="chiave" (totali, revisione, obiettivo, aggiornato)
    fill: function (s) {
      var t = s.totali, v = {
        revisione: s.revisione, obiettivo: s.obiettivo,
        aggiornato: new Date(s.aggiornato + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }),
        rivisti: t.rivisti, inRevisione: t.inRevisione, daFare: t.daFare, libri: t.libri,
        versetti: NTA.num(t.versetti), versettiRivisti: NTA.num(t.versettiRivisti),
        cambiati: NTA.num(t.cambiati), titoli: NTA.num(t.titoli),
        percento: NTA.pct(t.versettiRivisti, t.versetti) + '%'
      };
      document.querySelectorAll('[data-s]').forEach(function (el) {
        if (v[el.dataset.s] !== undefined) el.textContent = v[el.dataset.s];
      });
    },

    // barra divisa per versetti: rivisti, in revisione, da fare
    bar: function (el, s) {
      var tot = s.totali.versetti;
      el.innerHTML = '';
      ['rivisto', 'in-revisione'].forEach(function (k) {
        var n = s.libri.filter(function (l) { return l.stato === k; }).reduce(function (a, l) { return a + l.versetti; }, 0);
        var span = document.createElement('span');
        span.className = 's-' + k;
        span.style.width = (n / tot) * 100 + '%';
        el.appendChild(span);
      });
      el.setAttribute('aria-label', NTA.pct(s.totali.versettiRivisti, tot) + '% dei versetti in libri già rivisti');
    },

    // mappa dei 66 libri, divisa in Antico e Nuovo Testamento
    map: function (el, s, href) {
      el.innerHTML = '';
      [['AT', 'Antico Testamento'], ['NT', 'Nuovo Testamento']].forEach(function (g) {
        var h = document.createElement('h3');
        h.textContent = g[1];
        var cells = document.createElement('div');
        cells.className = 'cells';
        s.libri.filter(function (l) { return l.testamento === g[0]; }).forEach(function (l) {
          var a = document.createElement('a');
          a.className = 'cell s-' + l.stato;
          a.href = href + '#libro-' + l.n;
          a.textContent = l.abbr;
          a.title = l.nome + ': ' + NTA.STATI[l.stato].toLowerCase();
          cells.appendChild(a);
        });
        el.appendChild(h);
        el.appendChild(cells);
      });
    }
  };

  // Visite anonime con GoatCounter: nessun cookie, nessun IP salvato. Non conta in locale.
  var GOATCOUNTER = 'nta-bibbia';
  if (GOATCOUNTER !== 'NOME' && /\.github\.io$/.test(location.hostname)) {
    var gc = document.createElement('script');
    gc.async = true;
    gc.src = 'https://gc.zgo.at/count.js';
    gc.dataset.goatcounter = 'https://' + GOATCOUNTER + '.goatcounter.com/count';
    document.head.appendChild(gc);
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-tema]');
    if (!b) return;
    var dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('nta-tema', root.dataset.theme); } catch (e2) {}
  });
})();
