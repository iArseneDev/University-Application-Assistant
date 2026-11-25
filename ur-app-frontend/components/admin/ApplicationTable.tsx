'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

interface Application {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  program_name: string;
  priority: number;
  status: string;
  created_at: string;
}

interface StudentFullDetails {
  profile: any;
  results: any[];
  applications: any[];
}

export default function ApplicationTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentFullDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchApps = async () => {
    try {
      const res = await api.get('/applications/all');
      setApplications(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/applications/${id}`, { status });
      fetchApps();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const viewStudentDetails = async (studentId: string) => {
    setModalLoading(true);
    try {
      const res = await api.get(`/admin/student/${studentId}`);
      setSelectedStudent(res.data.data);
    } catch (error) {
      alert('Failed to load student details');
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading applications...</div>;

  return (
    <>
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Program</th>
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b">
                  <td className="px-4 py-3">{app.first_name} {app.last_name}<br/><span className="text-xs text-gray-500">{app.email}</span></td>
                  <td className="px-4 py-3">{app.program_name}</td>
                  <td className="px-4 py-3">{app.priority}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                      app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>{app.status}</span>
                  </td>
                  <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                    <button onClick={() => updateStatus(app.id, 'ACCEPTED')} className="text-green-600 hover:underline text-sm">Accept</button>
                    <button onClick={() => updateStatus(app.id, 'REJECTED')} className="text-red-600 hover:underline text-sm">Reject</button>
                    <button onClick={() => viewStudentDetails(app.student_id)} className="text-blue-600 hover:underline text-sm">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Student Full Details */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Student Full Dossier</h2>
              <button onClick={() => setSelectedStudent(null)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              {modalLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {/* Profile Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-3">Profile Information</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <p><span className="font-medium">Name:</span> {selectedStudent.profile?.first_name} {selectedStudent.profile?.last_name}</p>
                      <p><span className="font-medium">Email:</span> {selectedStudent.profile?.email}</p>
                      <p><span className="font-medium">National ID:</span> {selectedStudent.profile?.national_id}</p>
                      <p><span className="font-medium">Phone:</span> {selectedStudent.profile?.phone_number}</p>
                      <p><span className="font-medium">School:</span> {selectedStudent.profile?.school_name}</p>
                      <p><span className="font-medium">Combination:</span> {selectedStudent.profile?.combination}</p>
                      <p><span className="font-medium">Total Points:</span> {selectedStudent.profile?.total_points}</p>
                      <p><span className="font-medium">Index Number:</span> {selectedStudent.profile?.index_number}</p>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-3">Academic Results</h3>
                    {selectedStudent.results?.length === 0 ? (
                      <p className="text-gray-500">No results recorded.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border">
                          <thead className="bg-gray-50">
                            <tr><th className="px-3 py-2 text-left">Subject</th><th>Grade</th><th>Points</th></tr>
                          </thead>
                          <tbody>
                            {selectedStudent.results?.map((r: any) => (
                              <tr key={r.id} className="border-b">
                                <td className="px-3 py-2">{r.subject_name}</td>
                                <td className="px-3 py-2">{r.grade}</td>
                                <td className="px-3 py-2">{r.points}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Applications Section */}
                  <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-3">All Applications</h3>
                    {selectedStudent.applications?.length === 0 ? (
                      <p className="text-gray-500">No applications.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedStudent.applications?.map((app: any) => (
                          <div key={app.id} className="border rounded p-3 flex justify-between items-center">
                            <div>
                              <p className="font-medium">{app.program_name}</p>
                              <p className="text-sm text-gray-500">{app.college_name} | Priority: {app.priority}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                              app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>{app.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-3 flex justify-end">
              <button onClick={() => setSelectedStudent(null)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}