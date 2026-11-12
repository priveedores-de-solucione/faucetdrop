import type React from "react"
import type { Metadata } from "next"

const API_BASE_URL  = "https://faucetdrops-backend.onrender.com"
const SITE_URL      = "https://app.faucetdrops.io"
const DEFAULT_IMAGE = "/og-image.png"

// Works for both /quest/<slug> and /quest/<faucetAddress>
async function fetchQuest(slug: string) {
  const paths = [`/api/quests/by-slug/${slug}`, `/api/quests/${slug}`]
  for (const path of paths) {
    try {
      const res = await fetch(`${API_BASE_URL}${path}`, { next: { revalidate: 300 } })
      if (!res.ok) continue
      const data = await res.json()
      if (data?.quest) return data.quest
    } catch { /* try the next one */ }
  }
  return null
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const p    = await params
  const slug = String(p.slug ?? Object.values(p)[0])

  const quest = await fetchQuest(encodeURIComponent(slug))
  if (!quest) return {} // falls back to the site default preview

  const title       = `${quest.title} | FaucetDrops Quest`
  const description = (quest.description || "Complete tasks, earn points and compete for rewards.").slice(0, 200)
  const url         = `${SITE_URL}/quest/${slug}`

  // Use the quest's own image; fall back to the site image for placeholders
  const img   = quest.imageUrl as string | undefined
  const image = img && img.startsWith("http") && !img.includes("placehold.co") ? img : DEFAULT_IMAGE

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "FaucetDrops",
      title,
      description,
      images: [{ url: image, alt: quest.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export default function QuestLayout({ children }: { children: React.ReactNode }) {
  return children
}