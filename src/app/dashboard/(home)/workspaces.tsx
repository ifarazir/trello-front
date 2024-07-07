"use client";

import { Button } from "@/components/ui/button";
import { FetchWorkspaceIndex } from "@/fetch/workspace";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Workspaces() {
    const { data: session, status } = useSession()

    const [workspaces, setWorkspaces] = useState<Workspace[]>([])

    useEffect(() => {
        if (status === 'authenticated' || session?.token?.access_token) {
            FetchWorkspaceIndex(session?.token?.access_token as string).then((workspacesData: void | Workspace[]) => {
                setWorkspaces(workspacesData as Workspace[]);
            })
        }
    }, [status])

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold py-3">Workspaces</h1>

                <Link href={`/dashboard/workspace/create`}>
                    <Button>Create</Button>
                </Link>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {
                    workspaces?.map((workspace) => {
                        return (
                            <div key={workspace.id} className="bg-white p-4 rounded-xl shadow border flex flex-col justify-between">
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-xl mb-2">{workspace.name}</h3>
                                    <p className="text-gray-500 text-sm">
                                        {workspace.description}
                                    </p>
                                </div>

                                <div className="mt-3">
                                    <Link href={`/dashboard/workspace/${workspace.id}`}>
                                        <Button variant="ghost" className="rounded-full px-2 py-0 h-8 bg-gray-100">
                                            View

                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}