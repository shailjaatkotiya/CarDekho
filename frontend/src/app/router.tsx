import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "./App";

const HomePage = lazy(() => import("../pages/Home"));
const BrowsePage = lazy(() => import("../pages/Browse"));
const CarDetailPage = lazy(() => import("../pages/CarDetail"));
const ComparePage = lazy(() => import("../pages/Compare"));
const DiscoveryPage = lazy(() => import("../pages/Discovery"));
const LoginPage = lazy(() => import("../pages/Login"));
const ShortlistPage = lazy(() => import("../pages/Shortlist"));
const UsedCarsPage = lazy(() => import("../pages/UsedCars"));
const EVSectionPage = lazy(() => import("../pages/EVSection"));

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="app-container py-16">
    <div className="card-surface p-6">
      <h1 className="font-heading text-3xl">{title}</h1>
      <p className="mt-2 text-textSecondary">This module is included in the scalable architecture and can be expanded next.</p>
    </div>
  </div>
);

export const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<div className="app-container py-10">Loading...</div>}>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="browse" element={<BrowsePage />} />
          <Route path="cars/:id" element={<CarDetailPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="discovery" element={<DiscoveryPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="shortlist" element={<ShortlistPage />} />
          <Route path="used-cars" element={<UsedCarsPage />} />
          <Route path="ev" element={<EVSectionPage />} />
          <Route path="reviews" element={<PlaceholderPage title="Reviews & Expert Ratings" />} />
          <Route path="news" element={<PlaceholderPage title="Auto News" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);
