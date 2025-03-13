'use client'

import { Authenticator } from '@aws-amplify/ui-react'
import { Modal } from '@mui/material'
import { I18n } from 'aws-amplify/utils'
import { usePathname, useSearchParams } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect } from 'react'
import AuthRedirect from './AuthRedirect'
import GuestLoginButton from './GuestLoginButton'
import authFormFields from '@/config/authFormFields'
import jaDict from '@/i18n/amplify/ja'

I18n.setLanguage('ja')
I18n.putVocabularies(jaDict)

export interface CustomAuthenticatorProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const CustomAuthenticator = (props: CustomAuthenticatorProps) => {
  const { isOpen, setIsOpen } = props
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const previousPath =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '') ||
    '/'

  useEffect(() => {
    localStorage.setItem('previousPath', previousPath)
  }, [previousPath])

  const components = {
    SignUp: {
      Footer() {
        return <GuestLoginButton {...props} />
      },
    },
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      disableScrollLock={true}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Authenticator
        socialProviders={['google']}
        formFields={authFormFields}
        components={components}
      >
        {() => <AuthRedirect setIsOpen={setIsOpen} />}
      </Authenticator>
    </Modal>
  )
}
