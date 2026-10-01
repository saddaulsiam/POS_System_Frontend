import { useState } from "react";
import { CartItem, Product, ProductVariant } from "../types";
import toast from "react-hot-toast";

/** Compute item subtotal taking discount into account */
function computeSubtotal(
  price: number,
  quantity: number,
  discountType?: "FIXED" | "PERCENTAGE",
  discountValue?: number,
): { subtotal: number; discountAmount: number } {
  const gross = price * quantity;
  let discountAmount = 0;
  if (discountValue && discountValue > 0) {
    if (discountType === "PERCENTAGE") {
      discountAmount = Math.min((gross * discountValue) / 100, gross);
    } else {
      // FIXED: discount per-item × quantity
      discountAmount = Math.min(discountValue * quantity, gross);
    }
  }
  return { subtotal: gross - discountAmount, discountAmount };
}

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
                ...computeSubtotal(item.price, item.quantity + 1, item.discountType, item.discountValue),
              }
            : item,
        ),
      );
    } else {
      // Apply product default discount if set
      const defType = (product.discountType && product.discountType !== "NONE")
        ? (product.discountType as "FIXED" | "PERCENTAGE")
        : "FIXED";
      const defValue = (product.discountType && product.discountType !== "NONE")
        ? (product.discountValue || 0)
        : 0;
      const { subtotal: initSubtotal, discountAmount: initDiscount } =
        computeSubtotal(product.sellingPrice, 1, defType, defValue);
      const newItem: CartItem = {
        product,
        quantity: 1,
        price: product.sellingPrice,
        subtotal: initSubtotal,
        discountType: defType,
        discountValue: defValue,
        discountAmount: initDiscount,
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
                ...computeSubtotal(item.price, item.quantity + 1, item.discountType, item.discountValue),
              }
            : item,
        ),
      );
    } else {
      // Apply product default discount if set
      const defType = (product.discountType && product.discountType !== "NONE")
        ? (product.discountType as "FIXED" | "PERCENTAGE")
        : "FIXED";
      const defValue = (product.discountType && product.discountType !== "NONE")
        ? (product.discountValue || 0)
        : 0;
      const { subtotal: initSubtotal, discountAmount: initDiscount } =
        computeSubtotal(variant.sellingPrice, 1, defType, defValue);
      const newItem: CartItem = {
        product,
        variant,
        quantity: 1,
        price: variant.sellingPrice,
        subtotal: initSubtotal,
        discountType: defType,
        discountValue: defValue,
        discountAmount: initDiscount,
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
          ? { ...item, quantity, ...computeSubtotal(item.price, quantity, item.discountType, item.discountValue) }
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

  /** Update per-item discount — recalculates subtotal immediately */
  const updateCartItemDiscount = (
    productId: number,
    discountType: "FIXED" | "PERCENTAGE",
    discountValue: number,
    variantId?: number,
  ) => {
    setCart(
      cart.map((item) => {
        if (
          item.product.id === productId &&
          (variantId ? item.variant?.id === variantId : !item.variant)
        ) {
          const { subtotal, discountAmount } = computeSubtotal(
            item.price,
            item.quantity,
            discountType,
            discountValue,
          );
          return { ...item, discountType, discountValue, discountAmount, subtotal };
        }
        return item;
      }),
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
    updateCartItemDiscount,
    removeFromCart,
    clearCart,
  };
}
