import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <p className="text-6xl font-mono font-bold text-[#13204c]/20 mb-4">404</p>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Page not found</h1>
      <p className="text-sm text-gray-500 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/alerts"
        className="px-5 py-2.5 bg-[#0d7a6b] text-white text-sm font-semibold rounded-md hover:bg-[#0a6459] transition-colors"
      >
        Back to Alert Dashboard
      </Link>
    </div>
  );
}
