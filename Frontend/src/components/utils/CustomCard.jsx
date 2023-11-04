import { Card, Container } from "react-bootstrap";

export const CustomCard = ({ children, header, subHeader }) => {
  return (
    <Card className="bg-white border-0 shadow rounded-4 w-100 my-2">
      <Card.Body>
        <Container className="p-0">
          <h1 className="">{header}</h1>
          <h2 className="">{subHeader}</h2>
          {children}
        </Container>
      </Card.Body>
    </Card>
  );
};
