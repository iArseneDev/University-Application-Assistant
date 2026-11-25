'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Payment {
  id: string;
  transaction_id: string;
  payer_name: string | null;
  phone_number: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: number;
  approved_at: number | null;
}

export default function PaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [transactionId, setTransactionId] = useState('');
  const [payerName, setPayerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments/my');
      setPayments(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSubmit = async () => {
    if (!transactionId.trim()) return alert('Transaction ID required');
    if (!phoneNumber.trim()) return alert('Phone number required');
    setLoading(true);
    try {
      await api.post('/payments', { transaction_id: transactionId, payer_name: payerName, phone_number: phoneNumber });
      alert('Payment recorded. Wait for admin approval.');
      setTransactionId('');
      setPayerName('');
      setPhoneNumber('');
      await fetchPayments();
      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (ts: number) => new Date(ts * 1000).toLocaleString();

  if (fetching) return <div>Loading payment history...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Pay 5,000 FRW to Apply</h2>
        <p className="text-gray-600 mb-4">
          Make a payment via MTN MOMO PAY CODE <strong>700181</strong> Names: <strong>ApplicationGate</strong> (Reference: Your Phone Number). Then enter details below.
        </p>
        <Input placeholder="Transaction ID (receipt number)" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
        <Input placeholder="Payer Name (optional)" value={payerName} onChange={(e) => setPayerName(e.target.value)} />
        <Input placeholder="Your Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <Button onClick={handleSubmit} isLoading={loading} className="w-full mt-3">Submit Payment</Button>
      </div>

      {/* Payment History */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Your Payment History</h3>
        {payments.length === 0 ? (
          <p className="text-gray-500">No payments recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Transaction ID</th>
                  <th className="px-4 py-2 text-left">Payer Name</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className="border-b">
                    <td className="px-4 py-2">{p.transaction_id}</td>
                    <td className="px-4 py-2">{p.payer_name || '-'}</td>
                    <td className="px-4 py-2">{p.phone_number}</td>
                    <td className="px-4 py-2">{p.amount} FRW</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        p.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        p.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>{p.status}</span>
                    </td>
                    <td className="px-4 py-2">{formatDate(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}