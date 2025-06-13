import * as React from "react";
import {
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
import Logo from "@/components/logo/logo";

const data = {
  navMain: [
    {
      title: "Tableau de bord",
      url: "#",
      icon: <FileText className="h-5 w-5" />,
      items: [
        { title: "Aperçu", url: "/oniichan", isActive: true },
        { title: "Analytique", url: "/oniichan/home/analytics" },
      ],
    },
    {
      title: "Gestion de la boutique",
      url: "#",
      icon: <ShoppingCart className="h-5 w-5" />,
      items: [
        { title: "Produits", url: "/oniichan/shop/product" },
        { title: "Catégories", url: "/oniichan/shop/categories" },
        { title: "Ajouter des produits", url: "/oniichan/shop/add-product" },
      ],
    },
    {
      title: "Commandes",
      url: "#",
      icon: <ShoppingCart className="h-5 w-5" />,
      items: [
        { title: "Liste des commandes", url: "#" },
        { title: "Statut des commandes", url: "#" },
      ],
    },
    {
      title: "Gestion des utilisateurs",
      url: "#",
      icon: <User className="h-5 w-5" />,
      items: [
        { title: "Liste des utilisateurs", url: "#" },
        // { title: "Rôles & Permissions", url: "#" },
        // { title: "Support client", url: "#" },
      ],
    },
    {
      title: "Paramètres",
      url: "#",
      icon: <Settings className="h-5 w-5" />,
      items: [
        { title: "Profil", url: "/oniichan/profil" },
        { title: "Déconnexion", url: "#" },
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
                  <Logo />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="Sprite_Graffiti text-xl font-semibold">
                    Feudjeu Corp
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

export const navMain = data.navMain;