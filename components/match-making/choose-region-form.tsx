"use client";

import React from "react";
import { Checkbox, Link, RadioGroup, Radio, Spacer } from "@nextui-org/react";
import { cn } from "@nextui-org/react";

import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

export type ChooseRegionFormProps = React.HTMLAttributes<HTMLFormElement>;

const ChooseRegionForm = React.forwardRef<HTMLFormElement, ChooseRegionFormProps>(
  ({ className, ...props }, ref) => {
    const radioClassNames = {
      base: cn(
        "inline-flex m-0 bg-default-100 items-center justify-between",
        "flex-row-reverse w-full max-w-full cursor-pointer rounded-lg p-4 border-medium border-transparent",
        "data-[selected=true]:border-secondary",
      ),
      control: "bg-secondary text-secondary-foreground",
      wrapper: "group-data-[selected=true]:border-secondary",
      label: "text-small text-default-500 font-medium",
      labelWrapper: "m-0",
    };

    return (
      <>
        <div className="text-3xl font-bold leading-9 text-default-foreground">Choose Region</div>
        <div className="py-4 text-base leading-5 text-default-500">
          Selecting your region helps us provide you with the best possible experience
        </div>
        <form
          ref={ref}
          className={cn("flex grid grid-cols-12 flex-col py-8", className)}
          {...props}
        >
          <RadioGroup
            className="col-span-12"
            classNames={{
              wrapper: "gap-4",
            }}
            defaultValue="region1"
            name="region"
          >

            <div className="flex w-full flex-col">
              <Tabs aria-label="Options" className="w-full">
                <Tab key="north-america" title="North America">
                  <Card>
                    <CardBody>
                      {/* North America */}
                      <Radio classNames={radioClassNames} value="region7">
                        West US (Silicon Valley)
                      </Radio>
                      </CardBody>
                      </Card>
                      <Spacer y={1} />
                      <Card>
                      <CardBody>
                      <Radio classNames={radioClassNames} value="region8">
                        East US (Virginia)
                      </Radio>
                      </CardBody>
                      </Card>
                      <Spacer y={1} />
                      <Card>
                      <CardBody>
                      <Radio classNames={radioClassNames} value="region9">
                        North America (Toronto)
                      </Radio>
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="south-america" title="South America">
                  <Card>
                    <CardBody>
                      {/* Europe */}
                      <Radio classNames={radioClassNames} value="region11">
                        Brazil East (São Paulo)
                      </Radio>
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="europe" title="Europe">
                  <Card>
                    <CardBody>
                      {/* Europe */}
                      <Radio classNames={radioClassNames} value="region10">
                        Central Europe (Frankfurt)
                      </Radio>
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="asia" title="Asia Pacific">
                  <Card>
                    <CardBody>
                      {/* Asia Pacific */}
                      <Radio classNames={radioClassNames} value="region1">
                        South China (Guangzhou, Shenzhen)
                      </Radio>
                      </CardBody>
                      </Card>
                      <Spacer y={1} />
                      <Card>
                      <CardBody>
                      <Radio classNames={radioClassNames} value="region2">
                        North China (Beijing)
                      </Radio>
                      </CardBody>
                      </Card>
                      <Spacer y={1} />
                      <Card>
                      <CardBody>
                      <Radio classNames={radioClassNames} value="region3">
                        East China (Shanghai)
                      </Radio>
                      </CardBody>
                      </Card>
                      <Spacer y={1} />
                      <Card>
                      <CardBody>
                      <Radio classNames={radioClassNames} value="region4">
                        Southeast Asia (Singapore, Jakarta)
                      </Radio>
                      </CardBody>
                      </Card>
                      <Spacer y={1} />
                      <Card>
                      <CardBody>
                      <Radio classNames={radioClassNames} value="region5">
                        South Asia Pacific (Mumbai)
                      </Radio>
                      </CardBody>
                      </Card>
                      <Spacer y={1} />
                      <Card>
                      <CardBody>
                      <Radio classNames={radioClassNames} value="region6">
                        Northeast Asia (Seoul, Tokyo)
                      </Radio>
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>
            </div>
          </RadioGroup>

          <Checkbox
            defaultSelected
            className="col-span-12 mx-0 my-2 px-2 text-left"
            color="secondary"
            name="terms-and-privacy"
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

ChooseRegionForm.displayName = "ChooseRegionForm";

export default ChooseRegionForm;
