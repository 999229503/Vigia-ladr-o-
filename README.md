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

- Identidade visual ObservaBrasil, com layout responsivo para celular e computador.
- Navegação por início, presidentes, economia, saúde, educação, segurança, gastos públicos, promessas e fontes/metodologia.
- Pesquisa e filtro da lista histórica e modal de detalhes.
- Indicador IPCA mensal consultado diretamente na API pública do Banco Central (SGS série 433), com estados de carregamento e erro e link para a fonte original.
- Catálogo de fontes oficiais para história, economia, gastos públicos, saúde, educação, segurança e legislação.
- Manifesto PWA, ícone e cache básico de recursos do mesmo domínio para facilitar instalação e retorno offline.
- Seleção de texto desativada na interface para evitar o menu de copiar ao tocar e segurar; campos de busca continuam selecionáveis.

## Limites que precisam ficar claros

- A lista presidencial é uma base histórica inicial organizada por períodos/anos; não substitui uma revisão documental individual de datas exatas, interinidades, juntas e fases de governo. Consulte a Biblioteca da Presidência e o Arquivo Nacional antes de publicar análises definitivas.
- Só o indicador IPCA está conectado a uma API de dados nesta versão. As páginas de saúde, educação, segurança, gastos públicos e promessas mostram fontes reais para consulta, mas ainda não fazem coleta, normalização nem comparação histórica automática.
- Ainda não há banco de dados, painel editorial, histórico de correções, avaliação automática de promessas nem integração de IA. Essas funcionalidades exigem projeto adicional e, para IA, uma camada segura no servidor e controle de custos.
- O cache PWA é básico e não garante que todos os dados dinâmicos estejam disponíveis offline. O IPCA precisa de internet para atualizar.
- A instalação como PWA não é a mesma coisa que publicação na Play Store. Para Play Store será necessário empacotar e testar a aplicação Android (por exemplo, Trusted Web Activity ou Capacitor), preparar os ativos exigidos e cumprir as políticas do Google Play.

## Fontes principais

- Biblioteca da Presidência: https://www.biblioteca.presidencia.gov.br/presidencia/ex-presidentes
- Arquivo Nacional: https://www.gov.br/arquivonacional/pt-br/canais_atendimento/imprensa/noticias/conheca-a-publicacao-os-presidentes-e-a-republica
- Banco Central SGS IPCA: https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json
- Portal da Transparência: https://portaldatransparencia.gov.br/
- IBGE/SIDRA: https://sidra.ibge.gov.br/
- DATASUS: https://datasus.saude.gov.br/
- INEP: https://www.gov.br/inep/pt-br
- Atlas da Violência/Ipea: https://www.ipea.gov.br/atlasviolencia/
