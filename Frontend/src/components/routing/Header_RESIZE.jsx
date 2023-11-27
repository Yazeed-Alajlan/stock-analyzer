import React, { useState, useEffect } from "react";
import { Container, Row, Navbar, Nav, Image } from "react-bootstrap";
import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import { useStocksData } from "../../contexts/StocksDataContext";
import logo from "../../assets/logo.png";

const MotionImage = motion(Image);

function Header({ sideBar, setSideBar }) {
  const { scrollY } = useViewportScroll();
  const controls = useAnimation();
  const [delta, setDelta] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigate = useNavigate();
  const { stocksData, selectedStock, setSelectedStock } = useStocksData();
  const location = useLocation();
  const [selectedLink, setSelectedLink] = useState("");

  const setSelectedLinkFromLocation = () => {
    const currentPath = location.pathname;
    setSelectedLink(currentPath);
  };

  useEffect(() => {
    setSelectedLinkFromLocation();
  }, [location]);

  const handleStockSelect = (selectedOption) => {
    if (selectedOption.value !== null) {
      setSelectedStock(selectedOption);
      navigate(
        `/companies/${selectedOption.sector}/${selectedOption.value}/information`
      );
    } else {
      setSelectedStock("");
    }
  };

  useEffect(() => {
    scrollY.onChange((val) => {
      const diff = Math.abs(val - lastScrollY);
      if (val >= lastScrollY) {
        setDelta((prevState) => (prevState >= 10 ? 10 : prevState + diff));
      } else {
        setDelta((prevState) => (prevState <= -10 ? -10 : prevState - diff));
      }

      if (delta >= 10 && val > 200) {
        controls.start("hidden");
      } else if (delta <= -10 || val < 200) {
        controls.start("visible");
      }
      setLastScrollY(val);
    });
  }, [scrollY, lastScrollY, controls, delta]);

  const containerVariants = {
    visible: { top: 0 },
    hidden: { top: -100 },
  };

  const containerHeight = scrollY.get() >= 100 ? "80px" : "120px";
  const imageSize = scrollY.get() >= 100 ? "30px" : "60px";

  const isLinkSelected = (link) => location.pathname === link;

  return (
    <motion.div
      animate={controls}
      variants={containerVariants}
      style={{ height: containerHeight }}
    >
      <Container
        fluid
        className="bg-light shadow position-fixed"
        style={{ height: containerHeight }}
      >
        <Row className="align-items-center w-100">
          <Navbar className="d-flex justify-content-between" expand="lg">
            <div className="d-flex justify-content-center align-items-center fs-2">
              <Navbar.Brand as={Link} to="/">
                <MotionImage
                  src={logo}
                  width="120"
                  height="100"
                  className="d-inline-block align-top logo-image"
                  alt="React Bootstrap logo"
                  style={{ height: imageSize, width: imageSize }}
                />
              </Navbar.Brand>
              <Nav>
                <Nav.Link
                  as={Link}
                  to="/home"
                  onClick={handleStockSelect}
                  className={isLinkSelected("/home") ? "selected-link" : ""}
                >
                  الرئيسية
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/companies/all"
                  onClick={handleStockSelect}
                  className={
                    isLinkSelected("/companies/all") ? "selected-link" : ""
                  }
                >
                  السوق
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/comparison"
                  onClick={handleStockSelect}
                  className={
                    isLinkSelected("/comparison") ? "selected-link" : ""
                  }
                >
                  قارن
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/technical-analysis"
                  onClick={handleStockSelect}
                  className={
                    isLinkSelected("/technical-analysis") ? "selected-link" : ""
                  }
                >
                  تحليل فني
                </Nav.Link>
                {/* Add other Nav.Links here */}
              </Nav>
            </div>

            <button
              onClick={() => {
                setSideBar(!sideBar);
              }}
            >
              SideBar
            </button>

            {stocksData && (
              <Select
                className="w-25"
                placeholder="البحث عن شركة"
                value={selectedStock}
                options={stocksData.map((stock) => ({
                  value: stock.symbol,
                  label: `${stock.tradingNameAr} (${stock.symbol})`,
                  sector: stock.sectorNameAr,
                }))}
                isSearchable
                onChange={handleStockSelect}
              />
            )}
          </Navbar>
        </Row>
      </Container>
    </motion.div>
  );
}

export default Header;
