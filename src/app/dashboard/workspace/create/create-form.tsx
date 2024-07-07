"use client";

import { FetchUserIndex } from "@/fetch/user";
import { FetchWorkspaceCreate, FetchWorkspaceIndex } from "@/fetch/workspace";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import MultipleSelector from "@/components/ui/multiple-selector";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().max(255),
    users: z.array(
        z.object({
            value: z.string(),
            label: z.string(),
        })
    ).min(1),
})

export default function WorkspaceCreateForm() {
    const { data: session, status } = useSession()
    const { toast } = useToast()
    const router = useRouter();

    const [users, setUsers] = useState<User[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '' as string,
            description: '' as string,
            users: [] as { value: string, label: string }[],
        },
    })

    useEffect(() => {
        if (status === 'authenticated' || session?.token?.access_token) {
            FetchUserIndex(session?.token?.access_token as string).then((userList: void | User[]) => {
                setUsers(userList as User[]);
            })

            // add the current user to form values
            form.setValue("users", [{
                value: session?.user?.id.toString(),
                label: `@${session?.user?.username}`,
                fixed: true
            }])
        }
    }, [status])

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)

        FetchWorkspaceCreate(
            session?.token?.access_token as string,
            values.name,
            values.description,
            values.users.map((user) => parseInt(user.value))
        ).then(() => {
            toast({
                title: 'Success!',
                description: 'Workspace created successfully.',
                variant: 'default'
            });

            // redirect to workspace index
            router.push('/dashboard')
        })
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold py-3">Workspaces | <span className="font-light">Create</span></h1>
            </div>

            {
                users?.length > 0 && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-screen-md mx-auto shadow p-5 rounded-xl border">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="users"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Users</FormLabel>
                                        <FormControl>
                                            <MultipleSelector
                                                defaultOptions={
                                                    users.map((user) => ({
                                                        value: user.id.toString(),
                                                        label: `@${user.username}`,
                                                        disabled: false
                                                    }))
                                                }
                                                options={field.value}
                                                {...field}
                                                placeholder="Select user ..."
                                                onSearch={(search) => {
                                                    return users.filter((user) => user.username.includes(search)).map((user) => ({
                                                        value: user.id.toString(),
                                                        label: `@${user.username}`,
                                                        disabled: false
                                                    }))
                                                }}
                                                emptyIndicator={
                                                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                                        no results found.
                                                    </p>
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                )
            }
        </div>
    );
}