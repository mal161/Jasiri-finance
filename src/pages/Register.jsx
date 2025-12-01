import React, { useState, useRef, useEffect } from "react";
import app from '../firebase/Firebase'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore"; 
import swal from 'sweetalert';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import offices from "../assets/Tracking_and_manage_your_expenses_Illustration-removebg-preview.png";
import financeLogo from "../assets/Lucid_Origin_A_sleek_modern_logo_for_a_finance_web_app_named_J_0-removebg-preview.png";

function Register() {

    const businessNameRef = useRef();
    const phoneNumberRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const auth = getAuth();
    const db = getFirestore(app);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [signUp, setSignUp] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [errors, setErrors] = useState({});

    // Password strength checker
    const checkPasswordStrength = (password) => {
        if (password.length === 0) {
            setPasswordStrength("");
            return;
        }
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        if (strength < 2) setPasswordStrength("Weak");
        else if (strength < 3) setPasswordStrength("Medium");
        else setPasswordStrength("Strong");
    };

    // Validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validate phone number
    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^[0-9\+\-\s\(\)]{10,}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    // Validate all inputs
    const validateForm = () => {
        const newErrors = {};
        
        if (!businessNameRef.current.value.trim()) {
            newErrors.businessName = "Business name is required";
        }
        
        if (!phoneNumberRef.current.value.trim()) {
            newErrors.phoneNumber = "Phone number is required";
        } else if (!validatePhoneNumber(phoneNumberRef.current.value)) {
            newErrors.phoneNumber = "Please enter a valid phone number";
        }
        
        if (!emailRef.current.value.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(emailRef.current.value)) {
            newErrors.email = "Please enter a valid email";
        }
        
        if (!passwordRef.current.value) {
            newErrors.password = "Password is required";
        } else if (passwordRef.current.value.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }
        
        if (!confirmPasswordRef.current.value) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    function submitSignUp() {
        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setSignUp(false);

        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const phoneNumber = phoneNumberRef.current.value;
        const businessName = businessNameRef.current.value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userid = user.uid;

                setDoc(doc(db, "users", userid), {
                    businessName: businessName,
                    email: email,
                    phoneNumber: phoneNumber,
                    uid: userid,
                    createdAt: new Date()
                });

                // Clear form
                businessNameRef.current.value = "";
                phoneNumberRef.current.value = "";
                emailRef.current.value = "";
                passwordRef.current.value = "";
                confirmPasswordRef.current.value = "";
                setPasswordStrength("");
                setErrors({});

                setLoading(false);
                setSignUp(true);
                
                swal("Success!", "Account created successfully!", "success");
                
                // Redirect to dashboard
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setLoading(false);
                setSignUp(true);
                
                if (errorCode === 'auth/email-already-in-use') {
                    swal("Error!", "Email is already in use!", "error");
                } else {
                    swal("Error!", errorMessage, "error");
                }
            });
    }

    


    return (
    <div className="flex flex-col md:flex-row min-h-screen w-screen bg-white overflow-hidden">
        
        <div className="hidden md:flex md:w-1/2 h-screen bg-blue-200 justify-center items-center">
            <div className="size-18 rounded-full bg-radial-[at_25%_25%] from-white to-zinc-400 to-75%"></div>
            {/* <img className="max-h-[80%] object-contain" src={offices} alt="office illustration" /> */}
        </div>
        
        <div className="w-full md:w-1/2 md:min-h-screen bg-transparent flex flex-col justify-center items-center px-4 py-6 md:py-0">
            <div className="w-full flex justify-center items-center mb-4 md:mb-0 md:h-1/5">
                <img
                    className="h-20 md:h-40 w-auto"
                    src={financeLogo}
                    alt="finance logo"
                />
            </div>

            <div className="w-full sm:w-3/4 md:w-3/4 flex flex-col justify-center items-center gap-3 md:gap-6">
                {/* Business Name Input */}
                <div className="w-full">
                    <input
                        className={`w-full h-10 md:h-12 border rounded-lg px-4 py-2 shadow-sm focus:shadow-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-500 text-black text-sm md:text-base ${errors.businessName ? 'border-red-500' : 'border-gray-300'}`}
                        type="text"
                        placeholder="Business Name"
                        ref={businessNameRef}
                        required
                    />
                    {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
                </div>

                {/* Phone Number Input */}
                <div className="w-full">
                    <input
                        type="tel"
                        className={`w-full h-10 md:h-12 border rounded-lg px-4 py-2 shadow-sm focus:shadow-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-500 text-sm md:text-base ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Phone number (10+ digits)"
                        ref={phoneNumberRef}
                        required
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>

                {/* Email Input */}
                <div className="w-full">
                    <input
                        className={`w-full h-10 md:h-12 border rounded-lg px-4 py-2 shadow-sm focus:shadow-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-500 text-sm md:text-base ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
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
                            onChange={(e) => checkPasswordStrength(e.target.value)}
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer text-lg"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    {passwordStrength && (
                        <p className={`text-xs mt-1 ${passwordStrength === 'Strong' ? 'text-green-500' : passwordStrength === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                            Password Strength: <span className="font-semibold">{passwordStrength}</span>
                        </p>
                    )}
                </div>

                {/* Confirm Password Input */}
                <div className="w-full">
                    <div className="relative">
                        <input
                            className={`w-full h-10 md:h-12 border rounded-lg px-4 py-2 shadow-sm focus:shadow-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-500 pr-10 text-sm md:text-base ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            ref={confirmPasswordRef}
                            required
                        />
                        <span
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer text-lg"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                <p className="text-sm md:text-lg text-gray-800 text-center">
                    Already have an account? <span className="text-blue-600 underline cursor-pointer hover:text-blue-700" onClick={() => navigate('/signin')}>Sign In</span>
                </p>
                
                {signUp && (
                <button onClick={submitSignUp} disabled={loading} className="w-full h-10 md:h-12 bg-blue-500 rounded-lg text-white px-4 py-2 shadow-sm focus:shadow-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition font-semibold text-sm md:text-base hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Register
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
                        Creating account...
                    </Button>
                )}
                </div>

            <div className="w-full hidden md:block md:h-1/5"></div>
        </div>
        </div>
    );
}

export default Register;
