---
title: 'IA e a nova realidade do desenvolvimento'
description: 'Como a IA mudou a forma de desenvolver software, como foi difícil me adaptar e por que testes, CI/CD e documentação deixaram de ser opcionais.'
date: '2026-11-02'
tags: ['ia', 'desenvolvimento', 'carreira']
draft: false
---

## Eu era cético

Durante muito tempo, olhei para a IA no desenvolvimento com desconfiança. Sempre fui cético, e boa parte dessa desconfiança vinha de um lugar legítimo: código que parece certo e não está, respostas confiantes sobre coisas que não existem, a sensação de que escrever o código com as próprias mãos era justamente a parte que construía o raciocínio.

Eu não estava totalmente errado. Mas também não estava vendo o conjunto.

## O mercado foi para outro lugar

O que me tirou do lugar não foi um argumento, foi o caminho que o mercado tomou. As ferramentas ficaram boas o bastante para entrar na rotina de times e de projetos pessoais, e o jeito de trabalhar começou a mudar ao meu redor. Em algum momento ficou claro que continuar de fora não era uma posição neutra: era ficar para trás.

Então fui atrás do prejuízo. Precisei aprender do zero uma forma diferente de trabalhar, e isso não foi confortável.

## Adaptar-se foi difícil

Foi difícil de verdade. Não só aprender as ferramentas, mas mudar de hábito: escrever menos código na mão e mais instruções, contexto e critérios; revisar mais do que digitar; desconfiar do que parece pronto; aceitar que a velocidade de produção deixou de ser o gargalo.

Também foi difícil deixar parte da identidade para trás. Eu gostava de escrever cada linha, e agora o trabalho passou a ser decidir o que deve existir, descrever bem, conferir e corrigir o rumo. É uma habilidade diferente, e ela se aprende errando.

## Esta é a nova realidade

Não vejo mais isso como uma moda passageira. A IA já faz parte de como o software é feito, e o padrão que se desenha é um só: **mais código sendo escrito, em menos tempo**.

E é aí que está o ponto que mais mudou a minha cabeça. Quando se escreve mais código, mais rápido, o que sobra como limite é a capacidade de garantir que esse código está certo. Sem isso, a velocidade só produz mais problemas, e mais depressa.

## O que deixou de ser opcional

Algumas práticas que muita gente tratava como "o ideal, quando der tempo" deixaram de ser opcionais. Hoje, para mim, não fazem sentido de ser deixadas de fora:

- **Testes automatizados.** São o que diz, em segundos, se uma mudança quebrou algo. Com código gerado em volume, são a rede de segurança principal.
- **CI/CD.** Lint, tipos, testes e build rodando a cada mudança, sempre do mesmo jeito, sem depender de memória ou de boa vontade.
- **Documentação.** Regras do projeto, decisões e contexto escritos servem para pessoas e também para as ferramentas, que trabalham melhor quando sabem as convenções e os limites.
- **Tipagem estrita e lint.** Eles recusam, antes da revisão, a classe de erro mais comum e mais barata de evitar.
- **Revisão cuidadosa.** Quem decide o que entra continua sendo quem assina a mudança.

Nos meus projetos mais recentes, isso virou rotina: um arquivo com as regras do projeto, um roadmap para trabalhar uma tarefa de cada vez, testes que não dependem da rede e CI que bloqueia o que não passa. Nada disso é novidade, mas antes era mais fácil ignorar. Agora, ignorar custa caro.

## Um exemplo: o Licht

O [Licht Launcher](/pt/projects/licht-launcher) mostra bem isso na prática. Usei IA ao longo do desenvolvimento, e o histórico do repositório conta o que mudou no ritmo e no método.

- **Regras antes do código.** O primeiro commit, em 8 de outubro de 2026, foi um documento de diretrizes e um roadmap, não código. Cada tarefa vira uma branch e um pull request pequeno, com os testes e as verificações do CI como porta de entrada.
- **Ritmo.** A primeira versão saiu em 11 de outubro, três dias depois, e em 17 de outubro já eram seis versões publicadas. Até o fim do mês, foram cerca de 170 pull requests mergeados.
- **Marcos, não só volume.** O roadmap organiza o trabalho em fases e marcos: a execução do jogo no Windows, depois o login Microsoft, depois mod loaders e modpacks.

Esse volume só é sustentável porque existe uma estrutura em volta dele. Sem testes, CI e regras escritas, o mesmo ritmo viraria acúmulo de problemas.

## Onde estou agora

Ainda tenho ressalvas, e acho que é saudável tê-las: a IA erra, e quem usa precisa saber reconhecer quando erra. Mas deixei de achar que a escolha era entre usar e não usar. A pergunta que faz sentido hoje é como usar bem, e isso envolve mais engenharia, não menos.

Sigo aprendendo, e dividir isso aqui é parte do processo. Se você também está no meio dessa adaptação, saiba que o desconforto é normal. O que ajudou, no meu caso, foi tratar como um ofício novo a aprender, com paciência e com as boas práticas ao lado.
