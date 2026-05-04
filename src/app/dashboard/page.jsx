import PrivateLayout from "@/components/layout/private/PrivateLayout";
import DashboardHome from "@/components/dashboard/DashboardHome";

export default function DashboardPage() {
    return (
        <PrivateLayout>
            <DashboardHome />
        </PrivateLayout>
    );
}
