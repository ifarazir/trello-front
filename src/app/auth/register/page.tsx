"use client";
import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export default function Page() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true while processing login

        const target = e.target as typeof e.target & {
            username: { value: string };
            email: { value: string };
            password: { value: string };
        };
        const username = target.username.value;
        const email = target.email.value;
        const password = target.password.value;

        try {
            const registerResponse = await fetch('http://213.130.144.85:1010/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const registerResponseData = await registerResponse.json();

            console.log(registerResponse.status);
            if (registerResponse.status !== 200 && registerResponse.status !== 201) {
                toast({
                    title: 'Error!',
                    description: registerResponseData.message,
                    variant: 'destructive'
                });
            }
            else {
                toast({
                    title: 'Success!',
                    description: registerResponseData.message,
                    variant: 'default'
                });

                const res = await signIn('credentials', { redirect: false, username, password });

                // Show success message
                if (res?.ok) {
                    toast({
                        title: 'Success!',
                        description: 'You have successfully logged in.',
                        variant: 'default'
                    });

                    // Redirect user to admin panel
                    router.push('/dashboard');
                } else {
                    toast({
                        title: 'Error!',
                        description: res?.error,
                        variant: 'destructive'
                    });
                }
            }

        } catch (error) {
            toast({
                title: 'Error!',
                description: 'An error occurred while trying to register.',
                variant: 'destructive'
            });
        }


        // Reset loading state after login attempt completes
        setLoading(false);
    };

    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-dvh">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="flex flex-col gap-2 text-center mb-3">
                        <Link href="/">
                            <h1 className='text-3xl w-fit font-light tracking-widest'>
                                Trello
                            </h1>
                        </Link>
                        <p className='text-5xl text-start font-black text-gray-600'>
                            Sign-up
                        </p>
                    </div>
                    <form className="grid gap-4" onSubmit={handleSubmit}>
                        <div className="grid gap-2">
                            <Label htmlFor="email">email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="a@gmail.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="kooshan"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input id="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Loading...' : 'Submit'}
                        </Button>
                    </form>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                {/* <Image
                    src="https://www.grutto.com/storage/landing-pages/arie/grutto-arie-boomsma-6.webp"
                    alt="Grutto Cover"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                /> */}
            </div>
        </div>
    )
}