import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedOption {
  value: string;
  price: number;
  label?: string;
  modifier_name?: string;
  modifier_price?: number;
}

export interface Option {
  name: string;
  price: number;
  modifier_name: string;
  modifier_price: number;
  label?: string;
  value?: string;
}
interface MenuItem {
  _id: string;
  id?: string;
  name: string;
  price: number;
  options?: SelectedOption[];
  menu_item_image: string;
  description: string;
  business_name: string;
  menu_category_name: string;
  menu_group_name: string;
  menu_item_name: string;
  menu_item_price: number;
}

interface CustomerDetailsUpdate {
  name?: string;
  phone?: string;
  streetAddress?: string;
  town?: string;
}

export interface BasketItem {
  id: string;
  quantity: number;
  menuItem?: MenuItem;
  selectedOptions: Option[];
  totalPrice: number;
  name: string;
  tableNumber: string | number;
}

interface BasketState {
  items: BasketItem[];
  totalPrice: number;
  customerName: string;
  customerPhone: string;
  cutomerStreetAddress: string;
  cutomerTown: string;
  customerTableNumber: string;
  totalQuantity: number;
  tip: number | null;
  deliveryFee: number | null;
}

const initialState: BasketState = {
  items: [],
  customerPhone: "",
  totalPrice: 0,
  customerName: "",
  cutomerStreetAddress: "",
  cutomerTown: "",
  customerTableNumber: "",
  totalQuantity: 0,
  tip: null,
  deliveryFee: null,
};

const BasketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addItemToBasket(state, action: PayloadAction<BasketItem>) {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === newItem.id &&
          JSON.stringify(item.selectedOptions) ===
            JSON.stringify(newItem.selectedOptions)
      );

      if (existingItemIndex >= 0) {
        const existingItem = state.items[existingItemIndex];
        existingItem.quantity += newItem.quantity;
        existingItem.totalPrice += newItem.totalPrice;
      } else {
        state.items.push(newItem);
      }

      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
      state.totalQuantity = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    },

    removeItemFromBasket(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === id);
      if (itemIndex !== -1) {
        state.items.splice(itemIndex, 1);
        state.totalPrice = state.items.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );
        state.totalQuantity = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      }
    },

    clearBasket(state) {
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
      state.customerName = "";
      state.customerTableNumber = "";
      state.tip = null;
      state.deliveryFee = null;
    },

    updateCustomerName(state, action: PayloadAction<string>) {
      state.customerName = action.payload;
    },

    updateCustomerDetails(state, action: PayloadAction<CustomerDetailsUpdate>) {
      const { name, phone, streetAddress, town } = action.payload;
      if (name !== undefined) state.customerName = name;
      if (phone !== undefined) state.customerPhone = phone;
      if (streetAddress !== undefined)
        state.cutomerStreetAddress = streetAddress;
      if (town !== undefined) state.cutomerTown = town;
    },

    updateCustomerAddress(state, action: PayloadAction<string>) {
      state.cutomerStreetAddress = action.payload;
      state.cutomerTown = action.payload;
    },

    updateCustomerTableNumber(state, action: PayloadAction<string>) {
      state.customerTableNumber = action.payload;
    },

    updateItemQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        const pricePerItem = item.totalPrice / item.quantity;
        item.quantity = quantity;
        item.totalPrice = pricePerItem * quantity;
        state.totalPrice = state.items.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );
        state.totalQuantity = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      }
    },

    updateItemInBasket(state, action: PayloadAction<BasketItem>) {
      const updatedItem = action.payload;
      const index = state.items.findIndex((item) => item.id === updatedItem.id);
      if (index !== -1) {
        state.items[index] = updatedItem;
        state.totalPrice = state.items.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );
        state.totalQuantity = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      }
    },
    setTip(state, action: PayloadAction<number | null>) {
      state.tip = action.payload;
    },

    setDeliveryFee(state, action: PayloadAction<number | null>) {
      state.deliveryFee = action.payload;
    },
  },
});

export const {
  addItemToBasket,
  removeItemFromBasket,
  clearBasket,
  updateCustomerName,
  updateCustomerTableNumber,
  updateCustomerAddress,
  updateCustomerDetails,
  updateItemQuantity,
  updateItemInBasket,
  setTip,
  setDeliveryFee,
} = BasketSlice.actions;

export default BasketSlice.reducer;
