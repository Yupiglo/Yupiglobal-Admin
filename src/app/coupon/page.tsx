import { DashboardLayout } from "@/components";
import { getUserCookieData } from "../../hooks/getCookies";
import Coupon from "@/components/Coupon/Coupon";

const CouponDetail = async () => {

    const { token, email, username } = await getUserCookieData()
    return (
        <DashboardLayout >
            <Coupon />
        </DashboardLayout>
    )
}

export default CouponDetail;