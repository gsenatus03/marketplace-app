'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [items, setItems] = useState([]);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  // LOAD SAVED DATA
  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) setLoggedIn(true);

    const savedItems = localStorage.getItem('items');
    if (savedItems) setItems(JSON.parse(savedItems));
    else {
      const defaults = [
        { id: 1, title: 'Bicycle', price: 120, image: null },
        { id: 2, title: 'Laptop', price: 450, image: null },
        { id: 3, title: 'Phone', price: 300, image: null },
      ];
      setItems(defaults);
      localStorage.setItem('items', JSON.stringify(defaults));
    }
  }, []);

  // SAVE ITEMS
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('items', JSON.stringify(items));
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

  function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
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
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-sky-600">Marketplace</h1>
        <button onClick={logout} className="text-sm text-gray-500">Logout</button>
      </header>

      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-white p-4 rounded-2xl shadow mb-6">
          <h2 className="font-semibold mb-2">Sell an item</h2>
          <div className="flex flex-col gap-2">
            <input
              className="border p-2 rounded"
              placeholder="Item title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={handleImage} />
            <button
              onClick={addListing}
              className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded"
            >
              Post
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow overflow-hidden">
              {item.image ? (
                <img src={item.image} className="h-32 w-full object-cover" />
              ) : (
                <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="p-3">
                <h3 className="font-medium truncate">{item.title}</h3>
                <p className="text-sky-600 font-bold">${item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
