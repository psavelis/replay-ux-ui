import React from "react";
import {Select, SelectItem} from "@nextui-org/react";
import { Avatar } from '@nextui-org/react';
import LeetGamingIcon from '@/components/logo/logo-icon';

const games = [
  {
    name: "Counter-Strike: 2",
    game_id: "cs2",
    label: "CS2",
    src: "/cs2/cs2-logo-icon.png"
  },
  // {
  //   name: "Counter-Strike: Global Offensive",
  //   game_id: "csgo",
  //   label: "CS:GO",
  //   src: "/csgo/csgologo.jpeg"
  // },
  // {
  //   name: "Valorant",
  //   game_id: "valorant",
  //   label: "VAL",
  //   src: "/vlrntlogo.png"
  // },
]

export default function App(params:any) {
  return (
    <Select
      label="Game"
      placeholder="Select a game"
      className="max-w-xs"
      defaultSelectedKeys={["cs2"]}
      {...params}
    >
      {games.map((game) => (
        
        <SelectItem key={game.game_id} value={game.game_id}
        aria-label={game.name}
          startContent={<Avatar isBordered radius="sm" src={game.src} />}
        >
          {game.name}
        </SelectItem>
      ))}
    </Select>
  );
}