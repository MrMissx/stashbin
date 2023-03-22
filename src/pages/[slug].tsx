import { GetServerSidePropsContext } from "next"
import Head from "next/head"
import { useRouter } from "next/router"

import Header from "../components/Header"
import Footer from "../components/Footer"
import styles from "../styles/Main.module.scss"
import supabase from "../libs/supabase"
import { useEffect } from "react"

interface ContentProps {
  content?: string
  slug?: string
}

const MAX_DESCRIPTION_LENGTH = 350

export default function Content({ content, slug }: ContentProps) {
  const router = useRouter()

  useEffect(() => {
    if (!content || !slug) {
      router.push("/")
    }

    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "a") {
        event.preventDefault()
        const range = document.createRange()
        const contentElement = document.getElementById("content")
        if (contentElement) {
          range.selectNode(contentElement)
          window.getSelection()?.removeAllRanges()
          window.getSelection()?.addRange(range)
        }
      }
    })
  }, [content, slug, router])

  if (!content || !slug) {
    return null
  }

  return (
    <>
      <Head>
        <meta key="og:site_name" property="og:site_name" content={`StashBin | ${slug}`} />
        <meta
          key="og:title"
          property="og:title"
          content="StashBin.xyz | Save and share your text file easily with everyone."
        />
        <meta
          key="og:description"
          property="og:description"
          content={
            content.length > MAX_DESCRIPTION_LENGTH
              ? content.slice(0, MAX_DESCRIPTION_LENGTH) + "..."
              : content
          }
        />
        <meta key="og:url" property="og:url" content={"https://stashbin.xyz/" + slug} />
        <meta
          key="twitter:title"
          property="twitter:title"
          content="StashBin.xyz | Save and share your text file easily with everyone."
        />
        <meta
          key="twitter:description"
          property="twitter:description"
          content={
            content.length > MAX_DESCRIPTION_LENGTH
              ? content.slice(0, MAX_DESCRIPTION_LENGTH) + "..."
              : content
          }
        />
      </Head>
      <Header slug={slug} />
      <main>
        <div id="content" className={styles.content}>
          <ol>
            {content.split("\n").map((line, index) => {
              return (
                <li key={index} className={styles.result}>
                  <pre>{line}</pre>
                </li>
              )
            })}
          </ol>
        </div>
      </main>
      <Footer />
    </>
  )
}

export async function getServerSideProps({ params }: GetServerSidePropsContext) {
  // const redirectResponse = {
  //     redirect: {
  //         destination: "/",
  //         permanent: 200,
  //     },
  // }

  if (!params) {
    return { props: {} }
  }
  const { data, error } = await supabase.from("documents").select("*").eq("slug", params.slug)
  if (error || !data || data.length === 0) {
    return { props: {} }
  }

  return {
    props: { content: data[0].content, slug: params.slug },
  }
}
