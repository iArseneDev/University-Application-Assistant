'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Subject {
  id: string;
  name: string;
  code: string;
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSubject, setNewSubject] = useState({ name: '', code: '' });
  const [editing, setEditing] = useState<Subject | null>(null);

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      setSubjects(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error(error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const addSubject = async () => {
    if (!newSubject.name.trim() || !newSubject.code.trim()) return alert('Name and code required');
    try {
      await api.post('/subjects', newSubject);
      setNewSubject({ name: '', code: '' });
      fetchSubjects();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add subject');
    }
  };

  const updateSubject = async () => {
    if (!editing) return;
    try {
      await api.put(`/subjects/${editing.id}`, { name: editing.name, code: editing.code });
      setEditing(null);
      fetchSubjects();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update subject');
    }
  };

  const deleteSubject = async (id: string) => {
    if (!confirm('Delete this subject?')) return;
    try {
      await api.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete subject');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Subjects</h1>
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Add New Subject</h2>
        <div className="grid md:grid-cols-3 gap-2 mb-3">
          <Input placeholder="Subject Name" value={newSubject.name} onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })} />
          <Input placeholder="Subject Code" value={newSubject.code} onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })} />
          <Button onClick={addSubject}>Add Subject</Button>
        </div>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr><th className="px-6 py-3 text-left">Name</th><th className="px-6 py-3 text-left">Code</th><th className="px-6 py-3 text-left">Actions</th></tr>
          </thead>
          <tbody>
            {subjects.map((sub) => (
              <tr key={sub.id} className="border-b">
                <td className="px-6 py-3">{sub.name}</td>
                <td className="px-6 py-3">{sub.code}</td>
                <td className="px-6 py-3 space-x-2">
                  <button onClick={() => setEditing(sub)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => deleteSubject(sub.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl mb-4">Edit Subject</h2>
            <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Name" className="mb-2" />
            <Input value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} placeholder="Code" className="mb-4" />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={updateSubject}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}