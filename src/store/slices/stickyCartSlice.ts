import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StickyCartState {
  isVisible: boolean;
  selectedProducts: string[]; // ID выбранных продуктов
  productQuantities: Record<string, number>; // Количество каждого продукта
  productPrices: Record<string, number>; // Цены продуктов
  totalAmount: number;
  totalItems: number;
}

const initialState: StickyCartState = {
  isVisible: false,
  selectedProducts: [],
  productQuantities: {},
  productPrices: {},
  totalAmount: 0,
  totalItems: 0,
};

// Функция для пересчета общей суммы
const calculateTotalAmount = (
  quantities: Record<string, number>,
  prices: Record<string, number>
) => {
  return Object.entries(quantities).reduce((total, [productId, quantity]) => {
    const price = prices[productId] || 0;
    return total + price * quantity;
  }, 0);
};

const stickyCartSlice = createSlice({
  name: 'stickyCart',
  initialState,
  reducers: {
    showStickyCart: (state) => {
      state.isVisible = true;
    },
    hideStickyCart: (state) => {
      state.isVisible = false;
    },
    toggleStickyCart: (state) => {
      state.isVisible = !state.isVisible;
    },
    addProductToSticky: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      if (!state.selectedProducts.includes(productId)) {
        state.selectedProducts.push(productId);
        state.totalItems += 1;
      }
    },
    removeProductFromSticky: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const index = state.selectedProducts.indexOf(productId);
      if (index > -1) {
        state.selectedProducts.splice(index, 1);
        state.totalItems = Math.max(0, state.totalItems - 1);
      }
    },
    toggleProductInSticky: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const index = state.selectedProducts.indexOf(productId);
      if (index > -1) {
        state.selectedProducts.splice(index, 1);
        state.totalItems = Math.max(0, state.totalItems - 1);
      } else {
        state.selectedProducts.push(productId);
        state.totalItems += 1;
      }
    },
    updateStickyCartTotal: (state, action: PayloadAction<number>) => {
      state.totalAmount = action.payload;
    },
    clearStickyCart: (state) => {
      state.selectedProducts = [];
      state.productQuantities = {};
      state.productPrices = {};
      state.totalAmount = 0;
      state.totalItems = 0;
      state.isVisible = false;
    },
    setStickyCartVisibility: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
    setProductQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        quantity: number;
        price?: number;
      }>
    ) => {
      const { productId, quantity, price } = action.payload;

      if (quantity <= 0) {
        // Удаляем продукт из корзины
        delete state.productQuantities[productId];
        delete state.productPrices[productId];
        state.selectedProducts = state.selectedProducts.filter(
          (id) => id !== productId
        );
      } else {
        // Обновляем количество
        state.productQuantities[productId] = quantity;
        if (price !== undefined) {
          state.productPrices[productId] = price;
        }
        if (!state.selectedProducts.includes(productId)) {
          state.selectedProducts.push(productId);
        }
      }

      // Пересчитываем общее количество и сумму
      state.totalItems = Object.values(state.productQuantities).reduce(
        (sum, qty) => sum + qty,
        0
      );
      state.totalAmount = calculateTotalAmount(
        state.productQuantities,
        state.productPrices
      );
    },
    incrementProductQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const currentQuantity = state.productQuantities[productId] || 0;
      state.productQuantities[productId] = currentQuantity + 1;

      if (!state.selectedProducts.includes(productId)) {
        state.selectedProducts.push(productId);
      }

      // Пересчитываем общее количество и сумму
      state.totalItems = Object.values(state.productQuantities).reduce(
        (sum, qty) => sum + qty,
        0
      );
      state.totalAmount = calculateTotalAmount(
        state.productQuantities,
        state.productPrices
      );
    },
    decrementProductQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const currentQuantity = state.productQuantities[productId] || 0;

      if (currentQuantity <= 1) {
        // Удаляем продукт из корзины
        delete state.productQuantities[productId];
        delete state.productPrices[productId];
        state.selectedProducts = state.selectedProducts.filter(
          (id) => id !== productId
        );
      } else {
        state.productQuantities[productId] = currentQuantity - 1;
      }

      // Пересчитываем общее количество и сумму
      state.totalItems = Object.values(state.productQuantities).reduce(
        (sum, qty) => sum + qty,
        0
      );
      state.totalAmount = calculateTotalAmount(
        state.productQuantities,
        state.productPrices
      );
    },
  },
});

export const {
  showStickyCart,
  hideStickyCart,
  toggleStickyCart,
  addProductToSticky,
  removeProductFromSticky,
  toggleProductInSticky,
  updateStickyCartTotal,
  clearStickyCart,
  setStickyCartVisibility,
  setProductQuantity,
  incrementProductQuantity,
  decrementProductQuantity,
} = stickyCartSlice.actions;

export default stickyCartSlice.reducer;
