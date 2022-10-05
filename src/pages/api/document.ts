import type { NextApiRequest, NextApiResponse } from "next"

import supabase from "../../libs/supabase"
import { createSlug } from "../../libs/helpers"

type BaseResponse = {
    ok: boolean
    err?: string
}

type GetResponse = BaseResponse & {
    content?: string
}

type PostResponse = BaseResponse & {
    data?: {
        key: string
        length: number
        date: string
    }
}

async function insertContent(content: string, retry: number = 0): Promise<any> {
    const slug = createSlug()
    const { data, error } = await supabase.from("documents").insert([{ content, slug }])

    if (error) {
        if (error.code === "23505" && retry <= 5) {
            // retry duplicate key
            return await insertContent(content, ++retry)
        }
        return null
    }

    return data
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GetResponse | PostResponse>
) {
    if (req.method === "GET") {
        if (!req.query.key) {
            res.status(400).json({ ok: false, err: "Missing query key" })
            return
        }
        const { data, error } = await supabase
            .from("documents")
            .select("*")
            .eq("slug", req.query.key)
        if (error || !data) {
            res.status(500).json({ ok: false, err: "server error" })
            return
        }
        if (data.length === 0) {
            res.status(404).json({
                ok: false,
                err: `not found content with key "${req.query.key}"`,
            })
            return
        }
        res.status(200).json({ ok: true, content: data[0].content })
        return
    }
    if (req.method === "POST") {
        if (req.headers["content-type"] !== "application/json") {
            res.status(400).json({ ok: false, err: "Only accepting 'application/json'" })
            return
        }
        const { content } = req.body
        if (!content) {
            res.status(400).json({ ok: false, err: "Missing body content" })
            return
        }
        const data = await insertContent(content)
        if (!data || data.length === 0) {
            res.status(500).json({ ok: false, err: "Failed to insert data" })
            return
        }
        res.status(201).json({
            ok: true,
            data: { key: data[0].slug, length: content.length, date: data[0].created_at },
        })
        return
    }
    res.status(405).json({ ok: false, err: "Method not allowed" })
    return
}
