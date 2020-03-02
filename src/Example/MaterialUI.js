import React from "react";
import { CheckIcon, CrossIcon, WarningIcon, InfoIcon } from "./Icons";
import { notifi } from "./from-where-you-initiaed-class";

export default function MaterialUIDefault({ type, children }) {
  return (
    <div
      className="mui-wrapper"
      role="alertdialog"
      aria-describedby="client-snackbar"
      style={{
        backgroundColor:
          type === "success"
            ? "#43a047"
            : type === "error"
            ? "#d32f2f"
            : type === "warning"
            ? "#ffa000"
            : type === "info"
            ? "#2979ff"
            : "black"
      }}
    >
      <div className="mui-inner">
        <div className="mui-message">
          <span className="mui-message-inner">
            {type === "success" ? (
              <CheckIcon color="white" />
            ) : type === "error" ? (
              <CrossIcon color="white" />
            ) : type === "warning" ? (
              <WarningIcon color="white" />
            ) : type === "info" ? (
              <InfoIcon color="white" />
            ) : (
              ""
            )}
            {children}
          </span>
        </div>
        <div className="mui-action">
          <button tabIndex="0" type="button" onClick={() => notifi.close(key)}>
            <span>Got it</span>
            <span></span>
          </button>
        </div>
      </div>
    </div>
  );
}
