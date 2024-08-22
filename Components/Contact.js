import React, { useState } from 'react'

const Contact = ({ tst }) => {
    const [loading, setLoading] = useState(false);
    const contact_us = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const subject = e.target.subject.value;
        const message = e.target.message.value;

        setLoading(true);
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/contact/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, subject, message }),
        });
        const res = await req.json();
        tst(res.message, res.type);
        if (res.type == "success") {
            e.target.name.value = '';
            e.target.email.value = '';
            e.target.subject.value = '';
            e.target.message.value = '';
        }
        setLoading(false);
    }
    return (
        <>
            <article className="layout-contain-small" id='contact'>
                <h3 className="style-bold style-uppercase layer-title style-center style-pink wow fadeIn">CONTACT <span className="style-white">US.</span></h3>
                <form onSubmit={contact_us}>
                    <fieldset className="wow fadeIn">
                        <input className='input' type="text" name="name" id="name" required />
                        <label htmlFor="name">Name *</label>
                    </fieldset>
                    <fieldset className="wow fadeIn">
                        <input className='input' type="email" name="email" id="email" required />
                        <label htmlFor="name">Email *</label>
                    </fieldset>
                    <fieldset className="wow fadeIn">
                        <input className='input' type="text" name="subject" id="subject" required />
                        <label htmlFor="subject">Subject *</label>
                    </fieldset>
                    <fieldset className="wow fadeIn">
                        <textarea className='input' name="message" id="message" required />
                        <label htmlFor="message">Message *</label>
                    </fieldset>
                    <fieldset className="style-center layout-col-12 wow fadeIn">
                        <button type="submit" className={`more style-uppercase ${loading && "btn-disabled"}`}>{loading ? "Processing..." : "Submit"}</button>
                    </fieldset>
                </form>
            </article>
        </>
    )
}

export default Contact