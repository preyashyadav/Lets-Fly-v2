import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaCaretLeft } from 'react-icons/fa';

import styles from "@/styles/Boarding.module.scss";

const Boarding = ({ siteName, response }) => {

    const trim = (data) => {
        if (data.length > 12)
            return `${data.substring(0, 12)}...`;
        else
            return data;
    }

    const getDate = (date) => {
        let sep = date.split(" | ");
        const flightDay = sep[0].split("-")[0];
        const flightMonth = sep[0].split("-")[1];
        const flightYear = sep[0].split("-")[2];
        const flightDate = new Date(`${flightMonth}-${flightDay}-${flightYear}`);
        const day = flightDate.toString().split(" ")[0];
        const month = flightDate.toString().split(" ")[1];
        const dateNum = flightDate.toString().split(" ")[2];
        const year = flightDate.toString().split(" ")[3];
        const newDate = `${day}, ${dateNum} ${month} ${year}`;
        return newDate;
    }

    const gate = () => {
        const gateNum = Math.floor(Math.random() * 10) + 1;
        const gateAlp = String.fromCharCode(65 + Math.floor(Math.random() * 6));
        return `${gateAlp}${gateNum}`;
    }

    const seat = () => {
        const gateNum = Math.floor(Math.random() * 30) + 1;
        const gateAlp = String.fromCharCode(65 + Math.floor(Math.random() * 6));
        return `${gateNum}${gateAlp}`;
    }

    const getTime = (data) => {
        const time = data.split(" | ")[1];
        const hour = time.split(":")[0];
        const min = time.split(":")[1];
        const newTime = `${hour}:${min}`;
        return newTime;
    }

    const boardingTime = (time) => {
        let hour = time.split(":")[0];
        const min = time.split(":")[1];

        if (hour <= 1) {
            const newHour = 12;
            const newTime = `${newHour}:${min}`;
            return newTime;
        } else {
            let newHour = hour - 1;
            newHour = (parseInt(newHour) < 10) ? "0" + newHour : newHour;
            const newTime = `${newHour}:${min}`;
            return newTime;
        }
    }

    const duration = (data) => {
        return `${data.split(" ")[0]}:${data.split(" ")[2]}`;
    }

    return (
        <>
            <Head>
                <title>{`Boarding Pass | ${siteName}`}</title>
            </Head>

            <div className="back-to-home">
                <Link href={"/user/booking"} legacyBehavior><a><FaCaretLeft /> Back</a></Link>
            </div>

            <div className={styles.body}>
                <div className={styles.boarding_pass}>
                    <header>
                        <div className={styles.logo}>
                            <span>{trim(response.data[0].company)}</span>
                        </div>
                        <div className={styles.flight}>
                            <small>flight</small>
                            <strong>{response.data[0].flight_number}</strong>
                        </div>
                    </header>
                    <section className={styles.cities}>
                        <div className={styles.city}>
                            <small>{response.data[0].departure_ap.city}</small>
                            <strong>{response.data[0].departure_ap.code}</strong>
                        </div>
                        <div className={styles.city}>
                            <small>{response.data[0].arrival_ap.city}</small>
                            <strong>{response.data[0].arrival_ap.code}</strong>
                        </div>
                        <svg className={styles.airplane}>
                            <use xlinkHref="#airplane"></use>
                        </svg>
                    </section>
                    <section className={styles.infos}>
                        <div className={styles.places}>
                            <div className={styles.box}>
                                <small>Terminal</small>
                                <strong>
                                    <em>{response.data[0].departure_ap.terminal}</em>
                                </strong>
                            </div>
                            <div className={styles.box}>
                                <small>Gate</small>
                                <strong>
                                    <em>{gate()}</em>
                                </strong>
                            </div>
                            <div className={styles.box}>
                                <small>Seat</small>
                                <strong>{seat()}</strong>
                            </div>
                            <div className={styles.box}>
                                <small>Class</small>
                                <strong>E</strong>
                            </div>
                        </div>
                        <div className={styles.times}>
                            <div className={styles.box}>
                                <small>Boarding</small>
                                <strong>{boardingTime(getTime(response.data[0].departure_ap.time))}</strong>
                            </div>
                            <div className={styles.box}>
                                <small>Departure</small>
                                <strong>{getTime(response.data[0].departure_ap.time)}</strong>
                            </div>
                            <div className={styles.box}>
                                <small>Duration</small>
                                <strong>{duration(response.data[0].flight_time)}</strong>
                            </div>
                            <div className={styles.box}>
                                <small>Arrival</small>
                                <strong>{getTime(response.data[0].arrival_ap.time)}</strong>
                            </div>
                        </div>
                    </section>
                    <section className={styles.strap}>
                        <div className={styles.box}>
                            <div className={styles.passenger}>
                                <small>passenger</small>
                                <strong>{response.data[0].name}</strong>
                            </div>
                            <div className={styles.date}>
                                <small>Date</small>
                                <strong>{getDate(response.data[0].departure_ap.time)}</strong>
                            </div>
                        </div>
                        <svg className={styles.qrcode}>
                            <use xlinkHref="#qrcode"></use>
                        </svg>
                    </section>
                </div>

                <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" display="none">
                    <symbol id="airplane" viewBox="243.5 245.183 25 21.633">
                        <g>
                            <path
                                fill="#336699"
                                d="M251.966,266.816h1.242l6.11-8.784l5.711,0.2c2.995-0.102,3.472-2.027,3.472-2.308
                              c0-0.281-0.63-2.184-3.472-2.157l-5.711,0.2l-6.11-8.785h-1.242l1.67,8.983l-6.535,0.229l-2.281-3.28h-0.561v3.566
                              c-0.437,0.257-0.738,0.724-0.757,1.266c-0.02,0.583,0.288,1.101,0.757,1.376v3.563h0.561l2.281-3.279l6.535,0.229L251.966,266.816z
                              "
                            />
                        </g>
                    </symbol>
                    <symbol id="qrcode" viewBox="0 0 130 130">
                        <g>
                            <path
                                fill="#334158"
                                d="M123,3h-5h-5h-5h-5h-5h-5v5v5v5v5v5v5v5h5h5h5h5h5h5h5v-5v-5v-5v-5v-5V8V3H123z M123,13v5v5v5v5h-5h-5h-5
		h-5h-5v-5v-5v-5v-5V8h5h5h5h5h5V13z"
                            />
                            <polygon
                                fill="#334158"
                                points="88,13 88,8 88,3 83,3 78,3 78,8 78,13 83,13 	"
                            />
                            <polygon
                                fill="#334158"
                                points="63,13 68,13 73,13 73,8 73,3 68,3 68,8 63,8 58,8 58,13 53,13 53,8 53,3 48,3 48,8 43,8 43,13 
		48,13 48,18 43,18 43,23 48,23 53,23 53,18 58,18 58,23 63,23 63,18 	"
                            />
                            <polygon
                                fill="#334158"
                                points="108,13 103,13 103,18 103,23 103,28 108,28 113,28 118,28 118,23 118,18 118,13 113,13 	"
                            />
                            <polygon
                                fill="#334158"
                                points="78,18 73,18 73,23 78,23 83,23 83,18 	"
                            />
                            <polygon
                                fill="#334158"
                                points="23,28 28,28 28,23 28,18 28,13 23,13 18,13 13,13 13,18 13,23 13,28 18,28 	"
                            />
                            <polygon
                                fill="#334158"
                                points="53,28 53,33 53,38 58,38 58,33 58,28 58,23 53,23 	"
                            />
                            <rect x="63" y="23" fill="#334158" width="5" height="5" />
                            <rect x="68" y="28" fill="#334158" width="5" height="5" />
                            <path
                                fill="#334158"
                                d="M13,38h5h5h5h5h5v-5v-5v-5v-5v-5V8V3h-5h-5h-5h-5h-5H8H3v5v5v5v5v5v5v5h5H13z M8,28v-5v-5v-5V8h5h5h5h5h5v5
		v5v5v5v5h-5h-5h-5h-5H8V28z"
                            />
                            <polygon
                                fill="#334158"
                                points="48,33 48,28 43,28 43,33 43,38 48,38 	"
                            />
                            <polygon
                                fill="#334158"
                                points="83,38 88,38 88,33 88,28 88,23 83,23 83,28 78,28 78,33 83,33 	"
                            />
                            <polygon
                                fill="#334158"
                                points="23,43 18,43 13,43 8,43 3,43 3,48 8,48 13,48 18,48 23,48 28,48 28,43 	"
                            />
                            <rect x="108" y="43" fill="#334158" width="5" height="5" />
                            <rect x="28" y="48" fill="#334158" width="5" height="5" />
                            <polygon
                                fill="#334158"
                                points="88,53 93,53 93,48 93,43 88,43 88,48 83,48 83,53 	"
                            />
                            <polygon
                                fill="#334158"
                                points="123,48 123,43 118,43 118,48 118,53 118,58 123,58 123,63 118,63 113,63 113,68 118,68 118,73 
		118,78 123,78 123,83 128,83 128,78 128,73 123,73 123,68 128,68 128,63 128,58 128,53 123,53 	"
                            />
                            <polygon
                                fill="#334158"
                                points="98,58 98,63 103,63 103,68 108,68 108,63 108,58 103,58 103,53 103,48 103,43 98,43 98,48 98,53 
		93,53 93,58 	"
                            />
                            <rect x="108" y="53" fill="#334158" width="5" height="5" />
                            <rect x="78" y="63" fill="#334158" width="5" height="5" />
                            <rect x="93" y="63" fill="#334158" width="5" height="5" />
                            <rect x="53" y="68" fill="#334158" width="5" height="5" />
                            <polygon
                                fill="#334158"
                                points="108,73 108,78 108,83 113,83 113,78 113,73 113,68 108,68 	"
                            />
                            <rect x="13" y="73" fill="#334158" width="5" height="5" />
                            <rect x="98" y="73" fill="#334158" width="5" height="5" />
                            <polygon
                                fill="#334158"
                                points="18,83 18,88 23,88 28,88 28,83 23,83 23,78 18,78 	"
                            />
                            <polygon
                                fill="#334158"
                                points="8,83 8,78 8,73 8,68 13,68 13,63 13,58 13,53 8,53 3,53 3,58 3,63 3,68 3,73 3,78 3,83 3,88 8,88 	
		"
                            />
                            <rect x="53" y="83" fill="#334158" width="5" height="5" />
                            <rect x="73" y="83" fill="#334158" width="5" height="5" />
                            <path
                                fill="#334158"
                                d="M108,88v-5h-5h-5h-5h-5v-5h5v-5h-5v-5h-5v5h-5h-5v-5h-5h-5v5h5v5h-5v5v5h5v-5h5v-5h5h5v5v5h-5v5h5v5h-5h-5
		v5h5v5h5v5v5h-5v5h5h5h5v5h5h5h5h5h5h5h5v-5v-5v-5v-5v-5v-5v-5h-5h-5v-5v-5h-5v5H108z M98,118h-5v-5h5V118z M98,103h-5h-5v-5v-5v-5
		h5h5h5v5v5v5H98z M123,118v5h-5h-5v-5h-5h-5v-5h5v-5h5v5v5h5v-5h5V118z M118,98h5v5h-5h-5v-5H118z"
                            />
                            <path
                                fill="#334158"
                                d="M28,93h-5h-5h-5H8H3v5v5v5v5v5v5v5h5h5h5h5h5h5h5v-5v-5v-5v-5v-5v-5v-5h-5H28z M33,103v5v5v5v5h-5h-5h-5h-5
		H8v-5v-5v-5v-5v-5h5h5h5h5h5V103z"
                            />
                            <rect x="93" y="93" fill="#334158" width="5" height="5" />
                            <polygon
                                fill="#334158"
                                points="63,98 68,98 68,93 63,93 58,93 53,93 53,88 48,88 48,83 43,83 43,78 48,78 48,73 43,73 43,68 
		48,68 53,68 53,63 58,63 58,68 63,68 63,63 63,58 68,58 73,58 73,63 78,63 78,58 83,58 83,53 78,53 78,48 83,48 83,43 83,38 78,38 
		78,33 73,33 73,38 73,43 68,43 68,38 68,33 63,33 63,38 63,43 63,48 68,48 73,48 73,53 68,53 63,53 58,53 58,58 53,58 53,53 53,48 
		58,48 58,43 53,43 48,43 43,43 38,43 33,43 33,48 38,48 38,53 33,53 33,58 38,58 43,58 43,63 38,63 33,63 33,68 38,68 38,73 33,73 
		28,73 28,68 28,63 33,63 33,58 28,58 23,58 18,58 18,63 23,63 23,68 18,68 18,73 23,73 23,78 28,78 33,78 38,78 38,83 33,83 33,88 
		38,88 43,88 43,93 43,98 48,98 48,103 53,103 53,98 58,98 58,103 58,108 63,108 63,103 	"
                            />
                            <polygon
                                fill="#334158"
                                points="18,103 13,103 13,108 13,113 13,118 18,118 23,118 28,118 28,113 28,108 28,103 23,103 	"
                            />
                            <polygon
                                fill="#334158"
                                points="48,108 48,103 43,103 43,108 43,113 43,118 43,123 43,128 48,128 53,128 53,123 48,123 48,118 
		48,113 53,113 58,113 58,108 53,108 	"
                            />
                            <polygon
                                fill="#334158"
                                points="78,118 78,113 78,108 73,108 68,108 63,108 63,113 68,113 68,118 63,118 63,123 63,128 68,128 
		68,123 73,123 73,118 	"
                            />
                            <rect x="73" y="123" fill="#334158" width="5" height="5" />
                        </g>
                    </symbol>
                </svg>
            </div>
        </>
    );
};

export default Boarding;

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