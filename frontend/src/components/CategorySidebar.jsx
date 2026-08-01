import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { ChevronRight, X } from 'lucide-react';

const CATEGORY_GROUPS = [
  { name: 'Electronics', icon: '🔌', categories: ['Mobiles', 'Laptops', 'Tablets', 'Smart Watches', 'Earbuds', 'Headphones', 'Speakers', 'Cameras', 'Power Banks', 'Chargers', 'Keyboards', 'Mouse', 'Monitors', 'Printers', 'Gaming Consoles', 'SSD', 'Hard Drives', 'Memory Cards', 'Routers', 'Smart TVs', 'Refrigerators', 'Washing Machines', 'Air Conditioners', 'Microwave Ovens'] },
  { name: 'Fashion', icon: '👕', categories: ['Shirts', 'T-Shirts', 'Pants', 'Jeans', 'Shorts', 'Hoodies', 'Jackets', 'Dresses', 'Sarees', 'Kurtis', 'Shoes', 'Sneakers', 'Sandals', 'Slippers', 'Watches', 'Bags', 'Wallets', 'Sunglasses'] },
  { name: 'Beauty & Personal Care', icon: '💄', categories: ['Face Wash', 'Face Cream', 'Sunscreen', 'Shampoo', 'Conditioner', 'Hair Oil', 'Perfume', 'Makeup', 'Lipstick', 'Trimmer', 'Hair Dryer', 'Beard Kit', 'Skin Care Products'] },
  { name: 'Home & Kitchen', icon: '🏠', categories: ['Mixer', 'Grinder', 'Cookware', 'Furniture', 'Beds', 'Chairs', 'Dining Table', 'Sofa', 'Curtains', 'Water Purifier', 'Vacuum Cleaner', 'Iron Box', 'Gas Stove'] },
  { name: 'Books & Education', icon: '📚', categories: ['Engineering Books', 'Programming Books', 'Competitive Exam Books', 'Story Books'] },
  { name: 'Sports', icon: '⚽', categories: ['Cricket Equipment', 'Football', 'Badminton', 'Gym Equipment'] },
];

export default function CategorySidebar({ open, onClose }) {
  const [expanded, setExpanded] = useState({});

  const toggle = (name) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-80 overflow-y-auto bg-white shadow-xl transition-transform duration-300 dark:bg-zinc-950 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-black">All Categories</h2>
          <button onClick={onClose} className="btn-secondary px-2 py-1">
            <X size={20} />
          </button>
        </div>
        <div className="p-2">
          {CATEGORY_GROUPS.map((group) => (
            <div key={group.name} className="border-b border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => toggle(group.name)}
                className="flex w-full items-center justify-between px-3 py-3 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <span>
                  <span className="mr-2">{group.icon}</span>
                  {group.name}
                </span>
                <ChevronRight
                  size={16}
                  className={`transition-transform ${expanded[group.name] ? 'rotate-90' : ''}`}
                />
              </button>
              {expanded[group.name] && (
                <div className="ml-6 pb-2">
                  {group.categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/search?q=${encodeURIComponent(cat)}`}
                      onClick={onClose}
                      className="block px-3 py-1.5 text-sm text-zinc-600 hover:text-mint dark:text-zinc-400"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="border-t p-4 text-center text-xs text-zinc-400 dark:border-zinc-800">
          SmartPrice Compare © {new Date().getFullYear()}
        </div>
      </aside>
    </>
  );
}

