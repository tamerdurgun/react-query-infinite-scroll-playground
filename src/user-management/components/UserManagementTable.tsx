import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData, // Use type import for safety
} from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { API } from "../api";
import { DummyJSONUserResponse, User } from "../types";
import { UserRow } from "./UserRow";

export const UserManagementTable = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null | undefined>();

  const { ref, inView } = useInView({
    threshold: 0.1, // Trigger when the sentinel is 10% visible
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<
      DummyJSONUserResponse,
      Error,
      InfiniteData<DummyJSONUserResponse>,
      string[],
      number
    >({
      queryKey: ["users"],
      queryFn: ({ pageParam = 0 }) =>
        API.getUsers({ limit: 20, skip: pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const nextSkip = lastPage.skip + lastPage.limit;
        return nextSkip < lastPage.total ? nextSkip : undefined;
      },
    });

  // 2. Automatically trigger fetch when user scrolls to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Compatibility fix for flatMap: Using reduce instead to avoid environment errors
  const allUsers = useMemo(() => {
    if (!data) return [];
    return data.pages.reduce<User[]>(
      (acc, page) => [...acc, ...page.users],
      []
    );
  }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: (user: User) => API.editUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSelectedUser(null);
    },
  });

  const handleEdit = (updatedUser: User) => {
    mutate(updatedUser);
  };

  const handleDelete = (id: User["id"]) => {
    console.log("Delete User: ", id);
  };

  const handleSelect = (user: User) => {
    setSelectedUser(selectedUser?.id === user.id ? null : user);
  };

  return (
    <>
      <table border={1} style={{ width: "100%" }}>
        <thead>
          <tr>
            <td>Select to edit</td>
            <td>First Name</td>
            <td>Last Name</td>
            <td>Email</td>
            <td>Phone</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user: User) => (
            <UserRow
              key={user.id}
              user={user}
              isEditing={selectedUser?.id === user.id}
              selectedUser={selectedUser}
              onSelect={handleSelect}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>

      {/* 3. The Sentinel Div */}
      <div
        ref={ref}
        style={{
          padding: "20px",
          textAlign: "center",
          background: "#f9f9f9",
          marginTop: "10px",
        }}
      >
        {isFetchingNextPage ? (
          <span>🌀 Loading more users...</span>
        ) : hasNextPage ? (
          <span>Scroll down to load more</span>
        ) : (
          <span>✅ All users loaded</span>
        )}
      </div>
    </>
  );
};
