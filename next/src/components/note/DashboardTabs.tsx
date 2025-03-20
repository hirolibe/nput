import { AppBar, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, SyntheticEvent } from 'react'

interface DashboardTabsProps {
  tabIndex: number
  setTabIndex: Dispatch<SetStateAction<number>>
}

const DashboardTabs = (props: DashboardTabsProps) => {
  const router = useRouter()

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    props.setTabIndex(newValue)

    const routes = ['/dashboard', '/dashboard/folders']
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
        mb: 1,
      }}
    >
      <Tabs
        value={props.tabIndex}
        onChange={handleTabChange}
        indicatorColor="secondary"
        textColor="inherit"
      >
        <Tab
          label="ノート"
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
          label="フォルダ"
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

export default DashboardTabs
