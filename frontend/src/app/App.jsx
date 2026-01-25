import { BrowserRouter } from "react-router-dom";
import RoutesConfig from "./routes";
import Navbar from "../shared/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <RoutesConfig />
    </BrowserRouter>
  );
}
