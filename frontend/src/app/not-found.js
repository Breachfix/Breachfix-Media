export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-red-500">404</h1>
        <p className="text-lg">The page you’re looking for doesn't exist.</p>
        <a href="/browse" className="text-blue-400 underline">
          ← Go back to Browse
        </a>
      </div>
    </div>
  );
}