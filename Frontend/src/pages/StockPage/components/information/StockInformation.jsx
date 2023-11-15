import React from "react";
import { motion } from "framer-motion";
import { Col, Container, Row, Table } from "react-bootstrap";
import { BsArrowDown } from "react-icons/bs";
import { CustomCard } from "components/utils/CustomCard";
import { useOutletContext, useParams } from "react-router-dom";
import StockChart from "../chart/StockChart";
import SelectionTitle from "components/utils/SelectionTitle";

const StockInformation = () => {
  const { stockInformationData } = useOutletContext();

  return (
    <>
      {stockInformationData ? (
        <CustomCard className={"gap-4"} header={"معلومات السهم"}>
          <Container className="">
            <Row>
              <Col xs={6}>
                <Table className="" responsive>
                  <tbody>
                    <tr>
                      <th>القيمة السوقية</th>
                      <th>
                        {
                          stockInformationData.summary[0]
                            .daily_price_to_earnings
                        }
                      </th>
                    </tr>
                    <tr>
                      <th>ربحية السهم EPS</th>
                      <th>
                        {
                          stockInformationData.summary[0]
                            .basic_earnings_per_share_ttm
                        }
                      </th>
                    </tr>
                    <tr>
                      <th>مكرر الربحية</th>
                      <th>
                        {
                          stockInformationData.summary[0]
                            .daily_price_to_earnings
                        }
                      </th>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col xs={6}>
                <Table className="" responsive>
                  <tbody>
                    <tr>
                      <th>مضاعف القيمة الدفترية</th>
                      <th>
                        {
                          stockInformationData.summary[0]
                            .basic_earnings_per_share_ttm
                        }
                      </th>
                    </tr>
                    <tr>
                      <th>القيمة الدفترية</th>
                      <th>
                        {
                          stockInformationData.summary[0]
                            .book_value_per_share_ttm
                        }
                      </th>
                    </tr>
                    <tr>
                      <th> رأس المال المصرّح</th>
                      <th>
                        {stockInformationData.capital?.[0]?.newCApital ?? "N/A"}
                      </th>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        </CustomCard>
      ) : (
        <p>loading</p>
      )}
    </>
  );
};

export default StockInformation;
