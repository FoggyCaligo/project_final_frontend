import React from 'react';
import styles from './NutritionalSummary.module.css';

export default function NutritionalSummary({ user, mealHistory }) {
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr = 0;
  if (user.gender === 'male') {
    bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
  } else {
    bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
  }

  // Adjust target based on condition
  let targetCalories = bmr;
  if (user.condition === 'bulking') targetCalories += 500;
  if (user.condition === 'cutting') targetCalories -= 500;

  // Simple macronutrient split targets
  const targetProtein = user.weight * 2; // 2g per kg
  const targetFat = user.weight * 1; // 1g per kg
  const targetCarbs = (targetCalories - (targetProtein * 4) - (targetFat * 9)) / 4;

  // Calculate actual intake
  const actualIntake = mealHistory.reduce((acc, meal) => {
    acc.calories += meal.nutrition.calories || 0;
    acc.protein += meal.nutrition.protein || 0;
    acc.fat += meal.nutrition.fat || 0;
    acc.carbohydrates += meal.nutrition.carbohydrates || 0;
    return acc;
  }, { calories: 0, protein: 0, fat: 0, carbohydrates: 0 });

  const getDifference = (actual, target) => {
    const diff = target - actual;
    if (diff > 0) return { status: 'lacking', label: '부족', value: diff.toFixed(0) };
    return { status: 'excess', label: '초과', value: Math.abs(diff).toFixed(0) };
  };

  const caloriesDiff = getDifference(actualIntake.calories, targetCalories);
  const proteinDiff = getDifference(actualIntake.protein, targetProtein);
  const fatDiff = getDifference(actualIntake.fat, targetFat);
  const carbsDiff = getDifference(actualIntake.carbohydrates, targetCarbs);

  const conditionMap = {
    'bulking': '벌크업 (증량)',
    'cutting': '커팅 (감량)',
    'maintenance': '유지'
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>일일 영양 섭취 요약</h2>
      
      <div className={styles.cardsGrid}>
        <div className={styles.summaryCard}>
          <h3>사용자 프로필</h3>
          <p>키: <span>{user.height} cm</span></p>
          <p>몸무게: <span>{user.weight} kg</span></p>
          <p>상태: <span>{conditionMap[user.condition] || user.condition}</span></p>
          <p>목표 섭취량: <span>{targetCalories.toFixed(0)} kcal</span></p>
        </div>

        <div className={styles.summaryCard}>
          <h3>오늘의 섭취량</h3>
          <p>칼로리: <span>{actualIntake.calories.toFixed(0)} kcal</span></p>
          <p>단백질: <span>{actualIntake.protein.toFixed(0)} g</span></p>
          <p>지방: <span>{actualIntake.fat.toFixed(0)} g</span></p>
          <p>탄수화물: <span>{actualIntake.carbohydrates.toFixed(0)} g</span></p>
        </div>

        <div className={styles.summaryCard}>
          <h3>권장량 대비 부족/초과</h3>
          <p>칼로리: <span className={styles[caloriesDiff.status]}>{caloriesDiff.value} kcal {caloriesDiff.label}</span></p>
          <p>단백질: <span className={styles[proteinDiff.status]}>{proteinDiff.value} g {proteinDiff.label}</span></p>
          <p>지방: <span className={styles[fatDiff.status]}>{fatDiff.value} g {fatDiff.label}</span></p>
          <p>탄수화물: <span className={styles[carbsDiff.status]}>{carbsDiff.value} g {carbsDiff.label}</span></p>
        </div>
      </div>
    </div>
  );
}
