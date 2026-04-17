import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Async Thunks
export const saveCart = createAsyncThunk(
  "cart/save",
  async ({ userId, items }, { rejectWithValue }) => {
    try {
      await setDoc(doc(db, "carts", userId), { items, updatedAt: new Date() });
      return items;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadCart = createAsyncThunk(
  "cart/load",
  async (userId, { rejectWithValue }) => {
    try {
      const snap = await getDoc(doc(db, "carts", userId));
      return snap.exists() ? snap.data().items : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  taxAmount: 0,
  shippingCost: 10,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      cartSlice.caseReducers.calculateTotal(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotal(state);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      cartSlice.caseReducers.calculateTotal(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.taxAmount = 0;
    },

    calculateTotal: (state) => {
      const subtotal = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      state.taxAmount = Math.round(subtotal * 0.1 * 100) / 100;
      state.total =
        subtotal + state.taxAmount + state.shippingCost;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        cartSlice.caseReducers.calculateTotal(state);
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveCart.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(saveCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, calculateTotal } =
  cartSlice.actions;
export default cartSlice.reducer;