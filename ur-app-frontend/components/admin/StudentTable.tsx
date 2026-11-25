// components/admin/StudentTable.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Student {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  other_names?: string;
  gender: string;
  date_of_birth: string;
  nationality: string;
  national_id: string;
  phone_number: string;
  alternative_phone?: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  school_name: string;
  school_type: string;
  combination: string;
  year_of_completion: number;
  index_number: string;
  total_points: number;
  division?: string;
  application_year: number;
  entry_mode: string;
  sponsorship_type: string;
  disability_status: number;
  disability_details?: string;
  guardian_name: string;
  guardian_relationship: string;
  guardian_phone: string;
  guardian_email?: string;
  status: string;
  email?: string;
}

export default function StudentTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/students');
        setStudents(res.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <div className="text-center p-8">Loading students...</div>;

  return (
    <>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Full Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">National ID</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-4">No students found</td></tr>
            ) : (
              students.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="px-6 py-3">{s.first_name} {s.last_name} {s.other_names ? `(${s.other_names})` : ''}</td>
                  <td className="px-6 py-3">{s.email || '-'}</td>
                  <td className="px-6 py-3">{s.national_id}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      s.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                      s.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      s.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>{s.status}</span>
                  </td>
                  <td className="px-6 py-3">
                    <button onClick={() => setSelectedStudent(s)} className="text-blue-600 hover:underline">View Details</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Student Details</h2>
              <button onClick={() => setSelectedStudent(null)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg border-b pb-1">Personal Information</h3>
                  <p><span className="font-medium">Full Name:</span> {selectedStudent.first_name} {selectedStudent.last_name} {selectedStudent.other_names ? `(${selectedStudent.other_names})` : ''}</p>
                  <p><span className="font-medium">Gender:</span> {selectedStudent.gender}</p>
                  <p><span className="font-medium">Date of Birth:</span> {new Date(selectedStudent.date_of_birth).toLocaleDateString()}</p>
                  <p><span className="font-medium">Nationality:</span> {selectedStudent.nationality}</p>
                  <p><span className="font-medium">National ID:</span> {selectedStudent.national_id}</p>
                  <p><span className="font-medium">Email:</span> {selectedStudent.email || 'Not linked'}</p>
                  <p><span className="font-medium">Phone:</span> {selectedStudent.phone_number}</p>
                  <p><span className="font-medium">Alternative Phone:</span> {selectedStudent.alternative_phone || '-'}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg border-b pb-1">Address</h3>
                  <p><span className="font-medium">Province:</span> {selectedStudent.province}</p>
                  <p><span className="font-medium">District:</span> {selectedStudent.district}</p>
                  <p><span className="font-medium">Sector:</span> {selectedStudent.sector}</p>
                  <p><span className="font-medium">Cell:</span> {selectedStudent.cell}</p>
                  <p><span className="font-medium">Village:</span> {selectedStudent.village}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg border-b pb-1">Academic Background</h3>
                  <p><span className="font-medium">School:</span> {selectedStudent.school_name}</p>
                  <p><span className="font-medium">School Type:</span> {selectedStudent.school_type}</p>
                  <p><span className="font-medium">Combination:</span> {selectedStudent.combination}</p>
                  <p><span className="font-medium">Year Completed:</span> {selectedStudent.year_of_completion}</p>
                  <p><span className="font-medium">Index Number:</span> {selectedStudent.index_number}</p>
                  <p><span className="font-medium">Total Points:</span> {selectedStudent.total_points}</p>
                  <p><span className="font-medium">Division:</span> {selectedStudent.division || '-'}</p>
                  <p><span className="font-medium">Application Year:</span> {selectedStudent.application_year}</p>
                  <p><span className="font-medium">Entry Mode:</span> {selectedStudent.entry_mode}</p>
                  <p><span className="font-medium">Sponsorship:</span> {selectedStudent.sponsorship_type}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg border-b pb-1">Disability</h3>
                  <p><span className="font-medium">Status:</span> {selectedStudent.disability_status ? 'Yes' : 'No'}</p>
                  {selectedStudent.disability_details && <p><span className="font-medium">Details:</span> {selectedStudent.disability_details}</p>}
                  <h3 className="font-semibold text-lg border-b pb-1 mt-4">Guardian Info</h3>
                  <p><span className="font-medium">Name:</span> {selectedStudent.guardian_name}</p>
                  <p><span className="font-medium">Relationship:</span> {selectedStudent.guardian_relationship}</p>
                  <p><span className="font-medium">Phone:</span> {selectedStudent.guardian_phone}</p>
                  <p><span className="font-medium">Email:</span> {selectedStudent.guardian_email || '-'}</p>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-3 flex justify-end">
              <button onClick={() => setSelectedStudent(null)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}