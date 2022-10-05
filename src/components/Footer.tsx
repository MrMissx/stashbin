import Link from "next/link"

import styles from "../styles/components/Footer.module.scss"

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <a href="https://mrmiss.my.id">Copyright © 2022 MrMissx</a>
            <Link href="/about">
                <a>About</a>
            </Link>
        </footer>
    )
}
