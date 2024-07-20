import './Dots.css';
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
          className='z-[2] dots_item'
        ></span>,
      );
    }
    return spans;
  };

  return <div className='flex dots overflow-hidden max-sm:hidden'>{setDots()}</div>;
});
