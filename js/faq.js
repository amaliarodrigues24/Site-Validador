/* Perguntas Frequentes — abrir/fechar respostas, buscar enquanto digita,
   grifar o termo e mostrar estado de erro quando não há resultado. */

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
  var termoNaMensagem = vazio ? vazio.querySelector('[data-termo]') : null;

  // tira acentos e caixa, para "colacao" achar "colação".
  // Cada caractere acentuado vira 1 caractere base, então o texto normalizado
  // tem o MESMO comprimento e os mesmos índices do original — o que deixa
  // grifar o trecho certo mesmo com acento.
  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  // elementos cujo texto será grifado (pergunta + resposta), guardando o original
  var alvos = [];
  itens.forEach(function (item) {
    item.querySelectorAll('.qa__question > span:first-child, .qa__answer p')
      .forEach(function (el) {
        alvos.push({ el: el, original: el.textContent });
      });
  });

  // reconstrói o elemento com <mark> nos trechos que casam com a busca
  function grifar(alvo, busca) {
    var texto = alvo.original;
    alvo.el.textContent = '';

    if (!busca) { alvo.el.textContent = texto; return; }

    var norm = normalizar(texto);
    var frag = document.createDocumentFragment();
    var i = 0, achou;
    while ((achou = norm.indexOf(busca, i)) !== -1) {
      if (achou > i) frag.appendChild(document.createTextNode(texto.slice(i, achou)));
      var mark = document.createElement('mark');
      mark.className = 'hl';
      mark.textContent = texto.slice(achou, achou + busca.length);
      frag.appendChild(mark);
      i = achou + busca.length;
    }
    if (i < texto.length) frag.appendChild(document.createTextNode(texto.slice(i)));
    alvo.el.appendChild(frag);
  }

  function buscar() {
    var termo = campo.value.trim();
    var busca = normalizar(termo);
    var achou = 0;

    itens.forEach(function (item) {
      var combina = !busca || normalizar(item.textContent).indexOf(busca) > -1;
      item.hidden = !combina;
      if (combina) achou++;
    });

    // grifa em todos (só aparece nos visíveis)
    alvos.forEach(function (a) { grifar(a, busca); });

    // estado de erro
    if (vazio) {
      vazio.hidden = achou > 0;
      if (achou === 0 && termoNaMensagem) termoNaMensagem.textContent = termo;
    }
  }

  campo.addEventListener('input', buscar);
})();
