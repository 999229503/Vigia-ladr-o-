# ObservaBrasil

Aplicação web React + TypeScript + Vite, com interface responsiva e suporte inicial a PWA instalável.

## Executar e validar

Requer Node.js 20+ e npm.

```bash
npm install
npm run dev
npm run build
npm run preview
```

## O que está implementado

- Identidade visual ObservaBrasil, com layout responsivo para celular e computador e navegação por abas (também por deslizar): Início, Presidentes, Promessas e Mais.
- **Início:** contagem de registros catalogados por status (realizado, em andamento, a validar), indicadores econômicos ao vivo e os últimos valores publicados de saúde, educação e segurança, cada um com data e link para a fonte.
- **Economia ao vivo (Banco Central, SGS):** IPCA mensal (série 433), IPCA em 12 meses (13522), meta Selic (432), dólar de venda (1) e taxa de desocupação da PNAD (24369), consultados direto na API pública. Cada valor mostra a data de referência, tem estados de carregamento e erro, cache local de 24 horas e um botão para forçar a atualização. Sem conexão, o app mostra o último valor guardado e avisa.
- **Saúde, educação e segurança:** mortalidade de menores de 5 anos (Unicef, 2024), IDEB 2025 (MEC/Inep) e mortes violentas intencionais de 2025 (Anuário Brasileiro de Segurança Pública). São valores publicados pelas fontes, guardados em `src/data/indicators.ts` com data de conferência e link; não se atualizam sozinhos.
- **Presidentes:** lista em ordem do mais recente para o mais antigo, mostrando primeiro de 2000 em diante, com botão para o histórico completo desde 1889. A busca ignora acentos e procura por nome, período ou ano. A ficha de cada mandato abre em modal.
- **Promessas:** lista dos registros de mandato com status, categoria e link para a fonte, com filtro por status.
- **Mais:** catálogo de fontes oficiais (Banco Central, Arquivo Nacional, Biblioteca da Presidência, Portal da Transparência, IBGE/SIDRA, DATASUS, INEP, Atlas da Violência/Ipea e ANP).
- Manifesto PWA, ícone e cache básico de recursos do mesmo domínio para facilitar instalação e retorno offline.

## Como ler os números

- Os números do painel inicial são contagens dos registros cadastrados em `src/data/mandates.ts`. Eles não são uma nota do governo nem uma porcentagem de promessas cumpridas.
- O status descreve cada item: `Realizado`, `Em andamento` ou `A validar`. "A validar" significa que falta confirmar a situação em fonte oficial; o app não inventa um número quando não há base confiável.
- Os registros são uma amostra inicial e cada um precisa ser conferido na fonte antes de qualquer divulgação pública.

## Limites que precisam ficar claros

- A lista presidencial (`src/data/presidents.ts`) é uma base histórica inicial organizada por períodos/anos; não substitui uma revisão documental individual de datas exatas, interinidades, juntas e fases de governo. Consulte a Biblioteca da Presidência e o Arquivo Nacional antes de publicar análises definitivas.
- Só os indicadores econômicos do Banco Central são atualizados automaticamente. Saúde, educação e segurança precisam ser revisados à mão quando saírem novas edições (IDEB, Anuário, Unicef). Gastos públicos e preços de combustíveis (ANP) ainda não estão conectados, e não há comparação histórica automática.
- Ainda não há banco de dados, painel editorial, histórico de correções, avaliação automática de promessas nem integração de IA. Essas funcionalidades exigem projeto adicional e, para IA, uma camada segura no servidor e controle de custos.
- O cache PWA é básico e não garante que todos os dados dinâmicos estejam disponíveis offline. Os indicadores do Banco Central precisam de internet para atualizar.
- A instalação como PWA não é a mesma coisa que publicação na Play Store. Para Play Store será necessário empacotar e testar a aplicação Android (por exemplo, Trusted Web Activity ou Capacitor), preparar os ativos exigidos e cumprir as políticas do Google Play.

## Estrutura

- `src/App.tsx`: telas e navegação.
- `src/bcb.ts`: séries do Banco Central, cache de 24h e estados de carregamento/erro.
- `src/data/indicators.ts`: valores publicados de saúde, educação e segurança, com fonte e data.
- `src/data/presidents.ts`: lista de mandatos presidenciais.
- `src/data/mandates.ts`: registros de ações e promessas, indexados pelo `id` do mandato.
- `public/`: manifesto PWA, service worker e ícones.

## Fontes principais

- Biblioteca da Presidência: https://www.biblioteca.presidencia.gov.br/presidencia/ex-presidentes
- Arquivo Nacional: https://www.gov.br/arquivonacional/pt-br/canais_atendimento/imprensa/noticias/conheca-a-publicacao-os-presidentes-e-a-republica
- Banco Central SGS (exemplo, IPCA): https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json
- Portal da Transparência: https://portaldatransparencia.gov.br/
- IBGE/SIDRA: https://sidra.ibge.gov.br/
- DATASUS: https://datasus.saude.gov.br/
- INEP: https://www.gov.br/inep/pt-br
- Atlas da Violência/Ipea: https://www.ipea.gov.br/atlasviolencia/
- ANP: https://www.gov.br/anp/pt-br
