'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface College {
  id: string;
  name: string;
  university_name?: string;
}

interface Program {
  id: string;
  name: string;
  code: string;
  duration_years: number;
  description?: string;
  college_id: string;
  college_name?: string;
}

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProgram, setNewProgram] = useState({
    name: '',
    code: '',
    description: '',
    duration_years: 3,
    college_id: '',
  });
  const [editing, setEditing] = useState<Program | null>(null);

  const fetchData = async () => {
    try {
      const [progRes, colRes] = await Promise.all([
        api.get('/programs'),
        api.get('/colleges'),
      ]);
      setPrograms(Array.isArray(progRes.data?.data) ? progRes.data.data : []);
      setColleges(Array.isArray(colRes.data?.data) ? colRes.data.data : []);
    } catch (error) {
      console.error(error);
      setPrograms([]);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (colleges.length > 0 && !newProgram.college_id) {
      setNewProgram(prev => ({ ...prev, college_id: colleges[0].id }));
    }
  }, [colleges]);

  const addProgram = async () => {
    if (!newProgram.name.trim()) return alert('Program name required');
    if (!newProgram.college_id) return alert('Please select a college');
    try {
      await api.post('/programs', newProgram);
      setNewProgram({
        name: '',
        code: '',
        description: '',
        duration_years: 3,
        college_id: colleges[0]?.id || '',
      });
      fetchData();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to add program');
    }
  };

  const updateProgram = async () => {
    if (!editing) return;
    try {
      await api.put(`/programs/${editing.id}`, editing);
      setEditing(null);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update program');
    }
  };

  const deleteProgram = async (id: string) => {
    if (!confirm('Delete this program?')) return;
    try {
      await api.delete(`/programs/${id}`);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete program');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  if (colleges.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">No colleges found.</p>
        <a href="/dashboard/admin/colleges" className="text-blue-600 hover:underline">Add a college first</a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Programs</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Add New Program</h2>
        <div className="grid md:grid-cols-5 gap-2 mb-3">
          <Input
            placeholder="Program name"
            value={newProgram.name}
            onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
          />
          <Input
            placeholder="Code"
            value={newProgram.code}
            onChange={(e) => setNewProgram({ ...newProgram, code: e.target.value })}
          />
          <Input
            placeholder="Description (optional)"
            value={newProgram.description}
            onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Duration (years)"
            value={newProgram.duration_years}
            onChange={(e) => setNewProgram({ ...newProgram, duration_years: parseInt(e.target.value) })}
          />
          <select
            value={newProgram.college_id}
            onChange={(e) => setNewProgram({ ...newProgram, college_id: e.target.value })}
            className="border rounded px-3 py-2"
          >
            {colleges.map(col => (
              <option key={col.id} value={col.id}>{col.name}</option>
            ))}
          </select>
        </div>
        <Button onClick={addProgram}>Add Program</Button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Code</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Duration</th>
              <th className="px-6 py-3 text-left">College</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">No programs found.</td>
              </tr>
            ) : (
              programs.map((prog) => (
                <tr key={prog.id} className="border-b">
                  <td className="px-6 py-3">{prog.name}</td>
                  <td className="px-6 py-3">{prog.code}</td>
                  <td className="px-6 py-3 max-w-xs truncate">{prog.description || '-'}</td>
                  <td className="px-6 py-3">{prog.duration_years}</td>
                  <td className="px-6 py-3">{prog.college_name || prog.college_id}</td>
                  <td className="px-6 py-3 space-x-2">
                    <button onClick={() => setEditing(prog)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => deleteProgram(prog.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-[500px]">
            <h2 className="text-xl mb-4">Edit Program</h2>
            <div className="space-y-3">
              <Input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="Name"
              />
              <Input
                value={editing.code}
                onChange={(e) => setEditing({ ...editing, code: e.target.value })}
                placeholder="Code"
              />
              <Input
                value={editing.description || ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                placeholder="Description"
              />
              <Input
                type="number"
                value={editing.duration_years}
                onChange={(e) => setEditing({ ...editing, duration_years: parseInt(e.target.value) })}
                placeholder="Duration (years)"
              />
              <select
                value={editing.college_id}
                onChange={(e) => setEditing({ ...editing, college_id: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                {colleges.map(col => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={updateProgram}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}