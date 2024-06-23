import React, { useState } from "react";
import StarRating from "react-star-ratings";

const Star = ({ starClick, numberOfStars }) => {
  const [rating, setRating] = useState(0); // Local state to track current rating

  const changeRating = (newRating) => {
    setRating(newRating); // Update local rating state
    starClick(newRating); // Call parent component function with new rating
  };

  return (
    <div>
      <StarRating
        rating={rating}
        starRatedColor="gold" // Color when rated
        changeRating={changeRating}
        numberOfStars={numberOfStars}
        starDimension="20px"
        starSpacing="2px"
        starHoverColor="gold"
        starEmptyColor="grey"
      />
      <br />
    </div>
  );
};

export default Star;
