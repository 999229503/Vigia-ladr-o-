import type { MandateRecord } from "./mandates";

// Registros com fonte específica, conferida nas páginas citadas (não em portais genéricos).
// "Promessa / compromisso" com status "Não cumprido" ou "A validar" traz a data da apuração da fonte:
// a situação pode ter mudado depois dela.
// Levantamentos de imprensa são marcados no texto; leis e emendas apontam para a norma no Senado ou na Câmara.

const DCI_BOLSONARO = "https://www.dci.com.br/dci-mais/noticias/31-promessas-de-campanha-que-bolsonaro-nao-cumpriu/69578/";
const G1_BOLSONARO = "https://istoe.com.br/governo-bolsonaro-cumpriu-apenas-36-das-promessas-feitas-aponta-levantamento/";
const AGENCIA_ANTICRIME = "https://agenciabrasil.ebc.com.br/politica/noticia/2020-01/lei-anticrime-entra-em-vigor-hoje";

const CEF_DILMA_A = "https://congressoemfoco.com.br/noticia/53702/o-que-foi-realizado-e-o-que-ficou-so-na-promessa-de-dilma";
const CEF_DILMA_B = "https://congressoemfoco.com.br/noticia/53708/dilma-so-cumpriu-uma-entre-dez-grandes-metas";

const AOS_FATOS_TEMER = "https://aosfatos.org/noticias/um-ano-na-presidencia-checamos-o-que-temer-cumpriu-e-descumpriu-na-ponte-para-o-futuro/";
const PODER360_PREVIDENCIA = "https://www.poder360.com.br/governo/reforma-da-previdencia-esta-suspensa-diz-marun/";

export const verifiedRecords: Record<string, MandateRecord[]> = {
  bolsonaro: [
    { title: "Lei Anticrime", detail: "Sancionada em 24/12/2019 e em vigor desde 23/01/2020, reuniu parte da proposta de Sergio Moro e trechos de texto de comissão de juristas. Teve 25 vetos, e o juiz de garantias foi suspenso pelo STF em 22/01/2020. Moro reconheceu que nem tudo o que propôs foi aprovado (Agência Brasil).", category: "Promessa / compromisso", status: "Realizado", url: AGENCIA_ANTICRIME },
    { title: "No máximo 15 ministérios", detail: "Havia 22 ministros na posse, em janeiro de 2019. Depois da criação do Ministério das Comunicações, o governo mantinha 23 pastas (g1, 26/07/2022).", category: "Promessa / compromisso", status: "Não cumprido", url: G1_BOLSONARO },
    { title: "Acabar com a reeleição presidencial", detail: "Nenhuma mudança foi feita, e Bolsonaro sinalizou que poderia tentar um segundo mandato (Jornal DCI, apuração de dez/2020).", category: "Promessa / compromisso", status: "Não cumprido", url: DCI_BOLSONARO },
    { title: "Não aumentar impostos", detail: "Houve aumento das alíquotas do INSS para algumas categorias em março de 2020 (Jornal DCI, apuração de dez/2020).", category: "Promessa / compromisso", status: "Não cumprido", url: DCI_BOLSONARO },
    { title: "Unificar tributos federais", detail: "Não ocorreu até dez/2020, embora conste do projeto enviado ao Congresso em julho de 2020 (Jornal DCI).", category: "Promessa / compromisso", status: "Não cumprido", url: DCI_BOLSONARO },
    { title: "Alíquota única de 20% no Imposto de Renda, com isenção até 5 salários mínimos", detail: "Não foi criada, e a reforma tributária enviada não tratava do tema (Jornal DCI, apuração de dez/2020).", category: "Promessa / compromisso", status: "Não cumprido", url: DCI_BOLSONARO },
    { title: "Reduzir em 20% o volume da dívida pública", detail: "O estoque subiu de R$ 4,35 trilhões (dez/2019) para R$ 4,64 trilhões (out/2020) (Jornal DCI).", category: "Promessa / compromisso", status: "Não cumprido", url: DCI_BOLSONARO },
    { title: "Superávit primário em 2020", detail: "O déficit acumulado até outubro de 2020 foi de R$ 681 bilhões (Jornal DCI).", category: "Promessa / compromisso", status: "Não cumprido", url: DCI_BOLSONARO },
    { title: "Transferir a embaixada em Israel para Jerusalém", detail: "Não foi feita. Em 2019 foi proposto um escritório comercial em Jerusalém (Jornal DCI, apuração de dez/2020).", category: "Promessa / compromisso", status: "Não cumprido", url: DCI_BOLSONARO },
    { title: "Um colégio militar em cada capital", detail: "Apenas 14 das 27 capitais tinham um colégio militar na apuração de dez/2020 (Jornal DCI).", category: "Promessa / compromisso", status: "Não cumprido", url: DCI_BOLSONARO },
    { title: "Criar o Fundo Nacional da Pessoa com Deficiência", detail: "O fundo não foi criado, e o projeto estava parado no Senado na apuração de dez/2020 (Jornal DCI).", category: "Promessa / compromisso", status: "Não cumprido", url: DCI_BOLSONARO }
  ],
  temer: [
    { title: "Programa de Parcerias de Investimentos", detail: "Lançado com 34 projetos de concessão. O Aos Fatos o classificou como “em vigor” em 10/05/2017: o leilão de 4 aeroportos arrecadou R$ 3,72 bilhões.", category: "Promessa / compromisso", status: "Realizado", url: AOS_FATOS_TEMER },
    { title: "Reforma da Previdência (PEC 287)", detail: "A proposta original previa idade mínima de 65 anos para ambos os sexos, e o governo cedeu para 65 (homens) e 62 (mulheres). Em 19/02/2018, o ministro Carlos Marun disse que a tramitação estava suspensa por causa da intervenção federal no Rio, pois emendas constitucionais não podem ser votadas durante intervenção. O governo ainda não tinha os 308 votos necessários.", category: "Promessa / compromisso", status: "Não cumprido", url: PODER360_PREVIDENCIA },
    { title: "Governança das estatais e agências reguladoras", detail: "A Lei das Estatais foi sancionada em junho de 2016, mas em março de 2017 o presidente nomeou pessoas ligadas ao PPS e ao PSD para a diretoria da Itaipu Binacional. O Aos Fatos mudou a classificação de “em vigor” (jan/2017) para “descumpriu” (10/05/2017).", category: "Promessa / compromisso", status: "Não cumprido", url: AOS_FATOS_TEMER },
    { title: "Inflação no centro da meta de 4,5%", detail: "Em 10/05/2017 a previsão do IPCA para 2017 era de 4,01%, e a Selic havia caído de 12,25% para 11,25%. O Aos Fatos registra que especialistas atribuíam a queda da inflação sobretudo à baixa atividade econômica.", category: "Promessa / compromisso", status: "Em andamento", url: AOS_FATOS_TEMER },
    { title: "Acordos comerciais regionais e inserção no comércio internacional", detail: "Rodadas de negociação União Europeia–Mercosul em outubro de 2016 e março de 2017, além de um acordo automotivo com a Argentina até 2020. Classificado como “em curso” em 10/05/2017 (Aos Fatos).", category: "Promessa / compromisso", status: "Em andamento", url: AOS_FATOS_TEMER },
    { title: "Simplificação tributária e unificação do ICMS", detail: "O Aos Fatos o classificou como “sem avanços” em 10/05/2017: a reforma foi fatiada em medidas provisórias, começando por PIS e Cofins.", category: "Promessa / compromisso", status: "A validar", url: AOS_FATOS_TEMER },
    { title: "Agenda de transparência e avaliação de políticas públicas (Bolsa Família)", detail: "Classificado como “sem avanços” em 10/05/2017. Em novembro de 2016 o ministério anunciou o cancelamento de 469 mil benefícios e o bloqueio de 654 mil, mas auditorias já ocorriam nos governos anteriores (Aos Fatos).", category: "Promessa / compromisso", status: "A validar", url: AOS_FATOS_TEMER }
  ],
  "dilma-1": [
    { title: "Medicamentos gratuitos para hipertensão e diabetes", detail: "Promessa de 2010. Segundo o Congresso em Foco (30/09/2014), foi a única das principais metas cumprida integralmente: os remédios eram oferecidos em cerca de 15 mil drogarias conveniadas ao Farmácia Popular.", category: "Promessa / compromisso", status: "Realizado", url: CEF_DILMA_A },
    { title: "6.000 creches", detail: "Em 2014 o governo falava em creches contratadas, não construídas: 6.036 unidades com recursos autorizados até maio de 2014. O Congresso em Foco (30/09/2014) a classificou como não cumprida.", category: "Promessa / compromisso", status: "Não cumprido", url: CEF_DILMA_A },
    { title: "Todo o país na classe média", detail: "A campanha de 2014 dizia que 55% da população estava na classe média, e as classes D e E somavam 25%. O Congresso em Foco (30/09/2014) a classificou como não cumprida.", category: "Promessa / compromisso", status: "Não cumprido", url: CEF_DILMA_A },
    { title: "Estender o ProUni ao ensino médio", detail: "Em 2014 nada parecido havia saído do papel. O governo apontou o Pronatec como alternativa (Congresso em Foco, 30/09/2014).", category: "Promessa / compromisso", status: "Não cumprido", url: CEF_DILMA_A },
    { title: "Comprar ao menos 10 drones para vigiar as fronteiras", detail: "O governo orçou 14 drones, mas havia recebido apenas 4 na apuração de 2014 (Congresso em Foco).", category: "Promessa / compromisso", status: "Não cumprido", url: CEF_DILMA_A },
    { title: "Erradicar a extrema pobreza", detail: "A campanha afirmava que 22 milhões de pessoas superaram a extrema pobreza, mas o governo admitia que cerca de 300 mil famílias ainda não haviam sido rastreadas (Congresso em Foco, 30/09/2014).", category: "Promessa / compromisso", status: "A validar", url: CEF_DILMA_A },
    { title: "2 milhões de moradias no Minha Casa, Minha Vida", detail: "O governo previa contratar as 2 milhões de unidades até o fim de 2014, mas em 30/09/2014 ainda não as tinha entregue. Prometia outras 3 milhões para 2015 (Congresso em Foco).", category: "Promessa / compromisso", status: "A validar", url: CEF_DILMA_A },
    { title: "10 mil quadras esportivas cobertas", detail: "A previsão do governo era construir 6.116 quadras até o fim de 2014 e cobrir cerca de 4 mil já existentes. A campanha usava o termo “contratadas” (Congresso em Foco, 30/09/2014).", category: "Promessa / compromisso", status: "A validar", url: CEF_DILMA_A },
    { title: "Zerar PIS/Cofins em saneamento, energia e transportes", detail: "O governo desonerou a cesta básica e a folha de 56 setores e reduziu alíquotas na conta de luz, mas não zerou os tributos nas áreas prometidas (Congresso em Foco, 30/09/2014).", category: "Promessa / compromisso", status: "A validar", url: CEF_DILMA_A },
    { title: "Cumprir o piso nacional do magistério", detail: "A promessa era fazer cumprir uma lei já existente, mas os salários são pagos sobretudo por estados e municípios. O MEC disse não ter responsabilidade legal por exigir o cumprimento, e a meta aparece sem resultado concreto na apuração de 2014 (Congresso em Foco).", category: "Promessa / compromisso", status: "A validar", url: CEF_DILMA_B }
  ],
  "dilma-2": [
    { title: "Endurecimento das regras do seguro-desemprego e do abono salarial", detail: "Lei sancionada com vetos e publicada em 17/06/2015, como parte do ajuste fiscal. Dilma vetou a exigência de 90 dias trabalhados para o abono (mantidos os 30 dias) e a regra mais restritiva para o trabalhador rural. A medida provisória de origem (MP 665) foi criticada por centrais sindicais e pelo relator, do PT, em audiência no Senado em abril de 2015.", category: "Ação documentada", status: "Realizado", url: "https://www.congressoemfoco.com.br/noticia/75010/dilma-sanciona-com-vetos-lei-que-altera-regras-do-seguro-desemprego" }
  ],
  "lula-1": [
    { title: "Assentar 400 mil famílias até 2006", detail: "Em 23/12/2005, nos três primeiros anos do governo, 235.055 famílias haviam sido assentadas, pouco mais da metade da meta, e o ministro Miguel Rossetto afirmava que ela seria atingida. O MST contestou os números, dizendo que o governo contava a reposição de lotes antigos como novos assentamentos. O resultado final precisa ser conferido.", category: "Promessa / compromisso", status: "A validar", url: "https://www.tribunapr.com.br/noticias/brasil/governo-ainda-promete-assentar-400-mil-familias/?noamp=mobile" }
  ],
  "fhc-1": [
    { title: "Emenda Constitucional 14/1996 (base do Fundef)", detail: "Emenda de 12/09/1996 que alterou os artigos 34, 208, 211 e 212 da Constituição e o artigo 60 do ADCT, para a nova divisão de recursos do ensino fundamental.", category: "Ação documentada", status: "Realizado", url: "https://www2.camara.leg.br/legin/fed/emecon/1996/emendaconstitucional-14-12-setembro-1996-372814-norma-pl.html" }
  ]
};
