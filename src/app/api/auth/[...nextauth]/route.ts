import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (
                credentials: { username: string; password: string },
                req: any
            ) => {
                try {
                    const data = JSON.stringify({
                        "username": credentials.username,
                        "password": credentials.password
                    });

                    const response = await fetch('http://213.130.144.85:1010/auth/login', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: data
                    });

                    const user = await response.json();


                    if (response.ok && user) {
                        return Promise.resolve(user);
                    } else {
                        return Promise.reject(new Error(response.statusText || 'Invalid credentials'));
                    }
                } catch (error) {
                    // console.error('An error occurred', error);
                    return Promise.reject(new Error('An error occurred'));
                }
            },
        }),
    ],
    session: {
        jwt: true,
    },
    jwt: {
        secret: '0ddf5597e02d981f8803c4cc11f015a4e52679d706edb29b595d9e466def5bcf95273a3053ab5d97ee893c23e4023b912daefaade316406a33b7685d4d223dfa', // Replace with a long, randomly generated string
    },
    pages: {
        signIn: '/auth/login', // URL to redirect to for logging in
    },
    callbacks: {
        async jwt({ token, account, user }) {
            if (user) {
                token.user = user.user;
                token.token = user.token
            }
            return token
        },
        async session({ session, token }) {
            session.token = token.token
            session.user = token.user
            return session
        },
    },

})

export { handler as GET, handler as POST }