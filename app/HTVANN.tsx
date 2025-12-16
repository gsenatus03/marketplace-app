'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export type Item = {
  id: string;
  title: string;
  price: number;
  category?: string;
  images: string[];
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const saved = localStorage.getItem('items');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  const categories = ['All', 'Cars', 'Phones', 'Furniture', 'Other'];

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter(
          (item) =>
            item.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div className="bg-blue-50 min-h-screen px-4 pb-20">

      {/* TOP HEADER */}
<header className="flex items-center justify-between px-4 py-6 bg-white min-h-[96px]">
  <div className="flex items-center gap-3">
  <img
    src="/logo/logo.png"
    alt="HTVANN Buy and Sell"
    className="h-24 w-auto object-contain"
  />
  </div>


  <div className="flex gap-4 text-sm">
    <a href="/create" className="text-blue-600 hover:underline">
      Sell
    </a>
    <button
      onClick={() => {
        localStorage.removeItem('username');
        location.reload();
      }}
      className="text-gray-600 hover:underline"
    >
      Logout
    </button>
  </div>
</header>

{/* SEARCH */}
<div className="px-4 py-3 bg-blue-50">
  <input
    placeholder="Search for sale"
    className="w-full border rounded-full px-4 py-2"
  />
</div>

      {/* Category Tabs */}
      <div className="flex gap-3 overflow-x-auto px-6 py-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="px-6 pb-24">
        {filteredItems.length === 0 ? (
          <p className="text-gray-500 mt-10">No items found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <Link
                key={item.id}
                href={`/item/${item.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="aspect-square bg-gray-200">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-blue-600 font-semibold">${item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {/* BOTTOM NAV */}
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 text-sm">
  <a href="/" className="text-blue-600 font-semibold">
    Home
  </a>
  <a href="/create" className="text-gray-600">
    Sell
  </a>
  <a href="/profile" className="text-gray-600">
    Profile
  </a>
</nav>
{/* Bottom Navigation */}
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 text-sm text-blue-600">
  <a href="/" className="font-semibold">Home</a>
  <a href="/sell">Sell</a>
  <a href="/profile">Profile</a>
</nav>

    </div>
  );
}
