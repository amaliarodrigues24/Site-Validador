/* Perguntas Frequentes — abrir/fechar respostas e filtrar pela busca. */

// ---------- acordeão ----------
document.querySelectorAll('.qa__question').forEach(function (botao) {
  var resposta = document.getElementById(botao.getAttribute('aria-controls'));

  botao.addEventListener('click', function () {
    var aberta = botao.getAttribute('aria-expanded') === 'true';
    botao.setAttribute('aria-expanded', String(!aberta));
    resposta.hidden = aberta;
  });
});

// ---------- busca ----------
(function () {
  var campo = document.querySelector('[data-busca]');
  if (!campo) return;

  var itens = Array.from(document.querySelectorAll('[data-qa]'));
  var vazio = document.querySelector('[data-vazio]');

  // tira acentos e caixa, para "colacao" achar "colação"
  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  campo.addEventListener('input', function () {
    var busca = normalizar(campo.value.trim());
    var achou = 0;

    itens.forEach(function (item) {
      // procura na pergunta E na resposta
      var combina = !busca || normalizar(item.textContent).indexOf(busca) > -1;
      item.hidden = !combina;
      if (combina) achou++;
    });

    vazio.hidden = achou > 0;
  });
})();
