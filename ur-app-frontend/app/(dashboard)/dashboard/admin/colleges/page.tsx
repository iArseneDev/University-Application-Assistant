'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface University {
  id: string;
  name: string;
}

interface College {
  id: string;
  name: string;
  university_id: string;
  university_name?: string;
}

export default function AdminCollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCollege, setNewCollege] = useState({ name: '', university_id: '' });
  const [editing, setEditing] = useState<College | null>(null);

  const fetchData = async () => {
    try {
      const [collegesRes, unisRes] = await Promise.all([
        api.get('/colleges'),
        api.get('/universities'),
      ]);
      setColleges(collegesRes.data.data || []);
      setUniversities(unisRes.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addCollege = async () => {
    if (!newCollege.name.trim() || !newCollege.university_id) return;
    try {
      await api.post('/colleges', newCollege);
      setNewCollege({ name: '', university_id: '' });
      fetchData();
    } catch (error) {
      alert('Failed to add college');
    }
  };

  const updateCollege = async () => {
    if (!editing) return;
    try {
      await api.put(`/colleges/${editing.id}`, { name: editing.name });
      setEditing(null);
      fetchData();
    } catch (error) {
      alert('Failed to update college');
    }
  };

  const deleteCollege = async (id: string) => {
    if (!confirm('Delete this college? All programs under it will be affected.')) return;
    try {
      await api.delete(`/colleges/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete college');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Colleges</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Add New College</h2>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Input
            placeholder="College name"
            value={newCollege.name}
            onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
          />
          <select
            value={newCollege.university_id}
            onChange={(e) => setNewCollege({ ...newCollege, university_id: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="">Select University</option>
            {universities.map(uni => (
              <option key={uni.id} value={uni.id}>{uni.name}</option>
            ))}
          </select>
        </div>
        <Button onClick={addCollege}>Add College</Button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">University</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {colleges.map((col) => (
              <tr key={col.id} className="border-b">
                <td className="px-6 py-3">{col.name}</td>
                <td className="px-6 py-3">{col.university_name || col.university_id}</td>
                <td className="px-6 py-3 space-x-2">
                  <button
                    onClick={() => setEditing(col)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCollege(col.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl mb-4">Edit College</h2>
            <Input
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={updateCollege}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}