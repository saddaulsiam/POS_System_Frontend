import { useState } from "react";
import { CartItem, Product, ProductVariant } from "../types";
import toast from "react-hot-toast";

export function usePOSCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    if (product.hasVariants) {
      return false; // signal to show variant selector
    }
    if (product.stockQuantity <= 0) {
      toast.error("Product is out of stock");
      return;
    }
    const existingItem = cart.find(
      (item) => item.product.id === product.id && !item.variant,
    );
    if (existingItem) {
      if (existingItem.quantity >= product.stockQuantity) {
        toast.error("Not enough stock available");
        return;
      }
      setCart(
        cart.map((item) =>
          item.product.id === product.id && !item.variant
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
            : item,
        ),
      );
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        price: product.sellingPrice,
        subtotal: product.sellingPrice,
      };
      setCart([...cart, newItem]);
    }
    toast.success(`${product.name} added to cart`);
  };

  const addVariantToCart = (variant: ProductVariant, product: Product) => {
    if ((variant.stockQuantity || 0) <= 0) {
      toast.error("Variant is out of stock");
      return;
    }
    const existingItem = cart.find(
      (item) =>
        item.product.id === product.id && item.variant?.id === variant.id,
    );
    if (existingItem) {
      if (existingItem.quantity >= (variant.stockQuantity || 0)) {
        toast.error("Not enough stock available");
        return;
      }
      setCart(
        cart.map((item) =>
          item.product.id === product.id && item.variant?.id === variant.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
            : item,
        ),
      );
    } else {
      const newItem: CartItem = {
        product,
        variant,
        quantity: 1,
        price: variant.sellingPrice,
        subtotal: variant.sellingPrice,
      };
      setCart([...cart, newItem]);
    }
    toast.success(`${product.name} - ${variant.name} added to cart`);
  };

  const updateCartItemQuantity = (
    productId: number,
    quantity: number,
    variantId?: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart(
      cart.map((item) =>
        item.product.id === productId &&
        (variantId ? item.variant?.id === variantId : !item.variant)
          ? { ...item, quantity, subtotal: quantity * item.price }
          : item,
      ),
    );
  };

  const removeFromCart = (productId: number, variantId?: number) => {
    setCart(
      cart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (variantId ? item.variant?.id === variantId : !item.variant)
          ),
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    setCart,
    addToCart,
    addVariantToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
  };
}
