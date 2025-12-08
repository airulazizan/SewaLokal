
import React, { useState } from 'react';
import { Item, ItemStatus, User } from '../types';
import { getItems, updateItemStatus, toggleFeatured, deleteItem, getUsers, verifyUser } from '../services/mockData';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'listings' | 'users'>('listings');
  const [items, setItems] = useState<Item[]>(getItems());
  const [users, setUsers] = useState<User[]>(getUsers());

  // Item Handlers
  const handleStatusChange = (id: string, newStatus: ItemStatus) => {
    updateItemStatus(id, newStatus);
    setItems(getItems()); // refresh
  };

  const handleFeaturedToggle = (id: string) => {
    toggleFeatured(id);
    setItems(getItems());
  };

  const handleDeleteItem = (id: string) => {
    if(confirm('Padam listing ini?')) {
      deleteItem(id);
      setItems(getItems());
    }
  };

  // User Handlers
  const handleVerifyUser = (userId: string, currentStatus: boolean) => {
    verifyUser(userId, !currentStatus);
    setUsers(getUsers()); // refresh
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 font-medium text-sm transition ${activeTab === 'listings' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Manage Listings
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium text-sm transition ${activeTab === 'users' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Manage Users (Trust Score)
        </button>
      </div>
      
      {activeTab === 'listings' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                       <img className="h-10 w-10 rounded object-cover mr-3" src={item.imageUrl} alt="" />
                       <div>
                         <div className="text-sm font-medium text-gray-900">{item.title}</div>
                         <div className="text-xs text-gray-500">{item.location}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.contactPhone}
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as ItemStatus)}
                      className={`text-xs font-bold px-2 py-1 rounded-full border-none focus:ring-0 cursor-pointer 
                        ${item.status === ItemStatus.ACTIVE ? 'bg-green-100 text-green-800' : 
                          item.status === ItemStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}
                    >
                      <option value={ItemStatus.PENDING}>PENDING</option>
                      <option value={ItemStatus.ACTIVE}>ACTIVE</option>
                      <option value={ItemStatus.REJECTED}>REJECTED</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleFeaturedToggle(item.id)}
                      className={`text-xs px-2 py-1 rounded border ${item.isFeatured ? 'bg-purple-100 text-purple-700 border-purple-200' : 'text-gray-400 border-gray-200'}`}
                    >
                      {item.isFeatured ? '★ Featured' : '☆ Promote'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trust Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                       <img className="h-8 w-8 rounded-full mr-3" src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}`} alt="" />
                       <div>
                         <div className="text-sm font-medium text-gray-900">{user.name}</div>
                         <div className="text-xs text-gray-500">{user.email}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                    {user.role}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`font-bold ${user.trustScore >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>{user.trustScore}</span>
                      <span className="text-xs text-gray-400 ml-1">/ 100</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.isVerified ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">Verified</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Unverified</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleVerifyUser(user.id, user.isVerified)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg border transition ${user.isVerified ? 'border-red-200 text-red-600 hover:bg-red-50' : 'bg-green-600 text-white hover:bg-green-700'}`}
                    >
                      {user.isVerified ? 'Revoke Verify' : 'Verify User'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
