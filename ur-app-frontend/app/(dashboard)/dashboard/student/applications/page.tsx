'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import ApplicationForm from '@/components/student/ApplicationForm';
import PaymentForm from '@/components/student/PaymentForm';
import { Button } from '@/components/ui/Button';

interface SubmittedApplication {
  id: string;
  program_id: string;
  program_name: string;
  college_name: string;
  priority: number;
  status: string;
}

export default function StudentApplicationsPage() {
  const router = useRouter();
  const [canApply, setCanApply] = useState<boolean | null>(null);
  const [previousApps, setPreviousApps] = useState<SubmittedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingApps, setFetchingApps] = useState(false);

  const fetchPreviousApplications = async () => {
    setFetchingApps(true);
    try {
      const res = await api.get('/applications');
      setPreviousApps(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setFetchingApps(false);
    }
  };

  const checkAccess = async () => {
    try {
      await api.get('/student/profile');
      const res = await api.get('/payments/check');
      setCanApply(res.data.data.canApply);
    } catch (error: any) {
      if (error.response?.status === 404) {
        router.push('/dashboard/student/profile');
        return;
      }
      setCanApply(false);
    } finally {
      setLoading(false);
    }
  };

  // Initial load: check payment access and fetch previous apps
  useEffect(() => {
    const init = async () => {
      await checkAccess();
      await fetchPreviousApplications();
    };
    init();
  }, []);

  const handlePaymentSuccess = async () => {
    await checkAccess();    // re‑evaluate canApply
    // No need to refetch apps – payment success doesn't change previous apps
  };

  const handleApplicationSuccess = async () => {
    await fetchPreviousApplications(); // refresh the list after a new batch is submitted
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (canApply === null) return null;

  return (
    <div className="space-y-8">
      {/* Display previous applications (always visible) */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Previous Applications</h1>
        {fetchingApps ? (
          <p>Loading...</p>
        ) : previousApps.length === 0 ? (
          <p className="text-gray-500">No applications submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {previousApps.map((app) => (
              <div key={app.id} className="bg-white border rounded p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{app.program_name}</p>
                    <p className="text-sm text-gray-500">{app.college_name}</p>
                    <p className="text-xs text-gray-400">Priority: {app.priority}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                    app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    app.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>{app.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment or Application Form */}
      <div>
        {!canApply ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Make a Payment</h1>
            <PaymentForm onSuccess={handlePaymentSuccess} />
            <div className="text-center mt-4">
              <Button variant="secondary" onClick={checkAccess}>Refresh Payment Status</Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Submit New Application Batch</h1>
            <ApplicationForm onSubmitSuccess={handleApplicationSuccess} />
          </>
        )}
      </div>
    </div>
  );
}