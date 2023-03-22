import { Html, Head, Main, NextScript } from "next/document"
import Script from "next/script"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="A simple, free open-source pastebin for your text file. Paste, save and share your text with the world."
        />
        <meta key="og:title" property="og:title" content="StashBin" />
        <meta key="og:site_name" property="og:site_name" content="StashBin" />
        <meta key="og:url" property="og:url" content="https://stashbin.xyz" />
        <meta
          key="og:description"
          property="og:description"
          content="A simple, free open-source pastebin for your text file. Paste, save and share your text with the world."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://stashbin.xyz/images/android-chrome-192x192.png"
        />
        <meta property="twitter:card" content="summary" />
        <meta key="twitter:title" property="twitter:title" content="StashBin" />
        <meta property="twitter:site" content="@mrmissx" />
        <meta property="twitter:creator" content="@mrmissx" />
        <meta
          property="twitter:image"
          content="https://stashbin.xyz/images/android-chrome-192x192.png"
        />
        <meta
          key="twitter:description"
          property="twitter:description"
          content="A simple, free open-source pastebin for your text file. Paste, save and share your text with the world."
        />
        <meta name="theme-color" content="#b78f30" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-4FG8VNZKNE"
        ></Script>
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-4FG8VNZKNE');
          `}
        </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
