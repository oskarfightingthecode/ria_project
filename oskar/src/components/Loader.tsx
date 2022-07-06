import { FC } from 'react';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const Loader: FC<CircularProgressProps> = (props) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress {...props} />
    </Box>
  );
}
