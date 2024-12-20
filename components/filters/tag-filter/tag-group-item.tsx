"use client";

import type {CheckboxProps} from "@nextui-org/react";

import React from "react";
import {Chip, VisuallyHidden, useCheckbox} from "@nextui-org/react";
import {Icon} from "@iconify/react";

import {cl} from "../cl";

export type TagGroupItemProps = Omit<CheckboxProps, "icon"> & {
  icon?: string;
};

const TagGroupItem = React.forwardRef<HTMLLabelElement, TagGroupItemProps>(
  ({icon, size = "md", ...props}, ref) => {
    const {children, isSelected, isFocusVisible, getBaseProps, getLabelProps, getInputProps} =
      useCheckbox({
        ...props,
      });

    return (
      <label {...getBaseProps()} ref={ref}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <Chip
          classNames={{
            base: cl({
              "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background": isFocusVisible,
              "bg-primary": isSelected,
            }),
            content: cl("!text-small text-default-400", {
              "text-primary-foreground": isSelected,
              "pr-1": !!icon,
            }),
          }}
          radius="sm"
          size={size}
          startContent={
            icon ? (
              <Icon
                className={cl("text-default-400", {
                  "text-primary-foreground": isSelected,
                })}
                icon={icon}
                width={16}
              />
            ) : undefined
          }
          variant="flat"
          {...getLabelProps()}
        >
          {children}
        </Chip>
      </label>
    );
  },
);

TagGroupItem.displayName = "TagGroupItem";

export default TagGroupItem;
