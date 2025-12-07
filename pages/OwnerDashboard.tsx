import React, { useState } from 'react';
import { User, Item, CATEGORIES, LOCATIONS, ItemStatus } from '../types';
import { getItems, addItem, deleteItem } from '../services/mockData';
import { generateItemDescription } from '../services/geminiService';

interface OwnerDashboardProps {
  user: User;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ user }) => {
  const [items, setItems] = useState<Item[]>(getItems().filter(i => i.userId === user.id));
  const [showForm, setShowForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    location: LOCATIONS[0],
    description: '',
    pricePerDay: '',
    contactPhone: user.phone
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMagicGenerate = async () => {
    if (!formData.title) {
      alert("Sila masukkan Nama Barang dulu.");
      return;
    }
    setIsGenerating(true);
    const desc = await generateItemDescription(formData.title, formData.category, formData.location);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = addItem({
      userId: user.id,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      pricePerDay: Number(formData.pricePerDay) || 0,
      contactPhone: formData.contactPhone,
      // Random image for demo purposes
      imageUrl: `https://picsum.photos/400/300?random=${Date.now()}`
    });
    setItems([newItem, ...items]);
    setShowForm(false);
    // Reset form
    setFormData({
      title: '',
      category: CATEGORIES[0],
      location: LOCATIONS[0],
      description: '',
      pricePerDay: '',
      contactPhone: user.phone
    });
    alert("Iklan berjaya dihantar! Admin akan review sekejap lagi.");
  };

  const handleDelete = (id: string) => {
    if (confirm("Anda pasti nak padam iklan ini?")) {
      deleteItem(id);
      setItems(items.filter(i => i.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Owner</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          {showForm ? 'Batal' : '+ Tambah Iklan'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-bold mb-4">Butiran Barang Sewa</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="Contoh: Drill Bosch" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border rounded-lg">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                <span>Deskripsi</span>
                <button 
                  type="button" 
                  onClick={handleMagicGenerate}
                  disabled={isGenerating}
                  className="text-xs text-purple-600 hover:text-purple-800 flex items-center font-bold"
                >
                  {isGenerating ? 'Menulis...' : '✨ Guna AI (Magic Write)'}
                </button>
              </label>
              <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="Ceritakan keadaan barang..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <select name="location" value={formData.location} onChange={handleInputChange} className="w-full p-2 border rounded-lg">
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Sewa (RM / hari)</label>
                <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="0 untuk Nego" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp</label>
                <input required name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition">
                Hantar Iklan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Owner Listings */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barang</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-full object-cover" src={item.imageUrl} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.status === ItemStatus.ACTIVE ? 'bg-green-100 text-green-800' : 
                        item.status === ItemStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    RM {item.pricePerDay}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Anda belum ada iklan. Tekan butang Tambah Iklan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;