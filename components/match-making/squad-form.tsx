"use client";

import type { InputProps } from "@nextui-org/react";

import React from "react";
import { Input, Checkbox, Link, Spacer, Card, Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import { cn } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { SearchIcon } from "../icons";
import { title } from "../primitives";
import { useTheme } from "next-themes";

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

    let { theme } = useTheme();

    if (!theme || theme === "system") {
      theme = "light";
    }

    const defaultContent =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";



    return (
      <>
        <div className="w-full text-3xl font-bold leading-9 text-default-foreground flex items-center justify-center">

          <h1 className={title({ color: theme === "dark" ? "foreground" : "battleNavy" })}>Setup your Squad</h1>
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
              Don&lsquo;t have a team yet?
              <Link className="ml-2 text-secondary underline" href="#" size="md">
                Create a new team
              </Link>
            </div>
          </Card>

          {/* <div id="div-squads" className="flex flex-col gap-4 w-full">
            <Accordion selectionMode="multiple">
              <AccordionItem
                key="1"
                aria-label="Chung Miller"
                startContent={
                  <Avatar
                    isBordered
                    color="primary"
                    radius="lg"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                  />
                }
                subtitle="4 unread messages"
                title="Chung Miller"
              >
                {defaultContent}
              </AccordionItem>
              <AccordionItem
                key="2"
                aria-label="Janelle Lenard"
                startContent={
                  <Avatar
                    isBordered
                    color="success"
                    radius="lg"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  />
                }
                subtitle="3 incompleted steps"
                title="Janelle Lenard"
              >
                {defaultContent}
              </AccordionItem>
              <AccordionItem
                key="3"
                aria-label="Zoey Lang"
                startContent={
                  <Avatar
                    isBordered
                    color="warning"
                    radius="lg"
                    src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                  />
                }
                subtitle={
                  <p className="flex">
                    2 issues to<span className="text-primary ml-1">fix now</span>
                  </p>
                }
                title="Zoey Lang"
              >
                {defaultContent}
              </AccordionItem>
            </Accordion>

          </div> */}


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
