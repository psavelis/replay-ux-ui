"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardBody, CardHeader, Progress, Spinner, Button, Chip } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { title } from "../primitives";

export interface MatchmakingUIState {
  queuePosition: number;
  totalQueueCount: number;
  estimatedWaitTime?: number;
  status: "searching" | "found" | "error" | "idle";
  matchId?: string;
}

export type ReviewConfirmFormProps = React.HTMLAttributes<HTMLFormElement> & {
  onMatchFound?: (matchId: string) => void;
  onCancel?: () => void;
};

const ReviewConfirmForm = React.forwardRef<HTMLFormElement, ReviewConfirmFormProps>(
  ({ className, onMatchFound, onCancel, ...props }, ref) => {
    let { theme } = useTheme();

    if (!theme || theme === "system") {
      theme = "light";
    }

    const [matchmakingState, setMatchmakingState] = useState<MatchmakingUIState>({
      queuePosition: 0,
      totalQueueCount: 0,
      status: "idle",
    });

    const [isSearching, setIsSearching] = useState(false);

    const startMatchmaking = useCallback(async () => {
      setIsSearching(true);
      setMatchmakingState({
        queuePosition: 0,
        totalQueueCount: 0,
        status: "searching",
      });

      // TODO: Replace with actual API call when backend endpoint is ready
      // const response = await fetch('/api/matchmaking/join', { method: 'POST' });
      // const data = await response.json();

      // Simulated queue entry - will be replaced with actual API integration
      setMatchmakingState({
        queuePosition: 1,
        totalQueueCount: 1,
        estimatedWaitTime: 60,
        status: "searching",
      });
    }, []);

    const cancelMatchmaking = useCallback(async () => {
      setIsSearching(false);
      setMatchmakingState({
        queuePosition: 0,
        totalQueueCount: 0,
        status: "idle",
      });
      onCancel?.();

      // TODO: Replace with actual API call when backend endpoint is ready
      // await fetch('/api/matchmaking/leave', { method: 'POST' });
    }, [onCancel]);

    useEffect(() => {
      if (!isSearching) return;

      const pollInterval = setInterval(async () => {
        // TODO: Replace with actual API polling when backend endpoint is ready
        // const response = await fetch('/api/matchmaking/status');
        // const data = await response.json();
        // setMatchmakingState({
        //   queuePosition: data.position,
        //   totalQueueCount: data.totalInQueue,
        //   estimatedWaitTime: data.estimatedWait,
        //   status: data.status,
        //   matchId: data.matchId,
        // });

        // Simulated polling response - will be replaced with actual API
        setMatchmakingState((prev) => ({
          ...prev,
          queuePosition: Math.max(1, prev.queuePosition),
          totalQueueCount: Math.max(prev.totalQueueCount, Math.floor(Math.random() * 10) + prev.totalQueueCount),
          estimatedWaitTime: Math.max(10, (prev.estimatedWaitTime || 60) - 5),
        }));
      }, 5000);

      return () => clearInterval(pollInterval);
    }, [isSearching]);

    useEffect(() => {
      if (matchmakingState.status === "found" && matchmakingState.matchId) {
        onMatchFound?.(matchmakingState.matchId);
      }
    }, [matchmakingState.status, matchmakingState.matchId, onMatchFound]);

    const queueProgressValue = matchmakingState.totalQueueCount > 0
      ? ((matchmakingState.totalQueueCount - matchmakingState.queuePosition + 1) / matchmakingState.totalQueueCount) * 100
      : 0;

    return (
      <>
        <h1 className={title({ color: theme === "dark" ? "foreground" : "battleNavy" })}>
          {isSearching ? "Finding Match" : "Ready to Battle"}
        </h1>
        <div className="py-4 text-default-500">
          {isSearching
            ? "Searching for worthy opponents..."
            : "Review your settings and enter the queue when ready"}
        </div>

        <Card className="w-full">
          <CardHeader className="flex flex-col items-center gap-2">
            {isSearching ? (
              <>
                <Spinner size="lg" color="warning" />
                <div className="text-lg font-semibold">Searching for Match</div>
              </>
            ) : (
              <>
                <Icon icon="solar:gamepad-bold" width={48} className="text-warning" />
                <div className="text-lg font-semibold">Queue Status</div>
              </>
            )}
          </CardHeader>
          <CardBody className="flex flex-col items-center gap-4">
            {isSearching ? (
              <>
                <div className="w-full flex flex-col gap-2">
                  <div className="flex justify-between text-small">
                    <span>Queue Position</span>
                    <Chip color="primary" variant="flat" size="sm">
                      {matchmakingState.queuePosition} of {matchmakingState.totalQueueCount}
                    </Chip>
                  </div>
                  <Progress
                    aria-label="Queue progress"
                    value={queueProgressValue}
                    className="w-full"
                    color="warning"
                    showValueLabel={false}
                    classNames={{
                      indicator: "bg-gradient-to-r from-amber-500 to-yellow-500",
                      track: "drop-shadow-md border border-default",
                    }}
                  />
                </div>

                <div className="w-full flex flex-col gap-2">
                  <div className="flex justify-between text-small">
                    <span>Players in Queue</span>
                    <Chip color="secondary" variant="flat" size="sm">
                      {matchmakingState.totalQueueCount}
                    </Chip>
                  </div>
                </div>

                {matchmakingState.estimatedWaitTime && (
                  <div className="w-full flex flex-col gap-2">
                    <div className="flex justify-between text-small">
                      <span>Estimated Wait</span>
                      <Chip color="default" variant="flat" size="sm">
                        ~{Math.ceil(matchmakingState.estimatedWaitTime / 60)} min
                      </Chip>
                    </div>
                  </div>
                )}

                <Button
                  color="danger"
                  variant="flat"
                  className="w-full mt-4"
                  onPress={cancelMatchmaking}
                  startContent={<Icon icon="solar:close-circle-bold" width={20} />}
                >
                  Cancel Search
                </Button>
              </>
            ) : (
              <>
                <div className="text-center text-default-500 py-4">
                  <Icon icon="solar:users-group-two-rounded-bold" width={32} className="mx-auto mb-2" />
                  <p>Press the button below to join the matchmaking queue</p>
                </div>

                <Button
                  color="warning"
                  variant="shadow"
                  className="w-full"
                  size="lg"
                  onPress={startMatchmaking}
                  startContent={<Icon icon="solar:play-bold" width={24} />}
                >
                  Find Match
                </Button>
              </>
            )}
          </CardBody>
        </Card>
      </>
    );
  }
);

ReviewConfirmForm.displayName = "ReviewConfirmForm";

export default ReviewConfirmForm;
