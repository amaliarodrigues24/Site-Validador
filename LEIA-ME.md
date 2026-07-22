# Validador Cogna — protótipo

Site estático (HTML/CSS/JS). Não precisa de servidor, banco de dados nem instalação.
Todos os documentos mostrados (diplomas, históricos, currículos) são **exemplos fictícios**.

## Como colocar no GitHub Pages

Você vai precisar de uma conta em github.com (gratuita).

### Caminho recomendado: GitHub Desktop (sem terminal)

1. Instale o **GitHub Desktop**: https://desktop.github.com — faça login com sua conta.
2. No app: **File → Add Local Repository** e aponte para esta pasta
   (`validador-cogna-site`). Ele vai oferecer criar o repositório — aceite.
3. Escreva uma descrição curta (ex: "primeira versão") e clique **Commit to main**.
4. Clique **Publish repository**. Pode deixar como público.
5. No site github.com, abra o repositório → **Settings → Pages**.
   Em **Source**, escolha **Branch: main** e a pasta **/ (root)**. Salve.
6. Aguarde ~1 minuto. O link público aparece no topo dessa mesma tela
   (algo como `https://seu-usuario.github.io/validador-cogna-site`).

Pronto — qualquer pessoa abre esse link, em qualquer máquina ou celular.

### Para atualizar depois

Troque os arquivos nesta pasta, e no GitHub Desktop: **Commit** → **Push origin**.
O link continua o mesmo.

## Detalhes técnicos (caso alguém pergunte)

- O `index.html` está na raiz — é o que o GitHub Pages exige.
- As fontes estão na pasta `fonts/` (servidas localmente), então o site funciona
  mesmo em redes que bloqueiam o Google Fonts.
- Há um selo fixo "PROTÓTIPO" em todas as páginas, para ninguém confundir com o
  validador oficial da Cogna.

## Fluxo do protótipo (para quem for testar)

- **Diploma** → nº de registro: **1** = válido/publicado · **2** = válido/pendente ·
  **3** = anulado · **4** = não existente
- **Histórico** e **Currículo** → código: **1** = válido · **2** = não existente
  (passam por uma tela de carregamento antes do resultado)
