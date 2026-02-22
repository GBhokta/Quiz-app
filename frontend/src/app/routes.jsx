import { Routes, Route } from "react-router-dom";

/* Public pages */
import Home from "../pages/Home";
import Login from "../auth/Login";
import Register from "../auth/Register";

/* Student access & session */
import TestAccessPage from "../testAccess/TestAccessPage";
import TestSessionPage from "../testSession/TestSessionPage";

/* Results */
import ResultPage from "../results/ResultPage";
import MyResults from "../results/MyResults";

/* Auth guard */
import ProtectedRoute from "./ProtectedRoute";

/* Test Creator */
import TestList from "../testCreator/TestList";
import CreateTest from "../testCreator/CreateTest";
import EditTest from "../testCreator/EditTest";

import TestPage  from "../test/TestPage";

import Dashboard from "../pages/Dashboard";

import AllQuestionsPage from "../pages/AllQuestionsPage.jsx";


export default function RoutesConfig() {
  return (
    <Routes>
      {/* ---------- Public ---------- */}
      <Route path="/testpage" element={<TestPage />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/access" element={<TestAccessPage />} />

      {/* ---------- Test Session ---------- */}
      <Route path="/session/start" element={<TestSessionPage />} />
    <Route path="/results/:resultId" element={<ResultPage />} />

      {/* ---------- Test Creator ---------- */}
      <Route
        path="/tests/my"
        element={
          <ProtectedRoute requireRole="TEST_MAKER">
            <TestList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/create"
        element={
          <ProtectedRoute requireRole="TEST_MAKER">
            <CreateTest />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/:testId/edit"
        element={
          <ProtectedRoute requireRole="TEST_MAKER">
            <EditTest />
          </ProtectedRoute>
        }
      />

      {/* ---------- Student ---------- */}
      <Route
        path="/results/my"
        element={
          <ProtectedRoute>
            <MyResults />
          </ProtectedRoute>
        }
      />


      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }/>
            <Route 
      path="/questions/all"
      element={
        <ProtectedRoute>
          <AllQuestionsPage />
        </ProtectedRoute>
      }/>
    </Routes>

  );
}
