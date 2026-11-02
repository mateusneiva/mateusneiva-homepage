## Um lugar simples para o Minecraft Java

O Licht Launcher nasceu de uma ideia direta: reunir versões do jogo, modpacks e perfis em uma interface limpa, para Windows e Linux. Ele é um launcher não oficial, sem vínculo com a Mojang ou a Microsoft, e não redistribui arquivos do jogo: tudo vem dos servidores da Mojang e é verificado antes de ser usado.

A proposta é a experiência de instalar e jogar do launcher oficial, com o que costuma exigir várias ferramentas: escolha de mod loader, descoberta de modpacks, Java configurado automaticamente e perfis separados, cada um em sua própria pasta. Vanilla e modado não se misturam.

<!-- imagem: visão geral do launcher, com a lista de instâncias na lateral -->

O projeto está em *Early Release*. Isso é dito de forma explícita no README e vale para este texto também: o que segue descreve decisões e problemas reais, mas o produto ainda está sendo refinado.

## Arquitetura: um núcleo que não conhece a interface

O repositório é um workspace do Cargo com três camadas, e a regra mais importante é a direção das dependências.

- **`licht-core`** concentra toda a lógica: manifestos, downloads, Java, execução do jogo, instâncias, autenticação, loaders e modpacks. É uma biblioteca Rust sem dependência do Tauri.
- **`src-tauri`** é uma camada fina, só com comandos tipados e eventos que chamam o núcleo. Nenhuma regra de negócio mora ali.
- **`src`** é a interface em React e TypeScript. Não tem lógica de Minecraft, apenas telas e chamadas aos comandos.

Essa separação tem uma consequência prática: o núcleo é testável sozinho e também alimenta uma CLI, a `licht`, que lista versões, instala e abre o jogo. Aplicativo e CLI usam os mesmos serviços, então um problema reproduzido na linha de comando é o mesmo problema da interface.

A comunicação segue um fluxo único. O frontend chama comandos tipados, e o progresso volta por eventos limitados a cerca de 100 ms, para que downloads grandes não inundem a interface. Os tipos compartilhados entre Rust e TypeScript são gerados com `ts-rs`, nunca duplicados à mão, o que elimina uma classe inteira de divergências entre as duas pontas. No lado React, o TanStack Query cuida de cache, carregamento e erros dos comandos.

<!-- imagem: tela de download/instalação mostrando o progresso de uma instância -->

## Desafios

### Mais de uma década de versões

Suportar versões do 1.5.2 ao 26.x significa lidar com formatos que mudaram várias vezes. Até o 1.12.2, os argumentos do jogo são uma string única; a partir do 1.13, são listas com regras condicionais que o núcleo precisa avaliar. A versão do Java também varia: o Licht lê a versão principal declarada no JSON da versão do jogo e, só na falta dela, usa o identificador como regra de reserva.

Alguns casos foram bem específicos:

- **O diretório do jogo no 1.5.2.** O cliente usa o LaunchWrapper, que aplica o `--gameDir` só depois que a thread do cliente já leu opções do diretório padrão. Passar apenas o argumento não resolve. O Licht usa `<instância>/.minecraft` e aponta `APPDATA` e `user.home` para a pasta pai, de modo que o diretório padrão e o `--gameDir` coincidam. A solução segue a linha do HMCL, que redireciona essas variáveis, e evita a do Prism, que depende de um launcher Java legado: o Licht não distribui um launcher Java próprio.
- **Assets antigos.** Clientes antigos esperam nomes lógicos, como `sounds/random/click.ogg`. Se só os arquivos com hash existirem, o jogo abre sem som e tenta usar um endpoint que não existe mais. Para esses índices, o launch copia os objetos para os caminhos lógicos.
- **Natives.** Cada versão declara as bibliotecas nativas de um jeito. O Licht extrai para uma pasta em cache, identificada por uma impressão digital da plataforma e das regras de extração, e reaproveita o que não mudou. No 26.x, o LWJGL 3.4 pede `${natives_directory}/java`, e como a extração achata os caminhos, o argumento é reescrito para a pasta certa.
- **Codificação dos logs.** Um erro de leitura em `INFORMAÇÕES` num log do Windows mostrou que decodificar tudo como UTF-8 era frágil. Hoje o decoder escolhe pela versão do Java e, no Windows com Java antigo, pela página de código, substituindo bytes inválidos em vez de interromper a leitura.

<!-- imagem: tela de console/logs de uma instância em execução -->

### Forge e NeoForge

Fabric e Quilt são relativamente diretos: o núcleo consulta a API de cada um, baixa o perfil do loader e resolve os SHA1 das bibliotecas Maven. Forge e NeoForge são outra história, porque o instalador oficial executa *processors*, programas que geram arquivos do cliente.

O Licht reproduz esse pipeline por conta própria: baixa o instalador e verifica o SHA1 publicado, lê o `install_profile.json`, instala a versão vanilla herdada, resolve os dados do cliente, executa cada processor em sequência sem passar por um shell e confere os hashes das saídas. Os mapeamentos da Mojang passam pelo downloader verificado do Licht, em vez de deixar o processor baixá-los sem checagem.

Ao final, o núcleo grava um recibo com os hashes do perfil, do JAR do cliente, das bibliotecas e dos arquivos gerados. Um recibo válido pula todo o pipeline na próxima vez, e um recibo ausente ou alterado é reparado rodando Instalar/Reparar de novo. Um detalhe do Windows custou tempo: o `canonicalize` do Rust devolve caminhos com o prefixo `\\?\`, que o leitor de classpath do Java rejeita. Os caminhos passaram a ser tornados absolutos sem esse prefixo.

### Downloads em que dá para confiar

Tudo que é baixado tem o hash verificado, e as origens são restritas. Pacotes do Modrinth só aceitam o host `cdn.modrinth.com`, incluindo os redirecionamentos. No CurseForge, três hosts da CDN são permitidos e cada redirecionamento é conferido de novo. Os caminhos dentro dos pacotes são validados para não escapar da instância, não atingir arquivos do próprio launcher nem usar nomes reservados do Windows.

O CurseForge trouxe uma decisão de comportamento. Quando o autor de um mod desativa a distribuição por terceiros, a API devolve um `downloadUrl` vazio. O Licht não tenta adivinhar a URL: a importação para antes de criar a instância e o erro nomeia cada mod bloqueado, para que a pessoa saiba exatamente o que falta.

### Login Microsoft sem segredo no binário

O login usa o fluxo de código de autorização com PKCE, abrindo o navegador do sistema e recebendo o retorno em uma porta local livre. Como é um aplicativo desktop, é um cliente público: não existe *client secret* para esconder, e o client ID embutido no binário não é segredo. Os tokens ficam no keyring do sistema (Credential Manager no Windows, Secret Service no Linux), nunca em arquivo ou log.

Houve ainda um passo fora do código: um client ID novo recebe HTTP 403 dos serviços do Minecraft até a Mojang aprová-lo, então o fluxo pode funcionar no navegador e no Xbox e só falhar na última etapa. Para quem não tem conta, o modo offline continua disponível, com um UUID derivado do nome do jogador.

<!-- imagem: tela de login/contas nas configurações -->

## Decisões e trade-offs

- **Reimplementar o instalador do Forge em vez de executá-lo.** É mais trabalho, mas permite verificar cada hash e reportar progresso pelo mesmo pipeline dos demais downloads.
- **SQLite atrás de uma fila.** O banco fica em um serviço assíncrono que recebe pedidos por uma fila FIFO de 64 posições. Quando ela enche, quem pede espera, o que aplica contrapressão em vez de acumular trabalho sem limite. As consultas SQL e as transações ficam nos repositórios, e as operações de arquivo ficam de fora deles.
- **Mudar a pasta de conteúdo só na próxima inicialização.** O destino é salvo na hora, mas o processo em execução continua usando os caminhos antigos. Na inicialização seguinte, antes dos serviços subirem, o launcher copia e verifica o SHA1, atualiza os caminhos no banco e só então remove a origem. Um checkpoint permite retomar se algo for interrompido, e arquivos diferentes no destino viram erro, não sobrescrita.
- **Roteamento por hash.** A interface usa `/#/` para que a janela do Tauri não precise reescrever caminhos para o `index.html`.
- **Pouco efeito visual.** A interface roda no WebView2 no Windows e no WebKitGTK no Linux, então o projeto evita `backdrop-filter`, desfoques e animações complexas, e testa qualquer recurso CSS moderno nos dois.
- **Sem análise de uso.** O Licht não coleta métricas nem envia relatórios de falha automaticamente.

## Qualidade e testes

Nenhum teste automatizado depende da rede nem de uma conta Microsoft real. O núcleo usa JSONs reais da Mojang salvos como fixtures, bancos temporários e arquivos sintéticos, e os testes de integração espelham os domínios do código. No frontend, Vitest, Testing Library e jsdom cobrem os componentes.

O CI roda lint, tipos e testes do frontend, além de formatação, Clippy e testes do Rust, e compila o Tauri no Windows e no Ubuntu. A documentação separa, com franqueza, o que a compilação e os testes cobrem do que depende de validação gráfica manual.

## Distribuição e atualizações

Cada tag gera, no CI, instalador NSIS e versão portátil para Windows, AppImage e `.deb` para Linux, além de uma Release no GitHub. As versões `0.x` recebem o nome de uma flor em alemão: a 0.2 é Iris, a 0.3 é Rose.

As atualizações usam o updater do Tauri sobre as releases, com assinatura Minisign verificada antes de qualquer instalação. O pacote baixa em segundo plano, mas só é instalado quando a pessoa escolhe **Reiniciar para atualizar**, e uma falha deixa o launcher instalado funcionando. Vale registrar o que ainda não existe: as assinaturas do updater são diferentes da assinatura de publisher do Windows, e o projeto não alega ter esta última.

<!-- imagem: tela de configurações com atualizações -->

## Onde o projeto está

As fases de fundação, dados da Mojang, downloads, Java, execução, interface, instâncias, login e mod loaders estão concluídas, embora a validação manual do motor de downloads retomáveis ainda esteja em revisão. Ainda estão abertos a instalação, a atualização e a resolução de dependências de mods individuais (hoje já é possível listar, ativar, desativar e remover), os formatos MSI e Flatpak, e uma revisão de desempenho de inicialização, memória e velocidade de download.

Há também limites conhecidos, registrados na própria documentação: a validação gráfica foi feita no Windows e o lançamento no Linux ainda não foi reverificado, e o argumento `${auth_session}` continua literal em versões muito antigas, como a 1.5.2. A meta seguinte é uma v1.0 pública.
