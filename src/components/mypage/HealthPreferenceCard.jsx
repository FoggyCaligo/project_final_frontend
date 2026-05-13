"use client";

import { useState } from "react";
import { requestConditionUpdate, requestProfileUpdate } from "@/features/mypage/mypageApi";

function getInitialForm(profile) {
  return {
    heightCm: profile?.heightCm ?? "",
    weightKg: profile?.weightKg ?? "",
    gender: profile?.gender ?? "",
    age: profile?.age ?? "",
    milkAllergy: Boolean(profile?.milkAllergy),
    eggAllergy: Boolean(profile?.eggAllergy),
    diet: Boolean(profile?.diet),
    lowSodium: Boolean(profile?.lowSodium),
  };
}

function CheckboxField({ defaultChecked, disabled, label, name }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] p-4 font-bold text-[var(--color-text)]">
      <span>{label}</span>
      <input
        className="h-5 w-5 accent-[var(--color-primary)]"
        defaultChecked={defaultChecked}
        disabled={disabled}
        name={name}
        type="checkbox"
      />
    </label>
  );
}

function toNullableNumber(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed === "" ? null : Number(trimmed);
}

function getErrorMessage(error) {
  return error?.message ?? "건강 정보 저장 중 오류가 발생했습니다.";
}

export default function HealthPreferenceCard({ profile, loading }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const defaults = getInitialForm(profile);
  const profileVersion = Object.values(defaults).join(":");
  const disabled = loading || saving;

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    const formData = new FormData(event.currentTarget);
    const profilePayload = {
      nickname: profile?.nickname ?? null,
      profileImageUrl: profile?.profileImageUrl ?? null,
      heightCm: toNullableNumber(formData.get("heightCm")),
      weightKg: toNullableNumber(formData.get("weightKg")),
      age: toNullableNumber(formData.get("age")),
      gender: formData.get("gender") || null,
    };
    const conditionPayload = {
      milkAllergy: formData.has("milkAllergy"),
      eggAllergy: formData.has("eggAllergy"),
      diet: formData.has("diet"),
      lowSodium: formData.has("lowSodium"),
    };

    try {
      await requestProfileUpdate(profilePayload);
      await requestConditionUpdate(conditionPayload, profile?.userId);
      setMessage("건강 정보가 저장되었습니다.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="card-box mt-5">
      <div className="card-body">
        <div className="section-head mb-0">
          <div>
            <h2 className="card-title">건강 정보</h2>
            <p className="card-desc">
              추천 레시피에 활용할 신체 정보와 식단 조건을 관리합니다.
            </p>
          </div>
          <span className="badge badge-success">저장 가능</span>
        </div>

        <form className="mt-5" key={profileVersion} onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="form-group mb-0">
              <span className="form-label">키</span>
              <input
                className="form-input"
                defaultValue={defaults.heightCm}
                disabled={disabled}
                inputMode="decimal"
                name="heightCm"
                placeholder="cm"
                type="number"
              />
            </label>

            <label className="form-group mb-0">
              <span className="form-label">몸무게</span>
              <input
                className="form-input"
                defaultValue={defaults.weightKg}
                disabled={disabled}
                inputMode="decimal"
                name="weightKg"
                placeholder="kg"
                type="number"
              />
            </label>

            <label className="form-group mb-0">
              <span className="form-label">성별</span>
              <select
                className="form-select"
                defaultValue={defaults.gender}
                disabled={disabled}
                name="gender"
              >
                <option value="">선택 안 함</option>
                <option value="FEMALE">여성</option>
                <option value="MALE">남성</option>
                <option value="OTHER">기타</option>
              </select>
            </label>

            <label className="form-group mb-0">
              <span className="form-label">나이</span>
              <input
                className="form-input"
                defaultValue={defaults.age}
                disabled={disabled}
                inputMode="numeric"
                name="age"
                placeholder="만 나이"
                type="number"
              />
            </label>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <CheckboxField
              defaultChecked={defaults.milkAllergy}
              disabled={disabled}
              label="우유 알러지"
              name="milkAllergy"
            />
            <CheckboxField
              defaultChecked={defaults.eggAllergy}
              disabled={disabled}
              label="계란 알러지"
              name="eggAllergy"
            />
            <CheckboxField
              defaultChecked={defaults.diet}
              disabled={disabled}
              label="다이어트"
              name="diet"
            />
            <CheckboxField
              defaultChecked={defaults.lowSodium}
              disabled={disabled}
              label="저염식"
              name="lowSodium"
            />
          </div>

          {message && (
            <p className="mt-4 rounded-xl bg-[var(--color-primary-soft)] px-4 py-3 text-sm font-bold text-[var(--color-primary)]">
              {message}
            </p>
          )}
          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              {error}
            </p>
          )}

          <div className="card-actions">
            <button className="btn btn-secondary" disabled={disabled} type="submit">
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </article>
  );
}
