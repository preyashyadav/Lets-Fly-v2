import React from 'react'

const Error = ({ type, msg }) => {
    return (
        <section className="d-flex justify-content-center align-items-center h-full">
            <div className="form container glass-effect">
                <h1 className='radiantText mb-4 text-uppercase fw-bold text-center'>{type}</h1>
                <p className={`text-center fw-bold text-danger`}>{msg}</p>
            </div>
        </section>
    )
}

export default Error