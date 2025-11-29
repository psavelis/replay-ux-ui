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

// Featured esports teams with realistic data
const Teams: Team[] = [
  {
    name: "Phoenix Rising",
    avatar: "https://i.pravatar.cc/150?img=68",
    tag: "PHNX",
    squad: {
      title: "CS2",
      description: "North American Counter-Strike 2 Champions",
      members: [
        { nickname: "Blaze", avatar: "https://i.pravatar.cc/150?img=11" },
        { nickname: "Frost", avatar: "https://i.pravatar.cc/150?img=12" },
        { nickname: "Storm", avatar: "https://i.pravatar.cc/150?img=13" },
        { nickname: "Shadow", avatar: "https://i.pravatar.cc/150?img=14" },
        { nickname: "Viper", avatar: "https://i.pravatar.cc/150?img=15" },
      ],
    },
    bio: "2024 NA Regional Champions. Known for aggressive playstyle and exceptional coordination. Currently ranked #3 in North America.",
    social: {
      twitter: "@PhoenixRisingGG",
      linkedin: "phoenixrisinggg",
      github: "@phoenixrising",
    },
  },
  {
    name: "Arctic Wolves",
    avatar: "https://i.pravatar.cc/150?img=52",
    tag: "ARWF",
    squad: {
      title: "CS2",
      description: "European Counter-Strike 2 Elite",
      members: [
        { nickname: "Glacier", avatar: "https://i.pravatar.cc/150?img=21" },
        { nickname: "Tundra", avatar: "https://i.pravatar.cc/150?img=22" },
        { nickname: "Polar", avatar: "https://i.pravatar.cc/150?img=23" },
        { nickname: "Avalanche", avatar: "https://i.pravatar.cc/150?img=24" },
        { nickname: "Frostbite", avatar: "https://i.pravatar.cc/150?img=25" },
      ],
    },
    bio: "EU powerhouse with a strategic approach. Winners of 3 major LAN events in 2024. Known for their incredible AWP plays.",
    social: {
      twitter: "@ArcticWolvesGG",
      linkedin: "arcticwolvesgg",
      github: "@arcticwolves",
    },
  },
  {
    name: "Neon Dynasty",
    avatar: "https://i.pravatar.cc/150?img=60",
    tag: "NEON",
    squad: {
      title: "Valorant",
      description: "APAC Valorant Masters",
      members: [
        { nickname: "Pulse", avatar: "https://i.pravatar.cc/150?img=31" },
        { nickname: "Circuit", avatar: "https://i.pravatar.cc/150?img=32" },
        { nickname: "Voltage", avatar: "https://i.pravatar.cc/150?img=33" },
        { nickname: "Spark", avatar: "https://i.pravatar.cc/150?img=34" },
        { nickname: "Amp", avatar: "https://i.pravatar.cc/150?img=35" },
      ],
    },
    bio: "Rising stars from the APAC region. Known for innovative agent compositions and clutch performances. VCT Challengers finalists.",
    social: {
      twitter: "@NeonDynastyGG",
      linkedin: "neondynasty",
      github: "@neondynasty",
    },
  },
  {
    name: "Shadow Legion",
    avatar: "https://i.pravatar.cc/150?img=57",
    tag: "SHDW",
    squad: {
      title: "Valorant",
      description: "Americas Valorant Elite",
      members: [
        { nickname: "Phantom", avatar: "https://i.pravatar.cc/150?img=41" },
        { nickname: "Specter", avatar: "https://i.pravatar.cc/150?img=42" },
        { nickname: "Wraith", avatar: "https://i.pravatar.cc/150?img=43" },
        { nickname: "Shade", avatar: "https://i.pravatar.cc/150?img=44" },
        { nickname: "Eclipse", avatar: "https://i.pravatar.cc/150?img=45" },
      ],
    },
    bio: "Tactical excellence meets raw mechanical skill. Multiple tournament wins across NA and SA regions. Masters in utility usage.",
    social: {
      twitter: "@ShadowLegionGG",
      linkedin: "shadowlegion",
      github: "@shadowlegion",
    },
  },
  {
    name: "Crimson Tide",
    avatar: "https://i.pravatar.cc/150?img=65",
    tag: "CRMS",
    squad: {
      title: "CS2",
      description: "LATAM Counter-Strike 2 Champions",
      members: [
        { nickname: "Inferno", avatar: "https://i.pravatar.cc/150?img=51" },
        { nickname: "Ember", avatar: "https://i.pravatar.cc/150?img=53" },
        { nickname: "Blitz", avatar: "https://i.pravatar.cc/150?img=54" },
        { nickname: "Thunder", avatar: "https://i.pravatar.cc/150?img=55" },
        { nickname: "Riot", avatar: "https://i.pravatar.cc/150?img=56" },
      ],
    },
    bio: "LATAM's pride. Explosive gameplay and passionate fanbase. 2024 South American Championship winners with an undefeated streak.",
    social: {
      twitter: "@CrimsonTideGG",
      linkedin: "crimsontidegg",
      github: "@crimsontide",
    },
  },
  {
    name: "Quantum Force",
    avatar: "https://i.pravatar.cc/150?img=67",
    tag: "QNTM",
    squad: {
      title: "Valorant",
      description: "EMEA Valorant Contenders",
      members: [
        { nickname: "Neutrino", avatar: "https://i.pravatar.cc/150?img=61" },
        { nickname: "Quark", avatar: "https://i.pravatar.cc/150?img=62" },
        { nickname: "Photon", avatar: "https://i.pravatar.cc/150?img=63" },
        { nickname: "Ion", avatar: "https://i.pravatar.cc/150?img=64" },
        { nickname: "Proton", avatar: "https://i.pravatar.cc/150?img=66" },
      ],
    },
    bio: "Precision meets creativity. This EMEA squad is known for unconventional strategies that catch opponents off-guard every time.",
    social: {
      twitter: "@QuantumForceGG",
      linkedin: "quantumforce",
      github: "@quantumforce",
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
