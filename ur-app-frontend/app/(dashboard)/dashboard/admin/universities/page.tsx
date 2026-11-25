'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface University {
  id: string;
  name: string;
}

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState<University | null>(null);

  const fetchUniversities = async () => {
    try {
      const res = await api.get('/universities');
      setUniversities(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const addUniversity = async () => {
    if (!newName.trim()) return;
    try {
      await api.post('/universities', { name: newName });
      setNewName('');
      fetchUniversities();
    } catch (error) {
      alert('Failed to add university');
    }
  };

  const updateUniversity = async () => {
    if (!editing) return;
    try {
      await api.put(`/universities/${editing.id}`, { name: editing.name });
      setEditing(null);
      fetchUniversities();
    } catch (error) {
      alert('Failed to update university');
    }
  };

  const deleteUniversity = async (id: string) => {
    if (!confirm('Delete this university? All colleges under it will be affected.')) return;
    try {
      await api.delete(`/universities/${id}`);
      fetchUniversities();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Universities</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Add New University</h2>
        <div className="flex gap-2">
          <Input
            placeholder="University name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addUniversity}>Add</Button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {universities.map((uni) => (
              <tr key={uni.id} className="border-b">
                <td className="px-6 py-3">{uni.name}</td>
                <td className="px-6 py-3 space-x-2">
                  <button
                    onClick={() => setEditing(uni)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUniversity(uni.id)}
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

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl mb-4">Edit University</h2>
            <Input
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={updateUniversity}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}