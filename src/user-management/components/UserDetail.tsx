import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { API } from "../api";

export const UserDetail = () => {
  const { id } = useParams();

  const { data: user, isLoading, isFetching } = useQuery({
    queryKey: ["users", id], // Unique key for this specific user
    queryFn: () => API.getUser(id!),
    staleTime: 1000 * 60, // 1 minute
  });

  if (isLoading) return <div>Loading user profile...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/">← Back to Table</Link>
      <hr />
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <img src={user.image} alt={user.firstName} style={{ borderRadius: '50%' }} />
        <h1>{user.firstName} {user.lastName}</h1>
        {/* Blue dot shows background revalidation (SWR) */}
        {isFetching && <span title="Revalidating...">🔄</span>}
      </div>
      <p>Email: {user.email}</p>
      <p>Company: {user.company.name}</p>
      <p>Address: {user.address.address}, {user.address.city}</p>
    </div>
  );
};