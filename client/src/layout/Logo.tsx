import React from 'react';

import logo from '../assets/images/logo-bus.jpg';

type Props = {
  width?: number;
  onClick?: () => void;
};
export const Logo: React.FC<Props> = (props: Props) => {
  return (
    <img
      src={logo}
      alt="logo"
      style={{ width: props.width ? `${props.width}px` : '100%' }}
      onClick={props.onClick}
    />
  );
};
