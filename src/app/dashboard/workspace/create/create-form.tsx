"use client";

import { FetchUserIndex } from "@/fetch/user";
import { FetchWorkspaceIndex } from "@/fetch/workspace";
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

const formSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().max(255),
    users: z.array(z.number())
})

export default function WorkspaceCreateForm() {
    const { data: session, status } = useSession()

    const [users, setUsers] = useState<User[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            users: []
        },
    })

    useEffect(() => {
        if (status === 'authenticated' || session?.token?.access_token) {
            FetchUserIndex(session?.token?.access_token as string).then((userList: void | User[]) => {
                setUsers(userList as User[]);
            })
        }
    }, [status])

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold py-3">Workspaces | <span className="font-light">Create</span></h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}