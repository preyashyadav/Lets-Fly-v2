import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { FaCaretLeft } from "react-icons/fa";
import styles from "@/styles/Search.module.scss";
const Search = ({ siteName, router, auth, response }) => {

  useEffect(() => {
    if (!auth.user) {
      router.push("/auth/login");
    }
  }, [router, auth]);

  const [loading, setLoading] = useState(false);
  const [airports, setAirports] = useState([]);

  const onSearch = (e) => {
    setAirports([]);
    const search = e.target.value;
    if (search.length >= 2) {
      const airport = response.data.filter((airport) =>
        airport.city.toLowerCase().includes(search.toLowerCase()) || airport.airport_code.toLowerCase().includes(search.toLowerCase()) || airport.airport_name.toLowerCase().includes(search.toLowerCase())
      );
      setAirports(airport);
    }
  }

  const checkFlight = (e) => {
    e.preventDefault();
    setLoading(true);
    const from = e.target.from.value;
    const to = e.target.to.value;
    let date = e.target.date.value;
    date = e.target.date.value.replace(/-/g, "");

    router.push(`/flights/${from}-${to}-${date}`);

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>{`Search | ${siteName}`}</title>
      </Head>

      <div className="back-to-home">
        <Link href={"/"} legacyBehavior>
          <a>
            <FaCaretLeft /> Home
          </a>
        </Link>
      </div>

      <section className={styles.form_wrap}>
        <form method="POST" onSubmit={checkFlight} className={styles.form}>
          <input
            className={styles.input}
            type="text"
            name="from"
            id="from"
            placeholder="Origin"
            onChange={onSearch}
          />
          {/* {airports.length > 0 && (
            <ul className={styles.airport_list}>
              {airports.map((airport) => (
                <li key={airport.id}>
                  <div>
                    <p>{airport.city} ({airport.airport_code})</p>
                    <p>{airport.state_name}</p>
                  </div>
                </li>
              ))}
            </ul>
          )} */}
          <input
            className={styles.input}
            type="text"
            name="to"
            id="to"
            placeholder="Destination"
            onChange={onSearch}
          />
          {/* {airports.length > 0 && (
            <ul className={styles.airport_list}>
              {airports.map((airport) => (
                <li key={airport.id}>
                  <div>
                    <p>{airport.city} ({airport.airport_code})</p>
                    <p>{airport.state_name}</p>
                  </div>
                </li>
              ))}
            </ul>
          )} */}
          <input className={styles.input} type="date" name="date" id="date" />
          <fieldset className="style-center layout-col-12 wow fadeIn">
            <button
              type="submit"
              className={`${styles.button} ${loading && "btn-disabled"}`}
            >
              {loading ? "Processing..." : "Submit"}
            </button>
          </fieldset>
        </form>
      </section>
    </>
  );
};

export default Search;

export async function getServerSideProps(context) {
  const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/airport`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let res = await req.json();

  return {
    props: {
      response: res,
    },
  };
}