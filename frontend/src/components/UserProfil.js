import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserByID, updateUser } from "../redux/features/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../assets/styles/loadingIcon.css";

const UserProfile = () => {
  const { userByID, loading } = useSelector((state) => ({ ...state.user }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = JSON.parse(localStorage.getItem("profile")).id;
      await dispatch(getUserByID(userId));
    };

    fetchUserData();
  }, [dispatch]);

  useEffect(() => {
    setUserData(userByID.user);
  }, [userByID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUser) => ({
      ...prevUser,
      [name]: value,
      
    }));
  };

  const handleSaveChanges = () => {
    const id = userByID.user.CIN;
    console.log(userData)    
    dispatch(updateUser({ id, userData, toast, navigator }));
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "auto", marginTop: "50px", padding: "20px", borderRadius: "8px", boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.2)", backgroundColor: "#fff" }}>
      <h2 style={{ marginBottom: "20px", color: "#1976D2" }}>Update Profile</h2>
      {!loading && userData  ? (
        <>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>CIN:</span>
            <span style={{ marginLeft: "5px" }}>{userData.CIN}</span>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>First Name:</span>
            <input
              type="text"
              name="nom"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              value={userData.nom}
              onChange={handleInputChange}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Last Name:</span>
            <input
              type="text"
              name="prenom"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              value={userData.prenom}
              onChange={handleInputChange}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Email:</span>
            <input
              type="text"
              name="mail"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              value={userData.mail}
              onChange={handleInputChange}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Password:</span>
            <input
              type="password"
              name="password"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="********"
              value={userData.password}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary me-3"
            style={{ backgroundColor: "#007BFF", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}
            onClick={handleSaveChanges}
          >
            Save
          </button>
        </>
      ) : (
        <div className="load">
          <div className="loader"></div>
          <h2 className="marginLoad">Loading ...</h2>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
