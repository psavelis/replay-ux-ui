"use client";

import type {InputProps, SelectProps} from "@nextui-org/react";

import React from "react";
import {Input, Select, SelectItem} from "@nextui-org/react";
import {cn} from "@nextui-org/react";

import companyTypes from "./company-types";
import states from "./states";
import companyIndustries from "./company-industries";
import { title } from "../primitives";

import { useTheme } from "next-themes";

export type ScheduleInformationFormProps = React.HTMLAttributes<HTMLFormElement>;

const ScheduleInformationForm = React.forwardRef<HTMLFormElement, ScheduleInformationFormProps>(
  ({className, ...props}, ref) => {
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

    const selectProps: Pick<SelectProps, "labelPlacement" | "classNames"> = {
      labelPlacement: "outside",
      classNames: {
        label: "text-small font-medium text-default-700 group-data-[filled=true]:text-default-700",
      },
    };

    return (
      <>
         <h1 className={title({color: theme === "dark" ? "foreground" : "battleNavy"})}>Schedule Preferences</h1>
        <div className="py-4 text-default-500">
          Please provide your available time slots and preferred schedule
        </div>
        <form
          ref={ref}
          className={cn("flex grid grid-cols-12 flex-col gap-4 py-8", className)}
          {...props}
        >


         
        </form>
      </>
    );
  },
);

ScheduleInformationForm.displayName = "ScheduleInformationForm";

export default ScheduleInformationForm;
