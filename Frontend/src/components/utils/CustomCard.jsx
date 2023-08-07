import { Card, Container } from "react-bootstrap";

export const CustomCard = ({ children }) => {
  return (
    <Card className="bg-white border-0 shadow-lg rounded-4 w-100 ">
      <Card.Body>
        <Container>{children}</Container>
      </Card.Body>
    </Card>
  );
};