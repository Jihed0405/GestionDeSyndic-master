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
import {
  createCategorie,
  getCategories,
  deleteCategorie,
  updateCategorie,
  setError,
} from "../redux/features/categorieSlice";
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

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { categories, loading } = useSelector((state) => ({
    ...state.categorie,
  }));
  const [showAddCategoriePopup, setShowAddCategoriePopup] = useState(false);
  const [showEditCategoriePopup, setShowEditCategoriePopup] = useState(false);
  const [showDeleteCategoriePopup, setShowDeleteCategoriePopup] =
    useState(false);
  const [categorieData, setCategorieData] = useState({
    NomCat: "",
    description: "",
  });
  const [selectedCategorieForEdit, setSelectedCategorieForEdit] =
    useState(null);
  const [selectedCategorieForDelete, setSelectedCategorieForDelete] =
    useState(null);
  const [stringErrorMessage, setStringErrorMessage] = useState("");

  const { error } = useSelector((state) => state.auth);
  const role = localStorage.getItem("role");

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCategorieData((prevCategorieData) => ({
      ...prevCategorieData,
      [name]: value,
    }));
    dispatch(setError(""));

    const StringFormat = /^[a-zA-Z _]+$/;

    // Validation du nom et de la description
    if (event.target.name === "NomCat") {
      if (!event.target.value.trim().match(StringFormat)) {
        setStringErrorMessage("The string must contain only letters");
      } else {
        setStringErrorMessage("");
      }
    }
  };

  const handleAddCategorie = () => {
    setShowAddCategoriePopup(true);
    setShowEditCategoriePopup(false);
    setShowDeleteCategoriePopup(false);
    setCategorieData("");
  };

  const handleAddCategorieSubmit = (e) => {
    e.preventDefault();
    if (categorieData.NomCat && categorieData.description) {
      const formValue = {
        NomCat: categorieData.NomCat,
        description: categorieData.description,
      };
      if (stringErrorMessage) {
        return;
      }

      dispatch(createCategorie({ formValue, navigate, toast }));
    } else {
      toast.error("Field can not be null");
      dispatch(setError("Veuillez remplir tous les champs."));
    }
    setShowAddCategoriePopup(false);
  };

  const handleEditCategorie = (categorie) => {
    setCategorieData(categorie);
    setSelectedCategorieForEdit(categorie);
    if (categorieData) {
      setShowEditCategoriePopup(true);
      setShowAddCategoriePopup(false);
      setShowDeleteCategoriePopup(false);
    }
  };

  const handleConfirmEditCategorie = (e) => {
    e.preventDefault();
    if (categorieData) {
      const id = categorieData.NomCat;

      dispatch(updateCategorie({ id, categorieData, toast, navigate }));
    }
    setShowEditCategoriePopup(false);
  };

  const handleDeleteCategorie = (categorie) => {
    setSelectedCategorieForDelete(categorie);
    setShowDeleteCategoriePopup(true);
    setShowAddCategoriePopup(false);
    setShowEditCategoriePopup(false);
  };

  const handleConfirmDeleteCategorie = () => {
    if (selectedCategorieForDelete) {
      const id = selectedCategorieForDelete.NomCat;
      dispatch(deleteCategorie({ id, toast, navigate }));
    }
    setShowDeleteCategoriePopup(false);
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
    <div style={{ maxWidth: "875px" }} className="container mt-4">
      {showAddCategoriePopup && (
        <div className="popup">
          <h2>Add new category</h2>
          <form id="addCategorieForm" onSubmit={handleAddCategorieSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="NomCat"
                  value={categorieData.NomCat}
                  onChange={handleInputChange}
                  placeholder="Category Name"
                  className="form-control"
                  error={stringErrorMessage}
                />
                {stringErrorMessage && (
                  <p className="text-danger">{stringErrorMessage}</p>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <textarea
                  type="text"
                  name="description"
                  value={categorieData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="form-control"
                />
              </div>
            </div>

            {error && <p className="text-danger">{error}</p>}
            <div className="text-left">
              <button type="submit" className="btn btn-primary me-3 my-1 ">
                Add new
              </button>
              <button
                type="button"
                onClick={() => setShowAddCategoriePopup(false)}
                className="btn btn-secondary my-1 "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Pop-up de modification d'utilisateur */}
      {showEditCategoriePopup && selectedCategorieForEdit && categorieData && (
        <div className="popup">
          <h2>Update Category</h2>
          <form id="updateCategorieForm" onSubmit={handleConfirmEditCategorie}>
            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="NomCat"
                  value={categorieData.NomCat}
                  onChange={handleInputChange}
                  placeholder={categorieData.NomCat}
                  className="form-control"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <textarea
                  type="text"
                  name="description"
                  value={categorieData.description}
                  onChange={handleInputChange}
                  placeholder={categorieData.description}
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
                onClick={() => setShowEditCategoriePopup(false)}
                className="btn btn-secondary my-1 "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pop-up de confirmation de suppression */}
      {showDeleteCategoriePopup && selectedCategorieForDelete && (
        <div className="popup">
          <h2>Delete Confirmation?</h2>
          <p>Are you sure you want to delete this Category ?</p>
          <div className="text-left">
            <button
              type="button"
              className="btn btn-danger me-3"
              onClick={handleConfirmDeleteCategorie}
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteCategoriePopup(false)}
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
            showAddCategoriePopup ? "popup-visible" : ""
          }`}
        >
          <TableContainer className="ml-5" sx={{ maxWidth: 800 }}>
            {role !== "resident" && (
              <div className="d-flex justify-content-end mb-3">
                <button
                  className="btn btn-primary"
                  onClick={handleAddCategorie}
                >
                  Add new category
                  <AddCircleOutlineIcon className="ms-2" color="white" />
                </button>
              </div>
            )}

            <Table sx={{ maxWidth: 800 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  {role !== "resident" && (
                    <StyledTableCell>Action</StyledTableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {categories &&
                    (rowsPerPage > 0
                      ? categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : categories).map((categorie, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">
                        {categorie.NomCat}
                      </StyledTableCell>
                      <StyledTableCell>{categorie.description}</StyledTableCell>
                      {role !== "resident" && (
                        <StyledTableCell>
                          <IconButton
                            color="primary"
                            aria-label="edit"
                            onClick={() => handleEditCategorie(categorie)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            aria-label="delete"
                            onClick={() => handleDeleteCategorie(categorie)}
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
              count={categories && categories.length}
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

export default Categories;
