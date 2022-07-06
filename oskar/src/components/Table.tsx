import { DataGrid, GridColDef, GridSelectionModel, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, FormControlLabel, IconButton, Switch } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Book } from '../types/global';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { api } from '../api/api';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'Title', width: 190 },
  {
    field: 'author',
    headerName: 'Author',
    width: 250,
  },
  {
    field: 'price',
    headerName: 'Price',
    width: 150,
  },
];

interface Props {
  data: Book[];
  setIsEditingMode: Dispatch<SetStateAction<boolean>>;
  setSelectedBooks: Dispatch<SetStateAction<GridSelectionModel>>;
  setBooks: Dispatch<SetStateAction<Book[]>>;
  isEditingMode: boolean;
  selectedBooks: GridSelectionModel;
}

interface TableData extends Omit<Book, "author"> {
  author: string;
}

export const Table = ({ data, setBooks, isEditingMode, selectedBooks, setIsEditingMode, setSelectedBooks }: Props) => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setTableData(data.map(book => ({
      ...book,
      author: `${book.author.firstName} ${book.author.lastName}`,
    })))
  }, [data])

  const handleDeleteItems = async () => {
    setIsDeleting(true)

    try {
      selectedBooks.map(async (book) => {
        await api.delete(`/books/${book}`)
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsDeleting(false)
    }
    const newBooks = data.filter(book => !selectedBooks.includes(book.id))
    setBooks(newBooks)
  }

  if (!data) {
    return null
  }

  return (
    <Box style={{ height: 450 }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}>
        <FormControlLabel control={<Switch value={isEditingMode} onChange={(_, checked) => setIsEditingMode(checked)} />} label="Editing mode" />
        <LoadingButton
          onClick={handleDeleteItems}
          endIcon={<DeleteIcon />}
          loading={isDeleting}
          loadingPosition="end"
          variant="contained"
          style={{ backgroundColor: '#f44336', marginLeft: "16px", marginBottom: "16px" }}
        >
          Delete
        </LoadingButton>
      </div>
      <DataGrid
        rows={tableData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        //sortModel={[{ field: "id", sort: "desc" }]}
        isRowSelectable={(params) => isEditingMode ? selectedBooks.length <= 1 : true}
        onSelectionModelChange={(selectionModel) => setSelectedBooks(selectionModel)}
        style={{
          width: "700px"
        }}
      />
    </Box>
  );
}
