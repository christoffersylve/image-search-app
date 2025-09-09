import { colorStyleMap, UnsplashColor } from "@/types/unsplash";
import React from "react";
import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "./ui/shadcn-io/tags";
import { CheckIcon } from "lucide-react";
import { unsplashColors } from "@/types/unsplash";
import { colorClassMap } from "@/types/unsplash";

const FilterOnColor = ({
  selectedColors,
  setSelectedColors,
  handleRemove,
  handleSelect,
}: {
  selectedColors: UnsplashColor[];
  setSelectedColors: React.Dispatch<React.SetStateAction<UnsplashColor[]>>;
  handleRemove: (value: UnsplashColor) => void;
  handleSelect: (value: UnsplashColor) => void;
}) => {
  return (
    <Tags className="max-w-sm mt-3">
      <TagsTrigger>
        {selectedColors.map((tag) => (
          <TagsValue
            key={tag}
            onRemove={() => handleRemove(tag)}
            style={colorStyleMap[tag]}
          >
            {unsplashColors.find((t) => t.id === tag)?.name}
          </TagsValue>
        ))}
      </TagsTrigger>
      <TagsContent>
        {/* <TagsInput placeholder="Search tag..." /> */}
        <button
          type="button"
          className="px-2 py-1 text-xs cursor-pointer mt-2"
          onClick={() => setSelectedColors([])}
        >
          Clear all
        </button>
        <TagsList>
          <TagsEmpty />
          <TagsGroup>
            {unsplashColors.map((tag) => (
              <TagsItem
                key={tag.id}
                onSelect={(id: string) => {
                  const color = unsplashColors.find((t) => t.id === id);
                  if (color) handleSelect(color.id);
                }}
                value={tag.id}
                onClick={() => console.log("ndsidhaos")}
              >
                {tag.name}
                {selectedColors.includes(tag.id) && (
                  <CheckIcon className="text-muted-foreground" size={14} />
                )}
              </TagsItem>
            ))}
          </TagsGroup>
        </TagsList>
      </TagsContent>
    </Tags>
  );
};

export default FilterOnColor;
