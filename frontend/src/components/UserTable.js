import React, { useEffect, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../redux/features/userSlice";
import { getCaisse } from "../redux/features/caisseSlice";
import "../assets/styles/loadingIcon.css";
import DangerousIcon from "@mui/icons-material/Dangerous";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#474242",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const UserTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { users, loading } = useSelector((state) => ({ ...state.user }));
  const { caisse } = useSelector((state) => ({ ...state.caisse }));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(getCaisse());
  }, []);

  const rowsPerPageOptions = [5, 10, 25, { value: -1, label: "All" }];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div className="d-flex mb-3 align-items-end">
        <div
          style={{
            backgroundColor: "#C01E26",
            color: "white",
            borderRadius: "3px",
          }}
        >
          <p style={{ margin: "8px" }}>Cash balance : {caisse.montant} </p>
        </div>
      </div>

      {!loading ? (
        <TableContainer component={Paper} sx={{ maxWidth: 1000 }}>
          <Table sx={{ maxWidth: 1000 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Cin</StyledTableCell>
                <StyledTableCell>Full Name</StyledTableCell>
                <StyledTableCell>NumBloc</StyledTableCell>
                <StyledTableCell>Num Resident</StyledTableCell>
                <StyledTableCell>NumTele</StyledTableCell>
                <StyledTableCell>Pay</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users &&
                (rowsPerPage > 0
                  ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : users)
                  .filter(
                    (user) =>
                      user.role === "resident" &&
                      user.paiments.length !== 0 &&
                      user.paiments.some((payment) => payment.status === !true)
                  )
                  .map((user, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">
                        {user.CIN}
                      </StyledTableCell>
                      <StyledTableCell>
                        {user.nom} & {user.prenom}{" "}
                      </StyledTableCell>
                      <StyledTableCell>{user.numbloc}</StyledTableCell>
                      <StyledTableCell>{user.numhabitat}</StyledTableCell>
                      <StyledTableCell>{user.numTel}</StyledTableCell>
                      <StyledTableCell>
                        <DangerousIcon
                          style={{
                            color: "red",
                            marginLeft: "10px",
                            border: "none",
                            padding: 0,
                            background: "none",
                          }}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={users && users.filter(
              (user) =>
                user.role === "resident" &&
                user.paiments.length !== 0 &&
                user.paiments.some((payment) => payment.status === !true)
            ).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      ) : (
        <div className="load">
          <div className="loader"></div>
          <h2 className="marginLoad">Loading ...</h2>
        </div>
      )}
    </>
  );
};

export default UserTable;
