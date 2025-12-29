"use client";

import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '../../components/Dashboard/dashboardLayout';
import DashboardView from "../../components/Dashboard/DashboardView";

/**  Container function to render the Dashboard View
 * and separate the view logic from the route handler.
 */
interface DashboardMainProps {
    // token: string;
    // username?: string;
    // email: string;
}

const DashboardMain: React.FC<DashboardMainProps> = () => {
    const { user } = useAuth();
    // const token = user.token;
    // const email = user.email;
    const username = user.username;
    return (
        <DashboardLayout>
            <DashboardView username={username ?? ""} />
        </DashboardLayout>
    );
};
export default DashboardMain;