/**
 * Menu data for Meatologia.
 *
 * art   — id of an inline <symbol> in index.html
 * paint — CSS custom properties applied to that artwork. One symbol serves
 *         many dishes; only the tint changes. Swap the <use> for an <img>
 *         here and in the takeover markup when real photography arrives.
 */
window.MEATOLOGIA_MENU = {
  courses: [
    { id: 'all',      label: 'Everything' },
    { id: 'burgers',  label: 'Burgers' },
    { id: 'steaks',   label: 'Steaks' },
    { id: 'sides',    label: 'Sides' },
    { id: 'sweet',    label: 'Dessert' },
    { id: 'drinks',   label: 'Drinks' }
  ],

  dishes: [
    /* ── Burgers ───────────────────────────────────────────────────── */
    {
      id: 'classic', course: 'burgers', name: 'The Classic', flag: 'Where to start',
      price: 42, weight: '180 g beef', cook: 'Medium', pair: 'Let\'s Meat IPA',
      short: 'Black Angus, aged cheddar, butter lettuce and our own sauce.',
      blurb: 'The dish the rest of the card is built around. Chuck and brisket ground this morning, grilled over charcoal to a juicy medium, melted cheddar, and a roast-garlic sauce we have refused to change in four years.',
      parts: ['Black Angus beef', 'Aged cheddar', 'Butter lettuce', 'Tomato', 'Pickle', 'Meatologia sauce'],
      art: 'art-burger',
      paint: { '--art-bun': '#e5a94f', '--art-bun-btm': '#cf9445', '--art-patty': '#4a2e1e', '--art-cheese': '#f2b12b', '--art-veg': '#6f9c3c' }
    },
    {
      id: 'cheese-bacon', course: 'burgers', name: 'Cheese & Bacon', flag: 'Bestseller',
      price: 49, weight: '180 g beef', cook: 'Medium', pair: 'Let\'s Meat IPA',
      short: 'Double cheddar, beechwood bacon, onions caramelised in dark beer.',
      blurb: 'For anyone who holds that there is no such thing as too much cheese. Two slices of matured cheddar, bacon smoked over beechwood, and onions cooked down slowly in porter until they turn to jam.',
      parts: ['Black Angus beef', 'Double cheddar', 'Smoked bacon', 'Beer onions', 'Chipotle mayo'],
      art: 'art-burger',
      paint: { '--art-bun': '#d8993f', '--art-bun-btm': '#bd8134', '--art-patty': '#402617', '--art-cheese': '#f5a623', '--art-veg': '#8a5a2b' }
    },
    {
      id: 'flooded', course: 'burgers', name: 'Flooded Cheese', flag: 'Hot',
      price: 47, weight: '180 g beef', cook: 'Medium', pair: 'House lemonade',
      short: 'Buried under hot cheddar sauce, jalapeño and crisp onion.',
      blurb: 'The name is not a metaphor. It reaches the table under a running pour of hot cheddar sauce, with jalapeño for heat and fried onion for the crunch that survives it. A fork is not optional.',
      parts: ['Black Angus beef', 'Cheddar sauce', 'Jalapeño', 'Crisp onion', 'Habanero hot sauce'],
      art: 'art-burger',
      paint: { '--art-bun': '#eab35c', '--art-bun-btm': '#d29a4c', '--art-patty': '#472b1c', '--art-cheese': '#ffc233', '--art-veg': '#4f8a2f' }
    },
    {
      id: 'double', course: 'burgers', name: 'Double Trouble', flag: 'Smash ×2',
      price: 55, weight: '2 × 100 g', cook: 'Well done, on purpose', pair: 'Let\'s Meat IPA',
      short: 'Two smashed patties, double American cheese, pickles, burger sauce.',
      blurb: 'Two balls of beef pressed hard onto a screaming plancha. Lacy brown crust on the outside, still slack in the middle. American cheese, pickles, burger sauce — the argument ends there.',
      parts: ['2 × 100 g smash', 'American cheese ×2', 'Pickles', 'White onion', 'Burger sauce'],
      art: 'art-burger',
      paint: { '--art-bun': '#e0a44f', '--art-bun-btm': '#c88f3d', '--art-patty': '#3a2214', '--art-cheese': '#ffb92e', '--art-veg': '#5f9438' }
    },
    {
      id: 'wagyu-smash', course: 'burgers', name: 'Wagyu Smash', flag: 'Premium',
      price: 69, weight: '160 g wagyu', cook: 'Medium rare', pair: 'Rioja, by the glass',
      short: 'Wagyu beef, truffle mayo, rocket and a matured hard cheese.',
      blurb: 'Marbled wagyu renders as it cooks and seasons the bun on its way down. Truffle and rocket are the only things we let near it — anything louder would be talking over the beef.',
      parts: ['Wagyu beef', 'Truffle mayo', 'Rocket', 'Matured cheese', 'Red onion jam'],
      art: 'art-burger',
      paint: { '--art-bun': '#edbc6e', '--art-bun-btm': '#d5a252', '--art-patty': '#563018', '--art-cheese': '#e6c463', '--art-veg': '#7fa93f' }
    },
    {
      id: 'pastrami', course: 'burgers', name: 'Pastrami Burger', flag: 'New',
      price: 52, weight: '180 g + 60 g pastrami', cook: 'Medium', pair: 'Let\'s Meat IPA',
      short: 'House pastrami, coarse mustard and dill pickle on rye.',
      blurb: 'We cure the brisket ourselves and smoke it for twelve hours, then shave it in ribbons over the patty. Rye bun, coarse mustard, dill pickle. It should not work as well as it does.',
      parts: ['Black Angus beef', 'House pastrami', 'Coarse mustard', 'Dill pickle', 'Rye bun'],
      art: 'art-burger',
      paint: { '--art-bun': '#c08b48', '--art-bun-btm': '#a67436', '--art-patty': '#552820', '--art-cheese': '#e0a63a', '--art-veg': '#66913a' }
    },

    /* ── Steaks ────────────────────────────────────────────────────── */
    {
      id: 'arg-ny', course: 'steaks', name: 'New York', flag: 'Argentina',
      price: 96, weight: '250 g', cook: 'Your call', pair: 'Malbec, Mendoza',
      short: 'Grass-fed Black Angus sirloin, wet-aged five weeks.',
      blurb: 'Argentine cattle raised on pasture, which is why it tastes of something. Firm grain, a fat edge that caramelises hard over charcoal, and enough character to stand up to a big red.',
      parts: ['Five-week wet aged', 'Herb butter', 'Sea salt', 'Cracked pepper'],
      art: 'art-steak',
      paint: { '--art-patty': '#77281f', '--art-crust': '#93412c', '--art-cheese': '#f6e6ae', '--art-veg': '#5f7f39' }
    },
    {
      id: 'arg-ribeye', course: 'steaks', name: 'Rib Eye', flag: 'Argentina',
      price: 119, weight: '250 g', cook: 'Your call', pair: 'Malbec, Mendoza',
      short: 'The forgiving one — marbling that seasons itself.',
      blurb: 'Intramuscular fat melts through the muscle as it cooks, which keeps it juicy even a shade past where you meant to stop. If you are nervous about ordering steak, order this one.',
      parts: ['Five-week wet aged', 'Herb butter', 'Sea salt', 'Cracked pepper'],
      art: 'art-steak',
      paint: { '--art-patty': '#802b21', '--art-crust': '#9c4430', '--art-cheese': '#f6e6ae', '--art-veg': '#5f7f39' }
    },
    {
      id: 'arg-filet', course: 'steaks', name: 'Filet Mignon', flag: 'Argentina',
      price: 176, weight: '300 g', cook: 'Medium rare, please', pair: 'Barolo',
      short: 'Cut from the heart of the tenderloin. Nothing to chew through.',
      blurb: 'No sinew, almost no fat, all texture. We finish it with herb butter and maldon and send it out before anything else can be added to it.',
      parts: ['Heart of tenderloin', 'Herb butter', 'Maldon salt', 'Cracked pepper'],
      art: 'art-steak',
      paint: { '--art-patty': '#8a3025', '--art-crust': '#a44a33', '--art-cheese': '#f6e6ae', '--art-veg': '#5f7f39' }
    },
    {
      id: 'usa-ribeye', course: 'steaks', name: 'Rib Eye', flag: 'USDA Prime',
      price: 149, weight: '300 g', cook: 'Your call', pair: 'Napa Cabernet',
      short: 'Black Angus USDA Prime — the top few percent of American beef.',
      blurb: 'Corn finishing builds a denser marble and a sweeter, buttery profile than the Argentine cuts. Only a small share of American beef ever earns the Prime grade; this is that beef.',
      parts: ['USDA Prime grade', 'Five-week wet aged', 'Herb butter', 'Sea salt'],
      art: 'art-steak',
      paint: { '--art-patty': '#8c3327', '--art-crust': '#ab4c33', '--art-cheese': '#f6e6ae', '--art-veg': '#5f7f39' }
    },
    {
      id: 'wagyu-striploin', course: 'steaks', name: 'Striploin', flag: 'Japan A5',
      price: 125, weight: '100 g', cook: 'Medium rare', pair: 'Cold sake',
      short: 'Japanese wagyu at the top grade, from Kagoshima.',
      blurb: 'Marbling so dense the meat reads pink rather than red. We serve it small deliberately — past a hundred grams it stops being dinner and starts being a dare.',
      parts: ['A5 Kagoshima wagyu', 'Maldon salt', 'Fresh wasabi', 'Ponzu'],
      art: 'art-steak',
      paint: { '--art-patty': '#96453a', '--art-crust': '#c06a45', '--art-cheese': '#f7ecc4', '--art-veg': '#6f9142' }
    },
    {
      id: 'wagyu-tenderloin', course: 'steaks', name: 'Tenderloin', flag: 'Japan A5',
      price: 175, weight: '100 g', cook: 'Medium rare', pair: 'Cold sake',
      short: 'The shortest route to "I will remember that".',
      blurb: 'The most expensive line on the card and the only one where we will ask you to skip the sauce. Seared briefly, sliced, on the table within seconds.',
      parts: ['A5 Kagoshima wagyu', 'Maldon salt', 'Fresh wasabi', 'Sansho pepper'],
      art: 'art-steak',
      paint: { '--art-patty': '#9d4b3e', '--art-crust': '#c9744c', '--art-cheese': '#f7ecc4', '--art-veg': '#6f9142' }
    },

    /* ── Sides ─────────────────────────────────────────────────────── */
    {
      id: 'fries', course: 'sides', name: 'Belgian Fries', flag: 'Classic',
      price: 16, weight: '200 g', cook: 'Twice fried', pair: 'Garlic mayo, included',
      short: 'Cut from whole potatoes, fried twice, salted with sea salt.',
      blurb: 'Done the long way: a first fry at low temperature, a rest, then a hard second fry. Fluffy through the middle, audibly crisp at the edge.',
      parts: ['Whole potatoes', 'Sea salt', 'Garlic mayo included'],
      art: 'art-side',
      paint: { '--art-veg': '#eab53f', '--art-basket': '#9aa2ab' }
    },
    {
      id: 'sweet-fries', course: 'sides', name: 'Sweet Potato Fries', flag: 'Veggie',
      price: 19, weight: '200 g', cook: 'Twice fried', pair: 'Chipotle mayo',
      short: 'Smoked paprika, chipotle mayo, a little sweeter than they look.',
      blurb: 'Sweeter, heavily seasoned, and the right answer to anything spicy on the card. Comes with chipotle mayo, though you can swap the sauce.',
      parts: ['Sweet potato', 'Smoked paprika', 'Chipotle mayo'],
      art: 'art-side',
      paint: { '--art-veg': '#e08234', '--art-basket': '#9aa2ab' }
    },
    {
      id: 'tartare', course: 'sides', name: 'Beef Tartare', flag: 'Recommended',
      price: 46, weight: '150 g', cook: 'Raw, hand cut', pair: 'Cold vodka',
      short: 'Hand-cut tenderloin, pickle, onion and an egg yolk.',
      blurb: 'Cut to order with a knife, never minced — that is the whole difference. Served with sourdough toast and the classic set of trimmings on the side, so you build it how you like it.',
      parts: ['Beef tenderloin', 'Dill pickle', 'Onion', 'Egg yolk', 'Sourdough toast'],
      art: 'art-side',
      paint: { '--art-veg': '#b8433a', '--art-basket': '#8c8f95' }
    },

    /* ── Dessert ───────────────────────────────────────────────────── */
    {
      id: 'brulee', course: 'sweet', name: 'Crème Brûlée', flag: 'Dessert',
      price: 24, weight: '150 g', cook: 'Torched to order', pair: 'Espresso',
      short: 'Madagascar vanilla under a lid of burnt sugar.',
      blurb: 'We fire the sugar the moment it leaves the pass, so it is still working when it reaches you. Underneath: cold, dense, properly vanilla-heavy custard.',
      parts: ['Cream', 'Bourbon vanilla', 'Egg yolk', 'Burnt sugar', 'Raspberries'],
      art: 'art-dessert',
      paint: { '--art-patty': '#f7f0dd', '--art-cheese': '#c98a2e', '--art-veg': '#b8324a' }
    },

    /* ── Drinks ────────────────────────────────────────────────────── */
    {
      id: 'ipa', course: 'drinks', name: "Let's Meat IPA", flag: 'Our own label',
      price: 22, weight: '500 ml', cook: '6.2% American IPA', pair: 'Everything on this page',
      short: 'An American IPA brewed for us by Harpagan, in Wrocław.',
      blurb: 'Resinous bitterness and citrus hop, which is exactly what a fatty burger needs pushing back against it. Brewed in small batches under our own label.',
      parts: ['Citra hops', 'Simcoe hops', '6.2% ABV', 'Brewed in Wrocław'],
      art: 'art-drink',
      paint: { '--art-patty': '#a8641f', '--art-liquid': '#e0a33c', '--art-label': '#f3ece0', '--art-ink': '#8a1f1c', '--art-cap': '#6f4415' }
    },
    {
      id: 'lemonade', course: 'drinks', name: 'House Lemonade', flag: 'No alcohol',
      price: 16, weight: '400 ml', cook: 'Pressed to order', pair: 'The hot burgers',
      short: 'Lemon, mint, our own syrup — refills are on us.',
      blurb: 'Pressed at the bar, sweetened with cane syrup and chilled with frozen fruit instead of ice, so it is still lemonade halfway down the glass.',
      parts: ['Fresh lemon', 'Mint', 'Cane syrup', 'Sparkling water'],
      art: 'art-drink',
      paint: { '--art-patty': '#cbb43c', '--art-liquid': '#e8dc59', '--art-label': '#f6f2e2', '--art-ink': '#5f7f39', '--art-cap': '#8f7d1f' }
    },
    {
      id: 'espresso', course: 'drinks', name: 'Espresso', flag: 'Coffee',
      price: 9, weight: '30 ml', cook: 'Short extraction', pair: 'The brûlée',
      short: 'Polish-roasted arabica with a dark chocolate finish.',
      blurb: 'A blend roasted for our machine and pulled short. Thick crema, chocolate rather than fruit. Double shot for four złoty more.',
      parts: ['100% arabica', 'Ground to order', 'Double shot +4 zł'],
      art: 'art-drink',
      paint: { '--art-patty': '#4a3126', '--art-liquid': '#5b3a24', '--art-label': '#efe4d2', '--art-ink': '#3a2318', '--art-cap': '#2f1d12' }
    }
  ]
};
