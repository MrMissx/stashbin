import { GetServerSidePropsContext } from "next"

import supabase from "../../libs/supabase"

export default function RawContent() {
    return null // content is not rendered as html
}

export async function getServerSideProps({ params, res }: GetServerSidePropsContext) {
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

    // serve as raw text
    res.setHeader("Content-Type", "text/plain")
    res.write(data[0].content)
    res.end()

    return { props: {} }
}
