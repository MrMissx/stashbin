import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useState, useRef, useCallback } from "react"

import Header from "../components/Header"
import Footer from "../components/Footer"
import styles from "../styles/Main.module.scss"
import { createDocument } from "../libs/document"

const Home: NextPage = () => {
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const [saveDisable, setSaveDisable] = useState(true)

  const saveContent = useCallback(async () => {
    setSaveDisable(true)
    const key = await createDocument(contentRef.current?.value || "")
    if (key) {
      router.push(`/${key}`)
    } else {
      alert("Failed to save document")
      setSaveDisable(false)
    }
  }, [contentRef])

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
