import { GetServerSidePropsContext } from "next"
import Head from "next/head"

import Header from "../components/Header"
import Footer from "../components/Footer"
import styles from "../styles/Main.module.scss"
import supabase from "../libs/supabase"

interface ContentProps {
    content: string
    slug: string
}

const MAX_DESCRIPTION_LENGTH = 350

export default function Content({ content, slug }: ContentProps) {
    return (
        <main className={styles.main}>
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
            <div className={styles.content}>
                <textarea className={styles.result} readOnly value={content} />
            </div>
            <Footer />
        </main>
    )
}

export async function getServerSideProps({ params }: GetServerSidePropsContext) {
    const redirectResponse = {
        redirect: {
            destination: "/",
            permanent: false,
        },
    }

    if (!params) {
        return redirectResponse
    }
    const { data, error } = await supabase.from("documents").select("*").eq("slug", params.slug)
    if (error || !data || data.length === 0) {
        return redirectResponse
    }

    return {
        props: { content: data[0].content, slug: params.slug },
    }
}
