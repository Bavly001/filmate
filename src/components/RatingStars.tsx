import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface RatingStarsProps {
  count?: number;
  totalStars?: number;
  containerClassName?: string;
  halfStarsClassName?: string;
  emptyStarsClassName?: string;
  filledStarsClassName?: string;
}

const starsGenerator = (num: number, Star: IconType, className = '') => {
  const stars = [];
  const safeNum = Math.max(0, Math.floor(num));
  for (let index = 0; index < safeNum; index++) {
    stars.push(
      <Star
        key={index}
        size="1em"
        className={`text-current ${className}`}
      />
    );
  }
  return stars;
};

export default function RatingStars({
  count = 0,
  totalStars = 5,
  containerClassName = '',
  halfStarsClassName = '',
  emptyStarsClassName = '',
  filledStarsClassName = '',
}: RatingStarsProps) {
  const safeCount = Math.max(0, Math.min(totalStars, count));
  const filledStars = Math.trunc(safeCount);
  const halfStars = Math.round(safeCount - filledStars);
  const emptyStars = Math.max(0, totalStars - (filledStars + halfStars));

  return (
    <span
      className={`flex justify-center items-center gap-x-1 ${containerClassName}`}
    >
      {starsGenerator(filledStars, FaStar, filledStarsClassName)}
      {starsGenerator(halfStars, FaStarHalfAlt, halfStarsClassName)}
      {starsGenerator(emptyStars, FaRegStar, emptyStarsClassName)}
    </span>
  );
}
