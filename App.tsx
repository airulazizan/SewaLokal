import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import ItemDetail from './pages/ItemDetail';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { User, UserRole } from './types';
import { MOCK_USERS } from './services/mockData';

// Simple Hash Router Implementation
const App: React.FC = () => {
  const [route, setRoute] = useState<string>('');
  const [param, setParam] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
  };

  const handleLogin = (role: UserRole) => {
    // Simulating login with different roles using Mock Data
    const mockUser = MOCK_USERS.find(u => u.role === role);
    if (mockUser) {
      setUser(mockUser);
      setShowLoginModal(false);
      if (role === UserRole.ADMIN) navigate('admin');
      else navigate('dashboard');
    }
  };

  const renderContent = () => {
    if (route === 'detail' && param) {
      return <ItemDetail itemId={param} onBack={() => navigate('')} />;
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
      onLoginRequest={() => setShowLoginModal(true)}
    >
      {renderContent()}

      {/* Simple Login Modal Simulation */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login / Daftar</h2>
            <div className="space-y-3">
              <button 
                onClick={() => handleLogin(UserRole.OWNER)}
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
              >
                Login sebagai Owner
              </button>
              <button 
                onClick={() => handleLogin(UserRole.ADMIN)}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Login Admin (Demo)
              </button>
            </div>
            <p className="mt-6 text-xs text-center text-gray-400">
              Ini adalah simulasi login. Dalam app sebenar, ini akan ada form email & password.
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;