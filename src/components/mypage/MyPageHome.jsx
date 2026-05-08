"use client";

import Link from "next/link";
import LoginButton from "@/components/layout/public/LoginButton";
import { useMyPageData } from "@/features/mypage/useMyPageData";
import AccountSettings from "./AccountSettings";
import ActivitySummary from "./ActivitySummary";
import ProfileCard from "./ProfileCard";
import QuickLinks from "./QuickLinks";
import RecentActivity from "./RecentActivity";

export default function MyPageHome() {
  const { myPage, loading, refresh } = useMyPageData();

  if (!loading && myPage.authRequired) {
    return (
      <div className="layout-container">
        <section className="section-block">
          <div className="section-head">
            <div>
              <h1 className="section-title">마이페이지</h1>
              <p className="section-desc">
                마이페이지는 로그인한 회원 정보가 확인되어야 사용할 수 있습니다.
              </p>
            </div>
          </div>

          <article className="card-box">
            <div className="card-body">
              <span className="badge badge-warning">로그인 필요</span>
              <h2 className="mt-4 text-2xl font-extrabold text-[var(--color-text)]">
                회원 정보를 불러오지 못했습니다.
              </h2>
              <p className="card-desc mt-2">
                로그인 후 닉네임, 프로필, 냉장고 활동, 작성 후기를 확인할 수 있습니다.
              </p>
              <div className="card-actions">
                <LoginButton />
                <Link className="btn btn-outline" href="/">
                  홈으로 이동
                </Link>
              </div>
            </div>
          </article>
        </section>
      </div>
    );
  }

  return (
    <div className="layout-container">
      <section className="section-block">
        <div className="section-head">
          <div>
            <h1 className="section-title">마이페이지</h1>
            <p className="section-desc">
              회원 정보와 개인 활동을 확인하고 자주 쓰는 화면으로 이동합니다.
            </p>
          </div>
          <div className="section-actions">
            <Link className="btn btn-outline" href="/dashboard">
              대시보드
            </Link>
          </div>
        </div>

        {myPage.errors.length > 0 && (
          <div className="mb-4 rounded-xl border border-[var(--color-warning-bg)] bg-[var(--color-warning-bg)] p-4 text-sm font-semibold text-[var(--color-accent)]">
            일부 데이터 연결을 확인하지 못했습니다: {myPage.errors.join(", ")}
          </div>
        )}

        {myPage.activityUnavailable && (
          <div className="mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] p-4 text-sm font-semibold text-[var(--color-text-sub)]">
            프로필 정보는 확인했지만 작성 후기와 북마크 활동은 아직 연결되지 않았습니다.
          </div>
        )}

        <ProfileCard profile={myPage.profile} loading={loading} onRefresh={refresh} />
      </section>

      <ActivitySummary activity={myPage.activity} loading={loading} />
      <RecentActivity
        recentPosts={myPage.recentPosts}
        bookmarkedRecipes={myPage.bookmarkedRecipes}
        loading={loading}
      />

      <section className="section-block">
        <div className="grid-2">
          <AccountSettings />
          <QuickLinks />
        </div>
      </section>
    </div>
  );
}
