import { Link } from "react-router-dom";

const NewStoreMessage = () => {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
          <svg
            className="h-12 w-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h2 className="mb-3 text-2xl font-bold text-gray-900">
          Welcome to Your POS System! 🎉
        </h2>
        <p className="mb-8 text-lg text-gray-600">
          Let's set up your store to start selling. Follow these simple steps:
        </p>

        <div className="mb-8 grid gap-6 text-left md:grid-cols-2">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Create Categories
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Organize your products into categories like Electronics, Clothing,
              Food, etc.
            </p>
            <Link
              to="/categories"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Go to Categories
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Add Products
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Add your products with prices, stock quantities, and images.
            </p>
            <Link
              to="/products/new"
              className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
            >
              Go to Products
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">💡 Quick Tip:</span> You
            can also import products in bulk using CSV or Excel files from the{" "}
            <Link to="/products" className="text-blue-500 underline">
              Products page
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewStoreMessage;
