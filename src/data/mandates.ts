export type MandateStatus = "Realizado" | "Em andamento" | "A validar";

export type MandateRecord = {
  title: string;
  detail: string;
  category: "Ação documentada" | "Promessa / compromisso";
  status: MandateStatus;
  url: string;
};

export const mandateStatuses: MandateStatus[] = ["Realizado", "Em andamento", "A validar"];

// Registros iniciais, indexados pelo `id` de cada mandato em presidents.ts.
// São uma amostra para validar a interface: cada item precisa ser conferido na fonte antes de divulgação pública.
// O status "A validar" marca registros cuja situação não foi confirmada em fonte oficial.
export const mandateRecords: Record<string, MandateRecord[]> = {
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
    { title: "Novo PAC", detail: "Retomada de investimentos públicos e parcerias em infraestrutura.", category: "Promessa / compromisso", status: "Em andamento", url: "https://www.gov.br/casacivil" }
  ]
};
