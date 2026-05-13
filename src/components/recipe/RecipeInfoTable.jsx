import styles from "@/app/recipes/[id]/Recipe.module.css";

export default function RecipeInfoTable({ title, data, renderValue, emptyMessage, columns = 1 }) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.infoTableContainer}>
        {title && <h3 className={styles.infoTableTitle}>{title}</h3>}
        <div className={styles.emptyBox}>
          {emptyMessage || "정보가 없습니다."}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.infoTableContainer}>
      {title && <h3 className={styles.infoTableTitle}>{title}</h3>}
      <div className={columns === 2 ? styles.gridContent : styles.tableContent}>
        {data.map((item, index) => (
          <div key={index} className={styles.infoItem}>
            <div className={styles.infoLabel}>{item.label}</div>
            <div className={styles.infoValue}>
              {renderValue ? renderValue(item) : item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
