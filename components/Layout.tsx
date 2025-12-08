import React from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onLoginRequest: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onLoginRequest }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.hash = ''}>
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">Sewa<span className="text-teal-600">@KOTA</span></span>
          </div>

          <nav className="flex items-center space-x-4">
            <button 
              onClick={() => window.location.hash = ''} 
              className="text-sm font-medium text-gray-600 hover:text-teal-600 hidden md:block"
            >
              Browse
            </button>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500 hidden md:inline">
                  Hi, {user.name} ({user.role === UserRole.ADMIN ? 'Admin' : 'Owner'})
                </span>
                {user.role === UserRole.ADMIN ? (
                   <button 
                   onClick={() => window.location.hash = '#admin'}
                   className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-full transition"
                 >
                   Admin Panel
                 </button>
                ) : (
                  <button 
                    onClick={() => window.location.hash = '#dashboard'}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-2 rounded-full transition shadow-md"
                  >
                    + Iklan Baru
                  </button>
                )}
                <button 
                  onClick={onLogout}
                  className="text-gray-500 hover:text-red-500 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginRequest}
                className="text-teal-600 font-semibold text-sm hover:underline"
              >
                Owner Login / Daftar
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">
            <span className="font-bold text-white">SewaLokal</span> &copy; {new Date().getFullYear()}
          </p>
          <div className="flex justify-center space-x-6 text-sm mb-6">
            <a href="#" className="hover:text-white">Cara Guna</a>
            <a href="#" className="hover:text-white">Tip Keselamatan</a>
            <a href="#" className="hover:text-white">Terma & Syarat</a>
          </div>
          <div className="text-xs text-gray-500 max-w-lg mx-auto border-t border-gray-700 pt-4">
            <p>Penafian: Platform ini hanya menghubungkan pemilik dan penyewa. SewaLokal tidak bertanggungjawab atas sebarang kerosakan, kehilangan, atau isu pembayaran. Sila berurusan dengan bijak.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;