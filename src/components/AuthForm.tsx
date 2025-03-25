import { AppDispatch, RootState } from "@/store";
import { loginUser } from "../store/authSlice";
import { Alert, Box, Button, CircularProgress, TextField } from "@mui/material";
import { FC, FormEvent, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const AuthForm: FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      dispatch(loginUser({ username, password }));
    },
    [dispatch, username, password]
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: "auto", mt: 4 }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
        fullWidth
        disabled={loading}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        fullWidth
        disabled={loading}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} sx={{ mt: 2 }} />}
      >
        Login
      </Button>
    </Box>
  );
};
