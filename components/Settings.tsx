import React, { useState } from 'react';
import { AppSettings, User } from '../types';
import { Save, Upload, UserPlus, Trash2, Edit2, X, Check } from 'lucide-react';

interface Props {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  currentUser: User;
  users: User[];
  onAddUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  onUpdateUser: (user: User) => void;
}

export const Settings: React.FC<Props> = ({ settings, onSave, currentUser, users, onAddUser, onDeleteUser, onUpdateUser }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  
  // New User State
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });

  // Editing User State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<User | null>(null);

  const handleChange = (field: keyof AppSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    alert('Settings Saved Successfully!');
  };

  const handleCreateUser = (e: React.FormEvent) => {
      e.preventDefault();
      // Basic Validation
      if (!newUser.name || !newUser.email || !newUser.password) {
          alert("All fields are required for new user");
          return;
      }
      if (users.some(u => u.email === newUser.email)) {
          alert("User with this email already exists");
          return;
      }
      
      const userToAdd: User = {
          id: Date.now().toString(),
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: 'EMPLOYEE'
      };
      
      onAddUser(userToAdd);
      setNewUser({ name: '', email: '', password: '' });
      alert("Employee account created!");
  };

  const startEditing = (user: User) => {
      setEditingUserId(user.id);
      setEditFormData({ ...user });
  };

  const cancelEditing = () => {
      setEditingUserId(null);
      setEditFormData(null);
  };

  const saveEditing = () => {
      if (editFormData) {
          onUpdateUser(editFormData);
          setEditingUserId(null);
          setEditFormData(null);
      }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Company Settings</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Logo Section */}
            <div className="flex items-center gap-6 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                    {formData.logoUrl ? (
                        <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                        <span className="text-gray-400 text-xs text-center p-2">No Logo</span>
                    )}
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo & Favicon</label>
                    <div className="relative">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden" 
                            id="logo-upload"
                        />
                        <label 
                            htmlFor="logo-upload"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                            <Upload size={16} />
                            Upload Image
                        </label>
                        <p className="text-xs text-gray-500 mt-2">Uploading a logo here will also update the browser tab icon (favicon).</p>
                    </div>
                </div>
                {formData.logoUrl && (
                    <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, logoUrl: '' }))}
                        className="text-red-500 text-sm hover:underline"
                    >
                        Remove
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input 
                        type="text" 
                        value={formData.companyName}
                        onChange={e => handleChange('companyName', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-cyan outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                    <input 
                        type="text" 
                        value={formData.tagline}
                        onChange={e => handleChange('tagline', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-cyan outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
                <textarea 
                    rows={3}
                    value={formData.officeAddress}
                    onChange={e => handleChange('officeAddress', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-cyan outline-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Office Phone</label>
                    <input 
                        type="text" 
                        value={formData.officePhone}
                        onChange={e => handleChange('officePhone', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-cyan outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                        type="text" 
                        value={formData.email}
                        onChange={e => handleChange('email', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-cyan outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MSME / Reg No</label>
                    <input 
                        type="text" 
                        value={formData.msmeNo}
                        onChange={e => handleChange('msmeNo', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-cyan outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID (for Payment Modal)</label>
                    <input 
                        type="text" 
                        value={formData.upiId}
                        onChange={e => handleChange('upiId', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-cyan outline-none"
                        placeholder="e.g. 9092078319@okbizaxis"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Review Link (for Invoice QR)</label>
                <input 
                    type="text" 
                    value={formData.googleReviewUrl || ''}
                    onChange={e => handleChange('googleReviewUrl', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-cyan outline-none"
                    placeholder="https://g.page/r/..."
                />
            </div>
            
            <div className="border-t border-gray-100 pt-6">
                 <h3 className="text-md font-bold text-gray-800 mb-4">Invoice Footer Text</h3>
                 <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Footer Message (Main)</label>
                        <input 
                            type="text" 
                            value={formData.footerMessage || ''}
                            onChange={e => handleChange('footerMessage', e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-cyan outline-none"
                            placeholder="Thank you for shopping with Happy Greeting!"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Footer Message (Sub)</label>
                        <input 
                            type="text" 
                            value={formData.subFooterMessage || ''}
                            onChange={e => handleChange('subFooterMessage', e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-cyan outline-none"
                            placeholder="Please visit us again."
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button 
                    type="submit" 
                    className="bg-brand-cyan hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                    <Save size={18} /> Save Settings
                </button>
            </div>

        </form>
      </div>
      
      {/* ADMIN ONLY: User Management */}
      {currentUser.role === 'ADMIN' && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                <p className="text-xs text-gray-500 mt-1">Create employee accounts for staff access.</p>
             </div>
             
             <div className="p-6">
                 {/* List Users */}
                 <div className="mb-8">
                     <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Active Users</h3>
                     <div className="space-y-3">
                         {users.map(user => (
                             <div key={user.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 gap-4">
                                 
                                 {/* Edit Mode */}
                                 {editingUserId === user.id && editFormData ? (
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="flex flex-col">
                                           <label className="text-[10px] uppercase font-bold text-gray-400">Name</label>
                                           <input 
                                                className="p-2 border rounded text-sm focus:ring-2 focus:ring-brand-cyan outline-none"
                                                value={editFormData.name}
                                                onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                                           />
                                        </div>
                                        <div className="flex flex-col">
                                           <label className="text-[10px] uppercase font-bold text-gray-400">Email</label>
                                           <input 
                                                className="p-2 border rounded text-sm focus:ring-2 focus:ring-brand-cyan outline-none"
                                                value={editFormData.email}
                                                onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                                           />
                                        </div>
                                        <div className="flex flex-col">
                                           <label className="text-[10px] uppercase font-bold text-gray-400">Password</label>
                                           <input 
                                                type="text"
                                                className="p-2 border rounded text-sm focus:ring-2 focus:ring-brand-cyan outline-none"
                                                value={editFormData.password}
                                                onChange={e => setEditFormData({...editFormData, password: e.target.value})}
                                           />
                                        </div>
                                    </div>
                                 ) : (
                                    /* View Mode */
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user.role === 'ADMIN' ? 'bg-brand-orange' : 'bg-brand-blue'}`}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                 )}

                                 <div className="flex items-center gap-3 self-end md:self-auto">
                                     {editingUserId === user.id ? (
                                        <>
                                            <button 
                                                onClick={saveEditing}
                                                className="bg-green-100 text-green-700 p-2 rounded hover:bg-green-200"
                                                title="Save Changes"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button 
                                                onClick={cancelEditing}
                                                className="bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200"
                                                title="Cancel"
                                            >
                                                <X size={18} />
                                            </button>
                                        </>
                                     ) : (
                                        <>
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${user.role === 'ADMIN' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {user.role}
                                            </span>
                                            <button 
                                                onClick={() => startEditing(user)}
                                                className="text-gray-400 hover:text-brand-blue p-2 hover:bg-blue-50 rounded transition-colors"
                                                title="Edit User / Change Password"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            {user.id !== currentUser.id && (
                                                <button 
                                                    onClick={() => onDeleteUser(user.id)}
                                                    className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </>
                                     )}
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
                 
                 {/* Create User Form */}
                 <div className="border-t border-gray-100 pt-6">
                     <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Add New Employee</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                         <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">Name</label>
                             <input 
                                type="text" 
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-cyan outline-none"
                                placeholder="Employee Name"
                                value={newUser.name}
                                onChange={e => setNewUser({...newUser, name: e.target.value})}
                             />
                         </div>
                         <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                             <input 
                                type="email" 
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-cyan outline-none"
                                placeholder="employee@email.com"
                                value={newUser.email}
                                onChange={e => setNewUser({...newUser, email: e.target.value})}
                             />
                         </div>
                         <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">Password</label>
                             <input 
                                type="password" 
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-cyan outline-none"
                                placeholder="******"
                                value={newUser.password}
                                onChange={e => setNewUser({...newUser, password: e.target.value})}
                             />
                         </div>
                     </div>
                     <button 
                        onClick={handleCreateUser}
                        className="mt-4 flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors"
                     >
                         <UserPlus size={16} /> Create Account
                     </button>
                 </div>
             </div>
          </div>
      )}
    </div>
  );
};