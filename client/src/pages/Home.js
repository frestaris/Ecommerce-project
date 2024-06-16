import React from "react";
import Jumbotron from "../components/cards/Jumbotron";
import NewArrivals from "../components/home/NewArrivals";
import BestSellers from "../components/home/BestSellers";

const Home = () => {
  return (
    <div>
      <div className="bg-light p-5 text-center text-danger fw-bold h1 mb-2">
        <Jumbotron text={["Latest Products", "New Arrivals", "Best Sellers"]} />
      </div>
      <h4 className="bg-light text-center p-3 my-5 display-5">New Arrivals</h4>
      <NewArrivals />
      <h4 className="bg-light text-center p-3 my-5 display-5">Best Sellers</h4>
      <BestSellers />
    </div>
  );
};

export default Home;
