import React, { useEffect, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import io from "socket.io-client";

import img from "../images/tictactoe.png";
import { setUser, setSocket } from "../store/actions/authActions";
import { getBoards, createBoard } from "../store/actions/boardActions";

const BoardsWrapper = styled.div`
  .heading {
    text-align: center;
    margin-top: 2rem;

    span {
      color: indigo;
    }
  }

  .heading-boards {
    text-align: center;
    margin-top: 3rem;
  }

  .actions {
    margin: 2rem 0;
    text-align: center;

    button {
      width: 300px;
      height: 40px;
      cursor: pointer;
    }
  }

  .input-group {
    display: flex;
    flex-direction: column;

    input {
      margin-top: 6px;
    }
  }

  .boards {
    width: 1000px;
    max-width: 80%;
    margin: 2rem auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 50px;
  }

  .board {
    // width: 300px;
    // height: 300px;
    padding: 1rem;
    border: 1px solid black;
    text-align: center;
    // cursor: pointer;

    button {
      cursor: pointer;
    }
  }

  .img-container {
    width: 100%;
    margin-top: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .img-wrapper {
    height: 200px;
    width: 200px;
  }

  .join-room {
    margin-top: 20px;
    input {
      width: 350px;
      height: 40px;
    }
  }
`;

const Boards = (props) => {
  const { user, socket, key } = useSelector((state) => state.auth);
  const { boards, boardsLoading, boardCreating } = useSelector(
    (state) => state.boards
  );

  const dispatch = useDispatch();

  const inputEl = useRef();

  useEffect(() => {
    if (!user && localStorage.getItem("player"))
      dispatch(setUser(JSON.parse(localStorage.getItem("player"))));
    if (user && !socket)
      dispatch(setSocket(io(`http://178.128.206.150:7000/?id=${user.id}`)));
  }, [dispatch, user, socket]);

  useEffect(() => {
    if (key) {
      dispatch(getBoards(key));
    }
  }, [key, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const boardID = inputEl.current.value;
    props.history.push(`/game/${boardID}`);
  };

  if (!localStorage.getItem("player")) return <Redirect to="/" />;

  return (
    <BoardsWrapper>
      <h1 className="heading">
        Hello, <span>{user && user.name}</span>
      </h1>
      <div className="actions">
        <button
          onClick={() => dispatch(createBoard(key))}
          disabled={boardCreating}
        >
          Create new board
        </button>

        <form className="join-room" onSubmit={handleSubmit}>
          <input type="text" placeholder="Board ID" ref={inputEl} />
        </form>
        <small>
          <i>Paste board ID and press enter in order to join</i>
        </small>
      </div>
      {!boardsLoading && (
        <h2 className="heading-boards">
          {boards.length ? "Your boards" : "You have no boards. Create one!"}
        </h2>
      )}
      {boardsLoading && <div className="loader">Loading...</div>}
      {!boardsLoading && (
        <div className="boards">
          {boards.map((board) => (
            <div key={board.id} className="board">
              <p>
                <b>Players:</b> {board.players}/2
              </p>
              <div className="img-container">
                <div className="img-wrapper">
                  <img src={img} alt="board" width="100%" height="100%" />
                </div>
              </div>
              <Link to={`/game/${board.id}`}>
                <button disabled={board.players === 2}>join room</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </BoardsWrapper>
  );
};

export default Boards;
