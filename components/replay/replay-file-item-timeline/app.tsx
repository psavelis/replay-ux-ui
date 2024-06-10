import React from "react";
import { Icon } from "@iconify/react";
import { cn } from "./cn";
import TimelineWinnerCard from './winner-card';
import { RoundData } from './types';


interface MatchTimelineProps {
  rounds: RoundData[]
}

export default function MatchTimeline({ rounds }: MatchTimelineProps) {
  const getConditionalCard = (round: RoundData, side: string) => {
    const borderLocation = round.winner === "ct" ? "borderTop" : "borderBottom"
    const color = round.winner === "ct" ? "hsl(var(--nextui-primary-500))" : "hsl(var(--nextui-warning-500))"
    const borderWidth = "7px"

    if (round.winner === side) {
      return (<TimelineWinnerCard roundData={round} />)
    }

    return (<div className={"flex items-center justify-center w-full h-8"} style={{
      borderColor: color,
      [`${borderLocation}Color`]: color,
      [`${borderLocation}Width`]: borderWidth,
      [`${borderLocation}Style`]: "solid",
    }} ></div>)
  }

  const getConditionalClassName = (round: RoundData) => {
    if (round.winner === "ct") {
      return "primary"
    } else {
      return "warning"
    }
  }

  return (
    <div className="relative w-full overflow-x-auto"> {/* Container for horizontal scrolling */}
      <div className="flex w-md"> {/* Flexible inner container */}

        <div className="flex">
          {rounds.map((round, index: number) => (
            <div key={index} className={`flex flex-col w-8`} style={{
              marginLeft: "0.1rem",
              marginRight: "0.1rem",
            }}>
              <div  className="flex flex-col w-8">
                <div className="w-8">
                  {getConditionalCard(round, "ct")}
                  {/* {getConditionalCard(round, "ct")} */}
                </div>
                {/* {index < rounds.length - 1 && (
              <div className={`h-1 border-t border-${getConditionalClassName} w-20 mx-auto`}>
                  {round.winner}
              </div> 
            )} */}
                
                <div className="w-8">
                  {getConditionalCard(round, "t")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
