// src/App.js

// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import LoginForm from "./components/LoginForm";
// import MultiStepForm from "./components/MultiStepForm";
// import { AuthProvider, AuthContext } from "./context/AuthContext";

// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public Route */}
//           <Route path="/login" element={<LoginForm />} />

//           {/* Protected Route */}
//           <Route
//             path="/form/*" // Using wildcard to handle nested routes if any
//             element={
//               <PrivateRoute>
//                 <MultiStepForm />
//               </PrivateRoute>
//             }
//           />

//           {/* Redirect any unknown routes to Login */}
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// // PrivateRoute component to protect routes
// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated } = React.useContext(AuthContext);
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// export default App;


// import Dashboard from "./components/Dashboard";

// function App() {
//   return (
//     <div className="App">
//       <Dashboard />
//     </div>
//   );
// }

// export default App;


// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import MultiStepForm from "./components/MultiStepForm";
import AdminDashboard from "./components/AdminDashboard"; // New Admin Dashboard
import { AuthProvider, AuthContext } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginForm />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute adminOnly={false}>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          /> 

          <Route
            path="/form/*"
            element={
              <PrivateRoute>
                <MultiStepForm />
              </PrivateRoute>
            }
          />

          {/* Redirect any unknown routes to Login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// PrivateRoute component to protect routes
const PrivateRoute = ({ children, adminOnly }) => {
  const { isAuthenticated, isAdmin } = React.useContext(AuthContext);
  if(!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if(adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default App;
