import { jsx as _jsx } from "react/jsx-runtime";
import { UserList } from "@/components/user-list";
export default function UsersPage() {
    return (_jsx("div", { className: "space-y-6", children: _jsx(UserList, {}) }));
}
