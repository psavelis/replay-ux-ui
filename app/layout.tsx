import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import Box from './box';
import { logo } from '@/components/primitives';
import { Chip, Divider, LinkIcon, Spacer } from '@nextui-org/react';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: 'device-width',
  initialScale: 1,
};

// Exporting this way to avoid NextJs 14 type error
export { viewport };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background bg-scroll dark_bg_tailwind font-sans antialiased",
          fontSans.variable
        )}
      >
        <Box>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              {/* <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow"> */}
              <main className="container mx-auto max-w pt-4 flex-grow">
                {children}
              </main>
              <footer className="w-full flex items-center justify-center py-3">
                <Link
                  isExternal
                  className="flex items-center gap-1 text-current"
                  href="https://d-ash.io?utm_source=next-app-template"
                  title="nextui.org homepage"
                >
                  {/* <p><span className={logo()}>Team</span><span className={logo({ color: "blue" })}>PRO</span></p> | Powered by */}

                  {/*                   
                  <Chip
                    // startContent={<SteamIcon size={18} />}
                    variant="dot"
                    color="danger"
                  // endContent={<LinkIcon />}

                  >
                    <span className={logo({ color: "pink" })}>Replay<strong>API</strong>®</span>
                  </Chip> */}

                  <Chip
                    // startContent={<SteamIcon size={18} />}
                    variant="dot"
                    color="danger"
                  // endContent={<LinkIcon />}

                  >
                    <span className={logo({ color: "pink" })}>Replay<strong>API</strong>® </span>
                    {/* <span className={logo({ color: "green" })}> LIVE<strong></strong></span> */}
                  </Chip>


                </Link>
              </footer>
            </div>
          </Providers>
        </Box>
      </body>
    </html>
  );
}
