import { useState } from "react";

export function useModal() {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (type) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return { activeModal, openModal, closeModal };
}
