import { DashboardLayout } from "@/components";
// import { getUserCookieData } from "../../hooks/getCookies";
import AddProductForm from "@/components/AddProduct/Addproduct";

const AddProduct = async () => {

    return (
        <DashboardLayout >
            <AddProductForm />
        </DashboardLayout>
    )
}

export default AddProduct;