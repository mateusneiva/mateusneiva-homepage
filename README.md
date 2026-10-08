# Mateus Neiva — Portfolio & Blog

Portfólio bilíngue com Next.js 16.3 (App Router), TypeScript estrito, Tailwind CSS,
Framer Motion, React Three Fiber, next-intl e Zod.

## Rodar o projeto

Use Node.js 24+ e pnpm 10+ para desenvolvimento e testes.

```sh
pnpm install
pnpm dev
```

Rotas principais: `/pt`, `/en`, `/pt/posts`, `/en/posts` e
`/{pt,en}/projects/{softness,polaris-kit,shiva-toolbox}`.
O proxy em `src/proxy.ts` redireciona `/` para o idioma preferido do visitante, com português
como padrão. A preferência também é preservada pelo next-intl.

```sh
pnpm lint
pnpm test
pnpm exec tsc --noEmit
pnpm build
pnpm start
```

O desenvolvimento gera arquivos em `.next-dev`, e o build de produção em `.next`.
As saídas são separadas para que `pnpm build` não sobrescreva os chunks de um
servidor `pnpm dev` ativo.

## Organização

A homepage mantém a organização original: Hero → About → Projetos → Posts → Contato. O container global tem
largura máxima de 1200px; os artigos mantêm uma coluna editorial mais estreita.
As tecnologias mantêm
a mesma experiência em desktop e mobile, com tags que se ajustam à largura disponível.
No mobile, os links do footer aparecem antes da identidade; no desktop, ficam lado a lado. O About
agrupa apresentação, jornada e princípios na coluna esquerda; skills, workspace
Minecraft e Spotify seguem em sequência na coluna direita. No mobile, o DOM segue
apresentação → jornada → princípios → skills → workspace → Spotify.
A ordem do DOM acompanha a leitura visual e a navegação por teclado; no desktop,
os blocos usam as duas colunas da composição. Links e numeração acompanham essa sequência.
No Hero mobile, o computador 3D aparece antes do texto e os dois botões ficam
empilhados, ocupando toda a largura. Os projetos voltam à grade original de três
cards no desktop. No About, a composição de duas colunas segue o agrupamento acima.
Não há navegação por capítulos ou deslocamento global da página pelo mouse.
Hero e Contato compartilham `src/components/home/social-links.tsx`: ícones compactos
com hover de cor em CSS e levitação discreta via Framer Motion. Os tooltips seguem
o mouse, respeitam os limites da tela e se posicionam junto ao link no teclado.
O currículo aparece ao final, com ícone de PDF; o e-mail usa um ícone sharp preenchido.
Tooltips são removidos imediatamente antes da ação do item, sem remover foco ou
interferir na navegação, e também são dispensados ao ocultar a aba. A saída animada
normal continua ao apenas sair do hover.
O footer não tem animação de entrada; duas faixas serif se movem em sentidos opostos,
com velocidades diferentes, sem símbolos nas faixas, e uma versão estática para movimento reduzido.
O computador do Hero tem parallax vertical durante o scroll, sem deslocamento
automático por movimento do mouse. Os títulos de seção, Hero e Contato usam duas
camadas: texto principal fixo e uma cópia decorativa em contorno que reage apenas
ao mouse. A rolagem não altera esse efeito, e os trechos verdes são preservados.
As camadas mantêm a altura do layout e a cópia é ignorada por leitores de tela.
Movimento reduzido mantém o computador estático e oculta a cópia decorativa.
O link para a faixa no Spotify tem levitação no hover e tooltip com título e artista.
O nome e o avatar também mostram um tooltip para abrir o perfil público do usuário.
Os títulos revelam palavras por máscara com um escalonamento curto na entrada;
depois da entrada, o texto principal permanece parado. Fades locais em blocos e
parágrafos são mais curtos e esperam a saída do loading da logo para começar.
`InitialLoadingProvider` compartilha esse estado, e navegação interna não repete o
loading. O background entra suavemente, varia discretamente a opacidade no scroll
e ilumina pontos/linhas junto ao cursor, mantendo sua posição fixa.
Na primeira abertura de cada documento, a marca `mn.` fica centralizada sobre uma
linha animada enquanto a página e as fontes carregam. O loading sai suavemente
quando tudo está pronto e não reaparece em navegação interna ou troca de idioma.
Movimento reduzido mantém a linha estática. As logos do header e footer têm apenas
hover de opacidade, sem underline, e preservam a navegação para o início.

### Logo e favicon

`public/logo.svg` é a marca vetorial `mn.`, gerada dos contornos de Space Grotesk
Bold com o espaçamento da marca. O header, footer e loading usam o mesmo símbolo
SVG; as cores acompanham os tokens do tema. A exportação SVG não depende de fontes.
`public/logo.ico` e `public/favicon.ico` têm versões de 16, 32, 48, 64, 128 e 256px.
Os ícones PNG e Apple também usam a marca. Os metadados apontam para SVG e ICO.

Para regenerar os arquivos raster a partir do SVG:

```sh
node scripts/generate-brand-icons.mjs
```

O gerador usa Sharp já instalado com o Next.js. Nas bordas das seções, as faixas
laterais e hachuras de gutters foram removidas; linhas e marcações de construction
continuam presentes.

Os arquivos de componentes seguem kebab-case (por exemplo, `hero-scene.tsx` e
`footer-columns.tsx`). Os componentes React exportados usam PascalCase.

- `src/app/[locale]`: layouts, páginas e metadados; as páginas compõem os módulos.
- `src/components/home/hero` e `src/components/home/about`: componentes agrupados por seção.
- `src/components/ui/buttons`: ações, links com aparência de botão, seleção e estilos compartilhados.
- `src/components/ui/tags`, `ui/icons` e `ui/typography`: tags, setas, títulos e destaques reutilizáveis.
- `src/components/home/about`: apresentação, jornada, princípios e workspace; skills e Spotify têm seus próprios módulos.
- `src/components/home/projects` e `home/posts`: seções de projetos e posts exibidas na homepage.
- `src/components/home/contact/form`: contato da homepage, campos, envio e feedback; testes junto do formulário.
- `src/components/home/index.ts`: entrada pública das seções Hero, About, Projects, Posts e Contact.
- `src/components/projects/cards`, `details` e `navigation`: cards, páginas de detalhes e guia de seções.
- `src/components/posts`: listagem, cards e renderização Markdown.
- `src/components/layout/background`, `construction`, `footer` e `navigation`: composição visual e navegação.
- `src/components/ui/motion`: animações, efeitos de proximidade e observação de atividade no viewport.
- `src/components/ui/theme`: botão animado sol/lua e integração com o sistema.
- `src/components/three/scenes`, `models` e `hooks`: cenas 3D, modelos voxel e carregamento/capacidades WebGL.
- `src/data`: projetos, habilidades e links sociais.
- `src/lib/posts`: carregamento de Markdown local, tempo de leitura e schemas.
- `src/components/layout/scroll`: Lenis integrado ao loop do Framer Motion, âncoras e histórico.
- `src/components/layout/not-found`: página 404 localizada no estilo construction.
- `src/lib/spotify`: cliente HTTP server-side, reprodução, perfil, schemas públicos e cache do navegador.
- `src/lib/github`: consulta das informações públicas do repositório.
- `src/lib/contact`: validação compartilhada e envio server-side pelo Resend.
- `src/lib/cn.ts`: composição e merge de classes Tailwind.
- `src/styles/fonts.ts`: configuração das fontes com `next/font`.
- `src/i18n/messages`: dicionários tipados em português e inglês.
- `content/posts/{pt,en}`: artigos locais.
- `src/**/*.test.{ts,tsx}`: testes Vitest junto do componente, hook ou módulo correspondente.
- `src/**/*.spec.ts`: testes Playwright junto dos componentes e funcionalidades correspondentes.
- `src/test`: configuração compartilhada do Vitest e fixtures de navegador do Playwright.

## Locale e APIs atuais do Next.js

`src/i18n/request.ts` lê o segmento `[locale]` com o getter nativo de
`next/root-params`, preservando overrides explícitos quando necessários.
`generateStaticParams` mantém as rotas localizadas pré-renderizadas. A aplicação
não usa mais `setRequestLocale` ou o parâmetro `requestLocale`, depreciados no
next-intl. Route Handlers usam seus próprios parâmetros; o getter de root params
é reservado aos Server Components.
`src/i18n/routing.ts` contém apenas a configuração de rotas; os componentes e
hooks de navegação ficam em `src/i18n/navigation.ts`, evitando levar a configuração
de Server Components para o proxy ou Route Handlers.

O lint usa a configuração flat de `eslint.config.mjs`, compatível com Next 16.
O desenvolvimento e o build usam Turbopack por padrão.

## Atualizar os projetos

Edite `src/data/projects.ts`. As descrições traduzidas ficam em
`src/i18n/messages/pt.json` e `src/i18n/messages/en.json`, nos grupos `Projects` e
`ProjectDetails`. Cada card é um único link para uma página de detalhes localizada;
os links externos de GitHub e demonstração ficam nessa página. Slugs desconhecidos
retornam 404, e as páginas entram automaticamente no sitemap.

As páginas de detalhes têm apresentação, visão geral, funcionalidades,
arquitetura, tecnologias e links. O guia de seções acompanha a rolagem e permite
saltar para cada trecho sem adicionar entradas extras ao histórico. No desktop,
fica à esquerda em uma coluna sticky; no mobile, o guia é oculto para priorizar
a leitura do conteúdo.
Os visuais dos cards são composições gráficas próprias, em `project-visual.tsx`.
Cada projeto pode usar um PNG escolhido por você: coloque o arquivo em
`public/projects/` e adicione o campo `image` ao projeto em `src/data/projects.ts`:

```ts
image: '/projects/softness.png',
```

A mesma imagem aparece no card e na página de detalhes, otimizada por `next/image`.
A imagem mantém suas proporções, sem distorção ou cortes; prefira um PNG horizontal
com boa resolução, por exemplo 1600 × 900 px. Projetos sem `image` mantêm o visual atual.

Os ícones e suas cores ficam em `src/data/technologies.ts`. O componente
`TechnologyTag` reutiliza esse cadastro na matriz do About e nas tags dos projetos.

## Publicar um post local

Crie `content/posts/pt/meu-post.md` e, para a versão inglesa,
`content/posts/en/meu-post.md`. Use o mesmo nome para o seletor de idioma levar
à tradução correspondente. Uma tradução ausente retorna a página 404.

```md
---
title: 'Título do artigo'
description: 'Resumo usado na listagem e nos metadados.'
date: '2026-10-04'
tags: ['react', 'typescript']
draft: false
---

## Primeiro tópico

Conteúdo em **Markdown**.
```

Os metadados são validados com Zod. Rascunhos (`draft: true`) e artigos com data
futura não aparecem. O site oferece Markdown com tabelas, listas, código e links
(GFM); HTML embutido não é executado. O tempo de leitura é calculado automaticamente.
Posts locais são publicados no deploy; datas futuras exigem um novo deploy para aparecer.
Há um post introdutório em ambos os idiomas, que pode ser editado ou marcado como rascunho.

Os posts são publicados exclusivamente no site, sem importação RSS ou etiqueta de
origem nos cards. As tags de assuntos permanecem. O tempo de leitura aparece como
`1 min de leitura` em português e `1 min read` em inglês.

## Scroll e página 404

Lenis 1.3.26 suaviza wheel/trackpad sobre o scroll nativo, com inércia moderada. Seu
RAF usa o mesmo loop de Framer Motion; não existe wrapper transformando a página.
Touch permanece nativo e `prefers-reduced-motion` desativa a suavização. Âncoras,
guia de projetos e botão de topo usam o mesmo motor; navegação interrompe a inércia
e o retorno de artigos preserva a posição de leitura. Campos de formulário mantêm
seu scroll nativo. Seções grandes permanecem visíveis; entradas são aplicadas aos
blocos e cards, com escalonamento curto e divisores construction desenhados no scroll.
O background tem pequenos motivos pixelados e variações locais de opacidade.

`src/app/[locale]/[...rest]/page.tsx` encaminha rotas de navegação desconhecidas para
a 404 localizada, com ações de início/projetos, status 404 e `noindex`. Artigos e
projetos ausentes usam a mesma apresentação. O layout raiz com locale é preservado.
Sem configuração, a listagem exibe apenas os posts locais.

## Spotify no About

O bloco mostra a faixa em reprodução, ou a última faixa ouvida quando não há
reprodução ativa. Uma faixa pausada é identificada como tal. Capa, artistas e link
abrem o contexto da música no Spotify.

Para conectar a sua conta:

1. Crie um app no [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   com acesso à Web API e cadastre exatamente esta **Redirect URI**:
   `http://127.0.0.1:4381/callback`.
2. Preencha `SPOTIFY_CLIENT_ID` e `SPOTIFY_CLIENT_SECRET` em `.env.local`, usando
   `.env.example` como referência.
3. Execute `pnpm spotify:auth`, abra o link mostrado no terminal e autorize sua
   conta. O comando solicita `user-read-currently-playing` e
   `user-read-recently-played`, e salva `SPOTIFY_REFRESH_TOKEN` em `.env.local`.
4. Reinicie `pnpm dev`. Na Vercel, configure as três variáveis no ambiente de
   produção e faça um novo deploy.

As credenciais são usadas apenas no servidor. `/api/spotify` retorna somente o
status e os dados da faixa, com cache de 30 segundos. O bloco consulta a API a
cada 30 segundos enquanto está visível e a aba está ativa; em caso de falha,
tenta novamente após um minuto. Sem configuração, mostra um estado neutro.
A autorização é feita pelo dono do portfólio, uma vez; visitantes apenas veem
o bloco e podem abrir a faixa no Spotify.

A última faixa válida também é salva no navegador, com seu horário de atualização,
para reaparecer ao recarregar a página. As consultas seguintes acontecem em segundo
plano; se falharem ou vierem vazias, o bloco preserva a última faixa conhecida.
No estado de última reprodução, o tempo relativo usa `played_at` do Spotify
e se atualiza a cada minuto enquanto o bloco está visível. Na versão em inglês,
a última reprodução e a faixa em cache usam o mesmo rótulo, `Last Played`.
Faixas reaproveitadas do cache não indicam reprodução ao vivo.

O canto inferior direito do card exibe o nome e um avatar circular compacto do
perfil Spotify, alinhados ao link da faixa. O perfil tem hover por cor e ampliação
sutil da foto. `/api/spotify/profile` busca apenas os campos públicos necessários e os
mantém em cache por uma hora. Essa identidade também acompanha a faixa salva
no navegador, para aparecer ao recarregar a página. Sem avatar, são usadas as
iniciais do nome. Dados como e-mail e detalhes da assinatura não são retornados.

## Contato e acessibilidade

A header permanece no fluxo da página e contém apenas logo, idioma e seletor de
tema. `system` é o padrão: acompanha a preferência do dispositivo em tempo real.
As opções claro e escuro são persistidas no navegador. As cores de interface e
artigos usam os tokens Tailwind de `src/components/layout/document-shell.tsx` e
`tailwind.config.js`.
O botão de tema alterna diretamente entre claro e escuro, sem menu. O ícone Around
transforma sol em lua, com clipPath e raios animados, e usa `aria-pressed` para
indicar o modo escuro. A escolha funciona por clique, Enter ou Espaço; movimento
reduzido troca o ícone imediatamente. Antes da primeira escolha, segue o sistema.
Ao alternar pelo botão, a View Transition API revela o tema escuro da esquerda
para a direita em 600ms; o tema claro retorna no sentido inverso. A posição do
conteúdo é preservada. Sem suporte à API, há uma transição de cores curta; movimento
reduzido aplica a troca imediatamente, e a primeira abertura não dispara a revelação.
O tema usa `useSyncExternalStore` para sincronizar seleção, localStorage e preferência
do sistema. `public/theme-init.js` inicializa o atributo do documento; o script externo
async é gerenciado e deduplicado pelo React 19, inclusive nas trocas de idioma.

Space Grotesk é a fonte principal, Lora é usada em títulos editoriais e IBM Plex
Mono nos detalhes técnicos, todas carregadas por `next/font`. O visual usa blocos retos, sem cantos arredondados
ou bordas nos cards. Seções, cards e habilidades aparecem ao entrar na tela; o
footer tem uma faixa animada continuamente da direita para a esquerda, que pausa
fora da área visível e fica estática com movimento reduzido.

Todos os estilos usam utilitários Tailwind, incluindo pseudo-elementos, textura
dos botões e tipografia Markdown. Os estilos ficam junto dos componentes que os
utilizam. `src/styles/globals.css` contém as três diretivas do Tailwind, e
`src/styles/fonts.ts` configura as fontes. Variantes reutilizáveis usam
`tailwind-variants`; `src/lib/cn.ts` combina clsx com `tailwind-merge` para
compor classes e permitir overrides sem conflitos.

O tema em `tailwind.config.js` centraliza largura do site, espaçamento lateral,
tamanhos de fonte, entrelinhas e tracking. O plugin do tema fornece classes
semânticas como `page-container`, `heading-hero`, `heading-section`, `heading-card`,
`heading-feature`, `eyebrow`, `footer-signature` e `interactive-link`.
Os componentes usam essas classes diretamente, sem importar strings de estilos globais.

Os botões compartilham `components/ui/buttons/button-styles.ts`, com variantes de tom,
tamanho e seleção. `ActionButton` renderiza ações, `ActionLink` renderiza links
com o mesmo visual e `SelectionButton` reutiliza o fundo animado dos filtros.
Ícones, links de retorno e o botão de tema usam os mesmos tamanhos e variantes.

O TypeScript usa explicitamente os tipos React locais e `jsxImportSource: react`.
No VS Code, selecione a versão TypeScript do workspace; `.vscode/settings.json`
aponta para o SDK instalado pelo projeto. Após trocar ou mover arquivos, o
comando `TypeScript: Restart TS Server` atualiza o estado do editor.

Links têm underline animado da esquerda para a direita, reutilizado por
`link-label.tsx`. A barra de rolagem usa tons neutros de cinza, e o botão flutuante
`scroll-to-top.tsx` aparece após rolar 400 px.

O formulário usa React Hook Form com o resolver Zod para validar nome, e-mail e
mensagem. Os erros ficam associados a cada campo, e o primeiro valor inválido
recebe foco. O formulário envia os valores para `POST /api/contact`, que valida
novamente os dados e usa a API HTTP do Resend no servidor. O botão fica desabilitado
durante o envio. Em caso de erro, os campos são preservados para tentar novamente;
após o sucesso, os campos são limpos e uma confirmação é exibida em português ou inglês.
O link direto de contato também está disponível.

### Configurar e-mail na Vercel

1. No Resend, verifique um domínio e crie uma chave de API com permissão de envio.
2. Em Vercel → Project Settings → Environment Variables, configure:
   - `RESEND_API_KEY`: a chave do Resend.
   - `CONTACT_EMAIL_FROM`: remetente do domínio verificado, por exemplo `Mateus Neiva <contato@seu-dominio.com>`.
   - `CONTACT_EMAIL_TO`: endereço que recebe as mensagens, por exemplo `mateus.fneiva@gmail.com`.
3. Selecione os ambientes desejados (Production e, se necessário, Preview) e faça um novo deploy.

Para desenvolvimento local, use os mesmos nomes em `.env.local` conforme `.env.example`.
Essas variáveis são exclusivas do servidor. O remetente e o destinatário são fixos
na configuração; o e-mail do visitante é usado como `reply_to`, permitindo responder
diretamente. Sem configuração completa, a API retorna erro e não informa sucesso.
O envio usa uma função Node.js da Vercel, sem servidor SMTP ou processo persistente.

As animações respeitam `prefers-reduced-motion`. A cena 3D é carregada sob demanda,
limita a densidade de pixels e pausa a rotação fora da área visível. Sem WebGL,
há uma apresentação alternativa. Navegação por teclado, foco visível e link para
pular ao conteúdo estão incluídos.

Three.js e seus tipos estão fixados em `0.182.0`, compatível com o relógio ainda
utilizado internamente pelo React Three Fiber 9.8. A partir da r183, `Clock` é
depreciado em favor de `Timer`; essa atualização depende da adaptação do Fiber.
As cenas com sombras usam `shadows="percentage"` (`PCFShadowMap`) explicitamente.
Os testes de navegador também detectam os avisos de depreciação de relógio e sombras.

Os modelos de `public` são configurados em `voxel-assets.ts`. O workspace do About
alterna entre Allay, abelha e axolote, um por vez. O Allay também voa acima dos
posts e o axolote fica perto do contato.
As asas e os movimentos usam as animações embarcadas; o deslocamento lateral é
feito separadamente. As cenas decorativas carregam ao entrar na tela, pausam fora
da área visível ou com a aba oculta e não bloqueiam cliques nem a leitura.
O footer fica sem linhas de construção; guias discretas acompanham os textos nas
outras áreas.

## Testes automatizados

```sh
pnpm test             # Vitest: schemas, posts locais, cards, tooltip e navegação de volta
pnpm test:watch       # Vitest em modo watch
pnpm exec playwright install chromium  # Instalar o navegador uma vez
pnpm test:e2e         # Build de produção + Playwright
pnpm test:e2e:ui      # Build + interface interativa do Playwright
pnpm test:all         # Vitest + build + Playwright
pnpm exec playwright test src/components/ui/theme/theme-toggle.spec.ts --config=playwright.dev.config.ts
# Verifica também a troca de idioma no servidor de desenvolvimento (localhost:3000).
```

Vitest usa ambiente Node para os serviços e jsdom para os componentes.
As suítes ficam próximas da implementação, como `project-card.test.tsx` e
`lib/spotify/cache.test.ts`, e são descobertas pela configuração em `vitest.config.mts`.
As requisições dos serviços são simuladas, e os testes de Markdown usam arquivos
temporários. Next.js e APIs de navegador são simulados apenas nos testes unitários.

Playwright descobre `src/**/*.spec.ts` e executa contra o build real na porta `3210`, em Chromium desktop e
mobile (Pixel 7). Cobre filtros, cards clicáveis, detalhes, links externos, idiomas,
404, temas e persistência, validação e estados de envio do contato, retorno de artigos, botão de topo
e hover com título/underline verdes. Hover é verificado no desktop.
Erros de execução no navegador fazem o teste falhar. Relatórios e traces de falhas
ficam em `playwright-report` e `test-results`, ignorados pelo Git.

## Deploy

Use a integração Next.js da Vercel, com `pnpm build`, e configure as variáveis de
contato e Spotify descritas acima. Os posts locais são incluídos no deploy.

## Licença

[MIT](./LICENSE)
