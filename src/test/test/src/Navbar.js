import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            <Link to="/">Home</Link>
            <Link to="/Labels">Labels</Link>
            <Link to="/RootV1">RootV1</Link>
            <Link to="/NamespaceTable">NamespaceTable</Link>
        </div>
    );
};