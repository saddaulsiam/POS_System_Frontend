import React, { useEffect, useState } from "react";
import { Modal, Input, Button } from "../common";

interface PinPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => void;
  title?: string;
}

const PinPromptModal: React.FC<PinPromptModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Enter PIN",
}) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPin("");
      setError(null);
    }
  }, [isOpen]);

  const validateAndSubmit = () => {
    if (!pin || pin.length < 4 || pin.length > 8) {
      setError("PIN must be 4-8 digits");
      return;
    }
    if (!/^[0-9]+$/.test(pin)) {
      setError("PIN must contain only digits");
      return;
    }
    onSubmit(pin);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      closeOnOverlayClick={false}
      size="sm"
    >
      <div className="space-y-4">
        <Input
          label="New PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="4-8 digits"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={8}
          autoFocus
          fullWidth
          required
          helperText="PIN must be 4-8 digits"
          error={error || undefined}
        />

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" onClick={validateAndSubmit} type="button">
            Save PIN
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PinPromptModal;
