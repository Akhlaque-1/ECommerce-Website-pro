import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setSelectedCategory, setSortBy, selectFilteredProducts } from "../features/products/productsSlice";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

function Home() {
  const dispatch = useDispatch();
  const { loading, error, selectedCategory, sortBy, items: allProducts } = useSelector((state) => state.products);
  const filteredItems = useSelector(selectFilteredProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Get unique categories - fixed to avoid hook call in conditional
  const categories = React.useMemo(() => {
    const cats = ["all"];
    if (allProducts.length > 0) {
      const uniqueCategories = [...new Set(allProducts.map((p) => p.category).filter(Boolean))];
      cats.push(...uniqueCategories);
    }
    return cats;
  }, [allProducts]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    dispatch(setSortBy(sort));
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Error Loading Products</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-3">Welcome to ShopHub</h1>
          <p className="text-blue-100 text-lg">Discover amazing products at unbeatable prices • Fast delivery • Secure checkout</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <span>📂</span> Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={() => handleCategoryChange(category)}
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition capitalize font-medium">
                        {category === "all" ? "All Products" : category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <span>📊</span> Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition font-medium"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {loading ? (
              <LoadingSpinner text="Loading products..." />
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-8 flex items-center justify-between">
                  <p className="text-gray-600 font-medium">
                    <span className="font-bold text-gray-900">{filteredItems.length}</span> products found • Showing 
                    <span className="font-bold text-gray-900 ml-1">{paginatedItems.length}</span> per page
                  </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {paginatedItems.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mb-8 flex-wrap">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition font-medium"
                    >
                      ← Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-2 rounded-lg font-medium transition ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white shadow-md"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition font-medium"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Home;