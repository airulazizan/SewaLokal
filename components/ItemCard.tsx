import React from 'react';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
  onClick: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  return (
    <div 
      onClick={() => onClick(item.id)}
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden border ${item.isFeatured ? 'border-yellow-400 ring-1 ring-yellow-400' : 'border-gray-100'}`}
    >
      <div className="relative h-48 bg-gray-200">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        {item.isFeatured && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-sm">
            FEATURED
          </span>
        )}
        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {item.location}
        </span>
      </div>
      <div className="p-4">
        <div className="text-xs text-teal-600 font-medium mb-1 uppercase tracking-wide">{item.category}</div>
        <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{item.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{item.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="text-gray-900 font-bold">
            {item.pricePerDay > 0 ? `RM${item.pricePerDay}` : 'Nego'} <span className="text-xs font-normal text-gray-500">/ hari</span>
          </div>
          <button className="text-teal-600 text-sm font-medium hover:underline">
            Lihat Detail →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;