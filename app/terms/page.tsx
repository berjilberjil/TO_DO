import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Terms of Service
        </h1>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              1. Use of Service
            </h2>
            <p>
              Task Manager is a web-based task management tool provided as-is
              for personal productivity. By using the service, you agree to
              these terms. The service is free to use with optional paid
              features.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              2. User Accounts
            </h2>
            <p>
              Account credentials are stored locally in your browser. You are
              responsible for maintaining the security of your device and
              browser data. We do not store passwords on any server.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              3. Prohibited Use
            </h2>
            <p>
              You may not use the service for any unlawful purpose, attempt to
              reverse engineer the application, or use automated systems to
              access the service in a manner that could damage or overload it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              4. Limitation of Liability
            </h2>
            <p>
              Task Manager is provided &quot;as is&quot; without warranty of any
              kind. We are not liable for any data loss, as all data is stored
              locally in your browser. We recommend exporting important data
              regularly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              5. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Continued
              use of the service after changes constitutes acceptance of the
              updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              6. Contact
            </h2>
            <p>
              For questions about these terms, please contact us at
              legal@taskmanager.example.com.
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
