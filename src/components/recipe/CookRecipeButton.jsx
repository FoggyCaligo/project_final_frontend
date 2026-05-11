"use client";

import { useState } from "react";
import { cookRecipe } from "@/api/recipeApi";
import { useAuth } from "@/context/AuthContext";
import styles from "./CookRecipeButton.module.css";

export default function CookRecipeButton({ recipeId }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCook = async () => {
    if (!user || !user.userId) {
      alert("요리 완료 기능을 사용하려면 로그인이 필요합니다.");
      return;
    }

    if (loading || success) return;

    if (!confirm("이 레시피를 요리하셨나요? 냉장고의 재료가 자동으로 차감됩니다.")) {
      return;
    }

    setLoading(true);
    try {
      await cookRecipe(recipeId);
      setSuccess(true);
      alert("요리 완료! 재료가 성공적으로 차감되었습니다.");
      window.location.reload(); 
    } catch (error) {
      console.error("요리 완료 처리 중 오류 발생:", error);
      alert(error.message || "요리 완료 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`${styles.cookButton} ${success ? styles.success : ""}`}
      onClick={handleCook}
      disabled={loading || success}
    >
      {loading ? (
        <span className={styles.loader}></span>
      ) : success ? (
        "요리 완료됨 ✓"
      ) : (
        "요리 완료"
      )}
    </button>
  );
}

