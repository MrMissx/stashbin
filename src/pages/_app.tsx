import "../styles/globals.scss"
import type { AppProps } from "next/app"
import Head from "next/head"

import { Environment } from "../shared/Environment"

if (!Environment.isProduction) {
  console.log("[ENV]:", Environment)
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{"<StashBin /> | Save and share your text to anyone for free"}</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
