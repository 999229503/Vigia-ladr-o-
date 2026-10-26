# Observatório dos Mandatos — estrutura inicial

Protótipo React + TypeScript + Vite para uma plataforma pública de análise de mandatos presidenciais.

## Requisitos
- Node.js 20 ou superior recomendado
- npm

## Rodar localmente
```bash
npm install
npm run dev
```
Abra o endereço local informado pelo Vite.

## Verificar build
```bash
npm run build
npm run preview
```

## O que existe nesta versão
- Interface responsiva para computador e celular.
- Navegação por áreas de análise.
- Pesquisa e filtro da amostra histórica.
- Detalhes de registros e página de metodologia.
- Avisos explícitos de que os dados ainda não estão conectados.
- Nenhuma chave de API, login, banco de dados ou serviço pago é necessário para executar o protótipo.

## Importante
A lista em `src/data/presidents.ts` é uma **amostra inicial de interface**, não uma base histórica completa ou revisada. Ela inclui registros ilustrativos para validar navegação. Antes de publicação, revisar a cronologia inteira com fontes oficiais, representar adequadamente interinidades e governos colegiados, separar mandatos e documentar as fontes.

## Próximas etapas técnicas
1. Criar a base histórica revisada e referenciar fontes por registro.
2. Definir indicadores, unidade, período, metodologia e fonte oficial.
3. Criar banco de dados e importadores idempotentes.
4. Implementar coleta agendada com logs, retentativas e alerta de falha.
5. Criar endpoint de IA no servidor com limite de chamadas e orçamento.
6. Publicar somente após revisão factual, testes de build, segurança e acessibilidade.

## Segurança da IA
Nunca colocar chaves privadas no frontend, no GitHub público ou em variáveis `VITE_*`. A IA deve ser chamada pelo servidor, com limites de requisição, validação de entrada e orçamento configurado no provedor.
