import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBCardImage,
} from "mdb-react-ui-kit";

import bgImage from "../assets/images/bg-sign-in.jpg";
import MainNavbar from "../components/MainNavbar";
import { setError, login } from "../redux/features/authSlice";

const Login = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [inputs, setInputs] = useState({
    mail: "admin@gmail.com",
    password: "*****",
  });
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const { loading, error } = useSelector((state) => ({ ...state.auth }));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeHandler = (e) => {
    dispatch(setError(""));
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // Validation de l'email
    if (e.target.name === "mail") {
      if (
        e.target.value.trim().length === 0 ||
        !e.target.value.trim().match(mailFormat)
      ) {
        setEmailErrorMessage("Please enter a valid email address.");
      } else {
        setEmailErrorMessage("");
      }
    }

    // Validation du mot de passe
    if (e.target.name === "password") {
      if (e.target.value.trim().length < 6) {
        setPasswordErrorMessage("Password must be at least 6 characters long.");
      } else {
        setPasswordErrorMessage("");
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (inputs.mail && inputs.password) {
      const formValue = { mail: inputs.mail, password: inputs.password };
      if (emailErrorMessage || passwordErrorMessage) {
        return;
      }

      dispatch(login({ formValue, navigate }));
    } else {
      dispatch(setError("Please fill in all the fields."));
    }
  };
  if (isAuthenticated) return <Navigate to="/dashboard" />;

  return (
    <MDBContainer className="my-3">
      <MainNavbar expand="sm" />
      <MDBCard className="my-5 mx-5">
        <MDBRow className="g-0">
          <MDBCol md="6" className="h-full w-full">
            <MDBCardImage
              src={bgImage}
              alt="login form"
              className="rounded-start h-100 w-100 object-cover"
            />
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column">
              <div className="d-flex flex-row justify-content-center align-items-center mt-2">
                <MDBIcon
                  fas
                  icon="cubes"
                  size="3x"
                  style={{ color: "#074D9C", marginRight: "1rem" }}
                />
                <h1
                  className="fw-bold mb-0"
                  style={{ color: "#074D9C", fontSize: "24px" }}
                >
                  Sign-in
                </h1>
              </div>

              <h5 className="fw-normal my-3 pb-1 text-center">
                Sign into your account
              </h5>

              <form onSubmit={submitHandler}>
                <label htmlFor="emailInput" className="fw-normal mb-2">
                  Email:
                </label>
                <MDBInput
                  wrapperClass="mb-2"
                  placeholder="Enter your email"
                  value={inputs.mail}
                  id="emailInput"
                  name="mail"
                  type="email"
                  size="md"
                  className="w-70"
                  labelClassName="mb-2"
                  onChange={changeHandler}
                  error={emailErrorMessage}
                />
                {emailErrorMessage && (
                  <p className="text-danger">{emailErrorMessage}</p>
                )}

                <label htmlFor="passwordInput" className="fw-normal mb-2">
                  Password:
                </label>
                <MDBInput
                  wrapperClass="mb-2"
                  placeholder="Enter your password"
                  value={inputs.password}
                  id="passwordInput"
                  name="password"
                  type="password"
                  size="md"
                  className="w-100"
                  labelClassName="mb-2"
                  onChange={changeHandler}
                  error={passwordErrorMessage}
                />
                {passwordErrorMessage && (
                  <p className="text-danger">{passwordErrorMessage}</p>
                )}

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
                  Login
                </button>
                {error && <p className="text-danger">{error}</p>}
              </form>

              <a
                className="small text-muted"
                href="/auth/forgetPassword"
                style={{ textDecoration: "none" }}
              >
                Forgot password?
              </a>

              <p className="small text-muted">
                Don't have an account?{" "}
                <a
                  href="/auth/register"
                  style={{ color: "#074D9C", textDecoration: "underline" }}
                >
                  Register here
                </a>
              </p>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
};

export default Login;
