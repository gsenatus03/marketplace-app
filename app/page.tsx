'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  type Item = {
  id: number;
  title: string;
  price: number;
  image: string | null;
};

  const [items, setItems] = useState<Item[]>([]);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);

  // LOAD SAVED DATA
  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) setLoggedIn(true);

    const savedItems = localStorage.getItem('items');
    if (savedItems) setItems(JSON.parse(savedItems));
    else {
      const defaults: Item[] = [
        { id: 1, title: 'Bicycle', price: 120, image: null },
        { id: 2, title: 'Laptop', price: 450, image: null },
        { id: 3, title: 'Phone', price: 300, image: null },
      ];
      setItems(defaults);
      localStorage.setItem('items', JSON.stringify(defaults));
    }
  }, []);

  // SAVE ITEMS (WITHOUT IMAGES TO AVOID STORAGE LIMIT)
  useEffect(() => {
    if (items.length > 0) {
      const safeItems = items.map(({ image, ...rest }) => rest);
      localStorage.setItem('items', JSON.stringify(safeItems));
    }
  }, [items]);

  function login() {
    if (!username) return;
    localStorage.setItem('username', username);
    setLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem('username');
    setLoggedIn(false);
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  function addListing() {
    if (!title || !price) return;

    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        price: Number(price),
        image,
      },
    ]);

    setTitle('');
    setPrice('');
    setImage(null);
  }

  // LOGIN
  if (!loggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-80">
          <h1 className="text-2xl font-bold mb-4 text-center text-sky-600">Marketplace</h1>
          <input
            className="border p-2 w-full mb-3 rounded"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={login}
            className="bg-sky-500 hover:bg-sky-600 text-white w-full p-2 rounded"
          >
            Login
          </button>
        </div>
      </main>
    );
  }

  // MARKETPLACE
  return (
  <div className="min-h-screen bg-sky-50">
    {/* Header */}
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-sky-500">SkyMarket</h1>
      <a
        href="/create"
        className="bg-sky-500 text-white px-4 py-2 rounded-full text-sm"
      >
        Sell
      </a>
    </header>

    {/* Listings */}
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {listings.map((l) => (
        <div
          key={l.id}
          className=""bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <img
            src={l.image_url}
            className="h-44 w-full object-cover rounded-xl mb-3 bg-gray-100"
            alt={l.title}
          />
          <h2 className="font-semibold text-gray-800">{l.title}</h2>
          <p className="text-sky-500 font-bold text-lg">${l.price}</p>
        </div>
      ))}
    </div>
  </div>
);
