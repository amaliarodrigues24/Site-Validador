/* Tela de carregamento — espera alguns segundos e segue para o resultado.
   O destino vem em ?destino= na URL. */

(function () {
  // Só destinos desta lista são aceitos. Serve de duas coisas: define o
  // título mostrado e impede que a URL mande a pessoa para qualquer lugar.
  var DESTINOS = {
    'resultado-historico.html': 'Verificando Histórico Escolar',
    'resultado-historico-nao-existente.html': 'Verificando Histórico Escolar',
    'resultado-curriculo.html': 'Verificando Currículo do Curso',
    'resultado-curriculo-nao-existente.html': 'Verificando Currículo do Curso',
    'resultado-diploma.html': 'Verificando Diploma',
    'resultado-diploma-anulado.html': 'Verificando Diploma',
    'resultado-diploma-nao-existente.html': 'Verificando Diploma'
  };

  var ESPERA = 2500;   // ms — tempo de exibição do loading

  var params = new URLSearchParams(location.search);
  var destino = params.get('destino') || '';
  var base = destino.split('?')[0];
  var titulo = DESTINOS[base];

  if (!titulo) {
    // destino desconhecido: não redireciona, avisa e oferece saída
    document.querySelector('[data-titulo]').textContent = 'Não foi possível continuar';
    document.querySelectorAll('.loading__step').forEach(function (p, i) {
      p.textContent = i === 0
        ? 'O destino informado não existe.'
        : '';
    });
    var volta = document.createElement('a');
    volta.href = 'index.html';
    volta.className = 'btn btn--primary';
    volta.textContent = 'Voltar ao início';
    document.querySelector('.loading').appendChild(volta);
    document.querySelector('.spinner').style.display = 'none';
    return;
  }

  document.querySelector('[data-titulo]').textContent = titulo;
  document.title = titulo + ' — Validador Cogna Educação';

  setTimeout(function () {
    // replace (e não href) para o botão Voltar do navegador não cair
    // de novo nesta tela e reiniciar o carregamento
    location.replace(destino);
  }, ESPERA);
})();
