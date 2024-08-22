import React, { useState, useEffect } from "react";
import styles from "@/styles/Login.module.scss";
import Head from "next/head";
import Link from 'next/link';
import axios from "axios";
import { FaCaretLeft } from 'react-icons/fa';

function Login({ tst, siteName, router }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (document.cookie.includes("aviation-user") && document.cookie.split("aviation-user=")[1].split(";")[0].length > 0)
            router.push("/");
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (!email || !password) {
            tst("Please fill all the fields", "error");
        }
        setLoading(true);
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const res = await req.json();
        setLoading(false);
        if (res.type === "success") {
            tst(res.message, "success");
            document.cookie = `aviation-user=${res.data}; path=/; expires=${new Date(Date.now() + 86400000)};`;
            setTimeout(() => {
                router.push("/");
            }, 2000);
        } else {
            if (Array.isArray(res.message)) {
                (res.message).forEach(error => {
                    tst(error.msg, "error");
                });
            } else {
                tst(res.message, "error");
            }
        }
    }

    return (
        <>
            <Head>
                <title>{`Login | ${siteName}`}</title>
            </Head>

            <div className="back-to-home">
                <Link href={"/"} legacyBehavior><a><FaCaretLeft /> HOME</a></Link>
            </div>

            <div className={styles.form_wrap}>
                <div className={styles.form}>
                    <form onSubmit={handleSubmit} className="uk-width-medium">
                        <fieldset class="uk-fieldset">
                            <legend class="uk-legend">Welcome</legend>
                            <div class="uk-margin">
                                <input class="uk-input" type="email" name="email" placeholder="Email" aria-label="Email" />
                            </div>
                            <div class="uk-margin">
                                <input className="uk-input" type="password" name="password" placeholder="Password" />
                            </div>
                            <button className={`${loading && "btn-disabled"} uk-width-full uk-margin-bottom uk-button uk-button-other`}>{loading ? "Processing..." : "Login"}</button>
                        </fieldset>
                    </form>
                    <p>Not a member? <Link href={"/auth/register"}>Register</Link></p>
                    <Link href={"/auth/reset"}>Forgot Password ?</Link>
                </div>
            </div>
        </>
    );
}

export default Login;