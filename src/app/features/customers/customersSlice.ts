import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Customer } from '../../types';
import { customersData } from '../../data/customers';

interface CustomersState {
  customers: Customer[];
}

const initialState: CustomersState = {
  customers: customersData,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.unshift(action.payload);
    },
    updateCustomer: (state, action: PayloadAction<{ customerIndex: number; customerData: Partial<Customer> }>) => {
      const { customerIndex, customerData } = action.payload;
      if (state.customers[customerIndex]) {
        state.customers[customerIndex] = { ...state.customers[customerIndex], ...customerData };
      }
    },
    deleteCustomer: (state, action: PayloadAction<number>) => {
      // Burada index yerine ID ile silmek daha güvenli olabilir, ancak mevcut yapı index kullanıyor.
      // Refaktör sırasında ID'ye geçilebilir.
      state.customers.splice(action.payload, 1);
    },
  },
});

export const { addCustomer, updateCustomer, deleteCustomer } = customersSlice.actions;

export const selectCustomers = (state: RootState) => state.customers.customers;

export default customersSlice.reducer;