import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

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