import './Dots.scss';
import React, { FC } from 'react';

interface IProps {
  dotsQuantity: number;
}

export const DotsEffect: FC<IProps> = React.memo(({ dotsQuantity }) => {
  const setDots = () => {
    let spans = [];
    for (let i = 1; i <= dotsQuantity; i++) {
      spans.push(
        <span
          key={i}
          style={{ animationDuration: (Math.random() * 4 + 2).toFixed(2) + 's' }}
          className='z-[2] component'
        ></span>,
      );
    }
    return spans;
  };

  return <div className='flex bubbles overflow-hidden max-sm:hidden'>{setDots()}</div>;
});
