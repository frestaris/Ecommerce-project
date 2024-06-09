import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { user } = useSelector((state) => ({ ...state }));
  // redirecting user if logged in
  useEffect(() => {
    if (user && user.token) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const config = {
      url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT,
      handleCodeInApp: true,
    };
    try {
      await sendPasswordResetEmail(auth, email, config);

      toast.success("Check your email for password reset link!");
      setEmail("");
      setLoading(false);
    } catch (error) {
      setLoading(false);

      toast.error(error.message);
      console.log("Error resetting password:", error);
    }
  };

  return (
    <div className="container col-md-6 offset-md-3 p-5">
      {loading ? (
        <h4 className="text-danger">Loading</h4>
      ) : (
        <h4>Forgot Password</h4>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Type your email..."
          autoFocus
        />
        <br />
        <button className="btn btn-primary" disabled={!email}>
          Submit
        </button>
      </form>
    </div>
  );
};
export default ForgotPassword;
