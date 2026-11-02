export type SocialIndicator = {
  id: "saude" | "educacao" | "seguranca";
  name: string;
  title: string;
  headline: string;
  caption: string;
  lines: string[];
  source: string;
  url: string;
};

// Valores publicados por cada fonte, conferidos na data abaixo. Não são atualizados automaticamente:
// quando uma nova edição sair (IDEB, Anuário de Segurança, estimativas do Unicef), revise este arquivo.
export const socialCheckedAt = "01/11/2026";

export const socialIndicators: SocialIndicator[] = [
  {
    id: "saude",
    name: "Saúde",
    title: "Mortalidade na infância",
    headline: "14 por mil",
    caption: "Mort. até 5 anos · 2024",
    lines: [
      "Mortalidade de menores de 5 anos: 14 por mil nascidos vivos em 2024, contra 63 por mil no ponto de partida da série citada pela fonte.",
      "Mortalidade neonatal (primeiros 28 dias): 7 por mil nascidos vivos, contra 25 por mil."
    ],
    source: "Unicef, divulgado em 17/03/2026 (via DGABC)",
    url: "https://www.dgabc.com.br/Noticia/4290758/brasil-atinge-menor-indice-de-mortalidade-infantil-em-34-anos-aponta-unicef"
  },
  {
    id: "educacao",
    name: "Educação",
    title: "IDEB 2025 (total do país)",
    headline: "6,3 IDEB",
    caption: "Anos iniciais · 2025",
    lines: [
      "Anos iniciais: 6,3 (2023: 6,0; meta: 6,0).",
      "Anos finais: 5,3 (2023: 5,0; meta: 5,5).",
      "Ensino médio: 4,5 (2023: 4,3; meta: 5,2)."
    ],
    source: "MEC/Inep, divulgado em 05/08/2026 (via Agência Brasil)",
    url: "https://agenciabrasil.ebc.com.br/educacao/noticia/2026-08/ideb-mostra-avanco-da-educacao-basica-no-pais"
  },
  {
    id: "seguranca",
    name: "Segurança",
    title: "Mortes violentas intencionais",
    headline: "19,1 por 100 mil",
    caption: "Mortes violentas · 2025",
    lines: [
      "Em 2025 foram 40.775 mortes violentas intencionais, taxa de 19,1 por 100 mil habitantes.",
      "Variação de −8,2% em relação a 2024."
    ],
    source: "20ª edição do Anuário Brasileiro de Segurança Pública (FBSP), divulgada em 23/07/2026 (via CNN Brasil)",
    url: "https://www.cnnbrasil.com.br/nacional/brasil/mortes-violentas-caem-82-no-brasil-em-2025-sete-estados-registram-alta/"
  }
];
