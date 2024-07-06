"use client";

import Nav from "@/components/ui/navbar";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from 'next-auth/react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            <Nav />
            <main>{children}</main>
            <Toaster />
        </SessionProvider>
    )
}