export function SkeletonCard() {
  return (
    <div className="card flex flex-col h-full bg-white animate-pulse">
      <div className="p-5 flex-grow space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-2 mt-4">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="flex gap-2 mt-4">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
      <div className="border-t border-gray-100 bg-gray-50 p-4 flex justify-between items-center">
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
}

export default function SkeletonList({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
