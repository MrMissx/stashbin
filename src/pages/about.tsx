import Header from "../components/Header"
import Footer from "../components/Footer"
import styles from "../styles/About.module.scss"

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.content}>
        <div>
          <h1>StashBin | simple pastebin for your text file.</h1>
          <p>
            Paste, save and share your file easily to everyone in the world.
            <br />
            Stashbin is an open source pastebin service. You can find the source code on{" "}
            <a href="https://github.com/mrmissx/stashbin">Github.</a>
            <br />
            By default stashbin supports font ligatures like &lt;=, &gt;=, ==, !=, =&gt; etc. Make
            your code more readable and beautiful with ligatures.
          </p>
        </div>
        <div>
          <h2>Document Lifetime</h2>
          <p>
            StashBin have no explicit document expiration time. However old documents may be removed
            at any time without notice.
          </p>
        </div>
        <div>
          <h2>Privacy</h2>
          <p>
            StashBin does not collect any personal information. We do not track, log, or store any
            information about your IP address, browser, or any other information.
          </p>
        </div>
        <div>
          <h2>Security</h2>
          <p>
            StashBin only act as a simple storage for your text. While we try to keep your documents
            from being crawled by search engines, we cannot guarantee that your documents will not
            be found by other means. Please do not store any sensitive information in your
            documents.
          </p>
        </div>
        <h2>API endpoint</h2>
        <p>
          You can use the API to create and read documents. You can send a http POST with a JSON
          body containing field named &apos;content&apos;. Other than that, it will response a Bad
          Request. Here an example using curl.
          <pre>
            <code>
              {`curl -X POST \\
  'https://stashbin.xyz/api/document' \\
  --header 'Content-Type: application/json' \\
  --data-raw '{
  "content": "Hi Mom"
}'`}
            </code>
          </pre>
        </p>
        <p>
          And you can GET your document in JSON format with the key received from POST on{" "}
          <pre>
            <code>{`curl -X GET \\
  'https://stashbin.xyz/api/document?key=examplekey'`}</code>
          </pre>
          If you only want the content as a plain text, you can use the raw endpoint.
          <pre>
            <code>{`curl -X GET 'https://stashbin.xyz/raw/examplekey'`}</code>
          </pre>
        </p>
      </div>
      <Footer />
    </main>
  )
}
