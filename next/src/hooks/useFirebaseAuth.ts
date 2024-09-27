import { User, onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import auth from '@/utils/firebaseConfig'

export default function useFirebaseAuth() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // user情報をFirebaseから取得する処理

  const clear = () => {
    setCurrentUser(null)
    setLoading(false)
  }

  const logout = () => signOut(auth).then(clear)

  const nextOrObserver = async (user: User | null) => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setCurrentUser(user)
    setLoading(false)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, nextOrObserver)
    return unsubscribe
  }, [])

  return {
    currentUser,
    loading,
    logout,
  }
}
