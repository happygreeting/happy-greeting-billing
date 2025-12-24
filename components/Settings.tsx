import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Save, Upload } from 'lucide-react';

interface Props {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

export const Settings: React.FC<Props> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);

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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
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
                        <p className="text-xs text-gray-500 mt-2">Recommended: Square PNG/JPG, 500x500px</p>
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
    </div>
  );
};