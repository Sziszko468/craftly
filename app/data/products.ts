import type { Product, ProductCategory, Creator } from '~/types'

// ============================================================
// Categories
// ============================================================

export const CATEGORIES: ProductCategory[] = [
  { id: '1', slug: 'jewelry',    icon: '💎', label: { en: 'Jewelry',   nl: 'Sieraden'  } },
  { id: '2', slug: 'ceramics',   icon: '🏺', label: { en: 'Ceramics',  nl: 'Keramiek'  } },
  { id: '3', slug: 'textiles',   icon: '🧵', label: { en: 'Textiles',  nl: 'Textiel'   } },
  { id: '4', slug: 'art-prints', icon: '🖼️', label: { en: 'Art Prints',nl: 'Kunstprint' } },
  { id: '5', slug: 'woodwork',   icon: '🪵', label: { en: 'Woodwork',  nl: 'Houtwerk'  } },
  { id: '6', slug: 'candles',    icon: '🕯️', label: { en: 'Candles',   nl: 'Kaarsen'   } },
]

// ============================================================
// Creators
// ============================================================

export const CREATORS: Creator[] = [
  {
    id: 'c1',
    name: 'Mira Szabó',
    avatar: 'https://i.pravatar.cc/150?img=47',
    bio: {
      en: 'Ceramic artist from Budapest. Every piece is wheel-thrown and wood-fired.',
      nl: 'Keramiekkunstenaar uit Boedapest. Elk stuk is gedraaid en houtgestookt.',
    },
    location: 'Budapest, HU',
    rating: 4.9,
    totalSales: 1240,
    joinedYear: 2019,
    verified: true,
  },
  {
    id: 'c2',
    name: 'Léa Moreau',
    avatar: 'https://i.pravatar.cc/150?img=48',
    bio: {
      en: 'Jewelry maker working with recycled silver and natural stones.',
      nl: 'Sieradenmaker die werkt met gerecycled zilver en natuurlijke stenen.',
    },
    location: 'Lyon, FR',
    rating: 4.8,
    totalSales: 872,
    joinedYear: 2020,
    verified: true,
  },
  {
    id: 'c3',
    name: 'Jonas Berg',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: {
      en: 'Woodworker and furniture designer. Slow craft, lasting pieces.',
      nl: 'Houtbewerker en meubelontwerper. Langzaam vakmanschap, blijvende stukken.',
    },
    location: 'Stockholm, SE',
    rating: 4.95,
    totalSales: 430,
    joinedYear: 2021,
    verified: false,
  },
  {
    id: 'c4',
    name: 'Amara Diallo',
    avatar: 'https://i.pravatar.cc/150?img=45',
    bio: {
      en: 'Textile artist inspired by West African weaving traditions.',
      nl: 'Textielkunstenaar geïnspireerd door West-Afrikaanse weeftradities.',
    },
    location: 'Dakar, SN',
    rating: 4.7,
    totalSales: 650,
    joinedYear: 2022,
    verified: true,
  },
]

// ============================================================
// Products
// ============================================================

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    slug: 'stoneware-mug-ash-glaze',
    title: {
      en: 'Stoneware Mug – Ash Glaze',
      nl: 'Steengoed Mok – As Glazuur',
    },
    description: {
      en: 'A hand-thrown stoneware mug with a subtle ash glaze. Perfect for morning rituals.',
      nl: 'Een met de hand gedraaide steengoed mok met een subtiel as glazuur. Perfect voor ochtendrituelen.',
    },
    longDescription: {
      en: 'Each mug is individually wheel-thrown in my Budapest studio using high-fire stoneware clay. The ash glaze creates unique, unrepeatable surface variations — no two are exactly alike. Microwave and dishwasher safe. Holds 280ml.',
      nl: 'Elke mok wordt individueel gedraaid in mijn studio in Boedapest met hooggestookt steengoedklei. Het as glazuur zorgt voor unieke, niet te herhalen oppervlaktevariaties. Magnetron- en vaatwasserbestendig. Inhoud 280ml.',
    },
    price: 38,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
    ],
    category: CATEGORIES[1],
    creator: CREATORS[0],
    condition: 'handmade',
    tags: [{ id: 't1', label: 'mug' }, { id: 't2', label: 'ceramic' }, { id: 't3', label: 'kitchen' }],
    rating: 4.9,
    reviewCount: 87,
    reviews: [
      { id: 'r1', authorName: 'Sophie K.', authorAvatar: 'https://i.pravatar.cc/40?img=5',  rating: 5, comment: 'Absolutely beautiful. The glaze is mesmerizing.', date: '2024-11-02' },
      { id: 'r2', authorName: 'Tom R.',    authorAvatar: 'https://i.pravatar.cc/40?img=6',  rating: 5, comment: 'Great weight, feels premium. A joy to use daily.', date: '2024-10-14' },
    ],
    stock: 4,
    isFeatured: true,
    createdAt: '2024-09-01',
  },
  {
    id: 'p2',
    slug: 'recycled-silver-ring',
    title: {
      en: 'Recycled Silver Ring – Stone Setting',
      nl: 'Gerecycled Zilveren Ring – Steenzetting',
    },
    description: {
      en: 'Minimalist ring in recycled sterling silver with a labradorite cabochon.',
      nl: 'Minimalistische ring in gerecycled sterling zilver met een labradoriet cabochon.',
    },
    longDescription: {
      en: 'Hand-fabricated from 100% recycled sterling silver. The labradorite stone is ethically sourced and set in a bezel of my own design. Available in sizes 48–60.',
      nl: 'Met de hand vervaardigd uit 100% gerecycled sterling zilver. De labradoriet steen is ethisch gewonnen en gezet in een door mij ontworpen rand. Beschikbaar in maten 48–60.',
    },
    price: 72,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    ],
    category: CATEGORIES[0],
    creator: CREATORS[1],
    condition: 'handmade',
    tags: [{ id: 't4', label: 'ring' }, { id: 't5', label: 'silver' }, { id: 't6', label: 'labradorite' }],
    rating: 4.8,
    reviewCount: 54,
    reviews: [
      { id: 'r3', authorName: 'Anna M.', authorAvatar: 'https://i.pravatar.cc/40?img=9', rating: 5, comment: 'Stunning piece. Gets compliments every time I wear it.', date: '2024-12-01' },
    ],
    stock: 2,
    isFeatured: true,
    createdAt: '2024-10-12',
  },
  {
    id: 'p3',
    slug: 'oak-serving-board',
    title: {
      en: 'Live-Edge Oak Serving Board',
      nl: 'Eiken Serveerplank met Natuurlijke Rand',
    },
    description: {
      en: 'A generous serving board in live-edge white oak, finished with linseed oil.',
      nl: 'Een royale serveerplank in witte eik met natuurlijke rand, afgewerkt met lijnolie.',
    },
    longDescription: {
      en: 'Milled from sustainably sourced white oak in my Stockholm workshop. Each board retains the natural live edge of the tree. Finished with raw linseed oil — food safe and easy to maintain. Dimensions approx. 45 × 22 cm.',
      nl: 'Gefreesd uit duurzaam gewonnen witte eik in mijn Stockholm atelier. Elke plank behoudt de natuurlijke rand van de boom. Afgewerkt met rauwe lijnolie — voedselveilig en gemakkelijk te onderhouden. Afmetingen ca. 45 × 22 cm.',
    },
    price: 95,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    ],
    category: CATEGORIES[4],
    creator: CREATORS[2],
    condition: 'handmade',
    tags: [{ id: 't7', label: 'wood' }, { id: 't8', label: 'kitchen' }, { id: 't9', label: 'oak' }],
    rating: 4.95,
    reviewCount: 31,
    reviews: [
      { id: 'r4', authorName: 'Erik L.', authorAvatar: 'https://i.pravatar.cc/40?img=15', rating: 5, comment: 'The grain is extraordinary. Worth every cent.', date: '2025-01-05' },
    ],
    stock: 3,
    isFeatured: false,
    createdAt: '2024-11-20',
  },
  {
    id: 'p4',
    slug: 'woven-wall-hanging',
    title: {
      en: 'Woven Wall Hanging – Indigo & Cream',
      nl: 'Geweven Wanddecoratie – Indigo & Crème',
    },
    description: {
      en: 'Hand-woven wall piece using natural cotton and indigo-dyed yarn.',
      nl: 'Met de hand geweven wandstuk van natuurlijk katoen en indigo geverfd garen.',
    },
    longDescription: {
      en: 'Woven on a traditional frame loom using 100% natural cotton. The indigo dye is plant-based. Includes a hand-carved driftwood hanging rod. 60 × 40 cm.',
      nl: 'Geweven op een traditioneel raamgetouw met 100% natuurlijk katoen. De indigoverf is plantaardig. Inclusief een met de hand gesneden drijfhout ophangstok. 60 × 40 cm.',
    },
    price: 120,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1596079890744-c1a0462d0975?w=800&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    ],
    category: CATEGORIES[2],
    creator: CREATORS[3],
    condition: 'handmade',
    tags: [{ id: 't10', label: 'weaving' }, { id: 't11', label: 'indigo' }, { id: 't12', label: 'wall-art' }],
    rating: 4.7,
    reviewCount: 22,
    reviews: [],
    stock: 1,
    isFeatured: true,
    createdAt: '2025-01-10',
  },
  {
    id: 'p5',
    slug: 'botanical-soy-candle',
    title: {
      en: 'Botanical Soy Candle – Forest',
      nl: 'Botanische Soja Kaars – Bos',
    },
    description: {
      en: 'Hand-poured soy candle with pine, cedarwood and vetiver notes.',
      nl: 'Met de hand gegoten sojakaars met noten van den, cederhout en vetiver.',
    },
    longDescription: {
      en: 'Made with 100% natural soy wax and a cotton wick. Scented with pine needle, cedarwood, and vetiver essential oils. Burns for 45–50 hours. 200g in a reusable amber glass jar.',
      nl: 'Gemaakt met 100% natuurlijke sojaswas en een katoenen lont. Geparfumeerd met dennenaald, cederhout en vetiver etherische oliën. Brandtijd 45–50 uur. 200g in een herbruikbare amberkleurige glazen pot.',
    },
    price: 28,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80',
      'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=800&q=80',
    ],
    category: CATEGORIES[5],
    creator: CREATORS[0],
    condition: 'handmade',
    tags: [{ id: 't13', label: 'candle' }, { id: 't14', label: 'soy' }, { id: 't15', label: 'scent' }],
    rating: 4.85,
    reviewCount: 103,
    reviews: [
      { id: 'r5', authorName: 'Clara B.', authorAvatar: 'https://i.pravatar.cc/40?img=20', rating: 5, comment: 'My favourite candle ever. The scent is perfectly balanced.', date: '2025-01-22' },
    ],
    stock: 12,
    isFeatured: false,
    createdAt: '2024-08-05',
  },
  {
    id: 'p6',
    slug: 'linen-tote-bag',
    title: {
      en: 'Natural Linen Tote Bag',
      nl: 'Natuurlijke Linnen Draagtas',
    },
    description: {
      en: 'Sturdy tote in undyed French linen with leather handles.',
      nl: 'Stevige tas van ongebleekt Frans linnen met leren hengsels.',
    },
    longDescription: {
      en: 'Sewn by hand using 300gsm undyed French linen. Reinforced leather handles with brass rivets. Internal slip pocket. 40 × 35 cm, holds up to 12kg.',
      nl: 'Met de hand genaaid van 300gsm ongebleekt Frans linnen. Versterkte leren hengsels met messing klinknagels. Interne steekzak. 40 × 35 cm, draagkracht tot 12kg.',
    },
    price: 58,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    ],
    category: CATEGORIES[2],
    creator: CREATORS[3],
    condition: 'handmade',
    tags: [{ id: 't19', label: 'linen' }, { id: 't20', label: 'tote' }, { id: 't21', label: 'bag' }],
    rating: 4.75,
    reviewCount: 41,
    reviews: [],
    stock: 6,
    isFeatured: true,
    createdAt: '2024-12-01',
  },
  {
    id: 'p7',
    slug: 'terracotta-planter-set',
    title: {
      en: 'Terracotta Planter Set – 3 Sizes',
      nl: 'Terracotta Plantenpot Set – 3 Maten',
    },
    description: {
      en: 'Wheel-thrown terracotta planters with drainage holes, set of 3.',
      nl: 'Gedraaide terracotta plantenpotten met afvoergaten, set van 3.',
    },
    longDescription: {
      en: 'A set of three graduated planters in earthy terracotta clay, left unglazed on the outside. Glazed inside for water retention. Heights: 8cm, 12cm, 16cm.',
      nl: 'Een set van drie oplopende plantenpotten in aardse terracottaklei, aan de buitenkant ongeglazuurd. Aan de binnenkant geglazuurd voor waterretentie. Hoogtes: 8cm, 12cm, 16cm.',
    },
    price: 55,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80',
    ],
    category: CATEGORIES[1],
    creator: CREATORS[0],
    condition: 'handmade',
    tags: [{ id: 't22', label: 'planter' }, { id: 't23', label: 'terracotta' }, { id: 't24', label: 'plants' }],
    rating: 4.8,
    reviewCount: 59,
    reviews: [],
    stock: 5,
    isFeatured: false,
    createdAt: '2024-07-15',
  },
  {
    id: 'p8',
    slug: 'risograph-print-cityscape',
    title: {
      en: 'Risograph Print – City Rooftops',
      nl: 'Risograph Print – Stadssilhouet',
    },
    description: {
      en: 'Two-colour risograph art print, signed and numbered edition of 50.',
      nl: 'Tweekleurige risograph kunstprint, gesigneerd en genummerd, oplage 50.',
    },
    longDescription: {
      en: 'Hand-printed on a Risograph machine in two runs: fluorescent pink and teal. A4 on 120gsm recycled paper. Signed and numbered. Ships rolled in a protective tube.',
      nl: 'Met de hand gedrukt op een Risograph machine in twee lagen: fluorrood en petrol. A4 op 120gsm gerecycled papier. Gesigneerd en genummerd. Verzonden opgerold in een beschermende koker.',
    },
    price: 45,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    ],
    category: CATEGORIES[3],
    creator: CREATORS[0],
    condition: 'handmade',
    tags: [{ id: 't16', label: 'print' }, { id: 't17', label: 'riso' }, { id: 't18', label: 'art' }],
    rating: 4.6,
    reviewCount: 18,
    reviews: [],
    stock: 7,
    isFeatured: false,
    createdAt: '2025-01-30',
  },
]