import React from 'react'
import Head from "next/head";
import Link from "next/link";
import { FaCaretLeft } from 'react-icons/fa';

const Index = ({ siteName, response }) => {
    return (
        <>
            <Head>
                <title>{`Profile | ${siteName}`}</title>
            </Head>

            <div className="back-to-home">
                <Link href={"/"} legacyBehavior><a><FaCaretLeft /> Home</a></Link>
            </div>

            {response.type == "success" && <form className='uk-margin-large-top'>
                <fieldset class="uk-fieldset">
                    <legend class="uk-legend uk-text-center uk-margin-bottom">Your Profile</legend>

                    <div class="uk-margin uk-flex uk-flex-between uk-flex-middle">
                        <div class="uk-form-label">Name</div>
                        <div class="uk-form-controls uk-width-3-4">
                            <input class="uk-input" type="text" value={response.data.name} readOnly />
                        </div>
                    </div>
                    <div class="uk-margin uk-flex uk-flex-between uk-flex-middle">
                        <div class="uk-form-label">Email</div>
                        <div class="uk-form-controls uk-width-3-4">
                            <input class="uk-input" type="email" value={response.data.email} readOnly />
                        </div>
                    </div>
                    <div class="uk-margin uk-flex uk-flex-between uk-flex-middle">
                        <div class="uk-form-label">Role</div>
                        <div class="uk-form-controls uk-width-3-4">
                            <input class="uk-input" type="text" value={response.data.role} readOnly />
                        </div>
                    </div>
                    <div class="uk-margin uk-flex uk-flex-between uk-flex-middle">
                        <div class="uk-form-label">Status</div>
                        <div class="uk-form-controls uk-width-3-4">
                            <input class="uk-input" type="text" value={response.data.verified ? "Verified" : "Not Verified"} readOnly />
                        </div>
                    </div>

                    {/* <div class="uk-margin">
                        <input class="uk-input" type="text" value={response.data.name} aria-label="Input" readOnly />
                    </div>
                    <div class="uk-margin">
                        <input class="uk-input" type="text" value={response.data.name} aria-label="Input" readOnly />
                    </div>
                    <div class="uk-margin">
                        <input class="uk-input" type="text" value={response.data.name} aria-label="Input" readOnly />
                    </div> */}
                </fieldset>
            </form>}
            {/* <form>
                <div className="form-group">
                    <input type="text" name="name" id="name" value={response.data.name} />
                </div>
                <div className="form-group">
                    <input type="email" name="email" id="email" value={response.data.email} />
                </div>
            </form> */}
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

    const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/getuser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token
        }
    });
    const res = await req.json();

    return {
        props: {
            response: res
        },
    };
}