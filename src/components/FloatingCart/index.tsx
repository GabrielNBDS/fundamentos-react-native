import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const totalArray = products.map(
      element => element.price * element.quantity,
    );

    let total = 0;
    if (totalArray.length > 0) {
      total = totalArray.reduce((a, b) => a + b);
    }

    if (total > 0) {
      return formatValue(total);
    }
    return 0;
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const totalArray = products.map(element => element.quantity);

    let total = 0;
    if (totalArray.length > 0) {
      total = totalArray.reduce((a, b) => a + b);
    }

    if (total > 0) {
      return total;
    }
    return 0;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
