import React from 'react';
import { Invoice, AppSettings } from '../types';
import { HGLogo } from './HGLogo';
import QRCode from "react-qr-code";

interface Props {
  invoice: Invoice;
  settings: AppSettings;
}

export const InvoicePreview: React.FC<Props> = ({ invoice, settings }) => {
  const calculateSubTotal = () => {
    return invoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const subTotal = calculateSubTotal();
  const extraCharges = invoice.extraCharges || 0;
  const totalAmount = subTotal + extraCharges;
  const balanceDue = totalAmount - invoice.amountPaid;
  
  // Use Google Review URL from settings, or fallback
  const reviewUrl = settings.googleReviewUrl || "https://g.page/r/CWwRZhiMQy2xEBM/review";

  // Format Date for Display
  const formattedDate = React.useMemo(() => {
    if (!invoice.date) return '';
    const date = new Date(invoice.date);
    if (isNaN(date.getTime())) return invoice.date; // Fallback to raw string
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }, [invoice.date]);

  // Determine Balance Label
  const balanceLabel = (invoice.amountPaid > 0 && balanceDue > 0) ? "Pending Amount" : "Balance Due";

  return (
    <div className="w-full bg-white min-h-[1100px] relative text-sm font-sans flex flex-col">
        
      {/* Top Banner Stripe - Orange */}
      <div className="h-3 bg-brand-orange w-full"></div>

      <div className="p-8 md:p-12 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
                <HGLogo size="lg" showText={false} customLogo={settings.logoUrl} />
                <div>
                    <h1 className="text-4xl font-black uppercase text-brand-orange tracking-tight leading-none">{settings.companyName}</h1>
                    <p className="text-cyan-500 font-bold tracking-widest text-[10px] uppercase mt-1">{settings.tagline}</p>
                </div>
            </div>
            <div className="text-right">
                <h2 className="text-5xl font-light text-gray-200 uppercase tracking-widest">Invoice</h2>
                <div className="mt-2 text-gray-600">
                    <p className="font-bold text-gray-900 text-lg">#{invoice.invoiceNumber}</p>
                    <p>{formattedDate}</p>
                </div>
            </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-12 mb-8 border-t-2 border-brand-cyan py-6">
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
                <p className="text-xl font-bold text-gray-800 mb-1">{invoice.customerName}</p>
                {invoice.customerPhone && <p className="text-gray-600">Ph: {invoice.customerPhone}</p>}
                {invoice.address && <p className="text-gray-600 w-2/3 mt-1 leading-snug">{invoice.address}</p>}
            </div>
            <div className="text-right">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Our Details</h3>
                <div className="text-gray-600 leading-snug whitespace-pre-line mb-2">
                    {settings.officeAddress}
                </div>
                {settings.officePhone && <p className="text-gray-600"><span className="font-medium text-gray-900">Phone:</span> {settings.officePhone}</p>}
                {settings.msmeNo && <p className="text-gray-600"><span className="font-medium text-gray-900">Reg No:</span> {settings.msmeNo}</p>}
                <p className="text-gray-600 mt-2">{settings.email}</p>
            </div>
        </div>

        {/* Table */}
        <div className="mb-8 flex-1">
            <table className="w-full">
                <thead className="text-xs font-bold text-white uppercase bg-gray-800">
                    <tr>
                        <th className="py-3 px-4 text-left rounded-l">Description</th>
                        <th className="py-3 px-4 text-right">Price</th>
                        <th className="py-3 px-4 text-right">Qty</th>
                        <th className="py-3 px-4 text-right rounded-r">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {invoice.items.map((item) => (
                        <tr key={item.id}>
                            <td className="py-4 px-4 font-medium text-gray-800">{item.description}</td>
                            <td className="py-4 px-4 text-right text-gray-600">₹{item.rate.toFixed(2)}</td>
                            <td className="py-4 px-4 text-right text-gray-600">{item.quantity}</td>
                            <td className="py-4 px-4 text-right font-bold text-gray-800">₹{(item.quantity * item.rate).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Footer Section */}
        <div className="flex justify-between items-end mt-4 mb-8">
            
            {/* Review Info / QR - Replaced Payment QR */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center gap-5">
                <div className="bg-white p-2 rounded shadow-sm border border-gray-100">
                    <QRCode value={reviewUrl} size={90} />
                </div>
                <div className="text-xs text-gray-600">
                    <p className="font-bold text-gray-900 text-sm mb-1">Scan to Review</p>
                    <p className="mt-1 font-medium text-brand-blue">Rate us on Google!</p>
                    <p className="mt-2 text-[10px] text-gray-400">{settings.companyName}</p>
                </div>
            </div>

            {/* Totals */}
            <div className="w-1/3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Sub Total</span>
                    <span className="font-medium">₹{subTotal.toFixed(2)}</span>
                </div>
                {extraCharges > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">{invoice.extraChargesLabel || 'Extra Charges'}</span>
                        <span className="font-medium">₹{extraCharges.toFixed(2)}</span>
                    </div>
                )}
                 <div className="flex justify-between py-2 border-b border-gray-100 text-green-600">
                    <span className="text-gray-500">Advance / Paid</span>
                    <span className="font-medium">- ₹{invoice.amountPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-4 text-2xl font-black text-gray-900">
                    <span>{balanceLabel}</span>
                    <span className={balanceDue > 0 ? "text-brand-orange" : "text-gray-900"}>
                        ₹{balanceDue.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
        
        {/* Footer Notes & Address */}
        <div className="border-t border-gray-200 pt-6 text-center">
            <h4 className="font-bold text-gray-800 mb-1">
                {settings.footerMessage || `Thank you for shopping with ${settings.companyName}!`}
            </h4>
            <p className="text-gray-500 text-sm italic mb-4">
                {settings.subFooterMessage || "Please visit us again."}
            </p>
            
            <div className="text-xs text-gray-400 uppercase tracking-wide whitespace-pre-line">
                {settings.officeAddress.replace(/\n/g, ', ')}
            </div>
        </div>

      </div>
      
      {/* Bottom Stripe */}
      <div className="h-3 bg-brand-cyan w-full"></div>
    </div>
  );
};