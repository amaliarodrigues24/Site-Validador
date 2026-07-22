/* Tela de resultado — variante do D.O.U, recolher blocos, copiar código e revelar CPF. */

// ---------- qual card do D.O.U mostrar ----------
// ?cenario=pendente  -> registro ainda não publicado
// sem parâmetro      -> publicado
(function () {
  var cards = document.querySelectorAll('[data-dou]');
  if (!cards.length) return;

  var pedido = new URLSearchParams(location.search).get('cenario');
  var escolhido = pedido === 'pendente' ? 'pendente' : 'publicado';

  cards.forEach(function (card) {
    card.hidden = card.dataset.dou !== escolhido;
  });
})();

// ---------- blocos recolhíveis ----------
document.querySelectorAll('[data-block]').forEach(function (bloco) {
  var botao = bloco.querySelector('.block__toggle');
  var corpo = bloco.querySelector('.block__body');
  var rotulo = botao.querySelector('.sr-only');

  botao.addEventListener('click', function () {
    var aberto = botao.getAttribute('aria-expanded') === 'true';
    botao.setAttribute('aria-expanded', String(!aberto));
    corpo.hidden = aberto;
    rotulo.textContent = aberto ? 'Expandir seção' : 'Recolher seção';
  });
});

// ---------- copiar código validador ----------
document.querySelectorAll('[data-copiar]').forEach(function (botao) {
  var alvo = document.getElementById(botao.dataset.copiar);

  botao.addEventListener('click', function () {
    var texto = alvo.textContent.trim();

    function confirmar() {
      botao.classList.add('is-done');
      var antes = botao.getAttribute('aria-label');
      botao.setAttribute('aria-label', 'Código copiado');
      setTimeout(function () {
        botao.classList.remove('is-done');
        botao.setAttribute('aria-label', antes);
      }, 1600);
    }

    // navigator.clipboard só existe em https ou localhost; o fallback cobre o resto
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(confirmar);
    } else {
      var campo = document.createElement('textarea');
      campo.value = texto;
      campo.setAttribute('readonly', '');
      campo.style.position = 'absolute';
      campo.style.left = '-9999px';
      document.body.appendChild(campo);
      campo.select();
      document.execCommand('copy');
      document.body.removeChild(campo);
      confirmar();
    }
  });
});

// ---------- mostrar / ocultar CPF ----------
document.querySelectorAll('[data-revelar]').forEach(function (botao) {
  var valor = botao.parentElement.querySelector('[data-cpf]');

  botao.addEventListener('click', function () {
    var oculto = valor.textContent.trim() === valor.dataset.oculto;
    valor.textContent = oculto ? valor.dataset.completo : valor.dataset.oculto;
    botao.textContent = oculto ? 'Ocultar' : 'Mostrar';
  });
});
