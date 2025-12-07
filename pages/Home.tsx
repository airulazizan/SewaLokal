import React, { useState, useEffect } from 'react';
import { Item, ItemStatus, CATEGORIES, LOCATIONS, AdBanner } from '../types';
import ItemCard from '../components/ItemCard';
import { getItems, MOCK_ADS } from '../services/mockData';

interface HomeProps {
  onNavigate: (path: string, id?: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    // Load active items only for public view
    const allItems = getItems().filter(i => i.status === ItemStatus.ACTIVE);
    setItems(allItems);
    setFilteredItems(allItems);
  }, []);

  useEffect(() => {
    let result = items;

    if (searchTerm) {
      result = result.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedCategory) {
      result = result.filter(i => i.category === selectedCategory);
    }
    if (selectedLocation) {
      result = result.filter(i => i.location === selectedLocation);
    }

    // Sort: Featured first, then newest
    result.sort((a, b) => {
      if (a.isFeatured === b.isFeatured) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.isFeatured ? -1 : 1;
    });

    setFilteredItems(result);
  }, [searchTerm, selectedCategory, selectedLocation, items]);

  // Find top banner
  const topBanner = MOCK_ADS.find(ad => ad.position === 'top');
  const insertAd = MOCK_ADS.find(ad => ad.position === 'list_insert');

  return (
    <div className="space-y-8">
      {/* Hero / Search Section */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-6 md:p-10 shadow-lg text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Cari & Sewa Barang di Kuantan</h1>
        <p className="text-center text-teal-50 mb-8 max-w-2xl mx-auto">
          Jimat duit. Sewa je barang yang jarang guna. Berurusan terus dengan pemilik tanpa orang tengah.
        </p>
        
        <div className="bg-white p-3 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-12 gap-2 max-w-4xl mx-auto">
          <div className="md:col-span-5">
            <input 
              type="text" 
              placeholder="Cari (e.g., Drill, Tangga, Khemah)" 
              className="w-full h-12 px-4 rounded-md border-transparent focus:ring-2 focus:ring-teal-500 text-gray-800 bg-gray-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <select 
              className="w-full h-12 px-4 rounded-md border-transparent focus:ring-2 focus:ring-teal-500 text-gray-800 bg-gray-50"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="md:col-span-3">
             <select 
              className="w-full h-12 px-4 rounded-md border-transparent focus:ring-2 focus:ring-teal-500 text-gray-800 bg-gray-50"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Semua Lokasi</option>
              {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
          <div className="md:col-span-1">
             <button 
              className="w-full h-12 bg-gray-900 rounded-md flex items-center justify-center hover:bg-black transition"
              title="Search"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </button>
          </div>
        </div>
      </div>

      {/* Top Banner Ad */}
      {topBanner && (
        <div className="w-full h-32 md:h-40 rounded-xl overflow-hidden shadow-sm relative group">
          <img src={topBanner.imageUrl} alt={topBanner.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
          <span className="absolute top-2 right-2 bg-white/80 text-xxs px-1 rounded text-gray-500">Iklan</span>
        </div>
      )}

      {/* Categories Pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button 
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${!selectedCategory ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
        >
          Semua
        </button>
        {CATEGORIES.slice(0, 5).map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === cat ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Senarai Barang ({filteredItems.length})</h2>
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Tiada barang dijumpai. Cuba cari kata kunci lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => {
              // Inject Ad after 4th item
              if (index === 4 && insertAd) {
                return (
                  <React.Fragment key="ad-fragment">
                    <div className="bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center p-4 text-center h-full min-h-[300px]">
                      <span className="text-xs text-gray-400 mb-2">Penaja</span>
                      <img src={insertAd.imageUrl} alt="Ad" className="rounded-lg mb-2 object-cover max-h-32 w-full" />
                      <h4 className="font-bold text-gray-800">{insertAd.title}</h4>
                      <button className="mt-2 text-sm text-teal-600 font-semibold">Lihat Tawaran</button>
                    </div>
                    <ItemCard key={item.id} item={item} onClick={(id) => onNavigate('detail', id)} />
                  </React.Fragment>
                );
              }
              return <ItemCard key={item.id} item={item} onClick={(id) => onNavigate('detail', id)} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;