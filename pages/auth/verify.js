import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ShowBox from '../../Components/ShowBox';

const Verify = ({ siteName, router }) => {
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState();
    const [msg, setMsg] = useState("");


    useEffect(() => {
        if (document.cookie.includes("aviation-user") && document.cookie.split("aviation-user=")[1].split(";")[0].length > 0)
            router.push("/");
    }, [router]);

    useEffect(() => {
        const url = window.location.href;
        const handle = async () => {
            if (url.includes("code=") && url.includes("user=")) {
                const code = url.split("code=")[1].split("&user=")[0];
                const user_id = url.split("code=")[1].split("&user=")[1];
                setLoading(true);
                const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/verify`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        code,
                        user_id
                    })
                });
                const res = await data.json();
                setType(res.type);
                setMsg(res.message);
                setLoading(false);
            } else {
                setType("error");
                setMsg("Invalid verification link");
            }
            setTimeout(() => {
                router.push("/auth/login");
            }, 5000);
        }
        handle();
    }, []);

    return (
        <>
            <Head>
                <title>{`Verification | ${siteName}`}</title>
            </Head>
            <div className="d-flex justify-content-center align-items-center container h-full">
                <ShowBox type={type} msg={msg} loading={loading} link={'/auth/login'} button_name={'Login'} />
            </div>
        </>
    )
}

export default Verify