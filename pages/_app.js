import "../styles/globals.css";
import CurrentUserProvider from "../src/context/currentUserProvider";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Pomodoki</title>
        <meta name="viewport" content="width=400, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
          rel="stylesheet"
        />
      </Head>
      <CurrentUserProvider>
        <Component {...pageProps} />
      </CurrentUserProvider>
    </>
  );
}

export default MyApp;
