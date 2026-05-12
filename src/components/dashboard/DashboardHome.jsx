"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { buildDashboardView } from "@/features/dashboard/dashboardModel";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import DashboardHero from "./DashboardHero";
import DashboardSummaryCards from "./DashboardSummaryCards";
import DashboardFridgeCard from "./DashboardFridgeCard";
import DashboardInsightCard from "./DashboardInsightCard";
import DashboardRecipeCard from "./DashboardRecipeCard";
import DashboardNoticeCard from "./DashboardNoticeCard";
import DashboardShoppingCard from "./DashboardShoppingCard";

export default function DashboardHome() {
  const { user } = useAuth();
  const { dashboard, loading, refresh } = useDashboardData();
  const view = useMemo(() => buildDashboardView(dashboard), [dashboard]);
  const displayName = user?.nickname || user?.loginId || "회원";

  return (
    <div className="layout-container">
      <DashboardHero
        loading={loading}
        summaryCards={view.summaryCards}
        onRefresh={refresh}
      />

      <DashboardSummaryCards items={view.summaryCards} loading={loading} />

      <section className="section-block">
        <div className="dashboard-main-grid">
          <div className="dashboard-stack">
            <DashboardInsightCard
              displayName={displayName}
              insights={view.insights}
              loading={loading}
            />
            <DashboardNoticeCard notices={view.notices} />
            <DashboardShoppingCard shopping={view.shoppingSummary} loading={loading} />
            <DashboardFridgeCard
              items={view.soonItems}
              loading={loading}
              totalCount={view.soonTotalCount}
            />
          </div>
          <div className="dashboard-stack">
            <DashboardRecipeCard recipes={view.recipes} loading={loading} />
          </div>
        </div>
      </section>
    </div>
  );
}
