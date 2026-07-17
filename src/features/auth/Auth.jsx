import { useReducer, useState } from "react";
import styles from "./Auth.module.css";
import { FORM_FIELDS } from "./utils";
import { useRouter } from "next/router";
import { useLoginMutation, useRegisterMutation } from "./api/authSlice";


export default function AuthPage() {

  const router = useRouter();



  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });


  const [login] = useLoginMutation()
  const [register] = useRegisterMutation()

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setFormData({ name: "", email: "", password: "" });
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

      console.log("Login Success:", response);

      localStorage.setItem("token", response?.data?.token);

      router.push("/dashboard");
    } else {
      const { name, ...restOfFormData } = formData;

      const registerBody = {
        firstName: name,
        ...restOfFormData,
      };

      const response = await register(registerBody).unwrap();

      console.log("Register Success:", response);

      setIsLogin(true);
      setFormData({
        name: "",
        email: "",
        password: "",
      });
    }
  } catch (error) {
    console.error(error);

    alert(
      error?.data?.message ||
      error?.message ||
      "Something went wrong"
    );
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
                value={formData[field.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button type="submit" className={styles.submitBtn}>
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