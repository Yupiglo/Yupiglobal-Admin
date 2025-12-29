
import { Privilege, SubMenu } from "@/types/types";

const access = {
      "canRead": true,
      "canWrite": true,
      "canEdit": true,
      "canDelete":true,
      "canExport": true,
    };
  
    
  export function hasAccess(privileges: Privilege[] | Privilege, url: string): boolean {
    const trimmedUrl = url.trim();
  
    const checkAccessInSubMenus = (subs: SubMenu[]) => {
      return subs.some(sub => sub.url?.trim() === trimmedUrl && sub.privileges.includes('R'));
    };
  
    if (Array.isArray(privileges)) {
      return privileges.some(p => checkAccessInSubMenus(p.subMenus));
    } else if (privileges?.subMenus) {
        return checkAccessInSubMenus(privileges.subMenus);
      }
      
  
    return false;
  }


  export function checkPrivilege(privileges: any[], targetUrl: string): any {
    for (const menu of privileges) {
      for (const sub of menu.subMenus) {
        if (sub.url === targetUrl) {
            // Commenting out for now, default all access are enabled
          return {
            canRead: sub.privileges.includes("R"),
            canWrite: sub.privileges.includes("W") ,
            canEdit: sub.privileges.includes("M"),
            canDelete: sub.privileges.includes("D"),
            canExport: sub.privileges.includes("E"),
          };
        // return access
        }
      }
    }
    return access;
  }
  
  
