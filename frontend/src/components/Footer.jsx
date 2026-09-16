import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-zinc-900 text-zinc-300 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 flex items-center gap-2 font-black text-white">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-mint text-zinc-950 text-sm">SP</span>
              SmartPrice
            </h3>
            <p className="text-sm text-zinc-400">Compare prices across top Indian stores. Find the best deals on mobiles, laptops, fashion, appliances and more.</p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">Shop by Category</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search?q=mobiles" className="hover:text-mint">Mobiles</Link></li>
              <li><Link to="/search?q=laptops" className="hover:text-mint">Laptops</Link></li>
              <li><Link to="/search?q=smart+watches" className="hover:text-mint">Smart Watches</Link></li>
              <li><Link to="/search?q=headphones" className="hover:text-mint">Headphones</Link></li>
              <li><Link to="/search?q=shoes" className="hover:text-mint">Shoes</Link></li>
              <li><Link to="/deals" className="hover:text-mint">Best Deals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/brands" className="hover:text-mint">Brands</Link></li>
              <li><Link to="/deals" className="hover:text-mint">Today's Deals</Link></li>
              <li><Link to="/search?sort=-stats.viewCount" className="hover:text-mint">Trending</Link></li>
              <li><Link to="/wishlist" className="hover:text-mint">Wishlist</Link></li>
              <li><Link to="/search?sort=-createdAt" className="hover:text-mint">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-mint cursor-pointer">About Us</span></li>
              <li><span className="hover:text-mint cursor-pointer">Contact</span></li>
              <li><span className="hover:text-mint cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-mint cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-700 pt-8 text-center text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} SmartPrice Compare. All rights reserved. Prices are for reference only and may vary by store.</p>
        </div>
      </div>
    </footer>
  );
}

