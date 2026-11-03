export type FuelId = "gasolina" | "etanol" | "diesel";

export type FuelPrice = {
  id: FuelId;
  name: string;
  /** Preço médio de revenda no Brasil, em R$ por litro, na semana mais recente. */
  now: number;
  /** Preço médio de revenda no Brasil, em R$ por litro, cerca de 12 meses antes. */
  yearAgo: number;
};

// Valores da Síntese Semanal do Comportamento dos Preços dos Combustíveis, da ANP (média nacional de revenda).
// Não se atualizam sozinhos: quando sair uma edição nova, troque os números e as datas abaixo.
// A síntese semanal da ANP traz apenas o diesel S10; o diesel comum (S500) não aparece nela.
export const fuelNowPeriod = "04/10 a 10/10/2026";
export const fuelYearAgoPeriod = "28/09 a 04/10/2025";

export const fuelSources = {
  now: { label: "ANP, edição 41/2026", url: "https://www.gov.br/anp/pt-br/assuntos/precos-e-defesa-da-concorrencia/precos/arq-sintese-semanal/2026/sintese-precos-41.pdf" },
  yearAgo: { label: "ANP, edição 40/2025", url: "https://www.gov.br/anp/pt-br/assuntos/precos-e-defesa-da-concorrencia/precos/arq-sintese-semanal/2025/setembro/sintese-precos-40.pdf" }
};

export const fuelPrices: FuelPrice[] = [
  { id: "gasolina", name: "Gasolina comum", now: 6.54, yearAgo: 6.20 },
  { id: "etanol", name: "Etanol", now: 4.14, yearAgo: 4.30 },
  { id: "diesel", name: "Diesel S10", now: 7.36, yearAgo: 6.06 }
];
