import React, { useState, useRef } from "react";
import app from '../firebase/Firebase'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import swal from 'sweetalert';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import offices from "../assets/Tracking_and_manage_your_expenses_Illustration-removebg-preview.png";
import financeLogo from "../assets/Lucid_Origin_A_sleek_modern_logo_for_a_finance_web_app_named_J_0-removebg-preview.png";

function Signin() {

    const emailRef = useRef();
    const passwordRef = useRef(); 
    const auth = getAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [signIn, setSignIn] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});

    // Validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        if (!emailRef.current.value.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(emailRef.current.value)) {
            newErrors.email = "Please enter a valid email";
        }
        
        if (!passwordRef.current.value) {
            newErrors.password = "Password is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    function submitSignIn() {
        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setSignIn(false);

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                
                // Save remember me preference
                if (rememberMe) {
                    localStorage.setItem('rememberMe', JSON.stringify({
                        email: email,
                        timestamp: new Date().getTime()
                    }));
                } else {
                    localStorage.removeItem('rememberMe');
                }

                // Clear form
                emailRef.current.value = "";
                passwordRef.current.value = "";
                setRememberMe(false);
                setErrors({});

                setLoading(false);
                setSignIn(true);
                
                swal("Success!", "Signed in successfully!", "success");
                
                // Redirect to dashboard using navigate
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setLoading(false);
                setSignIn(true);
                
                if (errorCode === 'auth/user-not-found') {
                    swal("Error!", "User not found. Please check your email.", "error");
                } else if (errorCode === 'auth/wrong-password') {
                    swal("Error!", "Incorrect password. Please try again.", "error");
                } else {
                    swal("Error!", errorMessage, "error");
                }
            });
    }

    return (
    <div className="flex flex-col md:flex-row min-h-screen w-screen bg-white overflow-hidden">
        
        <div className="w-full md:w-1/2 md:min-h-screen bg-transparent flex flex-col justify-center items-center px-4 py-6 md:py-0">
            <div className="w-full flex justify-center items-center mb-4 md:mb-0 md:h-1/5">
                <img
                    className="h-20 md:h-40 w-auto"
                    src={financeLogo}
                    alt="finance logo"
                />
            </div>

            <div className="w-full sm:w-3/4 md:w-3/4 flex flex-col justify-center items-center gap-3 md:gap-6">
                {/* Email Input */}
                <div className="w-full">
                    <input
                        className={`w-full h-10 md:h-12 border rounded-lg px-4 py-2 shadow-sm focus:shadow-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-500 text-black text-sm md:text-base ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        type="email"
                        placeholder="Email Address"
                        ref={emailRef}
                        required
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Password Input */}
                <div className="w-full">
                    <div className="relative">
                        <input
                            className={`w-full h-10 md:h-12 border rounded-lg px-4 py-2 shadow-sm focus:shadow-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-500 pr-10 text-sm md:text-base ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            ref={passwordRef}
                            required
                        />

                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 
                            text-gray-500 hover:text-gray-700 cursor-pointer text-lg"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Remember Me Checkbox */}
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="cursor-pointer"
                        />
                        <label htmlFor="rememberMe" className="text-xs md:text-sm text-gray-700 cursor-pointer">
                            Remember me
                        </label>
                    </div>
                    <span className="text-xs md:text-sm text-right">
                        <span className="text-blue-600 underline cursor-pointer hover:text-blue-700" onClick={() => navigate('/forgot-password')}>Forgot Password?</span>
                    </span>
                </div>

                <p className="text-sm md:text-lg text-gray-800 text-center">
                    Don't have an account? <span className="text-blue-600 underline cursor-pointer hover:text-blue-700" onClick={() => navigate('/register')}>Register</span>
                </p>
                
                {signIn && (
                <button onClick={submitSignIn} disabled={loading} className="w-full h-10 md:h-12 bg-blue-500 rounded-lg text-white px-4 py-2 shadow-sm focus:shadow-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition font-semibold text-sm md:text-base hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Sign In
                </button>
                )}
                {loading && (
                    <Button variant="primary" disabled className="w-full">
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        Signing in...
                    </Button>
                )}
                </div>

            <div className="w-full hidden md:block md:h-1/5"></div>
        </div>

        <div className="hidden md:flex md:w-1/2 h-screen bg-blue-200 justify-center items-center">
            <div className="size-18 rounded-full bg-radial-[at_25%_25%] from-white to-zinc-400 to-75%"></div>
            {/* <img className="max-h-[80%] object-contain" src={offices} alt="office illustration" /> */}
        </div>
        
    </div>
    );
}

export default Signin;
