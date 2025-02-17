interface MenuItem {
  subTitle?: string;
  title?: string;
  gap?: boolean;
  Subgap?: boolean;
  icon?: string;
  subMenu?: MenuItem[];
  link?: string;
}

interface PermissionToMenuItem {
  [key: string]: string;
}

const permissionToMenuItem: PermissionToMenuItem = {
  // Define your permission to menu item mapping here
  // Example:
  "Accept or Decline Incoming Tickets on Waiter App": "Tickets",
  "Change Order Status on Waiter App": "Tickets",
  "Hold Orders on Till": "Overview",
  "Work on Open Tickets on Till": "Tickets",
  "View Open and Closed Tickets": "Tickets",
  "Void Order for Open and Closed Tickets": "Tickets",
  "Request Refund for Open and Closed Tickets": "Tickets",
  "Vacate Table on Closed Tickets": "Tickets",
  "Collect Tips on Waiter App": "Payment",
  "View Earnings from Tips": "Accounting",
  "Add Menus to Till": "Menu",
  "Add Modifiers to Till": "Menu",
  "Create Menus": "Menu",
  "View All Menus": "Menu",
  "Freeze/ Unfreeze Menu List": "Menu",
  "Edit Menus": "Menu",
  "Create Branches": "Restaurant Details",
  "Update Branches": "Restaurant Details",
  "Delete Branches": "Restaurant Details",
  "Create QR Codes for Rooms": "Manage Assets",
  "Create QR Codes for Tables": "Manage Assets",
  "Generate Online Ordering Link": "Manage Assets",
  "Generate Self Checkout Link": "Manage Assets",
  "View Business Report": "Overview",
  "Download Business Report": "Overview",
};

const getPermittedMenuItems = (menuItems: MenuItem[], permissions: string[]): MenuItem[] => {
  return menuItems.filter((menuItem) => {
    // If it's a top-level menu item with a title, check if permission exists
    if (menuItem.title) {
      const hasPermission = Object.keys(permissionToMenuItem).some(
        (permission) =>
          permissions.includes(permission) && permissionToMenuItem[permission] === menuItem.title
      );
      if (hasPermission) return true;
    }
    // Check submenus if they exist
    if (menuItem.subMenu) {
      menuItem.subMenu = menuItem.subMenu.filter((subItem) =>
        Object.keys(permissionToMenuItem).some(
          (permission) =>
            permissions.includes(permission) && permissionToMenuItem[permission] === subItem.title
        )
      );
      // If subMenu has items left after filtering, include the parent
      return menuItem.subMenu.length > 0;
    }
    // Return true for other types of items, such as titles or subtitles without `title`
    return menuItem.title == null;
  });
};

export default getPermittedMenuItems;
