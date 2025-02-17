import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVert from "@mui/icons-material/MoreVert";

interface MenuItemProps {
  label: string;
  onClick: () => void;
}

interface MoreVertMenuProps {
  menuItems: MenuItemProps[];
}

const MoreVertMenu: React.FC<MoreVertMenuProps> = ({ menuItems }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
      >
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={openMenu} onClose={handleMenuClose}>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              item.onClick();
              handleMenuClose(); // Close the menu after selecting an option
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MoreVertMenu;
