"use client";

import Loading from '@/components/ui/loading';
import { FetchWorkspaceIndex } from '@/fetch/workspace';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Workspaces from './workspaces';

const DashboardPage: React.FC = () => {
    const { data: session, status } = useSession()
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            // User is authenticated, allow access
        } else if (status === 'loading') {
            // Session is loading
        } else {
            // User is not authenticated, redirect to login page
            router.push('/auth/login');
        }
    }, [status]);

    if (status === 'loading') {
        return <Loading />;
    }

    return (
        <div className="container mx-auto py-3">
            {/* Dashboard content */}
            <Workspaces />
        </div>
    );
};

export default DashboardPage;
