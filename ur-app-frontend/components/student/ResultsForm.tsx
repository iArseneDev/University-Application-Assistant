'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ResultsTable from './ResultsTable';

interface Subject {
  id: string;
  name: string;
  code: string;
}

export default function ResultsForm() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/subjects');
        setSubjects(res.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubmit = async () => {
    if (!selectedSubject) {
      alert('Please select a subject');
      return;
    }
    if (!grade.trim()) {
      alert('Please enter grade');
      return;
    }
    if (points <= 0) {
      alert('Points must be greater than 0');
      return;
    }
    setLoading(true);
    try {
      await api.post('/results', {
        subject_id: selectedSubject,
        grade: grade.toUpperCase(),
        points,
      });
      alert('Result saved');
      setSelectedSubject('');
      setGrade('');
      setPoints(0);
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save result');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-4">Loading subjects...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl mb-4">Add / Update Result</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name} ({sub.code})
              </option>
            ))}
          </select>
          <Input
            placeholder="Grade (A, B, C...)"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Points"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value))}
          />
          <Button onClick={handleSubmit} isLoading={loading}>
            Save Result
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl mb-4">My Results</h2>
        <ResultsTable key={refreshKey} />
      </div>
    </div>
  );
}