"use client";

import { Button } from "@/components/ui/button";
import { FetchWorkspaceIndex } from "@/fetch/workspace";
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

            {
                workspaces?.map((workspace) => {
                    console.log(workspace)
                    return (
                        <div key={workspace.id}>
                            <h2>{workspace.name}</h2>
                        </div>
                    )
                })
            }
        </div>
    );
}