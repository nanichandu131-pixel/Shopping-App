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

await connectDatabase();

const IMG_BASE = 'https://images.unsplash.com/photo-';

const PRODUCT_IMAGES = {
    'iPhone 15 Pro Max': [
        `${IMG_BASE}1695548166542-f801342aa0e9?w=400&h=400&fit=crop`,
        `${IMG_BASE}1700905359360-e42e00f0f2e9?w=400&h=400&fit=crop`,
        `${IMG_BASE}1695048077542-0f2c5a1cdc0e?w=400&h=400&fit=crop`
    ],
    'iPhone 16 Pro Max': [
        `${IMG_BASE}1695548166542-f801342aa0e9?w=400&h=400&fit=crop`,
        `${IMG_BASE}1700905359360-e42e00f0f2e9?w=400&h=400&fit=crop`
    ],
    'iPhone 16': [
        `${IMG_BASE}1695548166542-f801342aa0e9?w=400&h=400&fit=crop`,
        `${IMG_BASE}1700905359360-e42e00f0f2e9?w=400&h=400&fit=crop`
    ],
    'Samsung Galaxy S24 Ultra': [
        `${IMG_BASE}1610945416103-040e224ef779?w=400&h=400&fit=crop`,
        `${IMG_BASE}1598327107587-65530ed5c0dd?w=400&h=400&fit=crop`
    ],
    'Samsung Galaxy S25 Ultra': [
        `${IMG_BASE}1610945416103-040e224ef779?w=400&h=400&fit=crop`,
        `${IMG_BASE}1598327107587-65530ed5c0dd?w=400&h=400&fit=crop`
    ],
    'OnePlus 12': [
        `${IMG_BASE}1678911821640-1e8b5d2c4c5a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1610945416103-040e224ef779?w=400&h=400&fit=crop`
    ],
    'OnePlus 13': [
        `${IMG_BASE}1678911821640-1e8b5d2c4c5a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1610945416103-040e224ef779?w=400&h=400&fit=crop`
    ],
    'Xiaomi 14 Pro': [
        `${IMG_BASE}1610945416103-040e224ef779?w=400&h=400&fit=crop`,
        `${IMG_BASE}1598327107587-65530ed5c0dd?w=400&h=400&fit=crop`
    ],
    'Xiaomi 15 Pro': [
        `${IMG_BASE}1610945416103-040e224ef779?w=400&h=400&fit=crop`,
        `${IMG_BASE}1598327107587-65530ed5c0dd?w=400&h=400&fit=crop`
    ],
    'Vivo X100 Pro': [
        `${IMG_BASE}1610945416103-040e224ef779?w=400&h=400&fit=crop`,
        `${IMG_BASE}1678911821640-1e8b5d2c4c5a?w=400&h=400&fit=crop`
    ],
    'Vivo X200 Pro': [
        `${IMG_BASE}1610945416103-040e224ef779?w=400&h=400&fit=crop`,
        `${IMG_BASE}1678911821640-1e8b5d2c4c5a?w=400&h=400&fit=crop`
    ],
    'OPPO Find X8 Pro': [
        `${IMG_BASE}1610945416103-040e224ef779?w=400&h=400&fit=crop`,
        `${IMG_BASE}1598327107587-65530ed5c0dd?w=400&h=400&fit=crop`
    ],
    'Realme GT 7 Pro': [
        `${IMG_BASE}1610945416103-040e224ef779?w=400&h=400&fit=crop`,
        `${IMG_BASE}1598327107587-65530ed5c0dd?w=400&h=400&fit=crop`
    ],
    'Motorola Edge 50 Ultra': [
        `${IMG_BASE}1610945416103-040e224ef779?w=400&h=400&fit=crop`,
        `${IMG_BASE}1598327107587-65530ed5c0dd?w=400&h=400&fit=crop`
    ],
    'Nothing Phone 3': [
        `${IMG_BASE}1610945416103-040e224ef779?w=400&h=400&fit=crop`,
        `${IMG_BASE}1598327107587-65530ed5c0dd?w=400&h=400&fit=crop`
    ],
    'Google Pixel 9 Pro': [
        `${IMG_BASE}1610945416103-040e224ef779?w=400&h=400&fit=crop`,
        `${IMG_BASE}1598327107587-65530ed5c0dd?w=400&h=400&fit=crop`
    ],
    'MacBook Air M3': [
        `${IMG_BASE}1517336714731-489689fd1ca8?w=400&h=400&fit=crop`,
        `${IMG_BASE}1496183938118-9b2b25b5c3e0?w=400&h=400&fit=crop`
    ],
    'MacBook Pro 14 M3': [
        `${IMG_BASE}1517336714731-489689fd1ca8?w=400&h=400&fit=crop`,
        `${IMG_BASE}1496183938118-9b2b25b5c3e0?w=400&h=400&fit=crop`
    ],
    'Dell XPS 15': [
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`,
        `${IMG_BASE}1496183938118-9b2b25b5c3e0?w=400&h=400&fit=crop`
    ],
    'HP Spectre x360': [
        `${IMG_BASE}1496183938118-9b2b25b5c3e0?w=400&h=400&fit=crop`,
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`
    ],
    'Lenovo ThinkPad X1 Carbon': [
        `${IMG_BASE}1496183938118-9b2b25b5c3e0?w=400&h=400&fit=crop`,
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`
    ],
    'iPad Pro M4 12.9"': [
        `${IMG_BASE}1561154154-6b6368f9d5e3?w=400&h=400&fit=crop`,
        `${IMG_BASE}1544240634-7569f3c6c0e0?w=400&h=400&fit=crop`
    ],
    'Samsung Galaxy Tab S9': [
        `${IMG_BASE}1561154154-6b6368f9d5e3?w=400&h=400&fit=crop`,
        `${IMG_BASE}1589736565314-307b9b6c1e9a?w=400&h=400&fit=crop`
    ],
    'Apple Watch Ultra 2': [
        `${IMG_BASE}1546868908-6e2c6c7c0b2a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1579583869673-0b9e5e7c1d4a?w=400&h=400&fit=crop`
    ],
    'Samsung Galaxy Watch 6': [
        `${IMG_BASE}1546868908-6e2c6c7c0b2a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1523278685689-4f7a0b0c3d8e?w=400&h=400&fit=crop`
    ],
    'Sony WH-1000XM5': [
        `${IMG_BASE}1505740422128-0c1e8f9b0a2e?w=400&h=400&fit=crop`,
        `${IMG_BASE}1583394833952-9c6b2b0c7d4a?w=400&h=400&fit=crop`
    ],
    'AirPods Pro 2': [
        `${IMG_BASE}1606747592598-3e4b8c3d0e1a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1583394833952-9c6b2b0c7d4a?w=400&h=400&fit=crop`
    ],
    'Samsung Galaxy Buds2 Pro': [
        `${IMG_BASE}1583394833952-9c6b2b0c7d4a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1606747592598-3e4b8c3d0e1a?w=400&h=400&fit=crop`
    ],
    'Canon EOS R5': [
        `${IMG_BASE}1510124475477-5d7e1f8e9c3a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1502920910578-5c7b9c3d0e1a?w=400&h=400&fit=crop`
    ],
    'Sony A7 IV': [
        `${IMG_BASE}1502920910578-5c7b9c3d0e1a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1510124475477-5d7e1f8e9c3a?w=400&h=400&fit=crop`
    ],
    'Nike Air Max 270': [
        `${IMG_BASE}1542299822-8e5e8f4c3d2a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1606102637195-1f9b4c3d0e1a?w=400&h=400&fit=crop`
    ],
    'Adidas Ultraboost 23': [
        `${IMG_BASE}1606102637195-1f9b4c3d0e1a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1542299822-8e5e8f4c3d2a?w=400&h=400&fit=crop`
    ],
    'Levi\'s 501 Original Fit Jeans': [
        `${IMG_BASE}1570366512977-8b9e3b4c5d6e?w=400&h=400&fit=crop`,
        `${IMG_BASE}1606102637195-1f9b4c3d0e1a?w=400&h=400&fit=crop`
    ],
    'Ray-Ban Aviator Classic': [
        `${IMG_BASE}1572635196237-0b4c5d6e7f8a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1508296367890-1b9c3d4e5f6a?w=400&h=400&fit=crop`
    ],
    'Samsung 65" Neo QLED 4K QN90C': [
        `${IMG_BASE}1593359674512-3d5e6f7a8b9c?w=400&h=400&fit=crop`,
        `${IMG_BASE}1461151305030-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ],
    'LG 55" OLED C3': [
        `${IMG_BASE}1461151305030-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1593359674512-3d5e6f7a8b9c?w=400&h=400&fit=crop`
    ],
    'Dyson V15 Detect Vacuum': [
        `${IMG_BASE}1558618666-0b4c5d6e7f8a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1527515545081-5d6e7f8a9b0c?w=400&h=400&fit=crop`
    ],
    'Instant Pot Duo Plus 6-Qt': [
        `${IMG_BASE}1556909114-5c3d4e5f6a7b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1590798184920-5b6c7d8e9f0a?w=400&h=400&fit=crop`
    ],
    'CRDT Kashmir Willow Cricket Bat': [
        `${IMG_BASE}1531415075-5c3d4e5f6a7b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587280505175-5c3d4e5f6a7b?w=400&h=400&fit=crop`
    ],
    'Cosco 5-A-Side Football Size 5': [
        `${IMG_BASE}1577465084223-5c3d4e5f6a7b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587280505175-5c3d4e5f6a7b?w=400&h=400&fit=crop`
    ],
    'Yonex Nanoray 7000i Badminton Racket': [
        `${IMG_BASE}1623681012032-5c3d4e5f6a7b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587280505175-5c3d4e5f6a7b?w=400&h=400&fit=crop`
    ],
    'iPad Air M2': [
        `${IMG_BASE}1561154154-6b6368f9d5e3?w=400&h=400&fit=crop`,
        `${IMG_BASE}1544240634-7569f3c6c0e0?w=400&h=400&fit=crop`
    ],
    'Lenovo Tab P12 Pro': [
        `${IMG_BASE}1561154154-6b6368f9d5e3?w=400&h=400&fit=crop`,
        `${IMG_BASE}1589736565314-307b9b6c1e9a?w=400&h=400&fit=crop`
    ],
    'Xiaomi Pad 6 Pro': [
        `${IMG_BASE}1561154154-6b6368f9d5e3?w=400&h=400&fit=crop`,
        `${IMG_BASE}1544240634-7569f3c6c0e0?w=400&h=400&fit=crop`
    ],
    'OnePlus Pad Go': [
        `${IMG_BASE}1561154154-6b6368f9d5e3?w=400&h=400&fit=crop`,
        `${IMG_BASE}1589736565314-307b9b6c1e9a?w=400&h=400&fit=crop`
    ],
    'Fitbit Charge 6': [
        `${IMG_BASE}1546868908-6e2c6c7c0b2a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1523278685689-4f7a0b0c3d8e?w=400&h=400&fit=crop`
    ],
    'Noise ColorFit Pro 5': [
        `${IMG_BASE}1546868908-6e2c6c7c0b2a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1523278685689-4f7a0b0c3d8e?w=400&h=400&fit=crop`
    ],
    'boAt Lunar Pro': [
        `${IMG_BASE}1546868908-6e2c6c7c0b2a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1523278685689-4f7a0b0c3d8e?w=400&h=400&fit=crop`
    ],
    'Garmin Venu 3': [
        `${IMG_BASE}1546868908-6e2c6c7c0b2a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1523278685689-4f7a0b0c3d8e?w=400&h=400&fit=crop`
    ],
    'Bose QuietComfort Ultra': [
        `${IMG_BASE}1505740422128-0c1e8f9b0a2e?w=400&h=400&fit=crop`,
        `${IMG_BASE}1583394833952-9c6b2b0c7d4a?w=400&h=400&fit=crop`
    ],
    'JBL Tune 770NC': [
        `${IMG_BASE}1505740422128-0c1e8f9b0a2e?w=400&h=400&fit=crop`,
        `${IMG_BASE}1583394833952-9c6b2b0c7d4a?w=400&h=400&fit=crop`
    ],
    'Marshall Major IV': [
        `${IMG_BASE}1505740422128-0c1e8f9b0a2e?w=400&h=400&fit=crop`,
        `${IMG_BASE}1583394833952-9c6b2b0c7d4a?w=400&h=400&fit=crop`
    ],
    'Sennheiser Momentum 4': [
        `${IMG_BASE}1505740422128-0c1e8f9b0a2e?w=400&h=400&fit=crop`,
        `${IMG_BASE}1583394833952-9c6b2b0c7d4a?w=400&h=400&fit=crop`
    ],
    'boAt Airdopes 141 Pro': [
        `${IMG_BASE}1583394833952-9c6b2b0c7d4a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1606747592598-3e4b8c3d0e1a?w=400&h=400&fit=crop`
    ],
    'JBL Go 4': [
        `${IMG_BASE}1583394833952-9c6b2b0c7d4a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1606747592598-3e4b8c3d0e1a?w=400&h=400&fit=crop`
    ],
    'Marshall Emberton III': [
        `${IMG_BASE}1583394833952-9c6b2b0c7d4a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1606747592598-3e4b8c3d0e1a?w=400&h=400&fit=crop`
    ],
    'Sony SRS-XB100': [
        `${IMG_BASE}1583394833952-9c6b2b0c7d4a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1606747592598-3e4b8c3d0e1a?w=400&h=400&fit=crop`
    ],
    'Sony PlayStation 5 Slim': [
        `${IMG_BASE}1675207345601-4c6d8e9f0a1b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1606811845192-5c7d8e9f0a1b?w=400&h=400&fit=crop`
    ],
    'Xbox Series X': [
        `${IMG_BASE}1621259184378-5c6d7e8f9a0b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1606811845192-5c7d8e9f0a1b?w=400&h=400&fit=crop`
    ],
    'Nintendo Switch OLED': [
        `${IMG_BASE}1663039032874-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1606811845192-5c7d8e9f0a1b?w=400&h=400&fit=crop`
    ],
    'Samsung 32" M8 Smart Monitor': [
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`,
        `${IMG_BASE}1461151305030-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ],
    'LG 27" UltraGear Gaming Monitor': [
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`,
        `${IMG_BASE}1461151305030-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ],
    'Nike Men Dri-FIT T-Shirt': [
        `${IMG_BASE}1576566588095-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1618354632961-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ],
    'Adidas Men Essential T-Shirt': [
        `${IMG_BASE}1576566588095-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1618354632961-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ],
    'Puma Women Basic T-Shirt': [
        `${IMG_BASE}1576566588095-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1618354632961-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ],
    'H&M Men Slim Fit Shirt': [
        `${IMG_BASE}1596757810123-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1618354632961-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ],
    'Zara Women Floral Dress': [
        `${IMG_BASE}1572802219102-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1539005113254-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ],
    'Nike Court Vision Low Sneakers': [
        `${IMG_BASE}1542299822-8e5e8f4c3d2a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1606102637195-1f9b4c3d0e1a?w=400&h=400&fit=crop`
    ],
    'Puma Unisex-ADULT Sneakers': [
        `${IMG_BASE}1542299822-8e5e8f4c3d2a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1606102637195-1f9b4c3d0e1a?w=400&h=400&fit=crop`
    ],
    'WildHorn Casual Shoes': [
        `${IMG_BASE}1542299822-8e5e8f4c3d2a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1606102637195-1f9b4c3d0e1a?w=400&h=400&fit=crop`
    ],
    'Adidas Men Running Shoes': [
        `${IMG_BASE}1606102637195-1f9b4c3d0e1a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1542299822-8e5e8f4c3d2a?w=400&h=400&fit=crop`
    ],
    'Tommy Hilfiger Men Watch': [
        `${IMG_BASE}1524592093499-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1542492492598-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ],
    'Fossil Men Gen 6 Watch': [
        `${IMG_BASE}1524592093499-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1542492492598-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ],
    'Titan Women Raga Watch': [
        `${IMG_BASE}1524592093499-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1542492492598-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ],
    'American Tourister Backpack': [
        `${IMG_BASE}1553062407-3c4d5e6f7a8b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1622561456789-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'WildCraft Backpack 45L': [
        `${IMG_BASE}1553062407-3c4d5e6f7a8b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1622561456789-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Lavie Women Handbag': [
        `${IMG_BASE}1566153264589-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1584912345678-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Hidesign Men Wallets': [
        `${IMG_BASE}1621234567890-3c4d5e6f7a8b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1584912345678-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Fastrack Reflex VOX Sunglasses': [
        `${IMG_BASE}1572635196237-0b4c5d6e7f8a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1508296367890-1b9c3d4e5f6a?w=400&h=400&fit=crop`
    ],
    'LG 7 kg Front Load Washing Machine': [
        `${IMG_BASE}1624378976543-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1558618666-0b4c5d6e7f8a?w=400&h=400&fit=crop`
    ],
    'Samsung 1.5 Ton 5-Star Inverter AC': [
        `${IMG_BASE}1585779876543-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1558618666-0b4c5d6e7f8a?w=400&h=400&fit=crop`
    ],
    'Whirlpool 265L Refrigerator': [
        `${IMG_BASE}1584567890123-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1558618666-0b4c5d6e7f8a?w=400&h=400&fit=crop`
    ],
    'IFB 25L Convection Microwave': [
        `${IMG_BASE}1556909114-5c3d4e5f6a7b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1590798184920-5b6c7d8e9f0a?w=400&h=400&fit=crop`
    ],
    'Dove Daily Care Shampoo': [
        `${IMG_BASE}1624567890123-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'L\'Oreal Paris Shampoo': [
        `${IMG_BASE}1624567890123-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Maybelline Fit Me Foundation': [
        `${IMG_BASE}1596467890123-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Lakme Absolute Matte Lipstick': [
        `${IMG_BASE}1596467890123-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Nivea Sunscreen SPF 50': [
        `${IMG_BASE}1624567890123-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Neutrogena Face Wash': [
        `${IMG_BASE}1624567890123-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Garnier Face Wash': [
        `${IMG_BASE}1624567890123-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Davidoff Cool Water Perfume': [
        `${IMG_BASE}1592945678901-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Park Avenue Perfume': [
        `${IMG_BASE}1592945678901-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Philips Beard Trimmer': [
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Havells Hair Dryer': [
        `${IMG_BASE}1624567890123-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Asus ROG Zephyrus G16': [
        `${IMG_BASE}1496183938118-9b2b25b5c3e0?w=400&h=400&fit=crop`,
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`
    ],
    'Acer Predator Helios Neo 16': [
        `${IMG_BASE}1496183938118-9b2b25b5c3e0?w=400&h=400&fit=crop`,
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`
    ],
    'MSI Katana 15': [
        `${IMG_BASE}1496183938118-9b2b25b5c3e0?w=400&h=400&fit=crop`,
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`
    ],
    'Samsung Galaxy Tab S9 FE': [
        `${IMG_BASE}1561154154-6b6368f9d5e3?w=400&h=400&fit=crop`,
        `${IMG_BASE}1589736565314-307b9b6c1e9a?w=400&h=400&fit=crop`
    ],
    'Puma Mens Cotton T-Shirt Pack': [
        `${IMG_BASE}1576566588095-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1618354632961-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ],
    'Nike Mens Dri-FIT Shorts': [
        `${IMG_BASE}1596757810123-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1618354632961-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ],
    'Adidas 3-Stripes Pants': [
        `${IMG_BASE}1596757810123-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1618354632961-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ],
    'H&M Women Kurta Set': [
        `${IMG_BASE}1572802219102-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1539005113254-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ],
    'Samsung 43" Crystal 4K TV': [
        `${IMG_BASE}1593359674512-3d5e6f7a8b9c?w=400&h=400&fit=crop`,
        `${IMG_BASE}1461151305030-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ],
    'LG 43" LM5650 TV': [
        `${IMG_BASE}1461151305030-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1593359674512-3d5e6f7a8b9c?w=400&h=400&fit=crop`
    ],
    'boAt Rockerz 450 Pro': [
        `${IMG_BASE}1505740422128-0c1e8f9b0a2e?w=400&h=400&fit=crop`,
        `${IMG_BASE}1583394833952-9c6b2b0c7d4a?w=400&h=400&fit=crop`
    ],
    'Realme TechLife Buds T100': [
        `${IMG_BASE}1583394833952-9c6b2b0c7d4a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1606747592598-3e4b8c3d0e1a?w=400&h=400&fit=crop`
    ],
    'Samsung 20,000 mAh Power Bank': [
        `${IMG_BASE}1609098765432-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Anker 325 Power Bank': [
        `${IMG_BASE}1609098765432-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Samsung 45W Super Fast Charger': [
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Apple 20W USB-C Charger': [
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Logitech G Pro X Keyboard': [
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`,
        `${IMG_BASE}1496183938118-9b2b25b5c3e0?w=400&h=400&fit=crop`
    ],
    'Razer DeathAdder V3 Mouse': [
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`,
        `${IMG_BASE}1496183938118-9b2b25b5c3e0?w=400&h=400&fit=crop`
    ],
    'HP LaserJet Pro Printer': [
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Canon PIXMA G3270 Printer': [
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Samsung 1TB SSD T7': [
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`,
        `${IMG_BASE}1496183938118-9b2b25b5c3e0?w=400&h=400&fit=crop`
    ],
    'Seagate 2TB External Hard Drive': [
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'TP-Link Archer AX73 Router': [
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Asus RT-AX86U Router': [
        `${IMG_BASE}1593642632823-2f6c10b4c0e7?w=400&h=400&fit=crop`,
        `${IMG_BASE}1587654321098-3c4d5e6f7a8b?w=400&h=400&fit=crop`
    ],
    'Nike Classic Cortez': [
        `${IMG_BASE}1542299822-8e5e8f4c3d2a?w=400&h=400&fit=crop`,
        `${IMG_BASE}1606102637195-1f9b4c3d0e1a?w=400&h=400&fit=crop`
    ],
    'Puma Mens Hoodie': [
        `${IMG_BASE}1576566588095-4c5d6e7f8a9b?w=400&h=400&fit=crop`,
        `${IMG_BASE}1618354632961-4c5d6e7f8a9b?w=400&h=400&fit=crop`
    ]
};

const defaultImage = `${IMG_BASE}1556742049-0cfed4f6a45d?w=400&h=400&fit=crop`;

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
        const categories = await Category.insertMany([
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
        ]);

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
            { title: 'Apple iPhone 15 Pro Max', description: 'A17 Pro chip, 48MP camera system, titanium design. 6.7" Super Retina XDR display with ProMotion. Up to 29 hours video playback.', brand: 'Apple', category: 'Mobiles', price: 159900, mrp: 169900, rating: 4.6, specs: [{ group: 'Display', name: 'Size', value: '6.7" Super Retina XDR' }, { group: 'Processor', name: 'Chip', value: 'A17 Pro' }, { group: 'Camera', name: 'Main', value: '48MP + 12MP + 12MP' }, { group: 'Battery', name: 'Capacity', value: '4422 mAh' }, { group: 'Storage', name: 'Options', value: '256GB/512GB/1TB' }, { group: 'RAM', name: 'Size', value: '8GB' }] },
            { title: 'Samsung Galaxy S24 Ultra', description: 'Snapdragon 8 Gen 3, 200MP camera, S Pen included. 6.8" Dynamic AMOLED 2X display with 120Hz.', brand: 'Samsung', category: 'Mobiles', price: 134999, mrp: 149999, rating: 4.5, specs: [{ group: 'Display', name: 'Size', value: '6.8" Dynamic AMOLED 2X' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8 Gen 3' }, { group: 'Camera', name: 'Main', value: '200MP + 50MP + 12MP + 10MP' }, { group: 'Battery', name: 'Capacity', value: '5000 mAh' }, { group: 'Storage', name: 'Options', value: '256GB/512GB/1TB' }, { group: 'S Pen', name: 'Included', value: 'Yes' }] },
            { title: 'OnePlus 12', description: 'Snapdragon 8 Gen 3, 50MP Hasselblad camera, 100W fast charging. 6.82" ProXDR display.', brand: 'OnePlus', category: 'Mobiles', price: 69999, mrp: 79999, rating: 4.4, specs: [{ group: 'Display', name: 'Size', value: '6.82" ProXDR' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8 Gen 3' }, { group: 'Camera', name: 'Main', value: '50MP + 48MP + 64MP' }, { group: 'Battery', name: 'Capacity', value: '5400 mAh' }, { group: 'Charging', name: 'Speed', value: '100W SuperVOOC' }] },
            { title: 'Xiaomi 14 Pro', description: 'Snapdragon 8 Gen 3, Leica optics, 50MP triple camera. 6.73" LTPO AMOLED display.', brand: 'Xiaomi', category: 'Mobiles', price: 49999, mrp: 59999, rating: 4.3, specs: [{ group: 'Display', name: 'Size', value: '6.73" LTPO AMOLED' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8 Gen 3' }, { group: 'Camera', name: 'Main', value: '50MP + 50MP + 50MP' }, { group: 'Battery', name: 'Capacity', value: '4880 mAh' }, { group: 'Charging', name: 'Speed', value: '120W HyperCharge' }] },
            { title: 'Vivo X100 Pro', description: 'MediaTek Dimensity 9300, 50MP Zeiss camera, 100W flash charging. 6.78" AMOLED display.', brand: 'Vivo', category: 'Mobiles', price: 63999, mrp: 69999, rating: 4.4, specs: [{ group: 'Display', name: 'Size', value: '6.78" AMOLED' }, { group: 'Processor', name: 'Chip', value: 'Dimensity 9300' }, { group: 'Camera', name: 'Main', value: '50MP + 50MP + 64MP' }, { group: 'Battery', name: 'Capacity', value: '5400 mAh' }, { group: 'Charging', name: 'Speed', value: '100W FlashCharge' }] },
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
            { title: 'Samsung Galaxy Buds2 Pro', description: 'Hi-Fi sound, 360 audio, ANC, IPX7 water resistance. Premium Samsung earbuds.', brand: 'Samsung', category: 'Earbuds', price: 17999, mrp: 21999, rating: 4.3, specs: [{ group: 'Type', name: 'Design', value: 'In-ear' }, { group: 'Battery', name: 'Life', value: '5h (29h with case)' }, { group: 'Audio', name: 'Codec', value: 'SSC, AAC, SBC' }, { group: 'Noise', name: 'Cancellation', value: 'Active ANC' }, { group: 'Water', name: 'Resistance', value: 'IPX7' }] },
            // ---- CAMERAS ----
            { title: 'Canon EOS R5', description: '45MP full-frame, 8K video, IBIS, Dual Pixel CMOS AF II. Professional mirrorless camera.', brand: 'Canon', category: 'Cameras', price: 389990, mrp: 419990, rating: 4.8, specs: [{ group: 'Sensor', name: 'Resolution', value: '45MP Full-Frame' }, { group: 'Video', name: 'Max', value: '8K 30fps' }, { group: 'Stabilization', name: 'IBIS', value: '5-axis' }, { group: 'AF', name: 'System', value: 'Dual Pixel CMOS AF II' }, { group: 'Viewfinder', name: 'Type', value: 'EVF 5.76M dots' }] },
            { title: 'Sony A7 IV', description: '33MP full-frame, 4K 60fps video, real-time eye AF. Hybrid mirrorless camera.', brand: 'Sony', category: 'Cameras', price: 219990, mrp: 249990, rating: 4.6, specs: [{ group: 'Sensor', name: 'Resolution', value: '33MP Full-Frame' }, { group: 'Video', name: 'Max', value: '4K 60fps' }, { group: 'AF', name: 'System', value: 'Real-time Eye AF' }, { group: 'Stabilization', name: 'IBIS', value: '5-axis' }, { group: 'ISO', name: 'Range', value: '100-51200' }] },
            // ---- SMART TVS ----
            { title: 'Samsung 65" Neo QLED 4K QN90C', description: 'Neo Quantum HDR+, 120Hz, Dolby Atmos, Object Tracking Sound+. Premium QLED TV.', brand: 'Samsung', category: 'Smart TVs', price: 189990, mrp: 219990, rating: 4.5, specs: [{ group: 'Display', name: 'Size', value: '65"' }, { group: 'Technology', name: 'Panel', value: 'Neo QLED 4K' }, { group: 'HDR', name: 'Format', value: 'Neo Quantum HDR+' }, { group: 'Refresh', name: 'Rate', value: '120Hz' }, { group: 'Audio', name: 'Sound', value: 'Dolby Atmos' }] },
            { title: 'LG 55" OLED C3', description: 'Perfect blacks, a9 Gen6 AI processor, Dolby Vision, Dolby Atmos. Best OLED TV.', brand: 'LG', category: 'Smart TVs', price: 129990, mrp: 159990, rating: 4.7, specs: [{ group: 'Display', name: 'Size', value: '55"' }, { group: 'Technology', name: 'Panel', value: 'OLED evo' }, { group: 'HDR', name: 'Format', value: 'Dolby Vision, HDR10' }, { group: 'Processor', name: 'Chip', value: 'a9 Gen6 AI' }, { group: 'Refresh', name: 'Rate', value: '120Hz' }] },
            // ---- FASHION ----
            { title: 'Nike Air Max 270 React', description: 'Nike Air Max 270 React sneakers with comfort and style. Mesh upper with synthetic overlays.', brand: 'Nike', category: 'Sneakers', price: 14995, mrp: 17995, rating: 4.4, specs: [{ group: 'Type', name: 'Category', value: 'Sneakers' }, { group: 'Upper', name: 'Material', value: 'Mesh' }, { group: 'Sole', name: 'Technology', value: 'Air Max + React' }, { group: 'Closure', name: 'Type', value: 'Lace-up' }, { group: 'Gender', name: 'For', value: 'Unisex' }] },
            { title: 'Adidas Ultraboost 23', description: 'Adidas Ultraboost 23 running shoes with BOOST midsole. Primeknit+ upper for comfort.', brand: 'Adidas', category: 'Sneakers', price: 17999, mrp: 21999, rating: 4.5, specs: [{ group: 'Type', name: 'Category', value: 'Running Shoes' }, { group: 'Upper', name: 'Material', value: 'Primeknit+' }, { group: 'Sole', name: 'Technology', value: 'BOOST' }, { group: 'Closure', name: 'Type', value: 'Lace-up' }, { group: 'Gender', name: 'For', value: 'Unisex' }] },
            { title: "Levi's 501 Original Fit Jeans", description: 'Iconic straight leg jeans. Button fly, 5-pocket styling, authentic denim.', brand: "Levi's", category: 'Jeans', price: 4999, mrp: 6999, rating: 4.3, specs: [{ group: 'Fit', name: 'Style', value: 'Original Straight' }, { group: 'Material', name: 'Fabric', value: '100% Cotton Denim' }, { group: 'Fly', name: 'Type', value: 'Button Fly' }, { group: 'Pockets', name: 'Style', value: '5-Pocket' }, { group: 'Gender', name: 'For', value: 'Men' }] },
            { title: 'Ray-Ban Aviator Classic', description: 'Iconic aviator sunglasses. Metal frame, green G-15 lenses, 100% UV protection.', brand: 'Ray-Ban', category: 'Sunglasses', price: 9990, mrp: 12990, rating: 4.6, specs: [{ group: 'Frame', name: 'Material', value: 'Metal' }, { group: 'Lens', name: 'Type', value: 'G-15 Green' }, { group: 'Protection', name: 'UV', value: '100% UV' }, { group: 'Size', name: 'Width', value: '55mm' }, { group: 'Gender', name: 'For', value: 'Unisex' }] },
            // ---- HOME APPLIANCES ----
            { title: 'Dyson V15 Detect Vacuum', description: 'Laser reveals microscopic dust, piezo sensor, 60 minutes run time. Intelligent cordless vacuum.', brand: 'Dyson', category: 'Vacuum Cleaner', price: 62990, mrp: 69990, rating: 4.6, specs: [{ group: 'Type', name: 'Category', value: 'Cordless Stick' }, { group: 'Battery', name: 'Life', value: '60 minutes' }, { group: 'Sensor', name: 'Technology', value: 'Piezo + Laser' }, { group: 'Capacity', name: 'Bin', value: '0.76L' }, { group: 'Weight', name: 'Weight', value: '2.74 kg' }] },
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
            { title: 'OPPO Find X8 Pro', description: 'MediaTek Dimensity 9400, 50MP Hasselblad camera, 80W charging. 6.78" AMOLED with 120Hz.', brand: 'OPPO', category: 'Mobiles', price: 69999, mrp: 79999, rating: 4.4, specs: [{ group: 'Display', name: 'Size', value: '6.78" AMOLED' }, { group: 'Processor', name: 'Chip', value: 'Dimensity 9400' }, { group: 'Camera', name: 'Main', value: '50MP + 50MP + 50MP Hasselblad' }, { group: 'Battery', name: 'Capacity', value: '5910 mAh' }, { group: 'Charging', name: 'Speed', value: '80W SuperVOOC' }] },
            { title: 'Realme GT 7 Pro', description: 'Snapdragon 8 Elite, 50MP triple camera, 6500mAh battery, 120W charging. Flagship killer.', brand: 'Realme', category: 'Mobiles', price: 45999, mrp: 54999, rating: 4.3, specs: [{ group: 'Display', name: 'Size', value: '6.78" AMOLED' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8 Elite' }, { group: 'Camera', name: 'Main', value: '50MP + 50MP + 8MP' }, { group: 'Battery', name: 'Capacity', value: '6500 mAh' }, { group: 'Charging', name: 'Speed', value: '120W' }] },
            { title: 'Motorola Edge 50 Ultra', description: 'Snapdragon 8s Gen 3, 50MP AI camera, 125W TurboPower charging. Premium Moto flagship.', brand: 'Motorola', category: 'Mobiles', price: 39999, mrp: 49999, rating: 4.2, specs: [{ group: 'Display', name: 'Size', value: '6.7" pOLED' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8s Gen 3' }, { group: 'Camera', name: 'Main', value: '50MP + 50MP + 64MP' }, { group: 'Battery', name: 'Capacity', value: '4500 mAh' }, { group: 'Charging', name: 'Speed', value: '125W TurboPower' }] },
            { title: 'Nothing Phone 3', description: 'Snapdragon 8s Gen 3, Glyph Interface, 50MP dual camera, transparent design. Unique smartphone.', brand: 'Nothing', category: 'Mobiles', price: 39999, mrp: 44999, rating: 4.3, specs: [{ group: 'Display', name: 'Size', value: '6.7" LTPO AMOLED' }, { group: 'Processor', name: 'Chip', value: 'Snapdragon 8s Gen 3' }, { group: 'Camera', name: 'Main', value: '50MP + 50MP' }, { group: 'Battery', name: 'Capacity', value: '5000 mAh' }, { group: 'Feature', name: 'Glyph', value: 'LED Interface' }] },
            { title: 'Google Pixel 9 Pro', description: 'Tensor G4, 50MP main camera, AI features, 7 years of updates. Pure Android experience.', brand: 'Google', category: 'Mobiles', price: 79999, mrp: 89999, rating: 4.5, specs: [{ group: 'Display', name: 'Size', value: '6.3" LTPO OLED' }, { group: 'Processor', name: 'Chip', value: 'Google Tensor G4' }, { group: 'Camera', name: 'Main', value: '50MP + 48MP + 48MP' }, { group: 'Battery', name: 'Capacity', value: '4700 mAh' }, { group: 'OS', name: 'Updates', value: '7 Years' }] },
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
            { title: 'Marshall Emberton III', description: 'Signature Marshall sound, 30+ hours, IP67, stackable. Premium portable speaker.', brand: 'Marshall', category: 'Speakers', price: 17999, mrp: 19999, rating: 4.5, specs: [{ group: 'Type', name: 'Design', value: 'Portable' }, { group: 'Battery', name: 'Life', value: '30+ hours' }, { group: 'Audio', name: 'Feature', value: 'Marshall Signature Sound' }, { group: 'Water', name: 'Resistance', value: 'IP67' }, { group: 'Weight', name: 'Weight', value: '700g' }] },
            { title: 'Sony SRS-XB100', description: 'Compact, IP67, 16 hours battery, clear hands-free calling. Portable Bluetooth speaker.', brand: 'Sony', category: 'Speakers', price: 5999, mrp: 7999, rating: 4.2, specs: [{ group: 'Type', name: 'Design', value: 'Portable' }, { group: 'Battery', name: 'Life', value: '16 hours' }, { group: 'Audio', name: 'Feature', value: 'Clear Sound' }, { group: 'Water', name: 'Resistance', value: 'IP67' }, { group: 'Weight', name: 'Weight', value: '274g' }] },
            // ---- GAMING CONSOLES ----
            { title: 'Sony PlayStation 5 Slim', description: 'AMD Ryzen Zen 2, 825GB SSD, 4K Blu-ray, DualSense controller. Next-gen gaming console.', brand: 'Sony', category: 'Gaming Consoles', price: 44990, mrp: 54990, rating: 4.8, specs: [{ group: 'Storage', name: 'SSD', value: '825GB Custom' }, { group: 'Resolution', name: 'Max', value: '4K 120Hz / 8K' }, { group: 'Controller', name: 'Type', value: 'DualSense Wireless' }, { group: 'Optical', name: 'Drive', value: '4K Blu-ray' }, { group: 'Weight', name: 'Weight', value: '3.2 kg' }] },
            { title: 'Xbox Series X', description: 'Custom AMD Zen 2, 1TB SSD, 4K 120fps, backward compatible. Microsoft flagship console.', brand: 'Microsoft', category: 'Gaming Consoles', price: 49990, mrp: 59990, rating: 4.7, specs: [{ group: 'Storage', name: 'SSD', value: '1TB Custom NVMe' }, { group: 'Resolution', name: 'Max', value: '4K 120Hz' }, { group: 'Controller', name: 'Type', value: 'Xbox Wireless' }, { group: 'Disc', name: 'Drive', value: '4K Blu-ray' }, { group: 'Game Pass', name: 'Support', value: 'Xbox Game Pass' }] },
            { title: 'Nintendo Switch OLED', description: '7" OLED screen, 64GB internal, dockable, Joy-Con controllers. Hybrid gaming console.', brand: 'Nintendo', category: 'Gaming Consoles', price: 27999, mrp: 34999, rating: 4.6, specs: [{ group: 'Display', name: 'Size', value: '7" OLED' }, { group: 'Storage', name: 'Internal', value: '64GB' }, { group: 'Battery', name: 'Life', value: '4.5-9 hours' }, { group: 'Weight', name: 'Handheld', value: '420g' }, { group: 'Modes', name: 'Play', value: 'Handheld, Tabletop, TV' }] },
            // ---- MONITORS ----
            { title: 'Samsung 32" M8 Smart Monitor', description: '32" 4K UHD, Smart TV apps, built-in speakers, USB-C 65W. Smart workspace monitor.', brand: 'Samsung', category: 'Monitors', price: 54990, mrp: 64990, rating: 4.3, specs: [{ group: 'Display', name: 'Size', value: '32" 4K UHD' }, { group: 'Smart', name: 'Features', value: 'Smart TV Apps' }, { group: 'USB-C', name: 'Power', value: '65W PD' }, { group: 'Speakers', name: 'Built-in', value: '2.2 Ch' }, { group: 'HDR', name: 'Support', value: 'HDR10+' }] },
            { title: 'LG 27" UltraGear Gaming Monitor', description: '27" 2K QHD, 165Hz, 1ms, G-Sync, HDR10. Premium gaming monitor.', brand: 'LG', category: 'Monitors', price: 29990, mrp: 39990, rating: 4.5, specs: [{ group: 'Display', name: 'Size', value: '27" QHD' }, { group: 'Refresh', name: 'Rate', value: '165Hz' }, { group: 'Response', name: 'Time', value: '1ms' }, { group: 'Sync', name: 'Support', value: 'G-Sync Compatible' }, { group: 'HDR', name: 'Support', value: 'HDR10' }] },
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
            const images = (PRODUCT_IMAGES[rest.title] || [defaultImage]).map((url, i) => ({
                url,
                alt: `${rest.title} image ${i + 1}`,
                sortOrder: i
            }));
            const product = await Product.create({
                ...rest,
                images,
                specifications: specs || [],
                category: catMap[category],
                brand: brandMap[brand],
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
            createdProducts.push({ product, price, mrp });
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
        const storeNames = ['amazon', 'flipkart', 'croma', 'reliancedigital', 'vijaysales', 'tatacliq', 'myntra', 'ajio', 'meesho', 'snapdeal'];

        for (const { product, price, mrp }
            of createdProducts) {
            // Each product gets offers on 3-6 random stores
            const numStores = Math.floor(Math.random() * 4) + 3;
            const shuffledStores = [...storeNames].sort(() => Math.random() - 0.5).slice(0, numStores);

            for (const storeKey of shuffledStores) {
                const storeId = storeMap[storeKey];
                // Vary price by -5% to +10% across stores
                const variation = 1 + (Math.random() * 0.15 - 0.05);
                const storePrice = Math.round(price * variation);
                const storeMrp = Math.round((mrp || price * 1.2) * variation);
                const discount = Math.round((1 - storePrice / storeMrp) * 100);

                const sp = await StoreProduct.create({
                    product: product._id,
                    store: storeId,
                    storeProductId: `${storeKey.toUpperCase()}-${product._id}`,
                    title: product.title,
                    url: `https://www.${storeKey}.com/products/${product.slug}`,
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