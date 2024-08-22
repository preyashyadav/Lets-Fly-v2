import React from 'react';
import Navbar from '@/Components/admin/Navbar';
import Link from 'next/link';
import Head from 'next/head';

export default function Index({ response, siteName, logout }) {
    return (
        <>
            <Head>
                <title>{`Dashboard • Admin | ${siteName}`}</title>
            </Head>
            <Navbar siteName={siteName} logout={logout} />
            <section className='uk-container uk-margin-large-top'>
                <div class="uk-flex uk-flex-center uk-flex-middle uk-margin-top">
                    <Link href='/admin/bookings' style={{ textDecoration: "none", height: "15rem" }}>
                        <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-margin-left uk-margin-right">
                            <h3 class="uk-card-title uk-text-center">{response.bookings || 0}</h3>
                            <p className='uk-text-center uk-text-uppercase'>Bookings</p>
                        </div>
                    </Link>
                    <Link href='/admin/queries' style={{ textDecoration: "none", height: "15rem" }}>
                        <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-margin-left uk-margin-right">
                            <h3 class="uk-card-title uk-text-center">{response.queries || 0}</h3>
                            <p className='uk-text-center uk-text-uppercase'>Queries</p>
                        </div>
                    </Link>
                    <Link href='/admin/users' style={{ textDecoration: "none", height: "15rem" }}>
                        <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-margin-left uk-margin-right">
                            <h3 class="uk-card-title uk-text-center">{response.users || 0}</h3>
                            <p className='uk-text-center uk-text-uppercase'>Users</p>
                        </div>
                    </Link>
                </div>
            </section>
        </>
    );
}


export async function getServerSideProps(context) {
    const cookies = context.req.headers.cookie;
    const cookie = cookies && cookies.split(';').map(cookie => cookie.split('=')).reduce((acc, [key, value]) => ({ ...acc, [key.trim()]: decodeURIComponent(value) }), {});
    const token = cookie && cookie['aviation-user'];

    if (!token)
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false,
            },
        }

    let adminReq = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/getuser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token
        }
    });
    const adminRes = await adminReq.json();
    if (adminRes.data.role !== "admin")
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false,
            },
        }

    let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token,
        }
    });
    const user = await req.json();
    req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/contact`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token,
        }
    });
    const query = await req.json();

    req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/booking/admin/all`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token,
        }
    });
    const booking = await req.json();

    return {
        props: {
            response: {
                users: user.data.length,
                queries: query.data.length,
                bookings: booking.data.length,
                token
            },
        },
    };
}
