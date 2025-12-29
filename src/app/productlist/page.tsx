import { DashboardLayout } from "@/components";
// import BrandForm from "@/components/Brand/Brand";
import ProductList from "@/components/ProductList/ProductList";

const ProductDetails = async () => {
    return (
        <DashboardLayout>
            <ProductList />
        </DashboardLayout>
    )
}

export default ProductDetails;