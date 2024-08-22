import React, { useState } from "react";
import styles from "@/styles/Register.module.scss";
import Head from "next/head";
import Link from 'next/link';
import { FaCaretLeft } from 'react-icons/fa';

const Register = ({ tst, siteName, router }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (!name || !email || !password || !confirmPassword) {
            tst("Please fill all the fields", "error");
        }

        if (password !== confirmPassword) {
            tst("Passwords do not match", "error");
        }

        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/newuser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
                confirmPassword,
                verification_url: `${process.env.NEXT_PUBLIC_URL}/auth/verify`,
            }),
        });

        const res = await req.json();

        if (res.type === "success") {
            tst(res.message, "success");
            setTimeout(() => {
                router.push("/auth/login");
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
                <title>{`Register | ${siteName}`}</title>
            </Head>

            <div className="back-to-home">
                <Link href={"/"} legacyBehavior><a><FaCaretLeft /> HOME</a></Link>
            </div>

            <div className={styles.form_wrap}>
                <div className={styles.form}>
                    <form onSubmit={handleSubmit} className="uk-width-medium">
                        <fieldset class="uk-fieldset">
                            <legend class="uk-legend">Register</legend>
                            <div class="uk-margin">
                                <input class="uk-input" type="text" name="name" placeholder="Name" />
                            </div>
                            <div class="uk-margin">
                                <input class="uk-input" type="email" name="email" placeholder="Email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" />
                            </div>
                            <div class="uk-margin">
                                <input className="uk-input" type="password" name="password" placeholder="Password" />
                            </div>
                            <div class="uk-margin">
                                <input className="uk-input" type="password" name="confirmPassword" placeholder="Confirm Password" />
                            </div>
                            <button className={`${loading && "btn-disabled"} uk-width-full uk-margin-bottom uk-button uk-button-other`}>{loading ? "Processing..." : "Register"}</button>
                        </fieldset>
                    </form>
                    <p>Already a member? <Link href={"/auth/login"}>Login</Link></p>
                </div>
            </div>
        </>
    );
};

export default Register;