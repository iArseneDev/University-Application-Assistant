// components/admin/ProgramTable.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function ProgramTable() {
  const [programs, setPrograms] = useState<any[]>([]); // ✅ initialized as empty array
  const [newProgram, setNewProgram] = useState({ name: '', code: '', duration_years: 3, college_id: '' });
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/programs');
      setPrograms(res.data.data || []);
    } catch (error) {
      console.error(error);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const addProgram = async () => {
    try {
      await api.post('/programs', newProgram);
      setNewProgram({ name: '', code: '', duration_years: 3, college_id: '' });
      fetchPrograms();
    } catch (error) {
      console.error(error);
      alert('Failed to add program');
    }
  };

  const updateProgram = async () => {
    try {
      await api.put(`/programs/${editing.id}`, editing);
      setEditing(null);
      fetchPrograms();
    } catch (error) {
      console.error(error);
      alert('Failed to update program');
    }
  };

  if (loading) return <div className="text-center p-8">Loading programs...</div>;

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl mb-3">Add New Program</h2>
      <div className="grid grid-cols-4 gap-2 mb-6">
        <input
          placeholder="Name"
          value={newProgram.name}
          onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Code"
          value={newProgram.code}
          onChange={(e) => setNewProgram({ ...newProgram, code: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Duration (years)"
          type="number"
          value={newProgram.duration_years}
          onChange={(e) => setNewProgram({ ...newProgram, duration_years: parseInt(e.target.value) })}
          className="border p-2 rounded"
        />
        <button onClick={addProgram} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add
        </button>
      </div>

      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Code</th>
            <th className="px-4 py-2 text-left">Duration</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {programs.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">No programs found</td>
            </tr>
          ) : (
            programs.map((p: any) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.code}</td>
                <td className="p-2">{p.duration_years}</td>
                <td className="p-2">
                  <button onClick={() => setEditing(p)} className="text-blue-600 hover:underline">
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Program</h3>
            <input
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
              placeholder="Name"
            />
            <input
              value={editing.code}
              onChange={(e) => setEditing({ ...editing, code: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
              placeholder="Code"
            />
            <input
              type="number"
              value={editing.duration_years}
              onChange={(e) => setEditing({ ...editing, duration_years: parseInt(e.target.value) })}
              className="border p-2 w-full mb-4 rounded"
              placeholder="Duration (years)"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={updateProgram} className="bg-blue-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}