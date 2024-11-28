import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'

export const fetcher = async ([url, idToken]: [string, string | undefined]) => {
  const headers = idToken ? { Authorization: `Bearer ${idToken}` } : undefined
  const res = await axios.get(url, { headers })
  return camelcaseKeys(res.data, { deep: true })
}
