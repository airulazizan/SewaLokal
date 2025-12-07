import React from 'react';
import { Item, User } from '../types';
import { getItemById } from '../services/mockData';

interface ItemDetailProps {
  itemId: string;
  onBack: () => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ itemId, onBack }) => {
  const item = getItemById(itemId);

  if (!item) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Barang tidak dijumpai</h2>
        <button onClick={onBack} className="mt-4 text-teal-600 hover:underline">Kembali ke laman utama</button>
      </div>
    );
  }

  // WhatsApp Link Builder
  const whatsappMessage = encodeURIComponent(`Hi, saya berminat nak sewa ${item.title} yang saya nampak di SewaLokal.`);
  const whatsappLink = `https://wa.me/${item.contactPhone}?text=${whatsappMessage}`;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-4 flex items-center text-gray-600 hover:text-teal-600 transition">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="h-64 md:h-auto bg-gray-200">
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
          </div>

          {/* Details Section */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold uppercase rounded-full tracking-wide mb-2">
                {item.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {item.location}
                <span className="mx-2">•</span>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="prose prose-sm text-gray-600 mb-8 flex-grow">
              <h3 className="text-gray-900 font-semibold mb-2">Deskripsi</h3>
              <p>{item.description}</p>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-yellow-800 text-xs">
                <strong>Tips Keselamatan:</strong> Jangan bayar deposit online tanpa jumpa barang. Jumpa di tempat awam yang selamat.
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                 <div>
                   <p className="text-sm text-gray-500">Kadar Sewa</p>
                   <p className="text-2xl font-bold text-gray-900">{item.pricePerDay > 0 ? `RM${item.pricePerDay}` : 'Bincang'} <span className="text-sm font-normal text-gray-500">/ hari</span></p>
                 </div>
              </div>
              
              <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl text-center transition flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                <span>WhatsApp Owner</span>
              </a>
              <p className="text-center text-xs text-gray-400 mt-2">Anda akan berurusan terus dengan pemilik barang.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;