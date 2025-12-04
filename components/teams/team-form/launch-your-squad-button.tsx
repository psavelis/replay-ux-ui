"use client";

import React, { useState, useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  Chip,
  SelectItem,
  Avatar,
  Textarea,
  Tabs,
  Tab,
  Spinner,
} from "@nextui-org/react";
import { Form } from "@nextui-org/form";
import { Icon } from "@iconify/react";
import AvatarUploader from "@/components/avatar/avatar-uploader";
import PlayerSearchInput from "@/components/players/player-search-input/player-search-modal";
import { useSession } from "next-auth/react";
import { SquadApiClient } from "@/types/replay-api/squad-api.client";
import { GameIDKey, VisibilityType, CreateSquadRequest } from "@/types/replay-api/entities.types";
import { logger } from "@/lib/logger";

const games = [
  { id: GameIDKey.CounterStrike2, name: "Counter-Strike 2", icon: "https://avatars.githubusercontent.com/u/168373383" },
  { id: GameIDKey.Valorant, name: "Valorant", icon: "https://avatars.githubusercontent.com/u/168373383" },
  { id: GameIDKey.LeagueOfLegends, name: "League of Legends", icon: "https://avatars.githubusercontent.com/u/168373383" },
  { id: GameIDKey.Dota2, name: "Dota 2", icon: "https://avatars.githubusercontent.com/u/168373383" },
];

export default function App() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { data: session } = useSession();
  const [displayName, setDisplayName] = useState("");
  const [slug, setSlug] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGame, setSelectedGame] = useState<GameIDKey | null>(null);
  const [visibility, setVisibility] = useState<VisibilityType>(VisibilityType.Public);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const squadApiClient = useMemo(() => new SquadApiClient({ logger }), []);

  const handleOpen = () => {
    if (!session) {
      window.location.href = '/signin';
    } else {
      onOpen();
    }
  };

  const resetForm = () => {
    setDisplayName("");
    setSlug("");
    setSymbol("");
    setDescription("");
    setSelectedGame(null);
    setVisibility(VisibilityType.Public);
    setAvatarFile(null);
    setError(null);
    setSuccessMessage(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      setError("Please sign in to create a squad");
      return;
    }

    if (!selectedGame) {
      setError("Please select a game");
      return;
    }

    if (!displayName.trim()) {
      setError("Please enter a display name");
      return;
    }

    if (!symbol.trim()) {
      setError("Please enter a tag/symbol");
      return;
    }

    if (symbol.length > 4) {
      setError("Tag must be at most 4 characters");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const request: CreateSquadRequest = {
        game_id: selectedGame,
        name: displayName.trim(),
        symbol: symbol.trim().toUpperCase(),
        description: description.trim() || undefined,
        visibility: visibility,
      };

      const authToken = (session as unknown as { accessToken?: string }).accessToken || "";

      const result = await squadApiClient.createSquad(request, authToken);

      if (result) {
        setSuccessMessage(`Squad "${result.name}" created successfully!`);
        setTimeout(() => {
          resetForm();
          onClose();
        }, 1500);
      } else {
        setError("Failed to create squad. Please try again.");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      logger.error("Failed to create squad", err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayName(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
    const initials = value
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 4);
    setSymbol(initials);
  };

  const handleGameSelection = (keys: "all" | Set<React.Key>) => {
    if (keys === "all") return;
    const selected = Array.from(keys)[0] as GameIDKey;
    setSelectedGame(selected || null);
  };

  const handleVisibilitySelection = (keys: "all" | Set<React.Key>) => {
    if (keys === "all") return;
    const selected = Array.from(keys)[0] as VisibilityType;
    setVisibility(selected || VisibilityType.Public);
  };

  return (
    <>
      <Button onPress={handleOpen} startContent={<Icon icon="solar:users-group-two-rounded-outline" width={18} />} color="primary" variant="ghost">Launch Your Squad</Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onModalClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Team</ModalHeader>
              <ModalBody>
                {successMessage && (
                  <div className="bg-success-100 text-success-700 p-3 rounded-lg mb-4">
                    {successMessage}
                  </div>
                )}
                {error && (
                  <div className="bg-danger-100 text-danger-700 p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                <Tabs
                  aria-label="Squad Creation Tabs"
                  classNames={{
                    tabList: "w-full relative rounded-none p-0 gap-4 lg:gap-6",
                    tab: "max-w-fit px-0 h-12",
                    cursor: "w-full",
                    tabContent: "text-default-400",
                  }}
                  radius="full"
                  variant="underlined"
                >
                  <Tab
                    key="details"
                    title="Details"
                  >
                    <Form className="w-full" validationBehavior="native" onSubmit={onSubmit}>
                      <div className="flex w-full gap-4 items-center pb-4">
                        <Select
                          classNames={{
                            trigger: "min-h-12 py-2",
                          }}
                          isMultiline={true}
                          items={games}
                          placeholder="Select a game"
                          isRequired
                          isDisabled={isSubmitting}
                          selectedKeys={selectedGame ? new Set([selectedGame]) : new Set()}
                          onSelectionChange={handleGameSelection}
                          renderValue={(items) => {
                            return (
                              <div className="flex flex-wrap gap-2">
                                {items.map((item) => (
                                  <Chip key={item.key}>{item.data!.name}</Chip>
                                ))}
                              </div>
                            );
                          }}
                          selectionMode="single"
                          variant="bordered"
                        >
                          {(game) => (
                            <SelectItem key={game.id} textValue={game.name}>
                              <div className="flex gap-2 items-center">
                                <Avatar alt={game.name} className="flex-shrink-0" size="md" src={game.icon} />
                                <div className="flex flex-col">
                                  <span className="text-small">{game.name}</span>
                                </div>
                              </div>
                            </SelectItem>
                          )}
                        </Select>
                      </div>
                      <div className="flex w-full gap-4">
                        <div className="flex flex-col gap-1 w-1/2">
                          <AvatarUploader onUpload={(file) => setAvatarFile(file)} />
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                          <Input
                            startContent={<span className="text-default-400 pr-2">@</span>}
                            isRequired
                            label="Display Name"
                            labelPlacement="outside"
                            name="display_name"
                            placeholder=""
                            type="text"
                            value={displayName}
                            onChange={handleDisplayNameChange}
                            isDisabled={isSubmitting}
                          />
                          <Input
                            startContent={<span className="text-default-400 pr-4">/</span>}
                            isRequired
                            label="URL"
                            labelPlacement="outside"
                            name="slug"
                            placeholder=""
                            type="text"
                            value={slug}
                            readOnly
                          />

                          <Input
                            startContent={<span className="text-default-400 pr-4">#</span>}
                            isRequired
                            label="Tag"
                            labelPlacement="outside"
                            name="symbol"
                            placeholder=""
                            type="text"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value.toUpperCase().slice(0, 4))}
                            isDisabled={isSubmitting}
                            validate={(value) => {
                              if (value.length > 4) {
                                return "Tag must be at most 4 characters long";
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex w-full pt-2">
                        <Textarea
                          className="w-full"
                          label="Bio"
                          placeholder="Enter your squad description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          isDisabled={isSubmitting}
                        />
                      </div>
                      <div className="flex w-full pt-2">
                        <Select
                          variant="bordered"
                          label="Visibility"
                          placeholder="Select visibility"
                          isDisabled={isSubmitting}
                          selectedKeys={new Set([visibility])}
                          onSelectionChange={handleVisibilitySelection}
                        >
                          <SelectItem key={VisibilityType.Public} textValue="Public">
                            <div className="flex items-center gap-2">
                              <Icon icon="mdi:earth" />
                              Public (Default)
                            </div>
                          </SelectItem>
                          <SelectItem key={VisibilityType.Private} textValue="Private">
                            <div className="flex items-center gap-2">
                              <Icon icon="mdi:lock" />
                              Private
                            </div>
                          </SelectItem>
                          <SelectItem key={VisibilityType.Restricted} textValue="Restricted">
                            <div className="flex items-center gap-2">
                              <Icon icon="mdi:account-group" />
                              Members Only
                            </div>
                          </SelectItem>
                        </Select>
                      </div>
                    </Form>
                  </Tab>
                  <Tab key="members" title="Members" >
                    <PlayerSearchInput />
                  </Tab>
                  <Tab key="preview" title="Preview"/>
                </Tabs>

              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onModalClose} isDisabled={isSubmitting}>
                  Close
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  onPress={onSubmit as unknown as () => void}
                  isDisabled={isSubmitting || !displayName.trim() || !selectedGame || !symbol.trim()}
                  startContent={isSubmitting ? <Spinner size="sm" color="current" /> : null}
                >
                  {isSubmitting ? "Creating..." : "Submit"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
