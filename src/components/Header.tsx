import Link from "next/link"

import styles from "../styles/components/Header.module.scss"

export default function Header() {
    return (
        <header className={styles.header}>
            <Link href="/">
                <a>
                    &lt;
                    <span style={{ color: "#DDA3B2" }}>Stash</span>
                    <span style={{ color: "#E3B23C" }}>Bin</span> /&gt;
                </a>
            </Link>
        </header>
    )
}
