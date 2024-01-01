import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Switch from "@mui/material/Switch";
import {
  setError,
  addUser,
  getUser,
  deleteUser,
  updateUser,
} from "../redux/features/userSlice";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import "../assets/styles/loadingIcon.css";
//import '../assets/styles/popup.css'

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

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { users, loading } = useSelector((state) => ({ ...state.user }));
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [showEditUserPopup, setShowEditUserPopup] = useState(false);
  const [showDeleteUserPopup, setShowDeleteUserPopup] = useState(false);
  const [userData, setUserData] = useState({
    CIN: "",
    nom: "",
    prenom: "",
    mail: "",
    password: "",
    numbloc: "",
    numhabitat: "",
    numTel: "",
  });
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);
  const [cinErrorMessage, setCinErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [numBlocErrorMessage, setNumBlocErrorMessage] = useState("");
  const [numHabitantErrorMessage, setNumHabitantErrorMessage] = useState("");
  const [numTelErrorMessage, setNumTelErrorMessage] = useState("");
  const { error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
    dispatch(setError(""));

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const cinFormat = /^\d{8}$/;
    const telFormat = /^\d{8}$/;
    const numFormat = /^\d$/;

    // Validation de CIN
    if (event.target.name === "CIN") {
      if (!event.target.value.trim().match(cinFormat)) {
        setCinErrorMessage("CIN must contain 8 digits");
      } else {
        setCinErrorMessage("");
      }
    }

    // Validation de l'email
    if (event.target.name === "mail") {
      if (
        event.target.value.trim().length === 0 ||
        !event.target.value.trim().match(mailFormat)
      ) {
        setEmailErrorMessage("Please enter a valid email address.");
      } else {
        setEmailErrorMessage("");
      }
    }

    // Validation du mot de passe
    if (event.target.name === "password") {
      if (event.target.value.trim().length < 6) {
        setPasswordErrorMessage(
          "The password must container at least 6 characters"
        );
      } else {
        setPasswordErrorMessage("");
      }
    }

    // Validation du numTel
    if (event.target.name === "numTel") {
      if (!event.target.value.trim().match(telFormat)) {
        setNumTelErrorMessage(
          "The phone number must container at least 8 characters"
        );
      } else {
        setNumTelErrorMessage("");
      }
    }

    // Validation du numbloc & num habitant
    if (event.target.name === "numbloc") {
      if (!event.target.value.trim().match(numFormat)) {
        setNumBlocErrorMessage("The numBloc must be numeric");
      } else {
        setNumBlocErrorMessage("");
      }
    }
    // Validation du num habitant
    if (event.target.name === "numhabitat") {
      if (!event.target.value.trim().match(numFormat)) {
        setNumHabitantErrorMessage("The resident number must be numeric");
      } else {
        setNumHabitantErrorMessage("");
      }
    }
  };

  const handleAddUser = () => {
    setShowAddUserPopup(true);
    setShowEditUserPopup(false);
    setShowDeleteUserPopup(false);
    setUserData("");
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (
      userData.CIN &&
      userData.mail &&
      userData.nom &&
      userData.prenom &&
      userData.password &&
      userData.numbloc &&
      userData.numhabitat &&
      userData.numTel
    ) {
      const formValue = {
        CIN: userData.CIN,
        nom: userData.nom,
        prenom: userData.prenom,
        mail: userData.mail,
        password: userData.password,
        numbloc: userData.numbloc,
        numhabitat: userData.numhabitat,
        numTel: userData.numTel,
      };
      if (
        emailErrorMessage ||
        passwordErrorMessage ||
        cinErrorMessage ||
        numBlocErrorMessage ||
        numHabitantErrorMessage ||
        numTelErrorMessage
      ) {
        return;
      }

      dispatch(addUser({ formValue, toast, navigate }));
    } else {
      toast.error("Field can not be null");
      dispatch(setError("Field can not be null"));
    }
    setShowAddUserPopup(false);
  };

  const handleEditUser = (user) => {
    setUserData(user);
    setSelectedUserForEdit(user);
    if (userData) {
      setShowEditUserPopup(true);
      setShowAddUserPopup(false);
      setShowDeleteUserPopup(false);
    }
  };

  const handleConfirmEditUser = (e) => {
    e.preventDefault();
    if (userData) {
      const id = userData.CIN;
      dispatch(updateUser({ id, userData, toast, navigate }));
    }
    setShowEditUserPopup(false);
  };

  const handleDeleteUser = (user) => {
    setSelectedUserForDelete(user);
    setShowDeleteUserPopup(true);
    setShowAddUserPopup(false);
    setShowEditUserPopup(false);
  };

  const handleConfirmDeleteUser = () => {
    if (selectedUserForDelete) {
      const id = selectedUserForDelete.CIN;
      dispatch(deleteUser({ id, toast, navigate }));
    }
    setShowDeleteUserPopup(false);
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
      {showAddUserPopup && (
        <div className="popup">
          <h2> Add new resident</h2>
          <form id="addUserForm" onSubmit={handleAddUserSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="CIN"
                  value={userData.CIN}
                  onChange={handleInputChange}
                  placeholder="CIN"
                  className="form-control"
                  error={cinErrorMessage}
                />
                {cinErrorMessage && (
                  <p className="text-danger">{cinErrorMessage}</p>
                )}
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="mail"
                  value={userData.mail}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="form-control"
                  error={emailErrorMessage}
                />

                {emailErrorMessage && (
                  <p className="text-danger">{emailErrorMessage}</p>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="nom"
                  value={userData.nom}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="prenom"
                  value={userData.prenom}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="form-control"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="numbloc"
                  value={userData.numbloc}
                  onChange={handleInputChange}
                  placeholder="NumBloc"
                  className="form-control"
                  error={numBlocErrorMessage}
                />
                {numBlocErrorMessage && (
                  <p className="text-danger">{numBlocErrorMessage}</p>
                )}
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="numhabitat"
                  value={userData.numhabitat}
                  onChange={handleInputChange}
                  placeholder="NumHabitat"
                  className="form-control"
                  error={numHabitantErrorMessage}
                />
                {numHabitantErrorMessage && (
                  <p className="text-danger">{numHabitantErrorMessage}</p>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="numTel"
                  value={userData.numTel}
                  onChange={handleInputChange}
                  placeholder="NumTele"
                  className="form-control"
                  error={numTelErrorMessage}
                />
                {numTelErrorMessage && (
                  <p className="text-danger">{numTelErrorMessage}</p>
                )}
              </div>
              <div className="col-md-6">
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="form-control"
                  error={passwordErrorMessage}
                />
                {passwordErrorMessage && (
                  <p className="text-danger">{passwordErrorMessage}</p>
                )}
              </div>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className="text-left">
              <button type="submit" className="btn btn-primary me-3 my-1 ">
                Add new
              </button>
              <button
                type="button"
                onClick={() => setShowAddUserPopup(false)}
                className="btn btn-secondary my-1 "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Pop-up de modification d'utilisateur */}
      {showEditUserPopup && selectedUserForEdit && userData && (
        <div className="popup">
          <h2>Update Resident</h2>
          <form id="updateUserForm" onSubmit={handleConfirmEditUser}>
            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="CIN"
                  value={userData.CIN}
                  onChange={handleInputChange}
                  placeholder="CIN"
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="email"
                  value={userData.mail}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="form-control"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="nom"
                  value={userData.nom}
                  onChange={handleInputChange}
                  placeholder={userData.nom}
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="prenom"
                  value={userData.prenom}
                  onChange={handleInputChange}
                  placeholder="Prénom"
                  className="form-control"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="numbloc"
                  value={userData.numbloc}
                  onChange={handleInputChange}
                  placeholder="NumBloc"
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="numhabitat"
                  value={userData.numhabitat}
                  onChange={handleInputChange}
                  placeholder="Num Resident"
                  className="form-control"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="numTel"
                  value={userData.numTel}
                  onChange={handleInputChange}
                  placeholder="Num Tel"
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  placeholder="*****"
                  className="form-control"
                />
              </div>
            </div>
            <div className="text-left">
              <button type="submit" className="btn btn-primary me-3 my-1 ">
                Update
              </button>
              <button
                type="button"
                onClick={() => setShowEditUserPopup(false)}
                className="btn btn-secondary my-1 "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pop-up de confirmation de suppression */}
      {showDeleteUserPopup && selectedUserForDelete && (
        <div className="popup">
          <h2>Delete Confirmation ?</h2>
          <p>Are you sure you want to delete this resident ?</p>
          <div className="text-left">
            <button
              type="button"
              className="btn btn-danger me-3"
              onClick={handleConfirmDeleteUser}
            >
              Confirm
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteUserPopup(false)}
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
            showAddUserPopup ? "popup-visible" : ""
          }`}
        >
          <TableContainer sx={{ maxWidth: 1000 }}>
            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-primary" onClick={handleAddUser}>
                Add new resident
                <AddCircleOutlineIcon className="ms-2" color="white" />
              </button>
            </div>

            <Table sx={{ maxWidth: 1000 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>CIN</StyledTableCell>
                  <StyledTableCell>Full Name</StyledTableCell>
                  <StyledTableCell>NumBloc</StyledTableCell>
                  <StyledTableCell>NumResident</StyledTableCell>
                  <StyledTableCell>NumTel</StyledTableCell>
                  <StyledTableCell>Payment</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users &&
                    (rowsPerPage > 0
                      ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : users)
                    .filter((user) => user.role === "resident")
                    .map((user, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">
                          {user.CIN}
                        </StyledTableCell>
                        <StyledTableCell>
                          {user.nom} &amp; {user.prenom}
                        </StyledTableCell>
                        <StyledTableCell>{user.numbloc}</StyledTableCell>
                        <StyledTableCell>{user.numhabitat}</StyledTableCell>
                        <StyledTableCell>{user.numTel}</StyledTableCell>
                        <StyledTableCell>
                          <Switch
                            checked
                            color={
                              user?.paiments?.length !== 0 &&
                              user?.paiments?.some(
                                (payment) => payment.status === !true
                              )
                                ? "error"
                                : "success"
                            }
                            disabled
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <IconButton
                            color="primary"
                            aria-label="edit"
                            onClick={() => handleEditUser(user)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            aria-label="delete"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <DeleteIcon style={{ color: "#FD454E" }} />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={users && users.filter((user) => user.role === "resident").length}
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

export default UserManagement;
