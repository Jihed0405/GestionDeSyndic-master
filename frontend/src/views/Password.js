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
import { setError, password } from "../redux/features/authSlice";
import { toast } from "react-toastify";

const Password = () => {
  const [inputs, setInputs] = useState({
    mail: "admin@gmail.com",
  });
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const dispatch = useDispatch();

  const changeHandler = (e) => {
    dispatch(setError(""));
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (e.target.name === "mail") {
      if (
        e.target.value.trim().length === 0 ||
        !e.target.value.trim().match(mailFormat)
      ) {
        setEmailErrorMessage("Veuillez entrer une adresse e-mail valide.");
      } else {
        setEmailErrorMessage("");
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (inputs.mail) {
      const formValue = { mail: inputs.mail };
      if (emailErrorMessage) {
        return;
      }
      dispatch(password({ formValue, toast }));
    } else {
      dispatch(setError("Veuillez entrer votre adresse e-mail."));
    }
  };

  return (
    <div className="my-3 container ">
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
                    Réinitialiser votre mot de passe
                  </h1>
                </div>

                <h5 className="fw-normal my-3 pb-1 text-center">
                  Entrez votre adresse e-mail
                </h5>

                <form onSubmit={submitHandler}>
                  <label htmlFor="emailInput" className="fw-normal mb-2">
                    Adresse e-mail :
                  </label>
                  <MDBInput
                    wrapperClass="mb-2"
                    placeholder="Entrez votre adresse e-mail"
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
                    Envoyer un e-mail
                  </button>
                </form>
                <p>
                  <a
                    href="/auth/login"
                    style={{ color: "#074D9C", textDecoration: "underline" }}
                  >
                    Connexion
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

export default Password;
