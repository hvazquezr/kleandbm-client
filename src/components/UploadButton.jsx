import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function UploadButton() {
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<CloudUploadIcon />}
    >
      Upload
    </Button>
  );
}