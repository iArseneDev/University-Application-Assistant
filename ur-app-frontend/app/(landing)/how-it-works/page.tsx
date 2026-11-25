export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">How It Works – For Students</h1>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Step 1 */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">1</div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Create an Account</h2>
            <p className="text-gray-600">Sign up with your email and a secure password. Your browser receives a protected sign-in session.</p>
          </div>
        </div>
        {/* Step 2 */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">2</div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Complete Your Profile</h2>
            <p className="text-gray-600">
              Fill in your personal details (name, gender, date of birth, nationality, national ID, contact),
              address (province, district, sector, cell, village), academic background (school, combination, year, index number, total points),
              and guardian information. You can also indicate any disability.
            </p>
          </div>
        </div>
        {/* Step 3 */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">3</div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Enter Your Results</h2>
            <p className="text-gray-600">
              Add your subjects with grades and points (e.g., Mathematics - A - 6 points). The system validates against available subjects.
              These results are self-reported and are not checked against official examination records.
            </p>
          </div>
        </div>
        {/* Step 4 */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">4</div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Apply to Programs</h2>
            <p className="text-gray-600">
              Browse programs by college/university. After your payment receipt is approved, select up to three choices and submit them with priorities (1 = most preferred).
              Submitted applications are sent for admin review.
            </p>
          </div>
        </div>
        {/* Step 5 */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">5</div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Track & Update</h2>
            <p className="text-gray-600">
              Monitor your application status (DRAFT, SUBMITTED, ACCEPTED, REJECTED). You can update your profile and results even after submitting,
              but the admin will see the latest version before making a decision.
            </p>
          </div>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
          <p className="text-yellow-800 text-sm">
            <strong>Tip:</strong> Ensure all information is accurate before final submission. Inaccuracies may lead to disqualification.
          </p>
        </div>
      </div>
    </div>
  );
}
