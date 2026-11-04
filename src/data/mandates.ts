import { extraRecords, historicalRecords } from "./mandates-historico";

export type MandateStatus = "Realizado" | "Em andamento" | "Não cumprido" | "A validar";

export type MandateRecord = {
  title: string;
  detail: string;
  category: "Ação documentada" | "Promessa / compromisso";
  status: MandateStatus;
  url: string;
};

export const mandateStatuses: MandateStatus[] = ["Realizado", "Em andamento", "Não cumprido", "A validar"];

// Registros iniciais, indexados pelo `id` de cada mandato em presidents.ts.
// São uma amostra para validar a interface: cada item precisa ser conferido na fonte antes de divulgação pública.
// "Não cumprido" marca promessas que a fonte citada aponta como não atendidas; confira a data de cada fonte, pois a situação pode mudar.
// O status "A validar" marca registros cuja situação não foi confirmada em fonte oficial.
const detailedRecords: Record<string, MandateRecord[]> = {
  deodoro: [
    { title: "Proclamação da República", detail: "Liderou o movimento político-militar que depôs o Império em 15 de novembro de 1889.", category: "Ação documentada", status: "Realizado", url: "https://presidentes.an.gov.br/" },
    { title: "Primeira Constituição Republicana", detail: "Instalação da Assembleia Constituinte e promulgação da Constituição de 1891.", category: "Promessa / compromisso", status: "Realizado", url: "https://www.camara.leg.br/" }
  ],
  floriano: [
    { title: "Consolidação da República", detail: "Conduziu o governo durante a Revolta da Armada e a Revolução Federalista.", category: "Ação documentada", status: "Realizado", url: "https://presidentes.an.gov.br/" }
  ],
  "fhc-2": [
    { title: "Estabilização econômica", detail: "Manteve o controle da inflação e as diretrizes do Plano Real.", category: "Ação documentada", status: "Realizado", url: "https://www.gov.br/secretariageral/pt-br/centrais-de-conteudo/biblioteca-da-pr/galeria-dos-ex-presidentes/fernando-henrique-cardoso/" },
    { title: "Reformas estruturais", detail: "Propostas de reforma administrativa e previdenciária. O resultado de cada uma precisa ser conferido na fonte.", category: "Promessa / compromisso", status: "A validar", url: "https://www.gov.br/secretariageral/pt-br/" }
  ],
  "lula-1": [
    { title: "Criação do Bolsa Família", detail: "Unificação de programas de transferência de renda em 2003/2004.", category: "Ação documentada", status: "Realizado", url: "https://www.gov.br/mds/pt-br" },
    { title: "Combate à fome e à miséria", detail: "Lançamento do programa Fome Zero e de redes de apoio social. A extensão dos resultados precisa ser validada.", category: "Promessa / compromisso", status: "A validar", url: "https://www.gov.br/mds/pt-br" }
  ],
  "lula-2": [
    { title: "Programa de Aceleração do Crescimento (PAC)", detail: "Investimentos estruturantes em infraestrutura, energia e saneamento.", category: "Ação documentada", status: "Realizado", url: "https://presidentes.an.gov.br/" },
    { title: "Expansão das Universidades Federais (REUNI)", detail: "Criação de novos campi e interiorização do ensino superior.", category: "Promessa / compromisso", status: "Realizado", url: "https://www.gov.br/mec" }
  ],
  "dilma-1": [
    { title: "Programa Mais Médicos", detail: "Ampliação de atendimento em regiões de vazios assistenciais do SUS.", category: "Ação documentada", status: "Realizado", url: "https://www.gov.br/saude" }
  ],
  temer: [
    { title: "Reforma Trabalhista", detail: "Mudança nas regras de contratação e nas relações de trabalho, sancionada em 2017.", category: "Ação documentada", status: "Realizado", url: "https://www12.senado.leg.br/" },
    { title: "Teto de Gastos Públicos", detail: "Emenda Constitucional que limitou o crescimento das despesas federais.", category: "Promessa / compromisso", status: "Realizado", url: "https://www.tesourotransparente.gov.br/" }
  ],
  bolsonaro: [
    { title: "Auxílio Brasil", detail: "Programa criado em 2021 em substituição ao Bolsa Família, com valor ampliado.", category: "Ação documentada", status: "Realizado", url: "https://www.gov.br/mds/pt-br" },
    { title: "Marco Legal do Saneamento", detail: "Novas regras para a universalização dos serviços de água e esgoto, aprovadas em 2020.", category: "Promessa / compromisso", status: "Realizado", url: "https://www.gov.br/" }
  ],
  "lula-3": [
    { title: "Retomada do Bolsa Família", detail: "Reestruturação do programa com adicionais por criança e gestante.", category: "Ação documentada", status: "Realizado", url: "https://www.gov.br/mds/pt-br" },
    { title: "Isenção do Imposto de Renda até R$ 5 mil", detail: "Lei 15.270, sancionada em 26/11/2025 e publicada no DOU em 27/11: isenção para quem recebe até R$ 5 mil por mês e descontos para rendas de até R$ 7.350, valendo a partir de janeiro de 2026 (Senado).", category: "Promessa / compromisso", status: "Realizado", url: "https://www12.senado.leg.br/noticias/materias/2025/11/27/sancionada-isencao-do-imposto-de-renda-para-quem-ganha-ate-r-5-mil-por-mes" },
    { title: "Fim da escala 6x1", detail: "Emenda Constitucional 141, promulgada em 16/10/2026: reduz a duração máxima semanal do trabalho e prevê dois dias de repouso semanal remunerado, sem redução salarial (Congresso Nacional). O O POVO (18/10/2026) registra que, com ela, o balanço do g1 passou a 27 de 36 promessas cumpridas.", category: "Ação documentada", status: "Realizado", url: "https://www.congressonacional.leg.br/en_US/sessoes/agenda-do-congresso-nacional/-/pauta/592942" },
    { title: "Reforma tributária", detail: "Emenda Constitucional 132, promulgada em 20/12/2023: unifica ICMS, ISS, IPI, PIS e Cofins em CBS e IBS. Em 2023 o Senado registrou que as leis complementares ainda precisavam ser votadas. O g1 (22/07/2026) a classifica como cumprida.", category: "Promessa / compromisso", status: "Realizado", url: "https://www12.senado.leg.br/noticias/materias/2023/12/20/congresso-promulga-reforma-tributaria" },
    { title: "Saída do Brasil do Mapa da Fome", detail: "Relatório da FAO divulgado em 21/07/2026: o Brasil segue fora do Mapa da Fome, com subalimentação abaixo de 2,5% (MDS). O g1 (22/07/2026) a classifica como cumprida.", category: "Promessa / compromisso", status: "Realizado", url: "https://www.gov.br/mds/pt-br/noticias/relatorio-da-onu-confirma-que-brasil-permanece-fora-do-mapa-da-fome-e-aponta-melhora-em-indicadores" },
    { title: "Retomada do Minha Casa, Minha Vida", detail: "O programa voltou pela MP 1.162, de 14/02/2023, convertida na Lei 14.620, de 13/07/2023 (Ministério das Cidades). O g1 (22/07/2026) a classifica como cumprida.", category: "Promessa / compromisso", status: "Realizado", url: "https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/habitacao/programa-minha-casa-minha-vida/sobre-o-minha-casa-minha-vida-1" },
    { title: "Retomada do Mais Médicos", detail: "Lei 14.621/2023, publicada em 14/07/2023, institui a Estratégia Nacional de Formação de Especialistas para a Saúde no âmbito do Mais Médicos (Câmara). O g1 (22/07/2026) classifica a retomada como cumprida.", category: "Promessa / compromisso", status: "Realizado", url: "https://www.camara.leg.br/noticias/980066-ENTRA-EM-VIGOR-LEI-QUE-INSTITUI-ESTRATEGIA-DE-APOIO-AO-PROGRAMA-MAIS-MEDICOS" },
    { title: "Pé-de-Meia", detail: "Criação da bolsa para estudantes concluírem o ensino médio, listada como concluída no levantamento da Folha de jan/2025.", category: "Promessa / compromisso", status: "Realizado", url: "https://www.gazetadopovo.com.br/republica/lula-metade-mandato-28-promessas-cumpridas/" },
    { title: "Desenrola Brasil", detail: "Programa criado pela MP 1.176/2023 e continuado pela Lei 14.690/2023, sancionada em 03/10/2023, para renegociar dívidas pessoais (Senado). A Folha (jan/2025) o lista como concluído.", category: "Promessa / compromisso", status: "Realizado", url: "https://www12.senado.leg.br/noticias/materias/2023/10/04/sancionada-a-lei-que-prorroga-desenrola-brasil-ate-o-fim-de-2023" },
    { title: "Mais investimento no Bolsa Atleta", detail: "Listada como concluída no levantamento da Folha de jan/2025.", category: "Promessa / compromisso", status: "Realizado", url: "https://www.gazetadopovo.com.br/republica/lula-metade-mandato-28-promessas-cumpridas/" },
    { title: "Estoques reguladores de alimentos", detail: "Listada como concluída no levantamento da Folha de jan/2025.", category: "Promessa / compromisso", status: "Realizado", url: "https://www.gazetadopovo.com.br/republica/lula-metade-mandato-28-promessas-cumpridas/" },
    { title: "Novo PAC", detail: "Retomada de investimentos públicos e parcerias em infraestrutura.", category: "Promessa / compromisso", status: "Em andamento", url: "https://www.gov.br/casacivil" },
    { title: "Retomada da reforma agrária", detail: "A Folha a listava como em andamento em jan/2025. A situação atual precisa ser confirmada em fonte oficial.", category: "Promessa / compromisso", status: "A validar", url: "https://www.gazetadopovo.com.br/republica/lula-metade-mandato-28-promessas-cumpridas/" },
    { title: "Reverter a privatização da Eletrobras", detail: "Em jan/2025 a Folha apontava que só avançou a discussão sobre ampliar o conselho de administração. A situação atual precisa ser confirmada.", category: "Promessa / compromisso", status: "A validar", url: "https://www.gazetadopovo.com.br/republica/lula-metade-mandato-28-promessas-cumpridas/" },
    { title: "Recriar o Ministério da Segurança Pública", detail: "O g1 (22/07/2026) a classifica como não cumprida: o governo condiciona a recriação à aprovação da PEC da Segurança. Em 14/10/2026 a PEC passou na CCJ do Senado e seguiu ao Plenário; em 15/10 foi retirada da pauta (Senado). A página do Senado não cita a criação do ministério.", category: "Promessa / compromisso", status: "Não cumprido", url: "https://www12.senado.leg.br/noticias/materias/2026/10/14/pec-da-seguranca-publica-esta-na-pauta-do-plenario-nesta-quinta-feira" },
    { title: "Revogar totalmente os decretos de sigilo", detail: "Classificada como não cumprida no balanço do g1 de 22/07/2026.", category: "Promessa / compromisso", status: "Não cumprido", url: "https://newsrondonia.com.br/politica/2026/07/22/balanco-de-governo-de-lula-aponta-26-promessas-cumpridas/" },
    { title: "Não buscar a reeleição em 2026", detail: "Classificada como não cumprida no balanço do g1 de 22/07/2026, que registra que Lula tentaria um quarto mandato.", category: "Promessa / compromisso", status: "Não cumprido", url: "https://newsrondonia.com.br/politica/2026/07/22/balanco-de-governo-de-lula-aponta-26-promessas-cumpridas/" },
    { title: "Reforma administrativa", detail: "O ND Mais (30/12/2025) a aponta como a principal promessa não cumprida. A Câmara só anunciou a criação do grupo de trabalho sobre o tema em 21/05/2025, mais de dois anos após o início do mandato.", category: "Promessa / compromisso", status: "Não cumprido", url: "https://www.camara.leg.br/noticias/1161492-motta-indica-deputado-pedro-paulo-para-coordenar-grupo-de-trabalho-da-reforma-administrativa/" },
    { title: "Acabar com a fila do SUS", detail: "O ND Mais (30/12/2025) diz que as filas não acabaram. O Programa Nacional de Redução de Filas (R$ 600 milhões iniciais) fez cerca de 1,1 milhão de cirurgias entre fev. e nov. de 2024, segundo o Ministério da Saúde.", category: "Promessa / compromisso", status: "Não cumprido", url: "https://ndmais.com.br/politica/promessas-de-lula-balanco-tres-anos-governo/" },
    { title: "Desmatamento zero", detail: "O ND Mais (30/12/2025) diz que a meta, com prazo até 2023, não foi cumprida, embora o PRODES tenha registrado queda de 11,08% na Amazônia Legal entre ago/2024 e jul/2025. O governo define o objetivo como eliminar o desmatamento ilegal e compensar o legal. A Folha a listava como em andamento em jan/2025.", category: "Promessa / compromisso", status: "Não cumprido", url: "https://ndmais.com.br/politica/promessas-de-lula-balanco-tres-anos-governo/" }
  ]
};

// Junta as três fontes: detalhados (acima), históricos e adicionais, sem duplicar títulos.
function merge(): Record<string, MandateRecord[]> {
  const out: Record<string, MandateRecord[]> = {};
  for (const source of [detailedRecords, historicalRecords, extraRecords]) {
    for (const [id, list] of Object.entries(source)) {
      const current = out[id] ?? (out[id] = []);
      for (const r of list) if (!current.some((c) => c.title === r.title)) current.push(r);
    }
  }
  return out;
}

export const mandateRecords: Record<string, MandateRecord[]> = merge();
