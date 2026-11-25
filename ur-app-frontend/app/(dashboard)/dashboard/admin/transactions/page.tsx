'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

interface Payment {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  transaction_id: string;
  payer_name: string | null;
  phone_number: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: number;
  approved_at: number | null;
}

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (search) params.append('search', search);
      const res = await api.get(`/payments/all?${params.toString()}`);
      setPayments(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filterStatus, search]);

  const updateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.patch(`/payments/${id}`, { status });
      fetchPayments();
    } catch (error) {
      alert('Update failed');
    }
  };

  const formatDate = (ts: number) => new Date(ts * 1000).toLocaleString();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transaction Management</h1>
      <div className="bg-white p-4 rounded shadow mb-6 flex flex-col sm:flex-row gap-3">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <input placeholder="Search by transaction ID, payer name, phone" value={search} onChange={(e) => setSearch(e.target.value)} className="border rounded px-3 py-2 flex-1" />
        <Button variant="secondary" onClick={() => { setFilterStatus(''); setSearch(''); }}>Clear</Button>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Student</th>
              <th className="px-4 py-2">Transaction ID</th>
              <th className="px-4 py-2">Payer</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-b">
                <td className="px-4 py-2">{p.first_name} {p.last_name}</td>
                <td className="px-4 py-2">{p.transaction_id}</td>
                <td className="px-4 py-2">{p.payer_name || '-'}</td>
                <td className="px-4 py-2">{p.phone_number}</td>
                <td className="px-4 py-2">{p.amount} FRW</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${p.status === 'APPROVED' ? 'bg-green-100 text-green-800' : p.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-2">{formatDate(p.created_at)}</td>
                <td className="px-4 py-2 space-x-2">
                  {p.status === 'PENDING' && (
                    <>
                      <button onClick={() => updateStatus(p.id, 'APPROVED')} className="text-green-600 hover:underline">Approve</button>
                      <button onClick={() => updateStatus(p.id, 'REJECTED')} className="text-red-600 hover:underline">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="p-4 text-center">Loading...</div>}
        {!loading && payments.length === 0 && <div className="p-4 text-center text-gray-500">No payments found.</div>}
      </div>
    </div>
  );
}