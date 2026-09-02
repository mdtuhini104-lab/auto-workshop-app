import React from "react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 text-red-500 bg-red-50 dark:bg-red-900/20 p-6 rounded-full inline-block">
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Access Denied</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        You don't have permission to access this page. Please contact your system administrator if you believe this is an error.
      </p>
      <Link prefetch={false} href="/"
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
