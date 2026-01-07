import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Layout from '@/Layout';
import Home from '@/pages/Home';
import Projects from '@/pages/Projects';
import NewProject from '@/pages/NewProject';
import ProjectDetail from '@/pages/ProjectDetail';

const queryClient = new QueryClient();

function WithLayout({ name, children }) {
  return <Layout currentPageName={name}>{children}</Layout>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <WithLayout name="Home">
                <Home />
              </WithLayout>
            }
          />
          <Route
            path="/projects"
            element={
              <WithLayout name="Projects">
                <Projects />
              </WithLayout>
            }
          />
          <Route
            path="/new-project"
            element={
              <WithLayout name="New Project">
                <NewProject />
              </WithLayout>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <WithLayout name="Project Detail">
                <ProjectDetail />
              </WithLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);