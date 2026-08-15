# Meatologia — strona restauracji

Statyczna strona (landing page) dla wrocławskiej restauracji **Meatologia** —
burgery i steki, Zwycięska 45/lok. 3.

Bez build stepu, bez zależności, bez zewnętrznych zasobów: trzy pliki i jeden
`index.html`. Wystarczy otworzyć plik w przeglądarce albo wrzucić katalog na
dowolny hosting statyczny (GitHub Pages, Netlify, Cloudflare Pages, zwykły nginx).

```bash
# podgląd lokalny
python3 -m http.server 8000
# → http://localhost:8000
```

## Struktura

```
index.html            markup + inline SVG (<symbol>) z grafiką dań
assets/css/styles.css cały styl, tokeny w :root
assets/js/data.js     dane menu — jedyne miejsce do edycji karty
assets/js/main.js     interakcje (kafelki, filtry, okno dania, scroll)
```

## Płynne przejścia produktów

Serce strony to morfowanie kafelka dania w okno szczegółów:

- **View Transitions API** (Chrome/Edge, Safari 18+) — `view-transition-name`
  przenoszony jest z `.card-media` na `.product-media` wewnątrz
  `document.startViewTransition()`, więc grafika dania płynnie „rośnie"
  z kafelka do okna i wraca na swoje miejsce przy zamknięciu.
- **Fallback FLIP + WAAPI** — w przeglądarkach bez View Transitions ten sam ruch
  liczony jest ręcznie (`getBoundingClientRect()` → `element.animate()`).
- **Filtrowanie kategorii** też używa FLIP: kafelki płynnie przejeżdżają na nowe
  pozycje zamiast przeskakiwać.
- `prefers-reduced-motion: reduce` wyłącza wszystkie animacje — okno otwiera się
  natychmiast, bez ruchu.

Dodatkowo: strzałki ←/→ i gesty swipe przełączają dania **w obrębie aktywnego
filtra**, `Esc` zamyka, fokus wraca na kafelek, z którego przyszliśmy.

## Grafika dań

Zamiast zdjęć użyte są warstwowe SVG (`#art-burger`, `#art-steak`, `#art-side`,
`#art-dessert`, `#art-drink`). Kolory pochodzą z custom properties, więc jedno
`<symbol>` obsługuje wiele dań — a warstwy (bułka, sałata, ser, kotlet) unoszą
się niezależnie przy najechaniu myszą.

**Docelowo warto podmienić je na prawdziwe zdjęcia jedzenia.** Wtedy w
`buildCard()` (`assets/js/main.js`) zamień `<svg><use…></svg>` na `<img>`, a w
`index.html` to samo w `.product-media`. Reszta mechaniki przejść działa bez zmian —
`view-transition-name` siedzi na kontenerze `.card-media`, nie na SVG.

## Edycja menu

Wszystko w `assets/js/data.js`:

```js
{
  id: 'classic',              // unikalne; działa też jako deep link #dish-classic
  cat: 'burgers',             // musi pasować do jednej z categories[]
  name: 'Classic Burger',
  tag: 'Klasyk',              // plakietka na kafelku
  price: 42,                  // liczba, waluta dopisywana w widoku
  weight: '180 g wołowiny',
  heat: 'Wysmażenie: medium', // pełna etykieta lub '' żeby ukryć
  short: '…',                 // jedno zdanie na kafelku
  desc: '…',                  // opis w oknie szczegółów
  ings: ['…'],                // „chipsy" ze składnikami
  art: 'art-burger',          // id <symbol> z index.html
  paint: { '--art-bun': '#dda153', … }
}
```

Dodanie pozycji = dopisanie obiektu do `items`. Kafelek, filtr, okno szczegółów
i nawigacja strzałkami podłączą się same.

## Dane firmy

Adres, telefon, godziny i ocena występują w trzech miejscach: JSON-LD w `<head>`,
sekcja `#visit` oraz stopka. Przy zmianie danych trzeba zaktualizować wszystkie trzy.

> **Uwaga o treści:** ceny, gramatury, składy dań i teksty „o nas" zostały
> napisane na podstawie zdjęcia karty i wizytówki Google — traktuj je jako
> wypełniacz do podmiany na prawdziwe dane z `meatologia.pl`. Prawdziwe są:
> adres, telefon, godziny, przedział cenowy 40–160 zł i ocena 4,5 (737 opinii).

## Dostępność i wydajność

- Pełna obsługa klawiatury: skip link, focus trap w oknie dania, `Esc`, powrót fokusu.
- Kontrasty tekstu na ciemnym tle powyżej progu WCAG AA.
- Brak zewnętrznych fontów i skryptów — zero requestów poza własnym hostem.
- Animacje oparte na `transform`/`opacity`, listenery scrolla przez `requestAnimationFrame`.
- Testowane w Chromium na 1440px i 390px: brak błędów konsoli i przewijania w poziomie.
