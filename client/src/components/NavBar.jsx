import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
const NavBar = () => {
  return (
    <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
      <Container>
        <h2>
          <Link to="/" className="link-light text-decoration-none">
            CHATT-APP
          </Link>
        </h2>
        <span className="text-warning">Logged In as Niv</span>
        <Nav>
          <Stack direction="horizontal" gap={3}>
            <Link to="/login" className="link-light text-decoration-none">
              Login
            </Link>
            <Link to="/register" className="link-light text-decoration-none">
              Register
            </Link>
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
