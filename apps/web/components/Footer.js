export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-left">
          <h3 className="text-white font-semibold text-lg mb-1">Internship Tracker</h3>
          <p className="text-sm">Connecting students with India's top tech opportunities.</p>
        </div>
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Internship Tracker. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
