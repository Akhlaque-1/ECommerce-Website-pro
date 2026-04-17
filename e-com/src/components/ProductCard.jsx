import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { getThumbnail, getMediumImage } from "../lib/cloudinary";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const rating = product?.rating ?? 4.5;
  const reviews = product?.reviews ?? 0;

  const primaryId = product?.images?.[0] || product?.image || null;
  const primaryImage = getMediumImage(primaryId);

  const galleryImages =
    product?.images?.length > 1
      ? product.images.slice(0, 3).map((id) => getThumbnail(id))
      : [];

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group h-full flex flex-col border border-gray-100">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 h-48 sm:h-56">
        <img
          src={primaryImage}
          alt={product?.name || "Product"}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {product?.discount && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{product.discount}%
          </div>
        )}
      </div>

      {galleryImages.length > 0 && (
        <div className="grid grid-cols-3 gap-1 p-3 bg-gray-50">
          {galleryImages.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`${product?.name || "Product"} ${idx + 1}`}
              loading="lazy"
              className="w-full h-16 object-cover rounded-md"
            />
          ))}
        </div>
      )}

      <div className="p-5 flex flex-col flex-grow">
        {product?.category && (
          <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-2">
            {product.category}
          </span>
        )}

        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product?.name || "No Name"}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={
                  i < Math.floor(rating)
                    ? "text-yellow-400 text-lg"
                    : "text-gray-300 text-lg"
                }
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">({reviews})</span>
        </div>

        {product?.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
            {product.description}
          </p>
        )}

        {product?.stock !== undefined && (
          <div className="mb-3">
            <span
              className={`text-xs font-semibold ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mt-auto pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              ${Number(product?.price || 0).toFixed(2)}
            </span>

            {product?.originalPrice > product?.price && (
              <span className="text-sm text-gray-400 line-through">
                ${Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product?.stock === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center font-semibold shadow-md hover:shadow-lg"
            title={product?.stock === 0 ? "Out of stock" : "Add to cart"}
          >
            🛒 Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
