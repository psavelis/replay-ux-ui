'use client';

/**
 * Intelligent News/Blog Page
 * Features: Categories, featured posts, recent posts, search integration
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Image, Button, Chip, Input } from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { PageContainer } from '@/components/layouts/centered-content';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  featured: boolean;
  image: string;
  slug: string;
}

// Mock blog posts data - in production, fetch from API/CMS
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Introducing Advanced Match Analytics: Deep Dive into Your CS2 Performance',
    excerpt: 'Learn how our new analytics engine breaks down every round, every kill, and every decision you make in Counter-Strike 2.',
    content: '',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    category: 'Product Updates',
    tags: ['analytics', 'cs2', 'features'],
    publishedAt: '2024-01-15',
    readTime: 8,
    featured: true,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    slug: 'advanced-match-analytics',
  },
  {
    id: '2',
    title: 'Pro Player Spotlight: Interview with Team Liquid\'s Entry Fragger',
    excerpt: 'We sat down with one of the best entry fraggers in competitive CS2 to discuss strategies, warmup routines, and mental preparation.',
    content: '',
    author: {
      name: 'Mike Rodriguez',
      avatar: 'https://i.pravatar.cc/150?u=mike',
    },
    category: 'Interviews',
    tags: ['pro-players', 'interviews', 'strategies'],
    publishedAt: '2024-01-12',
    readTime: 12,
    featured: true,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    slug: 'pro-player-spotlight-team-liquid',
  },
  {
    id: '3',
    title: 'Matchmaking 2.0: Premium Tiers and Priority Queues Explained',
    excerpt: 'Everything you need to know about our new matchmaking system, tier benefits, and how priority queues work.',
    content: '',
    author: {
      name: 'Alex Kim',
      avatar: 'https://i.pravatar.cc/150?u=alex',
    },
    category: 'Product Updates',
    tags: ['matchmaking', 'premium', 'features'],
    publishedAt: '2024-01-10',
    readTime: 6,
    featured: false,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800',
    slug: 'matchmaking-premium-tiers',
  },
  {
    id: '4',
    title: 'Community Tournament Results: January 2024',
    excerpt: 'Recap of last month\'s community tournaments, top performers, and prize distributions.',
    content: '',
    author: {
      name: 'Emma Watson',
      avatar: 'https://i.pravatar.cc/150?u=emma',
    },
    category: 'Community',
    tags: ['tournaments', 'community', 'esports'],
    publishedAt: '2024-01-08',
    readTime: 5,
    featured: false,
    image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800',
    slug: 'january-tournament-results',
  },
  {
    id: '5',
    title: '5 Tips to Improve Your CS2 Aim from Pro Coaches',
    excerpt: 'Professional CS2 coaches share their top tips for improving aim consistency, reaction time, and crosshair placement.',
    content: '',
    author: {
      name: 'Coach James',
      avatar: 'https://i.pravatar.cc/150?u=james',
    },
    category: 'Guides',
    tags: ['guides', 'aim', 'coaching'],
    publishedAt: '2024-01-05',
    readTime: 10,
    featured: false,
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800',
    slug: 'improve-cs2-aim-tips',
  },
  {
    id: '6',
    title: 'Behind the Scenes: How We Process 1M+ Replays Monthly',
    excerpt: 'Technical deep dive into our replay processing pipeline, infrastructure, and the challenges we\'ve overcome.',
    content: '',
    author: {
      name: 'Tech Team',
      avatar: 'https://i.pravatar.cc/150?u=tech',
    },
    category: 'Engineering',
    tags: ['technical', 'infrastructure', 'replays'],
    publishedAt: '2024-01-03',
    readTime: 15,
    featured: false,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    slug: 'replay-processing-pipeline',
  },
];

const categories = ['All', 'Product Updates', 'Interviews', 'Community', 'Guides', 'Engineering'];

const categoryColors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
  'Product Updates': 'primary',
  'Interviews': 'secondary',
  'Community': 'success',
  'Guides': 'warning',
  'Engineering': 'danger',
};

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredPosts = mockPosts.filter((post) => post.featured);
  const regularPosts = mockPosts.filter((post) => !post.featured);

  const filteredPosts = regularPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <PageContainer
      title="News & Insights"
      description="Latest updates, guides, and stories from the LeetGaming.PRO community"
      maxWidth="7xl"
    >
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Icon icon="solar:star-bold" className="text-warning" width={28} />
            Featured Stories
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <Card
                key={post.id}
                isPressable
                className="hover:scale-[1.02] transition-transform"
                onPress={() => (window.location.href = `/blog/${post.slug}`)}
              >
                <CardHeader className="absolute z-10 top-4 flex-col items-start bg-black/60 backdrop-blur-sm m-2 rounded-large">
                  <Chip size="sm" color={categoryColors[post.category] || 'default'} variant="flat">
                    {post.category}
                  </Chip>
                  <h3 className="text-white/90 font-bold text-xl mt-2">{post.title}</h3>
                </CardHeader>
                <Image
                  removeWrapper
                  alt={post.title}
                  className="z-0 w-full h-full object-cover"
                  src={post.image}
                  height={400}
                />
                <CardFooter className="absolute bg-black/60 bottom-0 z-10 border-t-1 border-default-600">
                  <div className="flex flex-col w-full gap-2">
                    <p className="text-tiny text-white/80">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image
                          alt={post.author.name}
                          className="rounded-full"
                          height={24}
                          width={24}
                          src={post.author.avatar}
                        />
                        <span className="text-tiny text-white/60">{post.author.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-tiny text-white/60">
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1">
                          <Icon icon="solar:clock-circle-linear" width={14} />
                          {post.readTime} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="mb-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Chip
              key={category}
              size="lg"
              variant={selectedCategory === category ? 'solid' : 'bordered'}
              color={selectedCategory === category ? 'primary' : 'default'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Chip>
          ))}
        </div>
        <Input
          className="max-w-xs"
          placeholder="Search posts..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Icon icon="solar:magnifer-linear" width={20} />}
          isClearable
          onClear={() => setSearchQuery('')}
        />
      </div>

      {/* Recent Posts Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="solar:ghost-linear" width={64} className="mx-auto mb-4 text-default-400" />
            <p className="text-default-600">No posts found matching your criteria</p>
            <Button
              className="mt-4"
              variant="light"
              color="primary"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                isPressable
                className="hover:scale-[1.02] transition-transform"
                onPress={() => (window.location.href = `/blog/${post.slug}`)}
              >
                <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                  <Chip size="sm" color={categoryColors[post.category] || 'default'} variant="flat" className="mb-2">
                    {post.category}
                  </Chip>
                  <h4 className="font-bold text-lg line-clamp-2">{post.title}</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2 px-4">
                  <Image
                    alt={post.title}
                    className="object-cover rounded-xl"
                    src={post.image}
                    width="100%"
                    height={180}
                  />
                  <p className="text-tiny text-default-600 mt-3 line-clamp-3">{post.excerpt}</p>
                </CardBody>
                <CardFooter className="text-small px-4 pt-0">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Image
                        alt={post.author.name}
                        className="rounded-full"
                        height={20}
                        width={20}
                        src={post.author.avatar}
                      />
                      <span className="text-tiny text-default-500">{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-tiny text-default-400">
                      <Icon icon="solar:clock-circle-linear" width={14} />
                      {post.readTime} min
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Newsletter Subscription */}
      <Card className="mt-12 bg-gradient-to-r from-primary-500 to-secondary-500">
        <CardBody className="py-8 px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-white/80">
                Get the latest news, guides, and updates delivered directly to your inbox.
              </p>
            </div>
            <div className="flex gap-2 w-full lg:w-auto">
              <Input
                className="min-w-[280px]"
                placeholder="Enter your email"
                type="email"
                variant="bordered"
                classNames={{
                  input: 'text-white',
                  inputWrapper: 'border-white/40 hover:border-white/60',
                }}
              />
              <Button color="default" variant="solid" className="bg-white text-primary font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
