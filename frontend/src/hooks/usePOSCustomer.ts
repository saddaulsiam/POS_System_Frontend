import { useState } from "react";
import toast from "react-hot-toast";
import { Customer } from "../types";
import { customersAPI } from "../services";

export function usePOSCustomer() {
  const [customerPhone, setCustomerPhone] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerNotFound, setCustomerNotFound] = useState(false);
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);

  const searchCustomer = async () => {
    if (!customerPhone.trim()) {
      setCustomer(null);
      setCustomerNotFound(false);
      return;
    }
    try {
      const customerData = await customersAPI.getByPhone(customerPhone);
      setCustomer(customerData);
      setCustomerNotFound(false);
      toast.success(`Customer found: ${customerData.name}`);
    } catch (error) {
      setCustomer(null);
      setCustomerNotFound(true);
      setShowCreateCustomerModal(true);
      // toast.error("Customer not found");
    }
  };

  const handleCreateCustomer = () => {
    setShowCreateCustomerModal(true);
  };

  const handleClearCustomer = () => {
    setCustomer(null);
    setCustomerPhone("");
    setCustomerNotFound(false);
  };

  return {
    customerPhone,
    setCustomerPhone,
    customer,
    setCustomer,
    customerNotFound,
    setCustomerNotFound,
    showCreateCustomerModal,
    setShowCreateCustomerModal,
    searchCustomer,
    handleCreateCustomer,
    handleClearCustomer,
  };
}
