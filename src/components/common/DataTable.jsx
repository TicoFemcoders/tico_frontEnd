import { Paper, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const DataTable = ({ columns, data, mobileRenderer }) => {
  return (
    <Box sx={{ width: '100%' }}>
      {mobileRenderer && (
        <Box sx={{ display: { xs: 'block', sm: 'none' }, p: 2 }}>
          {data.map((row, index) => mobileRenderer(row, index))}
        </Box>
      )}
      <TableContainer sx={{ display: { xs: 'none', sm: 'block' }, overflowX: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
              <TableHead>
                  <TableRow>
                      {columns.map((col, i) => (
                           col && (
                             <TableCell key={i} align={col.align || "left"} sx={{ color: 'text.mid', fontWeight: 700 }}>
                                 {col.header}
                             </TableCell>
                           )
                      ))}
                  </TableRow>
              </TableHead>
              <TableBody>
                  {data.map((row) => (
                      <TableRow key={row.id || Math.random()} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          {columns.map((col, i) => (
                              col && (
                                <TableCell key={i} align={col.align || "left"}>
                                    {col.renderCell(row)}
                                </TableCell>
                              )
                          ))}
                      </TableRow>
                  ))}
              </TableBody>
          </Table>
      </TableContainer>
    </Box>
  );
};
export default DataTable;