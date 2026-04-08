import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              1. Data We Collect
            </h2>
            <p>
              Task Manager collects only the information you provide directly:
              your name, email address, and the tasks and goals you create. All
              data is stored locally in your browser using localStorage. No data
              is transmitted to external servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              2. How We Use Your Data
            </h2>
            <p>
              Your data is used solely to provide the task management
              functionality of the application. We do not sell, share, or
              transmit your personal information to any third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              3. Cookies & Local Storage
            </h2>
            <p>
              We use browser localStorage to persist your tasks, goals, user
              preferences, and authentication state. No tracking cookies are
              used. You can clear all stored data at any time from the Settings
              page.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              4. Third-Party Services
            </h2>
            <p>
              The application loads Lottie animation files from LottieFiles
              (lottiefiles.com) for the mascot character. No personal data is
              shared with this service. Google Fonts are used for typography.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              5. Data Retention
            </h2>
            <p>
              All data is stored in your browser and persists until you
              explicitly clear it or delete your account. We have no access to
              your data and cannot recover it if lost.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              6. Contact
            </h2>
            <p>
              If you have questions about this privacy policy, please reach out
              to us at privacy@taskmanager.example.com.
            </p>
          </section>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
          >
            &larr; Back to Task Manager
          </Link>
        </div>
      </div>
    </div>
  );
}
