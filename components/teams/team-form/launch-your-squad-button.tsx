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
} from "@nextui-org/react";
import { Form } from "@nextui-org/form";
import { Icon } from "@iconify/react";
import AvatarUploader from "@/components/avatar/avatar-uploader";
import AddMemberButton from "./add-member-button";


const games = [
  { id: 1, name: "Counter-Strike: Global Offensive", icon: "https://avatars.githubusercontent.com/u/168373383" },
  { id: 2, name: "Valorant", icon: "https://avatars.githubusercontent.com/u/168373383" },
  { id: 3, name: "League of Legends", icon: "https://avatars.githubusercontent.com/u/168373383" },
  { id: 4, name: "Dota 2", icon: "https://avatars.githubusercontent.com/u/168373383" },
  { id: 5, name: "Overwatch", icon: "https://avatars.githubusercontent.com/u/168373383" },
  { id: 6, name: "Rainbow Six Siege", icon: "https://avatars.githubusercontent.com/u/168373383" },
];

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <>
      <Button onPress={onOpen} startContent={<Icon icon="solar:users-group-two-rounded-outline" width={18} />} color="primary" variant="ghost">Launch Your Squad</Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Team</ModalHeader>
              <ModalBody>
                <Form className="w-full" validationBehavior="native" onSubmit={onSubmit}>
                  <div className="flex w-full gap-4 items-center pb-4">
                    <Select
                      classNames={{
                        // base: "w-full",
                        trigger: "min-h-12 py-2",
                      }}
                      isMultiline={true}
                      items={games}
                      // label="Game"
                      // labelPlacement="outside"
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
                              {/* <span className="text-tiny text-default-400">{game.url}</span> */}
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
                        onChange={(e) => {
                          const displayName = e.target.value;
                          const slug = displayName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                          const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
                          if (slugInput) {
                            slugInput.value = slug;
                            const tagInput = document.querySelector('input[name="symbol"]') as HTMLInputElement;
                            if (tagInput) {
                              const initials = displayName
                                .split(' ')
                                .map(word => word[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 5);
                              tagInput.value = initials;
                            }
                          }
                        }}
                      />
                      <Input
                        startContent={<span className="text-default-400 pr-4">/</span>}
                        isRequired
                        label="URL"
                        labelPlacement="outside"
                        name="slug"
                        placeholder=""
                        type="text"
                      />

                      <Input
                        startContent={<span className="text-default-400 pr-4">#</span>}
                        isRequired
                        label="Tag"
                        labelPlacement="outside"
                        name="symbol"
                        placeholder=""
                        type="text"
                        validate={(value) => {
                          if (value.length > 4) {
                            return "Username must be at most 4 characters long";
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex w-full pt-2">
                    <Textarea className="w-full" label="Bio" placeholder="Enter your squad description" />
                  </div>
                </Form>
                <AddMemberButton />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
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
