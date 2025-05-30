import Head from "next/head"
import styles from "../styles/Home.module.css"
import FlowLogin from "../components/FlowLogin"

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pomodoki - Flow Blockchain App</title>
        <meta name="description" content="A Next.js app with Flow blockchain integration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Pomodoki</a>
        </h1>

        <p className={styles.description}>
          Connect your Flow wallet to get started
        </p>

        <div className={styles.flowLogin}>
          <FlowLogin />
        </div>
 
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
  )
}
