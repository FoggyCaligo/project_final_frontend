"use client";

import { useMemo } from "react";
import { dashboardQuickLinks } from "@/features/dashboard/constants";
import { buildDashboardView } from "@/features/dashboard/dashboardModel";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import DashboardHero from "./DashboardHero";
import DashboardSummaryCards from "./DashboardSummaryCards";
import DashboardFridgeCard from "./DashboardFridgeCard";
import DashboardRecipeCard from "./DashboardRecipeCard";
import DashboardQuickLinks from "./DashboardQuickLinks";
import DashboardNoticeCard from "./DashboardNoticeCard";

export default function DashboardHome() {
  const { dashboard, loading, refresh } = useDashboardData();
  const view = useMemo(() => buildDashboardView(dashboard), [dashboard]);

  return (
    <div className="layout-container">
      <DashboardHero
        loading={loading}
        summaryCards={view.summaryCards}
        onRefresh={refresh}
      />

      <DashboardSummaryCards items={view.summaryCards} loading={loading} />

      <section className="section-block">
        <div className="grid-2">
          <DashboardFridgeCard
            items={view.soonItems}
            loading={loading}
            totalCount={view.soonTotalCount}
          />
          <DashboardRecipeCard recipes={view.recipes} loading={loading} />
        </div>
      </section>

      <section className="section-block">
        <div className="grid-2">
          <DashboardQuickLinks links={dashboardQuickLinks} />
          <DashboardNoticeCard notices={view.notices} />
        </div>
      </section>
    </div>
  );
}
