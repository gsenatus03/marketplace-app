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
          <h1 className="text-2xl font-bold mb-4 text-center text-sky-600">VANNHT</h1>
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
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>

      {/* Add Listing Form */}
      <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow mb-4">
        <h2 className="text-lg font-bold mb-3">Create Listing</h2>
        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="mb-2 w-full"
        />
        <button
          onClick={addListing}
          className="bg-sky-500 hover:bg-sky-600 text-white w-full p-2 rounded"
        >
          Add Listing
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-4">
            {item.image && <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded mb-2" />}
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-sky-600 font-semibold">${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
    