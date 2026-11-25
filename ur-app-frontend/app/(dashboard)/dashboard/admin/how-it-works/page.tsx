export default function AdminHowItWorksPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Guide: How to Manage the System</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl mb-2">🏛️</div>
          <h2 className="text-xl font-semibold mb-2">1. Universities & Colleges</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Add/Edit/Delete universities</li>
            <li>Add/Edit/Delete colleges (each belongs to a university)</li>
            <li>Programs are linked to colleges</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl mb-2">📚</div>
          <h2 className="text-xl font-semibold mb-2">2. Subjects</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Define subject names and codes (e.g., Mathematics, MATH101)</li>
            <li>Students select from these when entering results</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl mb-2">🎓</div>
          <h2 className="text-xl font-semibold mb-2">3. Programs</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Create programs with name, code, duration, description, and college</li>
            <li>Set minimum points and required combination (future)</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl mb-2">👥</div>
          <h2 className="text-xl font-semibold mb-2">4. Student Management</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>View all registered students with their profile details</li>
            <li>Click "View Details" to see full info, results, and applications</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl mb-2">📄</div>
          <h2 className="text-xl font-semibold mb-2">5. Application Review</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>List all applications with student names and program names</li>
            <li>Change status: Accept / Reject</li>
            <li>View detailed student dossier (profile + results + applications)</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl mb-2">📊</div>
          <h2 className="text-xl font-semibold mb-2">6. Dashboard Overview</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>See total students, total applications, counts by status (pending, accepted, rejected, draft)</li>
            <li>Quick actions from the dashboard</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <p className="text-blue-800 text-sm">
          <strong>Pro Tip:</strong> Always verify student results before accepting an application. You can use the "View Details" button to see their full academic record.
        </p>
      </div>
    </div>
  );
}