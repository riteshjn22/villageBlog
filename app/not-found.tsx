import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex w-full h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-6xl font-bold text-slate-950">404</h1>
        <p className="text-2xl font-semibold text-slate-700">Not Found</p>
        <p className="text-slate-500 mb-6">
          The Page does not exist in our database.
        </p>
        <Link
          href="/"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
