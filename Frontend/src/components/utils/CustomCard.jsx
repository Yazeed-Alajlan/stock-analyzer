import { Card, Container } from "react-bootstrap";

export const CustomCard = ({ children }) => {
  return (
    <Card className="bg-light border-0 shadow rounded-4 w-100 mb-5">
      <Card.Body>
        <Container className="p-0">{children}</Container>
      </Card.Body>
    </Card>
  );
};
