import React, { useState } from 'react';
import { Product, ProductType } from '../types';
import { Trash2, Plus, Edit2 } from 'lucide-react';

interface Props {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export const Inventory: React.FC<Props> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    type: 'READYMADE',
    price: 0,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
        onUpdateProduct({ ...formData, id: isEditing });
        setIsEditing(null);
    } else {
        onAddProduct({ ...formData, id: Date.now().toString() });
    }
    setFormData({ name: '', type: 'READYMADE', price: 0, description: '' });
  };

  const handleEdit = (p: Product) => {
    setIsEditing(p.id);
    setFormData({ name: p.name, type: p.type, price: p.price, description: p.description || '' });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({ name: '', type: 'READYMADE', price: 0, description: '' });
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
                <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Card' : 'Add New Card'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-cyan-500 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g. Birthday Blast"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="type"
                                    checked={formData.type === 'READYMADE'}
                                    onChange={() => setFormData({...formData, type: 'READYMADE'})}
                                    className="text-cyan-500 focus:ring-cyan-500"
                                />
                                <span className="text-sm">Readymade</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="type"
                                    checked={formData.type === 'PERSONALIZED'}
                                    onChange={() => setFormData({...formData, type: 'PERSONALIZED'})}
                                    className="text-cyan-500 focus:ring-cyan-500"
                                />
                                <span className="text-sm">Personalized</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                        <input 
                            required
                            type="number" 
                            min="0"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-cyan-500 outline-none"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                        />
                    </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                        <textarea 
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-cyan-500 outline-none"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-brand-cyan hover:bg-cyan-600 text-white py-2 rounded font-medium transition-colors">
                            {isEditing ? 'Update Card' : 'Add Card'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={cancelEdit} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Type</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Price</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">No cards in inventory yet.</td></tr>
                        ) : (
                            products.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3">
                                        <div className="font-medium text-gray-900">{p.name}</div>
                                        {p.description && <div className="text-xs text-gray-500">{p.description}</div>}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${p.type === 'READYMADE' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                                            {p.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right">₹{p.price.toFixed(2)}</td>
                                    <td className="px-6 py-3 flex justify-center gap-2">
                                        <button onClick={() => handleEdit(p)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16}/></button>
                                        <button onClick={() => onDeleteProduct(p.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};