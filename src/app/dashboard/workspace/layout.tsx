"use client";

import Nav from "@/components/ui/navbar";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from 'next-auth/react';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <main>{children}</main>
        </QueryClientProvider>
    )
}