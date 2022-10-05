import "../styles/globals.scss"
import type { AppProps } from "next/app"
import Head from "next/head"

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>{"<StashBin /> | Save and share your text to anyone for free"}</title>
                <meta
                    name="description"
                    content="stashbin.xyz is a simple pastebin for your text file. Paste, save and share your text with the world."
                />
                <meta property="og:title" content="StashBin" />
                <meta property="og:site_name" content="stashbin" />
                <meta property="og:url" content="https://stashbin.xyz" />
                <meta
                    property="og:description"
                    content="stashbin.xyz is a simple pastebin for your text file. Paste, save and share your text with the world."
                />
                <meta property="og:type" content="website" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>
            <Component {...pageProps} />
        </>
    )
}

export default MyApp
