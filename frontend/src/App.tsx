import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  SigninPage,
  SignupPage,
  BlogPage,
  BlogsPage,
  PublishPage,
  ProfilePage,
  BookMarkPage,
  RootPage,
  ProtectedRoute,
  ViewBlogPage,
} from "./pages/Index";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <BlogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <ProtectedRoute>
              <BlogsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/publish"
          element={
            <ProtectedRoute>
              <PublishPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmark"
          element={
            <ProtectedRoute>
              <BookMarkPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/viewblog"
          element={
            <ProtectedRoute>
              <ViewBlogPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
