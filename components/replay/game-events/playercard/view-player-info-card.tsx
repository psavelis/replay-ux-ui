import React from "react";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Spacer } from "@nextui-org/react";

export const ViewPayerInfoCard = () => {
  const [isWatching, setIsWatching] = React.useState(false);

  return (
    <Card shadow="none" className="max-w-[300px] border-none bg-transparent">
      <CardHeader className="justify-between">
        <div className="flex gap-3">
        {/* src="https://i.pravatar.cc/150?u=a04258114e29026702d" */}
          <Avatar isBordered radius="full" size="md"  /> 
          <div className="flex flex-col items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">Player3</h4>
            <h5 className="text-small tracking-tight text-default-500">@muy_loco_13</h5>
          </div>
        </div>
        <Spacer x={10}/>
        <Button
          className={!isWatching ? "bg-transparent text-foreground border-default-200" : "bg-gradient-to-tr from-pink-500 to-red-500 text-white"}
          radius="full"
          size="sm"
          variant={!isWatching ? "bordered" : "solid"}
          onPress={() => setIsWatching(!isWatching)}
        >
          {!isWatching ? "Watch" : "Watching"}
        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0">
        <p className="text-small pl-px text-default-500">
          PRO Player at TeamB
        </p>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">4</p>
          <p className=" text-default-500 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">97.1K</p>
          <p className="text-default-500 text-small">Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ViewPayerInfoCard