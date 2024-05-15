
import { useState } from "react";

import GameFilter from "@/components/filters/game-filter/app";
import RatingFilter from "@/components/filters/rating-filter/app";
import UserAutocomplete from "@/components/filters/user-autocomplete/app";
import TagFilter from "@/components/filters/tag-filter/app";
import ValueRangeFilter from "@/components/filters/value-range-filter/app";
import { Button, Input, Spacer } from "@nextui-org/react";

export default function DemoFilters() {
  const [filters, setFilters] = useState({
    rating: null,
    user: null,
    game: null,
    tags: [],
    length: [null, null],
    ticks: [null, null],
    frames: [null, null],
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    // Send the updated filters to the backend for querying
    // ...
  };

  return (

    <div className="bg-accents0 p-4">
      <GameFilter onChange={handleFilterChange} />
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2"> {/* Reduced gap */}
          <div className="flex gap-2 w-full md:w-auto"> {/* Reduced gap */}
            {/* <UserAutocomplete onChange={handleFilterChange} /> */}
            
            {/* <RatingFilter onChange={handleFilterChange} /> */}
          </div>
          <div className="flex gap-2 items-center w-full md:w-auto"> {/* Reduced gap */}
            <Input
              type="text"
              placeholder="Search by map or player..."
              size="sm"
              className="w-full md:w-64" // Adjust width on larger screens
            />
            <TagFilter onChange={handleFilterChange} /> {/* Removed size="sm" */}
          </div>
        </div>
        <Spacer y={1} /> {/* Reduced spacing */}
        <div className="flex flex-wrap gap-2 justify-center"> {/* Reduced gap */}
          <Spacer y={1} /> {/* Reduced spacing */}
          <Button
            onClick={handleApplyFilters}
            className="bg-gradient-to-tr from-blue-500 to-cyan-500 text-white shadow-lg"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
