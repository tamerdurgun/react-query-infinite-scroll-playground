import { DummyJSONUserResponse, User } from "./types";

const baseURL = "https://dummyjson.com";

const ENDPOINTS = {
  getUsers: "/users",
  editUser: "/users/",
};

export const API = {
  getUsers: async ({
    limit = 10,
    skip = 0,
  }: {
    limit?: number;
    skip?: number;
  }): Promise<DummyJSONUserResponse> => {
    const params = new URLSearchParams({
      limit: String(limit),
      skip: String(skip),
    });

    const response = await fetch(
      `${baseURL}${ENDPOINTS.getUsers}?${params.toString()}`
    );

    return response.json();
  },
  getUser: async (id: string | number): Promise<User> => {
    const response = await fetch(`https://dummyjson.com/users/${id}`);
    if (!response.ok) throw new Error("User not found");
    return response.json();
  },
  editUser: async (user: User): Promise<User> => {
    const request = await fetch(baseURL + ENDPOINTS.editUser + user.id, {
      method: "PUT" /* or PATCH */,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    return request.json();
  },
};
