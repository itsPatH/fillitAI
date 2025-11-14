function renderReadingTime(article: HTMLElement | null): void {
  if (!article) {
    return;
  }

  const text: string = article.textContent || '';
  const wordMatchRegExp: RegExp = /[^\s]+/g;
  const words: IterableIterator<RegExpMatchArray> = text.matchAll(wordMatchRegExp);
  const wordCount: number = [...words].length;
  const readingTime: number = Math.round(wordCount / 200);
  const badge: HTMLParagraphElement = document.createElement("p");
  
  badge.classList.add("color-secondary-text", "type--caption");
  badge.textContent = ` ${readingTime} min read`;

  const heading: Element | null = article.querySelector("h1");
  const date: Element | null = article.querySelector("time")?.parentNode as Element ?? null;

  (date ?? heading)?.insertAdjacentElement("afterend", badge);
}

renderReadingTime(document.querySelector("article"));