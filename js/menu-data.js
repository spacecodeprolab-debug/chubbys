/* ==========================================================================
   MENU DATA  |  js/menu-data.js
   Edit names and prices here. The menu page, order cart, spin feature,
   hero swirl and the search-engine menu data all read from this one list.
   Each item is ['Item name', price in rupees].
   IMPORTANT: the order of categories matters.
     category 0 = Tiramisu tubs       category 3 = Cookies
     category 1 = Churros             category 4 = Milkshakes
     category 2 = Softserve sundae (the hero swirl uses items 0-3, 5 and 6)
   Add new ITEMS anywhere inside a category list. Keep the "Add a soft serve"
   and "Cookie box of ..." names exactly as written, the upsell finds them by name.
   ========================================================================== */

const M = [
  {
    t: "Tiramisu tubs",
    d: "Creamy mascarpone layered with indulgent flavours, soft sponge and signature tiramisu richness.",
    i: [
      ["Classic Tiramisu Tub", 350],
      ["Espresso Intenso Tiramisu Tub", 350],
      ["Very Berry Tiramisu Tub", 400],
      ["Nutella Tiramisu Tub", 450],
      ["Biscoff Caramel Tiramisu Tub", 450],
      ["Pistachio Cream Tiramisu Tub", 450],
    ],
  },
  {
    t: "Spanish churros",
    d: "Crunchy textures, soft centres and irresistible dipping. Dips: dark, white or milk chocolate, Nutella, pistachio, Biscoff.",
    i: [
      ["Stick Churros with Dip", 125],
      ["Stick Churros, box of 2", 220],
      ["Mix and Match Sundae", 175],
      ["Add a soft serve", 30],
    ],
  },
  {
    t: "Softserve sundae",
    d: "Silky soft serve swirled fresh, with exciting flavour variations.",
    i: [
      ["Vanilla", 75],
      ["Chocolate", 75],
      ["Choco Vanilla", 75],
      ["Nutella", 150],
      ["Cookie Monster", 150],
      ["Biscoff Crush", 150],
      ["Straw-Bae", 150],
      ["PB&J", 150],
    ],
  },
  {
    t: "NYC style chunky cookies",
    d: "Loaded, chunky cookies with crisp edges, gooey centres and flavourful twists.",
    i: [
      ["OG Choco chunk", 150],
      ["Biscoff’d", 150],
      ["Nutty Pistachio", 150],
      ["Peanut Butter", 150],
      ["Triple Chocolate", 150],
      ["Nutella Lava", 150],
      ["Oreo Dream", 150],
      ["Red Velvet", 150],
      ["Cookie box of 3", 360],
      ["Cookie box of 6", 640],
      ["Add a soft serve", 30],
    ],
  },
  {
    t: "Milkshakes",
    d: "Thick, creamy milkshakes blended with rich ingredients and flavour-packed goodness.",
    i: [
      ["Vanilla Bean", 150],
      ["Classic Chocolate", 150],
      ["PB Smooth", 175],
      ["Strawberry", 175],
      ["Coffee", 175],
      ["Oreo", 175],
      ["Biscoff", 200],
      ["Nutella", 200],
      ["Pistachio", 200],
    ],
  },
];
