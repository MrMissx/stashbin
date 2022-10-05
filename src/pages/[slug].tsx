import { GetServerSidePropsContext } from "next"

import Header from "../components/Header"
import Footer from "../components/Footer"
import styles from "../styles/Main.module.scss"
import supabase from "../libs/supabase"

export interface ContentProps {
    content: string
}

export default function Content({ content }: ContentProps) {
    return (
        <main className={styles.main}>
            <Header />
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
        props: { content: data[0].content },
    }
}
