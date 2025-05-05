import * as React from "react";
import {
  GalleryVerticalEnd,
  ShoppingCart,
  FileText,
  User,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: <FileText className="h-5 w-5" />,
      items: [
        { title: "Overview", url: "/oniichan", isActive: true },
        { title: "Analytics", url: "/oniichan/home/analytics" },
      ],
    },
    {
      title: "Shop Management",
      url: "#",
      icon: <ShoppingCart className="h-5 w-5" />,
      items: [
        { title: "Products", url: "#" },
        { title: "Categories", url: "#" },
        { title: "Discounts & Offers", url: "#" },
      ],
    },
    {
      title: "Orders",
      url: "#",
      icon: <ShoppingCart className="h-5 w-5" />,
      items: [
        { title: "Order List", url: "#" },
        { title: "Order Status", url: "#" },
        { title: "Returns & Refunds", url: "#" },
      ],
    },
    {
      title: "User Management",
      url: "#",
      icon: <User className="h-5 w-5" />,
      items: [
        { title: "User List", url: "#" },
        { title: "Roles & Permissions", url: "#" },
        { title: "Customer Support", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings className="h-5 w-5" />,
      items: [
        { title: "Profile", url: "#" },
        { title: "Logout", url: "#" },
        { title: "Shipping Settings", url: "#" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="Sprite_Graffiti text-xl font-semibold">
                    A&apos;SPACE
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible key={item.title} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className="font-medium flex items-center gap-2 justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-primary"> {item.icon}</span>

                          {item.title}
                        </div>
                        <div className="transition-transform">
                          <ChevronRight className="size-4 group-data-[state=open]/collapsible:hidden" />
                          <ChevronDown className="size-4 hidden group-data-[state=open]/collapsible:block" />
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {item.items?.length ? (
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={subItem.isActive || false}
                            >
                              <Link href={subItem.url}>{subItem.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    ) : null}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
