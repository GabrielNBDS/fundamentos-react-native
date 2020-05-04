import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext>({} as CartContext);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const items = await AsyncStorage.getItem('Products');

      if (items) {
        setProducts(JSON.parse(items));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Omit<Product, 'quantity'>) => {
      const duplicated = products.findIndex(
        element => element.id === product.id,
      );

      if (duplicated === -1) {
        const { id, image_url, price, title } = product;
        const newProduct: Product = {
          id,
          image_url,
          price,
          title,
          quantity: 1,
        };
        setProducts([...products, newProduct]);
      } else {
        const items = products.map(element => {
          if (product.id === element.id) {
            const { id, image_url, price, title, quantity } = element;
            const newProduct: Product = {
              id,
              image_url,
              price,
              title,
              quantity: quantity + 1,
            };
            return newProduct;
          }
          return element;
        });

        setProducts(items);
      }
      await AsyncStorage.setItem('Products', JSON.stringify(products));
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const items = products.map(element => {
        if (id === element.id) {
          const { id: elementId, image_url, price, title, quantity } = element;
          const newProduct: Product = {
            id: elementId,
            image_url,
            price,
            title,
            quantity: quantity + 1,
          };
          return newProduct;
        }
        return element;
      });

      setProducts(items);

      await AsyncStorage.setItem('Products', JSON.stringify(products));
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const items = products.map(element => {
        if (id === element.id) {
          const { id: elementId, image_url, price, title, quantity } = element;
          const newProduct: Product = {
            id: elementId,
            image_url,
            price,
            title,
            quantity: quantity - 1,
          };

          if (newProduct.quantity > 0) {
            return newProduct;
          }
          return '';
        }
        return element;
      });

      setProducts(items);

      await AsyncStorage.setItem('Products', JSON.stringify(products));
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
