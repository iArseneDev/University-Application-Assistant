// components/student/ApplicationForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

interface Program {
  id: string;
  name: string;
  college_id: string;
  college_name?: string;
  university_name?: string;
}

interface ApplicationChoice {
  program_id: string;
  priority: number;
}

// No need to display previous applications inside the form – parent does that
interface ApplicationFormProps {
  onSubmitSuccess?: () => void;
}

export default function ApplicationForm({ onSubmitSuccess }: ApplicationFormProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [choices, setChoices] = useState<ApplicationChoice[]>([{ program_id: '', priority: 1 }]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await api.get('/programs');
        setPrograms(res.data.data || []);
      } catch (error) {
        console.error(error);
        setPrograms([]);
      } finally {
        setFetching(false);
      }
    };
    fetchPrograms();
  }, []);

  const addChoice = () => {
    if (choices.length >= 3) {
      alert('You can only select up to 3 programs per payment.');
      return;
    }
    setChoices([...choices, { program_id: '', priority: choices.length + 1 }]);
  };

  const updateChoice = (idx: number, field: keyof ApplicationChoice, value: string | number) => {
    const updated = [...choices];
    if (field === 'priority') {
      updated[idx][field] = value as number;
    } else {
      updated[idx][field] = value as string;
    }
    // Re‑assign priorities sequentially
    updated.forEach((ch, i) => { ch.priority = i + 1; });
    setChoices(updated);
  };

  const submitBatch = async () => {
    const validChoices = choices.filter(c => c.program_id.trim() !== '');
    if (validChoices.length === 0) {
      alert('Please select at least one program.');
      return;
    }
    const programIds = validChoices.map(c => c.program_id);
    if (new Set(programIds).size !== programIds.length) {
      alert('Cannot select the same program twice.');
      return;
    }
    if (validChoices.some(c => c.priority < 1 || c.priority > 3)) {
      alert('Priorities must be between 1 and 3.');
      return;
    }

    setLoading(true);
    try {
      const payload = { programs: validChoices };
      await api.post('/applications', payload);
      alert('Application batch submitted successfully!');
      setChoices([{ program_id: '', priority: 1 }]); // reset form
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Submission failed. Make sure you have an approved payment.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center p-4">Loading programs...</div>;

  return (
    <div className="bg-white p-4 md:p-6 rounded shadow">
      <h2 className="text-xl mb-4">Select Programs (Up to 3)</h2>
      {choices.map((choice, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
          <select
            value={choice.program_id}
            onChange={(e) => updateChoice(idx, 'program_id', e.target.value)}
            className="flex-1 w-full p-2 border rounded"
          >
            <option value="">Select Program</option>
            {programs.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} {p.college_name ? `(${p.college_name})` : ''}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Priority"
            value={choice.priority}
            onChange={(e) => updateChoice(idx, 'priority', parseInt(e.target.value))}
            className="w-full sm:w-24 p-2 border rounded"
            readOnly
          />
        </div>
      ))}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="button" variant="secondary" onClick={addChoice} className="w-full sm:w-auto" disabled={choices.length >= 3}>
          + Add Choice (max 3)
        </Button>
        <Button type="button" onClick={submitBatch} isLoading={loading} className="w-full sm:w-auto">
          Submit Application Batch
        </Button>
      </div>
    </div>
  );
}