import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaCaretLeft } from 'react-icons/fa';
import ShowBox from '../../Components/ShowBox';

const Resetpassword = ({ siteName, tst, router }) => {
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("");
    const [form, setForm] = useState();
    const [url, setUrl] = useState("");
    const [msg, setMsg] = useState("");
    const [count, setCount] = useState(5);

    useEffect(() => {
        if (document.cookie.includes("aviation-user") && document.cookie.split("aviation-user=")[1].split(";")[0].length > 0)
            router.push("/");
    }, [router]);

    useEffect(() => {
        setUrl(window.location.href);
        const handle = async () => {
            if (url.includes("code=") && url.includes("user="))
                setForm(true);
            else {
                setForm(false);
                setType("error");
                setMsg("Invalid reset link");
                setTimeout(() => {
                    router.push("/auth/login");
                }, 5000);
            }
        }
        url && handle();
    }, [router, url]);

    const handleChange = (e) => {
        if (e.target.name === "password")
            setPassword(e.target.value);
        else if (e.target.name === "confirmPassword")
            setConfirmPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (password === confirmPassword) {
            const code = url.split("code=")[1].split("&user=")[0];
            const user_id = url.split("code=")[1].split("&user=")[1];
            const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/reset`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password,
                    confirmPassword,
                    code,
                    user_id
                })
            });
            const res = await data.json();
            if (res.type === "success") {
                setType(res.type);
                setMsg(res.message);
                setTimeout(() => {
                    router.push("/auth/login");
                }, 5000);
                setForm(false);
            } else {
                tst(res.message, "error");
            }
        } else {
            tst("Passwords do not match", "error");
        }
        setLoading(false);
        setPassword("");
        setConfirmPassword("");
    }

    const counter = () => {
        setInterval(() => {
            (count > 0) && setCount(count - 1);
        }, 1000);
        return count > 1 ? `${count} seconds` : `${count} second`;
    }

    return (
        <>
            <Head>
                <title>{`New Password | ${siteName}`}</title>
            </Head>

            {form && <div className="back-to-home">
                <Link href={"/"} legacyBehavior><a><FaCaretLeft /> HOME</a></Link>
            </div>}

            <section className='d-flex justify-content-center align-items-center h-full mt-5 pt-5'>
                {!form && <ShowBox type={type} msg={msg} loading={loading} link={'/auth/login'} button_name={'Login'} />}

                {form && <form className='form container form-container glass-effect' onSubmit={handleSubmit} method="POST">
                    <h2 className='fw-bold mb-4 radiantText text-center fs-1 text-uppercase'>New Password</h2>
                    <div className="mb-3">
                        {/* <label htmlFor="password" className="form-label">Password</label> */}
                        <input type="password" className="form-control" value={password} onChange={handleChange} placeholder='Enter your password' id="password" name='password' />
                    </div>
                    <div className="mb-3">
                        {/* <label htmlFor="confirmPassword" className="form-label">Confirm Password</label> */}
                        <input type="password" className="form-control" value={confirmPassword} onChange={handleChange} placeholder='Confirm your password' id="confirmPassword" name='confirmPassword' />
                    </div>
                    <button type="submit" disabled={loading && true} className="btn radiantButton mt-2 w-100">{loading ? "Processing..." : "Submit"}</button>
                </form>}
            </section>
        </>
    )
}

export default Resetpassword;