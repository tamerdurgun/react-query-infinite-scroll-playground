import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserDetail } from "./components/UserDetail";

import { UserManagementTable } from "./components/UserManagementTable";

const queryClient = new QueryClient();

export const UserManagement = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserManagementTable />} />
          <Route path="/user/:id" element={<UserDetail />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
