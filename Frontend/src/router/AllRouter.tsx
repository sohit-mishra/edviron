import { Routes, Route } from "react-router-dom";

import Login from "@/pages/login";
import Signup from "@/pages/signup";
import ForgotPassword from "@/pages/forgotPassword";
import ResetPassword from "@/pages/resetPassword";
import Otp from "@/pages/otp";
import NotFoundPage from "@/pages/pageNotFound";
import PrivateRoute from "@/router/PrivateRoute";
import UnAuthorized from "@/pages/unauthorized";
import Layout from "@/layout/layout";
import SchoolAddAndUpdate from "@/pages/SchoolAddandUpdate";
import AllTeacher from "@/pages/Teacher/AllTeacher";
import AllStudent from "@/pages/Student/StudentList";
import PaymentStatus from "@/pages/PaymentStatus";
import AddTeacher from "@/pages/Teacher/AddTeacher";
import OneTeacher from "@/pages/Teacher/OneTeacher";
import UpdateTeacher from "@/pages/Teacher/UpdateTeacher";
import StudentAdd from "@/pages/Student/StudentAdd";
import OneStudent from "@/pages/Student/OneStudent";
import UpdateStudent from "@/pages/Student/UpdateStudent";
import CreateOrder from "@/pages/CreateOrder";
import PayNow from "@/pages/PayNow";
import PaymentCheckStatus from "@/pages/PaymentCheckStatus";
import RoleDashboard from "@/components/RoleDashboard";

export default function AllRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/resetpassword/:id" element={<ResetPassword />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/unauthorized" element={<UnAuthorized />} />

      <Route
        path="/"
        element={
          <PrivateRoute roles={["admin", "teacher", "student"]}>
            <Layout>
              <RoleDashboard />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/school"
        element={
          <PrivateRoute roles={["admin"]}>
            <Layout>
              <SchoolAddAndUpdate />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/teachers"
        element={
          <PrivateRoute roles={["admin"]}>
            <Layout>
              <AllTeacher />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/students"
        element={
          <PrivateRoute roles={["admin", "teacher"]}>
            <Layout>
              <AllStudent />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <PrivateRoute roles={["admin", "teacher"]}>
            <Layout>
              <PaymentStatus />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/teacher/add"
        element={
          <PrivateRoute roles={["admin"]}>
            <Layout>
              <AddTeacher />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/teacher/edit/:id"
        element={
          <PrivateRoute roles={["admin"]}>
            <Layout>
              <UpdateTeacher />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/payment_status/:id"
        element={
          <PrivateRoute roles={["admin","teacher", "student"]}>
            <Layout>
              <PaymentCheckStatus />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/teacher/:id"
        element={
          <PrivateRoute roles={["admin"]}>
            <Layout>
              <OneTeacher />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/student/add"
        element={
          <PrivateRoute roles={["admin", "teacher"]}>
            <Layout>
              <StudentAdd />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/student/:id"
        element={
          <PrivateRoute roles={["admin", "teacher"]}>
            <Layout>
              <OneStudent />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/createPayment"
        element={
          <PrivateRoute roles={["admin", "teacher"]}>
            <Layout>
              <CreateOrder />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/student/edit/:id"
        element={
          <PrivateRoute roles={["admin", "teacher"]}>
            <Layout>
              <UpdateStudent />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/paynow"
        element={
          <PrivateRoute roles={["admin", "teacher", "student"]}>
            <Layout>
              <PayNow />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
