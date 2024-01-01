import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import {
  createPaiment,
  getPaiment,
  getPaimentByUser,
  payee,
  deletePaiment,
  updatePaiment,
  setError,
} from "../redux/features/paimentSlice";
import { getCaisse } from "../redux/features/caisseSlice";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DangerousIcon from "@mui/icons-material/Dangerous";

import { toast } from "react-toastify";
import "../assets/styles/loadingIcon.css";
import "../assets/styles/select.css";
import { getFrais } from "../redux/features/fraisSlice";
import { getUser } from "../redux/features/userSlice";

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


const Paiments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { paiment, loading } = useSelector((state) => ({ ...state.paiment }));
  const [showAddPaimentPopup, setShowAddPaimentPopup] = useState(false);
  const [showEditPaimentPopup, setShowEditPaimentPopup] = useState(false);
  const [showDeletePaimentPopup, setShowDeletePaimentPopup] = useState(false);
  const [showEditStatusPopup, setShowEditStatusPopup] = useState(false);
  const [paimentData, setPaimentData] = useState({
    UserCIN: "",
    fraiNom: "",
  });
  const [selectedPaimentForEdit, setSelectedPaimentForEdit] = useState(null);
  const [selectedPaimentForDelete, setSelectedPaimentForDelete] = useState({});
  const [selectedForUpdateStatus, setSelectedForUpdateStatus] = useState(null);
  const [stringErrorMessage, setStringErrorMessage] = useState("");
  const { users } = useSelector((state) => ({ ...state.user }));
  const { frais } = useSelector((state) => ({ ...state.frais }));
  const { caisse } = useSelector((state) => ({ ...state.caisse }));
  const role = localStorage.getItem("role");

  const { error } = useSelector((state) => state.paiment);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("profile")).id;
    {
      role !== "resident"
        ? dispatch(getPaiment())
        : dispatch(getPaimentByUser(userId));
      dispatch(getCaisse());
    }
    dispatch(getUser());
    dispatch(getFrais());
  }, []);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPaimentData((prevPaimentData) => ({
      ...prevPaimentData,
      [name]: value,
    }));
    dispatch(setError(""));
  };

  const handleAddPaiment = () => {
    setShowAddPaimentPopup(true);
    setShowEditPaimentPopup(false);
    setShowDeletePaimentPopup(false);
    setShowEditStatusPopup(false);
    setPaimentData("");
  };

  const handleAddPaimentSubmit = (e) => {
    e.preventDefault();
    if (paimentData.UserCIN && paimentData.fraiNom) {
      const formValue = {
        userId: paimentData.UserCIN,
        fraisId: paimentData.fraiNom,
      };
      dispatch(createPaiment({ formValue, navigate, toast }));
    } else {
      toast.error("Field can not be null");
      dispatch(setError("Field can not be null"));
    }
    setShowAddPaimentPopup(false);
  };

  const handleEditPaiment = (paiment) => {
    setSelectedPaimentForEdit(paiment);
    setPaimentData(paiment);

    if (selectedPaimentForEdit) {
      setShowEditStatusPopup(false);
      setShowEditPaimentPopup(true);
      setShowAddPaimentPopup(false);
      setShowDeletePaimentPopup(false);
    }
  };

  const handleConfirmEditPaiment = (e) => {
    e.preventDefault();
    if (selectedPaimentForEdit) {
      const id = selectedPaimentForEdit.idpaiment;
      const formValue = {
        UserCIN: paimentData.UserCIN,
        fraiNom: paimentData.fraiNom,
      };
      dispatch(updatePaiment({ id, formValue, toast, navigate }));
    }
    setShowEditPaimentPopup(false);
  };
  const handlePayeeClick = (paiment) => {
    if (role !=="resident") {
    setSelectedForUpdateStatus(paiment);
    setShowEditStatusPopup(true);
    setShowDeletePaimentPopup(false);
    setShowAddPaimentPopup(false);
    setShowEditPaimentPopup(false);}
  };
  const handleConfirmPayeeClick = () => {
    if (selectedForUpdateStatus) {
      const id = selectedForUpdateStatus.idpaiment;
      const formValue = {
        status: !selectedForUpdateStatus.status,
      };
      dispatch(payee({ id, formValue, toast, navigate }));
    }
    setShowEditStatusPopup(false);
  };

  const handleDeletePaiment = (paiment) => {
    setSelectedPaimentForDelete(paiment);
    setShowDeletePaimentPopup(true);
    setShowAddPaimentPopup(false);
    setShowEditPaimentPopup(false);
    setShowEditStatusPopup(false);
  };

  const handleConfirmDeletePaiment = () => {
    if (selectedPaimentForDelete) {
      const id = selectedPaimentForDelete.idpaiment;
      dispatch(deletePaiment({ id, toast, navigate }));
    }
    setShowDeletePaimentPopup(false);
  };

  const rowsPerPageOptions = [5, 10, 25, { value: -1, label: "Tout" }];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <div style={{ maxWidth: "1000px" }} className="container mt-4">
      {showAddPaimentPopup && (
        <div className="popup">
          <h2>Add new payment</h2>
          <form id="addPaimentForm" onSubmit={handleAddPaimentSubmit}>
            <div className="row mb-3 col-md-12 ">
              <select
                className="col-md-5 mb-2  form-select "
                value={paimentData.UserCIN}
                name="UserCIN"
                onChange={handleInputChange}
              >
                <option>--Select resident--</option>
                {users &&
                  users
                    .filter((user) => user.role === "resident")
                    .map((User, index) => (
                      <option key={index} value={User.CIN}>
                        {User.nom} & {User.prenom}
                      </option>
                    ))}
              </select>

              <select
                className="col-md-5 form-select"
                value={paimentData.fraiNom}
                name="fraiNom"
                onChange={handleInputChange}
              >
                <option value="">--select cost--</option>
                {frais &&
                  frais.map((Frais, index) => (
                    <option key={index} value={Frais.Nom}>
                      {Frais.Nom}
                    </option>
                  ))}
              </select>
            </div>

            <div className="text-left">
              <button type="submit" className="btn btn-primary my-1 me-3 ">
                Add new
              </button>
              <button
                type="button "
                onClick={() => setShowAddPaimentPopup(false)}
                className="btn btn-secondary  my-1 "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Pop-up de modification d'utilisateur */}
      {showEditPaimentPopup && selectedPaimentForEdit && paimentData && (
        <div className="popup">
          <h2>Update Payment</h2>
          <form id="updatePaimentForm" onSubmit={handleConfirmEditPaiment}>
            <div className="row mb-3 col-md-12 ">
              <select
                className="col-md-5  mb-2 form-select"
                value={paimentData.UserCIN}
                name="UserCIN"
                onChange={handleInputChange}
              >
                <option>--Select Resident--</option>
                {users &&
                  users
                    .filter((user) => user.role === "resident")
                    .map((User, index) => (
                      <option key={index} value={User.CIN}>
                        {User.nom} & {User.prenom}
                      </option>
                    ))}
              </select>

              <select
                className="col-md-5 form-select"
                value={paimentData.fraiNom}
                name="fraiNom"
                onChange={handleInputChange}
              >
                <option value="">--Select cost--</option>
                {frais &&
                  frais.map((Frais, index) => (
                    <option key={index} value={Frais.Nom}>
                      {Frais.Nom}
                    </option>
                  ))}
              </select>
            </div>

            <div className="text-left">
              <button type="submit" className="btn btn-primary me-3 my-1 ">
                Update
              </button>
              <button
                type="button"
                onClick={() => setShowEditPaimentPopup(false)}
                className="btn btn-secondary my-1 "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pop-up de confirmation de suppression */}
      {showDeletePaimentPopup && selectedPaimentForDelete && (
        <div className="popup">
          <h2>Delete Confirmation ?</h2>
          <p>Are you sure you want to delete this payment ?</p>
          <div className="text-left">
            <button
              type="button"
              className="btn btn-danger me-3"
              onClick={handleConfirmDeletePaiment}
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setShowDeletePaimentPopup(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pop-up de confirmation de updateStatus */}
      {showEditStatusPopup && selectedForUpdateStatus && (
        <div className="popup mb-2">
          <h2>Confirm Update ?</h2>
          <p>Are you sure you want to update Status ?</p>
          <div className="text-left">
            <button
              type="button"
              className="btn btn-danger me-3"
              onClick={handleConfirmPayeeClick}
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setShowEditStatusPopup(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {!loading ? (
        <div
          className={`table-container ${
            showAddPaimentPopup ? "popup-visible" : ""
          }`}
        >
          <TableContainer className="ml-5" sx={{ maxWidth: 1000 }}>
            {role === "resident" && (
              <div className="d-flex mb-3 align-items-end">
                <div
                  style={{
                    backgroundColor: "#C01E26",
                    color: "white",
                    borderRadius: "3px",
                  }}
                >
                  <p style={{ margin: "8px" }}>
                    Cash balance : {caisse.montant}{" "}
                  </p>
                </div>
              </div>
            )}
            {role !== "resident" && (
              <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary" onClick={handleAddPaiment}>
                  Add new payment
                  <AddCircleOutlineIcon className="ms-2" color="white" />
                </button>
              </div>
            )}

            <Table sx={{ maxWidth: 1000 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell>CIN resident</StyledTableCell>
                  {role !== "resident" && (
                    <StyledTableCell>Full Name</StyledTableCell>
                  )}
                  <StyledTableCell>Costs</StyledTableCell>
                  <StyledTableCell>Rising</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  {role !== "resident" && (
                    <StyledTableCell>Action</StyledTableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading &&
                  paiment &&
                  paiment?.length !==0 && 
                  (rowsPerPage > 0
                    ? paiment.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : paiment).map((paiment, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell>{paiment.UserCIN}</StyledTableCell>
                      {role !== "resident" && (
                        <StyledTableCell>
                          {paiment.User.nom} & {paiment.User.prenom}
                        </StyledTableCell>
                      )}
                      <StyledTableCell>{paiment.fraiNom}</StyledTableCell>
                      <StyledTableCell>{paiment?.frai?.montant ||0 }</StyledTableCell>
                      <StyledTableCell>
                        {paiment.status === true ? (
                          <button
                            style={{
                              color: "green",
                              marginLeft: "10px",
                              cursor: "pointer",
                              border: "none",
                              padding: 0,
                              background: "none",
                            }}
                            onClick={() => handlePayeeClick(paiment, false)}
                          >
                            <CheckCircleIcon />
                          </button>
                        ) : (
                          
                          <button
                            style={{
                              color: "red",
                              marginLeft: "10px",
                              cursor: "pointer",
                              border: "none",
                              padding: 0,
                              background: "none",
                            }}
                            
                            onClick={() => handlePayeeClick(paiment, true)}
                          >
                            <DangerousIcon />
                          </button>
                        )}
                      </StyledTableCell>
                      {role !== "resident" && (
                        <StyledTableCell>
                          <IconButton
                            color="primary"
                            aria-label="edit"
                            onClick={() => handleEditPaiment(paiment)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            aria-label="delete"
                            onClick={() => handleDeletePaiment(paiment)}
                          >
                            <DeleteIcon style={{ color: "#FD454E" }} />
                          </IconButton>
                        </StyledTableCell>
                      )}
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={paiment && paiment.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
      ) : (
        <div className="load">
          <div className="loader"></div>
          <h2 className="marginLoad">Loading ...</h2>
        </div>
      )}
    </div>
  );
};

export default Paiments;
