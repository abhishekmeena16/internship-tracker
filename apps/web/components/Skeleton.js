export function SkeletonCard() {
  return (
    <div className="card flex flex-col h-full bg-white animate-pulse">
      <div className="p-5 flex flex-col flex-1 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div className="h-11 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded-full w-14"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-6 bg-gray-100 rounded w-28"></div>
        <div className="space-y-1.5 pt-1">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-6 bg-gray-100 rounded w-3/4"></div>
        <div className="h-6 bg-gray-100 rounded w-4/5"></div>
      </div>
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 flex justify-between items-center mt-auto">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded-md w-28"></div>
      </div>
    </div>
  );
}

export default function SkeletonList({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch auto-rows-fr">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
