"use client";

import type { InputProps, SelectProps } from "@nextui-org/react";

import React from "react";
import { Input, Radio, RadioGroup, Select, SelectItem, Spacer } from "@nextui-org/react";
import { cn } from "@nextui-org/react";

import companyTypes from "./company-types";
import states from "./states";
import companyIndustries from "./company-industries";
import { title } from "../primitives";

import { useTheme } from "next-themes";

import { DateRangePicker } from "@nextui-org/react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import BattleButton from "../filters/ctas/material-button/battle-button";
import { PlusIcon } from "../icons";

export type ScheduleInformationFormProps = React.HTMLAttributes<HTMLFormElement>;

export const CustomRadio = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary",
        ),
      }}
    >
      {children}
    </Radio>
  );
};

const ScheduleInformationForm = React.forwardRef<HTMLFormElement, ScheduleInformationFormProps>(
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

    const now = new Date()

    let [date, setDate] = React.useState({
      start: parseAbsoluteToLocal(now.toISOString()),
      end: parseAbsoluteToLocal(new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()),
    });

    const selectProps: Pick<SelectProps, "labelPlacement" | "classNames"> = {
      labelPlacement: "outside",
      classNames: {
        label: "text-small font-medium text-default-700 group-data-[filled=true]:text-default-700",
      },
    };

    return (
      <>
        <h1 className={title({ color: theme === "dark" ? "foreground" : "battleNavy" })}>Schedule Preferences</h1>
        <div className="py-4 text-default-500">
          Please provide your available time slots and preferred schedule
        </div>
        <div className="w-full  h-[200px]  font-bold flex flex-col items-center justify-center text-center">

          {/* <form
            ref={ref}
            className={cn("w-full  h-[200px]   font-bold  flex items-center justify-center text-center", className)}
            {...props}
          > */}

            <div className="w-full h-full  font-bold  flex-col items-center justify-center text-center">
              <I18nProvider locale="ja-JP">
                <DateRangePicker label="Available Time Window" value={date} onChange={setDate} />
              </I18nProvider>

              <Spacer y={2} />

              <BattleButton>Add more...</BattleButton>

              {/* <Spacer y={2} />

              <I18nProvider locale="ja-JP">
                <DateRangePicker label="Available Time Window" value={date} onChange={setDate} />
              </I18nProvider>

              <Spacer y={2} />

              <I18nProvider locale="ja-JP">
                <DateRangePicker label="Available Time Window" value={date} onChange={setDate} />
              </I18nProvider> */}

            
            </div>

          {/* </form> */}
        </div>
      </>
    );
  },
);

ScheduleInformationForm.displayName = "ScheduleInformationForm";

export default ScheduleInformationForm;
