import {
  AppBar,
  Box,
  IconButton,
  Tab,
  Tabs,
  Tooltip as MuiToolTip,
} from '@mui/material'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { FaXTwitter } from 'react-icons/fa6'
import { useProfile } from '@/hooks/useProfile'
import { generateRandomSlug } from '@/utils/generateRandomSlug'

Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ChartDataLabels,
  Legend,
  Title,
  Tooltip,
)

interface DurationStatusProps {
  name?: string
  dailyDurations?: number[]
  weeklyDurations?: number[]
  monthlyDurations?: number[]
}

const DurationStatus = (props: DurationStatusProps) => {
  const { name, dailyDurations, weeklyDurations, monthlyDurations } = props
  const router = useRouter()

  const { profileData } = useProfile()

  const handleClick = () => {
    const slug = generateRandomSlug()
    router.push(`/${name}/${slug}`)
  }
  const [tabIndex, setTabIndex] = useState(0)

  const getRecentDays = () => {
    const today = new Date()
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      return `${date.getMonth() + 1}/${date.getDate()}`
    }).reverse()
  }

  const getRecentWeeks = () => {
    const today = new Date()
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - i * 7)
      const startOfWeek = new Date(date)
      startOfWeek.setDate(date.getDate() - date.getDay())
      return `${startOfWeek.getMonth() + 1}/${startOfWeek.getDate()}`
    }).reverse()
  }

  const getRecentMonths = () => {
    const today = new Date()
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setMonth(today.getMonth() - i)
      return `${date.getMonth() + 1}月`
    }).reverse()
  }

  // ダミーデータ（日）
  const dailyData = {
    labels: getRecentDays(),
    datasets: [
      {
        label: '作業時間',
        data: dailyDurations,
        backgroundColor: '#C0EEF0CC',
        borderColor: '#A0D8E6',
        borderWidth: 1,
      },
    ],
  }

  // ダミーデータ（週）
  const weeklyData = {
    labels: getRecentWeeks(),
    datasets: [
      {
        label: '作業時間',
        data: weeklyDurations,
        backgroundColor: '#C0EEF0CC',
        borderColor: '#A0D8E6',
        borderWidth: 1,
      },
    ],
  }

  // ダミーデータ（月）
  const monthlyData = {
    labels: getRecentMonths(),
    datasets: [
      {
        label: '作業時間',
        data: monthlyDurations,
        backgroundColor: '#C0EEF0CC',
        borderColor: '#A0D8E6',
        borderWidth: 1,
      },
    ],
  }

  const getWeekdayInKanji = (day: number) => {
    const weekdays = ['日', '月', '火', '水', '木', '金', '土']
    return weekdays[day]
  }

  const dynamicStepSize = (maxValue: number) => {
    if (maxValue <= 3600 * 5) {
      return 3600
    } else if (maxValue <= 3600 * 10) {
      return 3600 * 2
    } else if (maxValue <= 3600 * 24) {
      return 3600 * 5
    } else if (maxValue <= 3600 * 50) {
      return 3600 * 10
    } else if (maxValue <= 3600 * 100) {
      return 3600 * 20
    } else if (maxValue <= 3600 * 200) {
      return 3600 * 40
    } else {
      return 3600 * 50
    }
  }

  const maxDailyDuration = dailyDurations ? Math.max(...dailyDurations) : 0
  const dailyStepSize = dynamicStepSize(maxDailyDuration)

  const maxWeeklyDuration = weeklyDurations ? Math.max(...weeklyDurations) : 0
  const weeklyStepSize = dynamicStepSize(maxWeeklyDuration)

  const maxMonthlyDuration = monthlyDurations
    ? Math.max(...monthlyDurations)
    : 0
  const monthlyStepSize = dynamicStepSize(maxMonthlyDuration)

  return (
    <Box
      sx={{
        border: '1px solid',
        borderRadius: 2,
        borderColor: 'divider',
        width: '100%',
      }}
    >
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
          value={tabIndex}
          onChange={(_, newValue) => setTabIndex(newValue)}
          textColor="inherit"
          indicatorColor="secondary"
          variant="fullWidth"
          sx={{ minHeight: 'unset' }}
        >
          <Tab
            label="日"
            sx={{
              fontWeight: 'bold',
              borderTopLeftRadius: 1,
              backgroundColor:
                tabIndex === 0 ? 'backgroundColor.icon' : 'transparent',
              '&:hover': {
                backgroundColor: 'backgroundColor.hover',
              },
              height: '40px',
              minHeight: 'unset',
            }}
          />
          <Tab
            label="週"
            sx={{
              fontWeight: 'bold',
              backgroundColor:
                tabIndex === 1 ? 'backgroundColor.icon' : 'transparent',
              '&:hover': {
                backgroundColor: 'backgroundColor.hover',
              },
              height: '40px',
              minHeight: 'unset',
            }}
          />
          <Tab
            label="月"
            sx={{
              fontWeight: 'bold',
              borderTopRightRadius: '8px',
              backgroundColor:
                tabIndex === 2 ? 'backgroundColor.icon' : 'transparent',
              '&:hover': {
                backgroundColor: 'backgroundColor.hover',
              },
              height: '40px',
              minHeight: 'unset',
            }}
          />
        </Tabs>
      </AppBar>
      <Box
        sx={{
          position: 'relative',
          height: { xs: '250px', sm: '300px' },
          px: 2,
          py: 2,
        }}
      >
        {tabIndex === 0 && (
          <>
            {profileData?.user.name === name && (
              <MuiToolTip
                title="学習記録をXでシェア"
                sx={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'backgroundColor.icon',
                  '&:hover': { backgroundColor: 'backgroundColor.hover' },
                }}
              >
                <IconButton onClick={handleClick}>
                  <FaXTwitter size={24} />
                </IconButton>
              </MuiToolTip>
            )}
            <Bar
              data={dailyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      callback: (tickValue: string | number) => {
                        if (typeof tickValue === 'number') {
                          const dateString = getRecentDays()[tickValue]
                          const [month, day] = dateString.split('/').map(Number)
                          const date = new Date(
                            new Date().getFullYear(),
                            month - 1,
                            day,
                          )

                          const weekdayIndex = date.getDay()
                          const weekdayKanji = getWeekdayInKanji(weekdayIndex)
                          return `${dateString} ${weekdayKanji}`
                        }
                        return tickValue
                      },
                    },
                  },
                  y: {
                    ticks: {
                      callback: (value) => {
                        if (typeof value === 'number') {
                          const hours = Math.floor(value / 3600)
                          return `${hours}時間`
                        }
                        return value
                      },
                      stepSize: dailyStepSize,
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    enabled: false,
                  },
                  datalabels: {
                    color: '#000',
                    font: (context) => {
                      const width = context.chart.width
                      if (width < 300) {
                        return { size: 8 }
                      } else {
                        return { size: 12 }
                      }
                    },
                    textAlign: 'center',
                    formatter: (value: number) => {
                      const hours = Math.floor(value / 3600)
                      const minutes = Math.floor((value % 3600) / 60)
                      return hours
                        ? `${hours}時間\n${minutes}分`
                        : `${minutes}分`
                    },
                  },
                },
              }}
            />
          </>
        )}
        {tabIndex === 1 && (
          <Bar
            data={weeklyData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  ticks: {
                    callback: (value) => {
                      if (typeof value === 'number') {
                        const hours = Math.floor(value / 3600)
                        return `${hours}時間`
                      }
                      return value
                    },
                    stepSize: weeklyStepSize,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  enabled: false,
                },
                datalabels: {
                  color: '#000',
                  font: (context) => {
                    const width = context.chart.width
                    if (width < 300) {
                      return { size: 8 }
                    } else {
                      return { size: 12 }
                    }
                  },
                  textAlign: 'center',
                  formatter: (value: number) => {
                    const hours = Math.floor(value / 3600)
                    const minutes = Math.floor((value % 3600) / 60)
                    return hours ? `${hours}時間\n${minutes}分` : `${minutes}分`
                  },
                },
              },
            }}
          />
        )}
        {tabIndex === 2 && (
          <Bar
            data={monthlyData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  ticks: {
                    callback: (value) => {
                      if (typeof value === 'number') {
                        const hours = Math.floor(value / 3600)
                        return `${hours}時間`
                      }
                      return value
                    },
                    stepSize: monthlyStepSize,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  enabled: false,
                },
                datalabels: {
                  color: '#000',
                  font: (context) => {
                    const width = context.chart.width
                    if (width < 360) {
                      return { size: 8 }
                    } else {
                      return { size: 12 }
                    }
                  },
                  textAlign: 'center',
                  formatter: (value: number) => {
                    const hours = Math.floor(value / 3600)
                    const minutes = Math.floor((value % 3600) / 60)
                    return hours ? `${hours}時間\n${minutes}分` : `${minutes}分`
                  },
                },
              },
            }}
          />
        )}
      </Box>
    </Box>
  )
}

export default DurationStatus
