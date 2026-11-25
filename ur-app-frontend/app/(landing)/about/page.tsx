export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">About Application Gate</h1>
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        <p className="text-lg text-gray-700">
          Application Gate is a modern platform designed to simplify university applications for students and streamline admission management for administrators.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
        <p className="text-gray-700">
          To provide an accessible, transparent, and efficient application process that helps students find the right programs and institutions admit the best candidates.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800">Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Student profile management (personal, academic, guardian)</li>
          <li>Subject and result entry with automatic points calculation</li>
          <li>Program search and application submission (priority-based)</li>
          <li>Admin dashboards for universities, colleges, programs, and subjects</li>
          <li>Application review with accept/reject workflow</li>
          <li>Informative blog and resource center</li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-800">Who We Serve</h2>
        <p className="text-gray-700">
          High school graduates, university applicants, admission officers, and education administrators.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
          <p className="text-blue-800">
            <strong>Contact us:</strong> +250 724 757 773
          </p>
        </div>
      </div>
    </div>
  );
}