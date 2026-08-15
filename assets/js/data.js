/**
 * Menu data for Meatologia.
 *
 * `art`   — id of an inline <symbol> in index.html
 * `paint` — CSS custom properties applied to that artwork, so every dish
 *           gets its own palette without a separate image asset.
 */
window.MEATOLOGIA_MENU = {
  categories: [
    { id: 'all',      label: 'Wszystko' },
    { id: 'burgers',  label: 'Burgery' },
    { id: 'steaks',   label: 'Steki' },
    { id: 'sides',    label: 'Dodatki' },
    { id: 'desserts', label: 'Desery' },
    { id: 'drinks',   label: 'Napoje' }
  ],

  items: [
    /* ── Burgery ───────────────────────────────────────────────────── */
    {
      id: 'classic',
      cat: 'burgers',
      name: 'Classic Burger',
      tag: 'Klasyk',
      price: 42,
      weight: '180 g wołowiny',
      heat: 'Wysmażenie: medium',
      short: 'Wołowina, cheddar, sałata, pomidor i sos Meatologia w maślanej bułce.',
      desc: 'Punkt wyjścia całej karty. Mielona na miejscu łopatka Black Angus, grillowana na węglu do soczystego medium, topiony cheddar i nasz sos na bazie pieczonego czosnku.',
      ings: ['Wołowina Black Angus', 'Cheddar', 'Sałata masłowa', 'Pomidor', 'Ogórek kiszony', 'Sos Meatologia'],
      art: 'art-burger',
      paint: { '--art-bun': '#dda153', '--art-bun-bottom': '#c4863a', '--art-patty': '#4a2f22', '--art-cheese': '#f0b429', '--art-veg': '#6ea242' }
    },
    {
      id: 'cheese-bacon',
      cat: 'burgers',
      name: 'Cheese & Bacon',
      tag: 'Bestseller',
      price: 49,
      weight: '180 g wołowiny',
      heat: 'Wysmażenie: medium',
      short: 'Podwójny cheddar, chrupiący bekon i karmelizowana cebula.',
      desc: 'Dla tych, którzy uważają, że sera nigdy za wiele. Dwa plastry dojrzewającego cheddara, bekon wędzony na bukowym drewnie i cebula duszona w ciemnym piwie.',
      ings: ['Wołowina Black Angus', 'Podwójny cheddar', 'Bekon wędzony', 'Karmelizowana cebula', 'Majonez chipotle'],
      art: 'art-burger',
      paint: { '--art-bun': '#d08f45', '--art-bun-bottom': '#b87a34', '--art-patty': '#43291d', '--art-cheese': '#f5a623', '--art-veg': '#8a5a2b' }
    },
    {
      id: 'flooded-cheese',
      cat: 'burgers',
      name: 'Flooded Cheese',
      tag: 'Ostry',
      price: 47,
      weight: '180 g wołowiny',
      heat: 'Ostrość: wysoka',
      short: 'Zalany gorącym sosem serowym, z jalapeño i prażoną cebulką.',
      desc: 'Nazwa nie kłamie — burger wjeżdża na stół pod strumieniem gorącego sosu cheddarowego. Jalapeño dokłada ostrości, prażona cebulka chrupkości.',
      ings: ['Wołowina Black Angus', 'Sos cheddarowy', 'Jalapeño', 'Prażona cebulka', 'Sos z papryczek habanero'],
      art: 'art-burger',
      paint: { '--art-bun': '#e0a44f', '--art-bun-bottom': '#c98a3c', '--art-patty': '#4b2d1e', '--art-cheese': '#ffc233', '--art-veg': '#4f8a2f' }
    },
    {
      id: 'double-trouble',
      cat: 'burgers',
      name: 'Double Trouble',
      tag: 'Smash ×2',
      price: 55,
      weight: '2 × 100 g',
      heat: 'Wysmażenie: well done',
      short: 'Dwa smashe, podwójny ser amerykański, pikle i sos burgerowy.',
      desc: 'Dwa krążki wbite w rozgrzaną płytę na maksa — chrupiąca skorupka, w środku wciąż soczyste. Klasyczny amerykański układ: ser, pikle, sos, koniec dyskusji.',
      ings: ['2 × smash 100 g', 'Ser amerykański ×2', 'Pikle', 'Cebula', 'Sos burgerowy'],
      art: 'art-burger',
      paint: { '--art-bun': '#d99b4a', '--art-bun-bottom': '#bd7f36', '--art-patty': '#3d2419', '--art-cheese': '#ffb92e', '--art-veg': '#5f9438' }
    },
    {
      id: 'wagyu-smash',
      cat: 'burgers',
      name: 'Wagyu Smash',
      tag: 'Premium',
      price: 69,
      weight: '160 g wagyu',
      heat: 'Wysmażenie: medium rare',
      short: 'Wołowina wagyu, majonez truflowy, rukola i dojrzewający ser.',
      desc: 'Marmurkowe wagyu topi się w trakcie smażenia i samo doprawia bułkę. Do tego trufla i rukola — wystarczy, żeby nie zagłuszyć mięsa.',
      ings: ['Wołowina wagyu', 'Majonez truflowy', 'Rukola', 'Ser dojrzewający', 'Konfitura z czerwonej cebuli'],
      art: 'art-burger',
      paint: { '--art-bun': '#e8b96b', '--art-bun-bottom': '#cf9c4d', '--art-patty': '#59331f', '--art-cheese': '#e6c463', '--art-veg': '#7fa93f' }
    },
    {
      id: 'pastrami',
      cat: 'burgers',
      name: 'Pastrami Burger',
      tag: 'Nowość',
      price: 52,
      weight: '180 g + 60 g pastrami',
      heat: 'Wysmażenie: medium',
      short: 'Domowe pastrami, musztarda gruboziarnista i kiszony ogórek.',
      desc: 'Peklowana mostek wołowy wędzimy u siebie przez dwanaście godzin, kroimy w płatki i układamy na kotlecie. Żytnia bułka trzyma to wszystko w ryzach.',
      ings: ['Wołowina Black Angus', 'Domowe pastrami', 'Musztarda gruboziarnista', 'Ogórek kiszony', 'Bułka żytnia'],
      art: 'art-burger',
      paint: { '--art-bun': '#b98446', '--art-bun-bottom': '#9d6c34', '--art-patty': '#5a2b23', '--art-cheese': '#e0a63a', '--art-veg': '#66913a' }
    },

    /* ── Steki ─────────────────────────────────────────────────────── */
    {
      id: 'arg-newyork',
      cat: 'steaks',
      name: 'New York · Argentyna',
      tag: 'Black Angus',
      price: 96,
      weight: '250 g',
      heat: 'Wysmażenie: do wyboru',
      short: 'Rostbef Black Angus, sezonowany na mokro min. 5 tygodni.',
      desc: 'Argentyńska wołowina z hodowli pastwiskowej. Wyrazisty smak, mocna struktura włókien i tłuszczowy brzeg, który na węglu zamienia się w karmel.',
      ings: ['Sezonowanie na mokro 5 tyg.', 'Masło ziołowe', 'Sól morska', 'Pieprz z młynka'],
      art: 'art-steak',
      paint: { '--art-patty': '#6b2a26', '--art-crust': '#8d3a2c', '--art-cheese': '#e2cd8b', '--art-veg': '#6ea242' }
    },
    {
      id: 'arg-ribeye',
      cat: 'steaks',
      name: 'Rib Eye · Argentyna',
      tag: 'Black Angus',
      price: 119,
      weight: '250 g',
      heat: 'Wysmażenie: do wyboru',
      short: 'Antrykot z marmurkiem, który sam się doprawia.',
      desc: 'Najbardziej wybaczający ze steków — tłuszcz śródmięśniowy topi się w trakcie grillowania i utrzymuje soczystość nawet przy wyższym wysmażeniu.',
      ings: ['Sezonowanie na mokro 5 tyg.', 'Masło ziołowe', 'Sól morska', 'Pieprz z młynka'],
      art: 'art-steak',
      paint: { '--art-patty': '#742d27', '--art-crust': '#9c4430', '--art-cheese': '#e2cd8b', '--art-veg': '#6ea242' }
    },
    {
      id: 'arg-filet',
      cat: 'steaks',
      name: 'Filet Mignon · Argentyna',
      tag: 'Polędwica',
      price: 176,
      weight: '300 g',
      heat: 'Polecane: medium rare',
      short: 'Najdelikatniejszy kawałek, krojony z serca polędwicy.',
      desc: 'Zero ścięgien, minimum tłuszczu, maksimum delikatności. Podajemy z masłem ziołowym i solą maldon — nic więcej nie jest mu potrzebne.',
      ings: ['Serce polędwicy', 'Masło ziołowe', 'Sól maldon', 'Pieprz z młynka'],
      art: 'art-steak',
      paint: { '--art-patty': '#7d322a', '--art-crust': '#a44a33', '--art-cheese': '#e2cd8b', '--art-veg': '#6ea242' }
    },
    {
      id: 'usa-ribeye',
      cat: 'steaks',
      name: 'Rib Eye · USA',
      tag: 'USDA Prime',
      price: 149,
      weight: '300 g',
      heat: 'Wysmażenie: do wyboru',
      short: 'Black Angus USDA Prime — najwyższa klasa amerykańskiej wołowiny.',
      desc: 'Bydło karmione kukurydzą daje gęsty marmurek i słodszy, maślany profil. Tylko kilka procent amerykańskiej wołowiny dostaje oznaczenie Prime.',
      ings: ['USDA Prime', 'Sezonowanie na mokro 5 tyg.', 'Masło ziołowe', 'Sól morska'],
      art: 'art-steak',
      paint: { '--art-patty': '#803029', '--art-crust': '#ab4c33', '--art-cheese': '#e2cd8b', '--art-veg': '#6ea242' }
    },
    {
      id: 'wagyu-striploin',
      cat: 'steaks',
      name: 'Striploin · Wagyu A5',
      tag: 'Japonia A5',
      price: 125,
      weight: '100 g',
      heat: 'Wysmażenie: medium rare',
      short: 'Japońskie wagyu w najwyższej klasie A5, prefektura Kagoshima.',
      desc: 'Marmurek tak gęsty, że mięso wygląda na różowe. Podajemy w mniejszej porcji, bo więcej po prostu nie trzeba — smakuje raczej jak deser niż jak stek.',
      ings: ['Wagyu A5 Kagoshima', 'Sól maldon', 'Wasabi', 'Sos ponzu'],
      art: 'art-steak',
      paint: { '--art-patty': '#8e3a30', '--art-crust': '#c06a45', '--art-cheese': '#efe0a8', '--art-veg': '#7fa93f' }
    },
    {
      id: 'wagyu-tenderloin',
      cat: 'steaks',
      name: 'Tenderloin · Wagyu A5',
      tag: 'Japonia A5',
      price: 175,
      weight: '100 g',
      heat: 'Wysmażenie: medium rare',
      short: 'Polędwica wagyu — najkrótsza droga do „nigdy tego nie zapomnę”.',
      desc: 'Najdroższa pozycja w karcie i jedyna, przy której prosimy, żeby zjeść ją bez sosu. Grillujemy krótko, kroimy w plastry, podajemy od razu.',
      ings: ['Wagyu A5 Kagoshima', 'Sól maldon', 'Wasabi', 'Pieprz sansho'],
      art: 'art-steak',
      paint: { '--art-patty': '#96413a', '--art-crust': '#c9744c', '--art-cheese': '#efe0a8', '--art-veg': '#7fa93f' }
    },

    /* ── Dodatki ───────────────────────────────────────────────────── */
    {
      id: 'fries',
      cat: 'sides',
      name: 'Frytki belgijskie',
      tag: 'Klasyk',
      price: 16,
      weight: '200 g',
      heat: '',
      short: 'Krojone z ziemniaka, smażone dwa razy, solone morską solą.',
      desc: 'Robimy je tak, jak trzeba: pierwsze smażenie w niższej temperaturze, odpoczynek, drugie na ostro. Środek puszysty, skorupka głośna.',
      ings: ['Ziemniaki', 'Sól morska', 'Majonez czosnkowy w cenie'],
      art: 'art-side',
      paint: { '--art-veg': '#e8b23c', '--art-patty': '#8a8f96', '--art-crust': '#b7bcc4' }
    },
    {
      id: 'sweet-fries',
      cat: 'sides',
      name: 'Frytki z batata',
      tag: 'Wege',
      price: 19,
      weight: '200 g',
      heat: '',
      short: 'Słodkie ziemniaki z papryką wędzoną i majonezem chipotle.',
      desc: 'Odrobinę słodsze, mocno przyprawione i idealne do wszystkiego, co ostre. Domyślnie z majonezem chipotle, ale sos możesz wymienić.',
      ings: ['Batat', 'Papryka wędzona', 'Majonez chipotle'],
      art: 'art-side',
      paint: { '--art-veg': '#e07f34', '--art-patty': '#8a8f96', '--art-crust': '#b7bcc4' }
    },
    {
      id: 'tatar',
      cat: 'sides',
      name: 'Tatar wołowy',
      tag: 'Polecane',
      price: 46,
      weight: '150 g',
      heat: '',
      short: 'Siekany nożem, z ogórkiem kiszonym, cebulą i żółtkiem.',
      desc: 'Polędwica siekana na zamówienie, nigdy mielona. Podajemy z grzankami z zakwasowego chleba i klasycznym zestawem dodatków obok.',
      ings: ['Polędwica wołowa', 'Ogórek kiszony', 'Cebula', 'Żółtko', 'Grzanki z zakwasu'],
      art: 'art-side',
      paint: { '--art-veg': '#b8433a', '--art-patty': '#3a3f45', '--art-crust': '#6b7178' }
    },

    /* ── Desery ────────────────────────────────────────────────────── */
    {
      id: 'creme-brulee',
      cat: 'desserts',
      name: 'Crème brûlée',
      tag: 'Deser',
      price: 24,
      weight: '150 g',
      heat: '',
      short: 'Wanilia z Madagaskaru pod skorupką palonego cukru.',
      desc: 'Wypalamy karmel bezpośrednio przed podaniem, więc na stole jeszcze pracuje. Pod spodem chłodny, gęsty krem waniliowy.',
      ings: ['Śmietanka', 'Wanilia Bourbon', 'Żółtka', 'Palony cukier', 'Maliny'],
      art: 'art-dessert',
      paint: { '--art-patty': '#f2ead6', '--art-cheese': '#d8a13f', '--art-veg': '#b8324a' }
    },

    /* ── Napoje ────────────────────────────────────────────────────── */
    {
      id: 'harpagan-ipa',
      cat: 'drinks',
      name: "Harpagan Let's Meat IPA",
      tag: 'Nasze piwo',
      price: 22,
      weight: '500 ml',
      heat: 'Styl: American IPA',
      short: 'Amerykańskie IPA warzone dla nas przez browar Harpagan.',
      desc: 'Żywiczna goryczka i cytrusowy chmiel, które radzą sobie nawet z najbardziej tłustym burgerem. Warzone w limitowanych partiach, z naszą etykietą.',
      ings: ['Chmiel Citra', 'Chmiel Simcoe', 'Alk. 6,2%', 'Warzone we Wrocławiu'],
      art: 'art-drink',
      paint: { '--art-patty': '#c98432', '--art-cheese': '#f6efdd', '--art-veg': '#f7f1e2' }
    },
    {
      id: 'lemoniada',
      cat: 'drinks',
      name: 'Domowa lemoniada',
      tag: 'Bez alkoholu',
      price: 16,
      weight: '400 ml',
      heat: '',
      short: 'Cytryna, mięta i syrop własnej roboty — dolewka gratis.',
      desc: 'Wyciskana na miejscu, słodzona syropem z trzciny i schłodzona lodem z mrożonych owoców, żeby nie rozwadniała się w połowie szklanki.',
      ings: ['Cytryna', 'Mięta', 'Syrop trzcinowy', 'Woda gazowana'],
      art: 'art-drink',
      paint: { '--art-patty': '#d9c23f', '--art-cheese': '#f6efdd', '--art-veg': '#f2f7d8' }
    },
    {
      id: 'espresso',
      cat: 'drinks',
      name: 'Espresso',
      tag: 'Kawa',
      price: 9,
      weight: '30 ml',
      heat: '',
      short: 'Palona w Polsce mieszanka arabiki z nutą gorzkiej czekolady.',
      desc: 'Kończymy nim obiad. Mieszanka palona pod nasz ekspres, parzona na krótkim czasie ekstrakcji — gęsta crema i wyraźna czekolada.',
      ings: ['100% arabica', 'Świeżo mielona', 'Podwójna porcja +4 zł'],
      art: 'art-drink',
      paint: { '--art-patty': '#4a3126', '--art-cheese': '#c9a273', '--art-veg': '#e6d3b8' }
    }
  ]
};
