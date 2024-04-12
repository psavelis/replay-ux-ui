"use client"

import { Button } from '@nextui-org/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/dropdown'
import { AddNoteIcon, DeleteDocumentIcon, EditDocumentIcon, FlashIcon, HeartFilledIcon, LogOutIcon, MailIcon, PlusIcon, SteamIcon } from './icons'
import { logo } from './primitives'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Kbd } from '@nextui-org/kbd'

export const LoginButton = () => {
  const { data: session } = useSession()
return (
  <Dropdown>
    <DropdownTrigger>
      <Button variant="bordered" title='Connect'>
        Connect

        <Kbd keys={["command", "enter"]} title='Connect'></Kbd>
        {/* <div><small>⌘+Enter</small></div> */}
        
      </Button>
    </DropdownTrigger>
    <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
      <DropdownSection title="Sign-In" showDivider>
        <DropdownItem
          key="steam"
          shortcut="⌘S"
          description="Sign in with your Steam account"
          onClick={() => signIn(["steam"] as any)}
          startContent={<SteamIcon />}
        >
          Steam
        </DropdownItem>
        {/* <DropdownItem
                  key="copy"
                  shortcut="⌘C"
                  description="Copy the file link"
                  startContent={<CopyDocumentIcon className={iconClasses} />}
                >
                  Copy link
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  shortcut="⌘⇧E"
                  description="Allows you to edit the file"
                  startContent={<EditDocumentIcon className={iconClasses} />}
                >
                  Edit file
                </DropdownItem> */}
      </DropdownSection>
      <DropdownSection title="Don't have an account yet?">
        <DropdownItem
          key="register"
          className="text-warning"
          color="warning"
          shortcut="⌘R"
          description="Register a new account with email verification."
          // startContent={<FlashIcon />}
          startContent={<PlusIcon height={"1.7em"} width={"1.7em"}/>}
        >
          <span className={logo({ color: "yellow" })}>Create New Account</span>
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  </Dropdown>
)
              }