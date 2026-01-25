import { Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import TestAccessPage from "../testAccess/TestAccessPage";
import TestSessionPage from "../testSession/TestSessionPage";

import ResultPage from "../results/ResultPage";

import ProtectedRoute from "./ProtectedRoute";
import TestList from "../testCreator/TestList";

import MyResults from "../results/MyResults";






export default function RoutesConfig() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/access" element={<TestAccessPage />} />
      <Route path="/session/start" element={<TestSessionPage />} />
      <Route path="/results/:sessionId" element={<ResultPage />} />
      <Route
        path="/tests/my"
        element={
            <ProtectedRoute>
            <TestList />
            </ProtectedRoute>
        }
        />
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
        <Route
            path="/results/my"
            element={
                <ProtectedRoute requireRole="STUDENT">
                <MyResults />
                </ProtectedRoute>
            }
            />

    </Routes>
  );
}
