import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const Booking = ({ response, siteName }) => {
    return (
        <>
            <Head>
                <title>{`Status | ${siteName}`}</title>
            </Head>

            <div className="uk-container uk-margin-large-top uk-flex uk-flex-column uk-flex-middle uk-flex-center">
                <h2 className='uk-text-uppercase uk-text-center'>Booking Status</h2>
                <h5 className={`uk-text-center ${response.found ? 'uk-text-success' : 'uk-text-danger'} uk-text-uppercase`}>{response.found ? "Successfull" : "Failed"}</h5>
                <div className="uk-margin-top">
                    <Link href="/" legacyBehavior><a className="uk-button uk-button-default uk-margin-small-right">Home</a></Link>
                    <Link href="/user/booking" legacyBehavior><a className="uk-button uk-button-default uk-button-other">Bookings</a></Link>
                </div>
            </div>
        </>
    )
}

export default Booking

export async function getServerSideProps(context) {
    const slug = context.query;
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

    const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/booking/all`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token
        }
    });

    let res = await req.json();

    if (res.type === "success") {
        if (res.data.length !== 0) {
            res = (res.data.find(booking => booking.order_id === slug.id) && { found: true }) || { found: false };
        } else {
            res['found'] = false;
        }
    }

    return {
        props: {
            response: res
        },
    }
}