import { DashboardLayout } from "@/components";
import Orders from "@/components/Orders/Orders";
const OrderDetail = async () => {
    return (
        <DashboardLayout>
            <Orders />
        </DashboardLayout>
    )
}

export default OrderDetail;