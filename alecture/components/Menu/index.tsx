import React, { CSSProperties, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './styles';

interface Props {
  children: React.ReactNode;
  style: CSSProperties;
  show: boolean;
  onCloseModal: (e: React.MouseEvent) => void;
  closeButton?: boolean;
}

const Menu: React.FC<Props> = ({ children, style, show, onCloseModal, closeButton }) => {
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};

Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
