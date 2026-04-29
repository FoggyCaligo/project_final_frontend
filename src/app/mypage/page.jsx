import PrivateLayout from "@/components/layout/private/PrivateLayout";
import MyPageHome from "@/components/mypage/MyPageHome";

export default function MyPage() {
  return (
    <PrivateLayout>
      <MyPageHome />
    </PrivateLayout>
  );
}
