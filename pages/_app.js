import React, { useState, useEffect } from 'react';
import Error from '@/Components/Error';
import '@/styles/globals.scss'
import Head from 'next/head'
import { useRouter } from 'next/router';
import Script from 'next/script';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '@/Components/Loader';

export default function App({ Component, pageProps }) {
  const siteName = "Let's Fly";
  const router = useRouter();

  const [loader, setLoader] = useState(false);
  const [auth, setAuth] = useState({ user: null, token: null });
  const [key, setKey] = useState();
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // Loader 
    router.events.on('routeChangeStart', () => {
      setLoader(true)
    })
    router.events.on('routeChangeComplete', () => {
      setLoader(false)
    })

    setKey(Math.random())

    // Check if the cookie is enabled
    if (!navigator.cookieEnabled) {
      setError("Cookies are disabled");
      setMsg("Please enable cookies to continue.");
    }

    // Check if the user is logged in
    if (document.cookie.includes("aviation-user") && document.cookie.split("aviation-user=")[1].split(";")[0].length > 0) {
      const data = document.cookie.split("aviation-user=")[1].split(";")[0];
      // get the user details
      const getUser = async () => {
        if (navigator.onLine) {
          const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/getuser`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token": data
            }
          });
          const res = await req.json();
          if (res.type === "success") {
            setAuth({ user: res.data, token: data });
            setKey(Math.random());
          } else {
            setAuth({ user: null, token: null });
            setKey(Math.random());
          }
        }
      }
      getUser();
    } else {
      setAuth({ user: null, token: null });
      setKey(Math.random());
    }

    // Get the mobile orientation
    const detectDevice = () => {
      if (window.innerWidth < 360) {
        setError("Mobile Resolution");
        setMsg("Your screen resolution is too low. Please use a device with a higher resolution for the best experience");
      } else if (navigator.maxTouchPoints && window.screen.orientation.angle && window.innerHeight < 750) {
        setError("Mobile Orientation");
        setMsg("Landscape mode is not supported. Please go back to portrait mode for the best experience");
      } else {
        setError("");
        setMsg("");
      }
    }
    detectDevice();
    window.addEventListener('resize', detectDevice);

    document.addEventListener("wheel", (e) => {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    });
  }, [router]);

  // Logout function
  const logout = () => {
    document.cookie = "aviation-user=; path=/;";
    setAuth({ user: null, token: null });
    setKey(Math.random());
    router.push("/");
  }

  // Function for notifications
  const tst = (msg, type) => {
    const data = {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark"
    }
    if (type == "success") {
      toast.success(`${msg}`, data);
    } else {
      toast.error(`${msg}`, data);
    }
  }

  return (<>
    <Head>
      <title>{`Home | ${siteName}`}</title>
      <meta name="description" content="Aviation Management System Website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Script src="https://cdn.jsdelivr.net/npm/uikit@3.16.10/dist/js/uikit.min.js"></Script>
    <Script src="https://cdn.jsdelivr.net/npm/uikit@3.16.10/dist/js/uikit-icons.min.js"></Script>
    <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />

    {((error.length !== 0) && (msg.length !== 0)) ? <Error type={error} msg={msg} /> :
      loader ? <Loader /> : <>
        <Component {...pageProps} siteName={siteName} key={key} auth={auth} router={router} tst={tst} logout={logout} />
      </>}
  </>)
}
