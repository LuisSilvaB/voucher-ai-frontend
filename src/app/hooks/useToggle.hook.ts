import { useState } from 'react';


function useToggle(initialState = false) {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    onToggle,
    onOpen,
    onClose,
  };
}

export default useToggle;

