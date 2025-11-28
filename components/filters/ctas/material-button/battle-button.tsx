import React from "react";
import { Button } from "@nextui-org/react";
import clsx from "clsx";

interface BattleButtonProps extends React.ComponentProps<typeof Button> {
  children?: React.ReactNode;
}

export default function BattleButton({ className, children, ...props }: BattleButtonProps) {
  return (
    <Button
      {...props}
      className={clsx("battle-button", className)}
    >
      {children}
    </Button>
  );
}
