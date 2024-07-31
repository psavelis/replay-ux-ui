import { RouteBuilder } from "@/types/replay-api/replay-api.route-builder"
import { CSFilters } from "@/types/replay-api/searchable"
import { ReplayApiResourceType, ReplayApiSettingsMock } from "@/types/replay-api/settings"

export interface MapRegionStats {
  
}

const fetchMapRegionStats: MapRegionStats = async (csFilters: CSFilters) => {
  const builder: RouteBuilder<MapRegionStats> = new RouteBuilder<MapRegionStats>(ReplayApiSettingsMock, loggerMock)
    .withAction()

  const { gameIds, matchIds, roundNumbers, playerIds, teamIds } = csFilters;

  let endpoint = builder.forGame(gameIds![0]);

  if (teamIds?.length) {
    endpoint = builder.forTeam(teamIds![0]);
  } 

  if (playerIds?.length) {
    endpoint = builder.forPlayer(playerIds![0]);
  }   

  if (matchIds?.length) {
    endpoint = builder.forMatch(matchIds![0]);
  }

  if (roundNumbers?.length) {
    endpoint = builder.forRound(roundNumbers![0]);
  }

  const mapRegionStats = endpoint.get(ReplayApiResourceType.MapRegionStats)

  builder.

   





}

