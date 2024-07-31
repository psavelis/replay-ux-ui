'use client'; // Make sure to enable Client Components for next/link

import DemoFilters from './filter';
import MatchTimeline from '@/components/replay/replay-file-item-timeline/match-h-timeline-sm';



export default function Uploads() {
  return (
    <div>
      <DemoFilters />
    <MatchTimeline rounds={[
        { roundNumber: 1, winner: "ct", keyEvents: ["Pistol round win"] },
        { roundNumber: 2, winner: "t", keyEvents: ["Clutch 1v3 by sound"] },
        { roundNumber: 3, winner: "ct", keyEvents: ["Clutch 1v3 by sound"] },
        { roundNumber: 4, winner: "t", keyEvents: [] },
        { roundNumber: 5, winner: "t", keyEvents: [] },
        { roundNumber: 6, winner: "ct", keyEvents: [] },
        { roundNumber: 7, winner: "ct", keyEvents: [] },
        { roundNumber: 8, winner: "ct", keyEvents: [] },
        { roundNumber: 9, winner: "ct", keyEvents: [] },
        { roundNumber: 10, winner: "ct", keyEvents: [] },
        { roundNumber: 11, winner: "ct", keyEvents: [] },
        { roundNumber: 12, winner: "ct", keyEvents: [] },
        { roundNumber: 13, winner: "ct", keyEvents: [] },
      ]} />
      </div>
  );
}
