import React from "react";

import SubscribeNewsletter from "@/feature/subscribe-newsletter/ui/subscribe-newsletter";

import Categories from "@/widgets/categories";
import Deals from "@/widgets/deals";
import Poster from "@/widgets/poster";
import Recommendation from "@/widgets/recommendations";

const Main = () => {
  return (
    <div className="flex flex-col">
      <Poster />
      <Categories />
      <Recommendation />
      <SubscribeNewsletter />
      <Deals />
    </div>
  );
};

export default Main;
