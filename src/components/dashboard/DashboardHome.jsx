"use client";

import { useEffect, useMemo, useState } from "react";
import { buildDashboardView } from "@/features/dashboard/dashboardModel";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import DashboardHero from "./DashboardHero";
import DashboardSummaryCards from "./DashboardSummaryCards";
import DashboardFridgeCard from "./DashboardFridgeCard";
import DashboardInsightCard from "./DashboardInsightCard";
import DashboardRecipeCard from "./DashboardRecipeCard";
import DashboardNoticeModal from "./DashboardNoticeModal";
import styles from "./Dashboard.module.css";

const NOTICE_MODAL_SESSION_KEY = "today-fridge-dashboard-notice-modal-shown";
const MODAL_NOTICE_IDS = new Set(["expired", "soon"]);

export default function DashboardHome() {
  const { dashboard, loading, refresh } = useDashboardData();
  const view = useMemo(() => buildDashboardView(dashboard), [dashboard]);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const modalNotices = useMemo(
    () => view.notices.filter((notice) => MODAL_NOTICE_IDS.has(notice.id)),
    [view.notices],
  );

  useEffect(() => {
    if (loading || modalNotices.length === 0) return;

    const alreadyShown = sessionStorage.getItem(NOTICE_MODAL_SESSION_KEY);
    if (alreadyShown) return;

    sessionStorage.setItem(NOTICE_MODAL_SESSION_KEY, "true");
    const timerId = window.setTimeout(() => {
      setIsNoticeModalOpen(true);
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loading, modalNotices]);

  return (
    <>
      <div className="layout-container">
        <DashboardHero
          loading={loading}
          summaryCards={view.summaryCards}
          onRefresh={refresh}
        />

        <DashboardSummaryCards items={view.summaryCards} loading={loading} />

        <section className="section-block">
          <div className={styles.mainGrid}>
            <div className={styles.stack}>
              <DashboardInsightCard
                insights={view.insights}
                loading={loading}
              />
              <DashboardFridgeCard
                items={view.soonItems}
                loading={loading}
                totalCount={view.soonTotalCount}
              />
            </div>
            <div className={styles.stack}>
              <DashboardRecipeCard recipes={view.recipes} loading={loading} />
            </div>
          </div>
        </section>
      </div>

      <DashboardNoticeModal
        isOpen={isNoticeModalOpen}
        notices={modalNotices}
        onClose={() => setIsNoticeModalOpen(false)}
      />
    </>
  );
}
