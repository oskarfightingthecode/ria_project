import { FC } from "react"
import { Box } from "@mui/material"

interface Props {
  children: JSX.Element | JSX.Element[]
};

export const PageWrapper: FC<Props> = ({ children }) => {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-around" width="80%" height="100vh" margin="0 auto">
      {children}
    </Box>
  )
}