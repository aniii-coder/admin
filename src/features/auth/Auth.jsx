import { useReducer, useState } from "react";
import styles from "./Auth.module.css";
import { FORM_FIELDS, initialState } from "./utils";
import { useRouter } from "next/router";
import { useLoginMutation, useRegisterMutation } from "./api/authSlice";
import { useDispatch } from "react-redux";
import { errorToast, successToast } from "@/services/slices/toastSlice";

export default function AuthPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(initialState);

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();

  const isLoading = loginLoading || registerLoading;

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setFormData(initialState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const { email, password } = formData;

        const response = await login({
          email,
          password,
        }).unwrap();

        console.log('response :>> ', response);
        if (response?.success) {
          dispatch(successToast({ message: response?.message || "Logged in successfully!" }));
          router.push("/admin/dashboard");
        } else {
          dispatch(errorToast({ message: response?.message || "Login failed. Please try again." }));
        }
      } else {
        const { name, ...restOfFormData } = formData;

        const registerBody = {
          firstName: name,
          ...restOfFormData,
        };

        const response = await register(registerBody).unwrap();
        if (response?.success) {
          dispatch(
            successToast({
              message: response?.message || "User Registered Successfully",
            })
          );
          setIsLogin(true);
          setFormData(initialState);
        } else {
          dispatch(errorToast({ message: response?.message || "Registration failed." }));
        }
      }
    } catch (error) {
      console.error("Authentication Error Details:", error);
      
      // Comprehensive error parser covering RTK Query rejected states, native network string fallbacks, and standard throwables
      const extractedErrorMessage = 
        error?.data?.message || 
        error?.message || 
        error?.error || 
        "An unexpected error occurred. Please try again later.";

      dispatch(errorToast({ message: extractedErrorMessage }));
    }
  };

  const activeFields = FORM_FIELDS.filter((field) => {
    if (isLogin) {
      return field.showInLogin;
    }
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.portalHeader}>
          <span className={styles.portalBrand}>Blogger</span>
          <span className={styles.portalBadge}>Admin Portal</span>
        </div>

        <h1 className={styles.title}>{isLogin ? "Welcome Back" : "Create Account"}</h1>
        <p className={styles.subtitle}>
          {isLogin ? "Please sign in to your account" : "Sign up to get started"}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {activeFields.map((field) => (
            <div key={field.id} className={styles.inputGroup}>
              <label htmlFor={field.id} className={styles.label}>
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.id}
                name={field.name}
                className={styles.input}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className={styles.toggleText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button type="button" className={styles.toggleBtn} onClick={toggleMode}>
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}