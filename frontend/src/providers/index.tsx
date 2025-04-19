'use client'

import React from "react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {AuthProvider} from "@/context/auth.context";
import {ModalsProvier} from "@/context/modals.context";
import {Toaster} from "@/components/ui/sonner";
import {ChatProvider} from "@/context/chat.context";
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient();

export function Providers({children}: { children: React.ReactNode }) {
  return (
      <>
        <NextThemesProvider attribute="class" defaultTheme="light">
          <QueryClientProvider contextSharing={true} client={queryClient}>
            <AuthProvider>
              <ModalsProvier>
                <ChatProvider>
                  {children}
                  <Toaster/>
                </ChatProvider>
              </ModalsProvier>
            </AuthProvider>
          </QueryClientProvider>
        </NextThemesProvider>
      </>
  )
}