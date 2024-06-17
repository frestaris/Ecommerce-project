import React from "react";
import StarRating from "react-star-ratings";

export const showAverage = (p) => {
  if (p && p.ratings) {
    let ratingsArray = p.ratings; // Simplified access to p.ratings
    let total = [];
    let length = ratingsArray.length;

    ratingsArray.forEach((r) => total.push(r.star)); // Push each star rating into total array
    let totalReduced = total.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    ); // Correct usage of reduce function

    let highest = length * 5;
    let result = (totalReduced * 5) / highest;
    return (
      <div className="py-2">
        <div className="star-rating">
          <StarRating
            starRatedColor="gold"
            starDimension="25px"
            rating={result}
          />
          <span>({p.ratings.length})</span>
        </div>
      </div>
    );
  }
};
