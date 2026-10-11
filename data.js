/* ============ Crumb & Co. — product data (no backend) ============ */
const u = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
const P = {
  bread: '1509440159596-0249088772ff', choc: '1578985545062-69928b1d9587', croi: '1555507036-ab1f4038808a',
  maca: '1558961363-fa8fdf82db35', donut: '1551024601-bec78aea704b', cup: '1486427944299-d1955d23e34d',
  cook: '1499636136210-6f4ee915583e', pink: '1464349095431-e9a21285b5f3', cake1: '1565958011703-44f9829ba187',
  slice: '1488477181946-6428a0291777', past: '1517433670267-08bbd4be890f', cake2: '1621303837174-89787a7d4729',
  bake: '1495147466023-ac5c588e2e94', brown: '1606313564200-e75d5e30476c', loaf: '1559620192-032c4bc4674e',
  cake3: '1535920527002-b35e96722eb9', cake4: '1542826438-bd32f43d626f', cake5: '1563729784474-d77dbb933a9e',
  cake6: '1571115177098-24ec42ed204d', cake7: '1557925923-cd4648e211a0'
};
const I = (k, w) => u(P[k], w);

const ITEMS = [
  /* ---- Signature products (5) ---- */
  { id: 'p1', name: 'Belgian Truffle Cake', cat: 'Signature', price: 899, veg: true, rating: 4.9, img: I('choc'), desc: 'Three layers of dark Belgian chocolate sponge, silky truffle ganache and cocoa dust.' },
  { id: 'p2', name: 'Butter Croissant', cat: 'Viennoiserie', price: 129, veg: true, rating: 4.8, img: I('croi'), desc: '27 hand-laminated layers of French butter, baked golden every dawn.' },
  { id: 'p3', name: 'Rose Pistachio Macarons', cat: 'Patisserie', price: 649, veg: true, rating: 4.9, img: I('maca'), desc: 'A gift box of 12 delicate shells with rose cream and Sicilian pistachio.' },
  { id: 'p4', name: 'Glazed Donut Box', cat: 'Donuts', price: 399, veg: true, rating: 4.7, img: I('donut'), desc: 'Six pillowy brioche donuts with vanilla, caramel and berry glazes.' },
  { id: 'p5', name: 'Artisan Sourdough', cat: 'Breads', price: 249, veg: true, rating: 4.8, img: I('bread'), desc: '48-hour fermented loaf with a crackling crust and tender, tangy crumb.' },

  /* ---- Collection 1: Morning Bakes ---- */
  { id: 'm1', name: 'Almond Croissant', cat: 'Morning Bakes', price: 159, veg: true, rating: 4.8, img: I('past'), desc: 'Twice-baked with frangipane and toasted almond flakes.' },
  { id: 'm2', name: 'Cinnamon Roll', cat: 'Morning Bakes', price: 149, veg: true, rating: 4.7, img: I('bake'), desc: 'Soft swirls with brown sugar, cinnamon and cream cheese icing.' },
  { id: 'm3', name: 'Blueberry Muffin', cat: 'Morning Bakes', price: 119, veg: true, rating: 4.6, img: I('cup'), desc: 'Bursting with wild blueberries under a crunchy sugar crown.' },
  { id: 'm4', name: 'Rosemary Focaccia', cat: 'Morning Bakes', price: 199, veg: true, rating: 4.7, img: I('loaf'), desc: 'Olive-oil rich, dimpled and finished with sea salt and rosemary.' },

  /* ---- Collection 2: Sweet Treats ---- */
  { id: 's1', name: 'Choco Chip Cookies', cat: 'Sweet Treats', price: 199, veg: true, rating: 4.8, img: I('cook'), desc: 'Chewy centres, crisp edges and molten Belgian chocolate chunks.' },
  { id: 's2', name: 'Fudge Brownie', cat: 'Sweet Treats', price: 179, veg: true, rating: 4.9, img: I('brown'), desc: 'Dense, glossy and deeply chocolatey with toasted walnuts.' },
  { id: 's3', name: 'Vanilla Cupcakes (4)', cat: 'Sweet Treats', price: 329, veg: true, rating: 4.7, img: I('cup'), desc: 'Madagascar vanilla sponge topped with whipped buttercream swirls.' },
  { id: 's4', name: 'Lemon Tart', cat: 'Sweet Treats', price: 189, veg: true, rating: 4.6, img: I('past'), desc: 'Zesty lemon curd in a buttery shortcrust shell.' },

  /* ---- Collection 3: Tea-Time Delights ---- */
  { id: 't1', name: 'Classic Tiramisu Cup', cat: 'Tea-Time', price: 229, veg: false, rating: 4.9, img: I('slice'), desc: 'Espresso-soaked savoiardi layered with mascarpone cream.' },
  { id: 't2', name: 'Fresh Fruit Tart', cat: 'Tea-Time', price: 219, veg: true, rating: 4.7, img: I('pink'), desc: 'Vanilla custard and seasonal fruits on a crisp almond base.' },
  { id: 't3', name: 'Chocolate Eclair', cat: 'Tea-Time', price: 139, veg: true, rating: 4.6, img: I('bake'), desc: 'Choux pastry filled with pastry cream and glazed in dark chocolate.' },
  { id: 't4', name: 'French Baguette', cat: 'Tea-Time', price: 99, veg: true, rating: 4.5, img: I('loaf'), desc: 'Long, crackly and airy, baked fresh through the day.' },

  /* ---- Special Cakes (10) ---- */
  { id: 'c1', name: 'Black Forest Cake', cat: 'Cakes', price: 749, veg: true, rating: 4.8, img: I('cake1'), desc: 'Eggless cherry and chocolate cream cake.' },
  { id: 'c2', name: 'Red Velvet Cake', cat: 'Cakes', price: 849, veg: false, rating: 4.9, img: I('pink'), desc: 'Velvety crimson sponge with cream cheese frosting.' },
  { id: 'c3', name: 'New York Cheesecake', cat: 'Cakes', price: 799, veg: true, rating: 4.8, img: I('slice'), desc: 'Baked, creamy and set on a buttery biscuit base.' },
  { id: 'c4', name: 'Butterscotch Crunch', cat: 'Cakes', price: 699, veg: true, rating: 4.6, img: I('cake2'), desc: 'Caramel praline crunch over soft butterscotch cream.' },
  { id: 'c5', name: 'Dark Chocolate Ganache', cat: 'Cakes', price: 999, veg: false, rating: 4.9, img: I('choc'), desc: 'Rich 70% cocoa sponge enrobed in glossy ganache.' },
  { id: 'c6', name: 'Pineapple Delight', cat: 'Cakes', price: 649, veg: true, rating: 4.5, img: I('cake3'), desc: 'Light vanilla sponge with fresh pineapple and cream.' },
  { id: 'c7', name: 'Strawberry Blush', cat: 'Cakes', price: 799, veg: true, rating: 4.7, img: I('cake4'), desc: 'Strawberry compote and mousse in a pink velvet dome.' },
  { id: 'c8', name: 'Tiramisu Cake', cat: 'Cakes', price: 899, veg: false, rating: 4.8, img: I('cake5'), desc: 'Coffee-kissed layers of mascarpone and cocoa.' },
  { id: 'c9', name: 'Lotus Biscoff Cake', cat: 'Cakes', price: 949, veg: true, rating: 4.9, img: I('cake6'), desc: 'Caramelised biscuit cream with a Biscoff crumb crown.' },
  { id: 'c10', name: 'Royal Fruit Cake', cat: 'Cakes', price: 849, veg: false, rating: 4.6, img: I('cake7'), desc: 'Fresh seasonal fruit, vanilla cream and a mirror glaze.' }
];

const FEATURED = ['p1', 'p2', 'p3', 'p4', 'p5'];

const COLLECTIONS = [
  { name: 'Morning Bakes', tag: 'Warm, flaky and fresh out of the oven — made for your first coffee.', img: I('bake', 900), ids: ['m1', 'm2', 'm3', 'm4'] },
  { name: 'Sweet Treats', tag: 'Little indulgences for every craving, from fudgy to fruity.', img: I('brown', 900), ids: ['s1', 's2', 's3', 's4'] },
  { name: 'Tea-Time Delights', tag: 'Elegant bites to share over an unhurried evening cup.', img: I('slice', 900), ids: ['t1', 't2', 't3', 't4'] }
];

const CAKES = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'];

const PROMOS = [
  { big: '₹200 OFF', sub: 'On orders above ₹500', code: 'SWEET200' },
  { big: 'FREE DELIVERY', sub: 'On orders above ₹499', code: 'FREESHIP' },
  { big: 'BUY 1 GET 1', sub: 'On butter croissants, mornings only', code: 'BOGO1' },
  { big: '15% OFF', sub: 'On your very first order', code: 'WELCOME15' },
  { big: 'FREE CUPCAKE', sub: 'With any cake above ₹999', code: 'CAKE999' },
  { big: '₹100 OFF', sub: 'On our Macaron gift boxes', code: 'MACA100' },
  { big: '10% OFF', sub: 'Weekend special on all breads', code: 'WEEKEND10' },
  { big: 'BIRTHDAY TREAT', sub: 'Free candles + message card', code: 'BDAYJOY' }
];

const FAQS = [
  ['How far in advance should I order a cake?', 'Standard cakes need 24 hours. Custom, tiered or photo cakes need 48 to 72 hours so our chefs can craft every detail.'],
  ['Do you offer eggless and vegan options?', 'Yes. Most of our cakes are available eggless, and we bake a small vegan range. Look for the green veg mark on each cake.'],
  ['Can I customise the flavour, size or message?', 'Absolutely. Choose any flavour, size and message in the order notes at checkout and we will take care of the rest.'],
  ['What are your delivery areas and charges?', 'We deliver across the city. Delivery is free above ₹499, otherwise a flat ₹49 applies.'],
  ['Can I schedule delivery for a specific date and time?', 'Yes, pick your preferred date and time slot on the order page. Same-day delivery is available for orders placed before 2 PM.'],
  ['How long do your products stay fresh?', 'Breads stay fresh for 2 days, pastries for 1 to 2 days and cakes for up to 3 days in the refrigerator.'],
  ['Do you take bulk or corporate orders?', 'Yes, we cater to parties, weddings and corporate gifting. Reach out through the contact form for a tailored quote.'],
  ['How should I store my cake?', 'Keep it refrigerated in its box and bring it to room temperature for 20 minutes before serving for the best taste.'],
  ['Do you list allergen information?', 'Our products may contain nuts, gluten, milk and eggs. Tell us about any allergy in the order notes and we will guide you.'],
  ['What is your cancellation policy?', 'Orders can be cancelled up to 12 hours before the delivery time. Custom cakes cannot be cancelled once baking begins.']
];

const CTA_IMAGES = [I('cake2', 1000), I('croi', 1000), I('maca', 1000), I('bread', 1000), I('donut', 1000)];
