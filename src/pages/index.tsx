import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useState, useRef } from "react"

import Header from "../components/Header"
import Footer from "../components/Footer"
import styles from "../styles/Main.module.scss"

const Home: NextPage = () => {
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const [saveDisable, setSaveDisable] = useState(true)

  const saveContent = async () => {
    setSaveDisable(true)
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
      router.push(`/${result.data.key}`)
    } else {
      alert(`Failed to save document: ${result.err}`)
      setSaveDisable(false)
    }
  }

  return (
    <main className={styles.main}>
      <Header save={saveContent} saveDisable={saveDisable} />
      <div className={styles.editorWrapper}>
        <textarea
          className={styles.editor}
          ref={contentRef}
          placeholder="Write or paste, save and share the link..."
          onChange={(event) => {
            setSaveDisable(event.target.value.length === 0)
          }}
          onKeyDown={(event) => {
            if (event.key === "s" && event.ctrlKey) {
              // handle ctrl + s
              event.preventDefault()
              if (!saveDisable) {
                saveContent()
              }
            }
            if (event.key === "Tab") {
              // handle tab indentation
              event.preventDefault()
              const ref = contentRef.current
              if (!ref) return
              const start = ref?.selectionStart
              const end = ref?.selectionEnd
              ref.value = ref.value.substring(0, start) + "\t" + ref.value.substring(end)
              ref.selectionStart = ref.selectionEnd = start + 1
            }
          }}
        />
      </div>
      <Footer />
    </main>
  )
}

export default Home
