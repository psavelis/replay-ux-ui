import React, { useMemo, useState, useCallback } from "react";
import { Button, Chip, Listbox, ListboxItem, ListboxSection, ScrollShadow } from "@nextui-org/react";
import { Selection } from "@react-types/shared";
import { GameEventVariationsMap, GameEventCategoryOption } from "./data";

export interface GameEventFilterValue {
  category: GameEventCategoryOption;
  variation: string;
  value?: string;
  id: string;
}

export interface GameEventFilterProps {
  onFilterChange?: (filters: GameEventFilterValue[]) => void;
  initialFilters?: GameEventFilterValue[];
}

const GameEventFilter: React.FC<GameEventFilterProps> = ({ onFilterChange, initialFilters = [] }) => {
  const categories: string[] = Object.keys(GameEventVariationsMap).map((key) => key.toString());
  const [selectedCategory, setSelectedCategory] = useState<GameEventCategoryOption | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<GameEventFilterValue[]>(initialFilters);

  const handleCategoryChange = (keys: Selection) => {
    if (keys === "all") {
      setSelectedCategory(null);
      setSelectedVariation(null);
      setSelectedValue(null);
      return;
    }

    const selectedKey = Array.from(keys)[0];
    if (selectedKey) {
      setSelectedCategory(String(selectedKey) as GameEventCategoryOption);
      setSelectedVariation(null);
      setSelectedValue(null);
    }
  };

  const handleVariationChange = (keys: Selection) => {
    if (keys === "all") {
      setSelectedVariation(null);
      setSelectedValue(null);
      return;
    }
    const selectedKey = Array.from(keys)[0];
    setSelectedVariation(selectedKey ? String(selectedKey) : null);
    setSelectedValue(null);
  };

  const handleValueChange = (keys: Selection) => {
    if (keys === "all") {
      setSelectedValue(null);
      return;
    }
    const selectedKey = Array.from(keys)[0];
    setSelectedValue(selectedKey ? String(selectedKey) : null);
  };

  const addFilterToQuery = useCallback(() => {
    if (!selectedCategory || !selectedVariation) return;

    const newFilter: GameEventFilterValue = {
      category: selectedCategory,
      variation: selectedVariation,
      value: selectedValue || undefined,
      id: `${selectedCategory}-${selectedVariation}-${selectedValue || "any"}-${Date.now()}`,
    };

    const isDuplicate = activeFilters.some(
      (f) => f.category === newFilter.category &&
             f.variation === newFilter.variation &&
             f.value === newFilter.value
    );

    if (isDuplicate) return;

    const updatedFilters = [...activeFilters, newFilter];
    setActiveFilters(updatedFilters);
    onFilterChange?.(updatedFilters);

    setSelectedVariation(null);
    setSelectedValue(null);
  }, [selectedCategory, selectedVariation, selectedValue, activeFilters, onFilterChange]);

  const removeFilter = useCallback((filterId: string) => {
    const updatedFilters = activeFilters.filter((f) => f.id !== filterId);
    setActiveFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  }, [activeFilters, onFilterChange]);

  const clearAllFilters = useCallback(() => {
    setActiveFilters([]);
    setSelectedCategory(null);
    setSelectedVariation(null);
    setSelectedValue(null);
    onFilterChange?.([]);
  }, [onFilterChange]);

  const currentSelectionLabel = useMemo(() => {
    if (!selectedVariation) return null;
    return selectedValue ? `${selectedVariation}: ${selectedValue}` : selectedVariation;
  }, [selectedVariation, selectedValue]);

  const activeFiltersContent = useMemo(() => {
    if (activeFilters.length === 0) return null;

    return (
      <ScrollShadow
        hideScrollBar
        className="w-full flex py-0.5 px-2 gap-1"
        orientation="horizontal"
      >
        {activeFilters.map((filter) => (
          <Chip
            key={filter.id}
            onClose={() => removeFilter(filter.id)}
            variant="flat"
            color="primary"
          >
            {filter.value ? `${filter.variation}: ${filter.value}` : filter.variation}
          </Chip>
        ))}
        {activeFilters.length > 1 && (
          <Chip
            variant="flat"
            color="danger"
            className="cursor-pointer"
            onClick={clearAllFilters}
          >
            Clear All
          </Chip>
        )}
      </ScrollShadow>
    );
  }, [activeFilters, removeFilter, clearAllFilters]);

  const canAddFilter = selectedCategory && selectedVariation;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
     <>
     <div>
     <ScrollShadow className="w-[150px] h-[400px]">
        <Listbox
          onSelectionChange={handleCategoryChange}
          label="Game Event"
          selectionMode="single"
        >
          {categories.map((item) => {
            const sectionKeyString = item?.toString().replace(" ", "") || "a";
            const sectionKey = item as keyof typeof GameEventVariationsMap;
            const section = GameEventVariationsMap[sectionKey];

            return (
              <ListboxSection key={sectionKeyString} title={section.description} showDivider>
                {section.variations?.map((variation) => (
                  <ListboxItem  key={sectionKeyString + variation.toString().replace(" ", "") + "1"}>{variation}</ListboxItem>
                ))}
              </ListboxSection>
            );
          })}
          
        </Listbox>
        </ScrollShadow>
      </div>
     </>
      {/* {selectedCategory && (
        <>
          <div>
            <Listbox
              items={[
                GameEventVariationsMaitem].emptySelectionPlaceholder,
                ...GameEventVariationsMaitem].variations
              ]}
              // selectedKeys={[selectedVariation] as Key[] || [GameEventVariationsMaitem].emptySelectionPlaceholder] as Key[]}
              onSelectionChange={handleVariationChange}
              // labelPlacement="outside"
              label="Variation"
              selectionMode="multiple"
            >
              {(item) => (
                <ListboxItem key={item} value={item}>
                  {item}
                </ListboxItem>
              )}
            </Listbox>
          </div>

          <div>
            {selectedVariation && selectedVariation !== GameEventVariationsMaitem].emptySelectionPlaceholder && (
              <Listbox
                items={Object.values(GameEventVariationsMaitem].variations)}
                // value={selectedValue}
                // selectedKeys={[selectedValue] as Key[]}
                onSelectionChange={handleValueChange}
                // labelPlacement="outside"
                label="Value"
              >
                {(item) => (
                  <ListboxItem key={item} value={item} textValue={item.toString()}>
                    {item.toString()}
                  </ListboxItem>
                )}
              </Listbox>
            )}
          </div>
        </>
      )} */}
      <div className="flex flex-col items-center gap-2">
        {currentSelectionLabel && (
          <Chip variant="bordered" color="secondary">
            {currentSelectionLabel}
          </Chip>
        )}
        <Button
          onPress={addFilterToQuery}
          isDisabled={!canAddFilter}
          color="primary"
          variant="flat"
        >
          Add Filter
        </Button>
      </div>

      <div className="col-span-full">
        {activeFiltersContent}
      </div>
    </div>
  );
};

export default GameEventFilter;
