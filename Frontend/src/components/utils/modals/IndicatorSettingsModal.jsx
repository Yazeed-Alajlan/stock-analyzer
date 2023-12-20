import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import IndicatorsList from "pages/TechnicalAnalysisPage/IndicatorsList";
import { useTechnicalAnalysis } from "contexts/TechnicalAnalysisContext";
import { useStocksData } from "contexts/StocksDataContext";

const IndicatorSettingsModal = ({ indicatorName, showModal, handleClose }) => {
  const { selectedStock, selectedIndicators, setSelectedIndicators } =
    useTechnicalAnalysis();
  const { getIndicatorData } = useStocksData();

  const [updatedSettings, setUpdatedSettings] = useState({}); // State to hold updated settings

  const handleChange = (key, value) => {
    setUpdatedSettings({
      ...updatedSettings,
      [key]: value,
    });
  };

  const handleSaveChanges = async () => {
    const updatedIndicators = await Promise.all(
      selectedIndicators.map(async (indicator) => {
        const { name } = indicator;
        console.log(indicator);
        // Update params if the name matches indicatorName
        let updatedParams = indicator.params;
        if (name === indicatorName) {
          updatedParams = {
            ...indicator.params,
            kwargs: {
              ...indicator.params.kwargs,
              ...updatedSettings, // Apply updated settings
            },
          };

          // Fetch updated value based on indicatorName
          const updatedValue = await getIndicatorData(
            selectedStock,
            indicatorName,
            {
              [indicatorName]: updatedParams,
            }
          );
          return {
            ...indicator,
            params: updatedParams,
            lines: [
              {
                [indicatorName]: updatedValue,
              },
            ],
          };
        } else return indicator;
      })
    );

    console.log(updatedIndicators);
    setSelectedIndicators(updatedIndicators);
    handleClose();
  };

  const renderSettingsInputs = () => {
    const indicator = selectedIndicators.find(
      (indicator) => indicator.name === indicatorName
    ).params;
    console.log(IndicatorsList[indicatorName]);
    console.log(selectedIndicators);

    if (!indicator) {
      return <div>No settings found for this indicator.</div>;
    }

    const { kwargs } = indicator;
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
