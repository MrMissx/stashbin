import { GetServerSidePropsContext } from "next"

import { getDocument } from "../../libs/document"

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
  const content = await getDocument(params.slug as string)
  if (!content) {
    return { props: {} }
  }

  // serve as raw text
  res.setHeader("Content-Type", "text/plain")
  res.write(content)
  res.end()

  return { props: {} }
}
