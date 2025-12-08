
import React, { useState, useRef } from 'react';
import { User, Item, CATEGORIES, LOCATIONS, ItemStatus } from '../types';
import { getItems, addItem, deleteItem, toggleAvailability, updateUser, verifySelfie, getUserById } from '../services/mockData';
import { generateItemDescription } from '../services/geminiService';

interface OwnerDashboardProps {
  user: User;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ user: initialUser }) => {
  // Always fetch latest user state to reflect Trust Score updates
  const user = getUserById(initialUser.id) || initialUser;
  
  const [activeTab, setActiveTab] = useState<'items' | 'profile' | 'trust'>('items');
  const [items, setItems] = useState<Item[]>(getItems().filter(i => i.userId === user.id));
  const [showForm, setShowForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Webcam State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Profile State
  const [profileData, setProfileData] = useState({
    name: user.name,
    phone: user.phone,
    bio: user.bio || ''
  });

  // Item Form State
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

  const handleSubmitItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = addItem({
      userId: user.id,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      pricePerDay: Number(formData.pricePerDay) || 0,
      contactPhone: formData.contactPhone,
      imageUrl: `https://picsum.photos/400/300?random=${Date.now()}`
    });
    setItems([newItem, ...items]);
    setShowForm(false);
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

  const handleToggleAvailability = (id: string) => {
    toggleAvailability(id);
    setItems(getItems().filter(i => i.userId === user.id)); // refresh local state
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      ...user,
      name: profileData.name,
      phone: profileData.phone,
      bio: profileData.bio
    });
    alert("Profil berjaya dikemaskini!");
  };

  // --- Webcam Functions ---
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setCameraError("Kamera tidak dijumpai atau akses ditolak. Sila benarkan akses kamera.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataType = canvas.toDataURL('image/png');
        setCapturedImage(imageDataType);
        stopCamera();
      }
    }
  };

  const submitVerification = () => {
    if (capturedImage) {
      verifySelfie(user.id, capturedImage);
      alert("Selfie berjaya dihantar! Trust Score anda telah meningkat.");
      setCapturedImage(null);
      // Force refresh logic is handled by 'user' prop reacting to 'getUserById'
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header with Stats */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard {user.name}</h2>
          <p className="text-gray-500 text-sm">Urus iklan dan profil anda di sini.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
           <div className="text-center px-4 border-r border-gray-200">
             <span className="block text-xl font-bold text-gray-900">{items.length}</span>
             <span className="text-xs text-gray-500">Iklan</span>
           </div>
           <div className="text-center px-4">
             <span className={`block text-xl font-bold ${user.trustScore >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>{user.trustScore}</span>
             <span className="text-xs text-gray-500">Trust Score</span>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('items')}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap transition ${activeTab === 'items' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Iklan Saya
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap transition ${activeTab === 'profile' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Tetapan Profil
        </button>
        <button 
          onClick={() => setActiveTab('trust')}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap transition ${activeTab === 'trust' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Trust & Verification
        </button>
      </div>

      {activeTab === 'items' && (
        <>
          <div className="flex justify-end">
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center shadow-md"
            >
              {showForm ? 'Batal' : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Tambah Iklan
                </>
              )}
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 animate-fade-in-down">
              <h3 className="text-lg font-bold mb-4">Butiran Barang Sewa</h3>
              <form onSubmit={handleSubmitItem} className="space-y-4">
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
                      className="text-xs text-purple-600 hover:text-purple-800 flex items-center font-bold bg-purple-50 px-2 py-1 rounded-md"
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
                  <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition shadow-lg">
                    Hantar Iklan
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Owner Listings Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barang</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Availability</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-lg object-cover" src={item.imageUrl} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                            <div className="text-xs text-gray-500">{item.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
                          ${item.status === ItemStatus.ACTIVE ? 'bg-green-100 text-green-800' : 
                            item.status === ItemStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <button 
                           onClick={() => handleToggleAvailability(item.id)}
                           className={`text-xs font-bold px-3 py-1 rounded-full transition ${item.isAvailable ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                         >
                           {item.isAvailable ? '✅ Tersedia' : '⛔ Tidak Tersedia'}
                         </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded-lg">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                        Anda belum ada iklan. Tekan butang Tambah Iklan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-2xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Kemaskini Profil</h3>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penuh / Nama Kedai</label>
              <input 
                type="text" 
                value={profileData.name} 
                onChange={e => setProfileData({...profileData, name: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombor Telefon (WhatsApp)</label>
              <input 
                type="text" 
                value={profileData.phone} 
                onChange={e => setProfileData({...profileData, phone: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio Ringkas (Akan dipaparkan kepada penyewa)</label>
              <textarea 
                rows={4}
                value={profileData.bio} 
                onChange={e => setProfileData({...profileData, bio: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="Ceritakan sedikit tentang servis anda..."
              />
            </div>
            <div className="pt-2">
              <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 transition">
                Simpan Profil
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'trust' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trust Score Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Trust Score Anda</h3>
            <div className="flex items-center justify-center mb-6">
               <div className="relative w-32 h-32 flex items-center justify-center">
                 <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                   <circle 
                     cx="50" cy="50" r="45" fill="none" stroke={user.trustScore >= 80 ? '#059669' : '#d97706'} strokeWidth="10" 
                     strokeDasharray="283"
                     strokeDashoffset={283 - (283 * user.trustScore / 100)}
                     className="transition-all duration-1000 ease-out"
                   />
                 </svg>
                 <span className="text-2xl font-bold text-gray-800">{user.trustScore}</span>
               </div>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center justify-between">
                <span>Daftar Akaun</span>
                <span className="text-green-600 font-bold">✓ 40 mata</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Lengkapkan Profil (Bio & Phone)</span>
                <span className={user.bio && user.phone ? "text-green-600 font-bold" : "text-gray-400"}>
                  {user.bio && user.phone ? "✓ 20 mata" : "+ 20 mata"}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Selfie Verification (Webcam)</span>
                <span className={user.hasSelfieVerified ? "text-green-600 font-bold" : "text-gray-400"}>
                  {user.hasSelfieVerified ? "✓ 20 mata" : "+ 20 mata"}
                </span>
              </li>
               <li className="flex items-center justify-between">
                <span>Admin Verified</span>
                <span className={user.isVerified ? "text-green-600 font-bold" : "text-gray-400"}>
                  {user.isVerified ? "✓ 20 mata" : "+ 20 mata"}
                </span>
              </li>
            </ul>
          </div>

          {/* Selfie Verification Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Selfie Verification</h3>
            <p className="text-sm text-gray-500 mb-4">
              Ambil gambar selfie anda sekarang untuk meningkatkan kepercayaan penyewa.
            </p>

            {user.hasSelfieVerified ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="font-bold text-green-800">Anda Telah Disahkan!</h4>
                <p className="text-green-600 text-xs mt-1">Gambar selfie anda telah disimpan.</p>
                {user.selfieUrl && (
                  <img src={user.selfieUrl} alt="Selfie" className="w-24 h-24 object-cover rounded-lg mx-auto mt-4 border-2 border-white shadow-md" />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {cameraError && (
                  <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200">
                    {cameraError}
                  </div>
                )}
                
                <div className="relative bg-black rounded-lg overflow-hidden h-48 flex items-center justify-center">
                  {!isCameraOpen && !capturedImage && (
                    <button 
                      onClick={startCamera}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full font-bold text-sm"
                    >
                      Buka Kamera
                    </button>
                  )}
                  
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover ${!isCameraOpen ? 'hidden' : ''}`} 
                  />
                  
                  {capturedImage && (
                    <img src={capturedImage} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="flex space-x-2">
                  {isCameraOpen && (
                    <>
                      <button 
                        onClick={capturePhoto} 
                        className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-bold hover:bg-teal-700"
                      >
                        Tangkap Gambar
                      </button>
                      <button 
                        onClick={() => { stopCamera(); setIsCameraOpen(false); }} 
                        className="px-4 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-300"
                      >
                        Batal
                      </button>
                    </>
                  )}
                  
                  {capturedImage && (
                    <>
                      <button 
                        onClick={submitVerification} 
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700"
                      >
                        Hantar Pengesahan
                      </button>
                      <button 
                        onClick={() => { setCapturedImage(null); startCamera(); }} 
                        className="px-4 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-300"
                      >
                        Ambil Semula
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
