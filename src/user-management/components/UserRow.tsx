import { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../types";

type Props = {
  user: User;
  selectedUser?: User | null | undefined;
  isEditing: boolean;
  onSelect: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: User["id"]) => void;
};

export const UserRow = ({
  user,
  selectedUser,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
}: Props) => {
  const [draft, setDraft] = useState(user);

  // If we aren't editing, just show text. If we are, show inputs.
  if (!isEditing) {
    return (
      <tr>
        <td>
          <input
            type="checkbox"
            name="selectUser"
            checked={selectedUser?.id === user.id}
            onChange={() => onSelect(user)}
          />
        </td>
        <td><Link 
            to={`/user/${user.id}`} 
            style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}
          >
            {user.firstName}
          </Link></td>
        <td>{user.lastName}</td>
        <td>{user.email}</td>
        <td>{user.phone}</td>
        <td></td>
      </tr>
    );
  }

  return (
    <tr className="editing-row">
      <td>
        <input
          type="checkbox"
          name="selectUser"
          checked={selectedUser?.id === user.id}
          onChange={() => onSelect(user)}
        />
      </td>

      <td>
        <input
          value={draft.firstName}
          onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
          disabled={selectedUser?.id !== user.id}
        />
      </td>

      <td>
        <input
          value={draft.lastName}
          onChange={(e) => setDraft({ ...draft, lastName: e.target.value })}
          disabled={selectedUser?.id !== user.id}
        />
      </td>
      <td>
        <input
          value={draft.email}
          onChange={(e) => setDraft({ ...draft, email: e.target.value })}
          disabled={selectedUser?.id !== user.id}
        />
      </td>
      <td>
        <input
          value={draft.phone}
          onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
          disabled={selectedUser?.id !== user.id}
        />
      </td>
      <td>
        {selectedUser?.id === user.id && <button onClick={() => onEdit(draft)}>Save</button>}
        {selectedUser?.id === user.id && <button onClick={() => onDelete(user.id)}>Delete</button>} 
      </td>
    </tr>
  );
};
