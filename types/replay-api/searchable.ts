export enum MapViewModeType {
    MapStrategiesLayer = 'strategies-layer', // TODO: review term
    MapRegionsLayer = 'area-regions-layer',
    MapTrajectoriesLayer = 'trajectories-layer',
    MapProjectilesLayer = 'projectiles-layer',
    MapFragsLayer = 'frags-layer',
    MapHeatmapLayer = 'heatmap-layer',
}

export type UUIDParams = string | string[]

export interface TickRange {
    start: string;
    end: string;
}

export interface DateRange {
    start: string;
    end: string;
}

// common aggregate types
// common aggregate types
// common aggregate types
export interface RoundData {
  roundNumber: number;
  winner: "ct" | "t" | null; // Add winner information
  keyEvents: string[]; // Array to store key events in the round
  current?: boolean | null | undefined; // Add current round information
  currentTeam?: "ct" | "t" | null | undefined;
}

export interface MapRegionData {
}



// TODO: convert to table-data (persist/config on replay side)
// TODO: create pkg and import from common.Searchable
export interface CSFilters {
    gameIds?: UUIDParams
    teamIds?: UUIDParams
    playerIds?: UUIDParams
    replayFiles?: UUIDParams
    matchIds?: UUIDParams
    roundNumbers?: UUIDParams

    groups?: UUIDParams
    sideIds?: UUIDParams // Sides CT/T

    tickRanges?: TickRange[] | null
    events?: UUIDParams
    items?: UUIDParams
    itemTypes?: UUIDParams
    projectiles?: UUIDParams
    projectileTypes?: UUIDParams
    maps?: UUIDParams
    areas?: UUIDParams
    networks?: UUIDParams
    objectives?: UUIDParams
    frags?: UUIDParams
    fragTypes?: UUIDParams
    textSearch?: string[] | null
    strategyType?: UUIDParams
    countries?: UUIDParams
    regions?: UUIDParams
    cities?: UUIDParams
    languages?: UUIDParams
    playerRoles?: UUIDParams
    hitBoxLocations?: Array<"head" | "body" | "legs" | "arms" | "all"> | null
    hitTypes?: Array<"flick" | "scoped" | "no-scope" | "arms" | "all"> | null
    penetrationLevels?: Array<"wallbang" | "through" | "direct" | "all"> | null
    hitStageTypes?: Array<"entry" | "entry-progress" | "trade" | "trade-progress" | "trade-frag-last-hit" | "entry-frag-last-hit" | "all"> | null
    angleTypes?: Array<"scope" | "no-scope" | "wide" | "narrow" | "all"> | null
    conVars?: UUIDParams // ie: maxPlayers etc
    gameModes?: "ranked" | "competitive" | "casual" | "deathmatch" | "wingman" | "retake" | "custom" | "tournament" | "challenge" | "all" | null
    gameRules?: UUIDParams
    economicStatus?: UUIDParams
    roundEndReasons?: UUIDParams
    mVPReasons?: UUIDParams
    resourceTypes?: "official" | "verified" | "unverified" | "all" | null
    resourceStatus?: "active" | "pending" | "draft" | "deleted" | "error" | "all" | null
    resourceVisibilities?: "public" | "private" | "shared" | "unlisted" | "all" | null
    resourceOwners?: UUIDParams
    dateRanges?: DateRange[] | null
    playerCfgProps?: Record<string, any> | null
    errors?: string[] | null
}

// TODO: mover p/ common (persistir)
export const EmptyFilter: CSFilters = {
    replayFiles: null,
    matchIds: null,
    roundNumbers: null,
    playerIds: null,
    teamIds: null,
    sideIds: null,
    groups: null,
    tickRanges: null,
    events: null,
    items: null,
    itemTypes: null,
    projectiles: null,
    projectileTypes: null,
    maps: null,
    areas: null,
    networks: null,
    objectives: null,
    frags: null,
    fragTypes: null,
    textSearch: null,
    strategyType: null,
    countries: null,
    regions: null,
    cities: null,
    languages: null,
    playerRoles: null,
    hitBoxLocations: null,
    hitTypes: null,
    penetrationLevels: null,
    hitStageTypes: null,
    angleTypes: null,
    conVars: null,
    gameModes: null,
    gameRules: null,
    economicStatus: null,
    roundEndReasons: null,
    mVPReasons: null,
    resourceTypes: null,
    resourceStatus: null,
    resourceVisibilities: null,
    resourceOwners: null,
    dateRanges: null,
    playerCfgProps: null,
    errors: null,
}

export interface ReplayPageProps {
    filter: CSFilters,
    size: number,
    mapViewModes: MapViewModeType[],
}
