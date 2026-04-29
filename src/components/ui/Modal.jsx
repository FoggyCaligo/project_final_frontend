'use client';

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

export default function Modal({
    isOpen,
    title = "모달 제목",
    description = "",
    children,
    onClose,
    onConfirm,
    confirmText = "확인",
    cancelText = "취소",
    showFooter = true,
    closeOnOverlay = true,
    variant = "default",
}) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose?.();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const isLogin = variant === "login";

    const base = {
        overlay: isLogin ? "login-overlay" : "fixed inset-0 z-[9999] overflow-y-auto",
        inner: isLogin ? "login-inner" : "flex min-h-full items-center justify-center px-4 py-8",
        panel: "relative w-full max-w-[560px] rounded-[20px] border bg-white shadow-lg",
        header: "flex items-start justify-between gap-4 border-b px-6 py-5",
        body: "px-6 py-5",
        footer: "flex justify-end gap-3 border-t px-6 py-4",
        closeButton:
            "inline-flex h-10 w-10 items-center justify-center rounded-full border text-lg font-semibold transition hover:opacity-80",
    };

    const inlineStyle = {
        overlay: {
            backgroundColor: "rgba(59, 49, 43, 0.45)",
        },
        panel: {
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border)",
        },
        header: {
            borderColor: "var(--border)",
        },
        footer: {
            borderColor: "var(--border)",
        },
        title: {
            color: "var(--text-main)",
        },
        description: {
            color: "var(--text-sub)",
        },
        closeButton: {
            borderColor: "var(--border)",
            color: "var(--text-sub)",
            backgroundColor: "var(--soft-bg)",
        },
    };

    const handleOverlayClick = () => {
        if (closeOnOverlay) {
            onClose?.();
        }
    };

    return createPortal(
        <div
            className={base.overlay}
            style={inlineStyle.overlay}
            onClick={handleOverlayClick}
        >
            <div className={base.inner}>
            <div
                className={base.panel}
                style={inlineStyle.panel}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={base.header} style={inlineStyle.header}>
                    <div className="flex-1">
                        <h2
                            className="text-[24px] font-extrabold leading-tight"
                            style={inlineStyle.title}
                        >
                            {title}
                        </h2>

                        {description ? (
                            <p
                                className="mt-2 text-sm leading-6"
                                style={inlineStyle.description}
                            >
                                {description}
                            </p>
                        ) : null}
                    </div>

                    <button
                        type="button"
                        className={base.closeButton}
                        style={inlineStyle.closeButton}
                        onClick={onClose}
                        aria-label="모달 닫기"
                    >
                        ×
                    </button>
                </div>

                <div className={base.body}>
                    {children}
                </div>

                {showFooter && (
                    <div className={base.footer} style={inlineStyle.footer}>
                        <Button is_full={true} variant="secondary" handleClick={onClose}>
                            {cancelText}
                        </Button>

                        <Button is_full={true} variant="primary" handleClick={onConfirm}>
                            {confirmText}
                        </Button>
                    </div>
                )}
            </div>
            </div>
        </div>,
        document.body
    );
}
