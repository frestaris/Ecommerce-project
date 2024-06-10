import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailLink, updatePassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth";

const RegisterComplete = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { user } = useSelector((state) => ({ ...state }));
  let dispatch = useDispatch();

  useEffect(() => {
    const emailForRegistration = window.localStorage.getItem(
      "emailForRegistration"
    );
    console.log("Email for registration:", emailForRegistration);

    if (emailForRegistration) {
      setEmail(emailForRegistration);
    } else {
      toast.error("No email found for registration. Please register again.");
      navigate("/register");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validation
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    const auth = getAuth();
    try {
      const result = await signInWithEmailLink(
        auth,
        email,
        window.location.href
      );
      if (result.user.emailVerified) {
        // remove user email from local storage
        window.localStorage.removeItem("emailForRegistration");
        // get user id token
        let user = auth.currentUser;
        await updatePassword(user, password);
        const idTokenResult = await user.getIdTokenResult();

        try {
          const res = await createOrUpdateUser(idTokenResult.token);
          console.log("CREATE OR UPDATE RES", res);

          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              name: res.data.name,
              email: res.data.email,
              token: idTokenResult.token,
              role: res.data.role,
              _id: res.data._id,
            },
          });
          navigate("/");
          toast.success("Login successful!");
        } catch (err) {
          console.error("Error in createOrUpdateUser:", err);
          toast.error("Failed to create or update user");
        }
        // redux store (if applicable)
        console.log("user", user, "idTokenResult", idTokenResult);
        // redirect
        toast.success("Registration completed!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error completing registration:", error);
      toast.error(error.message);
    }
  };

  const completeRegistrationForm = () => (
    <form onSubmit={handleSubmit}>
      <input type="email" className="form-control" value={email} disabled />

      <input
        type="password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoFocus
      />
      <br />
      <button type="submit" className="btn btn-primary">
        Complete Registration
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register Complete</h4>
          {completeRegistrationForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
