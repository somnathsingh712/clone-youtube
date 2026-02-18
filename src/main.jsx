import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import WatchPage from "./components/WatchPage";
import Layout from "./components/Layout";
import SearchFeed from "./components/SearchFeed";
import Explore from "./components/Explore";
import Subscriptions from "./components/Subscriptions";
import Library from "./components/Library";
import History from "./components/History";
import Shorts from "./components/Shorts";
import ShortsWatch from "./components/ShortsWatch";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/watch/:id" element={<WatchPage />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/shorts/:id" element={<ShortsWatch />} />
        <Route path="/search/:searchTerm" element={<SearchFeed />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/library" element={<Library />} />
        <Route path="/history" element={<History />} />
        <Route path="/:section?" element={<App />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);