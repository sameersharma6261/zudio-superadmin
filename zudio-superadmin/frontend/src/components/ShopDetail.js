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
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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
        const updatedItems = shop.shopss.map((item) =>
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
        setShop({ ...shop, shopss: updatedItems });

        setEditingItem(null);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/shops/delete-menu-item/${id}/${itemToDelete.name}`
      );
      if (response.data.success) {
        const updatedItems = shop.shopss.filter(
          (item) => item.name !== itemToDelete.name
        );
        setShop({ ...shop, shopss: updatedItems });
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
    } finally {
      setShowDeletePopup(false);
      setItemToDelete(null);
    }
  };

  const handleManageMenu = (shop) => {
    setSelectedFood(shop);
  };

  // Filtering menu items based on search query
  const filteredshopss = shop
    ? shop.shopss.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];









  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Zudio</h2>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Zudio..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: "10px",
          position: "fixed",
          width: "60%",
          borderRadius: "5px",
          color: "white",
          border: "1px solid #ccc",
          // marginBottom: "20px",
          marginTop: "60px",
          background: "transparent",
          fontSize: "16px",
        }}
      />
      <div
        style={{
          zIndex: "5",
          position: "fixed",
          top: "100px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => handleManageMenu(shop)}
          style={styles.editButton}
        >
          Add Zudio's
        </button>
        {selectedFood && (
          <MenuModal
            shop={selectedFood}
            onClose={() => setSelectedFood(null)}
          />
        )}
      </div>

      {shop ? (
        <div style={styles.card}>
          <h3 style={styles.shopName}>{shop.name}</h3>
          <img src={shop.imageUrl} alt={shop.name} style={styles.shopImage} />
          <ul style={styles.list}>




            {filteredshopss.map((menuItem, index) => (
             <li key={index} className="list-item">
  <div className="text-container">
    <div className="shop-text">
  <p><strong>Name:</strong> {menuItem.name}</p>
  <p><strong>Description:</strong> {menuItem.description}</p>
  <p><strong>Image:</strong> {menuItem.image}</p>
  <p><strong>Email:</strong> {menuItem.email}</p>
  <p><strong>Password:</strong> {menuItem.password}</p>
  <p><strong>Confirm Password:</strong> {menuItem.shopconpassword}</p>
  <p><strong>Role:</strong> {menuItem.role}</p>
</div>
  </div>
  <div className="action-container">
    {editingItem === menuItem ? (
      <>
        <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="input-field" />
        <input type="text" placeholder="description" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} className="input-field" />
        <input type="text" value={editedImage} onChange={(e) => setEditedImage(e.target.value)} className="input-field" />
        <input type="text" placeholder="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} className="input-field" />
        <input type="text" placeholder="password" value={editedPassword} onChange={(e) => setEditedPassword(e.target.value)} className="input-field" />
        <input type="text" placeholder="confirm password" value={editedShopConPassword} onChange={(e) => setEditedShopConPassword(e.target.value)} className="input-field" />
        <input type="text" placeholder="role" value={editedRole} onChange={(e) => setEditedRole(e.target.value)} className="input-field" />
        <button onClick={() => handleSave(menuItem)} className="save-button">Save</button>
        <button onClick={() => setEditingItem(null)} className="cancel-button">Cancel</button>
      </>
    ) : (
      <>
        <button onClick={() => handleEdit(menuItem)} className="edit-button">Edit</button>
        <button onClick={() => { setItemToDelete(menuItem); setShowDeletePopup(true); }} className="delete-button">Delete</button>
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


     {showDeletePopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            }}
          >
            <h3>Are you sure you want to delete this menu item?</h3>
            <p style={{ color: "#888" }}>{itemToDelete?.name}</p>
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() => setShowDeletePopup(false)}
                style={{
                  marginRight: "10px",
                  padding: "10px 20px",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
      .list-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.text-container {
  flex: 1 1 300px;
  font-size: 16px;
  color: #333;
  word-break: break-word;
}

.shop-text {
  display: block;
  line-height: 1.5;
}

.action-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
  flex: 1 1 300px;
}

.input-field {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  max-width: 280px;
  font-size: 14px;
}

.save-button,
.cancel-button,
.edit-button,
.delete-button {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.save-button {
  background-color: #28a745;
}

.cancel-button {
  background-color: #6c757d;
}

.edit-button {
  background-color: #007bff;
}

.delete-button {
  background-color: #dc3545;
}

/* ✅ Mobile View */
@media (max-width: 768px) {
  .list-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .text-container,
  .action-container {
    flex: 1 1 100%;
  }

  .action-container {
    justify-content: flex-start;
  }

  .input-field,
  .save-button,
  .cancel-button,
  .edit-button,
  .delete-button {
    width: 100%;
    max-width: 100%;
  }
}
      `}</style>
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
    // background: "red",
    overflow: "auto",
    left: 0,
    zIndex: 1,
  },
  heading: {
    color: "white",
    fontSize: "48px",
    fontFamily: "Rajdhani, sans-serif",
    position: "fixed",
    left: "20px",
    top: "10px",
    padding: "0",
    margin: "0",
    zIndex: "200",
  },

  card: {
    backdropFilter: "blur(10px)",
    // background: "white",
    boxShadow: "0 10px 30px gray",
    padding: "20px",
    backgroundAttachment: "fixed",
    background: " white",
    overflow: "auto",
    minHeight: "80vh",
    width: "80%",
    borderRadius: "10px",
    position: "absolute",
    top: "142px",
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
    background: "red",
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
