import React, { useState } from "react";
import axios from "axios";

const MenuModal = ({ shop, onClose }) => {
  const [menuItem, setMenuItem] = useState({ 
    name: "", 
    image: "", 
    description: "" ,
    link: "a",  //  New field added for storing the link
    email: "",
    password: "",
    shopconpassword: "",
    role: ""
  });

  const handleChange = (e) => {
    setMenuItem({ ...menuItem, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shop?._id) {
      alert("Shop ID is missing!");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/shops/${shop._id}/menu`, menuItem);
      alert("counter added successfully!");
      console.log("Success:", response.data);
      window.location.reload();
      onClose();
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert("Failed to add menu item. Please try again.");
    }
  };

  return (
    <>
    <div className="menu-form-wrapper">
  <form className="menu-form" onSubmit={handleSubmit}>
    <button type="button" className="close-button" onClick={onClose}>Close</button>

    <input type="text" name="name" placeholder="Shop Name" value={menuItem.name} onChange={handleChange} required className="form-input" />
    <input type="text" name="image" placeholder="Image URL" value={menuItem.image} onChange={handleChange} required className="form-input" />
    <input type="text" name="description" placeholder="Description" value={menuItem.description} onChange={handleChange} required className="form-input" />
    <input type="text" name="email" placeholder="Email" value={menuItem.email} onChange={handleChange} required className="form-input" />
    <input type="text" name="password" placeholder="Password" value={menuItem.password} onChange={handleChange} required className="form-input" />
    <input type="text" name="shopconpassword" placeholder="Confirm Password" value={menuItem.shopconpassword} onChange={handleChange} required className="form-input" />
    <input type="text" name="role" placeholder="Role" value={menuItem.role} onChange={handleChange} required className="form-input" />

    <button type="submit" className="submit-button">Add Zudio's</button>
  </form>
</div>
<style>{`.menu-form-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  height: 100vh;
  background: black;
  width: 100vw;
}

.menu-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 500px;
}

.form-input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  // width: 90%;
  font-size: 14px;
}

.submit-button {
  padding: 10px;
  background: linear-gradient(to right, rgb(254, 105, 79), rgb(254, 30, 0));
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.close-button {
  align-self: flex-end;
  padding: 8px 16px;
  background-color: #ff6347;
  color: white;
  border: none;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
}

/* ✅ Mobile Responsive */
@media (max-width: 600px) {
  .menu-form {
    max-width: 100%;
    padding: 10px;
  }

  .close-button {
    width: 100%;
    margin-bottom: 10px;
  }

  .submit-button {
    width: 100%;
  }
}`}</style>
</>
  );
};

export default MenuModal;