'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export type Item = {
  id: string;
  title: string;
  price: number;
  category: string;
  images: string[];
};

export default function SellPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Other');
  const [images, setImages] = useState<string[]>([]);

  const handleImages = (files: FileList | null) => {
    if (!files) return;

    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((base64Images) => {
      setImages(base64Images);
    });
  };

  const addListing = () => {
    if (!title || !price) return alert('Title and price required');

    const newItem: Item = {
      id: crypto.randomUUID(),
      title,
      price: Number(price),
      category,
      images,
    };

    const saved = localStorage.getItem('items');
    const items: Item[] = saved ? JSON.parse(saved) : [];

    items.push(newItem);
    localStorage.setItem('items', JSON.stringify(items));

    router.push('/');
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold mb-4">Sell an Item</h1>

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Item title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded mb-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Cars</option>
          <option>Phones</option>
          <option>Furniture</option>
          <option>Other</option>
        </select>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleImages(e.target.files)}
          className="mb-4"
        />

        {images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mb-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                className="h-20 w-20 object-cover rounded"
              />
            ))}
          </div>
        )}

        <button
          onClick={addListing}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Post Listing
        </button>
      </div>
    </div>
  );
}
