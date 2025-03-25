import {
  IDocumentData,
  IDocumentFormData,
} from "@/interfaces/document.interface";
import { createDocument, updateDocument } from "../store/dataSlice";
import { Box, Button, CircularProgress, Modal, TextField } from "@mui/material";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

interface EditModalProps {
  document?: IDocumentData;
  isNew?: boolean;
}

export const EditModal: FC<EditModalProps> = ({ document, isNew = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<IDocumentFormData>({
    companySigDate: new Date().toISOString(),
    companySignatureName: "",
    documentName: "",
    documentStatus: "",
    documentType: "",
    employeeNumber: "",
    employeeSigDate: new Date().toISOString(),
    employeeSignatureName: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (document) {
      setFormData(document);
    }
  }, [document]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isNew) {
        await dispatch(createDocument(formData)).unwrap();
      } else if (document?.id) {
        await dispatch(
          updateDocument({ id: document.id, data: formData })
        ).unwrap();
      }
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        {isNew ? "Add New" : "Edit"}
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            minWidth: 400,
          }}
        >
          <TextField
            label="Document Name"
            name="documentName"
            value={formData.documentName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Status"
            name="documentStatus"
            value={formData.documentStatus}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Type"
            name="documentType"
            value={formData.documentType}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Employee Number"
            name="employeeNumber"
            value={formData.employeeNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Company Signature Name"
            name="companySignatureName"
            value={formData.companySignatureName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Employee Signature Name"
            name="employeeSignatureName"
            value={formData.employeeSignatureName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{ mt: 2 }}
          >
            {isNew ? "Create" : "Update"}
          </Button>
        </Box>
      </Modal>
    </>
  );
};
