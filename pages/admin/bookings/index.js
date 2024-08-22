import React from 'react';
import Navbar from '@/Components/admin/Navbar';
import Head from 'next/head';

export default function Index({ response, siteName, router, logout, tst }) {

    const deleteData = async (e) => {
        const id = e.target.id.split("-")[1];
        if (confirm("Are you sure, you want to delete this booking ?")) {
            const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/booking/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": response.token,
                }
            });
            const res = await req.json();
            tst(res.message, res.type);
            setTimeout(() => {
                router.push("/admin/bookings");
            }, 1500);
        }
    }

    return (
        <>
            <Head>
                <title>{`Bookings • Admin | ${siteName}`}</title>
            </Head>
            <Navbar siteName={siteName} logout={logout} />
            <div className="uk-section uk-margin-remove-top uk-padding-remove-top events admin-font">
                <div className="uk-container">
                    <h2 className='title uk-text-center uk-text-bolder uk-text-uppercase uk-margin-medium-bottom'>Bookings</h2>
                    {(response.res.data && response.res.data.length > 0) ? <table className="uk-table uk-table-responsive uk-table-middle uk-table-divider">
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Book By</th>
                                <th>Booking ID</th>
                                <th>Trip</th>
                                <th>Departure</th>
                                <th>Arrival</th>
                                <th>Add-on</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {response.res.data.map((event, index) => {
                                return <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{event.name}</td>
                                    <td>{event._id}</td>
                                    <td>{event.departure_ap.city} - {event.arrival_ap.city}</td>
                                    <td>{event.departure_ap.time}<br />{event.departure_ap.city} • Terminal - {event.departure_ap.terminal}</td>
                                    <td>{event.arrival_ap.time}<br />{event.arrival_ap.city} • Terminal - {event.arrival_ap.terminal}</td>
                                    {event.add_on && <td>
                                        <ul className="uk-list uk-list-bullet">
                                            {event.add_on.meal && <li>{event.add_on.meal}</li>}
                                            {event.add_on.hotel && <li>{event.add_on.hotel}</li>}
                                            {event.add_on.cab && <li>{event.add_on.cab}</li>}
                                        </ul>
                                    </td> || <td>No Add-ons</td>}
                                    <td><button type="button" onClick={deleteData} id={`del-${event._id}`} className='uk-button uk-button-danger uk-button-small'>delete</button></td>
                                </tr>
                            })}
                        </tbody>
                    </table> : <p className='uk-text-center uk-text-large uk-margin-auto uk-margin-large-top uk-text-bolder uk-text-danger'>There are no users.</p>}
                </div>
            </div>
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

    const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/booking/admin/all`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token,
        }
    });
    const res = await req.json();

    return {
        props: {
            response: { res, token },
        },
    };
}
