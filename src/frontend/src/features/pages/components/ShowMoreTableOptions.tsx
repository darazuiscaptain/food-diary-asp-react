import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ShowMoreIcon from '@mui/icons-material/MoreVert';
import { Divider, IconButton, Menu } from '@mui/material';
import { useState, type FC, type MouseEvent } from 'react';
import { DEMO_MODE_ENABLED } from '@/shared/config';
import ExportPagesMenuItem from './ExportPagesMenuItem';
import ImportPagesMenuItem from './ImportPagesMenuItem';

const ShowMoreTableOptions: FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpened = Boolean(anchorEl);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="large"
        id="show-more-button"
        aria-label="Show more options"
        aria-controls={isOpened ? 'show-more-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpened ? 'true' : undefined}
        onClick={handleMenuOpen}
      >
        <ShowMoreIcon />
      </IconButton>
      <Menu
        keepMounted
        id="show-more-menu"
        aria-labelledby="show-more-button"
        anchorEl={anchorEl}
        open={isOpened}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: '240px',
            maxWidth: '100%',
          },
        }}
      >
        <ImportPagesMenuItem isDisabled={DEMO_MODE_ENABLED} onMenuClose={handleMenuClose}>
          Import from JSON
        </ImportPagesMenuItem>
        <Divider />
        <ExportPagesMenuItem
          isDisabled={DEMO_MODE_ENABLED}
          format="json"
          icon={<DataObjectIcon />}
          onMenuClose={handleMenuClose}
        >
          Export to JSON
        </ExportPagesMenuItem>
        <ExportPagesMenuItem
          isDisabled={DEMO_MODE_ENABLED}
          format="google docs"
          icon={<AddToDriveIcon />}
          onMenuClose={handleMenuClose}
        >
          Export to Google Docs
        </ExportPagesMenuItem>
      </Menu>
    </>
  );
};

export default ShowMoreTableOptions;
