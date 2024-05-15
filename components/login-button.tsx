

import { Button } from '@nextui-org/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/dropdown'
import { AddNoteIcon, DeleteDocumentIcon, EditDocumentIcon, FlashIcon, HeartFilledIcon, LogOutIcon, MailIcon, PlusIcon, SteamIcon } from './icons'
import { logo } from './primitives'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Kbd } from '@nextui-org/kbd'
import { GoogleIcon } from './signup/social'
import { Spacer } from '@nextui-org/react'

export const LoginButton = () => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" title='Connect'>
          Connect

          <Kbd keys={["command", "enter"]} title='Connect'></Kbd>
          {/* <div><small>⌘+Enter</small></div> */}

        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="Sign-In Options">
        <DropdownSection title="Passwordless Sign-In" showDivider>
          <DropdownItem
            key="register"
            // className="text-success"
            shortcut="⌘R"
            description="Receive a verification code via email"
            // startContent={<FlashIcon />}
            startContent={<MailIcon height={"1.7em"} width={"1.7em"} />}
            href="/signup"

          >
            <span>Sign-in with email</span>
          </DropdownItem>
        </DropdownSection>
        <DropdownSection title="Sign-in using your OpenID provider">
          <DropdownItem
            key="steam"
            shortcut="⌘S"
            description="Sign in with your Steam account"
            onClick={() => signIn(["steam"] as any)}
            startContent={<SteamIcon />}
          >
            Steam
          </DropdownItem>
          <DropdownItem
            key="google"
            shortcut="⌘G"
            description="Sign in with your Google account"
            onClick={() => signIn(["google"] as any)}
            startContent={<div><GoogleIcon /><Spacer x={9} /></div>}
          >
            Google
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

      </DropdownMenu>
    </Dropdown>
  )
}