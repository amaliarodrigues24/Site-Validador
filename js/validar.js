/* Telas de validação — abas, liberação do botão e estado de erro.
   Protótipo: nada aqui consulta base nenhuma. */

/* Cenários do protótipo: o que a pessoa digitar decide qual tela abre.
   Agrupado por documento — cada formulário declara o seu em data-form.
   Para acrescentar um cenário novo, basta uma linha aqui. */
var CENARIOS = {
  diploma: {
    // passa pela tela de carregamento antes do resultado (o destino é codificado
    // para preservar o ?cenario= interno)
    '1': 'carregando.html?destino=resultado-diploma.html%3Fcenario%3Dpublicado',
    '2': 'carregando.html?destino=resultado-diploma.html%3Fcenario%3Dpendente',
    '3': 'carregando.html?destino=resultado-diploma-anulado.html',
    '4': 'carregando.html?destino=resultado-diploma-nao-existente.html'
  },
  historico: {
    // passa pela tela de carregamento antes do resultado
    '1': 'carregando.html?destino=resultado-historico.html',
    '2': 'carregando.html?destino=resultado-historico-nao-existente.html'
  },
  curriculo: {
    '1': 'carregando.html?destino=resultado-curriculo.html',
    '2': 'carregando.html?destino=resultado-curriculo-nao-existente.html'
  }
};

// ---------- abas ----------
document.querySelectorAll('[role="tablist"]').forEach(function (lista) {
  var abas = Array.from(lista.querySelectorAll('[role="tab"]'));

  function selecionar(aba) {
    abas.forEach(function (a) {
      var painel = document.getElementById(a.getAttribute('aria-controls'));
      var ativa = a === aba;
      a.setAttribute('aria-selected', String(ativa));
      if (painel) painel.hidden = !ativa;
    });
  }

  abas.forEach(function (aba, i) {
    aba.addEventListener('click', function () { selecionar(aba); });

    aba.addEventListener('keydown', function (e) {
      var passo = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!passo) return;
      e.preventDefault();
      var proxima = abas[(i + passo + abas.length) % abas.length];
      proxima.focus();
      selecionar(proxima);
    });
  });
});

// ---------- formulário ----------
document.querySelectorAll('[data-form]').forEach(function (form) {
  var botao = form.querySelector('button[type="submit"]');
  var status = form.querySelector('[data-status]');
  var textoInicial = status.textContent;

  // Campos de texto/data liberam o botão. O checkbox não entra nessa conta
  // (só é cobrado no clique) — foi o que a Amália pediu.
  var campos = Array.from(form.querySelectorAll('input[required]:not([type="checkbox"])'));
  var checkbox = form.querySelector('input[type="checkbox"][required]');

  function erroDe(campo) {
    // o checkbox mora dentro do <label class="robot">, cujo irmão seguinte
    // é a mensagem; os demais campos ficam dentro de .field, junto da sua
    if (campo.type === 'checkbox') {
      var irmao = campo.closest('.robot').nextElementSibling;
      return irmao && irmao.classList.contains('field__error') ? irmao : null;
    }
    return campo.closest('.field').querySelector('.field__error');
  }

  function preenchido(campo) {
    return campo.type === 'checkbox' ? campo.checked : campo.value.trim() !== '';
  }

  function todosPreenchidos() {
    return campos.every(preenchido);
  }

  function limparErro(campo) {
    var erro = erroDe(campo);
    if (erro) erro.hidden = true;
    campo.removeAttribute('aria-invalid');
    if (campo.type === 'checkbox') campo.closest('.robot').classList.remove('is-invalid');
  }

  function mostrarErro(campo) {
    var erro = erroDe(campo);
    if (erro) erro.hidden = false;
    campo.setAttribute('aria-invalid', 'true');
    if (campo.type === 'checkbox') campo.closest('.robot').classList.add('is-invalid');
  }

  // CENÁRIO 1 — os dois campos preenchidos liberam o botão
  function atualizar() {
    var pronto = todosPreenchidos();
    botao.setAttribute('aria-disabled', String(!pronto));

    // se ainda há erro visível, a mensagem de erro manda; senão volta ao normal
    var aindaComErro = form.querySelector('.field__error:not([hidden])');
    if (aindaComErro) return;

    form.classList.remove('has-error');
    status.classList.remove('is-error');
    status.textContent = pronto
      ? 'Tudo pronto — clique para verificar'
      : textoInicial;
  }

  form.addEventListener('input', function (e) {
    if (e.target.matches('input')) limparErro(e.target);
    atualizar();
  });
  form.addEventListener('change', function (e) {
    if (e.target.matches('input')) limparErro(e.target);
    atualizar();
  });
  atualizar();

  // CENÁRIO 2 — clicou sem preencher: marca os campos vazios
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var faltando = campos.filter(function (c) { return !preenchido(c); });
    if (checkbox && !checkbox.checked) faltando.push(checkbox);

    campos.concat(checkbox ? [checkbox] : []).forEach(limparErro);

    if (faltando.length) {
      form.classList.add('has-error');
      faltando.forEach(mostrarErro);
      status.textContent = faltando.length === 1
        ? 'Falta preencher 1 campo para continuar'
        : 'Faltam preencher ' + faltando.length + ' campos para continuar';
      status.classList.add('is-error');
      faltando[0].focus();
      return;
    }

    form.classList.remove('has-error');
    status.classList.remove('is-error');

    // o campo que decide o cenário é o número de registro (ou o código)
    var chave = (form.querySelector('[name="registro"], [name="codigo"]') || {}).value;
    var mapa = CENARIOS[form.dataset.form] || {};
    var destino = mapa[(chave || '').trim()];

    if (destino) {
      status.textContent = 'Consultando…';
      window.location.href = destino;
      return;
    }

    var disponiveis = Object.keys(mapa);
    status.textContent = disponiveis.length
      ? 'Cenário não mapeado — no protótipo, use ' + disponiveis.join(', ') + ' para ver os resultados.'
      : 'As telas de resultado deste documento ainda não foram desenhadas.';
    status.classList.add('is-error');
  });
});
