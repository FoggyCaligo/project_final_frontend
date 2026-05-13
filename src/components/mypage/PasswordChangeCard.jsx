"use client";

import { useState } from "react";
import { requestPasswordChange } from "@/features/mypage/mypageApi";

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const passwordRules = [
  {
    id: "length",
    label: "8~30자",
    test: (value) => value.length >= 8 && value.length <= 30,
  },
  {
    id: "letter",
    label: "영문 포함",
    test: (value) => /[A-Za-z]/.test(value),
  },
  {
    id: "digit",
    label: "숫자 포함",
    test: (value) => /\d/.test(value),
  },
  {
    id: "special",
    label: "특수문자 포함",
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
];

function isPasswordValid(password) {
  return passwordRules.every((rule) => rule.test(password));
}

function getErrorMessage(error) {
  if (error?.status === 401) {
    return "현재 비밀번호가 일치하지 않습니다.";
  }

  if (error?.status === 403) {
    return "로그인 세션을 확인한 뒤 다시 시도해주세요.";
  }

  return error?.message ?? "비밀번호 변경 중 오류가 발생했습니다.";
}

export default function PasswordChangeCard({
  disabled = false,
  disabledReason = "",
  embedded = false,
}) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [visibleFields, setVisibleFields] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const newPasswordValid = isPasswordValid(form.newPassword);
  const passwordsMatch =
    form.confirmPassword.length > 0 && form.newPassword === form.confirmPassword;
  const canSubmit =
    !disabled &&
    !submitting &&
    form.currentPassword.length > 0 &&
    newPasswordValid &&
    passwordsMatch &&
    form.currentPassword !== form.newPassword;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage("");
    setError("");
  };

  const toggleVisible = (fieldName) => {
    setVisibleFields((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (disabled) {
      setError(disabledReason || "로그인 세션을 확인한 뒤 다시 시도해주세요.");
      return;
    }

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("현재 비밀번호와 새 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!newPasswordValid) {
      setError("새 비밀번호는 영문, 숫자, 특수문자를 포함한 8~30자로 입력해주세요.");
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError("현재 비밀번호와 다른 새 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      await requestPasswordChange({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm(initialForm);
      setMessage("비밀번호가 변경되었습니다.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
      <div className={embedded ? "" : "card-body"}>
        {!embedded && (
          <>
            <h2 className="card-title">비밀번호 변경</h2>
            <p className="card-desc">
              현재 비밀번호를 확인한 뒤 새 비밀번호로 변경합니다.
            </p>
          </>
        )}

        <form className={`${embedded ? "mt-0" : "mt-5"} flex flex-col gap-4`} onSubmit={handleSubmit}>
          <label className="form-group mb-0">
            <span className="form-label">현재 비밀번호</span>
            <div className="relative">
              <input
                autoComplete="current-password"
                className="form-input pr-20"
                disabled={disabled || submitting}
                name="currentPassword"
                onChange={handleChange}
                type={visibleFields.currentPassword ? "text" : "password"}
                value={form.currentPassword}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--color-text-sub)]"
                disabled={disabled || submitting}
                onClick={() => toggleVisible("currentPassword")}
                type="button"
              >
                {visibleFields.currentPassword ? "숨김" : "보기"}
              </button>
            </div>
          </label>

          <label className="form-group mb-0">
            <span className="form-label">새 비밀번호</span>
            <div className="relative">
              <input
                autoComplete="new-password"
                className="form-input pr-20"
                disabled={disabled || submitting}
                name="newPassword"
                onChange={handleChange}
                type={visibleFields.newPassword ? "text" : "password"}
                value={form.newPassword}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--color-text-sub)]"
                disabled={disabled || submitting}
                onClick={() => toggleVisible("newPassword")}
                type="button"
              >
                {visibleFields.newPassword ? "숨김" : "보기"}
              </button>
            </div>
          </label>

          <div className="flex flex-wrap gap-2">
            {passwordRules.map((rule) => {
              const passed = rule.test(form.newPassword);

              return (
                <span
                  className={`badge ${passed ? "badge-success" : ""}`}
                  key={rule.id}
                >
                  {passed ? "✓" : "-"} {rule.label}
                </span>
              );
            })}
          </div>

          <label className="form-group mb-0">
            <span className="form-label">새 비밀번호 확인</span>
            <div className="relative">
              <input
                autoComplete="new-password"
                className="form-input pr-20"
                disabled={disabled || submitting}
                name="confirmPassword"
                onChange={handleChange}
                type={visibleFields.confirmPassword ? "text" : "password"}
                value={form.confirmPassword}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--color-text-sub)]"
                disabled={disabled || submitting}
                onClick={() => toggleVisible("confirmPassword")}
                type="button"
              >
                {visibleFields.confirmPassword ? "숨김" : "보기"}
              </button>
            </div>
          </label>

          {form.confirmPassword && !passwordsMatch && (
            <p className="text-sm font-bold text-[var(--color-danger)]">
              새 비밀번호가 일치하지 않습니다.
            </p>
          )}

          {form.currentPassword &&
            form.newPassword &&
            form.currentPassword === form.newPassword && (
              <p className="text-sm font-bold text-[var(--color-danger)]">
                현재 비밀번호와 다른 비밀번호를 사용해주세요.
              </p>
            )}

          {disabled && disabledReason && (
            <p className="text-sm font-bold text-[var(--color-text-sub)]">
              {disabledReason}
            </p>
          )}
          {error && (
            <p aria-live="polite" className="text-sm font-bold text-[var(--color-danger)]">
              {error}
            </p>
          )}
          {message && (
            <p aria-live="polite" className="text-sm font-bold text-[var(--color-primary)]">
              {message}
            </p>
          )}

          <div className="card-actions">
            <button className="btn btn-secondary" disabled={!canSubmit} type="submit">
              {submitting ? "변경 중" : "비밀번호 변경"}
            </button>
          </div>
        </form>
      </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <article className="card-box">
      {content}
    </article>
  );
}
