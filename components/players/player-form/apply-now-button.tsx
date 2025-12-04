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
  Spacer,
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
  Spinner,
} from "@nextui-org/react";
import { Form } from "@nextui-org/form";
import { Icon } from "@iconify/react";
import AvatarUploader from "@/components/avatar/avatar-uploader";
import { UserIcon } from "@/components/icons";
import { useSession } from "next-auth/react";
import { PlayerApiClient } from "@/types/replay-api/player-api.client";
import { GameIDKey, VisibilityType, CreatePlayerProfileRequest } from "@/types/replay-api/entities.types";
import { logger } from "@/lib/logger";

const games = [
  { id: GameIDKey.CounterStrike2, name: "Counter-Strike 2", icon: "https://avatars.githubusercontent.com/u/168373383" },
  { id: GameIDKey.Valorant, name: "Valorant", icon: "https://avatars.githubusercontent.com/u/168373383" },
  { id: GameIDKey.LeagueOfLegends, name: "League of Legends", icon: "https://avatars.githubusercontent.com/u/168373383" },
  { id: GameIDKey.Dota2, name: "Dota 2", icon: "https://avatars.githubusercontent.com/u/168373383" },
];

const headingClasses = "flex w-full sticky top-1 z-10 py-1.5 px-2 pt-4 bg-default-100 shadow-small rounded-small";

export default function App() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { data: session } = useSession();
  const [displayName, setDisplayName] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedGame, setSelectedGame] = useState<GameIDKey | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [visibility, setVisibility] = useState<VisibilityType>(VisibilityType.Public);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const playerApiClient = useMemo(() => new PlayerApiClient({ logger }), []);

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
    setSelectedGame(null);
    setSelectedRole("");
    setVisibility(VisibilityType.Public);
    setAvatarFile(null);
    setError(null);
    setSuccessMessage(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      setError("Please sign in to create a player profile");
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

    setIsSubmitting(true);
    setError(null);

    try {
      const request: CreatePlayerProfileRequest = {
        game_id: selectedGame,
        nickname: displayName.trim(),
        roles: selectedRole ? [selectedRole] : undefined,
        visibility: visibility,
      };

      const authToken = (session as unknown as { accessToken?: string }).accessToken || "";

      const result = await playerApiClient.createPlayer(request, authToken);

      if (result) {
        setSuccessMessage(`Player profile "${result.nickname}" created successfully!`);
        setTimeout(() => {
          resetForm();
          onClose();
        }, 1500);
      } else {
        setError("Failed to create player profile. Please try again.");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      logger.error("Failed to create player profile", err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayName(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
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
      <Button startContent={<UserIcon size={18} />} color="primary" variant="faded" onPress={handleOpen}>Apply Now</Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onModalClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Player Profile</ModalHeader>
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

                      <Autocomplete
                        className="max-w-xs"
                        label="Playing Role"
                        placeholder="Search playing roles"
                        scrollShadowProps={{
                          isEnabled: false,
                        }}
                        variant="bordered"
                        isDisabled={isSubmitting}
                        onSelectionChange={(key) => setSelectedRole(key as string || "")}
                      >
                        <AutocompleteSection
                          classNames={{
                            heading: headingClasses,
                          }}
                          title="Role"
                        >
                          <AutocompleteItem key="Entry Fragger">Entry Fragger</AutocompleteItem>
                          <AutocompleteItem key="Support">Support</AutocompleteItem>
                          <AutocompleteItem key="In-Game Leader (IGL)">In-Game Leader (IGL)</AutocompleteItem>
                          <AutocompleteItem key="AWPer">AWPer</AutocompleteItem>
                          <AutocompleteItem key="Lurker">Lurker</AutocompleteItem>
                          <AutocompleteItem key="Anchor">Anchor</AutocompleteItem>
                          <AutocompleteItem key="Controller">Controller</AutocompleteItem>
                          <AutocompleteItem key="Duelist">Duelist</AutocompleteItem>
                          <AutocompleteItem key="Initiator">Initiator</AutocompleteItem>
                          <AutocompleteItem key="Rifler">Rifler</AutocompleteItem>
                          <AutocompleteItem key="Rotator">Rotator</AutocompleteItem>
                        </AutocompleteSection>
                      </Autocomplete>

                      <Select
                        variant="bordered"
                        className="pt-2"
                        label="Profile Visibility Options"
                        placeholder="Select a visibility option"
                        isDisabled={isSubmitting}
                        selectedKeys={new Set([visibility])}
                        onSelectionChange={handleVisibilitySelection}
                      >
                        <SelectItem key={VisibilityType.Public} textValue="Public"><div className="flex items-center"> <Icon icon="mdi:earth" /><Spacer x={2} />Public (Default)</div></SelectItem>
                        <SelectItem key={VisibilityType.Private} textValue="Private"><div className="flex items-center"> <Icon icon="mdi:lock" /><Spacer x={2} /> Private</div></SelectItem>
                        <SelectItem key={VisibilityType.Restricted} textValue="Restricted"><div className="flex items-center"> <Icon icon="mdi:account-group" /><Spacer x={2} /> Group & Members </div></SelectItem>
                      </Select>
                    </div>
                  </div>
                  <Input
                    variant="flat"
                    startContent={<small className="text-default-400">leetgaming.pro/players/</small>}
                    isRequired
                    label="URL"
                    labelPlacement="outside"
                    name="slug"
                    placeholder=""
                    type="text"
                    value={slug}
                    readOnly
                  />
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onModalClose} isDisabled={isSubmitting}>
                  Close
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  onPress={onSubmit as unknown as () => void}
                  isDisabled={isSubmitting || !displayName.trim() || !selectedGame}
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
