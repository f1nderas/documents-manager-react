import "./App.css";
import { Container, Typography } from "@mui/material";
import { DataTable } from "./components/DataTable";
import { AuthForm } from "./components/AuthForm";
import { useSelector } from "react-redux";
import { RootState } from "./store";

function App() {
  const { token } = useSelector((state: RootState) => state.auth);
  return (
    <>
      <Container>
        <Typography variant="h3" align="center" sx={{ my: 4 }}>
          Documents Manager
        </Typography>
        {token ? <DataTable /> : <AuthForm />}
      </Container>
    </>
  );
}

export default App;
