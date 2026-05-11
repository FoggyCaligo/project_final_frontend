import styles from "@/app/recipes/[id]/Recipe.module.css";

export default function RecipeStep({ number, content, image }) {
  return (
    <div className={styles.stepCard}>
      <div className={styles.stepImageContainer}>
        <img
          src={image}
          alt={`Step ${number}`}
          className={styles.stepImage}
        />
      </div>
      <div className={styles.stepContent}>
        <div className={styles.stepNumber}>Step {number}</div>
        <p className="text-main leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
