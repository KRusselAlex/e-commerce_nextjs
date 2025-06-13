import { navMain } from "@/components/admin/sidebar/app-sidebar";

export function getBreadCrumbFromPath(pathname: string) {
    for (const mainItem of navMain) {
        if (mainItem.url === pathname) {
            return [mainItem.title];
        }

        if (mainItem.items) {
            for (const subItem of mainItem.items) {
                if (subItem.url === pathname) {
                    return [mainItem.title, subItem.title];
                }
            }
        }
    }

    return ["Dashboard", "Not Found"];
}