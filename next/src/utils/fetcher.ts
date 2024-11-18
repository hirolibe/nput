import axios from 'axios'
import { handleError } from '@/utils/errorHandler'

export const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url)
    return res.data
  } catch (err) {
    handleError(err)
    throw err
  }
}
