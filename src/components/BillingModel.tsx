import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal"; // Import the Modal component

interface BillingModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

// interface Customer {
//   value: string;
//   label: string;
// }

// const customers: Customer[] = [
//   { value: "customer1", label: "Customer 1" },
//   { value: "customer2", label: "Customer 2" },
//   { value: "customer3", label: "Customer 3" },
//   // Add more customers as needed
// ];

const BillingModal: React.FC<BillingModalProps> = ({ isOpen, onRequestClose }) => {
  // Add your modal content here (similar to your existing form)

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      {/* Your form content */}
      {/* ... */}
    </Modal>
  );
};

export default BillingModal;
