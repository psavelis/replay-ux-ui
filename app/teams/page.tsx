"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type {Team, Squad} from "@/components/teams/team-card/App";

import {
  Button,
  Spacer,
  Input,
  Select,
  SelectItem,
  Spinner,
  Card,
  CardBody,
} from "@nextui-org/react";

import TeamCard from "@/components/teams/team-card/App";
import { SearchIcon, UserIcon } from "@/components/icons";
import { Icon } from "@iconify/react";
import LaunchYourSquadButton from "@/components/teams/team-form/launch-your-squad-button";
import ApplyNowButton from "@/components/players/player-form/apply-now-button";
import { ReplayAPISDK } from "@/types/replay-api/sdk";
import { ReplayApiSettingsMock } from "@/types/replay-api/settings";
import { logger } from "@/lib/logger";

const sdk = new ReplayAPISDK(ReplayApiSettingsMock, logger);

const Teams: Team[] = [
  {
    name: "Et3rn1ty*",
    avatar: "https://avatars.githubusercontent.com/u/168373383",
    tag: "ETNY",
    squad: {
        title: "CS 1.5",
        description: "Legacy counter-strike players from the early 2000s.",
        members: [
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
        ],
    },
    bio: "Legacy counter-strike players from the early 2000s.",
    social: {
      twitter: "@et3rn1ty-clan",
      linkedin: "@et3rn1ty-clan",
      github: "@et3rn1ty-clan",
    },
  },
  {
    name: "1337gg",
    avatar: "https://avatars.githubusercontent.com/u/168373383",
    tag: "1337",
    squad: {
        title: "CS:2",
        description: "Counter-Strike 2",
        members: [
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
        ],
    },
    bio: "Our Featured Elite Counter-Strike players. The dream team sponsored by LeetGamingPRO.",
    social: {
      twitter: "@1337gamingpro",
      linkedin: "@1337gamingpro",
      github: "@1337gamingpro",
    },
  },
  {
    name: "M14UZ*",
    avatar: "https://avatars.githubusercontent.com/u/168373383",
    tag: "M14U",
    squad: {
        title: "VLRNT",
        description: "Valorant",
        members: [
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
        ],
    },
    bio: "Lets have some fun and play some Valorant.",
    social: {
      twitter: "@m14uz1nh0s",
      linkedin: "m14uz1nh0s",
      github: "@m14uz1nh0s",
    },
  },
  {
    name: "HOLYvESSELS",
    avatar: "https://avatars.githubusercontent.com/u/168373383",
    tag: "HVVS",
    squad: {
        title: "Warframe",
        description: "Warframe",
        members: [
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
          {
            nickname: "et3rn1ty",
            avatar: "https://avatars.githubusercontent.com/u/168373383",
          },
        ],
    },
    bio: "...",
    social: {
      twitter: "@x",
      linkedin: "x",
      github: "@x",
    },
  },
];

export default function Component() {
  const { data: session } = useSession();
  const [squads, setSquads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [gameFilter, setGameFilter] = useState("all");

  useEffect(() => {
    async function fetchSquads() {
      try {
        setLoading(true);
        setError(null);
        
        const filters: any = {};
        if (gameFilter !== "all") {
          filters.game_id = gameFilter;
        }
        if (searchQuery) {
          filters.name = searchQuery;
        }

        const squadsData = await sdk.squads.searchSquads(filters);
        setSquads(squadsData || []);
      } catch (err: any) {
        logger.error("Failed to fetch squads", err);
        setError(err.message || "Failed to load squads");
      } finally {
        setLoading(false);
      }
    }

    fetchSquads();
  }, [gameFilter, searchQuery]);

  // Convert SDK squads to Team format for existing components
  const teamsFromSquads: Team[] = squads.map((squad: any) => ({
    name: squad.name,
    avatar: squad.logo_uri || "https://avatars.githubusercontent.com/u/168373383",
    tag: squad.symbol || squad.name.slice(0, 4).toUpperCase(),
    squad: {
      title: squad.game_id?.toUpperCase() || "CS2",
      description: squad.description || "",
      members: squad.members?.map((m: any) => ({
        nickname: m.nickname || m.name,
        avatar: m.avatar_uri || "https://i.pravatar.cc/150",
      })) || [],
    },
    bio: squad.description || "",
    social: {
      twitter: `@${squad.name}`,
      linkedin: squad.name,
      github: `@${squad.name}`,
    },
  }));

  return (
    <section className="flex w-full flex-col items-center py-8">
      <div className="flex max-w-xl flex-col text-center">
        <h2 className="font-medium text-secondary dark:text-primary">Featured Leet Teams</h2>
        <h1 className="text-4xl font-medium tracking-tight">Browse Teams</h1>
        <Spacer y={4} />
        <h2 className="text-xl text-default-600">
          Our philosophy is to help build exceptional teams and empower them to achieve greatness.
        </h2>
        <Spacer y={4} />
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row w-full justify-center gap-2 mb-4">
          <Input
            placeholder="Search squads..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<SearchIcon size={16} />}
            className="max-w-xs"
            variant="bordered"
          />
          <Select
            placeholder="Game"
            selectedKeys={[gameFilter]}
            onChange={(e) => setGameFilter(e.target.value)}
            className="max-w-xs"
            variant="bordered"
          >
            <SelectItem key="all" value="all">All Games</SelectItem>
            <SelectItem key="cs2" value="cs2">CS2</SelectItem>
            <SelectItem key="csgo" value="csgo">CS:GO</SelectItem>
            <SelectItem key="valorant" value="valorant">Valorant</SelectItem>
          </Select>
        </div>

        <div className="flex w-full justify-center gap-2">
          <ApplyNowButton />
          <LaunchYourSquadButton />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-12 w-full flex justify-center">
          <Spinner size="lg" label="Loading squads..." color="primary" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="mt-12 max-w-md">
          <CardBody className="text-center">
            <Icon icon="mdi:alert-circle" className="text-danger mx-auto mb-4" width={48} />
            <p className="text-danger font-semibold mb-2">Error loading squads</p>
            <p className="text-default-500 mb-4">{error}</p>
            <Button color="primary" onPress={() => window.location.reload()}>
              Retry
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && teamsFromSquads.length === 0 && (
        <Card className="mt-12 max-w-md">
          <CardBody className="text-center">
            <Icon icon="mdi:account-group" className="text-default-300 mx-auto mb-4" width={48} />
            <p className="text-default-500 mb-4">No squads found</p>
            <LaunchYourSquadButton />
          </CardBody>
        </Card>
      )}

      {/* Teams Grid */}
      {!loading && !error && teamsFromSquads.length > 0 && (
        <div className="mt-12 grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {teamsFromSquads.map((team: Team, index) => (
            <TeamCard key={`${team.tag}-${index}`} {...team} />
          ))}
        </div>
      )}

      {/* Fallback to mock data if needed */}
      {!loading && !error && squads.length === 0 && Teams.length > 0 && (
        <>
          <Spacer y={8} />
          <div className="w-full max-w-xl">
            <p className="text-center text-sm text-default-400 mb-4">
              Showing featured teams (real-time data unavailable)
            </p>
          </div>
          <div className="mt-4 grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Teams.map((team: Team, index) => (
              <TeamCard key={`fallback-${team.tag}-${index}`} {...team} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
