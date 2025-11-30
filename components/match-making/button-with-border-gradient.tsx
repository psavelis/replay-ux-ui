"use client";

import type {ButtonProps, LinkProps} from "@nextui-org/react";

import {Button} from "@nextui-org/react";
import Link from "next/link";

export type ButtonWithBorderGradientProps = ButtonProps &
  LinkProps & {
    background?: string;
  };

export const ButtonWithBorderGradient = ({
  children,
  background = "--nextui-background",
  style: styleProp,
  ...props
}: ButtonWithBorderGradientProps) => {
  const linearGradientBg = background?.startsWith("--") ? `hsl(var(${background}))` : background;

  // E-sports inspired gradient - purple to cyan
  const style = {
    border: "solid 2px transparent",
    backgroundImage: `linear-gradient(${linearGradientBg}, ${linearGradientBg}), linear-gradient(to right, #8B5CF6, #22D3EE)`,
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
  };

  return (
    <Button
      as={Link}
      href="#"
      {...props}
      className="font-bold uppercase tracking-wide hover:scale-105 transition-transform"
      style={{
        ...style,
        ...styleProp,
      }}
      type="submit"
    >
      {children}
    </Button>
  );
};
