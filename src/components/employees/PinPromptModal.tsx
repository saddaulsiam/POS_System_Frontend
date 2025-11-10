import React, { useEffect, useState } from "react";
import { Modal, Input, Button } from "../common";
import { ShieldCheck } from "lucide-react";

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
  title = "Reset PIN",
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      validateAndSubmit();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">Secure PIN authentication</p>
          </div>
        </div>
      }
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" onClick={validateAndSubmit} type="button">
            Reset
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="PIN Code"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter 4-8 digit PIN"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={8}
          autoFocus
          fullWidth
          required
          helperText="PIN must be 4-8 digits (numbers only)"
          error={error || undefined}
        />
      </div>
    </Modal>
  );
};

export default PinPromptModal;
