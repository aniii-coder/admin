import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
} from "lucide-react";

const sidebarConfig = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  // {
  //   title: "Blogs",
  //   href: "/admin/blogs",
  //   icon: FileText,
  // },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  // {
  //   title: "Settings",
  //   href: "/admin/settings",
  //   icon: Settings,
  // },
];

export default sidebarConfig;