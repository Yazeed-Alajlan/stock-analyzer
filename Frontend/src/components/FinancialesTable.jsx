import { motion } from "framer-motion";
import { Tab, Tabs } from "react-bootstrap";
import { CustomCard } from "./utils/CustomCard";
import BalanceSheet from "./sheets/BalanceSheet";
import IncomeSheet from "./sheets/IncomeSheet";
import CashSheet from "./sheets/CashSheet";

const FinancialesTable = () => {
  return (
    <motion.div whileHover={{ scale: 1.03 }}>
      <CustomCard>
        <Tabs defaultActiveKey={"Balance Sheet"}>
          <Tab eventKey={"Balance Sheet"} title="Balance Sheet">
            <BalanceSheet />
          </Tab>
          <Tab eventKey={"Statment of Income"} title="Statment of Income">
            <IncomeSheet />
          </Tab>
          <Tab eventKey={"Cash Flow"} title="Cash Flow">
            <CashSheet />
          </Tab>
        </Tabs>
      </CustomCard>
    </motion.div>
  );
};

export default FinancialesTable;
