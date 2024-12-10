
// 
// IF LOGGED-IN
// large top bar with % of storage used
//  
///
// main page (single-tab): dashboard
// -- Storage
// -- Private
//   -- Breakdown: Encrypted / Unencrypted
// -- Privately Shared
//   -- Breakdown: Encrypted / Unencrypted
//   (.. list namespaces ..) ::settings (edit namespace/vault) ::delete namespaces/item
// -- Public
//   (.. list files, configs etc ..) ::delete items/item
//     -- Breakdown: list Groups/Teams ::settings (edit team/vault)
// -- (Upgrade to Pro)


// side-buttons, new (create group/vault), settings (edit group/vault), delete group/vault

// if not logged in, show product page


// const HomePage: React.FC = () => {
//     return (
//       <div>

//       </div>
//     );
//   };

//   export default HomePage;



"use client";

import React from "react";
import {
    Tabs,
    Tab,
    Chip,
    ScrollShadow,
    CardBody,
    Card,
    CardHeader,
    CardFooter,
} from "@nextui-org/react";

export default function Component() {
    return (
        <div className="w-full">
            <main className="flex w-full justify-center">
                <ScrollShadow
                    hideScrollBar
                    className="flex w-full  justify-between gap-8 border-b border-divider px-4 sm:px-8"
                    orientation="horizontal"
                >
                    <Tabs
                        aria-label="Navigation Tabs"
                        classNames={{
                            tabList: "w-full max-w-lg absolute rounded-none p-0 gap-4 lg:gap-6",
                            tab: "w-full px-0 h-12",
                            cursor: "w-full",
                            tabContent: "text-default-400",
                        }}
                        radius="full"
                        variant="underlined"
                    >
                        <Tab key="dashboard" title="Dashboard">
                        <div className="pt-14 flex flex-col md:flex-row md:space-x-4">
                                <Card className="mb-4 md:mb-0">
                                    <CardHeader>Storage</CardHeader>
                                    <CardBody> 
                                    <p> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
                                    </CardBody>
                                    <CardFooter> 50% used (809.7MB/1TB) </CardFooter>
                                </Card>
                                <Card className="mb-4 md:mb-0">
                                    <CardHeader>Files</CardHeader>
                                    <CardBody> Body:
                                        <p> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
                                    </CardBody>
                                    <CardFooter> 25  </CardFooter>
                                </Card>
                                <Card>
                                    <CardHeader>Replays</CardHeader>
                                    <CardBody> Body: <p> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
                                    </CardBody>
                                    <CardFooter> 12 (3 Public) </CardFooter>
                                </Card>
                            </div>
                            <div className="pt-2">
                                <Card>
                                    <CardHeader>Header</CardHeader>
                                    <CardBody>
                                        Body:
                                        <p>
                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                                            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                            cillum dolore eu fugiat nulla pariatur.
                                        </p>
                                    </CardBody>
                                    <CardFooter>
                                        Footer
                                    </CardFooter>
                                </Card>
                            </div>
                            <div className="pt-2">
                                <Card>
                                    <CardHeader>Header</CardHeader>
                                    <CardBody>
                                        Body:
                                        <p>
                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                                            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                            cillum dolore eu fugiat nulla pariatur.
                                        </p>
                                    </CardBody>
                                    <CardFooter>
                                        Footer
                                    </CardFooter>
                                </Card>
                            </div>
                        </Tab>
                        <Tab
                            key="uploads"
                            title={
                                <div className="flex items-center gap-2">
                                    <p>Uploads</p>
                                    <Chip size="sm">9</Chip>
                                </div>
                            }
                        />
                        <Tab key="analytics" title="Analytics" />
                        <Tab key="shared" title="Shared" />
                        <Tab key="settings" title="Settings" />
                        <Tab key="upgrade-to-pro" title={
                            <div className="flex items-center gap-2">
                                <p>Teams</p>
                                <Chip size="sm">PRO</Chip>
                            </div>
                        } />
                    </Tabs>

                </ScrollShadow>
            </main>
        </div>
    );
}
