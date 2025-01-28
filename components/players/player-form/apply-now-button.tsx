import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
  Dropdown,
  Select,
  Chip,
  SelectItem,
  Avatar,
  Textarea,
  SelectSection,
  Spacer,
} from "@nextui-org/react";
import { Form } from "@nextui-org/form";
import { Icon } from "@iconify/react";
import AvatarUploader from "@/components/avatar/avatar-uploader";
import { UserIcon } from "@/components/icons";

const games = [
  { id: 1, name: "Counter-Strike: Global Offensive", icon: "https://avatars.githubusercontent.com/u/168373383" },
  { id: 2, name: "Valorant", icon: "https://avatars.githubusercontent.com/u/168373383" },
  { id: 3, name: "League of Legends", icon: "https://avatars.githubusercontent.com/u/168373383" },
  { id: 4, name: "Dota 2", icon: "https://avatars.githubusercontent.com/u/168373383" },
  { id: 5, name: "Overwatch", icon: "https://avatars.githubusercontent.com/u/168373383" },
  { id: 6, name: "Rainbow Six Siege", icon: "https://avatars.githubusercontent.com/u/168373383" },
];

const selecHeadingClasses =
  "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small";

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [displayName, setDisplayName] = useState("");
  const [slug, setSlug] = useState("");

  const onSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayName(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
  };

  return (
    <>
      <Button startContent={<UserIcon size={18} />} color="primary" variant="faded" onPress={onOpen}>Apply Now</Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Player Profile</ModalHeader>
              <ModalBody>
                <Form className="w-full" validationBehavior="native" onSubmit={onSubmit}>
                  <div className="flex w-full gap-4 items-center pb-4">
                    <Select
                      classNames={{
                        trigger: "min-h-12 py-2",
                      }}
                      isMultiline={true}
                      items={games}
                      placeholder="Select a game"
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
                      <AvatarUploader onUpload={(file) => console.log(file)} />
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
                      />

                      <Select variant="flat"
                        className="pt-2"
                        label="Visibility"
                        placeholder="Select a visibility option"
                      >
                        <SelectItem key="Public" value="public" textValue="Public"><div className="flex items-center"> <Icon icon="mdi:earth" /><Spacer x={2}/>Public (Default)</div></SelectItem>
                        <SelectItem key="Private" value="private" textValue="Private"><div className="flex items-center"> <Icon icon="mdi:lock" /><Spacer x={2}/> Private</div></SelectItem>
                        <SelectItem key="Restricted" value="restricted" textValue="Restricted"><div className="flex items-center"> <Icon icon="mdi:account-group" /><Spacer x={2}/> Group & Members </div></SelectItem>
                      </Select>
                    </div>
                  </div>
                  <Input
                    variant="flat"
                    startContent={<span className="text-default-400 pr-4">leetgaming.pro/</span>}
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
                <Button variant="bordered" onPress={onClose}>
                  Close
                </Button>
                <Button type="submit" color="primary" onPress={onClose}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
