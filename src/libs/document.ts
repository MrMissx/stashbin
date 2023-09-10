import { Environment } from "../shared/Environment"

export async function getDocument(key: string) {
  const res = await fetch(`${Environment.gatewayUrl}/document?key=${key}`)

  const response = await res.json()
  if (response.ok) {
    return response.data.content
  }
  return null
}

export async function createDocument(content: string) {

  const res = await fetch(`${Environment.gatewayUrl}/document`, {
    method: "POST",
    body: JSON.stringify({ content }),
  })

  const data = await res.json()
  if (data.ok) {
    return data.key
  }
  return null
}
