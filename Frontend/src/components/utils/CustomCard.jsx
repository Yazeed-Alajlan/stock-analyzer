import CompnentLayout from "components/CompnentLayout";
import { Card, Container } from "react-bootstrap";

export const CustomCard = ({ className, children, header, subHeader }) => {
  return (
    <CompnentLayout>
      <Card
        className={`CARD bg-white bg-dark border-0 shadow rounded-4 w-100 my-2 p-0 ${className}`}
      >
        <Card.Body className="CARD_BODY p-3">
          <Container className="CARD_BODY_CONTAINER d-flex flex-column gap-4 p-0">
            {header != null || subHeader != null ? (
              <div>
                {header != null ? (
                  <div className="text-primary fs-3"> {header}</div>
                ) : null}
                {subHeader != null ? (
                  <div className="fs-5"> {subHeader}</div>
                ) : null}
              </div>
            ) : (
              <></>
            )}
            <Container className="p-0">{children}</Container>
          </Container>
        </Card.Body>
      </Card>
    </CompnentLayout>
  );
};
