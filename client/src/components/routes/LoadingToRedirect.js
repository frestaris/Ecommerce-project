import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoadingToRedirect = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);
    if (count === 0) {
      navigate("/");
    }
    return () => clearInterval(interval);
  }, [count, navigate]); // Include navigate in the dependency array

  return (
    <div className="container p-5 text-center">
      Redirecting you in {count} seconds
    </div>
  );
};

export default LoadingToRedirect;
