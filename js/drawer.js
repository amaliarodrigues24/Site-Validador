/* Drawer lateral — abre pelo link, fecha no X, no fundo e no Esc.
   Prende o foco dentro dela enquanto estiver aberta. */

(function () {
  var backdrop = document.querySelector('[data-drawer-backdrop]');
  if (!backdrop) return;

  var aberta = null;
  var focoAnterior = null;

  function focaveis(el) {
    return Array.from(el.querySelectorAll(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(function (n) { return n.offsetParent !== null; });
  }

  function abrir(drawer, gatilho) {
    if (aberta) fechar();
    aberta = drawer;
    focoAnterior = gatilho || document.activeElement;

    drawer.hidden = false;
    // força o navegador a aplicar o estado inicial antes de animar
    void drawer.offsetWidth;
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');

    // trava a rolagem do fundo
    document.body.style.overflow = 'hidden';

    var alvo = drawer.querySelector('.drawer__close');
    if (alvo) alvo.focus();
  }

  function fechar() {
    if (!aberta) return;
    var drawer = aberta;
    aberta = null;

    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // esconde do leitor de tela só depois da animação
    setTimeout(function () {
      if (!drawer.classList.contains('is-open')) drawer.hidden = true;
    }, 300);

    if (focoAnterior) focoAnterior.focus();
    focoAnterior = null;
  }

  // abrir
  document.querySelectorAll('[data-abre-drawer]').forEach(function (gatilho) {
    gatilho.addEventListener('click', function (e) {
      e.preventDefault();
      var alvo = document.getElementById(gatilho.dataset.abreDrawer);
      if (alvo) abrir(alvo, gatilho);
    });
  });

  // fechar
  document.querySelectorAll('[data-fecha-drawer]').forEach(function (b) {
    b.addEventListener('click', fechar);
  });
  backdrop.addEventListener('click', fechar);

  document.addEventListener('keydown', function (e) {
    if (!aberta) return;

    if (e.key === 'Escape') { fechar(); return; }

    // Tab circula dentro da drawer em vez de vazar para a página atrás
    if (e.key === 'Tab') {
      var lista = focaveis(aberta);
      if (!lista.length) return;
      var primeiro = lista[0];
      var ultimo = lista[lista.length - 1];

      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault(); ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault(); primeiro.focus();
      }
    }
  });
})();
