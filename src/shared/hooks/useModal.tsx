import { useCallback, useState } from 'react';

export function useModal(defaultOpen: boolean = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
}
