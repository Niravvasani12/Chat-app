import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const {
    registerInfo,
    updateRegisterInfo,
    registerUser,
    registerError,
    isRegisterLoading,
  } = useContext(AuthContext);

  return (
    <Form onSubmit={registerUser}>
      <Row
        style={{
          height: "100vh",
          justifyContent: "center",
          paddingTop: "10%",
        }}
      >
        <Col xs={5}>
          <Stack gap={3}>
            <h3>Register</h3>

            <Form.Control
              type="text"
              placeholder="Name"
              value={registerInfo.name}
              onChange={(e) =>
                updateRegisterInfo({
                  ...registerInfo,
                  name: e.target.value,
                })
              }
            />

            <Form.Control
              type="email"
              placeholder="Email"
              value={registerInfo.email}
              onChange={(e) =>
                updateRegisterInfo({
                  ...registerInfo,
                  email: e.target.value,
                })
              }
            />

            <Form.Control
              type="password"
              placeholder="Password"
              value={registerInfo.password}
              onChange={(e) =>
                updateRegisterInfo({
                  ...registerInfo,
                  password: e.target.value,
                })
              }
            />

            <Button
              variant="primary"
              type="submit"
              disabled={isRegisterLoading}
            >
              {isRegisterLoading ? "Creating Your Account..." : "Register"}
            </Button>

            {registerError?.error && (
              <Alert variant="danger">{registerError?.message}</Alert>
            )}
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default Register;
