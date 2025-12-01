import React, { useRef, useState } from "react";
import app from "../firebase/Firebase";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import swal from "sweetalert";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import financeLogo from "../assets/Lucid_Origin_A_sleek_modern_logo_for_a_finance_web_app_named_J_0-removebg-preview.png";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const emailRef = useRef();
    const auth = getAuth(app);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleReset() {
        setError("");
        setSuccess("");
        const email = emailRef.current.value;
        if (!email) {
        setError("Please enter your email address.");
        return;
        }
        setLoading(true);
        sendPasswordResetEmail(auth, email)
        .then(() => {
            setLoading(false);
            setSuccess("Password reset email sent! Please check your inbox.");
            swal("Success!", "Password reset email sent!", "success");
        })
        .catch((err) => {
            setLoading(false);
            setError(err.message);
            swal("Error!", err.message, "error");
        });
    }

    return (
        <div className="flex flex-col min-h-screen w-screen bg-blue-200 items-center justify-center px-4 overflow-hidden">
        <div className="w-full sm:w-3/4 md:w-1/3 flex flex-col items-center gap-6 p-6 rounded-lg shadow-md bg-gray-50">
            <img
                src={financeLogo}
                alt="finance logo"
                className="h-40 w-auto mb-2"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Forgot Password
            </h2>
            <p className="text-sm text-gray-600 text-center mb-2">
                Enter your email address and we'll send you a link to reset your
                password.
            </p>
            <input
                type="email"
                ref={emailRef}
                className="w-full h-10 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:shadow-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-500 text-black text-base"
                placeholder="Email Address"
                required
            />
            {error && (
                <p className="text-red-500 text-xs w-full text-center">{error}</p>
            )}
            {success && (
                <p className="text-green-500 text-xs w-full text-center">{success}</p>
            )}
            <Button
                onClick={handleReset}
                disabled={loading}
                className="w-full h-10 bg-blue-500 rounded-lg text-white font-semibold text-base hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
            {loading ? (
                <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                />
            ) : (
                "Send Reset Link"
            )}
            </Button>
                <p className="text-sm text-gray-800 text-center mt-2">
            Remembered your password?{" "}
            <span
                className="text-blue-600 underline cursor-pointer hover:text-blue-700"
                onClick={() => navigate("/signin")}
            >
                Sign In
            </span>
            </p>
        </div>
        </div>
    );
}

export default ForgotPassword;
