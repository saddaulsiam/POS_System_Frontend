export const CategoriesSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 shadow"
        >
          <div className="text-center">
            <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-gray-200"></div>
            <div className="mx-auto h-4 w-20 rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProductsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white shadow"
        >
          <div className="flex h-20 md:h-28">
            <div className="h-full w-20 flex-shrink-0 bg-gray-200 md:w-28"></div>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-2.5 md:p-3.5">
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-3 w-1/2 rounded bg-gray-200"></div>
              <div className="h-3 w-1/3 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const POSPageSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mb-3 h-5 w-32 animate-pulse rounded bg-gray-200"></div>
      <CategoriesSkeleton />

      <div className="mt-6">
        <div className="mb-3 h-5 w-32 animate-pulse rounded bg-gray-200"></div>
        <ProductsSkeleton />
      </div>
    </div>
  );
};

export default POSPageSkeleton;
