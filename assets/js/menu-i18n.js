/**
 * The menu, translated.
 *
 * Keyed by dish id, then language. Dish *names* stay as printed on the board
 * — "Tatar 'Nduja" is what the kitchen calls it in any language — so only the
 * descriptive lines are translated. The Polish ingredient lists follow the
 * board verbatim.
 *
 * Anything missing falls back to the English in data.js, so a half-finished
 * language degrades one dish at a time instead of breaking the page.
 *
 * Adding a language: add its block to each dish and a line to `languages` in
 * i18n.js. The completeness test in test/booking.test.js reports what is missing.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MEATOLOGIA_MENU_I18N = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return {
    /* ── Startery ─────────────────────────────────────────────────── */
    'tatar-klasyk': {
      pl: { flag: 'Klasyk', weight: 'Polędwica argentyńska', cook: 'Surowy, siekany nożem', pair: 'Zimna wódka',
        short: 'Polędwica argentyńska, marynowane podgrzybki, piklowany ogórek i żółtko.',
        blurb: 'Ten, od którego się zaczyna. Polędwica argentyńska siekana nożem, marynowane podgrzybki, piklowany ogórek, cebula, żółtko i worcestershire — podane z pieczywem.',
        parts: ['Polędwica argentyńska', 'Marynowane podgrzybki', 'Piklowany ogórek', 'Cebula', 'Oliwa', 'Żółtko', 'Worcestershire', 'Brown mustard', 'Szczypiorek', 'Pieczywo'] },
      ko: { flag: '클래식', weight: '아르헨티나 안심', cook: '생고기, 칼로 다짐', pair: '차가운 보드카',
        short: '아르헨티나 안심, 절인 버섯, 오이피클, 노른자.',
        blurb: '가장 먼저 주문하게 되는 메뉴입니다. 칼로 다진 아르헨티나 안심에 절인 그물버섯, 오이피클, 양파, 노른자, 우스터소스를 더해 빵과 함께 냅니다.',
        parts: ['아르헨티나 안심', '절인 그물버섯', '오이피클', '양파', '올리브유', '노른자', '우스터소스', '브라운 머스터드', '차이브', '빵'] }
    },
    'tatar-nduja': {
      pl: { flag: 'Ostry', weight: 'Polędwica argentyńska', cook: 'Surowy, siekany nożem', pair: 'Harpagan APA',
        short: "Tatar z 'ndują i piri piri, z chrustem z ziemniaka.",
        blurb: "Klasyk z podkręconą ostrością: kalabryjska 'nduja i piri piri wmieszane w polędwicę, a na wierzchu chrust z ziemniaka.",
        parts: ['Polędwica argentyńska', "'Nduja", 'Piklowany ogórek', 'Piri piri', 'Worcestershire', 'Brown mustard', 'Chrust z ziemniaka', 'Szczypiorek', 'Pieczywo'] },
      ko: { flag: '매운맛', weight: '아르헨티나 안심', cook: '생고기, 칼로 다짐', pair: 'Harpagan APA',
        short: "'은두야'와 피리피리로 맛을 낸 타르타르, 감자칩을 올립니다.",
        blurb: "클래식에 매운맛을 더했습니다. 칼라브리아식 '은두야'와 피리피리를 안심에 섞고 바삭한 감자칩을 올립니다.",
        parts: ['아르헨티나 안심', "'은두야'", '오이피클', '피리피리', '우스터소스', '브라운 머스터드', '감자칩', '차이브', '빵'] }
    },
    'tatar-truflowy': {
      pl: { flag: 'Truflowy', weight: 'Polędwica argentyńska', cook: 'Surowy, siekany nożem', pair: 'Rioja, kieliszek',
        short: 'Aioli truflowe, oliwa truflowa, kapary i piklowana cebula.',
        blurb: 'Dla tych, którzy uważają, że tatar powinien pachnieć runem leśnym. Aioli i oliwa truflowa, a do tego siekane kapary i piklowana cebula, które to przełamują.',
        parts: ['Polędwica argentyńska', 'Piklowany ogórek', 'Piklowana cebula', 'Siekane kapary', 'Brown mustard', 'Żółtko', 'Szczypiorek', 'Aioli truflowe', 'Oliwa truflowa', 'Pieczywo'] },
      ko: { flag: '트러플', weight: '아르헨티나 안심', cook: '생고기, 칼로 다짐', pair: '리오하 (글라스)',
        short: '트러플 아이올리와 트러플 오일, 케이퍼와 절인 양파.',
        blurb: '타르타르에서 숲 향이 나야 한다고 믿는 분들을 위한 메뉴. 트러플 아이올리와 오일에 다진 케이퍼와 절인 양파로 균형을 잡습니다.',
        parts: ['아르헨티나 안심', '오이피클', '절인 양파', '다진 케이퍼', '브라운 머스터드', '노른자', '차이브', '트러플 아이올리', '트러플 오일', '빵'] }
    },
    'tatary-set': {
      pl: { flag: 'Do dzielenia', weight: 'Trzy tatary', cook: 'Surowy, siekany nożem', pair: 'Zimna wódka',
        short: 'Trzy dowolne tatary z karty, podane na chlebie.',
        blurb: 'Wybierasz trzy dowolne tatary z menu i przychodzą razem, podane na chlebie — najprostszy sposób, żeby rozstrzygnąć, który jest naprawdę najlepszy.',
        parts: ['Trzy dowolne tatary', 'Podane na chlebie'] },
      ko: { flag: '함께 나누기', weight: '타르타르 3종', cook: '생고기, 칼로 다짐', pair: '차가운 보드카',
        short: '메뉴의 타르타르 중 원하는 세 가지를 빵 위에 올려 드립니다.',
        blurb: '메뉴에 있는 타르타르 중 세 가지를 골라 한 번에 내드립니다. 어느 것이 제일 맛있는지 정하는 가장 확실한 방법입니다.',
        parts: ['원하는 타르타르 3종', '빵과 함께'] }
    },
    'zupa-dnia': {
      pl: { flag: 'Zupa dnia', weight: '', cook: '', pair: 'Zapytaj obsługi',
        short: 'Zapytaj obsługi, co dzisiaj serwujemy.',
        blurb: 'Zmienia się zależnie od tego, co przyszło rano. Zapytaj obsługi, co dziś jest w garnku.',
        parts: ['Codziennie inna'] },
      ko: { flag: '오늘의 수프', weight: '', cook: '', pair: '직원에게 문의',
        short: '오늘의 수프는 직원에게 물어봐 주세요.',
        blurb: '그날 아침 들어온 재료에 따라 달라집니다. 오늘 무엇이 준비됐는지 직원에게 물어보세요.',
        parts: ['매일 변경'] }
    },

    /* ── Street food ──────────────────────────────────────────────── */
    'classic-burger': {
      pl: { flag: 'Od tego się zaczyna', weight: 'Wołowina', cook: 'Medium', pair: "Harpagan Let's Meat IPA",
        short: 'Wołowina, sałata lodowa, pomidor, cebula i ogórek w maślanej bułce.',
        blurb: 'Żadnych sztuczek. Wołowina, chrupiąca sałata lodowa, pomidor, cebula, piklowany ogórek, mayo i ketchup w maślanej bułce — burger, do którego porównuje się resztę karty.',
        parts: ['Wołowina', 'Sałata lodowa', 'Pomidor', 'Cebula', 'Piklowany ogórek', 'Mayo', 'Ketchup', 'Bułka maślana'] },
      ko: { flag: '기본', weight: '소고기', cook: '미디엄', pair: "Harpagan Let's Meat IPA",
        short: '소고기, 양상추, 토마토, 양파, 피클을 버터 번에.',
        blurb: '군더더기가 없습니다. 소고기, 아삭한 양상추, 토마토, 양파, 오이피클, 마요와 케첩을 버터 번에 넣었습니다. 나머지 메뉴의 기준이 되는 버거입니다.',
        parts: ['소고기', '양상추', '토마토', '양파', '오이피클', '마요', '케첩', '버터 번'] }
    },
    'cheese-bacon': {
      pl: { flag: 'Bestseller', weight: '2 × wołowina', cook: 'Smash', pair: "Harpagan Let's Meat IPA",
        short: 'Dwa smashe, podwójny cheddar, bekon i grillowana cebula.',
        blurb: 'Dwa kotlety wbite w rozgrzaną płytę na koronkową skorupkę, podwójny cheddar, bekon, grillowana cebula i hot mayo.',
        parts: ['2 × wołowina', '2 × cheddar', 'Bekon', 'Sałata lodowa', 'Grillowana cebula', 'Hot mayo', 'Bułka maślana'] },
      ko: { flag: '베스트셀러', weight: '소고기 ×2', cook: '스매시', pair: "Harpagan Let's Meat IPA",
        short: '스매시 패티 두 장, 더블 체다, 베이컨, 구운 양파.',
        blurb: '달군 철판에 눌러 구워 레이스처럼 바삭한 겉면을 만들고, 더블 체다와 베이컨, 구운 양파, 핫 마요를 올립니다.',
        parts: ['소고기 ×2', '체다 ×2', '베이컨', '양상추', '구운 양파', '핫 마요', '버터 번'] }
    },
    'flooded': {
      pl: { flag: 'Wybór szefa', weight: '2 × wołowina', cook: 'Smash', pair: "Harpagan Let's Meat IPA",
        short: 'Cheese & Bacon zalany sosem Hudson, z frytkami.',
        blurb: 'Cheese & Bacon smash pod strumieniem sosu Hudson, z frytkami obok. To właśnie kuchnia wybiera, gdy pytasz, co brać.',
        parts: ['2 × wołowina', '2 × cheddar', 'Bekon', 'Sałata lodowa', 'Grillowana cebula', 'Hot mayo', 'Sos Hudson', 'Frytki', 'Bułka maślana'] },
      ko: { flag: '셰프 추천', weight: '소고기 ×2', cook: '스매시', pair: "Harpagan Let's Meat IPA",
        short: 'Cheese & Bacon에 허드슨 소스를 부어 감자튀김과 함께.',
        blurb: 'Cheese & Bacon 스매시에 허드슨 소스를 붓고 감자튀김을 곁들입니다. 무엇을 먹을지 물으면 주방이 고르는 메뉴입니다.',
        parts: ['소고기 ×2', '체다 ×2', '베이컨', '양상추', '구운 양파', '핫 마요', '허드슨 소스', '감자튀김', '버터 번'] }
    },
    'double-trouble': {
      pl: { flag: 'Pastrami i wołowina', weight: 'Wołowina + pastrami', cook: 'Medium', pair: 'Harpagan Pils',
        short: 'Wołowina i domowe pastrami razem, z kapustą kiszoną i musztardą.',
        blurb: 'Burger i kanapka z pastrami kłócące się w jednej bułce — i obie wygrywają. Domowe pastrami na wołowinie, Sauerkraut, cheddar i brown mustard, żeby to przełamać.',
        parts: ['Wołowina', 'Pastrami Meatologia', 'Cheddar', 'Sauerkraut', 'Brown mustard', 'Piklowany ogórek', 'Piklowana cebula', 'Mayo', 'Bułka maślana'] },
      ko: { flag: '파스트라미 + 소고기', weight: '소고기 + 파스트라미', cook: '미디엄', pair: 'Harpagan Pils',
        short: '소고기와 수제 파스트라미를 함께, 사우어크라우트와 머스터드로 마무리.',
        blurb: '버거와 파스트라미 샌드위치가 번 하나에서 다투는데 둘 다 이깁니다. 소고기 위에 수제 파스트라미, 사우어크라우트, 체다, 브라운 머스터드를 올립니다.',
        parts: ['소고기', 'Meatologia 파스트라미', '체다', '사우어크라우트', '브라운 머스터드', '오이피클', '절인 양파', '마요', '버터 번'] }
    },
    'wagyu-smash': {
      pl: { flag: 'Premium', weight: 'Wołowina wagyu', cook: 'Smash', pair: 'Rioja, kieliszek',
        short: 'Wołowina wagyu, cheddar, cebula cukrowa i ponzu mayo.',
        blurb: 'Marmurkowe wagyu wytapia się na płycie i samo doprawia bułkę. Cebula cukrowa, piklowany ogórek i ponzu mayo — nic głośniejszego, co mogłoby je zagłuszyć.',
        parts: ['Wołowina Wagyu', 'Cheddar', 'Cebula cukrowa', 'Ogórek piklowany', 'Ponzu mayo', 'Bułka maślana'] },
      ko: { flag: '프리미엄', weight: '와규', cook: '스매시', pair: '리오하 (글라스)',
        short: '와규, 체다, 단양파, 폰즈 마요.',
        blurb: '마블링이 철판에서 녹아 번까지 간을 맞춥니다. 단양파와 오이피클, 폰즈 마요만 곁들여 고기 맛을 덮지 않습니다.',
        parts: ['와규', '체다', '단양파', '오이피클', '폰즈 마요', '버터 번'] }
    },
    'pastrami': {
      pl: { flag: 'Dopieszczane latami', weight: 'Pastrami Meatologia', cook: 'Wędzone u nas', pair: 'Harpagan Pils',
        short: 'Domowe pastrami, Sauerkraut i cheddar na pullman bread.',
        blurb: 'Pastrami, które dopieszczamy od lat: peklowane i wędzone u nas, krojone grubo, z Sauerkrautem, cheddarem, szpinakiem baby i dwiema musztardami na pullman bread.',
        parts: ['Pastrami Meatologia', 'Sauerkraut', 'Cheddar', 'Piklowany ogórek', 'Szpinak baby', 'Hot mayo', 'Brown mustard', 'Pullman bread'] },
      ko: { flag: '수년간 다듬은 맛', weight: 'Meatologia 파스트라미', cook: '매장 훈연', pair: 'Harpagan Pils',
        short: '수제 파스트라미, 사우어크라우트, 체다를 풀먼 브레드에.',
        blurb: '수년간 다듬어 온 파스트라미입니다. 직접 염지·훈연해 두껍게 썰고 사우어크라우트, 체다, 베이비 시금치와 두 가지 머스터드를 풀먼 브레드에 올립니다.',
        parts: ['Meatologia 파스트라미', '사우어크라우트', '체다', '오이피클', '베이비 시금치', '핫 마요', '브라운 머스터드', '풀먼 브레드'] }
    },

    /* ── Steki ────────────────────────────────────────────────────── */
    'arg-ny': {
      pl: { flag: 'Argentyna', weight: '250 g', cook: 'Do wyboru', pair: 'Malbec, Mendoza',
        short: 'Rasa Black Angus, sezonowanie na mokro min. 8 tygodni.',
        blurb: 'Argentyński Black Angus sezonowany na mokro minimum osiem tygodni. Zwarte włókna, tłuszczowy brzeg mocno karmelizujący się na węglu i dość charakteru na ciężkie czerwone wino. W cenie dwa dodatki.',
        parts: ['Black Angus', 'Sezonowanie na mokro min. 8 tygodni', 'Dwa dodatki w cenie', 'Sos do wyboru'] },
      ko: { flag: '아르헨티나', weight: '250g', cook: '원하시는 굽기로', pair: '멘도사 말벡',
        short: '블랙 앵거스, 최소 8주 습식 숙성.',
        blurb: '아르헨티나 블랙 앵거스를 최소 8주 습식 숙성했습니다. 결이 단단하고 지방 가장자리가 숯불에서 진하게 캐러멜화되며 묵직한 레드 와인에도 밀리지 않습니다. 사이드 2종 포함.',
        parts: ['블랙 앵거스', '최소 8주 습식 숙성', '사이드 2종 포함', '소스 선택'] }
    },
    'arg-ribeye': {
      pl: { flag: 'Argentyna', weight: '250 g', cook: 'Do wyboru', pair: 'Malbec, Mendoza',
        short: 'Ten wyrozumiały — marmurek, który sam się doprawia.',
        blurb: 'Tłuszcz śródmięśniowy wytapia się w trakcie grillowania, więc stek zostaje soczysty nawet gdy zdejmiemy go chwilę za późno. Jeśli boisz się zamawiać steki, zamów ten. W cenie dwa dodatki.',
        parts: ['Black Angus', 'Sezonowanie na mokro min. 8 tygodni', 'Dwa dodatki w cenie', 'Sos do wyboru'] },
      ko: { flag: '아르헨티나', weight: '250g', cook: '원하시는 굽기로', pair: '멘도사 말벡',
        short: '실패가 적은 부위 — 마블링이 알아서 간을 맞춥니다.',
        blurb: '근내지방이 녹아들어 조금 더 익혀도 육즙이 남습니다. 스테이크 주문이 부담스럽다면 이걸 고르세요. 사이드 2종 포함.',
        parts: ['블랙 앵거스', '최소 8주 습식 숙성', '사이드 2종 포함', '소스 선택'] }
    },
    'arg-filet': {
      pl: { flag: 'Argentyna', weight: '200 g', cook: 'Prosimy o medium rare', pair: 'Barolo',
        short: 'Krojony z serca polędwicy. Nie ma tu czego gryźć.',
        blurb: 'Zero ścięgien, prawie zero tłuszczu, sama struktura. Wykańczamy go i wysyłamy, zanim ktokolwiek zdąży coś dołożyć. W cenie dwa dodatki.',
        parts: ['Polędwica Black Angus', 'Sezonowanie na mokro min. 8 tygodni', 'Dwa dodatki w cenie', 'Sos do wyboru'] },
      ko: { flag: '아르헨티나', weight: '200g', cook: '미디엄 레어 권장', pair: '바롤로',
        short: '안심 중심부만. 씹을 것이 없습니다.',
        blurb: '힘줄도 지방도 거의 없고 질감만 남습니다. 다른 것이 더해지기 전에 바로 내보냅니다. 사이드 2종 포함.',
        parts: ['블랙 앵거스 안심', '최소 8주 습식 숙성', '사이드 2종 포함', '소스 선택'] }
    },
    'usa-ny': {
      pl: { flag: 'USA · USDA Prime', weight: '100 g', cook: 'Do wyboru', pair: 'Cabernet z Napa',
        short: 'Black Angus klasy USDA Prime z farmy Creekstone, Arkansas City.',
        blurb: 'Wykańczanie kukurydzą daje gęstszy marmurek i słodszy, maślany profil niż kawałki argentyńskie. Klasę Prime dostaje tylko niewielka część amerykańskiej wołowiny. Cena za 100 g.',
        parts: ['USDA Prime', 'Farma Creekstone, Arkansas City', 'Sezonowanie na mokro min. 8 tygodni', 'Dwa dodatki w cenie'] },
      ko: { flag: '미국 · USDA 프라임', weight: '100g', cook: '원하시는 굽기로', pair: '나파 카베르네',
        short: '아칸소시티 Creekstone 농장의 USDA 프라임 블랙 앵거스.',
        blurb: '곡물 비육으로 아르헨티나 부위보다 마블링이 촘촘하고 버터 같은 단맛이 강합니다. 미국산 소고기 중 프라임 등급 비율은 아주 낮습니다. 100g 단위 가격입니다.',
        parts: ['USDA 프라임', 'Creekstone 농장', '최소 8주 습식 숙성', '사이드 2종 포함'] }
    },
    'usa-ribeye': {
      pl: { flag: 'USA · USDA Prime', weight: '100 g', cook: 'Do wyboru', pair: 'Cabernet z Napa',
        short: 'Rib Eye klasy Prime — najbogatszy kawałek z części amerykańskiej.',
        blurb: 'Marmurek klasy Prime w najhojniejszym kawałku, jaki mamy. Na tyle bogaty, że 200 g zwykle w zupełności wystarcza. Cena za 100 g, dwa dodatki w cenie.',
        parts: ['USDA Prime', 'Farma Creekstone, Arkansas City', 'Sezonowanie na mokro min. 8 tygodni', 'Dwa dodatki w cenie'] },
      ko: { flag: '미국 · USDA 프라임', weight: '100g', cook: '원하시는 굽기로', pair: '나파 카베르네',
        short: '프라임 등급 립아이 — 미국 부위 중 가장 진한 맛.',
        blurb: '가장 풍부한 부위에 프라임 등급 마블링이 더해졌습니다. 진해서 보통 200g이면 충분합니다. 100g 단위, 사이드 2종 포함.',
        parts: ['USDA 프라임', 'Creekstone 농장', '최소 8주 습식 숙성', '사이드 2종 포함'] }
    },
    'usa-filet': {
      pl: { flag: 'USA · USDA Prime', weight: '100 g', cook: 'Prosimy o medium rare', pair: 'Cabernet z Napa',
        short: 'Polędwica Prime — najdelikatniejszy kawałek po amerykańsku.',
        blurb: 'Polędwica klasy Prime: struktura argentyńskiego fileta ze słodszym, kukurydzianym wykończeniem. Cena za 100 g, dwa dodatki w cenie.',
        parts: ['Polędwica USDA Prime', 'Farma Creekstone, Arkansas City', 'Sezonowanie na mokro min. 8 tygodni', 'Dwa dodatki w cenie'] },
      ko: { flag: '미국 · USDA 프라임', weight: '100g', cook: '미디엄 레어 권장', pair: '나파 카베르네',
        short: '프라임 안심 — 미국식으로 가장 부드러운 부위.',
        blurb: '프라임 등급 안심입니다. 아르헨티나 필레의 질감에 곡물 비육 특유의 단맛이 더해집니다. 100g 단위, 사이드 2종 포함.',
        parts: ['USDA 프라임 안심', 'Creekstone 농장', '최소 8주 습식 숙성', '사이드 2종 포함'] }
    },
    'wagyu-striploin': {
      pl: { flag: 'Japonia · Wagyu A5', weight: '100 g', cook: 'Medium rare', pair: 'Zimne sake',
        short: 'Rasa Black Wagyu, klasa A5, prefektura Kagoshima.',
        blurb: 'Marmurek tak gęsty, że mięso wygląda różowo, nie czerwono. Podajemy w porcjach 100 g celowo — powyżej tego przestaje to być kolacja, a zaczyna być wyzwaniem.',
        parts: ['Black Wagyu A5', 'Prefektura Kagoshima', 'Dwa dodatki w cenie', 'Sos do wyboru'] },
      ko: { flag: '일본 · 와규 A5', weight: '100g', cook: '미디엄 레어', pair: '차가운 사케',
        short: '가고시마현산 블랙 와규 A5 등급.',
        blurb: '마블링이 촘촘해 고기가 붉기보다 분홍빛으로 보입니다. 100g만 내는 것은 의도된 것으로, 그 이상이면 식사가 아니라 도전이 됩니다.',
        parts: ['블랙 와규 A5', '가고시마현', '사이드 2종 포함', '소스 선택'] }
    },
    'wagyu-cuberoll': {
      pl: { flag: 'Japonia · Wagyu A5', weight: '100 g', cook: 'Medium rare', pair: 'Zimne sake',
        short: 'Najmocniej marmurkowany kawałek wagyu A5, jaki mamy.',
        blurb: 'Kawałek, przez który ludzie fotografują jedzenie. Tłuszcz wytapia się niemal w temperaturze pokojowej, więc potrzebuje sekund na ruszcie i niczego więcej.',
        parts: ['Black Wagyu A5', 'Prefektura Kagoshima', 'Dwa dodatki w cenie', 'Sos do wyboru'] },
      ko: { flag: '일본 · 와규 A5', weight: '100g', cook: '미디엄 레어', pair: '차가운 사케',
        short: '보유한 A5 와규 중 마블링이 가장 촘촘한 부위.',
        blurb: '사진을 찍게 만드는 부위입니다. 지방이 실온에 가까운 온도에서도 녹아 그릴에서 몇 초면 충분합니다.',
        parts: ['블랙 와규 A5', '가고시마현', '사이드 2종 포함', '소스 선택'] }
    },
    'wagyu-tenderloin': {
      pl: { flag: 'Japonia · Wagyu A5', weight: '100 g', cook: 'Medium rare', pair: 'Zimne sake',
        short: 'Najkrótsza droga do „tego nie zapomnę".',
        blurb: 'Najdroższa pozycja w karcie i jedyna, przy której poprosimy o odpuszczenie sosu. Krótko obsmażamy, kroimy w plastry, podajemy w kilka sekund.',
        parts: ['Black Wagyu A5', 'Prefektura Kagoshima', 'Dwa dodatki w cenie', 'Sos do wyboru'] },
      ko: { flag: '일본 · 와규 A5', weight: '100g', cook: '미디엄 레어', pair: '차가운 사케',
        short: '"이건 못 잊겠다"까지 가는 가장 빠른 길.',
        blurb: '메뉴에서 가장 비싸고, 유일하게 소스를 권하지 않는 메뉴입니다. 짧게 시어링해 썰어서 몇 초 안에 내갑니다.',
        parts: ['블랙 와규 A5', '가고시마현', '사이드 2종 포함', '소스 선택'] }
    },
    'set-argentyna': {
      pl: { flag: 'Na stół', weight: 'ok. 700 g', cook: 'Do wyboru', pair: 'Malbec, butelka',
        short: 'Trzy steki argentyńskie — Filet Mignon, Rib Eye i New York.',
        blurb: 'Około 700 g argentyńskiego Black Angusa w trzech kawałkach, z trzema dodatkami i trzema sosami. Dla stołu, który nie potrafi się dogadać.',
        parts: ['Filet Mignon', 'Rib Eye', 'New York', 'Trzy dodatki', 'Trzy sosy'] },
      ko: { flag: '테이블 공유', weight: '약 700g', cook: '원하시는 굽기로', pair: '말벡 (보틀)',
        short: '아르헨티나 스테이크 3종 — 필레미뇽, 립아이, 뉴욕.',
        blurb: '아르헨티나 블랙 앵거스 약 700g을 세 부위로 내고 사이드 3종과 소스 3종을 곁들입니다. 의견이 모이지 않는 테이블을 위한 구성입니다.',
        parts: ['필레미뇽', '립아이', '뉴욕', '사이드 3종', '소스 3종'] }
    },
    'set-ribeye': {
      pl: { flag: 'Trzy kraje', weight: 'ok. 750 g', cook: 'Do wyboru', pair: 'Malbec, butelka',
        short: 'Ten sam kawałek z Argentyny, USA i Japonii, obok siebie.',
        blurb: 'Około 750 g rib eye — argentyński, USDA Prime i wagyu A5 na jednej desce. Najprostszy sposób, żeby posmakować, czym te trzy kraje naprawdę się różnią.',
        parts: ['Rib Eye · Argentyna', 'Rib Eye · USA Prime', 'Rib Eye · Wagyu A5', 'Trzy dodatki', 'Trzy sosy'] },
      ko: { flag: '세 나라', weight: '약 750g', cook: '원하시는 굽기로', pair: '말벡 (보틀)',
        short: '같은 부위를 아르헨티나·미국·일본으로 나란히.',
        blurb: '립아이 약 750g을 아르헨티나, USDA 프라임, A5 와규로 한 접시에 냅니다. 세 나라의 차이를 가장 분명하게 느낄 수 있는 구성입니다.',
        parts: ['립아이 · 아르헨티나', '립아이 · 미국 프라임', '립아이 · 와규 A5', '사이드 3종', '소스 3종'] }
    },
    'set-filet': {
      pl: { flag: 'Trzy kraje', weight: 'ok. 600 g', cook: 'Prosimy o medium rare', pair: 'Barolo',
        short: 'Polędwica z Argentyny, USA i Japonii na jednej desce.',
        blurb: 'Około 600 g polędwicy z trzech krajów, z trzema dodatkami i trzema sosami. Najdroższy sposób na rozstrzygnięcie sporu i najbardziej przekonujący.',
        parts: ['Filet Mignon · Argentyna', 'Filet Mignon · USA Prime', 'Tenderloin · Wagyu A5', 'Trzy dodatki', 'Trzy sosy'] },
      ko: { flag: '세 나라', weight: '약 600g', cook: '미디엄 레어 권장', pair: '바롤로',
        short: '아르헨티나·미국·일본 안심을 한 접시에.',
        blurb: '세 산지의 안심 약 600g에 사이드 3종과 소스 3종을 곁들입니다. 논쟁을 끝내는 가장 비싸고 가장 확실한 방법입니다.',
        parts: ['필레미뇽 · 아르헨티나', '필레미뇽 · 미국 프라임', '안심 · 와규 A5', '사이드 3종', '소스 3종'] }
    },

    /* ── Dania główne ─────────────────────────────────────────────── */
    'zeberka': {
      pl: { flag: 'Wolno pieczone', weight: 'Żeberka wieprzowe', cook: 'Wolnopieczone', pair: 'Harpagan Pils',
        short: 'Wolnopieczone żeberka wieprzowe, BBQ glaze, coleslaw i frytki.',
        blurb: 'Pieczone długo i w niskiej temperaturze, aż mięso samo odchodzi, potem glazurowane BBQ i mocno wykończone. Do tego coleslaw, frytki i sos do wyboru.',
        parts: ['Wolnopieczone żeberka wieprzowe', 'BBQ glaze', 'Coleslaw', 'Frytki', 'Sos do wyboru'] },
      ko: { flag: '저온 장시간', weight: '돼지갈비', cook: '저온 로스팅', pair: 'Harpagan Pils',
        short: '저온에서 오래 구운 돼지갈비, BBQ 글레이즈, 코울슬로, 감자튀김.',
        blurb: '고기가 뼈에서 떨어질 때까지 저온에서 오래 굽고 BBQ 글레이즈를 발라 마무리합니다. 코울슬로와 감자튀김, 원하는 소스를 곁들입니다.',
        parts: ['저온 로스팅 돼지갈비', 'BBQ 글레이즈', '코울슬로', '감자튀김', '소스 선택'] }
    },
    'kaczka': {
      pl: { flag: 'Konfitowana', weight: 'Noga z kaczki', cook: 'Konfitowana', pair: 'Rioja, kieliszek',
        short: 'Konfitowana noga z kaczki, purée ziemniaczane i sałatka z pieczonego buraka.',
        blurb: 'Noga z kaczki gotowana powoli we własnym tłuszczu, aż skóra się zarumieni, a mięso odchodzi od kości. Do tego purée ziemniaczane, sałatka z pieczonego buraka i sos balsamiczno-figowy.',
        parts: ['Konfitowana noga z kaczki', 'Purée ziemniaczane', 'Sałatka z pieczonego buraka', 'Sos balsamiczno-figowy'] },
      ko: { flag: '콩피', weight: '오리 다리', cook: '콩피', pair: '리오하 (글라스)',
        short: '오리 다리 콩피, 감자 퓌레, 구운 비트 샐러드.',
        blurb: '오리 다리를 자체 지방에 천천히 익혀 껍질은 바삭하고 살은 뼈에서 떨어집니다. 감자 퓌레, 구운 비트 샐러드, 발사믹 무화과 소스를 곁들입니다.',
        parts: ['오리 다리 콩피', '감자 퓌레', '구운 비트 샐러드', '발사믹 무화과 소스'] }
    },
    'jagniece': {
      pl: { flag: 'Jagnięcina z Nowej Zelandii', weight: 'Polędwiczki jagnięce', cook: 'Różowe', pair: 'Barolo',
        short: 'Nowozelandzkie polędwiczki jagnięce, demi-glace i masło tymiankowe.',
        blurb: 'Nowozelandzkie polędwiczki jagnięce podane różowe, z demi-glace, warzywami unagi, masłem tymiankowym i purée ziemniaczanym.',
        parts: ['Nowozelandzkie polędwiczki jagnięce', 'Demi-glace', 'Warzywa unagi', 'Masło tymiankowe', 'Purée ziemniaczane'] },
      ko: { flag: '뉴질랜드 양고기', weight: '양 안심', cook: '핑크', pair: '바롤로',
        short: '뉴질랜드 양 안심, 데미글라스, 타임 버터.',
        blurb: '뉴질랜드 양 안심을 핑크빛으로 구워 데미글라스, 우나기 채소, 타임 버터, 감자 퓌레와 함께 냅니다.',
        parts: ['뉴질랜드 양 안심', '데미글라스', '우나기 채소', '타임 버터', '감자 퓌레'] }
    },
    'sandacz': {
      pl: { flag: 'Z wody', weight: 'Filet z sandacza', cook: 'Smażony', pair: 'Domowa lemoniada',
        short: 'Filet z sandacza, purée ziemniaczano-cytrynowe i dziki brokuł.',
        blurb: 'Jedyne danie bez czerwonego mięsa, i broni się samo. Filet z sandacza z purée ziemniaczano-cytrynowym, dzikim brokułem i sosem śmietankowym z chorizo.',
        parts: ['Filet z sandacza', 'Purée ziemniaczano-cytrynowe', 'Dziki brokuł', 'Sos śmietankowy z chorizo'] },
      ko: { flag: '생선', weight: '민물농어 필레', cook: '팬 시어링', pair: '수제 레모네이드',
        short: '민물농어 필레, 레몬 감자 퓌레, 브로콜리니.',
        blurb: '붉은 고기가 들어가지 않는 유일한 메뉴이지만 존재감이 분명합니다. 민물농어 필레에 레몬 감자 퓌레, 브로콜리니, 초리조 크림 소스를 곁들입니다.',
        parts: ['민물농어 필레', '레몬 감자 퓌레', '브로콜리니', '초리조 크림 소스'] }
    },
    'cezar': {
      pl: { flag: 'Lżej', weight: 'Kurczak', cook: 'Grillowany', pair: 'Domowa lemoniada',
        short: 'Grillowany kurczak, sałata rzymska, pomidorki cherry, pecorino i parmezan.',
        blurb: 'Grillowane polędwiczki z kurczaka na sałacie rzymskiej, z pomidorkami cherry, dwoma twardymi serami, sosem Cezar i grzankami. To, co zamawia jedna osoba przy stole, która nie przyszła po wołowinę.',
        parts: ['Grillowane polędwiczki z kurczaka', 'Sałata rzymska', 'Pomidorki cherry', 'Pecorino', 'Parmezan', 'Sos Cezar', 'Grzanki'] },
      ko: { flag: '가볍게', weight: '닭고기', cook: '그릴', pair: '수제 레모네이드',
        short: '구운 닭가슴살, 로메인, 방울토마토, 페코리노와 파르메산.',
        blurb: '구운 닭안심을 로메인 위에 올리고 방울토마토, 두 가지 경성치즈, 시저 드레싱, 크루통을 더했습니다. 소고기를 먹으러 오지 않은 한 사람이 주문하는 메뉴입니다.',
        parts: ['구운 닭안심', '로메인', '방울토마토', '페코리노', '파르메산', '시저 드레싱', '크루통'] }
    },

    /* ── Dla dzieci ───────────────────────────────────────────────── */
    'burger-junior': {
      pl: { flag: 'Dla dzieci', weight: 'Wołowina', cook: 'Well done', pair: 'Sok',
        short: 'Wołowina, cheddar, sałata lodowa i ketchup, z frytkami.',
        blurb: 'Classic w mniejszej i prostszej wersji: wołowina, cheddar, sałata lodowa, ketchup, bułka maślana i frytki.',
        parts: ['Wołowina', 'Cheddar', 'Sałata lodowa', 'Ketchup', 'Bułka maślana', 'Frytki'] },
      ko: { flag: '어린이', weight: '소고기', cook: '웰던', pair: '주스',
        short: '소고기, 체다, 양상추, 케첩과 감자튀김.',
        blurb: 'Classic을 작고 단순하게 만들었습니다. 소고기, 체다, 양상추, 케첩, 버터 번과 감자튀김.',
        parts: ['소고기', '체다', '양상추', '케첩', '버터 번', '감자튀김'] }
    },
    'kurczak-junior': {
      pl: { flag: 'Dla dzieci', weight: 'Kurczak', cook: 'Grillowany', pair: 'Sok',
        short: 'Grillowane polędwiczki z kurczaka, sałata rzymska z winegretem, frytki.',
        blurb: 'Grillowane polędwiczki z kurczaka z sałatą rzymską w lekkim winegrecie, frytkami i ketchupem.',
        parts: ['Grillowane polędwiczki z kurczaka', 'Sałata rzymska z winegretem', 'Frytki', 'Ketchup'] },
      ko: { flag: '어린이', weight: '닭고기', cook: '그릴', pair: '주스',
        short: '구운 닭안심, 비네그레트 로메인, 감자튀김.',
        blurb: '구운 닭안심에 가벼운 비네그레트를 두른 로메인, 감자튀김과 케첩을 곁들입니다.',
        parts: ['구운 닭안심', '비네그레트 로메인', '감자튀김', '케첩'] }
    },
    'stek-junior': {
      pl: { flag: 'Dla dzieci', weight: '100 g', cook: 'Do wyboru', pair: 'Sok',
        short: '100 g polędwicy argentyńskiej, sałata rzymska i frytki.',
        blurb: 'Prawdziwy stek w dziecięcej porcji: 100 g polędwicy argentyńskiej z sałatą rzymską w winegrecie, frytkami i ketchupem.',
        parts: ['Polędwica argentyńska 100 g', 'Sałata rzymska z winegretem', 'Frytki', 'Ketchup'] },
      ko: { flag: '어린이', weight: '100g', cook: '원하시는 굽기로', pair: '주스',
        short: '아르헨티나 안심 100g, 로메인, 감자튀김.',
        blurb: '아이 몫으로 나오는 진짜 스테이크입니다. 아르헨티나 안심 100g에 비네그레트 로메인, 감자튀김, 케첩을 곁들입니다.',
        parts: ['아르헨티나 안심 100g', '비네그레트 로메인', '감자튀김', '케첩'] }
    },

    /* ── Dodatki ──────────────────────────────────────────────────── */
    'dodatek': {
      pl: { flag: 'Dowolny dodatek', weight: 'Jedna porcja', cook: '', pair: '',
        short: 'Frytki, bataty, purée, coleslaw, maślany szpinak, warzywa.',
        blurb: 'Dowolny z dodatków: frytki, bataty, purée ziemniaczane, coleslaw, maślany szpinak, sałata winegret z orzechami, grillowane warzywa albo fasolka szparagowa z dzikim brokułem. Do steków dwa z nich są w cenie.',
        parts: ['Frytki', 'Bataty', 'Purée ziemniaczane', 'Coleslaw', 'Maślany szpinak', 'Sałata winegret z orzechami', 'Grillowane warzywa', 'Fasolka szparagowa i dziki brokuł'] },
      ko: { flag: '사이드 선택', weight: '1인분', cook: '', pair: '',
        short: '감자튀김, 고구마, 퓌레, 코울슬로, 버터 시금치, 채소.',
        blurb: '감자튀김, 고구마튀김, 감자 퓌레, 코울슬로, 버터 시금치, 호두 비네그레트 샐러드, 구운 채소, 그린빈과 브로콜리니 중 하나를 고르실 수 있습니다. 스테이크에는 두 가지가 포함됩니다.',
        parts: ['감자튀김', '고구마튀김', '감자 퓌레', '코울슬로', '버터 시금치', '호두 비네그레트 샐러드', '구운 채소', '그린빈과 브로콜리니'] }
    },
    'sos': {
      pl: { flag: 'Dowolny sos', weight: 'Jedna porcja', cook: '', pair: '',
        short: 'Chimichurri, BBQ, hot mayo, spicy, pieprzowy, brown mustard, Hudson.',
        blurb: 'Dowolny z naszych sosów. Chimichurri do steków, Hudson do wszystkiego, co ma być zalane, hot mayo do reszty.',
        parts: ['Chimichurri', 'BBQ', 'Hot mayo', 'Spicy', 'Pieprzowy', 'Brown mustard', 'Hudson'] },
      ko: { flag: '소스 선택', weight: '1인분', cook: '', pair: '',
        short: '치미추리, BBQ, 핫 마요, 스파이시, 후추, 브라운 머스터드, 허드슨.',
        blurb: '하우스 소스 중 하나를 고르실 수 있습니다. 스테이크에는 치미추리, 소스를 부어 먹고 싶다면 허드슨, 나머지에는 핫 마요를 권합니다.',
        parts: ['치미추리', 'BBQ', '핫 마요', '스파이시', '후추', '브라운 머스터드', '허드슨'] }
    },

    /* ── Desery ───────────────────────────────────────────────────── */
    'brulee': {
      pl: { flag: 'Deser', weight: '', cook: 'Wypalane na zamówienie', pair: 'Espresso',
        short: 'Wypalane na zamówienie, więc na stole jeszcze pracuje.',
        blurb: 'Jedyny deser w karcie, co mówi wszystko o tym, jak poważnie go traktujemy. Wypalany w chwili wydania; pod spodem zimny, gęsty krem.',
        parts: ['Śmietanka', 'Wanilia', 'Żółtko', 'Palony cukier'] },
      ko: { flag: '디저트', weight: '', cook: '주문 후 토치', pair: '에스프레소',
        short: '주문 후 토치로 태워 테이블에서도 소리가 납니다.',
        blurb: '메뉴에 있는 유일한 디저트라는 점이 이 메뉴의 위상을 말해 줍니다. 내가기 직전에 설탕을 태우고, 아래에는 차갑고 진한 크림이 있습니다.',
        parts: ['생크림', '바닐라', '노른자', '태운 설탕'] }
    },

    /* ── Napoje ───────────────────────────────────────────────────── */
    'lets-meat-ipa': {
      pl: { flag: 'Nasza etykieta', weight: '500 ml', cook: 'American IPA', pair: 'Do wszystkiego z tej karty',
        short: 'IPA warzone dla nas przez Harpagana, pod naszą własną etykietą.',
        blurb: 'Żywiczna goryczka i cytrusowy chmiel — dokładnie to, czego potrzeba, żeby przełamać tłustego burgera. Warzone w małych partiach wyłącznie dla nas.',
        parts: ['Warzone przez Harpagana', 'Nasza własna etykieta', '500 ml'] },
      ko: { flag: '자체 라벨', weight: '500ml', cook: '아메리칸 IPA', pair: '이 페이지의 모든 메뉴',
        short: 'Harpagan이 우리를 위해 자체 라벨로 만드는 IPA.',
        blurb: '수지 같은 쓴맛과 시트러스 홉이 기름진 버거를 정확히 받쳐줍니다. 오직 우리를 위해 소량만 양조합니다.',
        parts: ['Harpagan 양조', '자체 라벨', '500ml'] }
    },
    'krafty': {
      pl: { flag: 'Pięć na karcie', weight: '500 ml', cook: '', pair: 'Do steków',
        short: "Pils, Hefeweizen, APA, Mangoweizen i Let's Meat IPA.",
        blurb: 'Pięć kraftów Harpagana po 21 zł i cztery bezalkoholowe po 19 zł — w tym IPA, wersja tropikalna i cytrusowa, plus Fruited Berliner Weisse (malina i wiśnia) od 4 Ścian.',
        parts: ['Pils', 'Hefeweizen', 'APA', 'Mangoweizen', "Let's Meat IPA", 'Bezalkoholowe od 19 zł'] },
      ko: { flag: '보드에 다섯 종', weight: '500ml', cook: '', pair: '스테이크와 함께',
        short: "필스, 헤페바이젠, APA, 망고바이젠, Let's Meat IPA.",
        blurb: 'Harpagan 크래프트 맥주 다섯 종이 21즈워티, 무알코올 네 종이 19즈워티입니다. IPA와 트로피컬·시트러스 버전, 4 Ściany의 라즈베리·체리 베를리너 바이세도 있습니다.',
        parts: ['필스', '헤페바이젠', 'APA', '망고바이젠', "Let's Meat IPA", '무알코올 19즈워티부터'] }
    },
    'lemoniada': {
      pl: { flag: 'Bez alkoholu', weight: '400 ml', cook: 'Robiona u nas', pair: 'Do ostrych burgerów',
        short: 'Robiona u nas i właściwa odpowiedź na wszystko, co ostre.',
        blurb: 'Robiona na miejscu i podawana zimna w szklance 400 ml. Woda filtrowana, gazowana lub nie, jest gratis i bez limitu, jeśli wolisz.',
        parts: ['Robiona u nas', '400 ml', 'Woda filtrowana gratis'] },
      ko: { flag: '무알코올', weight: '400ml', cook: '매장 제조', pair: '매운 버거와 함께',
        short: '매장에서 직접 만들며, 매운 메뉴에 가장 잘 맞습니다.',
        blurb: '매장에서 만들어 400ml 잔에 차갑게 냅니다. 정수된 물(탄산/무탄산)은 무료로 무제한 제공됩니다.',
        parts: ['매장 제조', '400ml', '정수 물 무료'] }
    },
    'espresso': {
      pl: { flag: 'Kawa', weight: '', cook: '', pair: 'Do crème brûlée',
        short: 'Espresso 6 zł, doppio, americano i cappuccino po 9 zł.',
        blurb: 'Krótka i mocna po crème brûlée. Doppio, americano i cappuccino po 9 zł; herbata 6 zł.',
        parts: ['Espresso 6 zł', 'Doppio 9 zł', 'Americano 9 zł', 'Cappuccino 9 zł', 'Herbata 6 zł'] },
      ko: { flag: '커피', weight: '', cook: '', pair: '크렘 브륄레와 함께',
        short: '에스프레소 6즈워티, 도피오·아메리카노·카푸치노 9즈워티.',
        blurb: '크렘 브륄레 뒤에 짧고 진하게. 도피오, 아메리카노, 카푸치노는 9즈워티, 차는 6즈워티입니다.',
        parts: ['에스프레소 6 zł', '도피오 9 zł', '아메리카노 9 zł', '카푸치노 9 zł', '차 6 zł'] }
    }
  };
}));
