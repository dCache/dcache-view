import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link to="/">🏠 Home</Link>
            <Link to="/Labels">🏷 Labels</Link>
            <Link to="/Login">🏷 Login</Link>

            <Link to="/LabelsV1">📑 LabelsV1</Link>
            <Link to="/RootV1">📂 RootV1</Link>
            <Link to="/NamespaceTable">📋 NamespaceTable</Link>
        </div>
    );
};