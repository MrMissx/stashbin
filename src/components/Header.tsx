import Link from "next/link"
import { useState } from "react"

import styles from "../styles/components/Header.module.scss"

interface HeaderProps {
    save?: () => void
    saveDisable?: boolean
    slug?: string
}

export default function Header({ save, saveDisable, slug }: HeaderProps) {
    const [coppied, setCoppied] = useState<boolean>(false)
    const copySlug = () => {
        if (coppied) return
        navigator.clipboard.writeText(window.location.href)
        setCoppied(true)
        setTimeout(() => {
            setCoppied(false)
        }, 2000)
    }

    return (
        <header className={styles.header}>
            <Link href="/">
                &lt;
                <span style={{ color: "#DDA3B2" }}>Stash</span>
                <span style={{ color: "#E3B23C" }}>Bin</span>
                /&gt;
            </Link>
            {save && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="34px"
                    height="34px"
                    className={saveDisable ? styles.disabled : undefined}
                    onClick={() => {
                        if (saveDisable) return
                        save()
                    }}
                >
                    <path d="M17.6 3.6c-.4-.4-.9-.6-1.4-.6H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7.8c0-.5-.2-1-.6-1.4l-2.8-2.8zM12 19c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm1-10H7c-1.1 0-2-.9-2-2s.9-2 2-2h6c1.1 0 2 .9 2 2s-.9 2-2 2z"></path>
                </svg>
            )}
            {slug && (
                <div className={styles.toolbar}>
                    <div
                        className={styles.url}
                        onClick={() => {
                            copySlug()
                        }}
                    >
                        <p>{coppied ? "✅ Coppied!" : `/${slug}`}</p>
                        <svg
                            width="28px"
                            height="28px"
                            viewBox="-32 0 512 512"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-details="Copy url to clipboard"
                        >
                            <path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z" />
                        </svg>
                    </div>
                    <div
                        className={styles.tool}
                        onClick={() => {
                            // do not use next/link or useRouter here to ensure the page is reloaded
                            window.location.href = `/raw/${slug}`
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="36px"
                            height="36px"
                            viewBox="0 0 24 24"
                            aria-details="Open RAW view"
                        >
                            <path d="M6.5 9H4c-.55 0-1 .45-1 1v4.31c0 .38.31.69.69.69h.11c.38 0 .69-.31.69-.69V13h1.1l.72 1.59c.12.25.37.41.64.41.5 0 .83-.51.64-.97L7.1 12.9c.5-.3.9-.8.9-1.4v-1C8 9.68 7.32 9 6.5 9zm0 2.5h-2v-1h2v1zm5-2.5c-.73 0-1.37.5-1.55 1.21l-.97 3.89c-.12.46.23.9.7.9.33 0 .62-.23.7-.55l.24-.95h1.75l.23.95a.73.73 0 0 0 1.42-.35l-.97-3.88C12.87 9.5 12.23 9 11.5 9zm-.5 3 .25-1h.5l.25 1h-1zm8.84-2.45-.6 2.45-.56-2.26a.954.954 0 0 0-.94-.74c-.45 0-.84.3-.94.74L16.24 12l-.6-2.45a.73.73 0 0 0-1.42.35l1.09 4.38c.12.42.5.72.93.72.43 0 .81-.3.92-.72l.58-2.32.58 2.32c.11.42.49.72.92.72.43 0 .81-.3.92-.72l1.09-4.38a.72.72 0 0 0-.7-.9.73.73 0 0 0-.71.55z" />
                        </svg>
                    </div>
                </div>
            )}
        </header>
    )
}
