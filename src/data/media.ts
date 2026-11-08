/**
 * Conteúdo da aba "Mídia".
 *
 * COMO ADICIONAR UM VÍDEO: copie o link do YouTube e cole como uma nova linha em `videos`
 * (qualquer formato serve: youtube.com/watch?v=..., youtu.be/..., /shorts/..., /live/...).
 * O app gera a miniatura e o player sozinho. Título, canal e etiqueta são opcionais:
 * sem título, o app tenta buscá-lo no YouTube.
 *
 * Só quem edita este arquivo (no GitHub) muda a lista; quem usa o app só assiste.
 */

export type VideoEntry = {
  /** Link do YouTube. */
  url: string;
  /** Opcional. Se vazio, o app busca o título no YouTube. */
  title?: string;
  /** Opcional. Canal ou veículo, ex.: "TV Câmara". */
  channel?: string;
  /** Opcional. Etiqueta curta, ex.: "Debate", "Discurso", "Entrevista". */
  tag?: string;
};

export const videos: VideoEntry[] = [
  // Exemplo (tire as duas barras do começo da linha e troque o link):
  // { url: "https://www.youtube.com/watch?v=XXXXXXXXXXX", tag: "Debate" },
];

export type NewsFeed = { name: string; url: string };

/**
 * Veículos de imprensa usados para buscar artigos e fotos automaticamente (feeds RSS públicos).
 * Se um feed sair do ar, o app ignora só ele e mostra os demais.
 * Para incluir outro veículo, acrescente { name, url } com o endereço do feed RSS dele.
 */
export const newsFeeds: NewsFeed[] = [
  { name: "Agência Brasil", url: "https://agenciabrasil.ebc.com.br/feed/ultimasnoticias/feed.xml" },
  { name: "g1", url: "https://g1.globo.com/rss/g1/politica/" },
  { name: "Folha de S.Paulo", url: "https://feeds.folha.uol.com.br/poder/rss091.xml" },
  { name: "Poder360", url: "https://www.poder360.com.br/feed/" }
];

/**
 * Só entram artigos cujo título ou resumo citam uma destas palavras (sem acento e sem diferenciar
 * maiúsculas). Ao mudar o presidente em exercício, troque aqui.
 */
export const articleKeywords: string[] = ["lula"];

/** Máximo de artigos mostrados e máximo por veículo (evita um único veículo dominar a lista). */
export const maxArticles = 12;
export const maxPerOutlet = 4;

/** Aviso exibido no topo da aba e dentro do player de vídeo. */
export const thirdPartyNotice =
  "Conteúdo de terceiros: vídeos do YouTube e artigos de veículos de imprensa. Não são fontes oficiais, o Observa Brasil não produz nem endossa esse material, e os direitos pertencem aos respectivos autores.";
