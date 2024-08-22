import React, { useState, useEffect } from 'react'
import styles from "@/styles/Register.module.scss";
import Head from 'next/head';
import Link from 'next/link';
import { FaCaretLeft } from 'react-icons/fa';

const Reset = ({ siteName, tst, router }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (document.cookie.includes("aviation-user") && document.cookie.split("aviation-user=")[1].split(";")[0].length > 0)
            router.push("/");
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const email = e.target.email.value;
        if (email) {
            const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/reset`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    url: `${process.env.NEXT_PUBLIC_URL}/auth/resetpassword`
                })
            });
            const res = await data.json();
            if (res.type === "success") {
                tst(res.message, "success");
                setEmail("");
            } else {
                tst(res.message, "error");
            }
        } else {
            tst("Please fill all the fields", "error");
        }
        setLoading(false);
    }

    return (
        <>
            <Head>
                <title>{`Reset Password | ${siteName}`}</title>
            </Head>

            <div className="back-to-home">
                <Link href={"/"} legacyBehavior><a><FaCaretLeft /> HOME</a></Link>
            </div>

            <div className={styles.form_wrap}>
                <div className={styles.form}>
                    <form onSubmit={handleSubmit} className="uk-width-medium">
                        <fieldset class="uk-fieldset">
                            <legend class="uk-legend">Reset Password</legend>
                            <div class="uk-margin">
                                <input class="uk-input" type="email" name="email" placeholder="Email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" />
                            </div>
                            <button className={`${loading && "btn-disabled"} uk-width-full uk-margin-bottom uk-button uk-button-other`}>{loading ? "Processing..." : "Reset Now"}</button>
                        </fieldset>
                    </form>
                    <Link href={"/auth/login"}>Back to Login ?</Link>
                </div>
            </div>
        </>
    )
}

export default Reset