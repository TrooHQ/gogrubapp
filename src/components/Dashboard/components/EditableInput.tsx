import React from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

interface EditableInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  isEditing: boolean;
  onEditClick: () => void;
}

const EditableInput: React.FC<EditableInputProps> = ({
  value,
  onChange,
  label,
  isEditing,
  onEditClick,
}) => {
  return (
    <div className="flex items-center gap-2">
      <TextField
        fullWidth
        value={value}
        onChange={onChange}
        disabled={!isEditing}
        variant="outlined"
        label={label}
      />
      <IconButton onClick={onEditClick}>{isEditing ? <SaveIcon /> : <EditIcon />}</IconButton>
    </div>
  );
};

export default EditableInput;
