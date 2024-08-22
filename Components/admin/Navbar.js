import React from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = ({ siteName, logout }) => {
    return (
        <>
            <nav id='navbar' className="uk-navbar-container uk-navbar-transparent">
                <div className="uk-navbar-left">
                    <Link legacyBehavior href="/admin"><a className="uk-navbar-item logo uk-logo uk-margin-left">{`${siteName} - Admin`}</a></Link>
                    <ul className="uk-navbar-nav uk-text-bold uk-margin-auto-left@s uk-margin-small-right uk-visible@m">
                        <li><Link legacyBehavior href="/admin"><a>Home</a></Link></li>
                        <li><Link legacyBehavior href="/admin/queries"><a>Queries</a></Link></li>
                        <li><Link legacyBehavior href="/admin/bookings"><a>Bookings</a></Link></li>
                        <li><Link legacyBehavior href="/admin/users"><a>Users</a></Link></li>
                        <li><Link legacyBehavior href="/"><a>User View</a></Link></li>
                        <li><Link href={""}><button onClick={logout} class="uk-button uk-button-danger uk-button-small">Logout</button></Link></li>
                    </ul>
                    <div className="theme-change" id="theme">
                        <i className="fas fa-sun" id="icon"></i>
                    </div>

                    <div className="uk-navbar-item uk-navbar-right uk-hidden@m">
                        <a uk-toggle="target: #mobile-nav" className='toggle uk-margin-small-right uk-text-large'><FiMenu /></a>
                    </div>
                </div>

                <div id="mobile-nav" uk-offcanvas="mode: slide; flip:true">
                    <div className="uk-offcanvas-bar uk-text-secondary">
                        <a className='uk-offcanvas-close uk-text-large uk-margin-small-top uk-margin-right nav-close'><FiX /></a>

                        <ul className="uk-nav uk-text-uppercase uk-text-bold uk-text-small uk-margin-medium-top">
                            <li><Link legacyBehavior href="/admin"><a>Home</a></Link></li>
                            <li><Link legacyBehavior href="/admin/queries"><a>Queries</a></Link></li>
                            <li><Link legacyBehavior href="/admin/bookings"><a>Bookings</a></Link></li>
                            <li><Link legacyBehavior href="/admin/users"><a>Users</a></Link></li>
                            <li><Link legacyBehavior href="/"><a>User View</a></Link></li>
                            <li><Link href={""}><button onClick={logout} class="uk-button uk-button-danger uk-button-small">Logout</button></Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar