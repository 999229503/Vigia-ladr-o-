import type { MandateRecord } from "./mandates";

// Registros dos demais mandatos listados em presidents.ts, indexados pelo mesmo `id`.
// São fatos históricos amplamente documentados, escritos de forma resumida e neutra.
// Os links apontam para portais oficiais de consulta (Arquivo Nacional, Planalto, Câmara, Senado);
// antes de divulgação pública, confira cada item na fonte e troque o link geral pelo documento específico.
// Status "Realizado" = fato documentado. "A validar" = falta confirmar detalhe em fonte oficial.

const AN = "https://presidentes.an.gov.br/";
const PLANALTO = "https://www.planalto.gov.br/";
const CAMARA = "https://www.camara.leg.br/";
const SENADO = "https://www.senado.leg.br/";
const CNV = "https://cnv.memoriasreveladas.gov.br/";

export const historicalRecords: Record<string, MandateRecord[]> = {
  prudente: [
    { title: "Pacificação do Rio Grande do Sul", detail: "Fim da Revolução Federalista, com acordo de pacificação em 1895.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Fim da Guerra de Canudos", detail: "Conflito no sertão da Bahia encerrado em 1897 com a destruição do arraial, após campanhas militares do governo federal.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "campos-salles": [
    { title: "Funding loan", detail: "Acordo de 1898 com credores estrangeiros para renegociar a dívida externa, em troca de medidas de contenção fiscal.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Política dos governadores", detail: "Arranjo de apoio mútuo entre o governo federal e as oligarquias estaduais, que marcou a política da República Velha.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "rodrigues-alves": [
    { title: "Reforma urbana e sanitária do Rio de Janeiro", detail: "Obras de remodelação da capital e campanha de saneamento, com Pereira Passos e Oswaldo Cruz.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Tratado de Petrópolis (Acre)", detail: "Acordo de 1903 com a Bolívia que incorporou o território do Acre ao Brasil.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Revolta da Vacina", detail: "Reação popular de 1904 à vacinação obrigatória contra a varíola, reprimida pelo governo.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "afonso-pena": [
    { title: "Comissão Rondon", detail: "Expedições de instalação de linhas telegráficas no interior do país, iniciadas em 1907.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Valorização do café (Convênio de Taubaté)", detail: "Política de compra de excedentes de café para sustentar preços, firmada em 1906. A atribuição exata ao governo federal na época precisa ser conferida.", category: "Ação documentada", status: "A validar", url: AN }
  ],
  "nilo-pecanha": [
    { title: "Criação do Serviço de Proteção aos Índios (SPI)", detail: "Órgão federal criado em 1910 para tratar das relações do Estado com os povos indígenas.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Ministério da Agricultura, Indústria e Comércio", detail: "Criado em 1909, no início do mandato.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "hermes-fonseca": [
    { title: "Revolta da Chibata", detail: "Motim de marinheiros em 1910 contra castigos corporais; o governo aprovou anistia aos revoltosos.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Política das salvações", detail: "Intervenções federais em estados para substituir oligarquias locais.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  venceslau: [
    { title: "Código Civil de 1916", detail: "Primeiro Código Civil brasileiro, sancionado em janeiro de 1916 (Lei 3.071).", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Entrada do Brasil na Primeira Guerra Mundial", detail: "Declaração de guerra à Alemanha em 1917.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "delfim-moreira": [
    { title: "Lei de acidentes do trabalho", detail: "Decreto de 1919 que instituiu a responsabilidade do empregador por acidentes de trabalho.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Presidência interina", detail: "Assumiu após a morte de Rodrigues Alves, eleito para novo mandato, e conduziu a eleição que levou Epitácio Pessoa ao cargo.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  epitacio: [
    { title: "Obras contra as secas", detail: "Criação da Inspetoria Federal de Obras contra as Secas, com açudes e infraestrutura no Nordeste.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Exposição Internacional do Centenário", detail: "Evento no Rio de Janeiro em 1922, pelos 100 anos da Independência.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "artur-bernardes": [
    { title: "Estado de sítio", detail: "Governou em estado de sítio durante grande parte do mandato, em meio a revoltas tenentistas.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Repressão às revoltas tenentistas", detail: "Combate aos levantes militares de 1922 e 1924, que originaram a Coluna Prestes.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "washington-luis": [
    { title: "“Governar é abrir estradas”", detail: "Expansão rodoviária, com destaque para a ligação Rio–São Paulo.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Estabilização monetária", detail: "Reforma de 1926 com a Caixa de Estabilização, para fixar o valor da moeda.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "getulio-vargas": [
    { title: "Consolidação das Leis do Trabalho (CLT)", detail: "Reuniu a legislação trabalhista em 1943.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Voto feminino", detail: "O Código Eleitoral de 1932 garantiu às mulheres o direito de votar.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Companhia Siderúrgica Nacional", detail: "Usina de Volta Redonda, inaugurada em 1941 e símbolo da industrialização.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "jose-linhares": [
    { title: "Condução da transição democrática", detail: "Presidiu o país entre outubro de 1945 e janeiro de 1946, e as eleições de dezembro de 1945 foram realizadas em seu período.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "eurico-gaspar-dutra": [
    { title: "Constituição de 1946", detail: "Promulgada em setembro de 1946, restabelecendo o regime democrático.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Plano SALTE", detail: "Programa de 1948 para saúde, alimentação, transporte e energia.", category: "Promessa / compromisso", status: "A validar", url: AN },
    { title: "Proibição dos jogos de azar", detail: "Decreto de 1946 que fechou os cassinos no país.", category: "Ação documentada", status: "Realizado", url: PLANALTO }
  ],
  "getulio-vargas-2": [
    { title: "Criação da Petrobras", detail: "Lei 2.004, de 1953, estabeleceu o monopólio estatal do petróleo e criou a empresa.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Banco Nacional de Desenvolvimento Econômico (BNDE)", detail: "Criado em 1952 para financiar projetos de infraestrutura e indústria.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Reajuste do salário mínimo em 1954", detail: "Aumento de 100% anunciado em 1º de maio de 1954.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "cafe-filho": [
    { title: "Assunção após a morte de Vargas", detail: "Vice-presidente, assumiu em agosto de 1954 e concluiu a transição até as eleições de 1955.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Instrução 113 da SUMOC", detail: "Norma de 1955 que facilitou a entrada de capital estrangeiro na indústria.", category: "Ação documentada", status: "A validar", url: AN }
  ],
  "carlos-luz": [
    { title: "Presidência de poucos dias", detail: "Assumiu em novembro de 1955 e foi afastado em 11/11/1955 pelo movimento liderado pelo ministro da Guerra, general Lott.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "nereu-ramos": [
    { title: "Garantia da posse de Juscelino Kubitschek", detail: "Governou de novembro de 1955 a janeiro de 1956 e passou o cargo ao presidente eleito em 31/01/1956.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  juscelino: [
    { title: "Plano de Metas", detail: "Programa de “50 anos em 5”, com foco em energia, transporte, indústria e educação.", category: "Promessa / compromisso", status: "Realizado", url: AN },
    { title: "Construção e inauguração de Brasília", detail: "Nova capital inaugurada em 21 de abril de 1960.", category: "Promessa / compromisso", status: "Realizado", url: AN },
    { title: "Indústria automobilística", detail: "Criação do grupo executivo do setor e instalação de montadoras no país.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  janio: [
    { title: "Renúncia", detail: "Renunciou em 25 de agosto de 1961, cerca de sete meses após a posse.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Política externa independente", detail: "Aproximação com países do bloco socialista e do Terceiro Mundo.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "joao-goulart": [
    { title: "Parlamentarismo e plebiscito", detail: "Assumiu sob o parlamentarismo; em janeiro de 1963 o plebiscito restabeleceu o presidencialismo.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Estatuto do Trabalhador Rural", detail: "Estendeu direitos trabalhistas ao campo, em 1963.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Reformas de base", detail: "Proposta de reformas agrária, urbana, bancária e educacional, interrompida pelo golpe de 31 de março de 1964.", category: "Promessa / compromisso", status: "Não cumprido", url: AN }
  ],
  "ranieri-mazzilli": [
    { title: "Interinidade em 1964", detail: "Presidente da Câmara, assumiu em abril de 1964 após a vacância do cargo e passou a faixa a Castelo Branco em 15/04/1964.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "castelo-branco": [
    { title: "Ato Institucional nº 1 e Ato nº 2", detail: "Cassações de mandatos e, em 1965, extinção dos partidos, com instituição do bipartidarismo.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Criação do Banco Central", detail: "Lei 4.595, de 1964, que reestruturou o sistema financeiro nacional.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Estatuto da Terra e FGTS", detail: "Estatuto da Terra (1964) e criação do Fundo de Garantia do Tempo de Serviço (1966).", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Constituição de 1967", detail: "Nova Constituição aprovada pelo Congresso sob o regime militar.", category: "Ação documentada", status: "Realizado", url: PLANALTO }
  ],
  "costa-e-silva": [
    { title: "Ato Institucional nº 5", detail: "Editado em 13/12/1968; suspendeu garantias constitucionais e ampliou os poderes do Executivo.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Início das obras da Ponte Rio–Niterói", detail: "Construção começou em 1968; a inauguração foi em 1974.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Afastamento por doença", detail: "Em agosto de 1969 foi impedido de governar por problema de saúde, e o poder passou a uma junta militar.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "junta-1969": [
    { title: "Emenda Constitucional nº 1, de 1969", detail: "Reformou amplamente a Constituição de 1967.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Atos de banimento e pena de morte", detail: "Atos Institucionais nº 13 e nº 14, de setembro de 1969, ampliaram punições políticas.", category: "Ação documentada", status: "Realizado", url: PLANALTO }
  ],
  medici: [
    { title: "“Milagre econômico”", detail: "Período de forte crescimento do PIB e da industrialização, com aumento da concentração de renda.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Rodovia Transamazônica", detail: "Obras iniciadas em 1970 para integrar a Amazônia ao restante do país.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Mobral", detail: "Movimento Brasileiro de Alfabetização, criado em 1970.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Repressão política", detail: "Período de maior intensidade das violações de direitos humanos registradas pela Comissão Nacional da Verdade.", category: "Ação documentada", status: "Realizado", url: CNV }
  ],
  geisel: [
    { title: "Distensão “lenta, gradual e segura”", detail: "Início da abertura política gradual, controlada pelo governo.", category: "Promessa / compromisso", status: "Realizado", url: AN },
    { title: "Pacote de Abril", detail: "Medidas de 1977 que fecharam o Congresso e alteraram regras eleitorais.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Fim do AI-5", detail: "Emenda Constitucional 11/1978, com efeitos a partir de 1º de janeiro de 1979.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "II Plano Nacional de Desenvolvimento", detail: "Programa de investimentos em energia, indústria de base e infraestrutura.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  figueiredo: [
    { title: "Lei da Anistia", detail: "Lei 6.683, de 28/08/1979.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Fim do bipartidarismo", detail: "Reforma partidária de 1979, que permitiu novos partidos.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Eleições diretas para governadores", detail: "Realizadas em 1982, pela primeira vez desde 1965.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Emenda Dante de Oliveira (Diretas Já)", detail: "A proposta de eleição direta para presidente foi rejeitada na Câmara em abril de 1984.", category: "Ação documentada", status: "Realizado", url: CAMARA }
  ],
  sarney: [
    { title: "Plano Cruzado", detail: "Plano de 1986 com congelamento de preços e nova moeda; a inflação voltou nos anos seguintes.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Assembleia Nacional Constituinte", detail: "Convocada em 1985; resultou na Constituição promulgada em 5 de outubro de 1988.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Voto do analfabeto", detail: "Emenda Constitucional 25, de 1985, que permitiu o voto de analfabetos.", category: "Ação documentada", status: "Realizado", url: PLANALTO }
  ],
  collor: [
    { title: "Plano Collor", detail: "Plano de março de 1990 que bloqueou depósitos e aplicações financeiras.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Abertura comercial e desestatização", detail: "Redução de tarifas de importação e criação do Programa Nacional de Desestatização (Lei 8.031/1990).", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Eco-92", detail: "Conferência das Nações Unidas sobre meio ambiente realizada no Rio de Janeiro em 1992.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Impeachment e renúncia", detail: "A Câmara autorizou o processo em setembro de 1992 e Collor renunciou em 29/12/1992.", category: "Ação documentada", status: "Realizado", url: CAMARA }
  ],
  itamar: [
    { title: "Plano Real", detail: "URV em 1994 e nova moeda em 1º de julho de 1994, que reduziu a inflação.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Plebiscito de 1993", detail: "Eleitores mantiveram a república e o presidencialismo.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Lei de Licitações", detail: "Lei 8.666, de 1993, que regulamentou licitações e contratos públicos.", category: "Ação documentada", status: "Realizado", url: PLANALTO }
  ],
  "fhc-1": [
    { title: "Consolidação do Plano Real", detail: "Manutenção da estabilidade de preços iniciada em 1994.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Emenda da reeleição", detail: "Emenda Constitucional 16, de 1997, que permitiu reeleição para cargos do Executivo.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Privatizações", detail: "Venda da Vale (1997) e do sistema Telebras (1998), entre outras.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Reformas administrativa e previdenciária", detail: "Emendas Constitucionais 19 e 20, de 1998.", category: "Promessa / compromisso", status: "Realizado", url: PLANALTO }
  ],
  "dilma-2": [
    { title: "Ajuste fiscal de 2015", detail: "Corte de gastos e aumento de tributos no início do segundo mandato.", category: "Ação documentada", status: "Realizado", url: AN },
    { title: "Lei do Feminicídio", detail: "Lei 13.104, de março de 2015.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Lei Antiterrorismo", detail: "Lei 13.260, de março de 2016.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Impeachment", detail: "O Senado decidiu pelo afastamento definitivo em 31/08/2016.", category: "Ação documentada", status: "Realizado", url: SENADO }
  ]
};

// Registros adicionais para mandatos que já tinham itens em mandates.ts (são somados, sem substituir).
export const extraRecords: Record<string, MandateRecord[]> = {
  deodoro: [
    { title: "Dissolução do Congresso e renúncia", detail: "Fechou o Congresso em 3/11/1891 e renunciou em 23/11/1891, após reação militar e política.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  floriano: [
    { title: "Assunção da presidência em 1891", detail: "Vice-presidente, assumiu com a renúncia de Deodoro e concluiu o mandato sem convocar nova eleição.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "fhc-2": [
    { title: "Lei de Responsabilidade Fiscal", detail: "Lei Complementar 101, de 2000, que fixou limites de gasto e endividamento para União, estados e municípios.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Lei dos Genéricos", detail: "Lei 9.787, de 1999, que criou os medicamentos genéricos no país.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Bolsa Escola", detail: "Programa de renda mínima ligado à frequência escolar, criado em 2001.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Racionamento de energia de 2001", detail: "Crise de abastecimento elétrico que levou a metas obrigatórias de redução de consumo.", category: "Ação documentada", status: "Realizado", url: AN }
  ],
  "lula-1": [
    { title: "Estatuto do Desarmamento", detail: "Lei 10.826, de dezembro de 2003.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "ProUni", detail: "Lei 11.096, de 2005, que criou bolsas em faculdades privadas.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Lei Maria da Penha", detail: "Lei 11.340, de agosto de 2006, contra a violência doméstica e familiar.", category: "Ação documentada", status: "Realizado", url: PLANALTO }
  ],
  "lula-2": [
    { title: "Minha Casa, Minha Vida", detail: "Programa habitacional criado pela Lei 11.977, de 2009.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Lei da Ficha Limpa", detail: "Lei Complementar 135, de junho de 2010, que ampliou as hipóteses de inelegibilidade.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Regime de partilha do pré-sal", detail: "Lei 12.351, de dezembro de 2010.", category: "Ação documentada", status: "Realizado", url: PLANALTO }
  ],
  "dilma-1": [
    { title: "Lei de Acesso à Informação", detail: "Lei 12.527, de 2011.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Comissão Nacional da Verdade", detail: "Criada pela Lei 12.528, de 2011, para apurar violações de direitos humanos de 1946 a 1988.", category: "Ação documentada", status: "Realizado", url: CNV },
    { title: "Lei de Cotas nas universidades federais", detail: "Lei 12.711, de 2012.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Marco Civil da Internet", detail: "Lei 12.965, sancionada em abril de 2014.", category: "Ação documentada", status: "Realizado", url: PLANALTO }
  ],
  temer: [
    { title: "Reforma do Ensino Médio", detail: "Lei 13.415, de 2017, que alterou o currículo e a carga horária.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Lei da Terceirização", detail: "Lei 13.429, de 2017, que ampliou a terceirização do trabalho.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Intervenção federal na segurança do Rio de Janeiro", detail: "Decretada em fevereiro de 2018.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Reforma da Previdência", detail: "A proposta (PEC 287) foi enviada ao Congresso, mas não chegou a ser votada no mandato.", category: "Promessa / compromisso", status: "Não cumprido", url: CAMARA }
  ],
  bolsonaro: [
    { title: "Reforma da Previdência", detail: "Emenda Constitucional 103, de novembro de 2019.", category: "Promessa / compromisso", status: "Realizado", url: PLANALTO },
    { title: "Lei de Liberdade Econômica", detail: "Lei 13.874, de 2019, que reduziu exigências para abrir e tocar empresas.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Auxílio Emergencial", detail: "Lei 13.982, de 2020, com pagamentos a trabalhadores informais durante a pandemia.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Autonomia do Banco Central", detail: "Lei Complementar 179, de 2021, que fixou mandatos para a diretoria.", category: "Ação documentada", status: "Realizado", url: PLANALTO },
    { title: "Privatização da Eletrobras", detail: "Lei 14.182, de 2021, que permitiu a desestatização da empresa.", category: "Promessa / compromisso", status: "Realizado", url: PLANALTO },
    { title: "Reforma tributária", detail: "Prometida no início do mandato, não foi aprovada até 2022.", category: "Promessa / compromisso", status: "Não cumprido", url: CAMARA },
    { title: "Reforma administrativa", detail: "A PEC 32/2020 não foi votada no Plenário durante o mandato.", category: "Promessa / compromisso", status: "Não cumprido", url: CAMARA }
  ]
};
