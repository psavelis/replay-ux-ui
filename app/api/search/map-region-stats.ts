import { ResultOptions, RouteBuilder } from "@/types/replay-api/replay-api.route-builder"
import { CSFilters } from "@/types/replay-api/searchable"
import { ReplayApiResourceType, ReplayApiSettingsMock } from "@/types/replay-api/settings"
import { Loggable, logger } from "@/lib/logger"
import { MapRegionStats } from "@/types/replay-api/stats.types"

const fetchMapRegionStats: MapRegionStats = async (filter: CSFilters, resultOptions?: ResultOptions): MapRegionData => {
  const builder = new RouteBuilder(ReplayApiSettingsMock, logger)

  const mapRegionData = await builder
    .withFilter(filter)
    .get(ReplayApiResourceType.MapRegionStats, resultOptions)


  return mapRegionData
}

