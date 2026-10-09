export default function EmptyState({ message = "No results found", subMessage = "Try adjusting your filters or search query" }) {
  return (
    <div className="text-center py-16 px-4 border border-dashed border-gray-300 rounded-xl bg-white">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 text-gray-400">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{message}</h3>
      <p className="text-gray-500">{subMessage}</p>
    </div>
  );
}
