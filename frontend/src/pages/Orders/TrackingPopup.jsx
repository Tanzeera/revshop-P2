// import React from "react";
import { Button as BootstrapButton } from "react-bootstrap";
import { Check } from 'phosphor-react';
import { Steps, StepsItem, StepsPoint, StepsContent, StepsTitle, StepsDescription } from 'keep-react';
import './Tracking.css';

const TrackingPopup = ({ order, onClose }) => {
  const statuses = [
    "PENDING",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELED",
    "RETURNED",
    "REFUNDED",
  ];

  // Get index of current status for progress tracking
  const currentStatusIndex = statuses.indexOf(order.status);

  const data = statuses.map((status, index) => ({
    id: index + 1,
    title: status.replace("_", " "),
    description: `Your order is currently in the ${status.replace("_", " ")} stage.`,
    isComplete: index < currentStatusIndex, // Completed status
    isActive: index === currentStatusIndex, // Current active step
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-12 rounded-lg shadow-lg max-w-full w-full h-auto m-5">
        <h2 className="text-3xl font-semibold mb-6">Order Tracking</h2>

        <Steps activeStep={currentStatusIndex} className="steps-container">
          {data.map((step) => (
            <StepsItem key={step.id} className={`step-item ${step.isActive ? 'isActive' : ''}`}>
              <StepsPoint
                isComplete={step.isComplete}
                isActive={step.isActive}
                className="data-[completed=true]:bg-green-500 data-[completed=true]:text-white"
              >
                <Check />
              </StepsPoint>
              <StepsContent>
                <StepsTitle
                  className={`${step.isActive ? "text-green-700 animate-blink" : ""}`}
                >
                  {step.title}
                </StepsTitle>
                <StepsDescription>{step.description}</StepsDescription>
              </StepsContent>
            </StepsItem>
          ))}
        </Steps>

        <BootstrapButton
          variant="secondary"
          className="mt-8"
          onClick={onClose}
        >
          Close
        </BootstrapButton>
      </div>
    </div>
  );
};

export default TrackingPopup;




