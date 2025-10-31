"use client"

import Link from "next/link"
import { useState } from "react"
import type { ComponentType, SVGProps } from "react"
import {
  Bell,
  Bookmark,
  CircleEllipsis,
  Hash,
  Home,
  List,
  Mail,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Search,
  Share,
  Sparkles,
  User,
  BadgeCheck,
  Heart,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge as BadgePill } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Tweet = {
  id: string
  content: string
  createdAt: string
  media?: string[]
  author: {
    name: string
    handle: string
    avatar: string
    verified?: boolean
  }
  stats: {
    comments: number
    reposts: number
    likes: number
    bookmarks: number
  }
  viewer: {
    liked: boolean
    reposted: boolean
    bookmarked: boolean
  }
}

const currentUser = {
  name: "Ava Indigo",
  handle: "avaindigo",
  avatar: "https://i.pravatar.cc/150?img=47",
}

const navItems = [
  { icon: Home, label: "Home", href: "#", isActive: true },
  { icon: Hash, label: "Explore", href: "#explore" },
  { icon: Bell, label: "Notifications", href: "#notifications" },
  { icon: Mail, label: "Messages", href: "#messages" },
  { icon: Bookmark, label: "Bookmarks", href: "#bookmarks" },
  { icon: List, label: "Lists", href: "#lists" },
  { icon: User, label: "Profile", href: "#profile" },
  { icon: CircleEllipsis, label: "More", href: "#more" },
]

const initialTweets: Tweet[] = [
  {
    id: "1",
    content:
      "Design systems aren’t static — they’re living, evolving products. Ship tiny improvements every week and your velocity compounds faster than you think.",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    author: {
      name: "Maya Nielsen",
      handle: "ui_maya",
      avatar: "https://i.pravatar.cc/150?img=32",
      verified: true,
    },
    stats: { comments: 24, reposts: 98, likes: 642, bookmarks: 119 },
    media: ["https://images.unsplash.com/photo-1582719478325-d83fc0c5ba3b"],
    viewer: { liked: false, reposted: false, bookmarked: false },
  },
  {
    id: "2",
    content:
      "Weekend shipping session ✅ Built a focus mode for my productivity app: ambient soundscapes + AI generated task summaries. Beta invites go out tomorrow!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    author: {
      name: "Theo Carter",
      handle: "shipwiththeo",
      avatar: "https://i.pravatar.cc/150?img=65",
      verified: false,
    },
    stats: { comments: 54, reposts: 143, likes: 984, bookmarks: 202 },
    viewer: { liked: false, reposted: false, bookmarked: false },
  },
  {
    id: "3",
    content:
      "Just launched our open design kit for early-stage founders. 12 responsive templates, light/dark mode, and a Figma library that actually snaps together. Free for the next 48h.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    author: {
      name: "Studio North",
      handle: "studionorth",
      avatar: "https://i.pravatar.cc/150?img=12",
      verified: true,
    },
    stats: { comments: 88, reposts: 365, likes: 2204, bookmarks: 441 },
    viewer: { liked: false, reposted: false, bookmarked: false },
  },
]

const trends = [
  {
    category: "Technology",
    title: "Realtime UX",
    stat: "19.4K posts",
  },
  {
    category: "Product Design",
    title: "Tokenized Design Systems",
    stat: "8,217 posts",
  },
  {
    category: "Startups",
    title: "Indie SaaS",
    stat: "Trending with #buildinpublic",
  },
  {
    category: "AI",
    title: "UI Copilots",
    stat: "12.1K posts",
  },
  {
    category: "UX Research",
    title: "Journey Mapping",
    stat: "2,041 posts",
  },
]

const suggestions = [
  {
    name: "Orbit UI",
    handle: "orbitui",
    avatar: "https://i.pravatar.cc/150?img=22",
  },
  {
    name: "Lena Park",
    handle: "lenaparkdesign",
    avatar: "https://i.pravatar.cc/150?img=56",
  },
  {
    name: "Metric Labs",
    handle: "metriclabs",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
]

type EngagementKey = "liked" | "reposted" | "bookmarked"

const engagementStatKey: Record<EngagementKey, keyof Tweet["stats"]> = {
  liked: "likes",
  reposted: "reposts",
  bookmarked: "bookmarks",
}

function formatRelativeTime(isoDate: string) {
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  const diff = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.round(diff / (1000 * 60))

  if (minutes < 60) {
    return formatter.format(-minutes, "minutes")
  }

  const hours = Math.round(minutes / 60)

  if (hours < 24) {
    return formatter.format(-hours, "hours")
  }

  const days = Math.round(hours / 24)
  return formatter.format(-days, "days")
}

export function TwitterHome() {
  const [tweets, setTweets] = useState(initialTweets)
  const [draft, setDraft] = useState("")
  const [isPosting, setIsPosting] = useState(false)

  const canPost = draft.trim().length > 0 && draft.trim().length <= 280

  const draftCharCount = draft.trim().length
  const draftProgress = Math.min(100, (draftCharCount / 280) * 100)

  function handleEngagement(id: string, action: EngagementKey) {
    setTweets((prev) =>
      prev.map((tweet) => {
        if (tweet.id !== id) {
          return tweet
        }

        const toggled = !tweet.viewer[action]
        const statKey = engagementStatKey[action]
        return {
          ...tweet,
          viewer: { ...tweet.viewer, [action]: toggled },
          stats: {
            ...tweet.stats,
            [statKey]: tweet.stats[statKey] + (toggled ? 1 : -1),
          },
        }
      })
    )
  }

  function handlePost() {
    if (!canPost || isPosting) {
      return
    }

    setIsPosting(true)
    const newTweet: Tweet = {
      id: crypto.randomUUID(),
      content: draft.trim(),
      createdAt: new Date().toISOString(),
      author: { ...currentUser, verified: true },
      stats: { comments: 0, reposts: 0, likes: 0, bookmarks: 0 },
      viewer: { liked: false, reposted: false, bookmarked: false },
    }

    setTweets((prev) => [newTweet, ...prev])
    setDraft("")
    setTimeout(() => setIsPosting(false), 250)
  }

  return (
    <TooltipProvider delayDuration={120}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 pb-10 pt-6 lg:px-6">
        <aside className="hidden w-[280px] shrink-0 flex-col justify-between lg:flex">
          <nav className="sticky top-6 flex flex-col gap-2 rounded-2xl border bg-background/80 p-3 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3 px-3 py-2 text-2xl font-semibold">
              <Sparkles className="size-6 text-sky-500" />
              Pulse
            </div>
            {navItems.map(({ icon: Icon, label, href, isActive }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex items-center gap-4 rounded-full px-3 py-2 text-lg transition hover:bg-muted/70",
                  isActive
                    ? "font-semibold text-sky-500"
                    : "font-medium text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            ))}
            <Button className="mt-2 h-12 rounded-full bg-sky-500 text-base font-semibold text-white hover:bg-sky-600">
              Compose
            </Button>
          </nav>

          <Card className="sticky bottom-6 border bg-background/80 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <Avatar className="size-11">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm">
                <span className="font-semibold leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-muted-foreground">@{currentUser.handle}</span>
              </div>
              <Button variant="outline" size="sm" className="ml-auto rounded-full">
                Switch
              </Button>
            </div>
          </Card>
        </aside>

        <main className="flex w-full max-w-2xl flex-1 flex-col overflow-hidden rounded-2xl border bg-background/90 shadow-sm backdrop-blur">
          <div className="sticky top-0 z-20 border-b bg-background/90 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-3 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SheetHeader className="px-6 py-4">
                    <SheetTitle className="text-xl font-semibold">
                      Pulse Menu
                    </SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-full">
                    <div className="flex flex-col gap-1 px-4 pb-6">
                      {navItems.map(({ icon: Icon, label, href, isActive }) => (
                        <Link
                          key={label}
                          href={href}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2 text-base transition hover:bg-muted/70",
                            isActive
                              ? "font-semibold text-sky-500"
                              : "text-muted-foreground"
                          )}
                        >
                          <Icon className="size-4" />
                          {label}
                        </Link>
                      ))}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
              <span className="text-lg font-semibold">Pulse</span>
            </div>
            <div className="hidden items-center justify-between lg:flex">
              <span className="text-lg font-semibold">Home</span>
              <BadgePill
                variant="outline"
                className="rounded-full border-sky-500/50 text-xs text-sky-500"
              >
                Design Network
              </BadgePill>
            </div>
          </div>

          <div className="flex items-center justify-between border-b px-3 py-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="size-5 text-sky-500" />
              For you
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Sparkles className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Tune your feed</TooltipContent>
            </Tooltip>
          </div>

          <div className="border-b px-4 py-4">
            <div className="flex gap-3">
              <Avatar className="size-12">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="What is happening?!"
                  className="min-h-[110px] resize-none border-none bg-transparent px-0 text-lg shadow-none focus-visible:ring-0"
                />
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <BadgePill variant="secondary" className="rounded-full">
                      280 character limit
                    </BadgePill>
                    <BadgePill variant="secondary" className="rounded-full">
                      Markdown supported
                    </BadgePill>
                    <BadgePill variant="secondary" className="rounded-full">
                      AI rewrite soon
                    </BadgePill>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="relative w-40 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-sky-500 transition-all"
                        style={{ width: `${draftProgress}%` }}
                      />
                    </div>
                    <Button
                      onClick={handlePost}
                      disabled={!canPost || isPosting}
                      className="rounded-full bg-sky-500 px-5 text-sm font-semibold text-white hover:bg-sky-600"
                    >
                      {isPosting ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="flex flex-col">
              {tweets.map((tweet) => (
                <article
                  key={tweet.id}
                  className="flex gap-3 border-b px-4 py-5 transition hover:bg-muted/40"
                >
                  <Avatar className="size-12 shrink-0">
                    <AvatarImage
                      src={tweet.author.avatar}
                      alt={tweet.author.name}
                    />
                    <AvatarFallback>
                      {tweet.author.name
                        .split(" ")
                        .map((piece) => piece[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-3">
                    <header className="flex items-center gap-2 text-sm">
                      <span className="font-semibold">{tweet.author.name}</span>
                      {tweet.author.verified ? (
                        <BadgeCheck className="size-4 text-sky-500" />
                      ) : null}
                      <span className="text-muted-foreground">
                        @{tweet.author.handle}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">
                        {formatRelativeTime(tweet.createdAt)}
                      </span>
                    </header>
                    <p className="whitespace-pre-wrap text-[15px] leading-6">
                      {tweet.content}
                    </p>
                    {tweet.media?.length ? (
                      <div className="grid gap-2">
                        {tweet.media.map((src) => (
                          <div
                            key={src}
                            className="overflow-hidden rounded-3xl border"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`${src}?auto=format&fit=crop&w=1200&q=80`}
                              alt=""
                              className="max-h-96 w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <footer className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:gap-6">
                      <EngagementButton
                        icon={MessageCircle}
                        label="Reply"
                        count={tweet.stats.comments}
                      />
                      <EngagementButton
                        icon={Repeat2}
                        label={tweet.viewer.reposted ? "Reposted" : "Repost"}
                        count={tweet.stats.reposts}
                        active={tweet.viewer.reposted}
                        onClick={() => handleEngagement(tweet.id, "reposted")}
                      />
                      <EngagementButton
                        icon={Heart}
                        label={tweet.viewer.liked ? "Liked" : "Like"}
                        count={tweet.stats.likes}
                        active={tweet.viewer.liked}
                        onClick={() => handleEngagement(tweet.id, "liked")}
                        activeClass="text-rose-500"
                      />
                      <EngagementButton
                        icon={Bookmark}
                        label={tweet.viewer.bookmarked ? "Saved" : "Bookmark"}
                        count={tweet.stats.bookmarks}
                        active={tweet.viewer.bookmarked}
                        onClick={() => handleEngagement(tweet.id, "bookmarked")}
                      />
                      <EngagementButton
                        icon={Share}
                        label="Share"
                        count={undefined}
                      />
                    </footer>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="self-start rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <MoreHorizontal className="size-5" />
                  </Button>
                </article>
              ))}
            </div>
          </ScrollArea>
        </main>

        <aside className="hidden w-[320px] shrink-0 flex-col gap-5 xl:flex">
          <div className="sticky top-6 flex flex-col gap-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search Pulse"
                className="h-11 rounded-full border bg-background pl-11 pr-4"
              />
            </div>

            <Card className="rounded-3xl border bg-background/80 shadow-sm backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold">
                  What&apos;s happening
                </CardTitle>
                <CardDescription>
                  Curated design energy across your network
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                {trends.map((trend) => (
                  <div key={trend.title} className="space-y-1">
                    <BadgePill
                      variant="outline"
                      className="rounded-full text-xs text-muted-foreground"
                    >
                      {trend.category}
                    </BadgePill>
                    <div className="text-sm font-semibold">{trend.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {trend.stat}
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-fit px-0 text-sky-500">
                  Show more
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border bg-background/80 shadow-sm backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold">Who to follow</CardTitle>
                <CardDescription>
                  Build a sharper feed by following creators
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {suggestions.map((profile) => (
                  <div key={profile.handle} className="flex items-center gap-3">
                    <Avatar className="size-11">
                      <AvatarImage src={profile.avatar} alt={profile.name} />
                      <AvatarFallback>
                        {profile.name
                          .split(" ")
                          .map((piece) => piece[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-sm leading-tight">
                      <div className="flex items-center gap-1 font-semibold">
                        {profile.name}
                      </div>
                      <div className="text-muted-foreground">
                        @{profile.handle}
                      </div>
                    </div>
                    <Button size="sm" className="rounded-full bg-sky-500 text-white">
                      Follow
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" className="w-fit px-0 text-sky-500">
                  Show more
                </Button>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
      </div>
    </TooltipProvider>
  )
}

type EngagementButtonProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  count?: number
  onClick?: () => void
  active?: boolean
  activeClass?: string
}

function EngagementButton({
  icon: Icon,
  label,
  count,
  active,
  onClick,
  activeClass,
}: EngagementButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-full px-3 text-xs text-muted-foreground hover:bg-muted/60",
        active && (activeClass ?? "text-sky-500")
      )}
    >
      <Icon className="size-4" />
      <span className="hidden sm:inline">{label}</span>
      {typeof count === "number" ? (
        <span className="sm:hidden">{count}</span>
      ) : null}
      {typeof count === "number" ? (
        <span className="hidden font-medium sm:inline">{count}</span>
      ) : null}
    </Button>
  )
}
