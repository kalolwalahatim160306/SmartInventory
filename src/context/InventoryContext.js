import React, { createContext, useContext, useReducer, useEffect } from 'react';

const InventoryContext = createContext();

const initialState = {
  products: [],
  bills: [],
  categories: []
};

function inventoryReducer(state, action) {
  switch (action.type) {
    case 'ADD_PRODUCT':
      const newProduct = {
        ...action.payload,
        id: `P${String(state.products.length + 1).padStart(3, '0')}`,
        dateAdded: new Date().toISOString().split('T')[0],
        status: action.payload.stock > 10 ? 'In Stock' : action.payload.stock > 0 ? 'Low Stock' : 'Out of Stock'
      };
      return {
        ...state,
        products: [...state.products, newProduct]
      };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id
            ? {
                ...action.payload,
                status: action.payload.stock > 10 ? 'In Stock' : action.payload.stock > 0 ? 'Low Stock' : 'Out of Stock'
              }
            : product
        )
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };

    case 'ADD_BILL':
      const newBill = {
        ...action.payload,
        id: `B${String(state.bills.length + 1).padStart(3, '0')}`,
        date: action.payload.date || new Date().toISOString().split('T')[0] // Use provided date or current date
      };
      
      // Update product stock
      const updatedProducts = state.products.map(product => {
        const billItem = action.payload.items.find(item => item.productId === product.id);
        if (billItem) {
          const newStock = product.stock - billItem.quantity;
          return {
            ...product,
            stock: newStock,
            status: newStock > 10 ? 'In Stock' : newStock > 0 ? 'Low Stock' : 'Out of Stock'
          };
        }
        return product;
      });

      return {
        ...state,
        bills: [...state.bills, newBill],
        products: updatedProducts
      };

    case 'UPDATE_BILL':
      // First, restore the stock from the original bill
      const originalBill = state.bills.find(bill => bill.id === action.payload.id);
      let restoredProducts = state.products;
      
      if (originalBill) {
        restoredProducts = state.products.map(product => {
          const originalItem = originalBill.items.find(item => item.productId === product.id);
          if (originalItem) {
            const restoredStock = product.stock + originalItem.quantity;
            return {
              ...product,
              stock: restoredStock,
              status: restoredStock > 10 ? 'In Stock' : restoredStock > 0 ? 'Low Stock' : 'Out of Stock'
            };
          }
          return product;
        });
      }
      
      // Then, deduct the stock for the updated bill
      const finalProducts = restoredProducts.map(product => {
        const updatedItem = action.payload.items.find(item => item.productId === product.id);
        if (updatedItem) {
          const newStock = product.stock - updatedItem.quantity;
          return {
            ...product,
            stock: newStock,
            status: newStock > 10 ? 'In Stock' : newStock > 0 ? 'Low Stock' : 'Out of Stock'
          };
        }
        return product;
      });

      return {
        ...state,
        bills: state.bills.map(bill =>
          bill.id === action.payload.id ? action.payload : bill
        ),
        products: finalProducts
      };

    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload]
      };

    default:
      return state;
  }
}

export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('smartInventoryData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Clear localStorage to start fresh
        localStorage.removeItem('smartInventoryData');
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('smartInventoryData', JSON.stringify(state));
  }, [state]);

  const value = {
    ...state,
    dispatch,
    // Helper functions
    addProduct: (product) => dispatch({ type: 'ADD_PRODUCT', payload: product }),
    updateProduct: (product) => dispatch({ type: 'UPDATE_PRODUCT', payload: product }),
    deleteProduct: (productId) => dispatch({ type: 'DELETE_PRODUCT', payload: productId }),
    addBill: (bill) => dispatch({ type: 'ADD_BILL', payload: bill }),
    updateBill: (bill) => dispatch({ type: 'UPDATE_BILL', payload: bill }),
    addCategory: (category) => dispatch({ type: 'ADD_CATEGORY', payload: category }),
    
    // Computed values
    getTotalProducts: () => state.products.length,
    getTotalStock: () => state.products.reduce((sum, product) => sum + product.stock, 0),
    getLowStockProducts: () => state.products.filter(product => product.status === 'Low Stock'),
    getOutOfStockProducts: () => state.products.filter(product => product.status === 'Out of Stock'),
    getMonthlyRevenue: (month = new Date().getMonth() + 1, year = new Date().getFullYear()) => {
      return state.bills
        .filter(bill => {
          const billDate = new Date(bill.date);
          return billDate.getMonth() + 1 === month && billDate.getFullYear() === year;
        })
        .reduce((sum, bill) => sum + bill.totalAmount, 0);
    },
    getMonthlyProductsAdded: (month = new Date().getMonth() + 1, year = new Date().getFullYear()) => {
      return state.products.filter(product => {
        const addedDate = new Date(product.dateAdded);
        return addedDate.getMonth() + 1 === month && addedDate.getFullYear() === year;
      }).length;
    },
    getMonthlyProductsSold: (month = new Date().getMonth() + 1, year = new Date().getFullYear()) => {
      return state.bills
        .filter(bill => {
          const billDate = new Date(bill.date);
          return billDate.getMonth() + 1 === month && billDate.getFullYear() === year;
        })
        .reduce((sum, bill) => sum + bill.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    }
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}