import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { nutritionistAPI } from '../../api/nutritionist';
import { formatDate } from '../../utils/helpers';
import styles from './Meals.module.css';

const Meals = () => {
  const { user } = useAuthStore();
  const [meals, setMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    sugar: '',
    sodium: '',
    image_url: '',
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    is_dairy_free: false,
    preparation_time: '',
    cooking_time: '',
    servings: '',
    difficulty_level: 'easy',
    cuisine_type: '',
    meal_type: 'breakfast'
  });
  const { loading, error, callApi } = useApi();

  const fetchMeals = async () => {
    const result = await callApi(() => nutritionistAPI.getMeals());
    if (result) {
      setMeals(result);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await callApi(() => 
      editingMeal 
        ? nutritionistAPI.updateMeal(editingMeal.id, formData)
        : nutritionistAPI.createMeal(formData)
    );
    
    if (result) {
      setShowForm(false);
      setEditingMeal(null);
      setFormData({
        name: '',
        description: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        fiber: '',
        sugar: '',
        sodium: '',
        image_url: '',
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        is_dairy_free: false,
        preparation_time: '',
        cooking_time: '',
        servings: '',
        difficulty_level: 'easy',
        cuisine_type: '',
        meal_type: 'breakfast'
      });
      fetchMeals();
    }
  };

  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setFormData({
      name: meal.name || '',
      description: meal.description || '',
      calories: meal.calories || '',
      protein: meal.protein || '',
      carbs: meal.carbs || '',
      fat: meal.fat || '',
      fiber: meal.fiber || '',
      sugar: meal.sugar || '',
      sodium: meal.sodium || '',
      image_url: meal.image_url || '',
      is_vegetarian: meal.is_vegetarian || false,
      is_vegan: meal.is_vegan || false,
      is_gluten_free: meal.is_gluten_free || false,
      is_dairy_free: meal.is_dairy_free || false,
      preparation_time: meal.preparation_time || '',
      cooking_time: meal.cooking_time || '',
      servings: meal.servings || '',
      difficulty_level: meal.difficulty_level || 'easy',
      cuisine_type: meal.cuisine_type || '',
      meal_type: meal.meal_type || 'breakfast'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      const result = await callApi(() => nutritionistAPI.deleteMeal(id));
      if (result) {
        fetchMeals();
      }
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'easy': return styles.easy;
      case 'medium': return styles.medium;
      case 'hard': return styles.hard;
      default: return styles.easy;
    }
  };

  const getMealTypeColor = (type) => {
    switch (type) {
      case 'breakfast': return styles.breakfast;
      case 'lunch': return styles.lunch;
      case 'dinner': return styles.dinner;
      case 'snack': return styles.snack;
      default: return styles.breakfast;
    }
  };

  if (user?.role !== 'nutritionist') {
    return (
      <div className={styles.container}>
        <div className={styles.accessDenied}>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Meals Management</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Add New Meal
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🍽️</div>
          <div className={styles.statContent}>
            <h3>Total Meals</h3>
            <p>{meals.length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🥗</div>
          <div className={styles.statContent}>
            <h3>Vegetarian</h3>
            <p>{meals.filter(meal => meal.is_vegetarian).length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🌱</div>
          <div className={styles.statContent}>
            <h3>Vegan</h3>
            <p>{meals.filter(meal => meal.is_vegan).length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statContent}>
            <h3>Average Rating</h3>
            <p>4.2</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingMeal ? 'Edit Meal' : 'Add New Meal'}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingMeal(null);
                  setFormData({
                    name: '',
                    description: '',
                    calories: '',
                    protein: '',
                    carbs: '',
                    fat: '',
                    fiber: '',
                    sugar: '',
                    sodium: '',
                    image_url: '',
                    is_vegetarian: false,
                    is_vegan: false,
                    is_gluten_free: false,
                    is_dairy_free: false,
                    preparation_time: '',
                    cooking_time: '',
                    servings: '',
                    difficulty_level: 'easy',
                    cuisine_type: '',
                    meal_type: 'breakfast'
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Meal Type</label>
                  <select name="meal_type" value={formData.meal_type} onChange={handleInputChange}>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Calories</label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Servings</label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Protein (g)</label>
                  <input
                    type="number"
                    name="protein"
                    value={formData.protein}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Carbs (g)</label>
                  <input
                    type="number"
                    name="carbs"
                    value={formData.carbs}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Fat (g)</label>
                  <input
                    type="number"
                    name="fat"
                    value={formData.fat}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Fiber (g)</label>
                  <input
                    type="number"
                    name="fiber"
                    value={formData.fiber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Difficulty Level</label>
                  <select name="difficulty_level" value={formData.difficulty_level} onChange={handleInputChange}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Preparation Time (min)</label>
                  <input
                    type="number"
                    name="preparation_time"
                    value={formData.preparation_time}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Cooking Time (min)</label>
                  <input
                    type="number"
                    name="cooking_time"
                    value={formData.cooking_time}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Cuisine Type</label>
                  <input
                    type="text"
                    name="cuisine_type"
                    value={formData.cuisine_type}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="checkbox"
                    name="is_vegetarian"
                    checked={formData.is_vegetarian}
                    onChange={handleInputChange}
                  />
                  Vegetarian
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="is_vegan"
                    checked={formData.is_vegan}
                    onChange={handleInputChange}
                  />
                  Vegan
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="is_gluten_free"
                    checked={formData.is_gluten_free}
                    onChange={handleInputChange}
                  />
                  Gluten Free
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="is_dairy_free"
                    checked={formData.is_dairy_free}
                    onChange={handleInputChange}
                  />
                  Dairy Free
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingMeal ? 'Update Meal' : 'Create Meal'}
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setEditingMeal(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Loading meals...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Calories</th>
                <th>Difficulty</th>
                <th>Prep Time</th>
                <th>Dietary</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {meals.map(meal => (
                <tr key={meal.id}>
                  <td>
                    <div className={styles.mealInfo}>
                      {meal.image_url && (
                        <img src={meal.image_url} alt={meal.name} className={styles.mealImage} />
                      )}
                      <div>
                        <strong>{meal.name}</strong>
                        {meal.description && (
                          <p className={styles.mealDescription}>{meal.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.mealType} ${getMealTypeColor(meal.meal_type)}`}>
                      {meal.meal_type}
                    </span>
                  </td>
                  <td>{meal.calories || '-'}</td>
                  <td>
                    <span className={`${styles.difficulty} ${getDifficultyColor(meal.difficulty_level)}`}>
                      {meal.difficulty_level}
                    </span>
                  </td>
                  <td>{meal.preparation_time ? `${meal.preparation_time} min` : '-'}</td>
                  <td>
                    <div className={styles.dietaryTags}>
                      {meal.is_vegetarian && <span className={styles.tag}>🥗 Veg</span>}
                      {meal.is_vegan && <span className={styles.tag}>🌱 Vegan</span>}
                      {meal.is_gluten_free && <span className={styles.tag}>🌾 GF</span>}
                      {meal.is_dairy_free && <span className={styles.tag}>🥛 DF</span>}
                    </div>
                  </td>
                  <td>{formatDate(meal.created_at)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEdit(meal)}
                      >
                        Edit
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDelete(meal.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Meals;
