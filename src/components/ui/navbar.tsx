"use client";

import { Button } from "@/components/ui/button";
import { LayoutPanelLeft, LogOut, User, User2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Nav() {
    const { data: session, status } = useSession()

    return (
        <header className="bg-blue-600 border-b text-white py-4">
            <div className="container mx-auto flex items-center justify-between gap-5">
                <Link href="/dashboard">
                    <p className='text-3xl text-start font-black text-white'>
                        Trello
                    </p>
                </Link>

                {
                    status == 'loading' && (
                        <div className="bg-gray-700/10 h-10 rounded w-32 animate-pulse"></div>
                    )
                }

                {
                    status == 'unauthenticated' && (
                        <Link href="/auth/login">
                            <Button variant={"default"}>
                                <User2 className="w-4 h-4 mr-2" />
                                Sign In
                            </Button>
                        </Link>
                    )
                }

                {
                    status == 'authenticated' && (
                        <div>
                            <Link href="/admin" className="ml-auto">
                                <Button variant={"link"} className="text-white">
                                    <User className="w-4 h-4 mr-2" />
                                    Profile
                                </Button>
                            </Link>
                            {/* <Link href="/auth/logout">
                                <Button variant={"outline"}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            </Link> */}
                        </div>
                    )
                }
            </div>
        </header>
    )
}