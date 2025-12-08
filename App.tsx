
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import ItemDetail from './pages/ItemDetail';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import { User, UserRole } from './types';
import { getUsers, registerUser } from './services/mockData';

// Simple Hash Router Implementation
const App: React.FC = () => {
  const [route, setRoute] = useState<string>('');
  const [param, setParam] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  
  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // remove #
      const [path, id] = hash.split('/');
      setRoute(path || '');
      setParam(id);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string, id?: string) => {
    window.location.hash = id ? `${path}/${id}` : path;
    window.scrollTo(0, 0); // Reset scroll on nav
  };

  const handleLogin = (role: UserRole) => {
    // Simulating login with different roles using Mock Data
    const mockUser = getUsers().find(u => u.role === role);
    if (mockUser) {
      setUser(mockUser);
      setShowLoginModal(false);
      if (role === UserRole.ADMIN) navigate('admin');
      else navigate('dashboard');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone) {
      alert("Sila isi semua maklumat");
      return;
    }
    const newUser = registerUser(regName, regEmail, regPhone);
    setUser(newUser);
    setShowLoginModal(false);
    navigate('dashboard');
    // Reset form
    setRegName('');
    setRegEmail('');
    setRegPhone('');
    alert(`Selamat datang, ${newUser.name}!`);
  };

  const renderContent = () => {
    if (route === 'detail' && param) {
      return <ItemDetail itemId={param} onNavigate={navigate} onBack={() => navigate('')} />;
    }

    if (route === 'profile' && param) {
      return <UserProfile userId={param} onNavigate={navigate} onBack={() => navigate('')} />;
    }

    if (route === 'dashboard') {
      if (!user) {
        // Redirect to login/home if not logged in
        setTimeout(() => setShowLoginModal(true), 100);
        navigate('');
        return null;
      }
      return <OwnerDashboard user={user} />;
    }

    if (route === 'admin') {
      if (!user || user.role !== UserRole.ADMIN) {
        navigate('');
        return null;
      }
      return <AdminDashboard />;
    }

    return <Home onNavigate={navigate} />;
  };

  return (
    <Layout 
      user={user} 
      onLogout={() => { setUser(null); navigate(''); }}
      onLoginRequest={() => { setLoginMode('login'); setShowLoginModal(true); }}
    >
      {renderContent()}

      {/* Login / Register Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl relative animate-fade-in-down">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            
            <div className="flex justify-center mb-6 border-b border-gray-100">
              <button 
                onClick={() => setLoginMode('login')}
                className={`pb-2 px-4 font-semibold text-sm transition ${loginMode === 'login' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-400'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setLoginMode('register')}
                className={`pb-2 px-4 font-semibold text-sm transition ${loginMode === 'register' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-400'}`}
              >
                Daftar Baru
              </button>
            </div>

            {loginMode === 'login' ? (
              <>
                <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Selamat Kembali</h2>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleLogin(UserRole.OWNER)}
                    className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition shadow-lg shadow-teal-200"
                  >
                    Login sebagai Owner (Demo)
                  </button>
                  <button 
                    onClick={() => handleLogin(UserRole.ADMIN)}
                    className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Login Admin (Demo)
                  </button>
                </div>
                <p className="mt-6 text-xs text-center text-gray-400">
                  *Klik butang di atas untuk simulasi login akaun demo.
                </p>
              </>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                 <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Daftar Akaun Owner</h2>
                 <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">Nama Penuh</label>
                   <input required type="text" value={regName} onChange={e => setRegName(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="Ali bin Abu" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                   <input required type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="ali@gmail.com" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">No. Telefon (WhatsApp)</label>
                   <input required type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="60123456789" />
                 </div>
                 <button 
                    type="submit"
                    className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition shadow-lg shadow-teal-200 mt-2"
                  >
                    Daftar Sekarang
                  </button>
              </form>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
