import { AppDispatch, RootState } from "@/store";
import { clearError, deleteDocument, fetchDocuments } from "../store/dataSlice";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditModal } from "./EditModal";
import { logout } from "../store/authSlice";

export const DataTable: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { documents, loading, error } = useSelector(
    (state: RootState) => state.data
  );
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchDocuments());
    }
  }, [dispatch, token]);

  const handleDelete = (id: string) => {
    dispatch(deleteDocument(id));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  }

  if (!documents || documents.length === 0) {
    return (
      <Paper sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: 2 }}>
        <Typography variant="h6" align="center">
          No documents available
        </Typography>
        <EditModal isNew={true} />
      </Paper>
    );
  }

  return (
    <Paper sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <EditModal isNew={true} />
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      {error && (
        <Alert
          severity="error"
          onClose={() => dispatch(clearError())}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Document Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Employee Number</TableCell>
              <TableCell>Company Sig. Date</TableCell>
              <TableCell>Employee Sig. Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.documentName}</TableCell>
                <TableCell>{doc.documentStatus}</TableCell>
                <TableCell>{doc.documentType}</TableCell>
                <TableCell>{doc.employeeNumber}</TableCell>
                <TableCell>
                  {new Date(doc.companySigDate).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(doc.employeeSigDate).toLocaleString()}
                </TableCell>
                <TableCell>
                  <EditModal document={doc} />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(doc.id!)}
                    disabled={loading}
                    sx={{ ml: 1 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
