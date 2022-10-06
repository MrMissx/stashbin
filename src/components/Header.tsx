import Link from "next/link"

import styles from "../styles/components/Header.module.scss"

interface HeaderProps {
    save?: () => void
    saveDisable?: boolean
    slug?: string
}

export default function Header({ save, saveDisable, slug }: HeaderProps) {
    return (
        <header className={styles.header}>
            <Link href="/">
                <a>
                    &lt;
                    <span style={{ color: "#DDA3B2" }}>Stash</span>
                    <span style={{ color: "#E3B23C" }}>Bin</span> /&gt;
                </a>
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
                <div
                    className={styles.url}
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                    }}
                >
                    <p>/{slug}</p>
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
            )}
        </header>
    )
}
