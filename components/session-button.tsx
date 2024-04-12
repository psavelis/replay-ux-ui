"use client"
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/dropdown';
import { Button, Link, User } from '@nextui-org/react';
import { DeleteDocumentIcon, LogOutIcon, Logo, PlusIcon, PowerButtonIcon, UserIcon } from './icons';
import { logo } from './primitives';
import { button as buttonStyles } from "@nextui-org/theme";
import { useSession, signIn, signOut } from "next-auth/react"
import { VerticalDotsIcon } from '@/app/replay-files/VerticalDotsIcon';

export default function SessionButton() {
  const { data: session } = useSession();

  return (
    <Dropdown
      showArrow
      radius="sm"
      classNames={{
        base: "before:bg-default-200",
        content: "p-0 border-small border-divider bg-background",
      }}
    >
      <DropdownTrigger>
        <Button variant="light" disableRipple endContent={<VerticalDotsIcon width={undefined} height={undefined} />}>Console</Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Custom item styles"
        disabledKeys={["profile"]}
        className="p-3"
        itemClasses={{
          base: [
            "rounded-md",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "data-[hover=true]:bg-default-100",
            "dark:data-[hover=true]:bg-default-50",
            "data-[selectable=true]:focus:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[focus-visible=true]:ring-default-500",
          ],
        }}
      >
        <DropdownSection aria-label="Profile & Actions" showDivider>
          <DropdownItem
            isReadOnly
            key="profile"
            className="h-14 gap-2 opacity-100"
          >
            <User
              name={session?.user?.name || "Guest"}
              description={session?.user?.email || ""}
              classNames={{
                name: "text-default-600",
                description: "text-default-500",
              }}
              avatarProps={{
                size: "sm",
                src: session?.user?.image || "",
              }}
            />
          </DropdownItem>
          <DropdownItem key="dashboard">
            Dashboard
          </DropdownItem>
          <DropdownItem key="settings">Settings</DropdownItem>
          <DropdownItem
            key="new_project"
            endContent={<PlusIcon className="text-large" />}
          >
            New Project
          </DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label="Preferences" showDivider>
          <DropdownItem key="quick_search" shortcut="⌘K">
            Quick search
          </DropdownItem>
          <DropdownItem
            isReadOnly
            key="theme"
            className="cursor-default"
            endContent={
              <select
                className="z-10 outline-none w-16 py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
                id="theme"
                name="theme"
              >
                <option>System</option>
                <option>Dark</option>
                <option>Light</option>
              </select>
            }
          >
            Theme
          </DropdownItem>
        </DropdownSection>  

        <DropdownSection aria-label="Help & Feedback" showDivider>
          <DropdownItem key="help_and_feedback">
            Help & Feedback
          </DropdownItem>
          {/* <DropdownItem key="logout" onClick={()=>ssignOut()}>Log Out</DropdownItem> */}
        </DropdownSection> 
        <DropdownSection>
        <DropdownItem
          key="logout"
          // className="text-danger"
          color="danger"
          // shortcut="⌘L"
          description="Disconnect from your account"
          onClick={() => signOut()}
          startContent={<PowerButtonIcon />}
        >
          Sign-out
        </DropdownItem>
      </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}

