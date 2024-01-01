import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";

import MainNavbar from "../components/MainNavbar";
import { setError, Resetpassword } from "../redux/features/authSlice";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [inputs, setInputs] = useState({
    password: "",
    RepeatPassword: "",
  });
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [RepeatPasswordErrorMessage, setRepeatPasswordErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeHandler = (e) => {
    dispatch(setError(""));
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });

    // Password validation
    if (e.target.name === "password") {
      if (e.target.value.trim().length < 6) {
        setPasswordErrorMessage("Password must be at least 6 characters long");
      } else {
        setPasswordErrorMessage("");
      }
    }
    if (e.target.name === "RepeatPassword") {
      if (e.target.value.trim() !== inputs.password) {
        setRepeatPasswordErrorMessage("Password and Repeat Password do not match");
      } else {
        setRepeatPasswordErrorMessage("");
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (inputs.password && inputs.RepeatPassword) {
      const formValue = { password: inputs.password };
      if (passwordErrorMessage || RepeatPasswordErrorMessage) {
        return;
      }
      dispatch(Resetpassword({ formValue, toast, navigate }));
    } else {
      dispatch(setError("Please fill in all the fields."));
    }
  };

  return (
    <div className="my-3 container">
      <MainNavbar expand="sm" />
      <MDBContainer style={{ maxWidth: "800px" }} className="my-3">
        <MDBCard md="6" className="my-5 mx-5">
          <MDBRow className="g-0 centre">
            <MDBCol md="12">
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
                    Reset Your Password
                  </h1>
                </div>

                <div>
                  <form onSubmit={submitHandler}>
                    <label htmlFor="emailInput" className="fw-normal mb-2 mt-2">
                      Enter your new password:
                    </label>
                    <MDBInput
                      wrapperClass="mb-2"
                      placeholder="******"
                      name="password"
                      type="password"
                      size="md"
                      className="w-70"
                      labelClassName="mb-2"
                      onChange={changeHandler}
                      error={passwordErrorMessage}
                    />
                    {passwordErrorMessage && (
                      <p className="text-danger">{passwordErrorMessage}</p>
                    )}
                    <label htmlFor="emailInput" className="fw-normal mb-2">
                      Confirm your password:
                    </label>
                    <MDBInput
                      wrapperClass="mb-2"
                      placeholder="******"
                      name="RepeatPassword"
                      type="password"
                      size="md"
                      className="w-70"
                      labelClassName="mb-2"
                      onChange={changeHandler}
                      error={RepeatPasswordErrorMessage}
                    />
                    {RepeatPasswordErrorMessage && (
                      <p className="text-danger">{RepeatPasswordErrorMessage}</p>
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
                      Confirm
                    </button>
                  </form>
                </div>
                <p>
                  <a
                    href="/auth/login"
                    style={{ color: "#074D9C", textDecoration: "underline" }}
                  >
                    Log In
                  </a>
                </p>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default ResetPassword;
