import React from 'react';
import { Invoice } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  invoices: Invoice[];
}

export const Dashboard: React.FC<Props> = ({ invoices }) => {
  // Aggregate sales by month
  const data = React.useMemo(() => {
    const monthlyData: Record<string, number> = {};
    
    invoices.forEach(inv => {
      const date = new Date(inv.date);
      // Fallback if date parsing fails, strictly standard JS Date parsing
      if (!isNaN(date.getTime())) {
          const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
          const total = inv.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
          monthlyData[monthYear] = (monthlyData[monthYear] || 0) + total;
      }
    });

    return Object.entries(monthlyData).map(([name, amount]) => ({
      name,
      amount
    }));
  }, [invoices]);

  const totalRevenue = invoices.reduce((acc, inv) => {
     return acc + inv.items.reduce((s, i) => s + (i.quantity * i.rate), 0);
  }, 0);

  const outstanding = invoices.reduce((acc, inv) => {
     const total = inv.items.reduce((s, i) => s + (i.quantity * i.rate), 0);
     return acc + (total - inv.amountPaid);
  }, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
           <p className="text-gray-500 text-sm">Total Revenue</p>
           <p className="text-3xl font-bold text-brand-blue">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
           <p className="text-gray-500 text-sm">Invoices Generated</p>
           <p className="text-3xl font-bold text-gray-800">{invoices.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
           <p className="text-gray-500 text-sm">Outstanding Balance</p>
           <p className="text-3xl font-bold text-brand-orange">₹{outstanding.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-[400px]">
        <h3 className="text-lg font-semibold mb-4">Monthly Sales Report</h3>
        {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" fill="#4A90E2" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
            </ResponsiveContainer>
        ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
                No data available yet. Create invoices to see reports.
            </div>
        )}
      </div>
    </div>
  );
};