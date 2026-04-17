import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

// ==============================
// FETCH PRODUCTS
// ==============================
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "products"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      return snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
        images: docSnap.data().images || [],
      }));
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch products");
    }
  }
);

// ==============================
// ADD PRODUCT
// ==============================
export const addProduct = createAsyncThunk(
  "products/add",
  async (product, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "products"), {
        ...product,
        images: product.images || [],
        createdAt: Date.now(), // ✅ FIXED (consistent format)
      });

      return {
        id: docRef.id,
        ...product,
        images: product.images || [],
        createdAt: Date.now(),
      };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to add product");
    }
  }
);

// ==============================
// UPDATE PRODUCT
// ==============================
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined && v !== null)
      );

      await updateDoc(doc(db, "products", id), {
        ...cleanData,
        updatedAt: Date.now(), // ✅ FIXED
      });

      return { id, ...cleanData };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to update product");
    }
  }
);

// ==============================
// DELETE PRODUCT
// ==============================
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "products", id));
      return id;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to delete product");
    }
  }
);

// ==============================
// INITIAL STATE
// ==============================
const initialState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: "",
  selectedCategory: "all",
  sortBy: "newest",
};

// ==============================
// SLICE
// ==============================
const productsSlice = createSlice({
  name: "products",
  initialState,

  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null; // ✅ FIXED
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // UPDATE
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (p) => p.id === action.payload.id
        );

        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload,
          };
        }
      })

      // DELETE
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

// ==============================
// SAFE SELECTOR HELPERS
// ==============================
const getTime = (t) =>
  typeof t === "number"
    ? t
    : t?.toMillis?.()
    ? t.toMillis()
    : 0;

// ==============================
// SELECTOR
// ==============================
export const selectFilteredProducts = createSelector(
  [
    (state) => state.products.items,
    (state) => state.products.searchQuery,
    (state) => state.products.selectedCategory,
    (state) => state.products.sortBy,
  ],
  (items, searchQuery, selectedCategory, sortBy) => {
    let filtered = [...items];

    // SEARCH
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    // CATEGORY
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // SORT
    if (sortBy === "price-low") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => getTime(b.createdAt) - getTime(a.createdAt));
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return filtered;
  }
);

// ==============================
// EXPORTS
// ==============================
export const {
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
} = productsSlice.actions;

export default productsSlice.reducer;