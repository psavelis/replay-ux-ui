"use client";

import type { InputProps } from "@nextui-org/react";

import React from "react";
import { Input, Checkbox, Link, Spacer, Card } from "@nextui-org/react";
import { cn } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { SearchIcon } from "../icons";

export type SignUpFormProps = React.HTMLAttributes<HTMLFormElement>;

const SignUpForm = React.forwardRef<HTMLFormElement, SignUpFormProps>(
  ({ className, ...props }, ref) => {
    const inputProps: Pick<InputProps, "labelPlacement" | "classNames"> = {
      labelPlacement: "outside",
      classNames: {
        label:
          "text-small font-medium text-default-700 group-data-[filled-within=true]:text-default-700",
      },
    };

    return (
      <>
        <div className="w-full text-3xl font-bold leading-9 text-default-foreground flex items-center justify-center">
          Setup your Squad
        </div>
        <div className="py-2 text-medium text-default-500">
          Choose a team or pick your friends to play with.

        </div>
        <form
          ref={ref}
          {...props}
          className={cn("flex grid grid-cols-12 flex-col gap-4 py-8", className)}
        >
          <Input
            startContent={
              <div>
                <Icon className="text-default-500" icon="solar:users-group-two-rounded-outline" width={32} />
                <Spacer x={5} />
              </div>
            }
            endContent={
              <SearchIcon />
            }
            className="col-span-12"
            // label="Nickname"
            name="nickname"
            placeholder="Type to search for your friends or team"
            {...inputProps}
          />
                    <Card className="col-span-12 m-0 p-2 text-center">
            <div className="col-span-12 m-0 p-2 text-center">
              Don't have a team yet?
              <Link className="ml-2 text-secondary underline" href="#" size="md">
                Create a new team
              </Link>
            </div>
          </Card>

          <Spacer y={32} />



          <Checkbox
            defaultSelected
            className="col-span-12 m-0 p-2 text-left"
            color="secondary"
            name="terms-and-privacy-agreement"
            size="md"
          >
            I read and agree with the
            <Link className="mx-1 text-secondary underline" href="#" size="md">
              Terms
            </Link>
            <span>and</span>
            <Link className="ml-1 text-secondary underline" href="#" size="md">
              Privacy Policy
            </Link>
            .
          </Checkbox>
        </form>
      </>
    );
  },
);

SignUpForm.displayName = "SignUpForm";

export default SignUpForm;
