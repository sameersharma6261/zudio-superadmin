// import React, { useState } from "react";
// import { QrCode, Clock, ShoppingBag } from "lucide-react";
// import { useParams } from "react-router";
// import { useNavigate } from "react-router-dom";

// const PaymentPage = ({ amount }) => {
//   const handlePayment = () => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       console.log("processing...");
//       navigate(`/${id}/token`);
//     }, 2000);
//   };
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   return (
//     <>
//       <div className="pppayment-page">
//         <div className="payment-page">
//           <header className="page-header">
//             <h1>Mall Shopping Assistant</h1>
//             <p>Smart shopping, zero waiting</p>
//           </header>

//           <div className="main-content">
//             <div className="process-steps">
//               <div className="step">
//                 <div className="step-icon">
//                   <QrCode />
//                 </div>
//                 <div className="step-content">
//                   <h3>Scan QR Code</h3>
//                   <p>Scan the QR code at any mall counter</p>
//                 </div>
//               </div>

//               <div className="step">
//                 <div className="step-icon">
//                   <Clock />
//                 </div>
//                 <div className="step-content">
//                   <h3>Book Time Slot</h3>
//                   <p>Choose your preferred billing time</p>
//                 </div>
//               </div>

//               <div className="step">
//                 <div className="step-icon">
//                   <ShoppingBag />
//                 </div>
//                 <div className="step-content">
//                   <h3>Priority Checkout</h3>
//                   <p>Skip the line with priority billing</p>
//                 </div>
//               </div>
//             </div>

//             <div className="benefits-section">
//               <h2>What You Get</h2>
//               <div className="benefits-list">
//                 <div className="benefit">
//                   <span className="check">✓</span>
//                   <p>SMS notifications for your turn</p>
//                 </div>
//                 <div className="benefit">
//                   <span className="check">✓</span>
//                   <p>Digital receipt for easy tracking</p>
//                 </div>
//                 <div className="benefit">
//                   <span className="check">✓</span>
//                   <p>24/7 customer support</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <footer className="payment-footer">
//             <div className="price-tag">
//               {/* <span className="amount">₹{amount}</span> */}
//               <span className="amount">₹120{amount}</span>
//               <span className="period">one-time fee</span>
//             </div>
//             <button
//               className="pay-button"
//               onClick={handlePayment}
//               disabled={loading}
//             >
//               {loading ? <div className="spinner"></div> : "Book Appointment"}
//             </button>
//           </footer>
//         </div>
//       </div>

//       <style>{`
//     .pppayment-page {
//       background:rgb(255, 255, 255);
//       width: 100vw;
//       height: 100vh;
//        display: flex;
//       flex-direction: column;
//       align-items: center;
//       justify-content: center;
//       position: relative;
//       z-index: 2;
//     }


//       .payment-page {
//   // min-height: 100vh;
//   display: flex;
//   flex-direction: column;
//   box-shadow: 0 0 20px rgba(0, 0, 0, 0.33);
//   background: #ffffff;
// }

// .page-header {
//   background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
//   color: white;
//   padding: 24px 20px;
//   text-align: center;
// }

// .page-header h1 {
//   font-size: 24px;
//   font-weight: 700;
//   margin-bottom: 8px;
// }

// .page-header p {
//   font-size: 16px;
//   opacity: 0.9;
// }

// .main-content {
//   flex: 1;
//   padding: 24px 20px;
// }

// .process-steps {
//   display: flex;
//   flex-direction: column;
//   gap: 24px;
//   margin-bottom: 32px;
// }

// .step {
//   display: flex;
//   align-items: center;
//   gap: 16px;
// }

// .step-icon {
//   background: #f0f7ff;
//   color: #4a90e2;
//   width: 48px;
//   height: 48px;
//   border-radius: 12px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-shrink: 0;
// }

// .step-content h3 {
//   font-size: 16px;
//   font-weight: 600;
//   color: #1a1a1a;
//   margin-bottom: 4px;
// }

// .step-content p {
//   font-size: 14px;
//   color: #666;
//   line-height: 1.4;
// }

// .benefits-section {
//   background: #f8f9fa;
//   border-radius: 16px;
//   padding: 24px;
//   margin-bottom: 24px;
// }

// .benefits-section h2 {
//   font-size: 18px;
//   font-weight: 600;
//   color: #1a1a1a;
//   margin-bottom: 16px;
// }

// .benefits-list {
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
// }

// .benefit {
//   display: flex;
//   align-items: center;
//   gap: 12px;
// }

// .check {
//   color: #4a90e2;
//   font-size: 18px;
//   font-weight: bold;
// }

// .benefit p {
//   font-size: 14px;
//   color: #444;
// }

// .payment-footer {
//   background: white;
//   padding: 20px;
//   border-top: 1px solid #eee;
//   position: sticky;
//   bottom: 0;
// }

// .price-tag {
//   text-align: center;
//   margin-bottom: 16px;
// }

// .amount {
//   font-size: 32px;
//   font-weight: 700;
//   color: #1a1a1a;
//   display: block;
// }

// .period {
//   font-size: 14px;
//   color: #666;
//   text-transform: uppercase;
//   letter-spacing: 0.5px;
// }

// .pay-button {
//   background: #4a90e2;
//   color: white;
//   border: none;
//   width: 100%;
//   padding: 16px;
//   font-size: 16px;
//   font-weight: 600;
//   border-radius: 12px;
//   cursor: pointer;
//   transition: background-color 0.2s ease;
// }

// .pay-button:hover {
//   background: #357abd;
// }

// /* Laptop/Desktop styles */
// @media (min-width: 768px) {
//   .payment-page {
//     max-width: 480px;
//     margin: 0 auto;
//     border-left: 1px solid #eee;
//     border-right: 1px solid #eee;
//   }

//   .page-header {
//     border-radius: 0 0 24px 24px;
//     margin: 0 20px;
//     padding: 32px;
//   }

//   .main-content {
//     padding: 32px;
//   }

//   .payment-footer {
//     max-width: 480px;
//     margin: 0 auto;
//   }
// }





// // spiner css
// .pay-button {
//   padding: 10px 20px;
//   background-color: #007bff;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//    position: relative;
//       z-index: 2;
//   font-size: 16px;
// }

// .pay-button:disabled {
//   background-color: #7aa7d9;
//   cursor: not-allowed;
// }

// .spinner {
//   width: 20px;
//   height: 20px;
//   border: 3px solid white;
//   border-top: 3px solid transparent;
//   border-radius: 50%;
//   animation: spin 0.8s linear infinite;
//   margin: 0 auto;
// }

// @keyframes spin {
//   to {
//     transform: rotate(360deg);
//   }
// }
//       `}</style>
//     </>
//   );
// };

// export default PaymentPage;







import React, { useState } from "react";
import { useParams } from "react-router";
import {
  FaCreditCard,
  FaLock,
  FaUser,
  FaKey,
  FaWallet,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [formData, setFormData] = useState({
    number: "1234 5678 9012 3456",
    name: "contact",
    expiry: "12/12",
    cvv: "123",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayNow = () => {
    const { number, name, expiry, cvv } = formData;
    if (number && name && expiry && cvv) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
       navigate(`/${id}/token`);
      }, 3000);
    } else {
      alert("Please fill all the fields");
    }
  };

  return (
    <>
      <div className="background">
        <div className="checkout-container">
          <h2>Complete Your Payment</h2>
          <p className="secure-text">
            <FaLock /> Secure Payment
          </p>

          {/* Payment Method */}
          <div className="payment-methods">
            <button
              className={paymentMethod === "credit" ? "active" : ""}
              onClick={() => setPaymentMethod("credit")}
            >
              <FaCreditCard /> Card
            </button>
            <button
              className={paymentMethod === "upi" ? "active" : ""}
              onClick={() => setPaymentMethod("upi")}
            >
              <FaWallet /> UPI
            </button>

            <button
              className={paymentMethod === "cash" ? "active" : ""}
              onClick={() => setPaymentMethod("cash")}
            >
              <FaMoneyBillAlt /> Cash
            </button>
          </div>

          {/* Card Preview */}
          <div className="card-preview">
           
            <div className="dots">
              {formData.number || "•••• •••• •••• ••••"}
            </div>
            <div className="details">
              <span>Card Holder</span>
              <span>Expires</span>
            </div>
            <div className="details">
              <strong>{formData.name || "YOUR NAME"}</strong>
              <strong>{formData.expiry || "MM/YY"}</strong>
            </div>
          </div>

          {/* Card Form */}
          <div className="card-form">
            <label>Card Number</label>
            <input
              type="text"
              name="number"
              placeholder="1234 5678 9012 3456"
              value={formData.number}
              onChange={handleChange}
              maxLength={16}
            />

            <label>Card Holder Name</label>
            <div className="input-icon">
              <FaUser />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div>
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleChange}
                  maxLength={5}
                />
              </div>
              <div>
                <label>CVV</label>
                <div className="input-icon">
                  <FaKey />
                  <input
                    type="password"
                    name="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleChange}
                    maxLength={3}
                  />
                </div>
              </div>
            </div>

            <button
              className="pay-btn"
              onClick={handlePayNow}
              disabled={loading}
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <FaLock /> Pay Now
                </>
              )}
            </button>
            <p className="secure-msg">✔ Your payment info is secure</p>
          </div>
        </div>
      </div>
      <style>{`
      
      .background{
    //   background: linear-gradient(135deg,rgb(32, 32, 32),rgb(49, 42, 42));
        height: 100vh;  
        background: white;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
         position: relative;
        z-index: 2;
      }
      
      
      .checkout-container {
  // max-width: 420px;
  margin: 40px auto;
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
 
  font-family: 'Segoe UI', sans-serif;
  color: #333;
  background: #f9fbff;
}

h2 {
  text-align: center;
  margin-bottom: 8px;
}

.secure-text {
  text-align: center;
  color: green;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.payment-methods {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.payment-methods button {
  flex: 1;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 8px;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.payment-methods .active {
  border-color: #2563eb;
  background-color: #ebf2ff;
}

.card-preview {
  background: linear-gradient(135deg, #5f72ff, #9921e8);
  border-radius: 14px;
  color: white;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
}

.card-preview img {
  width: 40px;
}

.card-preview .dots {
  font-size: 1.2rem;
  margin: 20px 0;
}

.card-preview .details {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.card-form {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.card-form label {
  display: block;
  font-size: 0.9rem;
  margin-top: 12px;
  margin-bottom: 4px;
}

.card-form input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.input-icon {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  padding-left: 10px;
  border-radius: 8px;
}

.input-icon input {
  border: none;
  background: transparent;
  flex: 1;
  padding: 10px;
}

.row {
  display: flex;
  gap: 10px;
}

.pay-btn {
  margin-top: 20px;
  width: 100%;
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.secure-msg {
  text-align: center;
  color: green;
  font-size: 0.85rem;
  margin-top: 10px;
}`}</style>
    </>
  );
}

export default PaymentPage;
