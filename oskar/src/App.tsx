import { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { Table } from './components/Table';
import { Box, FormControl, Input, MenuItem, Select, TextField, Typography } from '@mui/material';
import { api } from './api/api';
import { Loader } from './components/Loader';
import { PageWrapper } from './components/PageWrapper';
import { Author, Book } from './types/global';
import LoadingButton from '@mui/lab/LoadingButton';
import { GridSelectionModel } from '@mui/x-data-grid';

type GetUserResponse = Book[]
type GetAuthorsResponse = Author[]

export const App = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [newBookName, setNewBookName] = useState("")
  const [newBookAuthorId, setNewBookAuthorId] = useState<number | null>(null)
  const [newBookPrice, setNewBookPrice] = useState<number | null>(15)
  const [loading, setLoading] = useState(false)
  const [isLoadingNewBook, setIsLoadingNewBook] = useState(false)
  const [isEditingMode, setIsEditingMode] = useState(false)
  const [selectedBooks, setSelectedBooks] = useState<GridSelectionModel>([]);

  useEffect(() => {
    if (!isEditingMode) {
      resetStates()
    }
  }, [isEditingMode])

  useEffect(() => {
    if (!isEditingMode) {
      return
    }

    if (!selectedBooks[0]) {
      return
    }

    const book = books.find(book => book.id === selectedBooks[0])
    if (!book) {
      return
    }

    setNewBookName(book?.title)
    setNewBookAuthorId(book?.author.id)
    setNewBookPrice(book?.price)
  }, [isEditingMode, selectedBooks])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await api.get<GetUserResponse>("/books/")
      const { data: authorsData } = await api.get<GetAuthorsResponse>("/authors/")
      setAuthors(authorsData)
      setNewBookAuthorId(authorsData[0].id)
      setBooks(data)
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }
  }

  const handleNewBookSubmit = async () => {
    try {
      setIsLoadingNewBook(true)
      const { data } = await api.post<Book>("/books/", {
        title: newBookName,
        authorId: newBookAuthorId,
        price: newBookPrice,
        isFiction: false,
      })

      setBooks([...books, data])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingNewBook(false)
      resetStates()
    }
  }

  const resetStates = () => {
    if (!authors[0]) {
      return
    }
    setNewBookPrice(15)
    setNewBookName("")
    setNewBookAuthorId(authors[0].id)
  }

  const editBook = async () => {
    try {
      setLoading(true)
      const book = books.find(book => book.id === selectedBooks[0])

      if (!book) {
        return
      }

      const { data } = await api.put<Book>(`/books/${book.id}`, {
        title: newBookName,
        price: newBookPrice,
        authorId: book.author.id
      })

      const newBooks = [...books.filter(book => book.id !== selectedBooks[0])]

      setBooks([...books.map(book => book.id === data.id ? data : book)])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <PageWrapper>
        <Loader size={64} />
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5" component="h2" marginBottom="16px">
          {isEditingMode && selectedBooks[0] ? `Editing book with id ${selectedBooks[0]}` : "New book"}
        </Typography>
        <FormControl onSubmit={handleNewBookSubmit}>
          <TextField
            placeholder='New Book Name'
            id="outlined-basic"
            label="Book name"
            variant="outlined"
            value={newBookName}
            onChange={e => setNewBookName(e.target.value)}
            style={{ marginBottom: "36px" }}
          />
          <TextField
            placeholder='New Book Price'
            id="outlined-basic"
            label="Book price"
            variant="outlined"
            value={newBookPrice}
            onChange={e => setNewBookPrice(+e.target.value)}
            style={{ marginBottom: "36px" }}
            type="number"
          />
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={newBookAuthorId}
            label="Book author"
            onChange={(e) => setNewBookAuthorId(e.target.value ? +e.target.value : 0)}
            style={{ marginBottom: "36px" }}
          >
            {authors.map(author => (
              <MenuItem key={author.id} value={author.id}>{author.firstName} {author.lastName}</MenuItem>
            ))}
          </Select>
          <LoadingButton loading={isLoadingNewBook} type='submit' onClick={() => isEditingMode ? editBook() : handleNewBookSubmit()} variant="contained" style={{ marginBottom: "36px" }}>{isEditingMode ? "Update book" : "Add new book"}</LoadingButton>
        </FormControl>
      </Box>
      <Table setBooks={setBooks} data={books} isEditingMode={isEditingMode} selectedBooks={selectedBooks} setIsEditingMode={setIsEditingMode} setSelectedBooks={setSelectedBooks} />
    </PageWrapper>
  )
}
