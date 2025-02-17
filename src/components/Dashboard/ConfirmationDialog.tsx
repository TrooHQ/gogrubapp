import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: any;
  onConfirm: any;
  message: string;
  isLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  message,
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="flex flex-col justify-center items-center gap-6">
        <DialogTitle>
          <p className="text-[24px] font-[500] text-purple500">Are You Sure?</p>
        </DialogTitle>
        <DialogContent>
          <p className="text-[16px] font-[400] text-center text-grey500">{message}</p>
        </DialogContent>
        <DialogActions className="flex items-center justify-center gap-4 mt-0 !pb-[32px]">
          <button
            onClick={onClose}
            className="border cursor-pointer border-purple500 rounded px-[24px] py-[10px] font-[600] text-purple500"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="border border-purple500 bg-purple500 rounded px-[24px] py-[10px] font-[500] text-[#ffffff]"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Yes"}
          </button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default ConfirmationDialog;
