// Reusable category -> product image mapping.
//
// Every category maps to a pool of verified, thematically correct Unsplash
// photo IDs (real product photography, never landscapes/animals/placeholders).
// This is the single source of truth for "what does a product in category X
// look like" — used by the seed script (to set Category.imageUrl and as a
// fallback for products) and by product creation at runtime, so any product
// added later through the app also gets a correct image automatically.
const CATEGORY_IMAGE_POOLS = {
  'Air Conditioners': ['1759772238012-9d5ad59ae637', '1718203862467-c33159fdc504'],
  Badminton: ['1521537634581-0dced2fee2ef'],
  Bags: ['1548036328-c9fa89d128fa', '1584917865442-de89df76afd3'],
  Cameras: ['1516035069371-29a1b244cc32', '1502920917128-1aa500764cbd'],
  Cookware: ['1544233726-9f1d2b27be8b'],
  'Cricket Equipment': ['1531415074968-036ba1b575da'],
  Dresses: ['1595777457583-95e059d581b8', '1550639525-c97d455acf70'],
  Earbuds: ['1590658268037-6bf12165a8df', '1585386959984-a4155224a1ad', '1608156639585-b3a032ef9689', '1610438235354-a6ae5528385c'],
  'Face Wash': ['1556228720-195a672e8a03', '1571781926291-c477ebfd024b'],
  Football: ['1614632537197-38a17061c2bd'],
  'Gaming Consoles': ['1606813907291-d86efa9b94db', '1587202372634-32705e3bf49c', '1592840062661-a5a7f78e2056'],
  'Hair Dryer': ['1727364438136-6edc10ef0a52'],
  Headphones: ['1505740420928-5e560c06d30e', '1546435770-a3e426bf472b', '1583394838336-acd977736f90', '1484704849700-f032a568e944', '1524678606370-a47ad25cb82a', '1487215078519-e21cc028cb29'],
  Hoodies: ['1556821840-3a63f95609a7'],
  Jackets: ['1551028719-00167b16eac5'],
  Jeans: ['1541099649105-f69ad21f3246'],
  Kurtis: ['1610030469983-98e550d6193c'],
  Laptops: ['1496181133206-80ce9b88a853', '1531297484001-80022131f5a1', '1541807084-5c52b6b3adef', '1517336714731-489689fd1ca8', '1515343480029-43cdfe6b6aae', '1588872657578-7efd1f1555ed', '1498050108023-c5249f4df085', '1484788984921-03950022c9ef'],
  Lipstick: ['1586495777744-4413f21062fa'],
  Makeup: ['1512496015851-a90fb38ba796'],
  'Microwave Ovens': ['1585659722983-3a675dabf23d', '1626143508000-4b5904e5e84a'],
  Mobiles: ['1592750475338-74b7b21085ab', '1598327105666-5b89351aff97', '1695048133142-1a20484d2569', '1678652197831-2d180705cd2c', '1611472173362-3f53dbd65d80', '1511707171634-5f897ff02aa9', '1580910051074-3eb694886505', '1567581935884-3349723552ca', '1533228100845-08145b01de14', '1605236453806-6ff36851218e', '1616348436168-de43ad0db179', '1601972599720-36938d4ecd31', '1546027658-7aa750153465', '1526406915894-7bcd65f60845', '1517430816045-df4b7de11d1d', '1585060544812-6b45742d762f'],
  Monitors: ['1527443224154-c4a3942d3acf', '1593642702821-c8da6771f0c6'],
  Pants: ['1475178626620-a4d074967452'],
  Perfume: ['1541643600914-78b084683601', '1592945403244-b3fbafd7f539'],
  Refrigerators: ['1584568694244-14fbdf83bd30', '1721563927724-74b1a0ddef33'],
  Shampoo: ['1608248543803-ba4f8c70ae0b', '1590439471364-192aa70c0b53'],
  Shirts: ['1596755094514-f87e34085b2c'],
  Shoes: ['1542291026-7eec264c27ff', '1560769629-975ec94e6a86'],
  Shorts: ['1591195853828-11db59a44f6b'],
  'Smart TVs': ['1593359677879-a4bb92f829d1', '1461151304267-38535e780c79'],
  'Smart Watches': ['1508685096489-7aacd43bd3b1', '1544117519-31a4b719223d', '1523275335684-37898b6baf30', '1434493789847-2f02dc6ca35d', '1523170335258-f5ed11844a49', '1579586337278-3befd40fd17a'],
  Sneakers: ['1549298916-b41d501d3772', '1595950653106-6c9ebd614d3a', '1606107557195-0e29a4b5b4aa', '1600185365483-26d7a4cc7519'],
  Speakers: ['1608043152269-423dbba4e7e1', '1545454675-3531b543be5d', '1516876437184-593fda40c7ce'],
  Sunglasses: ['1572635196237-14b3f281503f', '1511499767150-a48a237f0083'],
  Sunscreen: ['1620916566398-39f1143ab7be'],
  'T-Shirts': ['1521572163474-6864f9cf17ab', '1503341504253-dff4815485f1', '1620799140408-edc6dcb6d633', '1583743814966-8936f5b7be1a', '1554568218-0f1715e72254'],
  Tablets: ['1544244015-0df4b3ffc6b0', '1561154464-82e9adf32764', '1587033411391-5d9e51cce126', '1587614382346-4ec70e388b28', '1611532736597-de2d4265fba3', '1526498460520-4c246339dccb', '1623126908029-58cb08a2b272'],
  Trimmer: ['1621607512214-68297480165e'],
  'Vacuum Cleaner': ['1722710070534-e31f0290d8de'],
  Wallets: ['1627123424574-724758594e93'],
  'Washing Machines': ['1626806787461-102c1bfaaea1', '1604335399105-a0c585fd81a1'],
  Watches: ['1524805444758-089113d48a6d', '1509048191080-d2984bad6ae5', '1547996160-81dfa63595aa']
};

// Used only when a product's category has no pool above (e.g. an
// uncategorized product, or a brand-new category not yet mapped).
const DEFAULT_POOL = ['1441986300917-64674bd600d8'];

// fit=max bounds the image within size x size WITHOUT server-side cropping,
// so no part of the product photo is ever cut off (paired with object-contain
// on the frontend); auto=format lets the CDN serve WebP/AVIF where supported
// for faster loads.
const unsplashUrl = (id, size = 400) => `https://images.unsplash.com/photo-${id}?w=${size}&h=${size}&fit=max&q=80&auto=format`;

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = value.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
};

/** Returns the full verified image-id pool for a category name, or the default pool if unmapped. */
export const getCategoryImagePool = (categoryName) => CATEGORY_IMAGE_POOLS[categoryName] || DEFAULT_POOL;

/**
 * Deterministically picks one image URL for a category, spread across that
 * category's pool via `seed` (e.g. a product title or id) so repeated calls
 * for the same product are stable, and different products in the same
 * category get different images instead of all repeating the same one.
 */
export const getCategoryImage = (categoryName, seed = categoryName, size = 400) => {
  const pool = getCategoryImagePool(categoryName);
  const index = hashString(String(seed)) % pool.length;
  return unsplashUrl(pool[index], size);
};

export const CATEGORY_NAMES = Object.keys(CATEGORY_IMAGE_POOLS);
