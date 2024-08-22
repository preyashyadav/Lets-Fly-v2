import React, { useState } from 'react';
import Link from 'next/link';

const ShowBox = ({ type, msg, loading, link, button_name }) => {
    const [count, setCount] = useState(5);

    const counter = () => {
        setInterval(() => {
            (count > 0) && setCount(count - 1);
        }, 1000);
        return count > 1 ? `${count} seconds` : `${count} second`;
    }

    return (
        <div className="form container">
            <h1 className='mb-4 text-uppercase fw-bold text-center'>Verification</h1>
            <p className={`text-center fw-bold ${type === "error" ? "text-danger" : "text-success"}`}>{msg}</p>
            {type && <p className='text-center'>You will be automatically redirected to login page in <b className='text-success'>{counter()}</b> <br />or click the button to login.</p>}
            <Link href={link} legacyBehavior><a disabled={loading && true} className='btn w-100 mt-3'>{loading ? "Processing..." : `${button_name}`}</a></Link>
        </div>
    )
}

export default ShowBox