import { DashboardLayout } from "@/components";
import BlogListPage from "@/components/BlogForm/BlogList";
const Blogs = async () => {

    // const {token, email, username} = await getUserCookieData()
    return (
        <DashboardLayout>
            <BlogListPage />
        </DashboardLayout>
    )
}

export default Blogs;