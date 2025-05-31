import Head from "next/head"
import styles from "../styles/Home.module.css"
import FlowLogin from "../components/FlowLogin"

export default function Home() {
  return (
    <>
      <Head>
        <title>Pomodoki - Flow Blockchain App</title>
        <meta name="description" content="A Next.js app with Flow blockchain integration" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      </Head>

      <div className="popup-container">
        <div className="w-full max-w-3xl text-center">
          <main className={styles.main}>
            <h1 className={styles.title}>
              Welcome to<br />
              <span className={styles.brand}>Pomodoki</span>
            </h1>

            <img
              src="/images/avatar.png"
              alt="Pomodoki Avatar"
              style={{ display: "block", margin: "32px auto", width: "180px" }}
            />

            <div className={styles.flowLogin}>
              <FlowLogin />
            </div>

            <button className="pixelButton">
              <span role="img" aria-label="key" style={{ fontSize: '1.5em' }}>🔑</span>
              Connect Wallet
            </button>
          </main>

          <footer className={styles.footer}>
            <a
              href="https://flow.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by{" "}
              <span className={styles.logo}>
                Flow Blockchain
              </span>
            </a>
          </footer>
        </div>
      </div>
    </>
  )
}
