import Link from 'next/link'
import React from 'react'
import { FiX } from 'react-icons/fi';

const Header = ({ logout, auth }) => {

    const getFirstName = (name) => {
        return name.split(" ")[0];
    }

    return (
        <>
            <header className="header">
                <nav className="navbar navbar-fixed">
                    <article className="navbar-layout">
                        <section className="navbar-main">
                            <ul className="navbar-list">
                                <Link href='/search' legacyBehavior><li className="navbar-link style-uppercase"><a>Book Flight</a></li></Link>
                                <Link href='/#contact' legacyBehavior><li className="navbar-link style-uppercase"><a>Contact Us</a></li></Link>
                                {!auth.token && <Link href='/auth/login' legacyBehavior><li className="navbar-link style-uppercase"><a>Login</a></li></Link>}

                                {auth.token && <>
                                    <a uk-toggle="target: #user-nav" legacyBehavior><li className="navbar-link style-uppercase"><a>Welcome, {getFirstName(auth.user.name)}</a></li></a>
                                    <li onClick={logout} className="navbar-link style-uppercase"><a className='text-danger'>Logout</a></li>
                                </>}
                            </ul>
                        </section>
                    </article>
                </nav>

                <div id="user-nav" uk-offcanvas="mode: slide; flip:true">
                    <div className="uk-offcanvas-bar uk-text-secondary">
                        <a className='uk-offcanvas-close uk-text-large uk-margin-small-top uk-margin-right nav-close'><FiX /></a>

                        <ul className="uk-nav uk-text-uppercase uk-text-bold uk-text-small uk-margin-medium-top">
                            <li><Link legacyBehavior href="/user"><a>Profile</a></Link></li>
                            <li><Link legacyBehavior href="/user/booking"><a>Booking</a></Link></li>
                            {(auth.user && auth.user.role === "admin") && <li><Link legacyBehavior href="/admin"><a>Admin View</a></Link></li>}
                        </ul>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header