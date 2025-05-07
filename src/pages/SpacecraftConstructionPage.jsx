import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { buildSpacecraft } from "../store/spaceTravelSlice";
import Loading from "../components/Loading";
import styles from "./SpacecraftConstructionPage.module.css";

function SpacecraftConstructionPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.spaceTravel);

  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    description: "",
    pictureUrl: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    capacity: "",
    description: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.capacity) {
      newErrors.capacity = "Capacity is required";
      valid = false;
    } else if (isNaN(formData.capacity)) {
      newErrors.capacity = "Capacity must be a number";
      valid = false;
    } else if (formData.capacity < 1) {
      newErrors.capacity = "Capacity must be at least 1";
      valid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await dispatch(buildSpacecraft({
        name: formData.name,
        capacity: Number(formData.capacity),
        description: formData.description,
        pictureUrl: formData.pictureUrl || undefined
      })).unwrap();
      
      navigate("/spacecrafts");
    } catch (error) {
      console.error("Failed to build spacecraft:", error);
    }
  };

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className={styles.constructionPage}>
      <div className={styles.header}>
        <h1>Build New Spacecraft</h1>
        <Link to="/spacecrafts" className={styles.backButton}>
          ← Back to Fleet
        </Link>
      </div>

      <form onSubmit={handleSubmit} className={styles.constructionForm}>
        {error && (
          <div className={styles.formError}>
            Error: {error}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="name">Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? styles.errorInput : ""}
          />
          {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="capacity">Capacity*</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            className={errors.capacity ? styles.errorInput : ""}
          />
          {errors.capacity && (
            <span className={styles.errorMessage}>{errors.capacity}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? styles.errorInput : ""}
          />
          {errors.description && (
            <span className={styles.errorMessage}>{errors.description}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="pictureUrl">Image URL (optional)</label>
          <input
            type="url"
            id="pictureUrl"
            name="pictureUrl"
            value={formData.pictureUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            Build Spacecraft
          </button>
        </div>
      </form>
    </div>
  );
}

export default SpacecraftConstructionPage;