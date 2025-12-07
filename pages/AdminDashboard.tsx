import React, { useState } from 'react';
import { Item, ItemStatus } from '../types';
import { getItems, updateItemStatus, toggleFeatured, deleteItem } from '../services/mockData';

const AdminDashboard: React.FC = () => {
  const [items, setItems] = useState<Item[]>(getItems());

  const handleStatusChange = (id: string, newStatus: ItemStatus) => {
    updateItemStatus(id, newStatus);
    setItems(getItems()); // refresh
  };

  const handleFeaturedToggle = (id: string) => {
    toggleFeatured(id);
    setItems(getItems());
  };

  const handleDelete = (id: string) => {
    if(confirm('Padam listing ini?')) {
      deleteItem(id);
      setItems(getItems());
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Admin Panel (Moderation)</h2>
      
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
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;