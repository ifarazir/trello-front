"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MultipleSelector from "@/components/ui/multiple-selector";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";  // Assuming Select components exist in shadcn

import { FetchUserIndex } from "@/fetch/user";
import { useQuery } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { FetchTaskCreate } from "@/fetch/task";
import { title } from "process";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    estimate: z.string().optional(),
    dueDate: z.date().optional(),
    uploadPhoto: z.any().optional(),
    assignee: z.array(
        z.object({
            value: z.string(),
            label: z.string(),
        })
    ).min(1, "At least one assignee is required"),
    status: z.enum(["todo", "doing", "done"]).default("todo"),
});

export default function TaskCreateModal({ workspace_id }: { workspace_id: string }) {
    const { data: session, status } = useSession();
    const { toast } = useToast();

    const [users, setUsers] = useState<User[] | undefined>(undefined);

    useEffect(() => {
        if (session?.token?.access_token) {
            FetchUserIndex(session?.token?.access_token as string).then((userList: void | User[]) => {
                setUsers(userList as User[]);
            });
        }
    }, [status, session?.token?.access_token]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            estimate: '',
            dueDate: undefined,
            uploadPhoto: null,
            assignee: [],
            status: "todo",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // {
        //     "title": "Sample Task",
        //         "description": "This is a sample task description.",
        //             "status": "pending",
        //                 "estimated_time": 120,
        //                     "actual_time": 0,
        //                         "due_date": "2024-12-31T23:59:59",
        //                             "priority": "medium",
        //                                 "workspace_id": 1,
        //                                     "assignee_id": 1
        // }

        const data = {
            title: values.title,
            description: values.description,
            status: values.status,
            estimated_time: values.estimate,
            due_date: values.dueDate,
            assignee_id: values.assignee[0].value,
            workspace_id: workspace_id,
        }

        FetchTaskCreate(session?.token?.access_token as string, data).then(() => {
            toast({
                title: 'Success!',
                description: 'Task created successfully.',
                variant: 'default',
            });
            form.reset(); // Reset the form
        });
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant={"outline"} className="flex gap-1 items-center rounded-full h-8 px-5 mt-5">
                    <PlusIcon size={14} color="#333" />
                    Add
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new task.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Task title" {...field} />
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
                                        <Textarea placeholder="Task description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="estimate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estimate</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Estimate" type="number" min={1} max={5} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col w-full">
                                    <FormLabel>Due Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild className="w-full">
                                            <FormControl className="w-full">
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="uploadPhoto"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload Photo</FormLabel>
                                    <FormControl>
                                        <Input type="file" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="assignee"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Assignee</FormLabel>
                                    <FormControl>
                                        <MultipleSelector
                                            defaultOptions={
                                                users?.map(user => ({
                                                    value: user.id.toString(),
                                                    label: `@${user.username}`,
                                                })) || []
                                            }
                                            options={field.value}
                                            maxSelected={1}
                                            {...field}
                                            placeholder="Select user ..."
                                            onSearch={(search) => {
                                                return users?.filter((user) => user.username.includes(search)).map((user) => ({
                                                    value: user.id.toString(),
                                                    label: `@${user.username}`,
                                                })) || [];
                                            }}
                                            emptyIndicator={
                                                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                                    No results found.
                                                </p>
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todo">To Do</SelectItem>
                                                <SelectItem value="doing">Doing</SelectItem>
                                                <SelectItem value="done">Done</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
