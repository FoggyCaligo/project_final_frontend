import React from 'react';
import styles from './MealHistoryList.module.css';

export default function MealHistoryList({ mealHistory }) {
  if (!mealHistory || mealHistory.length === 0) {
    return <div className={styles.emptyState}>기록된 식사가 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>식사 기록</h2>
      <div className={styles.list}>
        {mealHistory.map((meal) => (
          <div key={meal.id} className={styles.mealCard}>
            <div className={styles.mealHeader}>
              <span className={styles.time}>{meal.time}</span>
              <span className={styles.divider}>|</span>
              <span className={styles.mealName}>
                {meal.isRecipe ? meal.recipeName : meal.mealName}
              </span>
              {meal.isRecipe && <span className={styles.recipeBadge}>레시피</span>}
            </div>
            
            <div className={styles.nutritionTable}>
              <div className={styles.tableRow}>
                <div className={styles.tableHeader}>탄수화물</div>
                <div className={styles.tableHeader}>단백질</div>
                <div className={styles.tableHeader}>지방</div>
                <div className={styles.tableHeader}>칼로리</div>
                <div className={styles.tableHeader}>나트륨</div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}>{meal.nutrition.carbohydrates || 0}g</div>
                <div className={styles.tableCell}>{meal.nutrition.protein || 0}g</div>
                <div className={styles.tableCell}>{meal.nutrition.fat || 0}g</div>
                <div className={styles.tableCell}>{meal.nutrition.calories || 0}kcal</div>
                <div className={styles.tableCell}>{meal.nutrition.sodium || 0}mg</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
