import { Paper, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Pagination } from "@mui/material";
import { useState, useEffect } from "react";

const DataTable = ({ columns, data, mobileRenderer, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
      setCurrentPage(1);
  }, [data]);

  const isPaginated = Boolean(itemsPerPage);
  const totalPages = isPaginated ? Math.ceil(data.length / itemsPerPage) : 1;
  const visibleData = isPaginated
      ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      : data;
  return (
    <Box sx={{ width: '100%' }}>
      {mobileRenderer && (
        <Box sx={{ display: { xs: 'block', sm: 'none' }, p: 2 }}>
          {visibleData.map((row, index) => mobileRenderer(row, index))}
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
                  {visibleData.map((row) => (
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
      {isPaginated && totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, borderTop: '1px solid', borderColor: 'border.soft' }}>
              <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  size="small"
              />
          </Box>
      )}
    </Box>
  );
};
export default DataTable;