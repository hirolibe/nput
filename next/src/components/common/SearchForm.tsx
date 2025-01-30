import SearchIcon from '@mui/icons-material/Search'
import { TextField, InputAdornment } from '@mui/material'
import { useState, KeyboardEvent } from 'react'

interface SearchProps {
  onSearch: (query: string) => void
}

const SearchForm: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSearch(searchQuery)
    }
  }

  return (
    <TextField
      fullWidth
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
      placeholder="検索キーワードを入力"
      sx={{
        borderRadius: 2,
        backgroundColor: 'white',
        mb: 2,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
      }}
    />
  )
}

export default SearchForm
