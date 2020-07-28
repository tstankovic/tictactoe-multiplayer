import React from "react";
import styled from "styled-components";

const AlertWrapper = styled.div`
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 250px;
  height: 40px;
  display: grid;
  place-items: center;
  background-color: ${({ type }) =>
    type === "success" ? "forestgreen" : "red"};
  color: #fff;
`;

const Alert = ({ type, text }) => (
  <AlertWrapper type={type}>{text}</AlertWrapper>
);

export default Alert;
