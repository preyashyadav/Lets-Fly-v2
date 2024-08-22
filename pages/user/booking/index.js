import React from 'react';
import Head from "next/head";
import Link from "next/link";
import { FaCaretLeft } from 'react-icons/fa';

const Index = ({ siteName, response }) => {

    return (
        <>
            <Head>
                <title>{`Bookings | ${siteName}`}</title>
            </Head>

            <div className="back-to-home">
                <Link href={"/"} legacyBehavior><a><FaCaretLeft /> Home</a></Link>
            </div>

            {response.type == "success" && <div className="uk-container uk-margin-large-top uk-padding-large-top">
                <h3 className="uk-text-center uk-text-uppercase">My Bookings</h3>
                {response.data.length !== 0 ? <div class="uk-overflow-auto">
                    <table class="uk-table uk-table-small uk-table-divider uk-table-middle">
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Trip</th>
                                <th>Booking ID</th>
                                <th>Departure</th>
                                <th>Arrival</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {response.data.map((booking, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{booking.departure_ap.city} - {booking.arrival_ap.city}</td>
                                    <td>{booking._id}</td>
                                    <td>{booking.departure_ap.time}<br />{booking.departure_ap.city} • Terminal - {booking.departure_ap.terminal}</td>
                                    <td>{booking.arrival_ap.time}<br />{booking.arrival_ap.city} • Terminal - {booking.arrival_ap.terminal}</td>
                                    <td>
                                        <Link legacyBehavior href={`/user/booking/${booking._id}`}><a className="uk-button uk-button-default uk-button-small">View</a></Link>
                                        <Link legacyBehavior href={`/user/boarding/${booking._id}`}><a className="uk-button uk-button-default uk-button-small uk-margin-small-left">Check-in</a></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> : <div className="uk-text-center uk-margin-top"><h5>No Bookings Found</h5></div>}

            </div>}

        </>
    )
}

export default Index;

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

    const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/booking/all`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token
        }
    });
    let res = await req.json();
    return {
        props: {
            response: res
        },
    };
}