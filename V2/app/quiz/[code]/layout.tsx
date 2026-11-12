import type React from "react"
import type { Metadata } from "next"

const API_BASE_URL  = "https://faucetdrops-backend.onrender.com"
const SITE_URL      = "https://app.faucetdrops.io"
const DEFAULT_IMAGE = "/og-image.png"

async function fetchQuiz(code: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/quiz/${code}`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.success && data.quiz ? data.quiz : null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const p    = await params
  const code = String(p.code ?? Object.values(p)[0]).toUpperCase()

  const quiz = await fetchQuiz(encodeURIComponent(code))
  if (!quiz) return {} // falls back to the site default preview

  const reward = quiz.reward?.poolAmount
    ? ` Win a share of ${quiz.reward.poolAmount} ${quiz.reward.tokenSymbol}.`
    : ""

  const title       = `${quiz.title} | FaucetDrops Quiz`
  const description = (
    quiz.description || `Join the live quiz with code ${code}.${reward}`
  ).slice(0, 200)
  const url = `${SITE_URL}/quiz/${code}`

  // Use the quiz's own cover; fall back to the site image.
  // The API returns the raw DB row, so the key is cover_image_url.
  const img   = (quiz.coverImageUrl ?? quiz.cover_image_url) as string | undefined
  const image = img && img.startsWith("http") ? img : DEFAULT_IMAGE

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
      images: [{ url: image, alt: quiz.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children
}