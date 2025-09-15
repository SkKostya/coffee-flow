// src/store/slices/ordersSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ordersApi } from '../../orders/api/ordersApi';
import type {
  CreateOrderFromCartRequest,
  CreateOrderRequest,
  GetOrdersParams,
  Order,
  OrdersError,
  OrdersState,
  OrderStatus,
} from '../../types/orders';

// Начальное состояние
const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null,
  lastFetchTime: null,
};

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params?: GetOrdersParams, { rejectWithValue }) => {
    try {
      const orders = await ordersApi.getOrders(params);
      return orders;
    } catch (error) {
      return rejectWithValue({
        code: 'FETCH_ORDERS_ERROR',
        message:
          error instanceof Error ? error.message : 'Ошибка загрузки заказов',
        timestamp: Date.now(),
      } as OrdersError);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const order = await ordersApi.getOrderById(orderId);
      return order;
    } catch (error) {
      return rejectWithValue({
        code: 'FETCH_ORDER_ERROR',
        message:
          error instanceof Error ? error.message : 'Ошибка загрузки заказа',
        timestamp: Date.now(),
      } as OrdersError);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (data: CreateOrderRequest, { rejectWithValue }) => {
    try {
      const order = await ordersApi.createOrder(data);
      return order;
    } catch (error) {
      return rejectWithValue({
        code: 'CREATE_ORDER_ERROR',
        message:
          error instanceof Error ? error.message : 'Ошибка создания заказа',
        timestamp: Date.now(),
      } as OrdersError);
    }
  }
);

export const createOrderFromCart = createAsyncThunk(
  'orders/createOrderFromCart',
  async (data: CreateOrderFromCartRequest, { rejectWithValue }) => {
    try {
      const order = await ordersApi.createOrderFromCart(data);
      return order;
    } catch (error) {
      return rejectWithValue({
        code: 'CREATE_ORDER_FROM_CART_ERROR',
        message:
          error instanceof Error
            ? error.message
            : 'Ошибка создания заказа из корзины',
        timestamp: Date.now(),
      } as OrdersError);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async (
    { orderId, status }: { orderId: string; status: OrderStatus },
    { rejectWithValue }
  ) => {
    try {
      const updatedOrder = await ordersApi.updateOrderStatus(orderId, {
        status,
      });
      return { orderId, updatedOrder };
    } catch (error) {
      return rejectWithValue({
        code: 'UPDATE_ORDER_STATUS_ERROR',
        message:
          error instanceof Error
            ? error.message
            : 'Ошибка обновления статуса заказа',
        timestamp: Date.now(),
      } as OrdersError);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const cancelledOrder = await ordersApi.cancelOrder(orderId);
      return { orderId, updatedOrder: cancelledOrder };
    } catch (error) {
      return rejectWithValue({
        code: 'CANCEL_ORDER_ERROR',
        message:
          error instanceof Error ? error.message : 'Ошибка отмены заказа',
        timestamp: Date.now(),
      } as OrdersError);
    }
  }
);

export const repeatOrder = createAsyncThunk(
  'orders/repeatOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const newOrder = await ordersApi.repeatOrder(orderId);
      return newOrder;
    } catch (error) {
      return rejectWithValue({
        code: 'REPEAT_ORDER_ERROR',
        message:
          error instanceof Error ? error.message : 'Ошибка повторения заказа',
        timestamp: Date.now(),
      } as OrdersError);
    }
  }
);

// Слайс
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.error = null;
      state.lastFetchTime = null;
    },
    updateOrderInList: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(
        (order) => order.id === action.payload.id
      );
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.lastFetchTime = Date.now();
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as OrdersError;
      });

    // Fetch order by ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as OrdersError;
      });

    // Create order
    builder
      .addCase(createOrder.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isCreating = false;
        state.orders.unshift(action.payload); // Добавляем в начало списка
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as OrdersError;
      });

    // Create order from cart
    builder
      .addCase(createOrderFromCart.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createOrderFromCart.fulfilled, (state, action) => {
        state.isCreating = false;
        state.orders.unshift(action.payload);
        state.error = null;
      })
      .addCase(createOrderFromCart.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as OrdersError;
      });

    // Update order status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        const { orderId, updatedOrder } = action.payload;
        const index = state.orders.findIndex((order) => order.id === orderId);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        if (state.currentOrder?.id === orderId) {
          state.currentOrder = updatedOrder;
        }
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as OrdersError;
      });

    // Cancel order
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isUpdating = false;
        const { orderId, updatedOrder } = action.payload;
        const index = state.orders.findIndex((order) => order.id === orderId);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        if (state.currentOrder?.id === orderId) {
          state.currentOrder = updatedOrder;
        }
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as OrdersError;
      });

    // Repeat order
    builder
      .addCase(repeatOrder.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(repeatOrder.fulfilled, (state, action) => {
        state.isCreating = false;
        state.orders.unshift(action.payload);
        state.error = null;
      })
      .addCase(repeatOrder.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as OrdersError;
      });
  },
});

export const { clearError, setCurrentOrder, clearOrders, updateOrderInList } =
  ordersSlice.actions;

export default ordersSlice.reducer;
