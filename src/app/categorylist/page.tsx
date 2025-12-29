import { DashboardLayout } from "@/components";
import CategoryList from "@/components/Categories/CategoriesList";

const Categories = async () => {

    return (
        <DashboardLayout >
            <CategoryList />
        </DashboardLayout>
    )
}

export default Categories;