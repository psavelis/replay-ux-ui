// /app/blog/page.tsx
"use client";

import { Card, CardFooter, Accordion, AccordionItem, Image } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
// import fs from 'fs';
// import path from 'path';

// async function getBlogPostPaths() {
//   // const postsDirectory = path.join(process.cwd(), 'app/blog');
//   // const yearDirs = fs.readdirSync(postsDirectory, { withFileTypes: true })
//   //   .filter((dirent: { isDirectory: () => any; }) => dirent.isDirectory())
//   //   .map((dirent: { name: any; }) => dirent.name);

  
//   // yearDirs.forEach((year: any) => {
//   //   const monthDirs = fs.readdirSync(path.join(postsDirectory, year));
//   //   monthDirs.forEach((month: any) => {
//   //     const dayDirs = fs.readdirSync(path.join(postsDirectory, year, month));
//   //     dayDirs.forEach((day: any) => {
//   //       const pageFile = fs.readdirSync(path.join(postsDirectory, year, month, day)).find((file: string) => file.endsWith('.tsx'));
//   //       if (pageFile) {
//   //         posts.push(`/${year}/${month}/${day}/${pageFile.replace('.tsx', '')}`);
//   //       }
//   //     });
//   //   });
//   // });

//   // posts.push();

//   return posts;
// }

export default async function BlogPage() {
  const posts: string[] = [`/blog/2024/06/05/anything`];
  const [selectedYear, setSelectedYear] = React.useState(null);

  const postsByYear = posts.reduce((acc: any, postPath:any) => {
    const year = postPath.split('/')[1];
    acc[year] = acc[year] || [];
    acc[year].push(postPath);
    return acc;
  }, {});

  const latestPost = posts[posts.length - 1]; 

  return (
    <div>
      <section>
        <h2>Featured Post</h2>
        <Link href={latestPost}>
              <Card isHoverable isPressable>
                <Image src="/cs2/radar/de_inferno.webp" width="100%" height={200} alt="Featured Post" />
                <CardFooter>
                  <b>{latestPost}</b> {/* Display the post title or extract it from the file */}
                </CardFooter>
              </Card>
            </Link>
      </section>

      <section>
        <h2>All Posts</h2>
        <Accordion>
          {Object.entries(postsByYear).map(([year, yearPosts]) => (
            <AccordionItem key={year} title={year}>
              {(yearPosts as any).map((postPath: string) => (
                <Link href={postPath} key={postPath}>
                  <span>{postPath}</span>
                </Link>
              ))}
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
