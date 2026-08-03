/* Tela de resultado — variante do D.O.U, recolher blocos, copiar código e revelar CPF. */

// ---------- variantes por ?cenario= ----------
// publicado   (padrão): D.O.U publicado    + downloads padrão
// pendente            : D.O.U pendente     + downloads padrão
// nao-aplica          : D.O.U não se aplica + downloads padrão
// certificado         : D.O.U publicado    + botão único de certificado
(function () {
  var cenario = new URLSearchParams(location.search).get('cenario');

  // card do D.O.U: "pendente" e "nao-aplica" têm card próprio; o resto é publicado
  var dou = cenario === 'pendente' || cenario === 'nao-aplica' ? cenario : 'publicado';
  document.querySelectorAll('[data-dou]').forEach(function (card) {
    card.hidden = card.dataset.dou !== dou;
  });

  // bloco de downloads: "certificado" mostra o botão único
  var downloads = cenario === 'certificado' ? 'certificado' : 'padrao';
  document.querySelectorAll('[data-downloads]').forEach(function (bloco) {
    bloco.hidden = bloco.dataset.downloads !== downloads;
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
