/**
 * The menu.
 *
 * Taken from Meatologia's own board (photographed July 2026). Prices are in
 * złoty. Dish names are kept exactly as printed — "Tatar 'Nduja" is what the
 * kitchen calls it in any language — and the ingredient lists follow the
 * board's slash-separated style. Translations of the descriptive lines live
 * in menu-i18n.js.
 *
 * art   — id of an inline <symbol> in index.html
 * paint — CSS custom properties that tint that artwork for this dish
 */
window.MEATOLOGIA_MENU = {
  courses: [
    { id: 'all',       label: 'Everything' },
    { id: 'starters',  label: 'Starters' },
    { id: 'burgers',   label: 'Street food' },
    { id: 'steaks',    label: 'Steaks' },
    { id: 'mains',     label: 'Mains' },
    { id: 'kids',      label: 'Kids' },
    { id: 'sides',     label: 'Sides' },
    { id: 'sweet',     label: 'Dessert' },
    { id: 'drinks',    label: 'Drinks' }
  ],

  dishes: [
    /* ── Startery ─────────────────────────────────────────────────── */
    {
      id: 'tatar-klasyk', course: 'starters', name: 'Tatar klasyk', flag: 'The classic',
      price: 45, weight: 'Argentine tenderloin', cook: 'Raw, hand cut', pair: 'Cold vodka',
      short: 'Argentine tenderloin, marinated bay boletes, pickled cucumber and yolk.',
      blurb: 'The one to order first. Argentine tenderloin cut by hand, with marinated bay boletes, pickled cucumber, onion, egg yolk and worcestershire, served with bread.',
      parts: ['Argentine tenderloin', 'Marinated bay boletes', 'Pickled cucumber', 'Onion', 'Olive oil', 'Egg yolk', 'Worcestershire', 'Brown mustard', 'Chives', 'Bread'],
      art: 'art-side',
      paint: { '--art-veg': '#b8433a', '--art-basket': '#8c8f95' }
    },
    {
      id: 'tatar-nduja', course: 'starters', name: "Tatar 'Nduja", flag: 'Hot',
      price: 49, weight: 'Argentine tenderloin', cook: 'Raw, hand cut', pair: 'Harpagan APA',
      short: "Tartare with 'nduja and piri piri, and potato crisp for the crunch.",
      blurb: "The classic with the heat turned up: spreadable Calabrian 'nduja and piri piri worked through the tenderloin, with potato crisp on top.",
      parts: ['Argentine tenderloin', "'Nduja", 'Pickled cucumber', 'Piri piri', 'Worcestershire', 'Brown mustard', 'Potato crisp', 'Chives', 'Bread'],
      art: 'art-side',
      paint: { '--art-veg': '#a8322c', '--art-basket': '#8c8f95' }
    },
    {
      id: 'tatar-truflowy', course: 'starters', name: 'Tatar truflowy', flag: 'Truffle',
      price: 47, weight: 'Argentine tenderloin', cook: 'Raw, hand cut', pair: 'Rioja, by the glass',
      short: 'Truffle aioli, truffle oil, capers and pickled onion.',
      blurb: 'For anyone who thinks tartare should smell of the forest floor. Truffle aioli and truffle oil, with chopped capers and pickled onion cutting through them.',
      parts: ['Argentine tenderloin', 'Pickled cucumber', 'Pickled onion', 'Chopped capers', 'Brown mustard', 'Egg yolk', 'Chives', 'Truffle aioli', 'Truffle oil', 'Bread'],
      art: 'art-side',
      paint: { '--art-veg': '#9c4a3a', '--art-basket': '#8c8f95' }
    },
    {
      id: 'tatary-set', course: 'starters', name: 'Tatary set', flag: 'To share',
      price: 129, weight: 'Three tartares', cook: 'Raw, hand cut', pair: 'Cold vodka',
      short: 'Any three tartares from the menu, served on bread.',
      blurb: 'Pick any three tartares off the card and they arrive together on bread — the simplest way to settle which one is actually the best.',
      parts: ['Three tartares of your choice', 'Served on bread'],
      art: 'art-side',
      paint: { '--art-veg': '#b03a34', '--art-basket': '#8c8f95' }
    },
    {
      id: 'zupa-dnia', course: 'starters', name: 'Zupa dnia', flag: 'Soup of the day',
      price: 25, weight: '', cook: '', pair: 'Ask the floor',
      short: 'Ask whoever is serving what is on today.',
      blurb: 'Changes with what came in that morning. Ask the floor what is in the pot today.',
      parts: ['Changes daily'],
      art: 'art-dessert',
      paint: { '--art-patty': '#f0e6cf', '--art-cheese': '#c07a34', '--art-veg': '#6f9c3c' }
    },

    /* ── Street food ──────────────────────────────────────────────── */
    {
      id: 'classic-burger', course: 'burgers', name: 'Classic burger', flag: 'Where to start',
      price: 39, weight: 'Beef', cook: 'Medium', pair: "Harpagan Let's Meat IPA",
      short: 'Beef, iceberg, tomato, onion and pickle in a butter bun.',
      blurb: 'No tricks. Beef, crisp iceberg, tomato, onion, pickled cucumber, mayo and ketchup in a butter bun — the burger the rest of the board is measured against.',
      parts: ['Beef', 'Iceberg lettuce', 'Tomato', 'Onion', 'Pickled cucumber', 'Mayo', 'Ketchup', 'Butter bun'],
      art: 'art-burger',
      paint: { '--art-bun': '#e5a94f', '--art-bun-btm': '#cf9445', '--art-patty': '#4a2e1e', '--art-cheese': '#f2b12b', '--art-veg': '#6f9c3c' }
    },
    {
      id: 'cheese-bacon', course: 'burgers', name: 'Cheese & Bacon smash', flag: 'Bestseller',
      price: 49, weight: '2 × beef', cook: 'Smashed', pair: "Harpagan Let's Meat IPA",
      short: 'Two smashed patties, double cheddar, bacon and grilled onion.',
      blurb: 'Two patties pressed hard onto the plancha for a lacy brown crust, double cheddar, bacon, grilled onion and hot mayo.',
      parts: ['2 × beef', '2 × cheddar', 'Bacon', 'Iceberg lettuce', 'Grilled onion', 'Hot mayo', 'Butter bun'],
      art: 'art-burger',
      paint: { '--art-bun': '#d8993f', '--art-bun-btm': '#bd8134', '--art-patty': '#402617', '--art-cheese': '#f5a623', '--art-veg': '#8a5a2b' }
    },
    {
      id: 'flooded', course: 'burgers', name: 'Flooded Cheese & Bacon smash', flag: "Chef's choice",
      price: 55, weight: '2 × beef', cook: 'Smashed', pair: "Harpagan Let's Meat IPA",
      short: 'The Cheese & Bacon, flooded with Hudson sauce, with fries.',
      blurb: 'The Cheese & Bacon smash under a pour of Hudson sauce, with fries alongside. The kitchen picks this one when you ask them what to have.',
      parts: ['2 × beef', '2 × cheddar', 'Bacon', 'Iceberg lettuce', 'Grilled onion', 'Hot mayo', 'Hudson sauce', 'Fries', 'Butter bun'],
      art: 'art-burger',
      paint: { '--art-bun': '#eab35c', '--art-bun-btm': '#d29a4c', '--art-patty': '#472b1c', '--art-cheese': '#ffc233', '--art-veg': '#4f8a2f' }
    },
    {
      id: 'double-trouble', course: 'burgers', name: 'Double Trouble burger', flag: 'Pastrami + beef',
      price: 59, weight: 'Beef + pastrami', cook: 'Medium', pair: 'Harpagan Pils',
      short: 'Beef and house pastrami together, with sauerkraut and brown mustard.',
      blurb: 'A burger and a pastrami sandwich arguing in one bun, and both winning. House pastrami over the beef, sauerkraut, cheddar and brown mustard to cut it.',
      parts: ['Beef', 'Meatologia pastrami', 'Cheddar', 'Sauerkraut', 'Brown mustard', 'Pickled cucumber', 'Pickled onion', 'Mayo', 'Butter bun'],
      art: 'art-burger',
      paint: { '--art-bun': '#e0a44f', '--art-bun-btm': '#c88f3d', '--art-patty': '#3a2214', '--art-cheese': '#ffb92e', '--art-veg': '#5f9438' }
    },
    {
      id: 'wagyu-smash', course: 'burgers', name: 'Wagyu smash', flag: 'Premium',
      price: 89, weight: 'Wagyu beef', cook: 'Smashed', pair: 'Rioja, by the glass',
      short: 'Wagyu beef, cheddar, sweet onion and ponzu mayo.',
      blurb: 'Marbled wagyu renders as it hits the plancha and seasons the bun on its way down. Sweet onion, pickled cucumber and ponzu mayo — nothing loud enough to talk over it.',
      parts: ['Wagyu beef', 'Cheddar', 'Sweet onion', 'Pickled cucumber', 'Ponzu mayo', 'Butter bun'],
      art: 'art-burger',
      paint: { '--art-bun': '#edbc6e', '--art-bun-btm': '#d5a252', '--art-patty': '#563018', '--art-cheese': '#e6c463', '--art-veg': '#7fa93f' }
    },
    {
      id: 'pastrami', course: 'burgers', name: 'Pastrami', flag: 'Years in the making',
      price: 59, weight: 'House pastrami', cook: 'Smoked in house', pair: 'Harpagan Pils',
      short: 'House pastrami, sauerkraut and cheddar on pullman bread.',
      blurb: 'The pastrami we have been refining for years: cured and smoked in house, shaved thick, with sauerkraut, cheddar, baby spinach and two mustards on pullman bread.',
      parts: ['Meatologia pastrami', 'Sauerkraut', 'Cheddar', 'Pickled cucumber', 'Baby spinach', 'Hot mayo', 'Brown mustard', 'Pullman bread'],
      art: 'art-burger',
      paint: { '--art-bun': '#c08b48', '--art-bun-btm': '#a67436', '--art-patty': '#552820', '--art-cheese': '#e0a63a', '--art-veg': '#66913a' }
    },

    /* ── Steki · Argentyna ────────────────────────────────────────── */
    {
      id: 'arg-ny', course: 'steaks', name: 'New York', flag: 'Argentina',
      price: 99, weight: '250 g', cook: 'Your call', pair: 'Malbec, Mendoza',
      short: 'Black Angus, wet-aged a minimum of eight weeks.',
      blurb: 'Argentine Black Angus, wet-aged at least eight weeks. Firm grain, a fat edge that caramelises hard over charcoal, and enough character to stand up to a big red. Served with two sides included.',
      parts: ['Black Angus', 'Wet-aged 8 weeks minimum', 'Two sides included', 'Sauce of your choice'],
      art: 'art-steak',
      paint: { '--art-patty': '#77281f', '--art-crust': '#93412c', '--art-cheese': '#f6e6ae', '--art-veg': '#5f7f39' }
    },
    {
      id: 'arg-ribeye', course: 'steaks', name: 'Rib Eye', flag: 'Argentina',
      price: 119, weight: '250 g', cook: 'Your call', pair: 'Malbec, Mendoza',
      short: 'The forgiving one — marbling that seasons itself.',
      blurb: 'Intramuscular fat melts through the muscle as it cooks, so it stays juicy even a shade past where you meant to stop. If you are nervous about ordering steak, order this. Two sides included.',
      parts: ['Black Angus', 'Wet-aged 8 weeks minimum', 'Two sides included', 'Sauce of your choice'],
      art: 'art-steak',
      paint: { '--art-patty': '#802b21', '--art-crust': '#9c4430', '--art-cheese': '#f6e6ae', '--art-veg': '#5f7f39' }
    },
    {
      id: 'arg-filet', course: 'steaks', name: 'Filet Mignon', flag: 'Argentina',
      price: 139, weight: '200 g', cook: 'Medium rare, please', pair: 'Barolo',
      short: 'Cut from the heart of the tenderloin. Nothing to chew through.',
      blurb: 'No sinew, almost no fat, all texture. We finish it and send it out before anything can be added to it. Two sides included.',
      parts: ['Black Angus tenderloin', 'Wet-aged 8 weeks minimum', 'Two sides included', 'Sauce of your choice'],
      art: 'art-steak',
      paint: { '--art-patty': '#8a3025', '--art-crust': '#a44a33', '--art-cheese': '#f6e6ae', '--art-veg': '#5f7f39' }
    },

    /* ── Steki · USA ──────────────────────────────────────────────── */
    {
      id: 'usa-ny', course: 'steaks', name: 'New York', flag: 'USA · USDA Prime',
      price: 59, weight: '100 g', cook: 'Your call', pair: 'Napa Cabernet',
      short: 'USDA Prime Black Angus from Creekstone Farms, Arkansas City.',
      blurb: 'Corn finishing builds a denser marble and a sweeter, buttery profile than the Argentine cuts. Only a small share of American beef earns the Prime grade. Priced per 100 g.',
      parts: ['USDA Prime', 'Creekstone Farms, Arkansas City', 'Wet-aged 8 weeks minimum', 'Two sides included'],
      art: 'art-steak',
      paint: { '--art-patty': '#8c3327', '--art-crust': '#ab4c33', '--art-cheese': '#f6e6ae', '--art-veg': '#5f7f39' }
    },
    {
      id: 'usa-ribeye', course: 'steaks', name: 'Rib Eye', flag: 'USA · USDA Prime',
      price: 69, weight: '100 g', cook: 'Your call', pair: 'Napa Cabernet',
      short: 'The Prime rib eye — the richest thing on the American side.',
      blurb: 'Prime-grade marbling in the most generous cut we carry. Rich enough that 200 g is usually plenty. Priced per 100 g, two sides included.',
      parts: ['USDA Prime', 'Creekstone Farms, Arkansas City', 'Wet-aged 8 weeks minimum', 'Two sides included'],
      art: 'art-steak',
      paint: { '--art-patty': '#94382a', '--art-crust': '#b2543a', '--art-cheese': '#f6e6ae', '--art-veg': '#5f7f39' }
    },
    {
      id: 'usa-filet', course: 'steaks', name: 'Filet Mignon', flag: 'USA · USDA Prime',
      price: 89, weight: '100 g', cook: 'Medium rare, please', pair: 'Napa Cabernet',
      short: 'Prime tenderloin — the tenderest cut, American style.',
      blurb: 'Prime-grade tenderloin: the texture of the Argentine filet with the sweeter, corn-fed finish. Priced per 100 g, two sides included.',
      parts: ['USDA Prime tenderloin', 'Creekstone Farms, Arkansas City', 'Wet-aged 8 weeks minimum', 'Two sides included'],
      art: 'art-steak',
      paint: { '--art-patty': '#9a3b2c', '--art-crust': '#b9583c', '--art-cheese': '#f6e6ae', '--art-veg': '#5f7f39' }
    },

    /* ── Steki · Japonia ──────────────────────────────────────────── */
    {
      id: 'wagyu-striploin', course: 'steaks', name: 'Striploin', flag: 'Japan · Wagyu A5',
      price: 129, weight: '100 g', cook: 'Medium rare', pair: 'Cold sake',
      short: 'Black Wagyu, grade A5, from Kagoshima prefecture.',
      blurb: 'Marbling so dense the meat reads pink rather than red. Served in 100 g portions deliberately — past that it stops being dinner and starts being a dare.',
      parts: ['Black Wagyu A5', 'Kagoshima prefecture', 'Two sides included', 'Sauce of your choice'],
      art: 'art-steak',
      paint: { '--art-patty': '#96453a', '--art-crust': '#c06a45', '--art-cheese': '#f7ecc4', '--art-veg': '#6f9142' }
    },
    {
      id: 'wagyu-cuberoll', course: 'steaks', name: 'Cuberoll', flag: 'Japan · Wagyu A5',
      price: 149, weight: '100 g', cook: 'Medium rare', pair: 'Cold sake',
      short: 'The most marbled cut of A5 wagyu we carry.',
      blurb: 'The cut that makes people photograph their food. Fat renders almost at room temperature, so it needs seconds on the grill and nothing else.',
      parts: ['Black Wagyu A5', 'Kagoshima prefecture', 'Two sides included', 'Sauce of your choice'],
      art: 'art-steak',
      paint: { '--art-patty': '#9c4a3d', '--art-crust': '#c6714b', '--art-cheese': '#f7ecc4', '--art-veg': '#6f9142' }
    },
    {
      id: 'wagyu-tenderloin', course: 'steaks', name: 'Tenderloin', flag: 'Japan · Wagyu A5',
      price: 179, weight: '100 g', cook: 'Medium rare', pair: 'Cold sake',
      short: 'The shortest route to "I will remember that".',
      blurb: 'The most expensive line on the card and the only one where we will ask you to skip the sauce. Seared briefly, sliced, on the table within seconds.',
      parts: ['Black Wagyu A5', 'Kagoshima prefecture', 'Two sides included', 'Sauce of your choice'],
      art: 'art-steak',
      paint: { '--art-patty': '#a35043', '--art-crust': '#cd7a52', '--art-cheese': '#f7ecc4', '--art-veg': '#6f9142' }
    },

    /* ── Sety steków ──────────────────────────────────────────────── */
    {
      id: 'set-argentyna', course: 'steaks', name: 'Set Argentyński', flag: 'For the table',
      price: 399, weight: '≈ 700 g', cook: 'Your call', pair: 'Malbec, by the bottle',
      short: 'Three Argentine steaks — Filet Mignon, Rib Eye and New York.',
      blurb: 'Around 700 g of Argentine Black Angus across three cuts, with three sides and three sauces. Built for a table that cannot agree.',
      parts: ['Filet Mignon', 'Rib Eye', 'New York', 'Three sides', 'Three sauces'],
      art: 'art-steak',
      paint: { '--art-patty': '#7d2c22', '--art-crust': '#9a4430', '--art-cheese': '#f6e6ae', '--art-veg': '#5f7f39' }
    },
    {
      id: 'set-ribeye', course: 'steaks', name: 'Set Rib Eye', flag: 'Three countries',
      price: 699, weight: '≈ 750 g', cook: 'Your call', pair: 'Malbec, by the bottle',
      short: 'The same cut from Argentina, the States and Japan, side by side.',
      blurb: 'Around 750 g of rib eye — Argentine, USDA Prime and A5 wagyu on one board. The clearest way to taste what the three countries actually do differently.',
      parts: ['Rib Eye · Argentina', 'Rib Eye · USA Prime', 'Rib Eye · Wagyu A5', 'Three sides', 'Three sauces'],
      art: 'art-steak',
      paint: { '--art-patty': '#8c3428', '--art-crust': '#ac5237', '--art-cheese': '#f6e6ae', '--art-veg': '#5f7f39' }
    },
    {
      id: 'set-filet', course: 'steaks', name: 'Set Filet Mignon', flag: 'Three countries',
      price: 749, weight: '≈ 600 g', cook: 'Medium rare, please', pair: 'Barolo',
      short: 'Tenderloin from Argentina, the States and Japan on one board.',
      blurb: 'Around 600 g of tenderloin across the three origins, with three sides and three sauces. The most expensive way to settle an argument, and the most convincing.',
      parts: ['Filet Mignon · Argentina', 'Filet Mignon · USA Prime', 'Tenderloin · Wagyu A5', 'Three sides', 'Three sauces'],
      art: 'art-steak',
      paint: { '--art-patty': '#94402f', '--art-crust': '#b45f40', '--art-cheese': '#f7ecc4', '--art-veg': '#6f9142' }
    },

    /* ── Dania główne ─────────────────────────────────────────────── */
    {
      id: 'zeberka', course: 'mains', name: 'Żeberka Low & Slow', flag: 'Slow cooked',
      price: 79, weight: 'Pork ribs', cook: 'Slow roasted', pair: 'Harpagan Pils',
      short: 'Slow-roasted pork ribs, BBQ glaze, coleslaw and fries.',
      blurb: 'Roasted low and slow until the meat gives up, then glazed in BBQ and finished hard. Coleslaw and fries alongside, and a sauce of your choosing.',
      parts: ['Slow-roasted pork ribs', 'BBQ glaze', 'Coleslaw', 'Fries', 'Sauce of your choice'],
      art: 'art-steak',
      paint: { '--art-patty': '#6e3320', '--art-crust': '#8f4a2c', '--art-cheese': '#f0dca8', '--art-veg': '#5f7f39' }
    },
    {
      id: 'kaczka', course: 'mains', name: 'Kaczka', flag: 'Confit',
      price: 79, weight: 'Duck leg', cook: 'Confit', pair: 'Rioja, by the glass',
      short: 'Confit duck leg, potato purée and roast beetroot salad.',
      blurb: 'Duck leg cooked slowly in its own fat until the skin crisps and the meat falls away, with potato purée, roast beetroot salad and a balsamic-fig sauce.',
      parts: ['Confit duck leg', 'Potato purée', 'Roast beetroot salad', 'Balsamic-fig sauce'],
      art: 'art-steak',
      paint: { '--art-patty': '#7a3a26', '--art-crust': '#9c5432', '--art-cheese': '#e9d6a4', '--art-veg': '#8c3a52' }
    },
    {
      id: 'jagniece', course: 'mains', name: 'Polędwiczki jagnięce', flag: 'New Zealand lamb',
      price: 99, weight: 'Lamb loin', cook: 'Pink', pair: 'Barolo',
      short: 'New Zealand lamb loin, demi-glace and thyme butter.',
      blurb: 'New Zealand lamb loin cooked pink, with demi-glace, unagi-glazed vegetables, thyme butter and potato purée.',
      parts: ['New Zealand lamb loin', 'Demi-glace', 'Unagi vegetables', 'Thyme butter', 'Potato purée'],
      art: 'art-steak',
      paint: { '--art-patty': '#8a3a34', '--art-crust': '#a85440', '--art-cheese': '#efdcac', '--art-veg': '#5f7f39' }
    },
    {
      id: 'sandacz', course: 'mains', name: 'Sandacz', flag: 'From the water',
      price: 79, weight: 'Pike-perch fillet', cook: 'Pan seared', pair: 'House lemonade',
      short: 'Pike-perch fillet, lemon potato purée and wild broccoli.',
      blurb: 'The one dish here with no red meat in it, and it earns its place. Pike-perch fillet with lemon-potato purée, wild broccoli and a creamy chorizo sauce.',
      parts: ['Pike-perch fillet', 'Lemon potato purée', 'Wild broccoli', 'Creamy chorizo sauce'],
      art: 'art-side',
      paint: { '--art-veg': '#cbd3d8', '--art-basket': '#8c8f95' }
    },
    {
      id: 'cezar', course: 'mains', name: 'Sałatka Cezar', flag: 'Lighter',
      price: 45, weight: 'Chicken', cook: 'Grilled', pair: 'House lemonade',
      short: 'Grilled chicken, romaine, cherry tomatoes, pecorino and parmesan.',
      blurb: 'Grilled chicken fillets over romaine with cherry tomatoes, two hard cheeses, Caesar dressing and croutons. What the one person at the table who did not come for beef orders.',
      parts: ['Grilled chicken fillets', 'Romaine', 'Cherry tomatoes', 'Pecorino', 'Parmesan', 'Caesar dressing', 'Croutons'],
      art: 'art-side',
      paint: { '--art-veg': '#6f9c3c', '--art-basket': '#b7bcc4' }
    },

    /* ── Dla dzieci ───────────────────────────────────────────────── */
    {
      id: 'burger-junior', course: 'kids', name: 'Burger Junior', flag: 'For children',
      price: 35, weight: 'Beef', cook: 'Well done', pair: 'Juice',
      short: 'Beef, cheddar, iceberg and ketchup, with fries.',
      blurb: 'The Classic, scaled down and simplified: beef, cheddar, iceberg, ketchup, butter bun and fries.',
      parts: ['Beef', 'Cheddar', 'Iceberg lettuce', 'Ketchup', 'Butter bun', 'Fries'],
      art: 'art-burger',
      paint: { '--art-bun': '#e8b45f', '--art-bun-btm': '#d09b48', '--art-patty': '#4a2e1e', '--art-cheese': '#f2b12b', '--art-veg': '#6f9c3c' }
    },
    {
      id: 'kurczak-junior', course: 'kids', name: 'Kurczak Junior', flag: 'For children',
      price: 35, weight: 'Chicken', cook: 'Grilled', pair: 'Juice',
      short: 'Grilled chicken fillets, romaine with vinaigrette, fries.',
      blurb: 'Grilled chicken fillets with romaine in a light vinaigrette, fries and ketchup.',
      parts: ['Grilled chicken fillets', 'Romaine with vinaigrette', 'Fries', 'Ketchup'],
      art: 'art-side',
      paint: { '--art-veg': '#e0b34a', '--art-basket': '#b7bcc4' }
    },
    {
      id: 'stek-junior', course: 'kids', name: 'Stek Junior', flag: 'For children',
      price: 49, weight: '100 g', cook: 'Your call', pair: 'Juice',
      short: '100 g of Argentine tenderloin, romaine and fries.',
      blurb: 'A proper steak in a child-sized portion: 100 g of Argentine tenderloin with romaine in vinaigrette, fries and ketchup.',
      parts: ['Argentine tenderloin 100 g', 'Romaine with vinaigrette', 'Fries', 'Ketchup'],
      art: 'art-steak',
      paint: { '--art-patty': '#82302a', '--art-crust': '#a04a34', '--art-cheese': '#f6e6ae', '--art-veg': '#5f7f39' }
    },

    /* ── Dodatki ──────────────────────────────────────────────────── */
    {
      id: 'dodatek', course: 'sides', name: 'Dodatek', flag: 'Any side',
      price: 9, weight: 'One portion', cook: '', pair: '',
      short: 'Fries, sweet potato, purée, coleslaw, buttered spinach, greens.',
      blurb: 'Any one of the sides: fries, sweet potato fries, potato purée, coleslaw, buttered spinach, walnut vinaigrette salad, grilled vegetables, or green beans with wild broccoli. Steaks come with two of them included.',
      parts: ['Fries', 'Sweet potato fries', 'Potato purée', 'Coleslaw', 'Buttered spinach', 'Walnut vinaigrette salad', 'Grilled vegetables', 'Green beans & wild broccoli'],
      art: 'art-side',
      paint: { '--art-veg': '#eab53f', '--art-basket': '#9aa2ab' }
    },
    {
      id: 'sos', course: 'sides', name: 'Sos', flag: 'Any sauce',
      price: 5, weight: 'One portion', cook: '', pair: '',
      short: 'Chimichurri, BBQ, hot mayo, spicy, pepper, brown mustard, Hudson.',
      blurb: 'Any one of the house sauces. Chimichurri for the steaks, Hudson for anything you want flooded, hot mayo for everything else.',
      parts: ['Chimichurri', 'BBQ', 'Hot mayo', 'Spicy', 'Pepper', 'Brown mustard', 'Hudson'],
      art: 'art-side',
      paint: { '--art-veg': '#b8433a', '--art-basket': '#9aa2ab' }
    },

    /* ── Desery ───────────────────────────────────────────────────── */
    {
      id: 'brulee', course: 'sweet', name: 'Crème brûlée', flag: 'Dessert',
      price: 17, weight: '', cook: 'Torched to order', pair: 'Espresso',
      short: 'Torched to order, so it is still working when it reaches you.',
      blurb: 'The only dessert on the card, which tells you how seriously it is taken. Fired the moment it leaves the pass; cold, dense custard underneath.',
      parts: ['Cream', 'Vanilla', 'Egg yolk', 'Burnt sugar'],
      art: 'art-dessert',
      paint: { '--art-patty': '#f7f0dd', '--art-cheese': '#c98a2e', '--art-veg': '#b8324a' }
    },

    /* ── Napoje ───────────────────────────────────────────────────── */
    {
      id: 'lets-meat-ipa', course: 'drinks', name: "Harpagan Let's Meat IPA", flag: 'Our own label',
      price: 21, weight: '500 ml', cook: 'American IPA', pair: 'Everything on this page',
      short: 'An IPA brewed for us by Harpagan, under our own label.',
      blurb: 'Resinous bitterness and citrus hop — exactly what a fatty burger needs pushing back against it. Brewed in small batches for us alone.',
      parts: ['Brewed by Harpagan', 'Our own label', '500 ml'],
      art: 'art-drink',
      paint: { '--art-patty': '#a8641f', '--art-liquid': '#e0a33c', '--art-label': '#f3ece0', '--art-ink': '#8a1f1c', '--art-cap': '#6f4415' }
    },
    {
      id: 'krafty', course: 'drinks', name: 'Harpagan · krafty', flag: 'Five on the board',
      price: 21, weight: '500 ml', cook: '', pair: 'The steaks',
      short: 'Pils, Hefeweizen, APA, Mangoweizen and Let\'s Meat IPA.',
      blurb: 'Five craft beers from Harpagan on the board at 21 zł, and four alcohol-free ones at 19 zł — including an IPA, a tropical and a citrus version, plus a raspberry-and-cherry Berliner Weisse from 4 Ściany.',
      parts: ['Pils', 'Hefeweizen', 'APA', 'Mangoweizen', "Let's Meat IPA", 'Alcohol-free from 19 zł'],
      art: 'art-drink',
      paint: { '--art-patty': '#b8791f', '--art-liquid': '#e8b24a', '--art-label': '#f3ece0', '--art-ink': '#5f7f39', '--art-cap': '#6f4415' }
    },
    {
      id: 'lemoniada', course: 'drinks', name: 'Domowa lemoniada', flag: 'No alcohol',
      price: 19, weight: '400 ml', cook: 'Made in house', pair: 'The hot burgers',
      short: 'Made here, and the right answer to anything spicy.',
      blurb: 'Made in house and served cold in a 400 ml glass. Filtered water, still or sparkling, is free and unlimited if you would rather have that.',
      parts: ['Made in house', '400 ml', 'Filtered water free of charge'],
      art: 'art-drink',
      paint: { '--art-patty': '#cbb43c', '--art-liquid': '#e8dc59', '--art-label': '#f6f2e2', '--art-ink': '#5f7f39', '--art-cap': '#8f7d1f' }
    },
    {
      id: 'espresso', course: 'drinks', name: 'Espresso', flag: 'Coffee',
      price: 6, weight: '', cook: '', pair: 'The brûlée',
      short: 'Espresso 6 zł, doppio, americano and cappuccino 9 zł.',
      blurb: 'Short and dark after the brûlée. Doppio, americano and cappuccino are 9 zł; tea is 6 zł.',
      parts: ['Espresso 6 zł', 'Doppio 9 zł', 'Americano 9 zł', 'Cappuccino 9 zł', 'Tea 6 zł'],
      art: 'art-drink',
      paint: { '--art-patty': '#4a3126', '--art-liquid': '#5b3a24', '--art-label': '#efe4d2', '--art-ink': '#3a2318', '--art-cap': '#2f1d12' }
    }
  ]
};
