import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
} from "react-router-dom";

import { PublicLayout } from "./layouts/PublicLayout";
import { ProtectedLayout } from "./layouts/ProtectedLayout";

// Lazy load components
const Login = lazy(() => import("./features/auth/Login").then(m => ({ default: m.Login })));
const Signup = lazy(() => import("./features/auth/Signup").then(m => ({ default: m.Signup })));
const ChatWindow = lazy(() => import("./features/chat/ChatWindow").then(m => ({ default: m.ChatWindow })));
const LandingPage = lazy(() => import("./features/landing/LandingPage").then(m => ({ default: m.LandingPage })));

// Loading component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#020617',
    color: '#6366f1'
  }}>
    Loading...
  </div>
);

const withSuspense = (Component: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>
    {Component}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/login",
        element: withSuspense(<Login />),
      },
      {
        path: "/signup",
        element: withSuspense(<Signup />),
      },
      {
        path: "/",
        element: withSuspense(<LandingPage />),
      },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/chat",
        element: withSuspense(<ChatWindow />),
      },
    ],
  },
  {
    path: "*",
    element: withSuspense(<Login />),
  },
]);
