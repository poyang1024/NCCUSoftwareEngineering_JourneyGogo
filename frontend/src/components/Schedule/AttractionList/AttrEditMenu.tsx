import { Menu, MenuItem } from "@mui/material"

type AttrEditMenuProps = {
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  attrEditHandler: (status: boolean) => void;
}

const AttrEditMenu = ({ anchorEl, setAnchorEl, attrEditHandler }: AttrEditMenuProps) => {
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={() => { attrEditHandler}}>
        刪除
      </MenuItem>
    </Menu>
  )
}

export default AttrEditMenu