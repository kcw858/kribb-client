import React from "react";
import PropTypes from "prop-types";

export default function AuthLayout(props) {
  return (
    <div
      className="container-fluid p-0"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1600,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#F7FAFC", //전체 배경색
      }}
    >
      {props.children}
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
