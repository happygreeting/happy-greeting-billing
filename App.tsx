import React, { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, FileText, Printer, Save, Trash2, ArrowLeft, Menu, Package, CreditCard, X, RotateCcw, Settings as SettingsIcon, Eye, Download, Share2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import { Invoice, ViewState, LineItem, Product, AppSettings } from './types';
import { InvoicePreview } from './components/InvoicePreview';
import { Dashboard } from './components/Dashboard';
import { LiveAssistant } from './components/LiveAssistant';
import { Inventory } from './components/Inventory';
import { HGLogo } from './components/HGLogo';
import { Settings } from './components/Settings';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const STORAGE_KEY = 'happy_greeting_invoices';
const PRODUCTS_KEY = 'happy_greeting_products';
const SETTINGS_KEY = 'happy_greeting_settings';

const DEFAULT_SETTINGS: AppSettings = {
    companyName: 'Happy Greeting',
    tagline: 'Memories in Ink, Emotions on Paper',
    officeAddress: '18a, 4th Lane, Nungambakkam High Rd,\nChennai, Tamil Nadu 600034',
    officePhone: '8668142294',
    email: 'happygreetingtoyou@gmail.com',
    msmeNo: 'UDYAM-TN-02-0037689',
    upiId: '9092078319@okbizaxis',
    logoUrl: '',
    footerMessage: 'Thank you for shopping with Happy Greeting!',
    subFooterMessage: 'Please visit us again.',
    googleReviewUrl: 'https://g.page/r/CWwRZhiMQy2xEBM/review'
};

// CLEAN Defaults for new invoice
const NEW_INVOICE_TEMPLATE: Invoice = {
  id: '',
  invoiceNumber: '',
  date: '',
  customerName: '',
  customerPhone: '',
  officeNo: '',
  msmeNo: '',
  email: '',
  address: '',
  items: [
    { id: '1', description: '', quantity: 1, rate: 0 }
  ],
  extraCharges: 0,
  extraChargesLabel: 'Extra Charges',
  amountPaid: 0,
  totalAmount: 0,
  status: 'UNPAID'
};

// Helper to convert any date string to YYYY-MM-DD for input[type="date"]
const toInputDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr; // Return as is if invalid (or keep as text)
        return d.toISOString().split('T')[0];
    } catch (e) {
        return dateStr;
    }
};

function App() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>(NEW_INVOICE_TEMPLATE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Load Data
  useEffect(() => {
    const storedInvoices = localStorage.getItem(STORAGE_KEY);
    if (storedInvoices) setInvoices(JSON.parse(storedInvoices));

    const storedProducts = localStorage.getItem(PRODUCTS_KEY);
    if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
    } else {
        setProducts([
            { id: '1', name: 'Ready-made Card (Any Occasion)', type: 'READYMADE', price: 250 },
            { id: '2', name: 'Personalized Card', type: 'PERSONALIZED', price: 500 },
            { id: '3', name: 'Design Revision Fee', type: 'PERSONALIZED', price: 50 },
            { id: '4', name: 'Birthday Card', type: 'READYMADE', price: 250 },
            { id: '5', name: 'Christmas Card', type: 'READYMADE', price: 250 },
            { id: '6', name: 'Farewell Card', type: 'READYMADE', price: 250 },
            { id: '7', name: 'Best Wishes Card', type: 'READYMADE', price: 250 },
            { id: '8', name: 'Get Well Soon Card', type: 'READYMADE', price: 250 },
            { id: '9', name: 'Congratulations Card', type: 'READYMADE', price: 250 },
            { id: '10', name: 'Thank You Greeting Card', type: 'READYMADE', price: 250 },
            { id: '11', name: 'Womens Day Special', type: 'READYMADE', price: 250 },
            { id: '12', name: 'Ramzan Special – Eid Mubarak', type: 'READYMADE', price: 250 },
        ]);
    }

    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
    }
  }, []);

  // Update Favicon when settings change
  useEffect(() => {
    if (settings.logoUrl) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = settings.logoUrl;
    }
    document.title = `${settings.companyName} Billing`;
  }, [settings]);

  // Save Data
  useEffect(() => {
    if (invoices.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);


  // --- Invoice Logic ---
  const handleCreateNew = () => {
    // Auto-increment logic
    // Find max invoice number. If invalid numbers, ignore. Default start is 1404 (so next is 1405)
    const maxNum = invoices.reduce((max, inv) => {
        const num = parseInt(inv.invoiceNumber);
        return !isNaN(num) && num > max ? num : max;
    }, 1404);

    const nextInvoiceNum = (maxNum + 1).toString();

    setCurrentInvoice({
      ...NEW_INVOICE_TEMPLATE,
      id: '',
      invoiceNumber: nextInvoiceNum,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      items: [{ id: Date.now().toString(), description: '', quantity: 1, rate: 0 }],
      extraCharges: 0,
      extraChargesLabel: 'Extra Charges',
      amountPaid: 0,
      // Pre-fill company details into internal fields if needed
      officeNo: settings.officePhone,
      msmeNo: settings.msmeNo,
      email: settings.email, 
    });
    setView(ViewState.INVOICE_CREATE);
  };

  const handleEdit = (inv: Invoice) => {
    setCurrentInvoice(inv);
    setView(ViewState.INVOICE_EDIT);
  };

  const handlePrintList = (inv: Invoice) => {
      // Set as current to show in preview, then trigger print
      setCurrentInvoice(inv);
      setView(ViewState.INVOICE_EDIT); 
      // Using longer timeout to ensure render before print dialog on mobile
      setTimeout(() => window.print(), 500);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      const updated = invoices.filter(i => i.id !== id);
      setInvoices(updated);
      if(updated.length === 0) localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleSave = () => {
    if (!currentInvoice.customerName) {
        alert("Customer Name is required");
        return;
    }
    
    const subTotal = currentInvoice.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
    const total = subTotal + (currentInvoice.extraCharges || 0);

    const invoiceToSave = {
        ...currentInvoice,
        totalAmount: total,
        status: currentInvoice.amountPaid >= total ? 'PAID' : (currentInvoice.amountPaid > 0 ? 'PARTIAL' : 'UNPAID') as any
    };

    if (view === ViewState.INVOICE_CREATE) {
      setInvoices(prev => [{ ...invoiceToSave, id: Date.now().toString() }, ...prev]);
    } else {
      setInvoices(prev => prev.map(inv => inv.id === currentInvoice.id ? invoiceToSave : inv));
    }
    setView(ViewState.INVOICE_LIST);
  };

  const handleClearCart = () => {
      if(confirm('Clear all items?')) {
          setCurrentInvoice(prev => ({
              ...prev,
              items: [{ id: Date.now().toString(), description: '', quantity: 1, rate: 0 }],
              amountPaid: 0,
              extraCharges: 0,
              extraChargesLabel: 'Extra Charges'
          }));
      }
  };

  // --- Share Logic ---
  const handleShare = async () => {
    const element = document.getElementById('invoice-preview-container');
    if (!element) return;
    
    setIsSharing(true);

    try {
        // 1. Capture the Invoice Preview as a canvas
        const canvas = await html2canvas(element, {
            scale: 2, // Improve quality
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        // 2. Generate PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        // Calculate height to maintain aspect ratio
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);
        
        const fileName = `Invoice_${currentInvoice.invoiceNumber || 'New'}.pdf`;

        // 3. Share if supported
        if (navigator.share) {
             const blob = pdf.output('blob');
             const file = new File([blob], fileName, { type: 'application/pdf' });
             
             if (navigator.canShare && navigator.canShare({ files: [file] })) {
                 await navigator.share({
                     title: `Invoice #${currentInvoice.invoiceNumber}`,
                     text: `Here is the invoice for ${currentInvoice.customerName} from ${settings.companyName}.`,
                     files: [file]
                 });
                 setIsSharing(false);
                 return;
             }
        }
        
        // Fallback: Download the PDF
        pdf.save(fileName);
        alert("Downloaded PDF. You can now share this file manually.");

    } catch (error) {
        console.error("Share failed:", error);
        alert("Could not share directly. Please try 'Print / PDF' button.");
    } finally {
        setIsSharing(false);
    }
  };


  // --- Line Item Logic ---
  const addItem = () => {
    setCurrentInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), description: '', quantity: 1, rate: 0 }]
    }));
  };

  const updateItem = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...currentInvoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setCurrentInvoice(prev => ({ ...prev, items: newItems }));
  };

  const handleProductSelect = (index: number, productId: string) => {
      const product = products.find(p => p.id === productId);
      if (product) {
          const newItems = [...currentInvoice.items];
          newItems[index] = {
              ...newItems[index],
              description: product.name,
              rate: product.price,
              productId: product.id
          };
          setCurrentInvoice(prev => ({ ...prev, items: newItems }));
      }
  };

  const removeItem = (index: number) => {
    const newItems = currentInvoice.items.filter((_, i) => i !== index);
    setCurrentInvoice(prev => ({ ...prev, items: newItems }));
  };

  // --- Product CRUD ---
  const addProduct = (p: Product) => setProducts([...products, p]);
  const updateProduct = (p: Product) => setProducts(products.map(prod => prod.id === p.id ? p : prod));
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

  // --- Helpers ---
  const subTotal = currentInvoice.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  const formTotal = subTotal + (currentInvoice.extraCharges || 0);
  const balanceDue = formTotal - currentInvoice.amountPaid;

  const handlePayNow = () => {
      setShowPaymentModal(true);
  };
  
  const handlePaymentComplete = () => {
      setCurrentInvoice(prev => ({ ...prev, amountPaid: formTotal }));
      setShowPaymentModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* Sidebar */}
      <aside className={`bg-[#0f172a] text-white transition-all duration-300 print:hidden flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
           <div className={`flex items-center gap-2 ${!isSidebarOpen && 'justify-center w-full'}`}>
               <div className="w-8 h-8 flex items-center justify-center">
                    <HGLogo size="sm" showText={false} customLogo={settings.logoUrl} />
               </div>
               {isSidebarOpen && <span className="font-bold text-lg tracking-tight">Billing</span>}
           </div>
           {isSidebarOpen && (
                <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-white">
                    <ArrowLeft size={16} />
                </button>
           )}
           {!isSidebarOpen && (
               <button onClick={() => setIsSidebarOpen(true)} className="absolute top-6 right-[-12px] bg-brand-cyan rounded-full p-1 text-white shadow-lg">
                   <Menu size={12} />
               </button>
           )}
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
           <NavButton active={view === ViewState.DASHBOARD} onClick={() => setView(ViewState.DASHBOARD)} icon={<LayoutDashboard size={20} />} label="Dashboard" isOpen={isSidebarOpen} />
           <NavButton active={view === ViewState.INVOICE_LIST} onClick={() => setView(ViewState.INVOICE_LIST)} icon={<FileText size={20} />} label="Invoices" isOpen={isSidebarOpen} />
           <NavButton active={view === ViewState.INVENTORY} onClick={() => setView(ViewState.INVENTORY)} icon={<Package size={20} />} label="Inventory" isOpen={isSidebarOpen} />
           <NavButton active={view === ViewState.SETTINGS} onClick={() => setView(ViewState.SETTINGS)} icon={<SettingsIcon size={20} />} label="Settings" isOpen={isSidebarOpen} />
        </nav>
        
        <div className="p-4 border-t border-gray-800 bg-[#020617]">
             <div className="flex items-center gap-3 px-2">
                 <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/30">
                    {settings.logoUrl ? <img src={settings.logoUrl} className="w-full h-full rounded-full object-cover" /> : 'A'}
                 </div>
                 {isSidebarOpen && (
                     <div className="overflow-hidden">
                         <p className="text-sm font-medium text-white truncate">Admin</p>
                         <p className="text-xs text-gray-500 truncate">{settings.companyName}</p>
                     </div>
                 )}
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-20 print:hidden shadow-sm">
            <h1 className="text-xl font-bold text-gray-800">
                {view === ViewState.DASHBOARD && 'Dashboard'}
                {view === ViewState.INVOICE_LIST && 'All Invoices'}
                {view === ViewState.INVENTORY && 'Inventory Management'}
                {view === ViewState.SETTINGS && 'Company Settings'}
                {(view === ViewState.INVOICE_CREATE || view === ViewState.INVOICE_EDIT) && 'Invoice Editor'}
            </h1>
            
            {/* Always visible 'Create New' if not in editor mode, or specifically on list/dashboard */}
            {view !== ViewState.INVOICE_CREATE && view !== ViewState.INVOICE_EDIT && (
                <button 
                onClick={handleCreateNew}
                className="bg-brand-cyan hover:bg-cyan-600 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
                >
                <Plus size={18} /> New Invoice
                </button>
            )}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
           
           {view === ViewState.DASHBOARD && (
               <div className="space-y-8">
                   <Dashboard invoices={invoices} />
                   
                   {/* Quick Action */}
                   <div className="mx-6 text-center">
                        <button 
                            onClick={handleCreateNew}
                            className="bg-brand-orange hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-500/20 transition-all transform hover:-translate-y-1"
                        >
                            + Create Invoice #{invoices.reduce((max, i) => Math.max(max, parseInt(i.invoiceNumber)||0), 1404) + 1}
                        </button>
                   </div>
                   
                   {/* About Us / Company Profile Section */}
                   <div className="mx-6 mb-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-4 mb-6">
                                <HGLogo size="md" showText={false} customLogo={settings.logoUrl} />
                                <div>
                                    <h2 className="text-2xl font-black uppercase text-gray-900">About Us</h2>
                                    <p className="text-cyan-500 font-bold tracking-widest text-xs uppercase">{settings.tagline}</p>
                                </div>
                            </div>
                            
                            <div className="prose prose-sm max-w-none text-gray-600">
                                <h3 className="text-lg font-bold text-brand-orange mb-2">Making Every Greeting Special</h3>
                                <p className="mb-4">
                                    At {settings.companyName}, we believe that a greeting card is more than just words on paper—it’s an expression of love, joy, and cherished memories.
                                </p>
                                {/* ... rest of about us text ... */}
                                <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
                                    <strong>Contact Us:</strong> <br/>
                                    {settings.officeAddress} <br/>
                                    Phone: {settings.officePhone} | Email: {settings.email}
                                </div>
                            </div>
                        </div>
                   </div>
               </div>
           )}

           {view === ViewState.INVENTORY && <Inventory products={products} onAddProduct={addProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct} />}
           
           {view === ViewState.SETTINGS && <Settings settings={settings} onSave={setSettings} />}

           {view === ViewState.INVOICE_LIST && (
               <div className="p-4 md:p-8">
                   {/* ADDED: overflow-x-auto to wrapper and min-w on table to allow scrolling on mobile */}
                   <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                       <table className="w-full text-left text-sm text-gray-600 min-w-[700px]">
                           <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                               <tr>
                                   <th className="px-6 py-4">#</th>
                                   <th className="px-6 py-4">Date</th>
                                   <th className="px-6 py-4">Customer</th>
                                   <th className="px-6 py-4">Status</th>
                                   <th className="px-6 py-4 text-right">Amount</th>
                                   <th className="px-6 py-4 text-center">Actions</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100">
                               {invoices.length === 0 ? (
                                   <tr><td colSpan={6} className="text-center py-12 text-gray-400">No invoices yet</td></tr>
                               ) : (
                                   invoices.map(inv => {
                                       const subTotal = inv.items.reduce((s, i) => s + (i.quantity * i.rate), 0);
                                       const total = subTotal + (inv.extraCharges || 0);

                                       return (
                                           <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                                               <td className="px-6 py-4 font-medium text-gray-900">{inv.invoiceNumber}</td>
                                               <td className="px-6 py-4">{inv.date}</td>
                                               <td className="px-6 py-4">{inv.customerName}</td>
                                               <td className="px-6 py-4">
                                                   <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                       inv.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                       inv.status === 'PARTIAL' ? 'bg-orange-100 text-orange-700' :
                                                       'bg-red-100 text-red-700'
                                                   }`}>
                                                       {inv.status || (inv.amountPaid >= total ? 'PAID' : 'UNPAID')}
                                                   </span>
                                               </td>
                                               <td className="px-6 py-4 text-right font-medium">₹{total.toFixed(2)}</td>
                                               <td className="px-6 py-4 flex justify-center gap-3">
                                                   <button onClick={() => handleEdit(inv)} className="text-gray-500 hover:text-gray-700" title="View / Edit">
                                                       <Eye size={18} />
                                                   </button>
                                                   <button onClick={() => handlePrintList(inv)} className="text-gray-500 hover:text-gray-700" title="Print / Download PDF">
                                                       <Download size={18} />
                                                   </button>
                                                   <button onClick={() => handleDelete(inv.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                                               </td>
                                           </tr>
                                       );
                                   })
                               )}
                           </tbody>
                       </table>
                   </div>
               </div>
           )}

           {(view === ViewState.INVOICE_CREATE || view === ViewState.INVOICE_EDIT) && (
               <div className="flex flex-col xl:flex-row h-full">
                   
                   {/* Editor */}
                   <div className="w-full xl:w-[450px] bg-white border-r border-gray-200 p-6 overflow-y-auto print:hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
                        <div className="flex items-center justify-between mb-8">
                            <button onClick={() => setView(ViewState.INVOICE_LIST)} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                                <ArrowLeft size={16} className="mr-1" /> Back
                            </button>
                            <div className="flex gap-2">
                                <button onClick={handleClearCart} className="p-2 text-red-400 hover:bg-red-50 rounded" title="Clear Cart">
                                    <RotateCcw size={20} />
                                </button>
                                <button 
                                    onClick={handleShare} 
                                    className={`px-3 py-2 ${isSharing ? 'bg-brand-blue text-white' : 'text-gray-700 bg-gray-50 hover:bg-gray-100'} border border-gray-200 rounded flex items-center gap-2 transition-colors`} 
                                    title="Share via WhatsApp / Mail"
                                    disabled={isSharing}
                                >
                                    <Share2 size={18} className={isSharing ? 'animate-pulse' : ''} />
                                    <span className="text-sm font-medium">{isSharing ? '...' : 'Share'}</span>
                                </button>
                                <button onClick={() => window.print()} className="px-3 py-2 text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded flex items-center gap-2" title="Print / Download PDF">
                                    <Printer size={18} />
                                    <span className="text-sm font-medium">Print</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Customer Section */}
                            <section>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Customer Details</h3>
                                <div className="space-y-3">
                                    <input 
                                        type="text" 
                                        placeholder="Customer Name *"
                                        className="w-full p-3 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-brand-cyan outline-none"
                                        value={currentInvoice.customerName}
                                        onChange={e => setCurrentInvoice({...currentInvoice, customerName: e.target.value})}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input 
                                            type="text" 
                                            placeholder="Phone No"
                                            className="w-full p-3 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-brand-cyan outline-none"
                                            value={currentInvoice.customerPhone || ''}
                                            onChange={e => setCurrentInvoice({...currentInvoice, customerPhone: e.target.value})}
                                        />
                                        <input 
                                            type="date" 
                                            className="w-full p-3 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-brand-cyan outline-none"
                                            value={toInputDate(currentInvoice.date)}
                                            onChange={e => setCurrentInvoice({...currentInvoice, date: e.target.value})}
                                        />
                                    </div>
                                    <textarea 
                                        placeholder="Customer Address"
                                        rows={2}
                                        className="w-full p-3 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-brand-cyan outline-none resize-none"
                                        value={currentInvoice.address || ''}
                                        onChange={e => setCurrentInvoice({...currentInvoice, address: e.target.value})}
                                    />
                                </div>
                            </section>

                            {/* Items Section */}
                            <section>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Cart Items</h3>
                                <div className="space-y-3">
                                    {currentInvoice.items.map((item, index) => (
                                        <div key={item.id} className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm group relative hover:border-brand-cyan transition-colors">
                                            <button onClick={() => removeItem(index)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X size={16} />
                                            </button>
                                            
                                            {/* Product Selector */}
                                            <div className="mb-3">
                                                <select 
                                                    className="w-full text-sm font-medium text-gray-900 outline-none cursor-pointer bg-transparent"
                                                    value={item.productId || ''}
                                                    onChange={e => handleProductSelect(index, e.target.value)}
                                                >
                                                    <option value="">Select a Product / Card...</option>
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                                                    ))}
                                                </select>
                                                <input 
                                                    type="text"
                                                    className="w-full text-xs text-gray-500 mt-1 outline-none border-b border-dashed border-gray-200 focus:border-brand-cyan pb-1"
                                                    placeholder="Or type custom description..."
                                                    value={item.description}
                                                    onChange={e => updateItem(index, 'description', e.target.value)}
                                                />
                                            </div>

                                            <div className="flex gap-4 items-center">
                                                <div className="flex-1">
                                                    <label className="text-[10px] text-gray-400 uppercase font-bold">Price</label>
                                                    <div className="relative">
                                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                                                        <input 
                                                            type="number"
                                                            className="w-full pl-3 py-1 text-sm font-medium outline-none border-b border-gray-100 focus:border-brand-cyan"
                                                            value={item.rate}
                                                            onChange={e => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="w-16">
                                                    <label className="text-[10px] text-gray-400 uppercase font-bold">Qty</label>
                                                    <input 
                                                        type="number"
                                                        className="w-full py-1 text-sm font-medium outline-none border-b border-gray-100 focus:border-brand-cyan text-center"
                                                        value={item.quantity}
                                                        onChange={e => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                                <div className="text-right w-20">
                                                    <label className="text-[10px] text-gray-400 uppercase font-bold">Total</label>
                                                    <div className="text-sm font-bold text-gray-900 py-1">₹{(item.quantity * item.rate).toFixed(2)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={addItem} className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-400 rounded-xl hover:border-brand-cyan hover:text-brand-cyan font-medium text-sm transition-all">
                                        + Add Item
                                    </button>
                                </div>
                            </section>

                            {/* Payment Section */}
                            <section className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Sub Total</span>
                                    <span className="font-bold">₹{subTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm gap-2">
                                    <div className="flex-1">
                                        <input 
                                            type="text"
                                            className="w-full bg-transparent border-b border-dashed border-gray-300 text-xs text-gray-600 focus:border-brand-cyan outline-none"
                                            value={currentInvoice.extraChargesLabel || 'Extra Charges'}
                                            onChange={e => setCurrentInvoice({...currentInvoice, extraChargesLabel: e.target.value})}
                                            placeholder="Label (e.g. Design Fee)"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 bg-white border rounded px-2">
                                        <span className="text-gray-400">₹</span>
                                        <input 
                                            type="number"
                                            className="w-20 py-1 text-right outline-none text-gray-900 font-medium"
                                            value={currentInvoice.extraCharges || 0}
                                            onChange={e => setCurrentInvoice({...currentInvoice, extraCharges: parseFloat(e.target.value) || 0})}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Advance / Paid</span>
                                    <div className="flex items-center gap-1 bg-white border rounded px-2">
                                        <span className="text-gray-400">₹</span>
                                        <input 
                                            type="number"
                                            className="w-20 py-1 text-right outline-none text-gray-900 font-medium"
                                            value={currentInvoice.amountPaid}
                                            onChange={e => setCurrentInvoice({...currentInvoice, amountPaid: parseFloat(e.target.value) || 0})}
                                        />
                                    </div>
                                </div>
                                <div className="h-px bg-gray-200 my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-800">Balance Due</span>
                                    <span className={`font-bold text-xl ${balanceDue > 0 ? 'text-brand-orange' : 'text-green-600'}`}>
                                        ₹{balanceDue.toFixed(2)}
                                    </span>
                                </div>
                            </section>
                            
                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button 
                                    onClick={handlePayNow}
                                    className="bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <CreditCard size={18} /> Pay Now
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="bg-brand-cyan hover:bg-cyan-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/20"
                                >
                                    <Save size={18} /> Save
                                </button>
                            </div>

                        </div>
                   </div>

                   {/* Preview */}
                   <div className="flex-1 bg-gray-100 p-8 overflow-y-auto flex justify-center items-start print:p-0 print:bg-white print:w-full print:block">
                        <div id="invoice-preview-container" className="shadow-2xl print:shadow-none w-[210mm] print:w-full">
                            <InvoicePreview invoice={currentInvoice} settings={settings} />
                        </div>
                   </div>
               </div>
           )}
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm print:hidden">
              <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all scale-100">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg text-gray-800">Scan to Pay</h3>
                      <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-xl inline-block mb-4 border border-gray-100">
                      {/* Using the settings VPA */}
                      <QRCode 
                        value={`upi://pay?pa=${settings.upiId}&pn=${settings.companyName}&am=${(balanceDue > 0 ? balanceDue : formTotal).toFixed(2)}`} 
                        size={180} 
                        className="mx-auto"
                      />
                  </div>
                  
                  <p className="text-2xl font-black text-gray-900 mb-1">
                      ₹{(balanceDue > 0 ? balanceDue : formTotal).toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-sm mb-6">UPI: {settings.upiId}</p>

                  <div className="space-y-3">
                      <button 
                        onClick={handlePaymentComplete}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/20 transition-all active:scale-95"
                      >
                          Payment Received
                      </button>
                      <button 
                        onClick={() => setShowPaymentModal(false)}
                        className="w-full bg-white text-gray-500 font-bold py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                          Skip / Pay Later
                      </button>
                  </div>
              </div>
          </div>
      )}

      <LiveAssistant apiKey={process.env.API_KEY || ''} />
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label, isOpen }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            active 
            ? 'gradient-bg text-white shadow-lg shadow-cyan-500/20' 
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
    >
        {icon}
        {isOpen && <span className="font-medium text-sm">{label}</span>}
    </button>
);

export default App;