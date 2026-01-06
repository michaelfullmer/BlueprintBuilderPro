import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '../Layout';
import Home from '../Pages/Home';
import Projects from '../Pages/Projects';
import NewProject from '../Pages/NewProject';
import ProjectDetail from '../Pages/ProjectDetail';

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
            path="/new"
            element={
              <WithLayout name="NewProject">
                <NewProject />
              </WithLayout>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <WithLayout name="ProjectDetail">
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
