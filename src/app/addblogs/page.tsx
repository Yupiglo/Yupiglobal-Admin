import { DashboardLayout } from "@/components";
import AddBlogPage from "@/components/BlogForm/BlogForm";
const Blogs = async () => {

    // const {token, email, username} = await getUserCookieData()
    return (
        <DashboardLayout>
            <AddBlogPage />
        </DashboardLayout>
    )
}

export default Blogs;