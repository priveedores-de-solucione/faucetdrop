"use client"

import type React from "react"
import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemedToaster } from "@/components/themed-toaster"
import { NetworkProvider } from "@/hooks/use-network"
import { WalletProvider } from "@/components/wallet-provider"
import { PrivyProvider } from "@privy-io/react-auth"
import { Footer } from "@/components/footer"
import { SubscriptionModalProvider } from "@/components/subscribe"
import { useVisitTracker } from "@/hooks/use-visit-tracker"
import { Providers } from "@/components/privyProvider"
import { PinSetupModal } from "@/components/pin-modal"
import { PinEntryModal } from "@/components/pin-entry"
import { PresenceProvider } from "@/components/presence-provider"
import { DMProvider } from "@/components/dm-provider"
import { DMPanel } from "@/components/dm-panel"
// ── Solana wallet adapter ─────────────────────────────────────────────────────
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { PrivyImportModal } from "@/components/privy_import"
import { SignerBootstrap } from "@/components/signer-bootstrap"

function SolanaProviders({ children }: { children: React.ReactNode }) {
  // Memoised so adapter instances are stable across re-renders
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  )

  const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com"

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}

function FooterWrapper() {
  const pathname = usePathname()
  const HIDE_ON = ["/challenge/create"]
  if (HIDE_ON.some(p => pathname.startsWith(p))) return null
  return <Footer />
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  useVisitTracker()

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          loginMethods: ["google", "twitter", "discord", "github", "email"],
        }}
      >
        <SolanaProviders>
          <NetworkProvider>
            <PinSetupModal />
            <PinEntryModal />
            <WalletProvider>
              <SignerBootstrap />
              <PrivyImportModal
                onDismiss={() => console.log("skipped")}
                onComplete={({ evmAddress, solanaAddress }) => console.log(evmAddress, solanaAddress)}
              />
              <Providers>
                <SubscriptionModalProvider>
                  <PresenceProvider>
                    <DMProvider>
                      <div className="min-h-screen flex flex-col">
                        <main className="flex-1">{children}</main>
                        <FooterWrapper />
                      </div>
                      <DMPanel />
                      <ThemedToaster />
                    </DMProvider>
                  </PresenceProvider>
                </SubscriptionModalProvider>
              </Providers>
            </WalletProvider>
          </NetworkProvider>
        </SolanaProviders>
      </PrivyProvider>
    </ThemeProvider>
  )
}