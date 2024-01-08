import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import IndicatorsList from "pages/TechnicalAnalysisPage/utils/IndicatorsList";
import { useTechnicalAnalysis } from "contexts/TechnicalAnalysisContext";
import { useStocksData } from "contexts/StocksDataContext";

const IndicatorSettingsModal = ({
  indicatorName,
  showModal,
  handleClose,
  indicator,
  settings,
}) => {
  const { selectedStock, selectedIndicators, setSelectedIndicators } =
    useTechnicalAnalysis();
  const { getIndicatorData } = useStocksData();

  const [updatedSettings, setUpdatedSettings] = useState({});
  const [paneValue, setPaneValue] = useState(indicator.pane);

  useEffect(() => {
    setPaneValue(indicator.pane);
  }, [indicator]);

  const handleChange = (key, value) => {
    if (key === "pane") {
      setPaneValue(value);
    } else {
      setUpdatedSettings({
        ...updatedSettings,
        [key]: value,
      });
    }
  };

  const handleSaveChanges = async () => {
    const updatedIndicators = selectedIndicators.map((ind) => {
      if (ind.name === indicatorName) {
        const updatedParams = {
          ...ind.params,
          kwargs: {
            ...ind.params.kwargs,
            ...updatedSettings,
          },
        };
        return {
          ...ind,
          params: updatedParams,
          pane: paneValue, // Update the 'pane' value
        };
      }
      return ind;
    });

    setSelectedIndicators(updatedIndicators);
    handleClose();
  };

  const renderSettingsInputs = () => {
    const indicator = selectedIndicators.find(
      (ind) => ind.name === indicatorName
    );

    if (!indicator) {
      return <div>No settings found for this indicator.</div>;
    }

    const kwargs = indicator.params.kwargs;
    const inputs = Object.entries(kwargs).map(([key, value]) => (
      <Form.Group key={key} controlId={`form${key}`}>
        <Form.Label>{key}</Form.Label>
        <Form.Control
          type="text"
          placeholder={`Enter ${key}`}
          defaultValue={value}
          onChange={(e) => handleChange(key, parseInt(e.target.value, 10))}
        />
      </Form.Group>
    ));

    // Include input for 'pane' value
    inputs.push(
      <Form.Group key="pane" controlId="formPane">
        <Form.Label>Pane</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter pane"
          defaultValue={paneValue}
          onChange={(e) => handleChange("pane", parseInt(e.target.value, 10))}
        />
      </Form.Group>
    );

    return <Form>{inputs}</Form>;
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{IndicatorsList[indicatorName]?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{renderSettingsInputs()}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default IndicatorSettingsModal;
