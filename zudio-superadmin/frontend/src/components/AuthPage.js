import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { gsap } from "gsap";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const [searchParams] = useSearchParams()
  // console.log(searchParams.toLocaleString());
  // 🔹 Redirect if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const shopId = localStorage.getItem("shopId");

    if (token) {  
      if (role === "owner" && shopId) {
        navigate(`/branddashboard2/${shopId}`);
      } else if (role === "superadmin") {
        navigate("/branddashboard");
      }
      //  else {
      //   navigate(`/?${searchParams.toString()}`);
      // }
    }
  }, [navigate,searchParams]);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" }
    );
  }, []);



  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isSignup
        ? `${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`
        : `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`;
      const data = isSignup ? { name, email, password,role:'owner' } : { email, password };
  
      const res = await axios.post(url, data);
  
      console.log("API Response:",JSON.stringify( res.data,null , 2)); // 👀 Check API Response
  
      if (!isSignup) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role || "user"); // Default role set karein agar undefined ho
        localStorage.setItem("shopId", res.data.shopId || ""); // 👈 Shop ID store karna
        // Redirect based on role
        if (res.data.user.role === "owner") {
          navigate(`/branddashboard2/${res.data.shopId}`);
        } else if (res.data.user.role === "superadmin") {
          navigate("/branddashboard");
        }
         else if (res.data.user.role === "shop") {
          navigate(`/${searchParams.get("callbackUrl")}/counter`);
        }else{
          navigate("/");
        }
      } else {
        alert("Signup successful, please login.");
        setIsSignup(false);
      }
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };










  
    

  return (
    <>
      <video
      autoPlay
      muted
      loop
      playsInline
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: -1,
      }}
    >
      <source src="https://cdn.pixabay.com/video/2020/10/15/52436-468806587_large.mp4" type="video/mp4" />
    </video>
     <div className="scroller-container">
      <div className="scroller-wrapper">
        <div className="scroller">
          <span>ZUDIO&nbsp;ZUDIO&nbsp;ZUDIO&nbsp;ZUDIO&nbsp;ZUDIO&nbsp;</span>
          <span>ZUDIO&nbsp;ZUDIO&nbsp;ZUDIO&nbsp;ZUDIO&nbsp;ZUDIO&nbsp;</span>
        </div>
      </div>
    </div>
    <style>{`
    body{
    overflow: hidden;}
    .scroller-container {
  height: 100vh;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  // background: #111;
  backdrop-filter: blur(8px);
}

.scroller-wrapper {
  width: 100%;
  min-height: 50vh;
  overflow: hidden;
   margin-top: 50px;
  display: flex;
  align-items: center;
}

.scroller {
  display: flex;
  white-space: nowrap;
  animation: scroll-left 90s linear infinite;
}

/* Full-height left and right fade */
.scroller-container::before,
.scroller-container::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 200px;
  z-index: 2;
}

.scroller-container::before {
  left: 0;
  background: linear-gradient(to right, #111 0%, transparent 100%);
}

.scroller-container::after {
  right: 0;
  background: linear-gradient(to left, #111 0%, transparent 100%);
}

.scroller span {
  font-family: 'Rajdhani', sans-serif;
  font-size: 58rem;
  font-weight: 700;
  opacity: 0.7;
  background: linear-gradient(90deg,rgb(255, 255, 255),rgb(31, 91, 131), #1abc9c,rgb(255, 255, 255));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: 5px;
}

@keyframes scroll-left {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}
}`}</style>






    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 ref={titleRef} style={styles.title}>
          {isSignup ? "Create Account" : "WELCOME"}
        </h2>
        <p style={styles.subtitle}>
          {isSignup ? "Sign up to get started!" : "Login to continue."}
        </p>
        <form onSubmit={handleAuth} ref={formRef} style={styles.form}>
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          {/* Loading Spinner or Submit Button */}
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <button
              type="submit"
              style={styles.button}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              {isSignup ? "Sign Up" : "Login"}
            </button>
          )}
          <a style={{color: "white", textDecoration: "none", padding: "10px"}} href="/forgotpassword">Forgot Password?</a>
        </form>
        {/* <p style={styles.toggleText} onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p> */}
      

        
      </div>

      <style>
        {`
          .spinner {
            width: 30px;
            height: 30px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
    </>
  );
};

// 💎 **Final Optimized CSS Styling**
const styles = {
  container: {
    display: "flex",
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    background: "transparent",
    // background: "linear-gradient(to right,rgb(53, 47, 46),rgb(24, 23, 23))",
   
    // backgroundImage: "url('/images/zudio.jpg')", // 🖼️ Background image
    // backgroundSize: "cover",
    // backgroundPosition: "center",
    transition: "all 0.5s ease-in-out",
    zIndex: 1,
  },
  formContainer: {
    fontFamily: "Rajdhani, sans-serif",
    backdropFilter: "blur(20px)",
    background: "rgba(69, 62, 62, 0.49)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    // borderRadius: "15px",
    width: "60vh",
    margin: "50px",
    padding: "10px",
    textAlign: "center",
    animation: "fadeIn 1s ease-in-out",
  },
  title: {
    fontSize: "35px",
    fontWeight: "bold",
    color: "#fff",
    textShadow: "0px 2px 5px rgba(0,0,0,0.3)",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "18px",
    fontFamily: "Rajdhani, sans-serif",
    color: "#ddd",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "15px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    background: "hsla(0, 0.00%, 89.40%, 0.30)",
    color: "white",
    outline: "none",
    fontFamily: "Rajdhani, sans-serif",
    transition: "0.3s",
    textAlign: "center",
  },
  button: {
    background: "linear-gradient(to right,rgb(105, 74, 60),rgb(109, 83, 77))",
    color: "#fff",
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    fontFamily: "Rajdhani, sans-serif",
    cursor: "pointer",
    marginTop: "10px",
    transition: "transform 0.3s",
    fontWeight: "bold",
  },
  toggleText: {
    color: "white",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "16px",
    transition: "0.3s",
    fontWeight: "400",
  },
};

export default AuthPage;
