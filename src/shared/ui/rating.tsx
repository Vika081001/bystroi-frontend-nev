import { Star } from "lucide-react";



type Props = {
  size: number;
  rating: number;
};

export const Rating = ({ rating, size }: Props) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          width={size}
          height={size}
          strokeWidth={1}
          stroke="gold"
          fill={index < Math.round(rating) ? "gold" : "transparent"}
        />
      ))}
    </div>
  );
};
