import { AppBar, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, SyntheticEvent } from 'react'

interface SettingTabsProps {
  tabIndex: number
  setTabIndex: Dispatch<SetStateAction<number>>
}

const SettingTabs = (props: SettingTabsProps) => {
  const router = useRouter()

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    props.setTabIndex(newValue)

    const routes = ['/settings/account', '/settings/profile']
    if (routes[newValue]) {
      router.push(routes[newValue])
    }
  }

  return (
    <AppBar
      position="static"
      sx={{
        color: 'black',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'transparent',
      }}
    >
      <Tabs
        value={props.tabIndex}
        onChange={handleTabChange}
        indicatorColor="secondary"
        textColor="inherit"
      >
        <Tab
          label="アカウント"
          sx={{
            fontSize: { xs: 10, sm: 14 },
            fontWeight: 'bold',
            borderTopLeftRadius: 1,
            '&:hover': {
              backgroundColor: 'backgroundColor.hover',
            },
          }}
        />
        <Tab
          label="プロフィール"
          sx={{
            fontSize: { xs: 10, sm: 14 },
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'backgroundColor.hover',
            },
          }}
        />
      </Tabs>
    </AppBar>
  )
}

export default SettingTabs
