import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
      return (
          <button className="square" onClick={props.onClick}>
              {props.value}
          </button>
          //Change from ()=>this.props.onClick() to props.onClick
      );
  }
  //Change square from class to function component for easier patterns


  class Board extends React.Component {
      //Delete constructor and put states of squares and turn to Game class
      //Move output part into Game class
      renderSquare(i) {
        return (
          <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
      }

      render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
      constructor(props){
          super(props);
          this.state = {
              history: [{
                  squares: Array(9).fill(null),
              }],
              xIsNext : true,
              stepNumber: 0, //Indicate which step going to
          };
      }
      jumpTo(step){
          this.setState({
              stepNumber: step,
              xIsNext:(step%2) === 0,
          });
      }
      handleClick(i){
        const history = this.state.history.slice(0,this.state.stepNumber + 1);
        //Copy all history before the returned history
        const current = history[this.state.stepNumber];
        //Show move based on stepnumber
        const squares = current.squares.slice(); 
         //Create a copy of squares array instead of using existing array
        if (calculateWinner(squares)|| squares[i]){
            return;
        }
        //If winner comes out or square already filled, return early.
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        //Square's status equal to x or o depends on turn
        this.setState({
            history:history.concat([{squares:squares,}]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            //Change xIsNext's value to determine o or x will next click be
            //use colon instead of assignment
        });
    }

    render() {
        const history = this.state.history;
        const current = history[history.length-1];//Most recent history
        const winner = calculateWinner(current.squares);

        const moves = history.map((step,move)=>{
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            //Content display on button
            return(
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner){
            status = 'Winner: '+winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
            squares = {current.squares}
            onClick={(i)=> this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  