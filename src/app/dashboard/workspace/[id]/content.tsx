"use client";

import TaskCreateModal from "@/components/create-task";
import { Button } from "@/components/ui/button";
import { FetchWorkspaceIndex, FetchWorkspaceSingle, FetchWorkspaceTasks } from "@/fetch/workspace";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, PencilIcon, PlusIcon, UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Workspace() {
    const params = useParams<{ id: string }>();

    const { data: session, status } = useSession() as any;

    const { status: workspaceStatus, data: workspace }: {
        status: string,
        data: Workspace | undefined,
        error: any
    } = useQuery({
        queryKey: ['workspace', params.id],
        queryFn: () => FetchWorkspaceSingle(session?.token?.access_token as string, params.id as string),
    })

    const { status: workspaceTasksStatus, data: workspaceTasks }: {
        status: string,
        data: Workspace | undefined,
        error: any
    } = useQuery({
        queryKey: ['workspaceTasks', params.id],
        queryFn: () => FetchWorkspaceTasks(session?.token?.access_token as string, params.id as string),
    })

    return (
        <div>
            <div className="bg-gray-100 shadow w-full">
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="text-3xl font-bold py-3">{workspace?.name}</h1>

                    <div className="flex gap-2">
                        <Link href="/dashboard/workspace/[id]/edit" as={`/dashboard/workspace/${params.id}/edit`}>
                            <Button variant={"outline"} className="flex gap-1 items-center rounded-full">
                                <PencilIcon size={14} color="#333" />
                                Edit
                            </Button>
                        </Link>

                        <Link href="/dashboard/workspace/[id]/edit" as={`/dashboard/workspace/${params.id}/edit`}>
                            <Button variant={"outline"} className="flex gap-1 items-center rounded-full">
                                <UserIcon size={14} color="#333" />
                                Users
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto grid grid-cols-3 gap-3 py-5">
                <div className="col-span-3 md:col-span-1 bg-white shadow border rounded-xl p-3">
                    <h2 className="text-lg font-semibold">To Do</h2>

                    <ul>
                        {workspaceTasks?.map(task => (
                            <li key={task.id} className="flex items-center justify-between py-2">
                                <div>
                                    <h3 className="font-semibold">{task.name}</h3>
                                    <p>{task.description}</p>
                                </div>

                                <div>
                                    <Button variant={"outline"} className="flex gap-1 items-center rounded-full">
                                        <ChevronRight size={14} color="#333" />
                                        View
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>


                    <Link href="/dashboard/workspace/[id]/edit" as={`/dashboard/workspace/${params.id}/edit`}>
                        <Button variant={"outline"} className="flex gap-1 items-center rounded-full h-8 px-5 mt-5">
                            <PlusIcon size={14} color="#333" />
                            Add
                        </Button>
                    </Link>

                </div>
                <div className="col-span-3 md:col-span-1 bg-white shadow border rounded-xl p-3">
                    <h2 className="text-lg font-semibold">In Progress</h2>

                    <ul>
                        {workspaceTasks?.map(task => (
                            <li key={task.id} className="flex items-center justify-between py-2">
                                <div>
                                    <h3 className="font-semibold">{task.name}</h3>
                                    <p>{task.description}</p>
                                </div>

                                <div>
                                    <Button variant={"outline"} className="flex gap-1 items-center rounded-full">
                                        <ChevronRight size={14} color="#333" />
                                        View
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <TaskCreateModal isOpen={true} workspace_id={workspace?.id.toString() as string} />
                </div>
                <div className="col-span-3 md:col-span-1 bg-white shadow border rounded-xl p-3">
                    <h2 className="text-lg font-semibold">Done</h2>

                    <ul>
                        {workspaceTasks?.map(task => (
                            <li key={task.id} className="flex items-center justify-between py-2">
                                <div>
                                    <h3 className="font-semibold">{task.name}</h3>
                                    <p>{task.description}</p>
                                </div>

                                <div>
                                    <Button variant={"outline"} className="flex gap-1 items-center rounded-full">
                                        <ChevronRight size={14} color="#333" />
                                        View
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <Link href="/dashboard/workspace/[id]/edit" as={`/dashboard/workspace/${params.id}/edit`}>
                        <Button variant={"outline"} className="flex gap-1 items-center rounded-full h-8 px-5 mt-5">
                            <PlusIcon size={14} color="#333" />
                            Add
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}