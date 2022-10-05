import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"

import Header from "../components/Header"
import Footer from "../components/Footer"
import styles from "../styles/Main.module.scss"

const Home: NextPage = () => {
    const contentRef = useRef<HTMLTextAreaElement>(null)
    const router = useRouter()

    useEffect(() => {
        const saveContent = async () => {
            const response = await fetch("/api/document", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    content: contentRef.current?.value,
                }),
            })
            const result = await response.json()
            if (response.status === 201) {
                navigator.clipboard.writeText(window.location.href + "/" + result.data.key)
                router.push(`/${result.data.key}`)
            } else {
                alert(`Failed to save document: ${result.err}`)
            }
        }

        const ref = contentRef.current
        ref?.addEventListener("keydown", (event) => {
            // handle ctrl + s
            if (event.ctrlKey && event.key === "s") {
                event.preventDefault()
                saveContent()
                event.stopImmediatePropagation() // prevent triggering twice
            }
        })
        return () => {
            ref?.removeEventListener("keydown", () => {})
        }
    }, [router])

    return (
        <main className={styles.main}>
            <Header />
            <div className={styles.content}>
                <textarea
                    className={styles.editor}
                    ref={contentRef}
                    placeholder="Write or paste, save and share the link..."
                />
            </div>
            <Footer />
        </main>
    )
}

export default Home
