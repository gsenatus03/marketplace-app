'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Item = {
  id: string;
  title: string;
  price: number;
  category?: string;
  image: string | null;
  images?: string[];
};

export default function ItemDetail() {
  const router = useRouter();
 const params = useParams();
const id = params.id as string;

  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('items');
    if (!saved) return;

    const items: Item[] = JSON.parse(saved);
    const found = items.find((i) => i.id === id);
    if (found) {
  setItem({
    ...found,
    images: found.image ? [found.image] : [],
  });
} else {
  setItem(null);
}
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading item...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white shadow p-4 flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="text-sky-600 font-semibold"
        >
          ← Back
        </button>
        <h1 className="text-lg font-bold truncate">{item.title}</h1>
      </header>

      {/* IMAGE */}
      
 {/* Image Slider */}
<div className="flex overflow-x-auto snap-x snap-mandatory bg-black">
  {(item.images && item.images.length > 0
    ? item.images
    : item.image
    ? [item.image]
    : []
  ).map((img, index) => (
    <img
      key={index}
      src={img}
      alt={item.title}
      className="w-full aspect-square object-contain snap-center"
    />
  ))}
</div>

      {/* DETAILS */}
      <div className="p-4">
        <p className="text-3xl font-extrabold text-sky-600 mb-3">
          ${item.price}
        </p>

        <p className="text-sm text-gray-500 mb-4">
          Category: {item.category || 'Other'}
        </p>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="text-gray-600">
            This item was posted on SkyMarket. Contact the seller to learn more.
          </p>
        </div>
      </div>
    </main>
  );
}
