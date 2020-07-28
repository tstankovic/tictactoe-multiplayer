import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import { createPlayer } from "../store/actions/authActions";

const CreatePlayerWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .input-group {
    display: flex;
    flex-direction: column;

    input {
      margin-top: 6px;
    }
  }
`;

const CreatePlayer = () => {
  const [name, setName] = useState("");

  const { key, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createPlayer(key, name));
  };

  if (localStorage.getItem("player")) return <Redirect to="/boards" />;

  return (
    <CreatePlayerWrapper>
      {loading && <div className="loader">Loading...</div>}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Enter your name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </form>
      )}
    </CreatePlayerWrapper>
  );
};

export default CreatePlayer;
