import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import io from "socket.io-client";

import { setUser, setSocket } from "../store/actions/authActions";
import {
  setSeat,
  setMatrix,
  setWinner,
  setJoined,
  setLeft,
} from "../store/actions/gameActions";
import Alert from "../components/Alert";

const GameWrapper = styled.div`
  button {
    cursor: pointer;
    margin: 8px 0 0 8px;
  }

  .text-left {
    text-align: left;
    margin-top: 0.5rem;
  }

  .username {
    margin-bottom: 1rem;
    font-weight: bold;
    color: indigo;
  }

  .board-wrapper {
    // margin-top: 20px;
    padding: 32px 0;
  }

  .info {
    width: 500px;
    max-width: 90%;
    margin: 0 auto;
  }

  .board-id {
    margin-top: 1rem;
    text-align: left !important;
  }

  .board {
    width: 500px;
    max-width: 90%;
    height: 500px;
    margin: 0 auto;
    margin-top: 36px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    border: 1px solid black;
  }

  .tile {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    font-size: 5rem;
    // font-weight: lighter;
  }

  .game-over {
    padding: 60px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h2 {
      margin-top: 5rem;
    }

    button {
      margin-top: 3rem;
    }
  }
`;

const Game = (props) => {
  const { seat, matrix, winner, joined, left } = useSelector(
    (state) => state.game
  );
  const { user, socket } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user && localStorage.getItem("player"))
      dispatch(setUser(JSON.parse(localStorage.getItem("player"))));
    if (user && !socket && !localStorage.getItem("socket"))
      dispatch(setSocket(io(`http://178.128.206.150:7000/?id=${user.id}`)));
  }, [dispatch, user, socket]);

  useEffect(() => {
    if (joined) {
      var timeout = setTimeout(() => {
        dispatch(setJoined(null));
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [joined, dispatch]);

  useEffect(() => {
    if (left) {
      var timeout = setTimeout(() => {
        dispatch(setLeft(null));
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [left, dispatch]);

  useEffect(() => {
    if (localStorage.getItem("matrix")) {
      dispatch(setMatrix(JSON.parse(localStorage.getItem("matrix"))));
    }
  }, [dispatch]);

  useEffect(() => {
    const boardID = props.match.params.board_id;
    if (socket) {
      if (!localStorage.getItem("board")) {
        socket.emit("join_room", boardID, (responseCode) => {
          console.log(`Ack: ${responseCode}`);
          if (responseCode === 200) localStorage.setItem("board", boardID);
          else props.history.push("/boards");
        });
      } else {
        const seat = +localStorage.getItem("seat");
        dispatch(setSeat(seat));
        dispatch(setMatrix(JSON.parse(localStorage.getItem("matrix"))));
      }

      socket.on("joined", (data) => {
        const { matrix, player, seat } = data;
        const { id } = user;
        if (player.id === id) {
          dispatch(setSeat(seat));
          localStorage.setItem("seat", seat);
          dispatch(setMatrix(JSON.parse(matrix)));
          localStorage.setItem("matrix", matrix);
        } else {
          dispatch(setJoined(player));
        }
      });

      socket.on("left", (data) => {
        const { player } = data;
        const { id } = user;
        if (player.id !== id) {
          dispatch(setLeft(player));
        }
      });

      socket.on("seat_left", (data) => {
        const { player } = data;
        if (player.id === user.id) {
          dispatch(setSeat(null));
          localStorage.removeItem("seat");
        }
      });

      socket.on("marked", (data) => {
        dispatch(setMatrix(data.matrix));
        localStorage.setItem("matrix", JSON.stringify(data.matrix));
      });

      socket.on("restarted", (data) => {
        localStorage.removeItem("winner");
        dispatch(setWinner(null));
        const m = {
          0: "0",
          1: "0",
          2: "0",
          3: "0",
          4: "0",
          5: "0",
          6: "0",
          7: "0",
          8: "0",
        };
        dispatch(setMatrix(m));
        localStorage.setItem(JSON.stringify(m));
      });

      socket.on("tie", () => {
        localStorage.setItem("winner", JSON.stringify({ name: "Nobody" }));
        dispatch(setWinner({ name: "Nobody" }));
      });

      socket.on("win", (data) => {
        localStorage.setItem("winner", JSON.stringify(data.player));
        dispatch(setWinner(data.player));
      });

      return () => socket.removeAllListeners();
    }
  }, [socket, props.match.params.board_id, user, props.history, dispatch]);

  useEffect(() => {
    if (localStorage.getItem("winner")) {
      dispatch(setWinner(JSON.parse(localStorage.getItem("winner"))));
    }
  }, [dispatch]);

  const handleLeaveRoom = () => {
    const boardID = props.match.params.board_id;
    if (seat) {
      socket.emit("leave_seat", boardID, seat, (responseCode) => {
        console.log(`Ack: ${responseCode}`);
        localStorage.removeItem("seat");
        socket.emit("leave_room", boardID, (responseCode) => {
          console.log(`Ack: ${responseCode}`);
          localStorage.removeItem("board");
          localStorage.removeItem("matrix");
          localStorage.removeItem("winner");
          props.history.push("/boards");
        });
      });
    } else {
      socket.emit("leave_room", boardID, (responseCode) => {
        console.log(`Ack: ${responseCode}`);
        localStorage.removeItem("board");
        localStorage.removeItem("seat");
        localStorage.removeItem("matrix");
        localStorage.removeItem("winner");
        props.history.push("/boards");
      });
    }
  };

  const handleLeaveSeat = () => {
    const boardID = props.match.params.board_id;
    socket.emit("leave_seat", boardID, seat, (responseCode) => {
      console.log(`Ack: ${responseCode}`);
    });
  };

  const handleClick = (e) => {
    if (!seat) return;
    const tile = +e.target.dataset.index;
    const boardID = props.match.params.board_id;
    socket.emit("mark_tile", boardID, tile, (responseCode) => {
      console.log(`Ack: ${responseCode}`);
    });
  };

  const handleRestart = () => {
    const boardID = props.match.params.board_id;
    socket.emit("restart", boardID, (responseCode) => {
      console.log(`Ack: ${responseCode}`);
    });
  };

  if (!localStorage.getItem("player")) return <Redirect to="/" />;

  return (
    <GameWrapper>
      {joined && <Alert type="success" text={`${joined.name} joined`} />}
      {left && <Alert text={`${left.name} left`} />}

      <button onClick={handleLeaveRoom}>Leave room</button>
      <button onClick={handleLeaveSeat} disabled={!seat}>
        Leave seat
      </button>
      <button onClick={handleRestart}>Restart</button>
      {matrix && !winner && (
        <div className="board-wrapper">
          <div className="info">
            <p className="text-left username">{user && user.name}</p>
            <p className="text-left">
              <b>Seat:</b> {seat ? seat : "none"}
            </p>
            <p className="text-left">
              <b>Board ID:</b> {props.match.params.board_id}
            </p>
          </div>
          <div className="board">
            {Object.entries(matrix).map(([key, value]) => (
              <div
                key={key}
                data-index={key}
                className="tile"
                onClick={handleClick}
              >
                {value == 0 ? "" : value == 1 ? "X" : "O"}
              </div>
            ))}
          </div>
        </div>
      )}
      {winner && (
        <div className="game-over">
          <h2>{winner.name} won</h2>
          <button onClick={handleRestart}>Play again</button>
        </div>
      )}
    </GameWrapper>
  );
};

export default Game;
