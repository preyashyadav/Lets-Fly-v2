import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaCaretLeft } from "react-icons/fa";
import styles from "@/styles/Slug.module.scss";

const Slug = ({ siteName, response, router, auth, tst }) => {
  // const flights = response && response.res1.flight.filter((flight) => flight.FLSFlightType === "NonStop");
  const flights = response && response.res1.data.flight.filter((flight) => flight.FLSFlightType === "NonStop");

  const findTime = (data) => {
    let date = data.split("T")[0].split("-");
    date = `${date[2]}-${date[1]}-${date[0]}`;

    const time = data.split("T")[1].split(":");
    let hours = time[0];
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours > 12 ? "0" + (hours - 12) : hours;
    let minutes = time[1];

    return `${date} | ${hours}:${minutes} ${ampm}`;
  }

  const makeTime = (time) => {
    let hours = time.split("H")[0].split("T")[1];
    hours = hours.length === 1 ? "0" + hours : hours;
    hours = parseInt(hours) > 1 ? hours + " hrs" : hours + " hr";
    let minutes = time.split("H")[1].split("M")[0];
    minutes = parseInt(minutes) > 1 ? minutes + " mins" : minutes + " min";
    return `${hours} ${minutes}`;
  }

  const convertMileToKM = (miles) => {
    let km = miles * 1.60934;
    km = km.toFixed(0);
    return `${km} KM`;
  }

  const setPrice = (time, km) => {
    let price = 0;
    let hours = time.split(" ")[0].split("h")[0];
    let minutes = time.split(" ")[2].split("m")[0];
    let totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    let kmPrice = parseInt(km) * 0.5;
    price = totalMinutes * 30 + kmPrice + Math.random(30) * 1000;
    return `${price.toFixed(0)}`;
  }

  const getCity = (airport) => {
    const airportDetails = response.res2.filter((airportDetails) => airportDetails.airport_code === airport);
    return airportDetails[0].state_name;
  }

  const initiatePayment = async (e) => {
    e.preventDefault();
    const flightId = e.target.id.split("-")[1];
    const flightDetails = flights.filter((flight) => flight.FlightLegDetails.FLSUUID === flightId);

    const data = {
      user_id: auth.user._id,
      name: auth.user.name,
      email: auth.user.email,
      flight_id: flightDetails[0].FlightLegDetails.FLSUUID,
      flight_number: flightDetails[0].FlightLegDetails.MarketingAirline.Code + "-" + flightDetails[0].FlightLegDetails.FlightNumber,
      flight_time: makeTime(flightDetails[0].TotalFlightTime),
      company: flightDetails[0].FlightLegDetails.MarketingAirline.CompanyShortName,
      price: document.getElementById(`flight_price-${flightId}`).innerText,
      distance: convertMileToKM(flightDetails[0].TotalMiles),
      arrival_ap: {
        code: flightDetails[0].FLSArrivalCode,
        city: getCity(flightDetails[0].FLSArrivalCode),
        name: flightDetails[0].FLSArrivalName,
        time: findTime(flightDetails[0].FlightLegDetails.ArrivalDateTime),
        terminal: flightDetails[0].FlightLegDetails.ArrivalAirport.Terminal,
      },
      departure_ap: {
        code: flightDetails[0].FLSDepartureCode,
        city: getCity(flightDetails[0].FLSDepartureCode),
        name: flightDetails[0].FLSDepartureName,
        time: findTime(flightDetails[0].FlightLegDetails.DepartureDateTime),
        terminal: flightDetails[0].FlightLegDetails.DepartureAirport.Terminal,
      }
    }

    if (data.price <= 0)
      return res.status(200).json({
        type: "error",
        message: "Price cannot be less than or equal to 0"
      })

    const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/payment/pre`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await req.json();

    if (res.type === "success") {

      var options = {
        key: res.key, // Enter the Key ID generated from the Dashboard
        amount: res.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Let's Fly", //your business name
        description: "Flight Booking",
        order_id: res.data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        // callback_url: `/api/payment/post`,
        handler: async (resp) => {
          const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/payment/post`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_signature: resp.razorpay_signature,
            }),
          });

          const res = await req.json();
          router.push(`/booking?id=${res.data}`);
        },
        prefill: {
          name: auth.user.name || "User",
          email: auth.user.email || "user@mail.com",
        },
        theme: {
          color: "#ff7800"
        }
      };
      const razor = new window.Razorpay(options);
      razor.open();
      razor.on('payment.failed', function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
    }
  }

  return (
    <div className={styles.flight_section_wrap}>
      <Head>
        <title>{`Flights | ${siteName}`}</title>
      </Head>

      <div className="back-to-home">
        <Link href={"/search"} legacyBehavior>
          <a>
            <FaCaretLeft /> BACK
          </a>
        </Link>
      </div>
      <section className={styles.flight_section}>
        {flights && flights.map((flight) => (
          <div
            className={styles.flight_card}
            key={flight.FlightLegDetails.FLSUUID}
          >
            <div className={styles.container}>
              <div className={styles.trip_card} style={{ overflow: "scroll" }}>
                <div className={styles.trip_title}>
                  <div className={styles.title}>
                    {getCity(flight.FLSDepartureCode)} ({flight.FLSDepartureCode}) to {getCity(flight.FLSArrivalCode)} ({flight.FLSArrivalCode}) ({flight.FlightLegDetails.MarketingAirline.Code}-{flight.FlightLegDetails.FlightNumber}) | {flight.FlightLegDetails.MarketingAirline.CompanyShortName}
                  </div>
                  <div className={styles.pnr}>
                    <span id={`flight_price-${flight.FlightLegDetails.FLSUUID}`}>{setPrice(makeTime(flight.TotalFlightTime), convertMileToKM(flight.TotalMiles))}</span> INR
                  </div>
                </div>

                <div className={styles.source_destination}>

                  <div className={styles.city_to_city}>
                    <span className={styles.full_name}>
                      {flight.FLSDepartureName}
                      <br />
                      Terminal: {flight.FlightLegDetails.DepartureAirport.Terminal}
                    </span>
                    <div className={styles.plane_line}>
                      <i className="far fa-xs fa-dot-circle"></i>
                      <div className={styles.line}></div>
                      <i className="plane fas fa-lg fa-plane"></i>
                      <span className={styles.flight_duration}>
                        {makeTime(flight.TotalFlightTime)}
                      </span>
                      <div className={styles.line}></div>
                      <i className="far fa-xs fa-dot-circle"></i>
                    </div>
                    <span className={styles.full_name}>
                      {flight.FLSArrivalName}
                      <br />
                      Terminal: {flight.FlightLegDetails.DepartureAirport.Terminal}
                    </span>
                  </div>

                  <div className={styles.takeoff_land_time}>
                    <div className={styles.date_time}>
                      <div className={styles.date}>
                        {findTime(flight.FLSDepartureDateTime)}
                      </div>
                    </div>
                    <div className={`${styles.date_time}`}>
                      <div className={`${styles.date} ${styles.primary_color}`}>
                        {convertMileToKM(flight.TotalMiles)}
                      </div>
                    </div>
                    <div className={styles.date_time}>
                      <div className={styles.date}>
                        {findTime(flight.FLSArrivalDateTime)}
                      </div>
                    </div>
                  </div>

                  <div className={styles.trip_controls}>
                    <div className={styles.button} onClick={initiatePayment} id={`book-${flight.FlightLegDetails.FLSUUID}`}>
                      Book Flight
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Slug;

export async function getServerSideProps(context) {
  const { slug } = context.query;
  const [from, to, date] = slug.split("-");

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

  const req1 = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/flight`, {
    // const req1 = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/flight/getFlight`, {
    method: "POST",
    // method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      date,
    }),
  });
  let res1 = await req1.json();
  // res1 = res1.data[0].flight_data;

  const req2 = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/airport`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let res2 = await req2.json();
  res2 = res2.data;

  return {
    props: {
      response: { res1, res2 },
    },
  };
}
