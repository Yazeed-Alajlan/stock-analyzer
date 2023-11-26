import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ResizableComponent = () => {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(200); // Initial width of the sidebar
  const maxWidth = 400; // Maximum width for the sidebar
  const minWidth = 100; // Minimum width for the sidebar
  const startX = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = sidebarWidth - (e.clientX - startX.current);
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
        startX.current = e.clientX;
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, sidebarWidth, maxWidth, minWidth]);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    startX.current = e.clientX;
    e.preventDefault(); // Prevent default behavior (text selection)
  };

  const sidebarStyle = {
    flex: `0 0 ${sidebarWidth}px`,
    maxWidth: `${maxWidth}px`,
    minWidth: `${minWidth}px`,
    backgroundColor: "#f0f0f0",
    borderLeft: "4px solid #ccc", // Change border to left for RTL support
    cursor: "col-resize",
    overflow: "hidden",
    userSelect: isResizing ? "none" : "auto", // Prevent text selection while resizing
    direction: "rtl", // Set the direction to right-to-left
  };

  return (
    <div className="d-flex" dir="rtl">
      {" "}
      {/* Set the direction to right-to-left */}
      <div
        className="sidebar"
        style={sidebarStyle}
        onMouseDown={handleMouseDown}
      >
        {/* Bootstrap-styled content for your resizable sidebar */}
        <p className="p-3">Resizable Sidebar</p>
      </div>
      <div className="flex-grow-1">
        {/* Bootstrap-styled main content area */}
        <div className="p-3">Main Content</div>
      </div>
    </div>
  );
};

export default ResizableComponent;
