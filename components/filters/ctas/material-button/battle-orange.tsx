import React from "react";
import {Button} from "@nextui-org/react";

export default function App(props: any) {
  return (
    <div>
        <Button  radius="full" style={{ borderColor: "#DCFF37", borderStyle: "solid", borderWidth: "2px", fontWeight: "bold", color: "#F2F2F2"}} {...props}  className="bg-gradient-to-tr from-pink-500 via-orange-500 to-yellow-500"  />
    </div>
  );
}
