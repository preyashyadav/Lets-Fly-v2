import React from 'react';
import Head from "next/head";
import Link from "next/link";
import { FaCaretLeft } from 'react-icons/fa';

const Booking = ({ siteName, response, tst, auth, router }) => {

    const meals = (e) => {
        e.preventDefault();
        const data = {
            meal: "Standard Meal"
        }
        addOn(data, "Meal");
    }

    const hotel = (e) => {
        e.preventDefault();
        const data = {
            hotel: "3 Star Hotel"
        }
        addOn(data, "Hotel");
    }

    const cab = (e) => {
        e.preventDefault();
        const data = {
            cab: "Economy CAB"
        }
        addOn(data, "CAB");

    }
    const addOn = async (data, type) => {
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/booking/${response.data[0]._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": auth.token
            },
            body: JSON.stringify({ data })
        });
        const res = await req.json();
        if (res.type == "success") {
            tst(`${type} Added Successfully`, res.type);
            setTimeout(() => {
                router.push(`/user/booking/${response.data[0]._id}`);
            }, 1500);
        } else {
            tst(`${type} Not Added`, res.type);
        }
    }

    return (
        <>
            <Head>
                <title>{`Booking | ${siteName}`}</title>
            </Head>

            <div className="back-to-home">
                <Link href={"/user/booking"} legacyBehavior><a><FaCaretLeft /> Back</a></Link>
            </div>

            {response.type == "success" && <div className="uk-container uk-margin-large-top">
                <h3 className="uk-text-uppercase uk-text-center">Booking Details</h3>
                {response.data.length !== 0 && <div className="uk-overflow-auto">
                    <div className="uk-flex uk-flex-middle uk-flex-center">
                        <div className="uk-card uk-card-default uk-card-body">
                            <p><strong>Booking ID: </strong>{response.data[0]._id}</p>
                            <p><strong>Flight: </strong>{response.data[0].flight_number} • {response.data[0].company}</p>
                            <p><strong>Duration: </strong>{response.data[0].flight_time} | {response.data[0].distance}</p>
                            <p><strong>Departure: </strong>{response.data[0].departure_ap.city} - {response.data[0].departure_ap.name} • Terminal - {response.data[0].departure_ap.terminal} | {response.data[0].departure_ap.time}</p>
                            <p><strong>Arrival: </strong>{response.data[0].arrival_ap.city} - {response.data[0].arrival_ap.name} • Terminal - {response.data[0].arrival_ap.terminal} | {response.data[0].arrival_ap.time}</p>
                            <p><strong>Price: </strong>{response.data[0].price} INR</p>
                            <p><strong>Meal: </strong>{(response.data[0].add_on && response.data[0].add_on.meal) || "NA"}</p>
                            <p><strong>Hotel: </strong>{(response.data[0].add_on && response.data[0].add_on.hotel) || "NA"}</p>
                            <p><strong>CAB: </strong>{(response.data[0].add_on && response.data[0].add_on.cab) || "NA"}</p>
                            <p><strong>Booked By: </strong>{response.data[0].name}</p>
                            <p className='uk-flex uk-flex-between uk-flex-center'>
                                <button className="uk-margin-top uk-button uk-button-default" onClick={meals}>Add Meals</button>
                                <button className="uk-margin-top uk-button uk-button-default" onClick={hotel}>Book Hotel</button>
                                <button className="uk-margin-top uk-button uk-button-default" onClick={cab}>Book CAB</button>
                            </p>
                        </div>
                    </div>
                </div>}
            </div>}
        </>
    )
}

export default Booking;

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

    const slug = context.params.slug;

    const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/booking/${slug}`, {
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