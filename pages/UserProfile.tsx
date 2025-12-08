
import React from 'react';
import { getUserById, getItemsByUserId } from '../services/mockData';
import ItemCard from '../components/ItemCard';
import { ItemStatus } from '../types';

interface UserProfileProps {
  userId: string;
  onNavigate: (path: string, id?: string) => void;
  onBack: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, onNavigate, onBack }) => {
  const user = getUserById(userId);
  const userItems = getItemsByUserId(userId).filter(i => i.status === ItemStatus.ACTIVE);

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Pengguna tidak dijumpai</h2>
        <button onClick={onBack} className="mt-4 text-teal-600 hover:underline">Kembali</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button onClick={onBack} className="mb-6 flex items-center text-gray-600 hover:text-teal-600 transition">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Kembali ke Listing
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="bg-teal-600 h-32"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6">
            <img 
              src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}`} 
              alt={user.name} 
              className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white"
            />
            <div className="md:ml-6 mt-4 md:mt-0 flex-grow">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                {user.name}
                {user.isVerified && (
                  <span title="Admin Verified" className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    Admin Verified
                  </span>
                )}
                 {user.hasSelfieVerified && (
                  <span title="Selfie Verified" className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    Selfie Verified
                  </span>
                )}
              </h1>
              <p className="text-gray-500 text-sm">Ahli sejak {new Date(user.joinDate).getFullYear()}</p>
            </div>
            <div className="mt-4 md:mt-0 bg-gray-50 px-6 py-3 rounded-xl border border-gray-200">
               <div className="text-center">
                 <span className="block text-xs text-gray-500 uppercase font-bold tracking-wide">Trust Score</span>
                 <span className={`text-2xl font-bold ${user.trustScore >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>{user.trustScore}</span>
               </div>
            </div>
          </div>

          <div className="max-w-3xl">
            <h3 className="font-semibold text-gray-900 mb-2">Tentang Saya</h3>
            <p className="text-gray-600 whitespace-pre-line">
              {user.bio || "Tiada maklumat bio disediakan."}
            </p>
          </div>
        </div>
      </div>

      {/* User's Listings */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Iklan Aktif Oleh {user.name} ({userItems.length})</h2>
        {userItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userItems.map(item => (
              <ItemCard key={item.id} item={item} onClick={(id) => onNavigate('detail', id)} />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic bg-gray-50 p-6 rounded-xl text-center">
            Tiada iklan aktif buat masa ini.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
