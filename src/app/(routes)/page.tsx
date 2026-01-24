import React, { Suspense } from "react";

import SubscribeNewsletter from "@/feature/subscribe-newsletter/ui/subscribe-newsletter";

import Categories from "@/widgets/categories";
import Deals from "@/widgets/deals";
import Poster from "@/widgets/poster";
import Recommendation from "@/widgets/recommendations";

const Main = () => {
  return (
    <div className="flex flex-col">
      <Poster />
      <Suspense fallback={<div>Загрузка категорий...</div>}>
        <Categories />
      </Suspense>
      <Suspense fallback={<div>Загрузка рекомендаций...</div>}>
        <Recommendation />
      </Suspense>
      <SubscribeNewsletter />
      <Suspense fallback={<div>Загрузка предложений...</div>}>
        <Deals />
      </Suspense>
    </div>
  );
};

export default Main;
