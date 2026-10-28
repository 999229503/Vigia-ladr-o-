export type President = {
  id: string; name: string; start: number; end: number | null;
  party?: string; period: "República Velha" | "Era Vargas" | "República de 1946" | "Regime militar" | "Nova República" | "Outro";
  note?: string;
};

// Seed inicial para validar a interface. A lista não deve ser tratada como cadastro histórico completo.
// Antes de publicar, revisar nomes, datas, interinidades e fontes com documentação oficial.
export const presidents: President[] = [
  { id: "deodoro", name: "Deodoro da Fonseca", start: 1889, end: 1891, period: "República Velha" },
  { id: "floriano", name: "Floriano Peixoto", start: 1891, end: 1894, period: "República Velha" },
  { id: "prudente", name: "Prudente de Morais", start: 1894, end: 1898, period: "República Velha" },
  { id: "campos-salles", name: "Campos Sales", start: 1898, end: 1902, period: "República Velha" },
  { id: "rodrigues-alves", name: "Rodrigues Alves", start: 1902, end: 1906, period: "República Velha" },
  { id: "afonso-pena", name: "Afonso Pena", start: 1906, end: 1909, period: "República Velha" },
  { id: "nilo-pecanha", name: "Nilo Peçanha", start: 1909, end: 1910, period: "República Velha" },
  { id: "hermes-fonseca", name: "Hermes da Fonseca", start: 1910, end: 1914, period: "República Velha" },
  { id: "venceslau", name: "Venceslau Brás", start: 1914, end: 1918, period: "República Velha" },
  { id: "delfim-moreira", name: "Delfim Moreira", start: 1918, end: 1919, period: "República Velha" },
  { id: "epitacio", name: "Epitácio Pessoa", start: 1919, end: 1922, period: "República Velha" },
  { id: "artur-bernardes", name: "Artur Bernardes", start: 1922, end: 1926, period: "República Velha" },
  { id: "washington-luis", name: "Washington Luís", start: 1926, end: 1930, period: "República Velha" },
  { id: "getulio-vargas", name: "Getúlio Vargas", start: 1930, end: 1945, period: "Era Vargas", note: "Período longo com fases políticas distintas; deve ser dividido por fase na análise." },
  { id: "jose-linhares", name: "José Linhares", start: 1945, end: 1946, period: "Outro", note: "Presidência de transição." },
  { id: "eurico-gaspar-dutra", name: "Eurico Gaspar Dutra", start: 1946, end: 1951, period: "República de 1946" },
  { id: "getulio-vargas-2", name: "Getúlio Vargas", start: 1951, end: 1954, period: "República de 1946", note: "Segundo período presidencial; separado do período 1930–1945." },
  { id: "cafe-filho", name: "Café Filho", start: 1954, end: 1955, period: "República de 1946" },
  { id: "carlos-luz", name: "Carlos Luz", start: 1955, end: 1955, period: "Outro", note: "Presidência breve; datas exatas e contexto devem ser validados." },
  { id: "nereo-ramos", name: "Nereu Ramos", start: 1955, end: 1956, period: "Outro", note: "Presidência de transição." },
  { id: "juscelino", name: "Juscelino Kubitschek", start: 1956, end: 1961, period: "República de 1946" },
  { id: "janio", name: "Jânio Quadros", start: 1961, end: 1961, period: "República de 1946" },
  { id: "joao-goulart", name: "João Goulart", start: 1961, end: 1964, period: "República de 1946" },
  { id: "ranieri-mazzilli", name: "Ranieri Mazzilli", start: 1964, end: 1964, period: "Outro", note: "Interinidade; validar tratamento cronológico na base definitiva." },
  { id: "castelo-branco", name: "Castelo Branco", start: 1964, end: 1967, period: "Regime militar" },
  { id: "costa-e-silva", name: "Costa e Silva", start: 1967, end: 1969, period: "Regime militar" },
  { id: "augusto-rademaker", name: "Junta Militar de 1969", start: 1969, end: 1969, period: "Outro", note: "Governo colegiado, não presidente individual." },
  { id: "medici", name: "Emílio Garrastazu Médici", start: 1969, end: 1974, period: "Regime militar" },
  { id: "geisel", name: "Ernesto Geisel", start: 1974, end: 1979, period: "Regime militar" },
  { id: "figueiredo", name: "João Figueiredo", start: 1979, end: 1985, period: "Regime militar" },
  { id: "sarney", name: "José Sarney", start: 1985, end: 1990, period: "Nova República" },
  { id: "collor", name: "Fernando Collor", start: 1990, end: 1992, period: "Nova República" },
  { id: "itamar", name: "Itamar Franco", start: 1992, end: 1995, period: "Nova República" },
  { id: "fhc-1", name: "Fernando Henrique Cardoso — 1º mandato", start: 1995, end: 1999, period: "Nova República" },
  { id: "fhc-2", name: "Fernando Henrique Cardoso — 2º mandato", start: 1999, end: 2003, period: "Nova República" },
  { id: "lula-1", name: "Luiz Inácio Lula da Silva — 1º mandato", start: 2003, end: 2007, period: "Nova República" },
  { id: "lula-2", name: "Luiz Inácio Lula da Silva — 2º mandato", start: 2007, end: 2011, period: "Nova República" },
  { id: "dilma-1", name: "Dilma Rousseff — 1º mandato", start: 2011, end: 2015, period: "Nova República" },
  { id: "dilma-2", name: "Dilma Rousseff — 2º mandato", start: 2015, end: 2016, period: "Nova República", note: "Mandato interrompido em 2016." },
  { id: "temer", name: "Michel Temer", start: 2016, end: 2019, period: "Nova República" },
  { id: "bolsonaro", name: "Jair Bolsonaro", start: 2019, end: 2023, period: "Nova República" },
  { id: "lula-3", name: "Luiz Inácio Lula da Silva — mandato iniciado em 2023", start: 2023, end: null, period: "Nova República", note: "Mandato em curso; atualizar apenas com fontes recentes." }
];