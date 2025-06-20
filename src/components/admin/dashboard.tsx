import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { getBreadCrumbFromPath } from "@/lib/utils/get-breadcrumb";
import Link from "next/link";

// Inside your Dashboard component:
export default function Dashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const breadcrumb = getBreadCrumbFromPath(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="text-primary" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">{breadcrumb[0]}</BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumb[1] && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{breadcrumb[1]}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
            <div className="flex items-center gap-2">
              <UserCircle className="h-6 w-6 text-gray-600" />
              <span className="hidden md:block font-medium">John Doe</span>
            </div> */}
            <Link href={"/shop"}>
              <Button variant="default" className="text-white">
                Go to Shop
              </Button>
            </Link>
          </div>
        </header>

        <main className="p-4 flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}