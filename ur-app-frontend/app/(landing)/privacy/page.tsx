export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        <p className="text-gray-700">Last updated: May 2, 2026</p>
        <h2 className="text-2xl font-semibold text-gray-800">1. Information We Collect</h2>
        <p className="text-gray-700">
          We collect personal information you provide during registration and profile creation, including name, email, national ID, academic records, and guardian details.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800">2. How We Use Your Information</h2>
        <p className="text-gray-700">
          Your data is used solely for processing university applications, matching you with eligible programs, and communicating application status. We do not sell or share your data with third parties.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800">3. Data Security</h2>
        <p className="text-gray-700">
          We use industry-standard encryption (JWT, HTTPS) and D1 database with prepared statements to prevent injection attacks. Passwords are hashed using bcrypt.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800">4. Your Rights</h2>
        <p className="text-gray-700">
          You may update or delete your profile at any time. Contact our support team to request data export or account removal.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800">5. Cookies</h2>
        <p className="text-gray-700">
          We use a secure, HTTP-only session cookie to keep you signed in. We do not use tracking cookies.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
          <p className="text-yellow-800">
            <strong>Questions?</strong> Email our Data Protection Officer at privacy@ApplicationGate.com
          </p>
        </div>
      </div>
    </div>
  );
}
