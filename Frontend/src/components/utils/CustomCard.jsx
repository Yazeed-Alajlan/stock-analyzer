import CompnentLayout from "components/CompnentLayout";
import { Card, Container } from "react-bootstrap";

export const CustomCard = ({ className, children, header, subHeader }) => {
  return (
    <CompnentLayout>
      <Card
        className={`bg-white border border-light shadow-sm rounded-4 w-100 my-2 ${className} `}
      >
        <Card.Body className="">
          <Container className="d-flex flex-column gap-2 p-0">
            {header != null || subHeader != null ? (
              <div>
                {header != null ? <div className="fs-2"> {header}</div> : null}
                {subHeader != null ? (
                  <div className="fs-5"> {subHeader}</div>
                ) : null}
              </div>
            ) : (
              <></>
            )}

            {children}
          </Container>
        </Card.Body>
      </Card>
    </CompnentLayout>
  );
};
