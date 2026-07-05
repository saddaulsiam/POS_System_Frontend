# ⌨️ POS System Keyboard Shortcuts (Mouse-less Checkout)

This document lists the available keyboard shortcuts in the POS System designed to allow cashiers to operate the checkout register entirely without a mouse.

---

## 🛒 Main POS Screen Shortcuts

The function keys (**`F2`** and **`F3`**) are global and work at any time. The letter keys work when you are **not** currently typing in an input field (press **`Escape`** at any time to blur focus and enter Navigation Mode).

| Key | Action | Target Component | Notes |
| :--- | :--- | :--- | :--- |
| **`F2`**, **`s`**, or **`/`** | Focus Barcode Scanner / Product Search | [POSBarcodeScanner](file:///e:/All%20Project/POS-System/frontend/src/components/pos/POSBarcodeScanner.tsx) | Focuses the scanner/product lookup input and highlights existing text. |
| **`F3`** or **`c`** | Focus Customer Search | [POSCustomerSearch](file:///e:/All%20Project/POS-System/frontend/src/components/pos/POSCustomerSearch.tsx) | Focuses the phone number lookup input field. |
| **`p`** or **`Space`** | Pay / Complete Sale | [POSPage](file:///e:/All%20Project/POS-System/frontend/src/pages/POSPage.tsx) | Opens the Payment processing modal (requires items in cart). |
| **`x`** | Clear Cart | [POSPage](file:///e:/All%20Project/POS-System/frontend/src/pages/POSPage.tsx) | Prompts a confirmation dialog before resetting the entire cart. |
| **`Escape`** | Exit Input / Close Modal | [POSPage](file:///e:/All%20Project/POS-System/frontend/src/pages/POSPage.tsx) | Blurs the active input or cancels the payment modal. |

---

## 💳 Payment Modal Shortcuts

These hotkeys are active only when the **Process Payment** modal is open.

| Key | Action | Target Component | Notes |
| :--- | :--- | :--- | :--- |
| **`Ctrl + 1`** | Select **Cash** Payment | [POSPaymentModal](file:///e:/All%20Project/POS-System/frontend/src/components/pos/POSPaymentModal.tsx) | Switches payment type to Cash and auto-focuses the Cash Received field. |
| **`Ctrl + 2`** | Select **Card** Payment | [POSPaymentModal](file:///e:/All%20Project/POS-System/frontend/src/components/pos/POSPaymentModal.tsx) | Switches payment type to Card. |
| **`Enter`** | Finalize & Complete Sale | [POSPaymentModal](file:///e:/All%20Project/POS-System/frontend/src/components/pos/POSPaymentModal.tsx) | Finalizes and submits the checkout. |
| **`Escape`** | Cancel / Close Modal | [POSPaymentModal](file:///e:/All%20Project/POS-System/frontend/src/components/pos/POSPaymentModal.tsx) | Closes the modal and returns to the cart screen. |

---

## 📦 Variant Selector Modal Shortcuts

These hotkeys are active only when the **Select Variant** modal is open.

| Key | Action | Target Component | Notes |
| :--- | :--- | :--- | :--- |
| **`1`** to **`9`** | Select corresponding variant directly | [VariantSelectorModal](file:///e:/All%20Project/POS-System/frontend/src/components/pos/VariantSelectorModal.tsx) | Pressing `2` selects the 2nd variant, etc. |
| **`ArrowUp`** / **`ArrowDown`** | Navigate selection | [VariantSelectorModal](file:///e:/All%20Project/POS-System/frontend/src/components/pos/VariantSelectorModal.tsx) | Moves the active highlight up or down. |
| **`Enter`** | Add highlighted variant to cart | [VariantSelectorModal](file:///e:/All%20Project/POS-System/frontend/src/components/pos/VariantSelectorModal.tsx) | Adds the currently highlighted variant. |
| **`Escape`** | Cancel / Close Modal | [VariantSelectorModal](file:///e:/All%20Project/POS-System/frontend/src/components/pos/VariantSelectorModal.tsx) | Closes the modal. |

---

## ⚡ Recommended Cashier Checkout Flow

1. **Start Sale**: Scan products using a barcode scanner or search manually using **`s`** or **`/`**.
2. **Assign Customer (Optional)**: Press **`c`**, type the customer's phone number, and hit `Enter` to search. Press **`Escape`** when done to exit the input.
3. **Open Checkout**: Press **`p`** or **`Space`** to bring up the payment modal.
4. **Choose Payment**:
   - For **Card**: Press **`Ctrl + 2`** and hit **`Enter`**.
   - For **Cash**: Press **`Ctrl + 1`** (auto-focused), type the cash amount received, and hit **`Enter`**.
5. **Print & Reset**: The receipt will print instantly in the background, and the screen resets for the next customer.
