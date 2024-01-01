import AdminNavbar from "../components/MainNavbar";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setError, register } from "../redux/features/authSlice";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBCardImage,
} from "mdb-react-ui-kit";

import bgImage from "../assets/images/bg-sign-up.jpg";

const Register = () => {
  const [inputs, setInputs] = useState({
    cin: "",
    mail: "",
    nom: "",
    prenom: "",
    password: "",
    RepeatPassword: "",
  });
  const [cinErrorMessage, setCinErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [RepeatPasswordErrorMessage, setRepeatPasswordErrorMessage] =
    useState("");
  const { loading, error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    dispatch(setError(""));
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const cinFormat = /^\d{8}$/;

    if (e.target.name === "cin") {
      if (!e.target.value.trim().match(cinFormat)) {
        setCinErrorMessage("CIN must be 8 digits long");
      } else {
        setCinErrorMessage("");
      }
    }
    // Validation de l'email
    if (e.target.name === "mail") {
      if (
        e.target.value.trim().length === 0 ||
        !e.target.value.trim().match(mailFormat)
      ) {
        setEmailErrorMessage("Please enter a valid email address");
      } else {
        setEmailErrorMessage("");
      }
    }

    // Validation du mot de passe
    if (e.target.name === "password") {
      if (e.target.value.trim().length < 6) {
        setPasswordErrorMessage("Password must be at least 6 characters long");
      } else {
        setPasswordErrorMessage("");
      }
    }
    if (e.target.name === "RepeatPassword") {
      if (e.target.value.trim() !== inputs.password) {
        setRepeatPasswordErrorMessage(
          "Password and Repeat Password do not match"
        );
      } else {
        setRepeatPasswordErrorMessage("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      inputs.cin &&
      inputs.mail &&
      inputs.nom &&
      inputs.prenom &&
      inputs.password &&
      inputs.RepeatPassword
    ) {
      const formValue = {
        CIN: inputs.cin,
        nom: inputs.nom,
        prenom: inputs.prenom,
        mail: inputs.mail,
        password: inputs.password,
      };

      if (
        emailErrorMessage ||
        passwordErrorMessage ||
        cinErrorMessage ||
        RepeatPasswordErrorMessage
      ) {
        return;
      }

      dispatch(register({ formValue, navigate }));
    } else {
      dispatch(setError("Please fill in all the fields."));
    }
  };

  return (
    <MDBContainer className="my-3">
      <AdminNavbar expand="sm" />
      <MDBCard className="my-5 mx-5">
        <MDBRow className="g-0">
          <MDBCol md="6" className="h-full w-full">
            <MDBCardImage
              src={bgImage}
              alt="sign-up form"
              className="rounded-start h-100 w-100 object-cover"
            />
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column">
              <div className="d-flex flex-row justify-content-center align-items-center mt-2">
                <MDBIcon
                  fas
                  icon="user-plus"
                  size="3x"
                  style={{ color: "#074D9C", marginRight: "1rem" }}
                />
                <h1
                  className="fw-bold mb-0"
                  style={{ color: "#074D9C", fontSize: "24px" }}
                >
                  Sign-up
                </h1>
              </div>

              <h5 className="fw-normal my-3 pb-1 text-center">
                Create a new account
              </h5>

              <form onSubmit={handleSubmit}>
                <div className="d-flex flex-row justify-content-between mb-2">
                  <div className="w-50 me-3">
                    <label htmlFor="cinInput" className="fw-normal mb-2">
                      CIN:
                    </label>
                    <MDBInput
                      wrapperClass="mb-2"
                      placeholder="Enter your CIN"
                      id="cinInput"
                      type="text"
                      size="md"
                      className="w-100"
                      labelClassName="mb-2"
                      name="cin"
                      value={inputs.cin}
                      onChange={handleInputChange}
                      error={cinErrorMessage}
                    />
                    {cinErrorMessage && (
                      <p className="text-danger">{cinErrorMessage}</p>
                    )}
                  </div>
                  <div className="w-50 ms-3">
                    <label htmlFor="emailInput" className="fw-normal mb-2">
                      Email:
                    </label>
                    <MDBInput
                      wrapperClass="mb-2"
                      placeholder="Enter your email"
                      id="emailInput"
                      type="email"
                      size="md"
                      className="w-100"
                      labelClassName="mb-2"
                      name="mail"
                      value={inputs.mail}
                      onChange={handleInputChange}
                      error={emailErrorMessage}
                    />
                    {emailErrorMessage && (
                      <p className="text-danger">{emailErrorMessage}</p>
                    )}
                  </div>
                </div>

                <div className="d-flex flex-row justify-content-between mb-2">
                  <div className="w-50 me-3">
                    <label htmlFor="nomInput" className="fw-normal mb-2">
                      Nom:
                    </label>
                    <MDBInput
                      wrapperClass="mb-2"
                      placeholder="Enter your Nom"
                      id="nomInput"
                      type="text"
                      size="md"
                      className="w-100"
                      labelClassName="mb-2"
                      name="nom"
                      value={inputs.nom}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="w-50 ms-3">
                    <label htmlFor="prenomInput" className="fw-normal mb-2">
                      Prénom:
                    </label>
                    <MDBInput
                      wrapperClass="mb-2"
                      placeholder="Enter your Prénom"
                      id="prenomInput"
                      type="text"
                      size="md"
                      className="w-100"
                      labelClassName="mb-2"
                      name="prenom"
                      value={inputs.prenom}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="d-flex flex-row justify-content-between mb-2">
                  <div className="w-50 me-3">
                    <label htmlFor="passwordInput" className="fw-normal mb-2">
                      Password:
                    </label>
                    <MDBInput
                      wrapperClass="mb-2"
                      placeholder="Enter your password"
                      id="passwordInput"
                      type="password"
                      size="md"
                      className="w-100"
                      labelClassName="mb-2"
                      name="password"
                      value={inputs.password}
                      onChange={handleInputChange}
                      error={passwordErrorMessage}
                    />
                    {passwordErrorMessage && (
                      <p className="text-danger">{passwordErrorMessage}</p>
                    )}
                  </div>
                  <div className="w-50 ms-3">
                    <label
                      htmlFor="RepeatpasswordInput"
                      className="fw-normal mb-2"
                    >
                      Repeat Password:
                    </label>
                    <MDBInput
                      wrapperClass="mb-2"
                      placeholder="Repeat your password"
                      id="RepeatpasswordInput"
                      type="password"
                      size="md"
                      className="w-100"
                      labelClassName="mb-2"
                      name="RepeatPassword"
                      value={inputs.RepeatPassword}
                      onChange={handleInputChange}
                      error={RepeatPasswordErrorMessage}
                    />
                    {RepeatPasswordErrorMessage && (
                      <p className="text-danger">
                        {RepeatPasswordErrorMessage}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="mb-3 mt-2 px-5"
                  style={{
                    backgroundColor: "#074D9C",
                    color: "#FFFFFF",
                    boxShadow: "none",
                    border: "none",
                    padding: "8px 16px",
                    fontSize: "15px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Register
                </button>
                {error && <p className="text-danger">{error}</p>}
              </form>

              <p className="small text-muted">
                Already have an account?{" "}
                <a
                  href="/auth/login"
                  style={{ color: "#074D9C", textDecoration: "underline" }}
                >
                  Sign in here
                </a>
              </p>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
};

export default Register;
