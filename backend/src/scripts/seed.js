
import { connectDatabase } from '../config/db.js';
import { Product } from '../models/product.model.js';
import { Category } from '../models/category.model.js';
import { Brand } from '../models/brand.model.js';
import { User } from '../models/user.model.js';
import { Store } from '../models/store.model.js';
import { StoreProduct } from '../models/storeProduct.model.js';
import { PriceHistory } from '../models/priceHistory.model.js';
import { Review } from '../models/review.model.js';
import { logger } from '../config/logger.js';
import { getCategoryImage } from '../utils/categoryImages.js';

await connectDatabase();

// Real, verified (HTTP 200) Unsplash photo IDs picked to match each specific
// product/category (e.g. iPhones get iPhone photos, sunscreen gets a sunscreen
// bottle) rather than random or generic placeholder imagery.
const PRODUCT_IMAGE_IDS = {
    'Apple iPhone 15 Pro Max': '1695048133142-1a20484d2569',
    // NOTE: several earlier "generic smartphone" stock photos here turned out to
    // visibly be an iPhone (or, in one case, a camera-gear flatlay with no phone
    // at all) when actually viewed — e.g. OnePlus 12 was showing an iOS home
    // screen with a visible notch. Re-picked and visually verified below so a
    // non-Apple product never shows a recognizable iPhone.
    'Samsung Galaxy S24 Ultra': '1707438095940-1eee18e85400',
    'OnePlus 12': '1600721502738-84bd123c8a99',
    // Second pass: same-brand devices matching that exact model's real design
    // (e.g. Xiaomi's own "xiaomi" wordmark, OnePlus's own logo, Vivo's actual
    // circular-camera flagship design, Nothing's signature transparent back)
    // rather than an unrelated/ambiguous generic phone.
    'Xiaomi 14 Pro': '1656835125181-fc85c0ec92d4',
    'Vivo X100 Pro': '1778854097544-2021ec0ce18b',
    'Apple iPhone 16 Pro Max': '1678652197831-2d180705cd2c',
    'Apple iPhone 16': '1611472173362-3f53dbd65d80',
    'Samsung Galaxy S25 Ultra': '1776437594003-47f3041d43ed',
    'OnePlus 13': '1772683828844-15dca7c553b8',
    'Xiaomi 15 Pro': '1770274813875-346bfaf0ee11',
    'Vivo X200 Pro': '1768141009045-c2b2c780711e',
    'OPPO Find X8 Pro': '1758577675644-076b0ddca611',
    'Realme GT 7 Pro': '1725303599132-972fb9e20228',
    'Motorola Edge 50 Ultra': '1779006405238-9f8aff1dabba',
    'Nothing Phone 3': '1664700650953-62e408a415a4',
    'Google Pixel 9 Pro': '1711027466888-4b09fb9e994f',
    'MacBook Air M3': '1496181133206-80ce9b88a853',
    'MacBook Pro 14 M3 Pro': '1531297484001-80022131f5a1',
    // Same class of bug as the mobiles above: these laptop/tablet/watch photos
    // were showing a MacBook, an iPad, or an Apple Watch for non-Apple products
    // (e.g. HP Spectre showed a MacBook with its glowing Apple logo). Re-picked
    // and visually verified so Windows laptops, Android tablets, and non-Apple
    // watches never show recognizable Apple hardware.
    'Dell XPS 15': '1558864559-ed673ba3610b',
    'HP Spectre x360 14': '1554246247-6993b606e8b9',
    'Lenovo ThinkPad X1 Carbon Gen 11': '1615750173609-2fbf12fd1d2d',
    'Asus ROG Zephyrus G16': '1771014846919-3a1cf73aeea1',
    'Acer Predator Helios Neo 16': '1640955014216-75201056c829',
    'MSI Katana 15': '1652194928910-5bd06fc43435',
    'iPad Pro M4 12.9"': '1526498460520-4c246339dccb',
    'Samsung Galaxy Tab S9 Ultra': '1521159311222-fcd72db9bd8e',
    'iPad Air M2': '1561154464-82e9adf32764',
    'Samsung Galaxy Tab S9 FE': '1758598306174-78795a972fe1',
    'Lenovo Tab P12 Pro': '1624571033882-bf93a56b6b2e',
    'Xiaomi Pad 6 Pro': '1612831455359-970e23a1e4e9',
    'OnePlus Pad Go': '1612831817984-97e394106fff',
    'Apple Watch Ultra 2': '1544117519-31a4b719223d',
    'Samsung Galaxy Watch 6 Classic': '1523275335684-37898b6baf30',
    'Fitbit Charge 6': '1750776100861-30c172651817',
    'Noise ColorFit Pro 5': '1778305595929-38bb37c0c8f6',
    'boAt Lunar Pro': '1722445423163-f57f92ea9f78',
    'Garmin Venu 3': '1750776104271-4f61303e9eeb',
    'Sony WH-1000XM5': '1505740420928-5e560c06d30e',
    'Bose QuietComfort Ultra': '1546435770-a3e426bf472b',
    'JBL Tune 770NC': '1583394838336-acd977736f90',
    'Marshall Major IV': '1484704849700-f032a568e944',
    'Sennheiser Momentum 4': '1524678606370-a47ad25cb82a',
    'boAt Rockerz 450 Pro': '1487215078519-e21cc028cb29',
    'Apple AirPods Pro 2': '1590658268037-6bf12165a8df',
    'Samsung Galaxy Buds2 Pro': '1585386959984-a4155224a1ad',
    'boAt Airdopes 141 Pro': '1608156639585-b3a032ef9689',
    'Realme TechLife Buds T100': '1610438235354-a6ae5528385c',
    'Canon EOS R5': '1516035069371-29a1b244cc32',
    'Sony A7 IV': '1502920917128-1aa500764cbd',
    'Samsung 65" Neo QLED 4K QN90C': '1593359677879-a4bb92f829d1',
    'LG 55" OLED C3': '1461151304267-38535e780c79',
    'Nike Air Max 270 React': '1549298916-b41d501d3772',
    'Adidas Ultraboost 23': '1595950653106-6c9ebd614d3a',
    'Nike Classic Cortez': '1606107557195-0e29a4b5b4aa',
    'Puma Unisex-ADULT Sneakers': '1600185365483-26d7a4cc7519',
    'Ray-Ban Aviator Classic': '1572635196237-14b3f281503f',
    'Fastrack Reflex VOX Sunglasses': '1511499767150-a48a237f0083',
    'Dyson V15 Detect Vacuum': '1722710070534-e31f0290d8de',
    'Instant Pot Duo Plus 6-Qt': '1544233726-9f1d2b27be8b',
    'CRDT Kashmir Willow Cricket Bat': '1531415074968-036ba1b575da',
    'Cosco 5-A-Side Football Size 5': '1614632537197-38a17061c2bd',
    'Yonex Nanoray 7000i Badminton Racket': '1521537634581-0dced2fee2ef',
    'Puma Men Regular Fit T-Shirt': '1521572163474-6864f9cf17ab',
    'Nike Men Dri-FIT T-Shirt': '1503341504253-dff4815485f1',
    'Adidas Men Essential T-Shirt': '1620799140408-edc6dcb6d633',
    'Puma Mens Cotton T-Shirt Pack': '1583743814966-8936f5b7be1a',
    'Puma Women Basic T-Shirt': '1554568218-0f1715e72254',
    'H&M Women Printed Dress': '1595777457583-95e059d581b8',
    'Zara Women Floral Dress': '1550639525-c97d455acf70',
    'Zara Men Slim Fit Blazer': '1551028719-00167b16eac5',
    'Samsung 7.5 kg Front Load Washing Machine': '1626806787461-102c1bfaaea1',
    'LG 7 kg Front Load Washing Machine': '1604335399105-a0c585fd81a1',
    'LG 1.5 Ton 5-Star Split AC': '1759772238012-9d5ad59ae637',
    'Samsung 1.5 Ton 5-Star Inverter AC': '1718203862467-c33159fdc504',
    'Samsung 260L 3-Star Refrigerator': '1584568694244-14fbdf83bd30',
    'Whirlpool 265L Refrigerator': '1721563927724-74b1a0ddef33',
    'LG 32L Solo Microwave Oven': '1585659722983-3a675dabf23d',
    'IFB 25L Convection Microwave': '1626143508000-4b5904e5e84a',
    'JBL Go 4': '1608043152269-423dbba4e7e1',
    'Marshall Emberton III': '1545454675-3531b543be5d',
    'Sony SRS-XB100': '1516876437184-593fda40c7ce',
    'Sony PlayStation 5 Slim': '1606813907291-d86efa9b94db',
    'Xbox Series X': '1587202372634-32705e3bf49c',
    'Nintendo Switch OLED': '1592840062661-a5a7f78e2056',
    'Samsung 32" M8 Smart Monitor': '1527443224154-c4a3942d3acf',
    'LG 27" UltraGear Gaming Monitor': '1593642702821-c8da6771f0c6',
    'H&M Men Slim Fit Shirt': '1596755094514-f87e34085b2c',
    'H&M Women Kurta Set': '1610030469983-98e550d6193c',
    'Nike Mens Dri-FIT Shorts': '1591195853828-11db59a44f6b',
    'Adidas 3-Stripes Pants': '1475178626620-a4d074967452',
    'Puma Mens Hoodie': '1556821840-3a63f95609a7',
    'Adidas Men Running Shoes': '1542291026-7eec264c27ff',
    'WildHorn Casual Shoes': '1560769629-975ec94e6a86',
    'Tommy Hilfiger Men Watch': '1524805444758-089113d48a6d',
    'Fossil Men Gen 6 Watch': '1509048191080-d2984bad6ae5',
    'Titan Women Raga Watch': '1547996160-81dfa63595aa',
    'American Tourister Backpack': '1548036328-c9fa89d128fa',
    'Lavie Women Handbag': '1584917865442-de89df76afd3',
    'Hidesign Men Wallets': '1627123424574-724758594e93',
    'Dove Daily Care Shampoo': '1608248543803-ba4f8c70ae0b',
    "L'Oreal Paris Shampoo": '1590439471364-192aa70c0b53',
    "Levi's 501 Original Fit Jeans": '1541099649105-f69ad21f3246',
    'L\\': '1590439471364-192aa70c0b53',
    'Maybelline Fit Me Foundation': '1512496015851-a90fb38ba796',
    'Lakme Absolute Matte Lipstick': '1586495777744-4413f21062fa',
    'Nivea Sunscreen SPF 50': '1620916566398-39f1143ab7be',
    'Neutrogena Face Wash': '1556228720-195a672e8a03',
    'Garnier Face Wash': '1571781926291-c477ebfd024b',
    'Davidoff Cool Water Perfume': '1541643600914-78b084683601',
    'Park Avenue Perfume': '1592945403244-b3fbafd7f539',
    'Philips Beard Trimmer': '1621607512214-68297480165e',
    'Havells Hair Dryer': '1727364438136-6edc10ef0a52'
};

// fit=max avoids server-side cropping (no important part of the product photo
// is cut off); auto=format serves WebP/AVIF where supported for faster loads.
const unsplash = (id) => `https://images.unsplash.com/photo-${id}?w=400&h=400&fit=max&q=80&auto=format`;

// Known products get their hand-picked exact image above; anything else falls
// back to the reusable category -> image mapping (src/utils/categoryImages.js)
// so every product always gets a correct, category-appropriate photo.
const productImages = (title, categoryName) => {
    const url = PRODUCT_IMAGE_IDS[title] ? unsplash(PRODUCT_IMAGE_IDS[title]) : getCategoryImage(categoryName, title);
    return [{ url, alt: title, sortOrder: 0 }];
};

const defaultImage = getCategoryImage(null, 'default');

async function seed() {
    try {
        // Clear existing data
        await Promise.all([
            Product.deleteMany({}),
            Category.deleteMany({}),
            Brand.deleteMany({}),
            User.deleteMany({}),
            Store.deleteMany({}),
            StoreProduct.deleteMany({}),
            PriceHistory.deleteMany({}),
            Review.deleteMany({})
        ]);

        // ========== CATEGORIES ==========
        // Each category gets a representative imageUrl from the reusable
        // category -> image mapping (src/utils/categoryImages.js), so any
        // category browsing UI can show a correct icon/photo too.
        const categoryDefs = [
            // Electronics
            { name: 'Mobiles', description: 'Latest smartphones and feature phones', sortOrder: 1, isActive: true },
            { name: 'Laptops', description: 'Laptops, notebooks and ultrabooks', sortOrder: 2, isActive: true },
            { name: 'Tablets', description: 'Tablets and iPads', sortOrder: 3, isActive: true },
            { name: 'Smart Watches', description: 'Smartwatches and fitness bands', sortOrder: 4, isActive: true },
            { name: 'Earbuds', description: 'Wireless earbuds', sortOrder: 5, isActive: true },
            { name: 'Headphones', description: 'Over-ear and on-ear headphones', sortOrder: 6, isActive: true },
            { name: 'Speakers', description: 'Bluetooth and smart speakers', sortOrder: 7, isActive: true },
            { name: 'Cameras', description: 'DSLR, mirrorless and action cameras', sortOrder: 8, isActive: true },
            { name: 'Power Banks', description: 'Portable chargers', sortOrder: 9, isActive: true },
            { name: 'Chargers', description: 'Phone and laptop chargers', sortOrder: 10, isActive: true },
            { name: 'Keyboards', description: 'Mechanical and wireless keyboards', sortOrder: 11, isActive: true },
            { name: 'Mouse', description: 'Wired and wireless mice', sortOrder: 12, isActive: true },
            { name: 'Monitors', description: 'Computer monitors and displays', sortOrder: 13, isActive: true },
            { name: 'Printers', description: 'Inkjet and laser printers', sortOrder: 14, isActive: true },
            { name: 'Gaming Consoles', description: 'PS5, Xbox and Nintendo Switch', sortOrder: 15, isActive: true },
            { name: 'SSD', description: 'Solid state drives', sortOrder: 16, isActive: true },
            { name: 'Hard Drives', description: 'External hard drives', sortOrder: 17, isActive: true },
            { name: 'Memory Cards', description: 'SD and microSD cards', sortOrder: 18, isActive: true },
            { name: 'Routers', description: 'WiFi routers and mesh systems', sortOrder: 19, isActive: true },
            { name: 'Smart TVs', description: 'LED, OLED and QLED TVs', sortOrder: 20, isActive: true },
            { name: 'Refrigerators', description: 'Single and double door refrigerators', sortOrder: 21, isActive: true },
            { name: 'Washing Machines', description: 'Front and top load washing machines', sortOrder: 22, isActive: true },
            { name: 'Air Conditioners', description: 'Split and window ACs', sortOrder: 23, isActive: true },
            { name: 'Microwave Ovens', description: 'Solo, grill and convection microwaves', sortOrder: 24, isActive: true },
            // Fashion
            { name: 'Shirts', description: 'Casual and formal shirts', sortOrder: 25, isActive: true },
            { name: 'T-Shirts', description: 'Polo and round neck t-shirts', sortOrder: 26, isActive: true },
            { name: 'Pants', description: 'Trousers and chinos', sortOrder: 27, isActive: true },
            { name: 'Jeans', description: 'Denim jeans for men and women', sortOrder: 28, isActive: true },
            { name: 'Shorts', description: 'Casual shorts', sortOrder: 29, isActive: true },
            { name: 'Hoodies', description: 'Hoodies and sweatshirts', sortOrder: 30, isActive: true },
            { name: 'Jackets', description: 'Winter and bomber jackets', sortOrder: 31, isActive: true },
            { name: 'Dresses', description: 'Women dresses and gowns', sortOrder: 32, isActive: true },
            { name: 'Sarees', description: 'Traditional sarees', sortOrder: 33, isActive: true },
            { name: 'Kurtis', description: 'Women kurtis and tunics', sortOrder: 34, isActive: true },
            { name: 'Shoes', description: 'Casual and formal shoes', sortOrder: 35, isActive: true },
            { name: 'Sneakers', description: 'Sports and lifestyle sneakers', sortOrder: 36, isActive: true },
            { name: 'Sandals', description: 'Float and casual sandals', sortOrder: 37, isActive: true },
            { name: 'Slippers', description: 'Home slippers', sortOrder: 38, isActive: true },
            { name: 'Watches', description: 'Analog and digital watches', sortOrder: 39, isActive: true },
            { name: 'Bags', description: 'Backpacks and handbags', sortOrder: 40, isActive: true },
            { name: 'Wallets', description: 'Men and women wallets', sortOrder: 41, isActive: true },
            { name: 'Sunglasses', description: 'UV protection sunglasses', sortOrder: 42, isActive: true },
            // Beauty & Personal Care
            { name: 'Face Wash', description: 'Face cleansers and washes', sortOrder: 43, isActive: true },
            { name: 'Face Cream', description: 'Moisturizers and face creams', sortOrder: 44, isActive: true },
            { name: 'Sunscreen', description: 'Sunscreen lotions and sprays', sortOrder: 45, isActive: true },
            { name: 'Shampoo', description: 'Hair shampoos', sortOrder: 46, isActive: true },
            { name: 'Conditioner', description: 'Hair conditioners', sortOrder: 47, isActive: true },
            { name: 'Hair Oil', description: 'Hair oils and serums', sortOrder: 48, isActive: true },
            { name: 'Perfume', description: 'Fragrances and perfumes', sortOrder: 49, isActive: true },
            { name: 'Makeup', description: 'Cosmetics and makeup', sortOrder: 50, isActive: true },
            { name: 'Lipstick', description: 'Lip colors and gloss', sortOrder: 51, isActive: true },
            { name: 'Trimmer', description: 'Beard and hair trimmers', sortOrder: 52, isActive: true },
            { name: 'Hair Dryer', description: 'Hair dryers and stylers', sortOrder: 53, isActive: true },
            { name: 'Beard Kit', description: 'Beard grooming kits', sortOrder: 54, isActive: true },
            { name: 'Skin Care Products', description: 'Skin care essentials', sortOrder: 55, isActive: true },
            // Home & Kitchen
            { name: 'Mixer', description: 'Mixer grinders and juicers', sortOrder: 56, isActive: true },
            { name: 'Grinder', description: 'Wet and dry grinders', sortOrder: 57, isActive: true },
            { name: 'Cookware', description: 'Pots, pans and utensils', sortOrder: 58, isActive: true },
            { name: 'Furniture', description: 'Home furniture', sortOrder: 59, isActive: true },
            { name: 'Beds', description: 'Beds and mattresses', sortOrder: 60, isActive: true },
            { name: 'Chairs', description: 'Office and dining chairs', sortOrder: 61, isActive: true },
            { name: 'Dining Table', description: 'Dining tables and sets', sortOrder: 62, isActive: true },
            { name: 'Sofa', description: 'Sofas and sectionals', sortOrder: 63, isActive: true },
            { name: 'Curtains', description: 'Window curtains', sortOrder: 64, isActive: true },
            { name: 'Water Purifier', description: 'Water filters and purifiers', sortOrder: 65, isActive: true },
            { name: 'Vacuum Cleaner', description: 'Vacuum cleaners', sortOrder: 66, isActive: true },
            { name: 'Iron Box', description: 'Clothes irons', sortOrder: 67, isActive: true },
            { name: 'Gas Stove', description: 'Gas stoves and burners', sortOrder: 68, isActive: true },
            // Books
            { name: 'Engineering Books', description: 'Engineering textbooks', sortOrder: 69, isActive: true },
            { name: 'Programming Books', description: 'Computer programming books', sortOrder: 70, isActive: true },
            { name: 'Competitive Exam Books', description: 'Exam preparation books', sortOrder: 71, isActive: true },
            { name: 'Story Books', description: 'Fiction and non-fiction', sortOrder: 72, isActive: true },
            // Sports
            { name: 'Cricket Equipment', description: 'Cricket bats, balls and gear', sortOrder: 73, isActive: true },
            { name: 'Football', description: 'Football and accessories', sortOrder: 74, isActive: true },
            { name: 'Badminton', description: 'Badminton rackets and shuttlecocks', sortOrder: 75, isActive: true },
            { name: 'Gym Equipment', description: 'Dumbbells, yoga mats and gym gear', sortOrder: 76, isActive: true }
        ];
        const categories = await Category.insertMany(
            categoryDefs.map((cat) => ({ ...cat, imageUrl: getCategoryImage(cat.name, cat.name) }))
        );

        const catMap = Object.fromEntries(categories.map(c => [c.name, c._id]));

        // ========== BRANDS ==========
        const brands = await Brand.insertMany([
            { name: 'Apple', description: 'Premium consumer electronics', isFeatured: true, isActive: true },
            { name: 'Samsung', description: 'Leading electronics and appliances brand', isFeatured: true, isActive: true },
            { name: 'Sony', description: 'Japanese electronics and entertainment', isFeatured: true, isActive: true },
            { name: 'OnePlus', description: 'Flagship killer smartphones', isFeatured: true, isActive: true },
            { name: 'Xiaomi', description: 'Value for money electronics', isFeatured: true, isActive: true },
            { name: 'Vivo', description: 'Camera-focused smartphones', isFeatured: true, isActive: true },
            { name: 'Dell', description: 'Premium laptops and computers', isFeatured: true, isActive: true },
            { name: 'HP', description: 'Laptops, printers and PCs', isFeatured: true, isActive: true },
            { name: 'Lenovo', description: 'ThinkPad and IdeaPad laptops', isFeatured: true, isActive: true },
            { name: 'LG', description: 'Home appliances and electronics', isFeatured: true, isActive: true },
            { name: 'Nike', description: 'Sportswear and footwear', isFeatured: true, isActive: true },
            { name: 'Adidas', description: 'Sports apparel and shoes', isFeatured: true, isActive: true },
            { name: 'Levi\'s', description: 'Denim and casual wear', isFeatured: true, isActive: true },
            { name: 'Ray-Ban', description: 'Premium eyewear', isFeatured: true, isActive: true },
            { name: 'Dyson', description: 'Innovative home appliances', isFeatured: true, isActive: true },
            { name: 'Canon', description: 'Cameras and imaging', isFeatured: true, isActive: true },
            { name: 'Boat', description: 'Indian audio and wearables', isFeatured: true, isActive: true },
            { name: 'Noise', description: 'Smart wearables', isFeatured: true, isActive: true },
            { name: 'Yonex', description: 'Badminton equipment', isFeatured: true, isActive: true },
            { name: 'CRDT', description: 'Cricket equipment', isFeatured: true, isActive: true },
            { name: 'Cosco', description: 'Sports equipment', isFeatured: true, isActive: true },
            { name: 'Instant Pot', description: 'Kitchen appliances', isFeatured: true, isActive: true },
            { name: 'Puma', description: 'Sportswear and lifestyle', isFeatured: true, isActive: true },
            { name: 'H&M', description: 'Fashion and apparel', isFeatured: true, isActive: true },
            { name: 'Zara', description: 'Fashion clothing', isFeatured: true, isActive: true },
            { name: 'OPPO', description: 'Camera and design focused smartphones', isFeatured: true, isActive: true },
            { name: 'Realme', description: 'Value for money smartphones', isFeatured: true, isActive: true },
            { name: 'Motorola', description: 'Reliable smartphones', isFeatured: true, isActive: true },
            { name: 'Nothing', description: 'Innovative tech products', isFeatured: true, isActive: true },
            { name: 'Google', description: 'Pixel smartphones and services', isFeatured: true, isActive: true },
            { name: 'Asus', description: 'Gaming laptops and ROG products', isFeatured: true, isActive: true },
            { name: 'Acer', description: 'Laptops and gaming Predator series', isFeatured: true, isActive: true },
            { name: 'MSI', description: 'Gaming laptops and components', isFeatured: true, isActive: true },
            { name: 'Bose', description: 'Premium audio equipment', isFeatured: true, isActive: true },
            { name: 'JBL', description: 'Portable speakers and headphones', isFeatured: true, isActive: true },
            { name: 'Sennheiser', description: 'Professional audio solutions', isFeatured: true, isActive: true },
            { name: 'Marshall', description: 'Iconic audio equipment', isFeatured: true, isActive: true },
            { name: 'Fitbit', description: 'Fitness trackers and smartwatches', isFeatured: true, isActive: true },
            { name: 'Garmin', description: 'GPS and fitness wearables', isFeatured: true, isActive: true },
            { name: 'Tommy Hilfiger', description: 'Premium fashion brand', isFeatured: true, isActive: true },
            { name: 'Fossil', description: 'Fashion watches and accessories', isFeatured: true, isActive: true },
            { name: 'Titan', description: 'Indian watch and accessories brand', isFeatured: true, isActive: true },
            { name: 'American Tourister', description: 'Travel luggage and backpacks', isFeatured: true, isActive: true },
            { name: 'WildCraft', description: 'Adventure backpacks and gear', isFeatured: true, isActive: true },
            { name: 'Lavie', description: 'Women handbags and accessories', isFeatured: true, isActive: true },
            { name: 'Hidesign', description: 'Premium leather wallets and bags', isFeatured: true, isActive: true },
            { name: 'Fastrack', description: 'Youth fashion accessories', isFeatured: true, isActive: true },
            { name: 'Whirlpool', description: 'Home appliances', isFeatured: true, isActive: true },
            { name: 'IFB', description: 'Home appliances and electronics', isFeatured: true, isActive: true },
            { name: 'Dove', description: 'Personal care products', isFeatured: true, isActive: true },
            { name: 'L\'Oreal', description: 'Cosmetics and beauty products', isFeatured: true, isActive: true },
            { name: 'Maybelline', description: 'Makeup and cosmetics', isFeatured: true, isActive: true },
            { name: 'Lakme', description: 'Indian beauty and cosmetics brand', isFeatured: true, isActive: true },
            { name: 'Nivea', description: 'Skin care products', isFeatured: true, isActive: true },
            { name: 'Neutrogena', description: 'Dermatologist skincare', isFeatured: true, isActive: true },
            { name: 'Garnier', description: 'Skin care and hair care', isFeatured: true, isActive: true },
            { name: 'Davidoff', description: 'Premium fragrances', isFeatured: true, isActive: true },
            { name: 'Park Avenue', description: 'Grooming and fragrances', isFeatured: true, isActive: true },
            { name: 'Philips', description: 'Electronics and grooming', isFeatured: true, isActive: true },
            { name: 'Havells', description: 'Electrical appliances', isFeatured: true, isActive: true },
            { name: 'Logitech', description: 'Computer peripherals', isFeatured: true, isActive: true },
            { name: 'Razer', description: 'Gaming peripherals', isFeatured: true, isActive: true },
            { name: 'Seagate', description: 'Storage solutions', isFeatured: true, isActive: true },
            { name: 'TP-Link', description: 'Networking equipment', isFeatured: true, isActive: true },
            { name: 'Anker', description: 'Charging and power solutions', isFeatured: true, isActive: true },
            { name: 'Microsoft', description: 'Software and gaming consoles', isFeatured: true, isActive: true },
            { name: 'Nintendo', description: 'Gaming consoles and video games', isFeatured: true, isActive: true },
            { name: 'WildHorn', description: 'Casual footwear and accessories', isFeatured: true, isActive: true }
        ]);

        const brandMap = Object.fromEntries(brands.map(b => [b.name, b._id]));

        // ========== USERS ==========
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@smartprice.local',
            password: 'AdminPass123!',
            role: 'admin',
            isEmailVerified: true
        });
        const demo = await User.create({
            name: 'Demo User',
            email: 'demo@smartprice.local',
            password: 'DemoPass123!',
            role: 'user',
            isEmailVerified: true
        });

        // ========== PRODUCTS ==========
        const productData = [
            // ---- MOBILES ----
            { title: 'Apple iPhone 15 Pro Max', description: 'A17 Pro chip, 48MP camera system, titanium design. 6.7" Super Retina XDR display with ProMotion. Up to 29 hours video playback.', brand: 'Apple', category: 'Mobiles', price: 99900, mrp: 109900, rating: 4.6, specs: [{ group: 'Display', name: 'Size', value: '6.7" Super Retina XDR' }, { group: 'Processor', name: 'Chip', value: 'A17 Pro' }, { group: 'Camera', name: 'Main', value: '48MP + 12MP + 12MP' }, { group: 'Battery', name: 'Capacity', value: '4422 mAh' }, { group: 'Storage', name: 'Options', value: '256GB/512GB/1TB' }, { group: 'RAM', name: 'Size', value: '8GB' }] },
            { title: 'Samsung Galaxy S24 Ultra', description: 'Snapdragon 8 Gen 3, 200MP camera, S Pen included. 6.8" Dynamic AMOLED 2X display with 120Hz.', brand: 'Samsung', category: 'Mobiles', price: 89999, mrp: 99999, rating: 4.5, specs: [{ group: 'Display', name: 'Size', value: '6.8" Dynamic AMOLED 2X' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8 Gen 3' }, { group: 'Camera', name: 'Main', value: '200MP + 50MP + 12MP + 10MP' }, { group: 'Battery', name: 'Capacity', value: '5000 mAh' }, { group: 'Storage', name: 'Options', value: '256GB/512GB/1TB' }, { group: 'S Pen', name: 'Included', value: 'Yes' }] },
            { title: 'OnePlus 12', description: 'Snapdragon 8 Gen 3, 50MP Hasselblad camera, 100W fast charging. 6.82" ProXDR display.', brand: 'OnePlus', category: 'Mobiles', price: 59999, mrp: 64999, rating: 4.4, specs: [{ group: 'Display', name: 'Size', value: '6.82" ProXDR' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8 Gen 3' }, { group: 'Camera', name: 'Main', value: '50MP + 48MP + 64MP' }, { group: 'Battery', name: 'Capacity', value: '5400 mAh' }, { group: 'Charging', name: 'Speed', value: '100W SuperVOOC' }] },
            { title: 'Xiaomi 14 Pro', description: 'Snapdragon 8 Gen 3, Leica optics, 50MP triple camera. 6.73" LTPO AMOLED display.', brand: 'Xiaomi', category: 'Mobiles', price: 49999, mrp: 59999, rating: 4.3, specs: [{ group: 'Display', name: 'Size', value: '6.73" LTPO AMOLED' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8 Gen 3' }, { group: 'Camera', name: 'Main', value: '50MP + 50MP + 50MP' }, { group: 'Battery', name: 'Capacity', value: '4880 mAh' }, { group: 'Charging', name: 'Speed', value: '120W HyperCharge' }] },
            { title: 'Vivo X100 Pro', description: 'MediaTek Dimensity 9300, 50MP Zeiss camera, 100W flash charging. 6.78" AMOLED display.', brand: 'Vivo', category: 'Mobiles', price: 64999, mrp: 74999, rating: 4.4, specs: [{ group: 'Display', name: 'Size', value: '6.78" AMOLED' }, { group: 'Processor', name: 'Chip', value: 'Dimensity 9300' }, { group: 'Camera', name: 'Main', value: '50MP + 50MP + 64MP' }, { group: 'Battery', name: 'Capacity', value: '5400 mAh' }, { group: 'Charging', name: 'Speed', value: '100W FlashCharge' }] },
            // ---- LAPTOPS ----
            { title: 'MacBook Air M3', description: 'Apple M3 chip, 13.6" Liquid Retina display, 18 hours battery. Ultra-thin and fanless design.', brand: 'Apple', category: 'Laptops', price: 114900, mrp: 129900, rating: 4.7, specs: [{ group: 'Processor', name: 'Chip', value: 'Apple M3' }, { group: 'Display', name: 'Size', value: '13.6" Liquid Retina' }, { group: 'Memory', name: 'RAM', value: '8GB/16GB Unified' }, { group: 'Storage', name: 'SSD', value: '256GB/512GB/1TB' }, { group: 'Battery', name: 'Life', value: 'Up to 18 hours' }] },
            { title: 'MacBook Pro 14 M3 Pro', description: 'Apple M3 Pro chip, 14.2" Liquid Retina XDR display, 18 hours battery. Professional laptop.', brand: 'Apple', category: 'Laptops', price: 199900, mrp: 219900, rating: 4.8, specs: [{ group: 'Processor', name: 'Chip', value: 'Apple M3 Pro' }, { group: 'Display', name: 'Size', value: '14.2" Liquid Retina XDR' }, { group: 'Memory', name: 'RAM', value: '18GB/36GB Unified' }, { group: 'Storage', name: 'SSD', value: '512GB/1TB/2TB' }, { group: 'Battery', name: 'Life', value: 'Up to 18 hours' }] },
            { title: 'Dell XPS 15', description: 'Intel Core i7-13700H, 15.6" 3.5K OLED display, NVIDIA RTX 4070. Premium ultrabook.', brand: 'Dell', category: 'Laptops', price: 179990, mrp: 199990, rating: 4.5, specs: [{ group: 'Processor', name: 'CPU', value: 'Intel Core i7-13700H' }, { group: 'Display', name: 'Size', value: '15.6" 3.5K OLED' }, { group: 'Graphics', name: 'GPU', value: 'NVIDIA RTX 4070' }, { group: 'Memory', name: 'RAM', value: '16GB/32GB DDR5' }, { group: 'Storage', name: 'SSD', value: '512GB/1TB' }] },
            { title: 'HP Spectre x360 14', description: 'Intel Core i7-1355U, 14" 2.8K OLED touch, 360° hinge. Premium convertible laptop.', brand: 'HP', category: 'Laptops', price: 149990, mrp: 169990, rating: 4.4, specs: [{ group: 'Processor', name: 'CPU', value: 'Intel Core i7-1355U' }, { group: 'Display', name: 'Size', value: '14" 2.8K OLED Touch' }, { group: 'Memory', name: 'RAM', value: '16GB LPDDR5' }, { group: 'Storage', name: 'SSD', value: '512GB/1TB' }, { group: 'Feature', name: 'Hinge', value: '360° Convertible' }] },
            { title: 'Lenovo ThinkPad X1 Carbon Gen 11', description: 'Intel Core i7-1365U, 14" 2.8K OLED, 16GB RAM, 512GB SSD. Business laptop.', brand: 'Lenovo', category: 'Laptops', price: 164990, mrp: 189990, rating: 4.6, specs: [{ group: 'Processor', name: 'CPU', value: 'Intel Core i7-1365U' }, { group: 'Display', name: 'Size', value: '14" 2.8K OLED' }, { group: 'Memory', name: 'RAM', value: '16GB LPDDR5' }, { group: 'Storage', name: 'SSD', value: '512GB/1TB' }, { group: 'Weight', name: 'Weight', value: '1.12 kg' }] },
            // ---- TABLETS ----
            { title: 'iPad Pro M4 12.9"', description: 'Apple M4 chip, Ultra Retina XDR display, Thunderbolt 4. Ultimate tablet for pro users.', brand: 'Apple', category: 'Tablets', price: 99900, mrp: 114900, rating: 4.8, specs: [{ group: 'Display', name: 'Size', value: '12.9" Ultra Retina XDR' }, { group: 'Processor', name: 'Chip', value: 'Apple M4' }, { group: 'Storage', name: 'Options', value: '256GB/512GB/1TB/2TB' }, { group: 'Camera', name: 'Main', value: '12MP + 10MP' }, { group: 'Connectivity', name: 'Ports', value: 'Thunderbolt 4' }] },
            { title: 'Samsung Galaxy Tab S9 Ultra', description: 'Snapdragon 8 Gen 2, 14.6" Dynamic AMOLED 2X, S Pen included. Premium Android tablet.', brand: 'Samsung', category: 'Tablets', price: 89999, mrp: 104999, rating: 4.5, specs: [{ group: 'Display', name: 'Size', value: '14.6" Dynamic AMOLED 2X' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8 Gen 2' }, { group: 'Storage', name: 'Options', value: '256GB/512GB/1TB' }, { group: 'S Pen', name: 'Included', value: 'Yes' }, { group: 'Battery', name: 'Capacity', value: '11200 mAh' }] },
            // ---- SMART WATCHES ----
            { title: 'Apple Watch Ultra 2', description: 'S9 SiP chip, 49mm titanium case, precision dual-frequency GPS. Ultimate sports watch.', brand: 'Apple', category: 'Smart Watches', price: 89900, mrp: 95900, rating: 4.7, specs: [{ group: 'Display', name: 'Size', value: '49mm' }, { group: 'Processor', name: 'Chip', value: 'Apple S9 SiP' }, { group: 'Battery', name: 'Life', value: 'Up to 36 hours' }, { group: 'Water', name: 'Resistance', value: 'WR100 + EN13319' }, { group: 'Material', name: 'Case', value: 'Titanium' }] },
            { title: 'Samsung Galaxy Watch 6 Classic', description: 'Wear OS, 47mm, rotating bezel, body composition analysis. Smartwatch with style.', brand: 'Samsung', category: 'Smart Watches', price: 39999, mrp: 49999, rating: 4.4, specs: [{ group: 'Display', name: 'Size', value: '47mm' }, { group: 'OS', name: 'Platform', value: 'Wear OS 4' }, { group: 'Battery', name: 'Life', value: 'Up to 40 hours' }, { group: 'Sensors', name: 'Bio', value: 'Body composition, ECG, BIA' }, { group: 'Bezel', name: 'Type', value: 'Rotating' }] },
            // ---- HEADPHONES / EARBUDS ----
            { title: 'Sony WH-1000XM5', description: 'Industry-leading noise cancellation, 30 hours battery, Hi-Res Audio. Premium wireless headphones.', brand: 'Sony', category: 'Headphones', price: 29990, mrp: 34990, rating: 4.6, specs: [{ group: 'Type', name: 'Design', value: 'Over-ear' }, { group: 'Battery', name: 'Life', value: '30 hours' }, { group: 'Noise', name: 'Cancellation', value: 'Adaptive ANC' }, { group: 'Audio', name: 'Codec', value: 'LDAC, AAC, SBC' }, { group: 'Weight', name: 'Weight', value: '250g' }] },
            { title: 'Apple AirPods Pro 2', description: 'H2 chip, active noise cancellation, adaptive audio, USB-C. Best wireless earbuds.', brand: 'Apple', category: 'Earbuds', price: 24900, mrp: 29900, rating: 4.7, specs: [{ group: 'Type', name: 'Design', value: 'In-ear' }, { group: 'Chip', name: 'Processor', value: 'Apple H2' }, { group: 'Battery', name: 'Life', value: '6h (30h with case)' }, { group: 'Noise', name: 'Cancellation', value: 'Active ANC' }, { group: 'Water', name: 'Resistance', value: 'IPX4' }] },
            { title: 'Samsung Galaxy Buds2 Pro', description: 'Hi-Fi sound, 360 audio, ANC, IPX7 water resistance. Premium Samsung earbuds.', brand: 'Samsung', category: 'Earbuds', price: 15999, mrp: 19999, rating: 4.3, specs: [{ group: 'Type', name: 'Design', value: 'In-ear' }, { group: 'Battery', name: 'Life', value: '5h (29h with case)' }, { group: 'Audio', name: 'Codec', value: 'SSC, AAC, SBC' }, { group: 'Noise', name: 'Cancellation', value: 'Active ANC' }, { group: 'Water', name: 'Resistance', value: 'IPX7' }] },
            // ---- CAMERAS ----
            { title: 'Canon EOS R5', description: '45MP full-frame, 8K video, IBIS, Dual Pixel CMOS AF II. Professional mirrorless camera.', brand: 'Canon', category: 'Cameras', price: 224990, mrp: 249990, rating: 4.8, specs: [{ group: 'Sensor', name: 'Resolution', value: '45MP Full-Frame' }, { group: 'Video', name: 'Max', value: '8K 30fps' }, { group: 'Stabilization', name: 'IBIS', value: '5-axis' }, { group: 'AF', name: 'System', value: 'Dual Pixel CMOS AF II' }, { group: 'Viewfinder', name: 'Type', value: 'EVF 5.76M dots' }] },
            { title: 'Sony A7 IV', description: '33MP full-frame, 4K 60fps video, real-time eye AF. Hybrid mirrorless camera.', brand: 'Sony', category: 'Cameras', price: 219990, mrp: 249990, rating: 4.6, specs: [{ group: 'Sensor', name: 'Resolution', value: '33MP Full-Frame' }, { group: 'Video', name: 'Max', value: '4K 60fps' }, { group: 'AF', name: 'System', value: 'Real-time Eye AF' }, { group: 'Stabilization', name: 'IBIS', value: '5-axis' }, { group: 'ISO', name: 'Range', value: '100-51200' }] },
            // ---- SMART TVS ----
            { title: 'Samsung 65" Neo QLED 4K QN90C', description: 'Neo Quantum HDR+, 120Hz, Dolby Atmos, Object Tracking Sound+. Premium QLED TV.', brand: 'Samsung', category: 'Smart TVs', price: 189990, mrp: 219990, rating: 4.5, specs: [{ group: 'Display', name: 'Size', value: '65"' }, { group: 'Technology', name: 'Panel', value: 'Neo QLED 4K' }, { group: 'HDR', name: 'Format', value: 'Neo Quantum HDR+' }, { group: 'Refresh', name: 'Rate', value: '120Hz' }, { group: 'Audio', name: 'Sound', value: 'Dolby Atmos' }] },
            { title: 'LG 55" OLED C3', description: 'Perfect blacks, a9 Gen6 AI processor, Dolby Vision, Dolby Atmos. Best OLED TV.', brand: 'LG', category: 'Smart TVs', price: 129990, mrp: 159990, rating: 4.7, specs: [{ group: 'Display', name: 'Size', value: '55"' }, { group: 'Technology', name: 'Panel', value: 'OLED evo' }, { group: 'HDR', name: 'Format', value: 'Dolby Vision, HDR10' }, { group: 'Processor', name: 'Chip', value: 'a9 Gen6 AI' }, { group: 'Refresh', name: 'Rate', value: '120Hz' }] },
            // ---- FASHION ----
            { title: 'Nike Air Max 270 React', description: 'Nike Air Max 270 React sneakers with comfort and style. Mesh upper with synthetic overlays.', brand: 'Nike', category: 'Sneakers', price: 13995, mrp: 16995, rating: 4.4, specs: [{ group: 'Type', name: 'Category', value: 'Sneakers' }, { group: 'Upper', name: 'Material', value: 'Mesh' }, { group: 'Sole', name: 'Technology', value: 'Air Max + React' }, { group: 'Closure', name: 'Type', value: 'Lace-up' }, { group: 'Gender', name: 'For', value: 'Unisex' }] },
            { title: 'Adidas Ultraboost 23', description: 'Adidas Ultraboost 23 running shoes with BOOST midsole. Primeknit+ upper for comfort.', brand: 'Adidas', category: 'Sneakers', price: 17999, mrp: 21999, rating: 4.5, specs: [{ group: 'Type', name: 'Category', value: 'Running Shoes' }, { group: 'Upper', name: 'Material', value: 'Primeknit+' }, { group: 'Sole', name: 'Technology', value: 'BOOST' }, { group: 'Closure', name: 'Type', value: 'Lace-up' }, { group: 'Gender', name: 'For', value: 'Unisex' }] },
            { title: "Levi's 501 Original Fit Jeans", description: 'Iconic straight leg jeans. Button fly, 5-pocket styling, authentic denim.', brand: "Levi's", category: 'Jeans', price: 4999, mrp: 6999, rating: 4.3, specs: [{ group: 'Fit', name: 'Style', value: 'Original Straight' }, { group: 'Material', name: 'Fabric', value: '100% Cotton Denim' }, { group: 'Fly', name: 'Type', value: 'Button Fly' }, { group: 'Pockets', name: 'Style', value: '5-Pocket' }, { group: 'Gender', name: 'For', value: 'Men' }] },
            { title: 'Ray-Ban Aviator Classic', description: 'Iconic aviator sunglasses. Metal frame, green G-15 lenses, 100% UV protection.', brand: 'Ray-Ban', category: 'Sunglasses', price: 9990, mrp: 12990, rating: 4.6, specs: [{ group: 'Frame', name: 'Material', value: 'Metal' }, { group: 'Lens', name: 'Type', value: 'G-15 Green' }, { group: 'Protection', name: 'UV', value: '100% UV' }, { group: 'Size', name: 'Width', value: '55mm' }, { group: 'Gender', name: 'For', value: 'Unisex' }] },
            // ---- HOME APPLIANCES ----
            { title: 'Dyson V15 Detect Vacuum', description: 'Laser reveals microscopic dust, piezo sensor, 60 minutes run time. Intelligent cordless vacuum.', brand: 'Dyson', category: 'Vacuum Cleaner', price: 65900, mrp: 72900, rating: 4.6, specs: [{ group: 'Type', name: 'Category', value: 'Cordless Stick' }, { group: 'Battery', name: 'Life', value: '60 minutes' }, { group: 'Sensor', name: 'Technology', value: 'Piezo + Laser' }, { group: 'Capacity', name: 'Bin', value: '0.76L' }, { group: 'Weight', name: 'Weight', value: '2.74 kg' }] },
            { title: 'Instant Pot Duo Plus 6-Qt', description: '9-in-1 electric pressure cooker. Sauté, steam, slow cook, rice cooker, yogurt maker.', brand: 'Instant Pot', category: 'Cookware', price: 11999, mrp: 14999, rating: 4.5, specs: [{ group: 'Capacity', name: 'Size', value: '6 Quart' }, { group: 'Functions', name: 'Modes', value: '9-in-1' }, { group: 'Power', name: 'Watts', value: '1000W' }, { group: 'Material', name: 'Inner Pot', value: 'Stainless Steel' }, { group: 'Safety', name: 'Features', value: '10+ Safety Mechanisms' }] },
            // ---- SPORTS ----
            { title: 'CRDT Kashmir Willow Cricket Bat', description: 'Premium Kashmir willow cricket bat, full-size, with handle. Perfect for club cricket.', brand: 'CRDT', category: 'Cricket Equipment', price: 2999, mrp: 4999, rating: 4.2, specs: [{ group: 'Material', name: 'Willow', value: 'Kashmir Willow' }, { group: 'Size', name: 'Length', value: 'Full Size (33.5")' }, { group: 'Weight', name: 'Weight', value: '1.15-1.25 kg' }, { group: 'Handle', name: 'Type', value: 'Round cane' }, { group: 'Grade', name: 'Quality', value: 'Premium' }] },
            { title: 'Cosco 5-A-Side Football Size 5', description: 'Official size 5 football, machine stitched, PU material. Match quality.', brand: 'Cosco', category: 'Football', price: 1499, mrp: 2499, rating: 4.3, specs: [{ group: 'Size', name: 'Size', value: 'Size 5' }, { group: 'Material', name: 'Cover', value: 'PU Leather' }, { group: 'Stitching', name: 'Type', value: 'Machine Stitched' }, { group: 'Weight', name: 'Weight', value: '400-450g' }, { group: 'Usage', name: 'For', value: 'Match Play' }] },
            { title: 'Yonex Nanoray 7000i Badminton Racket', description: 'Lightweight graphite racket, isometric head, high tension. Perfect for smashes.', brand: 'Yonex', category: 'Badminton', price: 7999, mrp: 10999, rating: 4.4, specs: [{ group: 'Material', name: 'Frame', value: 'H.M. Graphite' }, { group: 'Weight', name: 'Weight', value: '87g (4U)' }, { group: 'Head', name: 'Shape', value: 'Isometric' }, { group: 'Max Tension', name: 'Tension', value: '28 lbs' }, { group: 'Flex', name: 'Flexibility', value: 'Medium' }] },
            { title: 'Puma Men Regular Fit T-Shirt', description: 'Cotton blend t-shirt, regular fit, round neck with short sleeves. Everyday comfort.', brand: 'Puma', category: 'T-Shirts', price: 1299, mrp: 2299, rating: 4.1, specs: [{ group: 'Fit', name: 'Style', value: 'Regular Fit' }, { group: 'Material', name: 'Fabric', value: 'Cotton Blend' }, { group: 'Neck', name: 'Style', value: 'Round Neck' }, { group: 'Sleeves', name: 'Length', value: 'Short Sleeves' }, { group: 'Gender', name: 'For', value: 'Men' }] },
            { title: 'H&M Women Printed Dress', description: 'Comfortable printed midi dress with V-neck and short sleeves. Flowy fit.', brand: 'H&M', category: 'Dresses', price: 2499, mrp: 3999, rating: 4.2, specs: [{ group: 'Fit', name: 'Style', value: 'Flowy Fit' }, { group: 'Neck', name: 'Style', value: 'V-Neck' }, { group: 'Length', name: 'Length', value: 'Midi' }, { group: 'Sleeves', name: 'Length', value: 'Short Sleeves' }, { group: 'Gender', name: 'For', value: 'Women' }] },
            { title: 'Zara Men Slim Fit Blazer', description: 'Slim fit blazer with notch lapel. Two-button closure, chest pocket, tailored fit.', brand: 'Zara', category: 'Jackets', price: 8990, mrp: 12990, rating: 4.3, specs: [{ group: 'Fit', name: 'Style', value: 'Slim Fit' }, { group: 'Lapel', name: 'Style', value: 'Notch Lapel' }, { group: 'Closure', name: 'Type', value: 'Two-button' }, { group: 'Pockets', name: 'Style', value: 'Flap pockets' }, { group: 'Gender', name: 'For', value: 'Men' }] },
            { title: 'Samsung 7.5 kg Front Load Washing Machine', description: 'Ecobubble, AI control, 1400 rpm, digital inverter motor. Energy efficient.', brand: 'Samsung', category: 'Washing Machines', price: 45990, mrp: 55990, rating: 4.4, specs: [{ group: 'Capacity', name: 'Load', value: '7.5 kg' }, { group: 'Type', name: 'Load Type', value: 'Front Load' }, { group: 'Speed', name: 'Spin', value: '1400 RPM' }, { group: 'Technology', name: 'Wash', value: 'Ecobubble' }, { group: 'Motor', name: 'Type', value: 'Digital Inverter' }] },
            { title: 'LG 1.5 Ton 5-Star Split AC', description: 'Dual inverter compressor, HD filter, 4-way swing, WiFi enabled. Energy efficient AC.', brand: 'LG', category: 'Air Conditioners', price: 54990, mrp: 64990, rating: 4.5, specs: [{ group: 'Capacity', name: 'Tonnage', value: '1.5 Ton' }, { group: 'Rating', name: 'Star', value: '5-Star' }, { group: 'Type', name: 'Type', value: 'Split AC' }, { group: 'Compressor', name: 'Type', value: 'Dual Inverter' }, { group: 'Cooling', name: 'Capacity', value: '5200W' }] },
            { title: 'Samsung 260L 3-Star Refrigerator', description: 'Digital inverter, convertible, smart connectivity. Frost-free refrigerator.', brand: 'Samsung', category: 'Refrigerators', price: 32990, mrp: 39990, rating: 4.3, specs: [{ group: 'Capacity', name: 'Size', value: '260 Liters' }, { group: 'Type', name: 'Type', value: 'Frost-Free' }, { group: 'Rating', name: 'Star', value: '3-Star' }, { group: 'Technology', name: 'Inverter', value: 'Digital Inverter' }, { group: 'Feature', name: 'Convertible', value: 'Yes' }] },
            { title: 'LG 32L Solo Microwave Oven', description: '32L capacity, smart inverter, auto cook, LED display. Solo microwave for everyday use.', brand: 'LG', category: 'Microwave Ovens', price: 14990, mrp: 19990, rating: 4.2, specs: [{ group: 'Capacity', name: 'Size', value: '32 Liters' }, { group: 'Type', name: 'Type', value: 'Solo' }, { group: 'Power', name: 'Watts', value: '1000W' }, { group: 'Technology', name: 'Inverter', value: 'Smart Inverter' }, { group: 'Display', name: 'Type', value: 'LED' }] },
            // ---- NEW MOBILES ----
            { title: 'Apple iPhone 16 Pro Max', description: 'A18 Pro chip, 48MP fusion camera system, titanium design, camera control button. 6.9" Super Retina XDR display.', brand: 'Apple', category: 'Mobiles', price: 179900, mrp: 199900, rating: 4.7, specs: [{ group: 'Display', name: 'Size', value: '6.9" Super Retina XDR' }, { group: 'Processor', name: 'Chip', value: 'A18 Pro' }, { group: 'Camera', name: 'Main', value: '48MP Fusion + 48MP Ultra Wide + 12MP Telephoto' }, { group: 'Battery', name: 'Capacity', value: '4685 mAh' }, { group: 'Storage', name: 'Options', value: '256GB/512GB/1TB' }, { group: 'RAM', name: 'Size', value: '8GB' }] },
            { title: 'Apple iPhone 16', description: 'A18 chip, 48MP camera, action button, camera control. 6.1" Super Retina XDR display with Dynamic Island.', brand: 'Apple', category: 'Mobiles', price: 79900, mrp: 89900, rating: 4.5, specs: [{ group: 'Display', name: 'Size', value: '6.1" Super Retina XDR' }, { group: 'Processor', name: 'Chip', value: 'A18' }, { group: 'Camera', name: 'Main', value: '48MP + 12MP Ultra Wide' }, { group: 'Battery', name: 'Capacity', value: '3561 mAh' }, { group: 'Storage', name: 'Options', value: '128GB/256GB/512GB' }] },
            { title: 'Samsung Galaxy S25 Ultra', description: 'Snapdragon 8 Elite, 200MP AI camera, S Pen, Galaxy AI features. 6.9" Dynamic AMOLED 2X 120Hz.', brand: 'Samsung', category: 'Mobiles', price: 144999, mrp: 159999, rating: 4.6, specs: [{ group: 'Display', name: 'Size', value: '6.9" Dynamic AMOLED 2X' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8 Elite' }, { group: 'Camera', name: 'Main', value: '200MP + 50MP + 12MP + 10MP' }, { group: 'Battery', name: 'Capacity', value: '5000 mAh' }, { group: 'S Pen', name: 'Included', value: 'Yes' }] },
            { title: 'OnePlus 13', description: 'Snapdragon 8 Elite, 50MP Hasselblad camera, 6000mAh battery, 100W charging. 6.82" ProXDR display.', brand: 'OnePlus', category: 'Mobiles', price: 74999, mrp: 84999, rating: 4.5, specs: [{ group: 'Display', name: 'Size', value: '6.82" ProXDR' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8 Elite' }, { group: 'Camera', name: 'Main', value: '50MP + 50MP + 50MP' }, { group: 'Battery', name: 'Capacity', value: '6000 mAh' }, { group: 'Charging', name: 'Speed', value: '100W' }] },
            { title: 'Xiaomi 15 Pro', description: 'Snapdragon 8 Elite, Leica optics, 50MP triple camera, 120W HyperCharge. 6.73" LTPO AMOLED.', brand: 'Xiaomi', category: 'Mobiles', price: 59999, mrp: 69999, rating: 4.4, specs: [{ group: 'Display', name: 'Size', value: '6.73" LTPO AMOLED' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8 Elite' }, { group: 'Camera', name: 'Main', value: '50MP + 50MP + 50MP Leica' }, { group: 'Battery', name: 'Capacity', value: '5400 mAh' }, { group: 'Charging', name: 'Speed', value: '120W HyperCharge' }] },
            { title: 'Vivo X200 Pro', description: 'MediaTek Dimensity 9400, 200MP Zeiss APO camera, 6000mAh battery. 6.78" AMOLED display.', brand: 'Vivo', category: 'Mobiles', price: 74999, mrp: 82999, rating: 4.5, specs: [{ group: 'Display', name: 'Size', value: '6.78" AMOLED' }, { group: 'Processor', name: 'Chip', value: 'Dimensity 9400' }, { group: 'Camera', name: 'Main', value: '200MP + 50MP + 50MP Zeiss' }, { group: 'Battery', name: 'Capacity', value: '6000 mAh' }, { group: 'Charging', name: 'Speed', value: '120W FlashCharge' }] },
            { title: 'OPPO Find X8 Pro', description: 'MediaTek Dimensity 9400, 50MP Hasselblad camera, 80W charging. 6.78" AMOLED with 120Hz.', brand: 'OPPO', category: 'Mobiles', price: 84999, mrp: 99999, rating: 4.4, specs: [{ group: 'Display', name: 'Size', value: '6.78" AMOLED' }, { group: 'Processor', name: 'Chip', value: 'Dimensity 9400' }, { group: 'Camera', name: 'Main', value: '50MP + 50MP + 50MP Hasselblad' }, { group: 'Battery', name: 'Capacity', value: '5910 mAh' }, { group: 'Charging', name: 'Speed', value: '80W SuperVOOC' }] },
            { title: 'Realme GT 7 Pro', description: 'Snapdragon 8 Elite, 50MP triple camera, 6500mAh battery, 120W charging. Flagship killer.', brand: 'Realme', category: 'Mobiles', price: 52999, mrp: 59999, rating: 4.3, specs: [{ group: 'Display', name: 'Size', value: '6.78" AMOLED' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8 Elite' }, { group: 'Camera', name: 'Main', value: '50MP + 50MP + 8MP' }, { group: 'Battery', name: 'Capacity', value: '6500 mAh' }, { group: 'Charging', name: 'Speed', value: '120W' }] },
            { title: 'Motorola Edge 50 Ultra', description: 'Snapdragon 8s Gen 3, 50MP AI camera, 125W TurboPower charging. Premium Moto flagship.', brand: 'Motorola', category: 'Mobiles', price: 39999, mrp: 49999, rating: 4.2, specs: [{ group: 'Display', name: 'Size', value: '6.7" pOLED' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8s Gen 3' }, { group: 'Camera', name: 'Main', value: '50MP + 50MP + 64MP' }, { group: 'Battery', name: 'Capacity', value: '4500 mAh' }, { group: 'Charging', name: 'Speed', value: '125W TurboPower' }] },
            { title: 'Nothing Phone 3', description: 'Snapdragon 8s Gen 3, Glyph Interface, 50MP dual camera, transparent design. Unique smartphone.', brand: 'Nothing', category: 'Mobiles', price: 39999, mrp: 44999, rating: 4.3, specs: [{ group: 'Display', name: 'Size', value: '6.7" LTPO AMOLED' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8s Gen 3' }, { group: 'Camera', name: 'Main', value: '50MP + 50MP' }, { group: 'Battery', name: 'Capacity', value: '5000 mAh' }, { group: 'Feature', name: 'Glyph', value: 'LED Interface' }] },
            { title: 'Google Pixel 9 Pro', description: 'Tensor G4, 50MP main camera, AI features, 7 years of updates. Pure Android experience.', brand: 'Google', category: 'Mobiles', price: 94999, mrp: 109999, rating: 4.5, specs: [{ group: 'Display', name: 'Size', value: '6.3" LTPO OLED' }, { group: 'Processor', name: 'Chip', value: 'Google Tensor G4' }, { group: 'Camera', name: 'Main', value: '50MP + 48MP + 48MP' }, { group: 'Battery', name: 'Capacity', value: '4700 mAh' }, { group: 'OS', name: 'Updates', value: '7 Years' }] },
            // ---- NEW LAPTOPS ----
            { title: 'Asus ROG Zephyrus G16', description: 'Intel Core Ultra 9, 16" 2.5K OLED 240Hz, NVIDIA RTX 4070. Premium gaming laptop.', brand: 'Asus', category: 'Laptops', price: 199990, mrp: 229990, rating: 4.6, specs: [{ group: 'Processor', name: 'CPU', value: 'Intel Core Ultra 9 185H' }, { group: 'Display', name: 'Size', value: '16" 2.5K OLED 240Hz' }, { group: 'Graphics', name: 'GPU', value: 'NVIDIA RTX 4070' }, { group: 'Memory', name: 'RAM', value: '32GB DDR5' }, { group: 'Storage', name: 'SSD', value: '1TB' }] },
            { title: 'Acer Predator Helios Neo 16', description: 'Intel Core i9-14900HX, 16" 2.5K IPS 165Hz, NVIDIA RTX 4060. Gaming powerhouse.', brand: 'Acer', category: 'Laptops', price: 149990, mrp: 174990, rating: 4.4, specs: [{ group: 'Processor', name: 'CPU', value: 'Intel Core i9-14900HX' }, { group: 'Display', name: 'Size', value: '16" 2.5K IPS 165Hz' }, { group: 'Graphics', name: 'GPU', value: 'NVIDIA RTX 4060' }, { group: 'Memory', name: 'RAM', value: '16GB DDR5' }, { group: 'Storage', name: 'SSD', value: '1TB' }] },
            { title: 'MSI Katana 15', description: 'Intel Core i7-13620H, 15.6" FHD 144Hz, NVIDIA RTX 4060. Affordable gaming laptop.', brand: 'MSI', category: 'Laptops', price: 109990, mrp: 129990, rating: 4.3, specs: [{ group: 'Processor', name: 'CPU', value: 'Intel Core i7-13620H' }, { group: 'Display', name: 'Size', value: '15.6" FHD 144Hz' }, { group: 'Graphics', name: 'GPU', value: 'NVIDIA RTX 4060' }, { group: 'Memory', name: 'RAM', value: '16GB DDR5' }, { group: 'Storage', name: 'SSD', value: '512GB' }] },
            // ---- NEW TABLETS ----
            { title: 'iPad Air M2', description: 'Apple M2 chip, 11" Liquid Retina display, Apple Pencil Pro support. Powerful and portable.', brand: 'Apple', category: 'Tablets', price: 69900, mrp: 82900, rating: 4.7, specs: [{ group: 'Display', name: 'Size', value: '11" Liquid Retina' }, { group: 'Processor', name: 'Chip', value: 'Apple M2' }, { group: 'Storage', name: 'Options', value: '128GB/256GB/512GB/1TB' }, { group: 'Camera', name: 'Main', value: '12MP' }, { group: 'Pencil', name: 'Support', value: 'Apple Pencil Pro' }] },
            { title: 'Samsung Galaxy Tab S9 FE', description: 'Exynos 1380, 10.9" TFT 90Hz, S Pen included, IP68. Affordable premium tablet.', brand: 'Samsung', category: 'Tablets', price: 34999, mrp: 42999, rating: 4.3, specs: [{ group: 'Display', name: 'Size', value: '10.9" TFT 90Hz' }, { group: 'Processor', name: 'Chip', value: 'Exynos 1380' }, { group: 'Storage', name: 'Options', value: '128GB/256GB' }, { group: 'S Pen', name: 'Included', value: 'Yes' }, { group: 'Water', name: 'Resistance', value: 'IP68' }] },
            { title: 'Lenovo Tab P12 Pro', description: 'MediaTek Dimensity 7050, 12.7" 3K display, quad JBL speakers, Lenovo Precision Pen 3.', brand: 'Lenovo', category: 'Tablets', price: 29999, mrp: 36999, rating: 4.2, specs: [{ group: 'Display', name: 'Size', value: '12.7" 3K' }, { group: 'Processor', name: 'Chip', value: 'Dimensity 7050' }, { group: 'Storage', name: 'Options', value: '128GB/256GB' }, { group: 'Audio', name: 'Speakers', value: 'Quad JBL' }, { group: 'Pen', name: 'Support', value: 'Lenovo Precision Pen 3' }] },
            { title: 'Xiaomi Pad 6 Pro', description: 'Snapdragon 8+ Gen 1, 11" 2.8K 144Hz display, 8600mAh battery, 67W charging.', brand: 'Xiaomi', category: 'Tablets', price: 26999, mrp: 32999, rating: 4.4, specs: [{ group: 'Display', name: 'Size', value: '11" 2.8K 144Hz' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8+ Gen 1' }, { group: 'Battery', name: 'Capacity', value: '8600 mAh' }, { group: 'Charging', name: 'Speed', value: '67W' }, { group: 'Storage', name: 'Options', value: '128GB/256GB' }] },
            { title: 'OnePlus Pad Go', description: 'MediaTek Helio G99, 11.35" 2.4K 90Hz display, 8000mAh battery. Budget productivity tablet.', brand: 'OnePlus', category: 'Tablets', price: 19999, mrp: 24999, rating: 4.1, specs: [{ group: 'Display', name: 'Size', value: '11.35" 2.4K 90Hz' }, { group: 'Processor', name: 'Chip', value: 'Helio G99' }, { group: 'Battery', name: 'Capacity', value: '8000 mAh' }, { group: 'Charging', name: 'Speed', value: '33W SUPERVOOC' }, { group: 'Storage', name: 'Options', value: '128GB/256GB' }] },
            // ---- NEW SMART WATCHES ----
            { title: 'Fitbit Charge 6', description: 'Built-in GPS, heart rate tracking, ECG, stress management. Advanced fitness tracker.', brand: 'Fitbit', category: 'Smart Watches', price: 14999, mrp: 17999, rating: 4.3, specs: [{ group: 'Display', name: 'Size', value: '1.04" AMOLED' }, { group: 'Sensors', name: 'Health', value: 'HR, ECG, SpO2' }, { group: 'Battery', name: 'Life', value: 'Up to 7 days' }, { group: 'GPS', name: 'Built-in', value: 'Yes' }, { group: 'Water', name: 'Resistance', value: '50M' }] },
            { title: 'Noise ColorFit Pro 5', description: '1.96" AMOLED display, Bluetooth calling, 100+ sports modes, AI voice assistant.', brand: 'Noise', category: 'Smart Watches', price: 4999, mrp: 7999, rating: 4.2, specs: [{ group: 'Display', name: 'Size', value: '1.96" AMOLED' }, { group: 'Battery', name: 'Life', value: 'Up to 7 days' }, { group: 'Calling', name: 'Bluetooth', value: 'Yes' }, { group: 'Sports', name: 'Modes', value: '100+' }, { group: 'OS', name: 'Compatibility', value: 'Android & iOS' }] },
            { title: 'boAt Lunar Pro', description: '1.43" AMOLED display, IP68, SpO2, HR monitoring, 700+ active modes. Premium smartwatch.', brand: 'Boat', category: 'Smart Watches', price: 3999, mrp: 6999, rating: 4.1, specs: [{ group: 'Display', name: 'Size', value: '1.43" AMOLED' }, { group: 'Battery', name: 'Life', value: 'Up to 7 days' }, { group: 'Water', name: 'Resistance', value: 'IP68' }, { group: 'Sensors', name: 'Health', value: 'SpO2, HR, Sleep' }, { group: 'Calling', name: 'Bluetooth', value: 'Yes' }] },
            { title: 'Garmin Venu 3', description: 'AMOLED display, GPS, body battery, sleep coach, nap detection. Premium fitness smartwatch.', brand: 'Garmin', category: 'Smart Watches', price: 54990, mrp: 59990, rating: 4.6, specs: [{ group: 'Display', name: 'Size', value: '1.4" AMOLED' }, { group: 'Battery', name: 'Life', value: 'Up to 14 days' }, { group: 'GPS', name: 'Multi-band', value: 'Yes' }, { group: 'Sensors', name: 'Health', value: 'HR, Body Battery, SpO2' }, { group: 'Music', name: 'Storage', value: 'Yes' }] },
            // ---- NEW HEADPHONES / SPEAKERS ----
            { title: 'Bose QuietComfort Ultra', description: 'World-class noise cancellation, Immersive Audio, 24 hours battery. Premium wireless headphones.', brand: 'Bose', category: 'Headphones', price: 39990, mrp: 44990, rating: 4.7, specs: [{ group: 'Type', name: 'Design', value: 'Over-ear' }, { group: 'Battery', name: 'Life', value: '24 hours' }, { group: 'Audio', name: 'Feature', value: 'Immersive Audio' }, { group: 'Noise', name: 'Cancellation', value: 'CustomTune ANC' }, { group: 'Weight', name: 'Weight', value: '252g' }] },
            { title: 'JBL Tune 770NC', description: 'Adaptive noise cancelling, JBL Pure Bass, 70 hours battery. Wireless over-ear headphones.', brand: 'JBL', category: 'Headphones', price: 9999, mrp: 12999, rating: 4.4, specs: [{ group: 'Type', name: 'Design', value: 'Over-ear' }, { group: 'Battery', name: 'Life', value: '70 hours' }, { group: 'Audio', name: 'Feature', value: 'JBL Pure Bass' }, { group: 'Noise', name: 'Cancellation', value: 'Adaptive ANC' }, { group: 'Weight', name: 'Weight', value: '232g' }] },
            { title: 'Marshall Major IV', description: 'Iconic Marshall design, 80+ hours wireless playtime, foldable. Wireless on-ear headphones.', brand: 'Marshall', category: 'Headphones', price: 12999, mrp: 14999, rating: 4.3, specs: [{ group: 'Type', name: 'Design', value: 'On-ear' }, { group: 'Battery', name: 'Life', value: '80+ hours' }, { group: 'Audio', name: 'Feature', value: 'Marshall Signature Sound' }, { group: 'Charging', name: 'Type', value: 'USB-C + Wireless' }, { group: 'Weight', name: 'Weight', value: '165g' }] },
            { title: 'Sennheiser Momentum 4', description: 'Adaptive noise cancellation, audiophile sound, 60 hours battery. Premium wireless headphones.', brand: 'Sennheiser', category: 'Headphones', price: 34990, mrp: 39990, rating: 4.6, specs: [{ group: 'Type', name: 'Design', value: 'Over-ear' }, { group: 'Battery', name: 'Life', value: '60 hours' }, { group: 'Audio', name: 'Codec', value: 'aptX Adaptive, AAC' }, { group: 'Noise', name: 'Cancellation', value: 'Adaptive ANC' }, { group: 'Weight', name: 'Weight', value: '293g' }] },
            { title: 'boAt Airdopes 141 Pro', description: '50 hours playback, ENx tech, low latency, IPX5. Best selling wireless earbuds.', brand: 'Boat', category: 'Earbuds', price: 1999, mrp: 3999, rating: 4.1, specs: [{ group: 'Type', name: 'Design', value: 'In-ear' }, { group: 'Battery', name: 'Life', value: '50h (case)' }, { group: 'Audio', name: 'Feature', value: 'boAt Signature Sound' }, { group: 'Gaming', name: 'Mode', value: 'Low Latency' }, { group: 'Water', name: 'Resistance', value: 'IPX5' }] },
            { title: 'boAt Rockerz 450 Pro', description: '70 hours playtime, ASAP charging, immersive audio, foldable design. Wireless neckband.', brand: 'Boat', category: 'Headphones', price: 1999, mrp: 3499, rating: 4.2, specs: [{ group: 'Type', name: 'Design', value: 'Neckband' }, { group: 'Battery', name: 'Life', value: '70 hours' }, { group: 'Charging', name: 'Technology', value: 'ASAP Charge' }, { group: 'Audio', name: 'Driver', value: '10mm' }, { group: 'Water', name: 'Resistance', value: 'IPX5' }] },
            { title: 'Realme TechLife Buds T100', description: '30 hours battery, AI ENC, bass boost, IPX5. Affordable wireless earbuds.', brand: 'Realme', category: 'Earbuds', price: 1499, mrp: 2499, rating: 4.0, specs: [{ group: 'Type', name: 'Design', value: 'In-ear' }, { group: 'Battery', name: 'Life', value: '30h (case)' }, { group: 'Audio', name: 'Driver', value: '10mm Dynamic' }, { group: 'Noise', name: 'Cancellation', value: 'AI ENC' }, { group: 'Water', name: 'Resistance', value: 'IPX5' }] },
            { title: 'JBL Go 4', description: 'IP67 waterproof, 20 hours playtime, JBL Pro Sound. Ultra-portable Bluetooth speaker.', brand: 'JBL', category: 'Speakers', price: 3999, mrp: 5499, rating: 4.3, specs: [{ group: 'Type', name: 'Design', value: 'Portable' }, { group: 'Battery', name: 'Life', value: '20 hours' }, { group: 'Audio', name: 'Feature', value: 'JBL Pro Sound' }, { group: 'Water', name: 'Resistance', value: 'IP67' }, { group: 'Weight', name: 'Weight', value: '190g' }] },
            { title: 'Marshall Emberton III', description: 'Signature Marshall sound, 30+ hours, IP67, stackable. Premium portable speaker.', brand: 'Marshall', category: 'Speakers', price: 16499, mrp: 18999, rating: 4.5, specs: [{ group: 'Type', name: 'Design', value: 'Portable' }, { group: 'Battery', name: 'Life', value: '30+ hours' }, { group: 'Audio', name: 'Feature', value: 'Marshall Signature Sound' }, { group: 'Water', name: 'Resistance', value: 'IP67' }, { group: 'Weight', name: 'Weight', value: '700g' }] },
            { title: 'Sony SRS-XB100', description: 'Compact, IP67, 16 hours battery, clear hands-free calling. Portable Bluetooth speaker.', brand: 'Sony', category: 'Speakers', price: 5999, mrp: 7999, rating: 4.2, specs: [{ group: 'Type', name: 'Design', value: 'Portable' }, { group: 'Battery', name: 'Life', value: '16 hours' }, { group: 'Audio', name: 'Feature', value: 'Clear Sound' }, { group: 'Water', name: 'Resistance', value: 'IP67' }, { group: 'Weight', name: 'Weight', value: '274g' }] },
            // ---- GAMING CONSOLES ----
            { title: 'Sony PlayStation 5 Slim', description: 'AMD Ryzen Zen 2, 825GB SSD, 4K Blu-ray, DualSense controller. Next-gen gaming console.', brand: 'Sony', category: 'Gaming Consoles', price: 49990, mrp: 54990, rating: 4.8, specs: [{ group: 'Storage', name: 'SSD', value: '825GB Custom' }, { group: 'Resolution', name: 'Max', value: '4K 120Hz / 8K' }, { group: 'Controller', name: 'Type', value: 'DualSense Wireless' }, { group: 'Optical', name: 'Drive', value: '4K Blu-ray' }, { group: 'Weight', name: 'Weight', value: '3.2 kg' }] },
            { title: 'Xbox Series X', description: 'Custom AMD Zen 2, 1TB SSD, 4K 120fps, backward compatible. Microsoft flagship console.', brand: 'Microsoft', category: 'Gaming Consoles', price: 49990, mrp: 59990, rating: 4.7, specs: [{ group: 'Storage', name: 'SSD', value: '1TB Custom NVMe' }, { group: 'Resolution', name: 'Max', value: '4K 120Hz' }, { group: 'Controller', name: 'Type', value: 'Xbox Wireless' }, { group: 'Disc', name: 'Drive', value: '4K Blu-ray' }, { group: 'Game Pass', name: 'Support', value: 'Xbox Game Pass' }] },
            { title: 'Nintendo Switch OLED', description: '7" OLED screen, 64GB internal, dockable, Joy-Con controllers. Hybrid gaming console.', brand: 'Nintendo', category: 'Gaming Consoles', price: 27999, mrp: 34999, rating: 4.6, specs: [{ group: 'Display', name: 'Size', value: '7" OLED' }, { group: 'Storage', name: 'Internal', value: '64GB' }, { group: 'Battery', name: 'Life', value: '4.5-9 hours' }, { group: 'Weight', name: 'Handheld', value: '420g' }, { group: 'Modes', name: 'Play', value: 'Handheld, Tabletop, TV' }] },
            // ---- MONITORS ----
            { title: 'Samsung 32" M8 Smart Monitor', description: '32" 4K UHD, Smart TV apps, built-in speakers, USB-C 65W. Smart workspace monitor.', brand: 'Samsung', category: 'Monitors', price: 54990, mrp: 64990, rating: 4.3, specs: [{ group: 'Display', name: 'Size', value: '32" 4K UHD' }, { group: 'Smart', name: 'Features', value: 'Smart TV Apps' }, { group: 'USB-C', name: 'Power', value: '65W PD' }, { group: 'Speakers', name: 'Built-in', value: '2.2 Ch' }, { group: 'HDR', name: 'Support', value: 'HDR10+' }] },
            { title: 'LG 27" UltraGear Gaming Monitor', description: '27" 2K QHD, 165Hz, 1ms, G-Sync, HDR10. Premium gaming monitor.', brand: 'LG', category: 'Monitors', price: 34990, mrp: 44990, rating: 4.5, specs: [{ group: 'Display', name: 'Size', value: '27" QHD' }, { group: 'Refresh', name: 'Rate', value: '165Hz' }, { group: 'Response', name: 'Time', value: '1ms' }, { group: 'Sync', name: 'Support', value: 'G-Sync Compatible' }, { group: 'HDR', name: 'Support', value: 'HDR10' }] },
            // ---- FASHION (EXPANDED) ----
            { title: 'Nike Men Dri-FIT T-Shirt', description: 'Dri-FIT technology, regular fit, sweat-wicking fabric. Performance training t-shirt.', brand: 'Nike', category: 'T-Shirts', price: 2495, mrp: 3495, rating: 4.3, specs: [{ group: 'Fit', name: 'Style', value: 'Regular Fit' }, { group: 'Material', name: 'Fabric', value: 'Dri-FIT Polyester' }, { group: 'Technology', name: 'Feature', value: 'Moisture Wicking' }, { group: 'Neck', name: 'Style', value: 'Round Neck' }, { group: 'Gender', name: 'For', value: 'Men' }] },
            { title: 'Adidas Men Essential T-Shirt', description: 'Cotton jersey fabric, regular fit, iconic trefoil logo. Everyday essential tee.', brand: 'Adidas', category: 'T-Shirts', price: 1999, mrp: 2999, rating: 4.2, specs: [{ group: 'Fit', name: 'Style', value: 'Regular Fit' }, { group: 'Material', name: 'Fabric', value: '100% Cotton Jersey' }, { group: 'Neck', name: 'Style', value: 'Crew Neck' }, { group: 'Sleeves', name: 'Length', value: 'Short Sleeves' }, { group: 'Gender', name: 'For', value: 'Men' }] },
            { title: 'Puma Mens Cotton T-Shirt Pack', description: 'Pack of 3 cotton t-shirts, regular fit, soft feel. Multipack everyday value.', brand: 'Puma', category: 'T-Shirts', price: 1999, mrp: 3499, rating: 4.1, specs: [{ group: 'Pack', name: 'Quantity', value: '3 Pack' }, { group: 'Fit', name: 'Style', value: 'Regular Fit' }, { group: 'Material', name: 'Fabric', value: 'Cotton Blend' }, { group: 'Neck', name: 'Style', value: 'Round Neck' }, { group: 'Gender', name: 'For', value: 'Men' }] },
            { title: 'Puma Women Basic T-Shirt', description: 'Soft cotton jersey, regular fit, classic Puma logo. Essential women tee.', brand: 'Puma', category: 'T-Shirts', price: 1799, mrp: 2499, rating: 4.1, specs: [{ group: 'Fit', name: 'Style', value: 'Regular Fit' }, { group: 'Material', name: 'Fabric', value: 'Cotton Jersey' }, { group: 'Neck', name: 'Style', value: 'Round Neck' }, { group: 'Sleeves', name: 'Length', value: 'Short Sleeves' }, { group: 'Gender', name: 'For', value: 'Women' }] },
            { title: 'H&M Men Slim Fit Shirt', description: 'Slim fit shirt in cotton quality. Point collar, button cuffs. Casual formal shirt.', brand: 'H&M', category: 'Shirts', price: 2499, mrp: 3999, rating: 4.0, specs: [{ group: 'Fit', name: 'Style', value: 'Slim Fit' }, { group: 'Material', name: 'Fabric', value: 'Cotton' }, { group: 'Collar', name: 'Style', value: 'Point Collar' }, { group: 'Cuffs', name: 'Style', value: 'Button Cuffs' }, { group: 'Gender', name: 'For', value: 'Men' }] },
            { title: 'Zara Women Floral Dress', description: 'Elegant floral printed midi dress with V-neckline and short puff sleeves. Flowy silhouette.', brand: 'Zara', category: 'Dresses', price: 4999, mrp: 6999, rating: 4.3, specs: [{ group: 'Fit', name: 'Style', value: 'Flowy' }, { group: 'Neck', name: 'Style', value: 'V-Neck' }, { group: 'Length', name: 'Length', value: 'Midi' }, { group: 'Sleeves', name: 'Length', value: 'Short Puff Sleeves' }, { group: 'Gender', name: 'For', value: 'Women' }] },
            { title: 'H&M Women Kurta Set', description: 'Cotton kurta with straight pants and dupatta. Floral embroidery details. Ethnic wear set.', brand: 'H&M', category: 'Kurtis', price: 2999, mrp: 4499, rating: 4.1, specs: [{ group: 'Set', name: 'Includes', value: 'Kurta + Pants + Dupatta' }, { group: 'Material', name: 'Fabric', value: 'Cotton' }, { group: 'Neck', name: 'Style', value: 'Round Neck' }, { group: 'Sleeves', name: 'Length', value: 'Three-Quarter' }, { group: 'Gender', name: 'For', value: 'Women' }] },
            { title: 'Nike Mens Dri-FIT Shorts', description: 'Dri-FIT fabric, elastic waist with drawcord, side pockets. Training and gym shorts.', brand: 'Nike', category: 'Shorts', price: 2495, mrp: 3495, rating: 4.2, specs: [{ group: 'Fit', name: 'Style', value: 'Regular Fit' }, { group: 'Material', name: 'Fabric', value: 'Dri-FIT Polyester' }, { group: 'Waist', name: 'Type', value: 'Elastic with Drawcord' }, { group: 'Length', name: 'Length', value: 'Above Knee' }, { group: 'Gender', name: 'For', value: 'Men' }] },
            { title: 'Adidas 3-Stripes Pants', description: 'French terry fabric, tapered fit, iconic 3-Stripes design. Casual track pants.', brand: 'Adidas', category: 'Pants', price: 3499, mrp: 4999, rating: 4.2, specs: [{ group: 'Fit', name: 'Style', value: 'Tapered Fit' }, { group: 'Material', name: 'Fabric', value: 'French Terry Cotton' }, { group: 'Waist', name: 'Type', value: 'Elastic with Drawcord' }, { group: 'Pockets', name: 'Style', value: 'Side Zip Pockets' }, { group: 'Gender', name: 'For', value: 'Men' }] },
            { title: 'Nike Classic Cortez', description: 'Iconic Nike Cortez silhouette, foam midsole, herringbone outsole. Classic sneakers.', brand: 'Nike', category: 'Sneakers', price: 7495, mrp: 9995, rating: 4.4, specs: [{ group: 'Type', name: 'Category', value: 'Lifestyle Sneakers' }, { group: 'Upper', name: 'Material', value: 'Leather/Synthetic' }, { group: 'Sole', name: 'Technology', value: 'Foam Midsole' }, { group: 'Closure', name: 'Type', value: 'Lace-up' }, { group: 'Gender', name: 'For', value: 'Unisex' }] },
            { title: 'Puma Unisex-ADULT Sneakers', description: 'SoftFoam+ comfort sole, mesh upper, lace closure. Everyday casual sneakers.', brand: 'Puma', category: 'Sneakers', price: 4999, mrp: 7999, rating: 4.2, specs: [{ group: 'Type', name: 'Category', value: 'Casual Sneakers' }, { group: 'Upper', name: 'Material', value: 'Mesh/Synthetic' }, { group: 'Sole', name: 'Technology', value: 'SoftFoam+' }, { group: 'Closure', name: 'Type', value: 'Lace-up' }, { group: 'Gender', name: 'For', value: 'Unisex' }] },
            { title: 'Puma Mens Hoodie', description: 'Cotton fleece hoodie with adjustable drawstring hood and kangaroo pocket. Essential pullover.', brand: 'Puma', category: 'Hoodies', price: 3999, mrp: 5999, rating: 4.2, specs: [{ group: 'Fit', name: 'Style', value: 'Regular Fit' }, { group: 'Material', name: 'Fabric', value: 'Cotton Fleece' }, { group: 'Hood', name: 'Type', value: 'Adjustable Drawstring' }, { group: 'Pockets', name: 'Style', value: 'Kangaroo Pocket' }, { group: 'Gender', name: 'For', value: 'Men' }] },
            { title: 'Adidas Men Running Shoes', description: 'Lightweight mesh upper, Cloudfoam midsole, rubber outsole. Performance running shoes.', brand: 'Adidas', category: 'Shoes', price: 5999, mrp: 8999, rating: 4.3, specs: [{ group: 'Type', name: 'Category', value: 'Running Shoes' }, { group: 'Upper', name: 'Material', value: 'Breathable Mesh' }, { group: 'Sole', name: 'Technology', value: 'Cloudfoam' }, { group: 'Closure', name: 'Type', value: 'Lace-up' }, { group: 'Gender', name: 'For', value: 'Men' }] },
            { title: 'WildHorn Casual Shoes', description: 'Suede leather upper, cushioned insole, lace closure. Smart casual shoes for men.', brand: 'WildHorn', category: 'Shoes', price: 2999, mrp: 4999, rating: 4.0, specs: [{ group: 'Type', name: 'Category', value: 'Casual Shoes' }, { group: 'Upper', name: 'Material', value: 'Suede Leather' }, { group: 'Sole', name: 'Material', value: 'Rubber' }, { group: 'Closure', name: 'Type', value: 'Lace-up' }, { group: 'Gender', name: 'For', value: 'Men' }] },
            { title: 'Tommy Hilfiger Men Watch', description: 'Chronograph movement, stainless steel case, leather strap. Premium fashion watch.', brand: 'Tommy Hilfiger', category: 'Watches', price: 14995, mrp: 19995, rating: 4.4, specs: [{ group: 'Movement', name: 'Type', value: 'Chronograph Quartz' }, { group: 'Case', name: 'Material', value: 'Stainless Steel' }, { group: 'Strap', name: 'Material', value: 'Leather' }, { group: 'Water', name: 'Resistance', value: '50M' }, { group: 'Dial', name: 'Size', value: '45mm' }] },
            { title: 'Fossil Men Gen 6 Watch', description: 'Hybrid smartwatch with analog display, activity tracking, notification alerts. Connected watch.', brand: 'Fossil', category: 'Watches', price: 13995, mrp: 17995, rating: 4.3, specs: [{ group: 'Movement', name: 'Type', value: 'Hybrid Smartwatch' }, { group: 'Case', name: 'Material', value: 'Stainless Steel' }, { group: 'Strap', name: 'Material', value: 'Silicone' }, { group: 'Battery', name: 'Life', value: '2+ weeks' }, { group: 'Compatibility', name: 'OS', value: 'Android & iOS' }] },
            { title: 'Titan Women Raga Watch', description: 'Elegant analog watch with mother of pearl dial and mesh strap. Premium women watch.', brand: 'Titan', category: 'Watches', price: 6995, mrp: 9995, rating: 4.2, specs: [{ group: 'Movement', name: 'Type', value: 'Analog Quartz' }, { group: 'Case', name: 'Material', value: 'Stainless Steel' }, { group: 'Strap', name: 'Material', value: 'Metal Mesh' }, { group: 'Dial', name: 'Feature', value: 'Mother of Pearl' }, { group: 'Gender', name: 'For', value: 'Women' }] },
            { title: 'American Tourister Backpack', description: '35L capacity, padded laptop compartment, USB charging port. Travel and college backpack.', brand: 'American Tourister', category: 'Bags', price: 2999, mrp: 4499, rating: 4.3, specs: [{ group: 'Capacity', name: 'Size', value: '35 Liters' }, { group: 'Laptop', name: 'Compartment', value: 'Padded 15.6"' }, { group: 'USB', name: 'Port', value: 'Charging Port' }, { group: 'Material', name: 'Fabric', value: 'Polyester' }, { group: 'Weight', name: 'Weight', value: '600g' }] },
            { title: 'Lavie Women Handbag', description: 'Genuine leather handbag with adjustable strap and multiple compartments. Premium tote bag.', brand: 'Lavie', category: 'Bags', price: 3499, mrp: 5499, rating: 4.1, specs: [{ group: 'Type', name: 'Style', value: 'Tote Bag' }, { group: 'Material', name: 'Fabric', value: 'Genuine Leather' }, { group: 'Compartments', name: 'Count', value: '3' }, { group: 'Strap', name: 'Type', value: 'Adjustable' }, { group: 'Gender', name: 'For', value: 'Women' }] },
            { title: 'Hidesign Men Wallets', description: 'Full grain leather bifold wallet with RFID blocking. 6 card slots, 2 currency compartments.', brand: 'Hidesign', category: 'Wallets', price: 2995, mrp: 4495, rating: 4.3, specs: [{ group: 'Type', name: 'Style', value: 'Bifold' }, { group: 'Material', name: 'Fabric', value: 'Full Grain Leather' }, { group: 'Card', name: 'Slots', value: '6' }, { group: 'RFID', name: 'Protection', value: 'Yes' }, { group: 'Gender', name: 'For', value: 'Men' }] },
            { title: 'Fastrack Reflex VOX Sunglasses', description: 'Polarized UV400 protection, stylish aviator design, lightweight metal frame.', brand: 'Fastrack', category: 'Sunglasses', price: 1299, mrp: 2499, rating: 4.0, specs: [{ group: 'Frame', name: 'Material', value: 'Metal' }, { group: 'Lens', name: 'Type', value: 'Polarized' }, { group: 'Protection', name: 'UV', value: 'UV400' }, { group: 'Style', name: 'Design', value: 'Aviator' }, { group: 'Gender', name: 'For', value: 'Unisex' }] },
            // ---- MORE HOME APPLIANCES ----
            { title: 'LG 7 kg Front Load Washing Machine', description: 'AI DD, 6 Motion, Steam, 1200 RPM, Inverter motor. Smart washing machine.', brand: 'LG', category: 'Washing Machines', price: 39990, mrp: 49990, rating: 4.4, specs: [{ group: 'Capacity', name: 'Load', value: '7 kg' }, { group: 'Type', name: 'Load Type', value: 'Front Load' }, { group: 'Speed', name: 'Spin', value: '1200 RPM' }, { group: 'Motor', name: 'Type', value: 'Inverter Direct Drive' }, { group: 'Technology', name: 'Wash', value: 'AI DD + Steam' }] },
            { title: 'Samsung 1.5 Ton 5-Star Inverter AC', description: 'Triple inverter, WindFree cooling, WiFi, 5-star energy rating. Premium split AC.', brand: 'Samsung', category: 'Air Conditioners', price: 49990, mrp: 59990, rating: 4.5, specs: [{ group: 'Capacity', name: 'Tonnage', value: '1.5 Ton' }, { group: 'Rating', name: 'Star', value: '5-Star' }, { group: 'Type', name: 'Type', value: 'Split AC' }, { group: 'Technology', name: 'Cooling', value: 'WindFree + Triple Inverter' }, { group: 'WiFi', name: 'Smart', value: 'Yes' }] },
            { title: 'Whirlpool 265L Refrigerator', description: 'Intellifresh inverter, 6th Sense technology, convertible. Frost-free refrigerator.', brand: 'Whirlpool', category: 'Refrigerators', price: 32990, mrp: 39990, rating: 4.3, specs: [{ group: 'Capacity', name: 'Size', value: '265 Liters' }, { group: 'Type', name: 'Type', value: 'Frost-Free' }, { group: 'Technology', name: 'Inverter', value: 'Intellifresh' }, { group: 'Rating', name: 'Star', value: '3-Star' }, { group: 'Feature', name: 'Convertible', value: 'Yes' }] },
            { title: 'IFB 25L Convection Microwave', description: '25L capacity, convection mode, auto cook, stainless steel cavity. Versatile microwave oven.', brand: 'IFB', category: 'Microwave Ovens', price: 16990, mrp: 21990, rating: 4.2, specs: [{ group: 'Capacity', name: 'Size', value: '25 Liters' }, { group: 'Type', name: 'Type', value: 'Convection' }, { group: 'Power', name: 'Watts', value: '1000W' }, { group: 'Cavity', name: 'Material', value: 'Stainless Steel' }, { group: 'Auto', name: 'Cook', value: 'Auto Cook Menu' }] },
            // ---- BEAUTY & PERSONAL CARE ----
            { title: 'Dove Daily Care Shampoo', description: 'Mild cleansers with Nutri-Actives for healthy, nourished hair. Daily use shampoo.', brand: 'Dove', category: 'Shampoo', price: 399, mrp: 649, rating: 4.3, specs: [{ group: 'Type', name: 'Category', value: 'Daily Care' }, { group: 'Size', name: 'Volume', value: '650ml' }, { group: 'Hair', name: 'Type', value: 'All Hair Types' }, { group: 'Feature', name: 'Benefit', value: 'Nourishment + Mild Cleanse' }, { group: 'Brand', name: 'Range', value: 'Dove Daily Care' }] },
            { title: 'L\'Oreal Paris Shampoo', description: 'Professional care with Pro-Keratin & Ceramide. Strengthens and repairs damaged hair.', brand: 'L\'Oreal', category: 'Shampoo', price: 499, mrp: 749, rating: 4.3, specs: [{ group: 'Type', name: 'Category', value: 'Hair Repair' }, { group: 'Size', name: 'Volume', value: '400ml' }, { group: 'Hair', name: 'Type', value: 'Damaged Hair' }, { group: 'Technology', name: 'Formula', value: 'Pro-Keratin + Ceramide' }, { group: 'Brand', name: 'Range', value: 'L\'Oreal Paris' }] },
            { title: 'Maybelline Fit Me Foundation', description: 'Lightweight liquid foundation with SPF 18. Natural matte finish, 30+ shades.', brand: 'Maybelline', category: 'Makeup', price: 699, mrp: 999, rating: 4.2, specs: [{ group: 'Type', name: 'Category', value: 'Liquid Foundation' }, { group: 'Finish', name: 'Type', value: 'Natural Matte' }, { group: 'SPF', name: 'Protection', value: 'SPF 18' }, { group: 'Shades', name: 'Range', value: '30+' }, { group: 'Skin', name: 'Type', value: 'Normal to Oily' }] },
            { title: 'Lakme Absolute Matte Lipstick', description: 'Intense color with matte finish, enriched with Vitamin E. Long-lasting lipstick.', brand: 'Lakme', category: 'Lipstick', price: 899, mrp: 1199, rating: 4.3, specs: [{ group: 'Type', name: 'Category', value: 'Matte Lipstick' }, { group: 'Finish', name: 'Type', value: 'Matte' }, { group: 'Benefit', name: 'Feature', value: 'Vitamin E Enriched' }, { group: 'Longevity', name: 'Wear', value: '8 Hours' }, { group: 'Shades', name: 'Range', value: '15 Shades' }] },
            { title: 'Nivea Sunscreen SPF 50', description: 'Broad spectrum UVA/UVB protection with SPF 50. Lightweight, non-greasy formula.', brand: 'Nivea', category: 'Sunscreen', price: 499, mrp: 799, rating: 4.3, specs: [{ group: 'SPF', name: 'Protection', value: 'SPF 50 PA+++' }, { group: 'Water', name: 'Resistance', value: 'Yes' }, { group: 'Size', name: 'Volume', value: '100ml' }, { group: 'Skin', name: 'Type', value: 'All Skin Types' }, { group: 'Texture', name: 'Feel', value: 'Lightweight Non-Greasy' }] },
            { title: 'Neutrogena Face Wash', description: 'Oil-free acne wash with salicylic acid. Deep cleans without over-drying. Dermatologist recommended.', brand: 'Neutrogena', category: 'Face Wash', price: 449, mrp: 649, rating: 4.3, specs: [{ group: 'Type', name: 'Category', value: 'Acne Wash' }, { group: 'Active', name: 'Ingredient', value: 'Salicylic Acid 2%' }, { group: 'Size', name: 'Volume', value: '200ml' }, { group: 'Skin', name: 'Type', value: 'Acne-prone' }, { group: 'Feature', name: 'Benefit', value: 'Oil-Free Non-Comedogenic' }] },
            { title: 'Garnier Face Wash', description: 'Vitamin C brightening face wash with lemon extract. Removes impurities for glowing skin.', brand: 'Garnier', category: 'Face Wash', price: 299, mrp: 499, rating: 4.1, specs: [{ group: 'Type', name: 'Category', value: 'Brightening' }, { group: 'Active', name: 'Ingredient', value: 'Vitamin C + Lemon' }, { group: 'Size', name: 'Volume', value: '200ml' }, { group: 'Skin', name: 'Type', value: 'All Skin Types' }, { group: 'Feature', name: 'Benefit', value: 'Brightening + Glow' }] },
            { title: 'Davidoff Cool Water Perfume', description: 'Fresh aquatic fragrance with sea notes, mint, and lavender. Iconic men cologne.', brand: 'Davidoff', category: 'Perfume', price: 3999, mrp: 5499, rating: 4.5, specs: [{ group: 'Type', name: 'Category', value: 'Eau de Toilette' }, { group: 'Size', name: 'Volume', value: '125ml' }, { group: 'Gender', name: 'For', value: 'Men' }, { group: 'Fragrance', name: 'Notes', value: 'Aquatic, Fresh, Woody' }, { group: 'Longevity', name: 'Duration', value: '4-6 Hours' }] },
            { title: 'Park Avenue Perfume', description: 'Fresh and sophisticated fragrance with citrus, floral, and woody notes. Premium men perfume.', brand: 'Park Avenue', category: 'Perfume', price: 699, mrp: 1099, rating: 4.0, specs: [{ group: 'Type', name: 'Category', value: 'Eau de Toilette' }, { group: 'Size', name: 'Volume', value: '100ml' }, { group: 'Gender', name: 'For', value: 'Men' }, { group: 'Fragrance', name: 'Notes', value: 'Citrus, Floral, Woody' }, { group: 'Longevity', name: 'Duration', value: '3-4 Hours' }] },
            { title: 'Philips Beard Trimmer', description: 'Self-sharpening blades, 20 length settings, 60 min runtime, washable. Premium grooming.', brand: 'Philips', category: 'Trimmer', price: 2499, mrp: 3499, rating: 4.4, specs: [{ group: 'Type', name: 'Category', value: 'Beard Trimmer' }, { group: 'Settings', name: 'Length', value: '20 (0.5-10mm)' }, { group: 'Battery', name: 'Life', value: '60 minutes' }, { group: 'Blade', name: 'Type', value: 'Self-Sharpening' }, { group: 'Water', name: 'Resistance', value: 'Washable' }] },
            { title: 'Havells Hair Dryer', description: '2000W, 2 speed settings, cool shot button, concentrator nozzle. Professional hair dryer.', brand: 'Havells', category: 'Hair Dryer', price: 1999, mrp: 2999, rating: 4.2, specs: [{ group: 'Power', name: 'Watts', value: '2000W' }, { group: 'Settings', name: 'Speed', value: '2 Speed + 3 Heat' }, { group: 'Feature', name: 'Cool Shot', value: 'Yes' }, { group: 'Accessories', name: 'Nozzle', value: 'Concentrator' }, { group: 'Weight', name: 'Weight', value: '450g' }] }
        ];

        // Create products with images and specs
        const createdProducts = [];
        for (const data of productData) {
            const { brand, category, price, mrp, rating, specs, ...rest } = data;
            const images = productImages(rest.title, category);
            const modelNumber = rest.title.toLowerCase().startsWith(brand.toLowerCase())
                ? rest.title.slice(brand.length).trim()
                : rest.title;
            const product = await Product.create({
                ...rest,
                images,
                modelNumber,
                specifications: specs || [],
                category: catMap[category],
                brand: brandMap[brand],
                basePrice: price || 0,
                baseMrp: mrp || price || 0,
                rating: { average: rating || 4.0, count: Math.floor(Math.random() * 500) + 50 },
                searchKeywords: [rest.title.toLowerCase(), ...rest.title.toLowerCase().split(' ')],
                tags: [category.toLowerCase(), brand.toLowerCase(), ...rest.title.toLowerCase().split(' ').slice(0, 3)],
                status: 'active',
                stats: {
                    viewCount: Math.floor(Math.random() * 10000) + 500,
                    compareCount: Math.floor(Math.random() * 500) + 50,
                    wishlistCount: Math.floor(Math.random() * 200) + 20
                }
            });
            createdProducts.push({ product, price, mrp, category });
        }

        // ========== STORES ==========
        const stores = await Store.insertMany([
            { name: 'Amazon India', providerKey: 'amazon', websiteUrl: 'https://www.amazon.in', isActive: true, isConfigured: true, priority: 1 },
            { name: 'Flipkart', providerKey: 'flipkart', websiteUrl: 'https://www.flipkart.com', isActive: true, isConfigured: true, priority: 2 },
            { name: 'Croma', providerKey: 'croma', websiteUrl: 'https://www.croma.com', isActive: true, isConfigured: true, priority: 3 },
            { name: 'Reliance Digital', providerKey: 'reliancedigital', websiteUrl: 'https://www.reliancedigital.in', isActive: true, isConfigured: true, priority: 4 },
            { name: 'Vijay Sales', providerKey: 'vijaysales', websiteUrl: 'https://www.vijaysales.com', isActive: true, isConfigured: true, priority: 5 },
            { name: 'Tata Cliq', providerKey: 'tatacliq', websiteUrl: 'https://www.tatacliq.com', isActive: true, isConfigured: true, priority: 6 },
            { name: 'Myntra', providerKey: 'myntra', websiteUrl: 'https://www.myntra.com', isActive: true, isConfigured: true, priority: 7 },
            { name: 'Ajio', providerKey: 'ajio', websiteUrl: 'https://www.ajio.com', isActive: true, isConfigured: true, priority: 8 },
            { name: 'Meesho', providerKey: 'meesho', websiteUrl: 'https://www.meesho.com', isActive: true, isConfigured: true, priority: 9 },
            { name: 'Snapdeal', providerKey: 'snapdeal', websiteUrl: 'https://www.snapdeal.com', isActive: true, isConfigured: true, priority: 10 }
        ]);

        const storeMap = Object.fromEntries(stores.map(s => [s.providerKey, s._id]));

        // ========== STORE PRODUCTS & PRICE HISTORY ==========
        // Stores are only assigned per-product from the set that plausibly sells that
        // category, so e.g. a tablet never shows up "available on Ajio/Myntra" (fashion-only)
        // and a t-shirt never shows up "available on Croma" (electronics-only).
        const CATEGORY_STORE_GROUPS = {
            electronics: ['amazon', 'flipkart', 'croma', 'reliancedigital', 'vijaysales', 'tatacliq'],
            fashion: ['myntra', 'ajio', 'tatacliq', 'amazon', 'flipkart', 'meesho', 'snapdeal'],
            beauty: ['amazon', 'flipkart', 'myntra', 'ajio', 'meesho'],
            sports: ['amazon', 'flipkart', 'snapdeal', 'meesho'],
            home: ['amazon', 'flipkart', 'croma', 'reliancedigital']
        };
        const CATEGORY_TO_GROUP = {
            'Air Conditioners': 'electronics', Cameras: 'electronics', Earbuds: 'electronics',
            'Gaming Consoles': 'electronics', 'Hair Dryer': 'electronics', Headphones: 'electronics',
            Laptops: 'electronics', 'Microwave Ovens': 'electronics', Mobiles: 'electronics',
            Monitors: 'electronics', Refrigerators: 'electronics', 'Smart TVs': 'electronics',
            'Smart Watches': 'electronics', Speakers: 'electronics', Tablets: 'electronics',
            Trimmer: 'electronics', 'Vacuum Cleaner': 'electronics', 'Washing Machines': 'electronics',
            Bags: 'fashion', Dresses: 'fashion', Hoodies: 'fashion', Jackets: 'fashion', Jeans: 'fashion',
            Kurtis: 'fashion', Pants: 'fashion', Shirts: 'fashion', Shoes: 'fashion', Shorts: 'fashion',
            Sneakers: 'fashion', Sunglasses: 'fashion', 'T-Shirts': 'fashion', Wallets: 'fashion', Watches: 'fashion',
            'Face Wash': 'beauty', Lipstick: 'beauty', Makeup: 'beauty', Perfume: 'beauty',
            Shampoo: 'beauty', Sunscreen: 'beauty',
            Badminton: 'sports', 'Cricket Equipment': 'sports', Football: 'sports',
            Cookware: 'home'
        };
        const storesForCategory = (category) => CATEGORY_STORE_GROUPS[CATEGORY_TO_GROUP[category]] || CATEGORY_STORE_GROUPS.electronics;

        // "Visit Store" must never open a fabricated/dead product-slug URL, so
        // it links to that store's real, live search-results page for the
        // product name instead (verified against each real domain) — the
        // closest honest equivalent since these are simulated listings with
        // no real page to deep-link to.
        const STORE_SEARCH_URL = {
            amazon: (q) => `https://www.amazon.in/s?k=${q}`,
            flipkart: (q) => `https://www.flipkart.com/search?q=${q}`,
            croma: (q) => `https://www.croma.com/search/?text=${q}`,
            // Reliance Digital's search is client-side-only — even hitting its
            // own internal search route via a fresh navigation falls back to
            // the bare homepage shell (no server-side render for that route),
            // so a direct link to it can't be made to work.
            // Vijay Sales' /search-listing route does render real results, but
            // its own relevance ranking is unreliable for exact model queries —
            // verified live that "Galaxy S24 Ultra" (with or without the brand
            // name) surfaces phone cases/accessories ahead of the actual phone.
            // Since which query "happens" to rank the real product first isn't
            // predictable from our side, the homepage is the only link that
            // reliably shows the real product rather than an unrelated one.
            reliancedigital: () => `https://www.reliancedigital.in/`,
            vijaysales: () => `https://www.vijaysales.com/`,
            tatacliq: (q) => `https://www.tatacliq.com/search/?searchCategory=all&text=${q}`,
            myntra: (q) => `https://www.myntra.com/${q}`,
            ajio: (q) => `https://www.ajio.com/search/?text=${q}`,
            meesho: (q) => `https://www.meesho.com/search?q=${q}`,
            snapdeal: (q) => `https://www.snapdeal.com/search?keyword=${q}`
        };
        const buildStoreUrl = (storeKey, title) => STORE_SEARCH_URL[storeKey](encodeURIComponent(title));

        // Deterministic per-product PRNG (seeded by the product's own slug) so
        // which stores a product is listed on stays stable across re-seeds —
        // otherwise every `npm run seed` reshuffles the store list per product
        // via Math.random(), which looks like stores randomly "disappearing".
        const seededRandom = (seed) => {
            let h = 0;
            for (let i = 0; i < seed.length; i += 1) h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
            return () => {
                h = Math.imul(h ^ (h >>> 15), h | 1);
                h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
                return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
            };
        };

        // `.sort(() => rand() - 0.5)` is not a real shuffle — a sort algorithm
        // adaptively decides which elements to compare based on prior results,
        // so feeding it fresh random values on every call produces a different,
        // engine-dependent permutation even from the same seed. A real
        // Fisher-Yates shuffle is what's actually deterministic.
        const shuffle = (array, rand) => {
            const result = [...array];
            for (let i = result.length - 1; i > 0; i -= 1) {
                const j = Math.floor(rand() * (i + 1));
                [result[i], result[j]] = [result[j], result[i]];
            }
            return result;
        };

        for (const { product, price, mrp, category }
            of createdProducts) {
            const rand = seededRandom(product.slug || product.title);
            // Amazon and Flipkart are the two dominant marketplaces that carry
            // virtually every popular product in India — it looks unrealistic
            // for one to have a listing and not the other, so both are always
            // included (when eligible for the category) rather than being
            // subject to the same random chance as the smaller, more selective
            // retailers (Croma, Vijay Sales, etc).
            const eligibleStores = storesForCategory(category);
            const anchorStores = ['amazon', 'flipkart'].filter((s) => eligibleStores.includes(s));
            const remainingStores = eligibleStores.filter((s) => !anchorStores.includes(s));
            const numStores = Math.min(Math.floor(rand() * 4) + 3, eligibleStores.length);
            const extraCount = Math.max(0, numStores - anchorStores.length);
            const shuffledStores = [...anchorStores, ...shuffle(remainingStores, rand).slice(0, extraCount)];

            for (const storeKey of shuffledStores) {
                const storeId = storeMap[storeKey];
                // MRP is set by the manufacturer and is the same everywhere (as in
                // real life), so it stays fixed across stores. Only the actual
                // selling price varies per store — 2%-20% below MRP, matching how
                // real retailers discount (previously both price AND MRP were
                // scaled by the same factor, which silently froze every store's
                // discount % at the same value and made prices look inflated
                // compared to a real store like Flipkart).
                const storeMrp = Math.round(mrp || price * 1.2);
                const variation = 1 - (rand() * 0.18 + 0.02);
                const storePrice = Math.round(storeMrp * variation);
                const discount = Math.round((1 - storePrice / storeMrp) * 100);

                const sp = await StoreProduct.create({
                    product: product._id,
                    store: storeId,
                    storeProductId: `${storeKey.toUpperCase()}-${product._id}`,
                    title: product.title,
                    url: buildStoreUrl(storeKey, product.title),
                    imageUrl: (product.images[0] && product.images[0].url) || defaultImage,
                    price: { amount: storePrice, currency: 'INR' },
                    mrp: { amount: storeMrp, currency: 'INR' },
                    discountPercent: Math.min(discount, 70),
                    deliveryCharge: { amount: Math.random() > 0.5 ? 0 : 49, currency: 'INR' },
                    availability: Math.random() > 0.15 ? 'in_stock' : 'out_of_stock',
                    rating: { average: 3.5 + Math.random() * 1.5, count: Math.floor(Math.random() * 300) + 20 },
                    seller: { name: `${storeKey.charAt(0).toUpperCase() + storeKey.slice(1)} Seller`, rating: Math.floor(Math.random() * 2) + 3 },
                    lastSyncedAt: new Date()
                });

                // Create 30 days of price history
                const entries = [];
                const basePrice = storePrice;
                for (let d = 29; d >= 0; d--) {
                    const observedAt = new Date(Date.now() - d * 24 * 60 * 60 * 1000);
                    const delta = (Math.random() - 0.5) * 0.15;
                    const priceAmt = Math.max(1, Math.round(basePrice * (1 + delta)));
                    entries.push({
                        product: product._id,
                        storeProduct: sp._id,
                        store: storeId,
                        price: { amount: priceAmt, currency: 'INR' },
                        mrp: { amount: Math.round(priceAmt * 1.2), currency: 'INR' },
                        discountPercent: Math.min(Math.round((1 - priceAmt / (priceAmt * 1.2)) * 100), 70),
                        observedAt
                    });
                }
                await PriceHistory.insertMany(entries);
            }
        }

        // ========== REVIEWS ==========
        const reviewTexts = [
            { title: 'Excellent product!', body: 'Really happy with this purchase. Worth every penny.', rating: 5 },
            { title: 'Good value for money', body: 'Product meets expectations. Great quality at this price point.', rating: 4 },
            { title: 'Decent product', body: 'Works as described. Could be better in some areas.', rating: 3 },
            { title: 'Great quality', body: 'Amazing quality and fast delivery. Highly recommend!', rating: 5 },
            { title: 'Love it!', body: 'Best purchase I made this year. Absolutely love the product.', rating: 5 },
            { title: 'Good but not great', body: 'Product is good but there are better options available.', rating: 3 },
            { title: 'Perfect!', body: 'Exactly what I was looking for. Great product and service.', rating: 5 },
            { title: 'Worth buying', body: 'Good product for the price. Would recommend to others.', rating: 4 }
        ];

        const reviewPromises = [];
        const userIds = [demo._id, admin._id];
        for (const { product }
            of createdProducts.slice(0, 30)) {
            // Use up to 2 reviews per product, one per user to avoid unique constraint violation
            const numReviews = Math.min(Math.floor(Math.random() * 2) + 1, userIds.length);
            const usedUsers = new Set();
            for (let i = 0; i < numReviews; i++) {
                const userIdx = i % userIds.length;
                if (usedUsers.has(userIds[userIdx].toString())) continue;
                usedUsers.add(userIds[userIdx].toString());
                const review = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
                reviewPromises.push(
                    Review.create({
                        user: userIds[userIdx],
                        product: product._id,
                        rating: review.rating,
                        title: review.title,
                        body: review.body,
                        status: 'approved'
                    })
                );
            }
        }
        await Promise.all(reviewPromises);

        logger.info('Seeded data successfully', {
            products: createdProducts.length,
            categories: categories.length,
            brands: brands.length,
            stores: stores.length,
            users: 2,
            reviews: reviewPromises.length
        });
        process.exit(0);
    } catch (err) {
        logger.error('Seeding failed', { error: err.message, stack: err.stack });
        process.exit(1);
    }
}

seed();