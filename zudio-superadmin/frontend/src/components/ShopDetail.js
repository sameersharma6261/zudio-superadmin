import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MenuModal from "./MenuModal";

const ShopDetail = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedLink, setEditedLink] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [editedShopConPassword, setEditedShopConPassword] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/shops/${id}`
        );
        setShop(response.data);
      } catch (error) {
        console.error("Error fetching shop details:", error);
      }
    };
    fetchShopDetails();
  }, [id]);

  const handleEdit = (menuItem) => {
    setEditingItem(menuItem);
    setEditedName(menuItem.name);
    setEditedLink(menuItem.link);
    setEditedImage(menuItem.image);
    setEditedDescription(menuItem.editeddescription);
    setEditedEmail(menuItem.editedemail);
    setEditedPassword(menuItem.editedpassword);
    setEditedShopConPassword(menuItem.editedshopconpassword);
    setEditedRole(menuItem.editedrole);
  };

  const handleSave = async (menuItem) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/shops/update-menu-item/${id}/${menuItem.name}`,
        {
          newName: editedName,
          newLink: editedLink,
          newImage: editedImage,
          newDescription: editedDescription,
          newEmail: editedEmail,
          newPassword: editedPassword,
          newShopConPassword: editedShopConPassword,
          newRole: editedRole,
        }
      );
      if (response.data.success) {
        const updatedItems = shop.menuItems.map((item) =>
          item.name === menuItem.name
            ? {
                ...item,
                name: editedName,
                link: editedLink,
                image: editedImage,
                description: editedDescription,
                newEmail: editedEmail,
                newPassword: editedPassword,
                newShopConPassword: editedShopConPassword,
                newRole: editedRole,
              }
            : item
        );
        setShop({ ...shop, menuItems: updatedItems });
        
        setEditingItem(null);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  const handleDelete = async (menuItem) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/shops/delete-menu-item/${id}/${menuItem.name}`
      );
      if (response.data.success) {
        const updatedItems = shop.menuItems.filter(
          (item) => item.name !== menuItem.name
        );
        setShop({ ...shop, menuItems: updatedItems });
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const handleManageMenu = (shop) => {
    setSelectedFood(shop);
  };

  // Filtering menu items based on search query
  const filteredMenuItems = shop
    ? shop.menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Shop Details</h2>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search shops..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: "10px",
          width: "60%",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginBottom: "20px",
          position: "fixed",
          top: "53px",
          fontSize: "16px",
          zIndex: "5"
        }}
      />
      <div style={{zIndex: "5", position: "fixed", top: "100px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
      <button onClick={() => handleManageMenu(shop)} style={styles.editButton}>
        Add Shop's
      </button>
      {selectedFood && (
        <MenuModal shop={selectedFood} onClose={() => setSelectedFood(null)} />
      )}
      </div>

      {shop ? (
        <div style={styles.card}>
          <h3 style={styles.shopName}>{shop.name}</h3>
          <img src={shop.imageUrl} alt={shop.name} style={styles.shopImage} />
          <ul style={styles.list}>
            {filteredMenuItems.map((menuItem, index) => (
              <li key={index} style={styles.listItem}>
                <div style={styles.textContainer}>
                  <span style={styles.shopText}>
                    {menuItem.name} - {menuItem.description} - {menuItem.image} - {menuItem.email} - {menuItem.password} - {menuItem.shopconpassword} - {menuItem.role}
                  </span>
                </div>
                <div style={styles.actionContainer}>
                  {editingItem === menuItem ? (
                    <>
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        style={styles.input}
                      />
                      <input
                        type="text"
                        placeholder="description"
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        style={styles.input}
                      />

                      <input
                        type="text"
                        value={editedImage}
                        onChange={(e) => setEditedImage(e.target.value)}
                        style={styles.input}
                      />

                      <input
                        type="text"
                        placeholder="email"
                        value={editedEmail}
                        onChange={(e) => setEditedEmail(e.target.value)}
                        style={styles.input}
                      />
                      <input
                        type="text"
                        placeholder="password"
                        value={editedPassword}
                        onChange={(e) => setEditedPassword(e.target.value)}
                        style={styles.input}
                      />
                      <input
                        type="text"
                        placeholder="conferm password"
                        value={editedShopConPassword}
                        onChange={(e) => setEditedShopConPassword(e.target.value)}
                        style={styles.input}
                      />
                      <input
                        type="text"
                        placeholder="role"
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value)}
                        style={styles.input}
                      />
                      <button
                        onClick={() => handleSave(menuItem)}
                        style={styles.saveButton}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        style={styles.cancelButton}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(menuItem)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(menuItem)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={styles.loading}>Loading...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    minHeight: "100vh",
    position: "absolute",
    backgroundAttachment: "fixed",
    overflow: "auto",
    left: 0,
    zIndex: 1,
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "white",
    padding: "15px",
  },


  card: {
    backdropFilter: "blur(10px)",
    background: "white",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    padding: "20px",
    backgroundAttachment: "fixed",
    overflow: "auto",
    minHeight: "80vh",
    width: "80%",
    borderRadius: "10px",
    position: "absolute",
    top: "200px",
  },
  shopName: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "15px",
    textAlign: "center",
  },
  shopImage: {
    width: "100%",
    maxWidth: "400px",
    borderRadius: "10px",
    display: "block",
    margin: "0 auto 20px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    background: "#f9f9f9",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  textContainer: {
    flex: 1,
    textAlign: "left",
  },
  shopText: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#333",
  },
  actionContainer: {
    display: "flex",
    gap: "10px",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "80px",
  },
  saveButton: {
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  cancelButton: {
    background: "#f44336",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  editButton: {
    background: "linear-gradient(to right,rgb(254, 105, 79),rgb(254, 30, 0)",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    margin: "5px",
    borderRadius: "5px",
  },
  deleteButton: {
    background: "#ff5722",
    color: "#fff",
    border: "none",
    padding: "5px 12px",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default ShopDetail;
