import { Route, Routes } from "react-router-dom"
import Home from "../pages/home"
import Blog from "../pages/blog"
import Projects from "../pages/projects"
import BlogControlDashboard from "../pages/blogcontroldashboard"
import NotFound from "../pages/notfound"

export default function AppRoutes() {
    return (
        <div>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog-control" element={<BlogControlDashboard />} />
            <Route path="/blogcontroldashboard" element={<BlogControlDashboard />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
    )
}

