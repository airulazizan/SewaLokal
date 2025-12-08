
import React from 'react';
import { Item, User } from '../types';
import { getItemById, getUserById } from '../services/mockData';

interface ItemDetailProps {
  itemId: string;
  onNavigate: (path: string, id?: string) => void;
  onBack: () => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ itemId, onNavigate, onBack }) => {
  const item = getItemById(itemId);
  // Fetch owner data if item exists
  const owner = item ? getUserById(item.userId) : undefined;

  if (!item || !owner) {
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
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={onBack} className="flex items-center text-gray-600 hover:text-teal-600 transition">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Kembali
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Item Images & Details (2/3 width) */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="h-64 md:h-80 bg-gray-200">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-6 md:p-8">
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

              <div className="prose prose-sm text-gray-600 mb-6">
                <h3 className="text-gray-900 font-semibold mb-2">Deskripsi</h3>
                <p className="whitespace-pre-line">{item.description}</p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-yellow-800 text-sm flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p><strong>Tips Keselamatan:</strong> Jangan bayar deposit online tanpa jumpa barang. Jumpa di tempat awam yang selamat.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Owner & Action (1/3 width) */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Kadar Sewa</p>
            <div className="text-3xl font-bold text-gray-900 mb-6">
              {item.pricePerDay > 0 ? `RM${item.pricePerDay}` : 'Bincang'} 
              <span className="text-sm font-normal text-gray-500"> / hari</span>
            </div>
            
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl text-center transition flex items-center justify-center space-x-2 shadow-lg shadow-green-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              <span>WhatsApp Owner</span>
            </a>
            <p className="text-center text-xs text-gray-400 mt-2">Anda berurusan terus dengan pemilik</p>
          </div>

          {/* Owner Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Pemilik Barang</h3>
            <div className="flex items-center space-x-4 mb-4">
              <img src={owner.avatarUrl || `https://ui-avatars.com/api/?name=${owner.name}`} alt={owner.name} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
              <div>
                <p className="font-bold text-gray-900">{owner.name}</p>
                <p className="text-xs text-gray-500">Ahli sejak {new Date(owner.joinDate).getFullYear()}</p>
              </div>
            </div>

            {/* Trust Score */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-xs font-semibold text-gray-600">Trust Score</span>
                 <span className={`text-xs font-bold ${owner.trustScore >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                   {owner.trustScore}/100
                 </span>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${owner.trustScore >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                    style={{ width: `${owner.trustScore}%` }}
                  ></div>
               </div>
               {owner.isVerified && (
                 <div className="mt-2 flex items-center text-xs text-teal-700">
                   <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                   Identity Verified
                 </div>
               )}
            </div>

            <button 
              onClick={() => onNavigate('profile', owner.id)}
              className="w-full py-2 border border-gray-300 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Lihat Profil & Iklan Lain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
