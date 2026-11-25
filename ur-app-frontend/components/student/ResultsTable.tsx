'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Result {
  id: string;
  subject_id: string;
  subject_name: string;
  code: string;
  grade: string;
  points: number;
}

export default function ResultsTable() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      const res = await api.get('/results');
      setResults(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) return <div className="text-center p-4">Loading results...</div>;

  if (results.length === 0) {
    return <p className="text-gray-500 text-center py-4">No results added yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Subject</th>
            <th className="px-4 py-2 text-left">Code</th>
            <th className="px-4 py-2 text-left">Grade</th>
            <th className="px-4 py-2 text-left">Points</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id} className="border-b">
              <td className="px-4 py-2">{result.subject_name}</td>
              <td className="px-4 py-2">{result.code}</td>
              <td className="px-4 py-2">{result.grade}</td>
              <td className="px-4 py-2">{result.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}