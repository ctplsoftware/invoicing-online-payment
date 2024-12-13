import React, { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

function DispatchDashboards() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h2>Image Viewer with React-Photo-View</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ marginBottom: "10px" }}
      />
      {selectedImage && (
        <PhotoProvider>
          <PhotoView src={selectedImage}>
            <img
              src={selectedImage}
              alt="Preview"
              style={{
                width: "300px",
                height: "auto",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            />
          </PhotoView>
        </PhotoProvider>
      )}
    </div>
  );
}

export default DispatchDashboards;
