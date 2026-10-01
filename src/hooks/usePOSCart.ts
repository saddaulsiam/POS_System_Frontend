import { useState } from "react";
import { CartItem, Product, ProductVariant } from "../types";
import toast from "react-hot-toast";

/** Compute item subtotal taking discount into account, ensuring selling price does not fall below purchase price */
function computeSubtotal(
  price: number,
  quantity: number,
  discountType?: "FIXED" | "PERCENTAGE",
  discountValue?: number,
  purchasePrice: number = 0,
): { subtotal: number; discountAmount: number } {
  const gross = price * quantity;
  let discountAmount = 0;

  // Maximum allowed discount ensures discounted price never drops below purchase cost
  const minAllowedSubtotal = Math.max(0, purchasePrice * quantity);
  const maxAllowedDiscount = Math.max(0, gross - minAllowedSubtotal);

  if (discountValue && discountValue > 0) {
    let rawDiscount = 0;
    if (discountType === "PERCENTAGE") {
      rawDiscount = (gross * discountValue) / 100;
    } else {
      rawDiscount = discountValue * quantity;
    }
    discountAmount = Math.min(rawDiscount, maxAllowedDiscount);
  }

  return {
    subtotal: Math.max(minAllowedSubtotal, gross - discountAmount),
    discountAmount,
  };
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
    const purchasePrice = product.purchasePrice || 0;
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
                ...computeSubtotal(
                  item.price,
                  item.quantity + 1,
                  item.discountType,
                  item.discountValue,
                  purchasePrice,
                ),
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
        computeSubtotal(product.sellingPrice, 1, defType, defValue, purchasePrice);
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
    const purchasePrice = variant.purchasePrice ?? product.purchasePrice ?? 0;
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
                ...computeSubtotal(
                  item.price,
                  item.quantity + 1,
                  item.discountType,
                  item.discountValue,
                  purchasePrice,
                ),
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
        computeSubtotal(variant.sellingPrice, 1, defType, defValue, purchasePrice);
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
      cart.map((item) => {
        if (
          item.product.id === productId &&
          (variantId ? item.variant?.id === variantId : !item.variant)
        ) {
          const purchasePrice =
            item.variant?.purchasePrice ?? item.product.purchasePrice ?? 0;
          return {
            ...item,
            quantity,
            ...computeSubtotal(
              item.price,
              quantity,
              item.discountType,
              item.discountValue,
              purchasePrice,
            ),
          };
        }
        return item;
      }),
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

  /** Update per-item discount — recalculates subtotal immediately, preventing discount below buy price */
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
          const purchasePrice =
            item.variant?.purchasePrice ?? item.product.purchasePrice ?? 0;
          const maxUnitDiscount =
            purchasePrice > 0 ? Math.max(0, item.price - purchasePrice) : item.price;
          const maxPercent =
            item.price > 0 ? (maxUnitDiscount / item.price) * 100 : 100;

          let safeValue = Math.max(0, discountValue);

          if (purchasePrice > 0) {
            if (discountType === "PERCENTAGE" && safeValue > maxPercent) {
              safeValue = Math.floor(maxPercent * 10) / 10;
              toast.error(
                `Max discount is ${safeValue}% (cannot sell below buy price of ${purchasePrice})`,
              );
            } else if (discountType === "FIXED" && safeValue > maxUnitDiscount) {
              safeValue = Math.floor(maxUnitDiscount * 100) / 100;
              toast.error(
                `Max discount is ${safeValue} per item (cannot sell below buy price of ${purchasePrice})`,
              );
            }
          }

          const { subtotal, discountAmount } = computeSubtotal(
            item.price,
            item.quantity,
            discountType,
            safeValue,
            purchasePrice,
          );
          return {
            ...item,
            discountType,
            discountValue: safeValue,
            discountAmount,
            subtotal,
          };
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
