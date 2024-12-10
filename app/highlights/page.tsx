"use client"

import GameEventsInifiniteScroll from "@/components/replay/game-events/infinite-scroll/app"

const HomePage: React.FC = () => {
  return (
    <div className="flex w-full">
        <GameEventsInifiniteScroll />
    </div>
  );
};

export default HomePage;
