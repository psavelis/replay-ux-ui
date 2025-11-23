"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Image,
  Chip,
  Button,
  Input,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Divider,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { title, subtitle } from "@/components/primitives";
import { SearchIcon } from "@/components/icons";

interface MarketItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  currency: "credits" | "usd";
  category: "skins" | "coaching" | "services" | "accounts";
  rarity?: "common" | "rare" | "epic" | "legendary";
  seller: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
  stock: number;
  sales: number;
}

const MOCK_MARKET_ITEMS: MarketItem[] = [
  {
    id: "1",
    name: "AK-47 | Redline (Field-Tested)",
    description: "Classic AK-47 skin with clean red design",
    image: "https://placehold.co/400x300/FF4654/FFF?text=AK-47+Redline",
    price: 45.99,
    currency: "usd",
    category: "skins",
    rarity: "epic",
    seller: {
      name: "SkinTrader_Pro",
      avatar: "https://i.pravatar.cc/150?img=20",
      rating: 4.8,
      verified: true,
    },
    stock: 3,
    sales: 127,
  },
  {
    id: "2",
    name: "AWP | Dragon Lore (Minimal Wear)",
    description: "Rare and sought-after AWP skin",
    image: "https://placehold.co/400x300/FFD700/000?text=AWP+Dragon+Lore",
    price: 2499.99,
    currency: "usd",
    category: "skins",
    rarity: "legendary",
    seller: {
      name: "LegendarySkins",
      avatar: "https://i.pravatar.cc/150?img=21",
      rating: 5.0,
      verified: true,
    },
    stock: 1,
    sales: 45,
  },
  {
    id: "3",
    name: "Pro CS2 Coaching - 2 Hours",
    description: "One-on-one coaching with professional CS2 player",
    image: "https://placehold.co/400x300/DCFF37/000?text=Pro+Coaching",
    price: 75.0,
    currency: "usd",
    category: "coaching",
    seller: {
      name: "ProCoach_s1mple",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 4.9,
      verified: true,
    },
    stock: 5,
    sales: 89,
  },
  {
    id: "4",
    name: "Replay Analysis Service",
    description: "Expert analysis of your gameplay with detailed feedback",
    image: "https://placehold.co/400x300/34445C/FFF?text=Replay+Analysis",
    price: 25.0,
    currency: "usd",
    category: "services",
    seller: {
      name: "AnalysisExpert",
      avatar: "https://i.pravatar.cc/150?img=22",
      rating: 4.7,
      verified: true,
    },
    stock: 10,
    sales: 234,
  },
  {
    id: "5",
    name: "M4A4 | Howl (Factory New)",
    description: "Contraband skin, no longer available in drops",
    image: "https://placehold.co/400x300/FF6B6B/FFF?text=M4A4+Howl",
    price: 3800.0,
    currency: "usd",
    category: "skins",
    rarity: "legendary",
    seller: {
      name: "RareCollector",
      avatar: "https://i.pravatar.cc/150?img=23",
      rating: 4.9,
      verified: true,
    },
    stock: 1,
    sales: 12,
  },
  {
    id: "6",
    name: "Knife | Karambit Fade",
    description: "Beautiful fade pattern on karambit knife",
    image: "https://placehold.co/400x300/9B59B6/FFF?text=Karambit+Fade",
    price: 1250.0,
    currency: "usd",
    category: "skins",
    rarity: "legendary",
    seller: {
      name: "KnifeMaster",
      avatar: "https://i.pravatar.cc/150?img=24",
      rating: 4.8,
      verified: true,
    },
    stock: 2,
    sales: 67,
  },
  {
    id: "7",
    name: "Valorant VOD Review",
    description: "Professional VOD review for Valorant competitive matches",
    image: "https://placehold.co/400x300/F31260/FFF?text=Valorant+VOD",
    price: 30.0,
    currency: "usd",
    category: "services",
    seller: {
      name: "ValCoach",
      avatar: "https://i.pravatar.cc/150?img=25",
      rating: 4.6,
      verified: false,
    },
    stock: 8,
    sales: 156,
  },
  {
    id: "8",
    name: "Glock-18 | Fade (Factory New)",
    description: "Clean fade pattern pistol skin",
    image: "https://placehold.co/400x300/E74C3C/FFF?text=Glock+Fade",
    price: 280.0,
    currency: "usd",
    category: "skins",
    rarity: "rare",
    seller: {
      name: "PistolPro",
      avatar: "https://i.pravatar.cc/150?img=26",
      rating: 4.5,
      verified: true,
    },
    stock: 4,
    sales: 98,
  },
];

export default function SupplyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const filteredItems = MOCK_MARKET_ITEMS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesRarity = selectedRarity === "all" || item.rarity === selectedRarity;

    return matchesSearch && matchesCategory && matchesRarity;
  }).sort((a, b) => {
    if (sortBy === "price_low") return a.price - b.price;
    if (sortBy === "price_high") return b.price - a.price;
    if (sortBy === "popular") return b.sales - a.sales;
    return 0;
  });

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case "legendary":
        return "warning";
      case "epic":
        return "secondary";
      case "rare":
        return "primary";
      case "common":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-8 px-4 py-8 lg:px-24">
      {/* Header */}
      <div className="flex w-full max-w-7xl flex-col items-center text-center gap-2">
        <h2 className="text-secondary font-medium">Gaming Marketplace</h2>
        <h1 className={title({ size: "lg" })}>Supply Market</h1>
        <p className={subtitle({ class: "mt-2 max-w-2xl" })}>
          Buy and sell gaming items, skins, services, and more. Trade safely with verified sellers.
        </p>
      </div>

      {/* Filters */}
      <Card className="w-full max-w-7xl">
        <CardBody>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <Input
                placeholder="Search items..."
                startContent={<SearchIcon size={18} />}
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="flex-1"
                variant="bordered"
              />
              <Select
                label="Category"
                selectedKeys={[selectedCategory]}
                onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
                className="w-full md:w-48"
                variant="bordered"
              >
                <SelectItem key="all" value="all">All Categories</SelectItem>
                <SelectItem key="skins" value="skins">Skins & Items</SelectItem>
                <SelectItem key="coaching" value="coaching">Coaching</SelectItem>
                <SelectItem key="services" value="services">Services</SelectItem>
                <SelectItem key="accounts" value="accounts">Accounts</SelectItem>
              </Select>
              <Select
                label="Rarity"
                selectedKeys={[selectedRarity]}
                onSelectionChange={(keys) => setSelectedRarity(Array.from(keys)[0] as string)}
                className="w-full md:w-48"
                variant="bordered"
              >
                <SelectItem key="all" value="all">All Rarities</SelectItem>
                <SelectItem key="legendary" value="legendary">Legendary</SelectItem>
                <SelectItem key="epic" value="epic">Epic</SelectItem>
                <SelectItem key="rare" value="rare">Rare</SelectItem>
                <SelectItem key="common" value="common">Common</SelectItem>
              </Select>
              <Select
                label="Sort By"
                selectedKeys={[sortBy]}
                onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
                className="w-full md:w-48"
                variant="bordered"
              >
                <SelectItem key="popular" value="popular">Most Popular</SelectItem>
                <SelectItem key="price_low" value="price_low">Price: Low to High</SelectItem>
                <SelectItem key="price_high" value="price_high">Price: High to Low</SelectItem>
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Items Grid */}
      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-4">
          <p className="text-default-500">
            Showing {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
          </p>
          <Button
            color="primary"
            variant="flat"
            startContent={<Icon icon="mdi:plus" width={20} />}
          >
            List Item
          </Button>
        </div>

        {filteredItems.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <Icon icon="mdi:package-variant-closed" className="text-6xl text-default-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No items found</h3>
              <p className="text-default-500">
                Try adjusting your filters or search query
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:scale-105 transition-transform" isPressable>
                <CardHeader className="p-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                    radius="none"
                  />
                </CardHeader>

                <CardBody className="p-4 gap-3">
                  {/* Item Title & Rarity */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-semibold text-sm line-clamp-2 flex-1">
                        {item.name}
                      </h4>
                      {item.rarity && (
                        <Chip size="sm" color={getRarityColor(item.rarity)} variant="flat">
                          {item.rarity}
                        </Chip>
                      )}
                    </div>
                    <p className="text-xs text-default-500 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <Divider />

                  {/* Seller Info */}
                  <div className="flex items-center gap-2">
                    <Image
                      src={item.seller.avatar}
                      alt={item.seller.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium truncate">
                          {item.seller.name}
                        </span>
                        {item.seller.verified && (
                          <Icon icon="mdi:check-decagram" className="text-primary" width={14} />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon icon="mdi:star" className="text-warning" width={12} />
                        <span className="text-xs text-default-500">
                          {item.seller.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Divider />

                  {/* Stats */}
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center gap-1 text-default-500">
                      <Icon icon="mdi:package-variant" width={14} />
                      <span>{item.stock} in stock</span>
                    </div>
                    <div className="flex items-center gap-1 text-default-500">
                      <Icon icon="mdi:cart" width={14} />
                      <span>{item.sales} sold</span>
                    </div>
                  </div>
                </CardBody>

                <CardFooter className="p-4 pt-0 flex-col gap-2">
                  <div className="flex w-full justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs text-default-500">Price</span>
                      <span className="text-xl font-bold text-primary">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <Button
                      color="primary"
                      variant="shadow"
                      size="md"
                      endContent={<Icon icon="mdi:cart" width={18} />}
                    >
                      Buy Now
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100">
          <CardBody className="p-6">
            <Icon icon="mdi:shield-check" className="text-3xl text-primary mb-2" />
            <h3 className="text-lg font-semibold mb-2">Secure Trading</h3>
            <p className="text-sm text-default-600">
              All transactions are protected with buyer protection and escrow services. Trade with confidence.
            </p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-secondary-50 to-secondary-100">
          <CardBody className="p-6">
            <Icon icon="mdi:account-star" className="text-3xl text-secondary mb-2" />
            <h3 className="text-lg font-semibold mb-2">Verified Sellers</h3>
            <p className="text-sm text-default-600">
              Browse items from verified sellers with proven track records and positive ratings.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
