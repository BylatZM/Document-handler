import './Dots.scss';
import React, { FC } from 'react';
import { FaRegSnowflake } from 'react-icons/fa6';

interface IProps {
  dotsQuantity: number;
}

export const DotsEffect: FC<IProps> = React.memo(({ dotsQuantity }) => {
  const setDots = () => {
    let spans = [];
    for (let i = 1; i <= dotsQuantity; i++) {
      spans.push(
        <FaRegSnowflake
          key={i}
          style={{ animationDuration: (Math.random() * 6 + 4).toFixed(2) + 's' }}
          className='z-[2] component'
        />,
      );
    }
    return spans;
  };

  return <div className='bubbles overflow-hidden'>{setDots()}</div>;
});
