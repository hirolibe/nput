import CloseIcon from '@mui/icons-material/Close'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Divider,
  Stack,
  Autocomplete,
  TextField,
  Chip,
} from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'
import { Control, Controller } from 'react-hook-form'
import { useTags } from '@/hooks/useTags'
import { NoteFormData } from '@/pages/dashboard/notes/[slug]/edit'
import { styles } from '@/styles'

interface NoteEditorSidebarProps {
  open: boolean
  onClose: () => void
  control: Control<NoteFormData>
  inputTags: string[]
  setInputTags: Dispatch<SetStateAction<string[]>>
  setIsChanged: Dispatch<SetStateAction<boolean>>
  descriptionValidationRule: {
    maxLength: {
      value: number
      message: string
    }
  }
}

const NoteEditorSidebar = ({
  open,
  onClose,
  control,
  inputTags,
  setInputTags,
  setIsChanged,
  descriptionValidationRule,
}: NoteEditorSidebarProps) => {
  const { tagsData } = useTags()
  const [inputValue, setInputValue] = useState<string>('')
  const [maxTagsError, setMaxTagsError] = useState<boolean>(false)
  const [formatError, setFormatError] = useState<boolean>(false)
  const [maxLengthError, setMaxLengthError] = useState<boolean>(false)
  const [charCount, setCharCount] = useState<number>(0)

  const handleInputChange = (newInputValue: string) => {
    setFormatError(false)
    setMaxLengthError(false)
    setMaxTagsError(false)

    if (!newInputValue) {
      setInputValue('')
      return
    }

    const formatRegex = /^[a-zA-Z0-9ａ-ｚＡ-Ｚ０-９ぁ-んァ-ン一-龯]+$/
    if (!formatRegex.test(newInputValue)) {
      setFormatError(true)
      return
    }

    const maxTagLength = 20
    if (newInputValue.length > maxTagLength) {
      setMaxLengthError(true)
      return
    }

    const maxTags = 5
    if (inputTags.length >= maxTags) {
      setMaxTagsError(true)
      return
    }

    setInputValue(newInputValue)
    setIsChanged(true)
  }

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="persistent"
      sx={{
        borderTop: 'none',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: { xs: '100%', md: '400px' },
          boxSizing: 'border-box',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '64px',
        }}
      >
        <IconButton onClick={onClose} sx={{ ml: 2 }}>
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
        <Typography
          color="text.light"
          fontWeight="bold"
          fontSize={18}
          sx={{ ml: 1 }}
        >
          タグ・概要の登録
        </Typography>
      </Box>
      <Divider />

      <Box css={styles.pageMinHeight} sx={{ width: '100%', p: 2 }}>
        <Stack spacing={3}>
          {/* タグ入力フィールド */}
          <Box>
            <Typography sx={{ fontWeight: 'bold', color: 'text.light', p: 1 }}>
              タグ
            </Typography>
            <Box
              sx={{
                border: '1px solid',
                borderRadius: 2,
                borderColor: 'divider',
                p: 2,
              }}
            >
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    freeSolo
                    options={tagsData?.map((tag) => tag.name)}
                    value={inputTags}
                    onChange={(_, newTagNames) => {
                      setFormatError(false)
                      setMaxLengthError(false)
                      if (maxTagsError) {
                        setMaxTagsError(false)
                        return
                      }

                      if (newTagNames.length > 5) {
                        setMaxTagsError(true)
                        return
                      }

                      setInputTags(newTagNames)
                    }}
                    renderTags={(value, getTagProps) => (
                      <Box>
                        {value.map((option, index) => {
                          const { key, ...tagProps } = getTagProps({ index })
                          return (
                            <Chip
                              label={option}
                              variant="outlined"
                              deleteIcon={
                                <CloseIcon
                                  sx={{ width: '16px', height: '16px' }}
                                />
                              }
                              sx={{ fontSize: '12px', mr: 1 }}
                              key={key}
                              {...tagProps}
                            />
                          )
                        })}
                      </Box>
                    )}
                    renderOption={(props, option) => {
                      const tag = tagsData.find((tag) => tag.name === option)
                      return (
                        <li {...props}>
                          {option}{' '}
                          {tag?.notesCount ? `(${tag.notesCount})` : ''}
                        </li>
                      )
                    }}
                    inputValue={inputValue}
                    onInputChange={(_, value) => handleInputChange(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={
                          !inputTags.length ? 'タグは5つまで登録できます' : ''
                        }
                        error={maxTagsError || formatError || maxLengthError}
                        helperText={
                          (maxTagsError && 'タグは最大5つまで登録できます') ||
                          (formatError &&
                            'タグに記号とスペースは使用できません') ||
                          (maxLengthError && 'タグの最大文字数は20文字です')
                        }
                        sx={{
                          '& .MuiInputBase-root': {
                            p: 0,
                          },
                          '& .MuiOutlinedInput-input': {
                            p: 0,
                            minWidth: '200px',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                          '& .MuiFormHelperText-root': {
                            position: 'absolute',
                            top: '-52px',
                            left: '36px',
                            color: 'error',
                          },
                        }}
                      />
                    )}
                  />
                )}
              />
            </Box>
          </Box>

          {/* 概要入力フィールド */}
          <Box>
            <Typography sx={{ fontWeight: 'bold', color: 'text.light', p: 1 }}>
              概要
            </Typography>
            <Box
              sx={{
                border: '1px solid',
                borderRadius: 2,
                borderColor: 'divider',
                p: 1,
              }}
            >
              <Controller
                name="description"
                control={control}
                rules={descriptionValidationRule}
                render={({ field, fieldState }) => (
                  <>
                    <TextField
                      {...field}
                      type="textarea"
                      error={fieldState.invalid}
                      helperText={fieldState.error?.message}
                      placeholder="ノートの概要を入力してください"
                      multiline
                      fullWidth
                      rows={12}
                      onChange={(e) => {
                        field.onChange(e)
                        setCharCount(e.target.value.length)
                      }}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      color={charCount > 200 ? 'error' : 'text.light'}
                      sx={{ textAlign: 'right', display: 'block' }}
                    >
                      {charCount} / 200文字
                    </Typography>
                  </>
                )}
              />
            </Box>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  )
}

export default NoteEditorSidebar
