import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import './Board.scss';

import { PLAYERS_LIST } from '../../store/actions/players';

const grid: any = [{
    rowNum: 1,
    columns: [{
        columnNum: 1
    },{
        columnNum: 2
    },{
        columnNum: 3
    }]
}, {
    rowNum: 2,
    columns: [{
        columnNum: 1
    },{
        columnNum: 2
    },{
        columnNum: 3
    }]
}, {
    rowNum: 3,
    columns: [{
        columnNum: 1
    },{
        columnNum: 2
    },{
        columnNum: 3
    }]
}];

let currentPlayer = 1;
const Board = (props: any) => {
    const [currentGrid, setCurrentGrid] = useState([]);
    const [winerUser, setWinnerUser] = useState(-1);
    const [gameDraw, setGameDraw] = useState(false);
    const [gameCount, setGameCount] = useState(0);

    const history = useHistory();
    const dispatch = useDispatch();
    useEffect(() => {
        if (!props.playersList || !props.playersList.length) {
            history.push('/');
        }
        setCurrentGrid(grid);
    });

    const reset = () => {
        setTimeout(() => {
            let rgrid: any = grid.map((row: any, index: any) => {
                let continuesColumns: any = []
                row.columns = row.columns.map((column: any, columnIndex: any) => {
                    if (column && column.selected) {
                        column.selected = false;
                    }
                    return column;
                })
                return row;
            });
            setCurrentGrid(rgrid);
            setGameDraw(false);
            setWinnerUser(-1);
        }, 2000)
    }

    const userWon = (userIndex: any) => {
        let totalGames = 1 + gameCount;
        setGameCount(totalGames)
        setWinnerUser(userIndex);

        let players: any = props.playersList;
        players.forEach((item: any, index: any) => {
            if (index === userIndex-1) {
                item.gameStats[gameCount] = 1;
            } else {
                item.gameStats[gameCount] = 0;
            }
        });

        dispatch({
            type: PLAYERS_LIST,
            payload: players
        });

        if (totalGames === 6) {
            setTimeout(() => {
                history.push('/result');
            }, 1000);
        }

        reset();
    }

    const isColumnWinner = (result: any) => {
        let r = 0;
        let c = 0;
        let i = 0;
        let won: any = false;
        while(i <= 2) {
            if (result[r][c] === result[r+1][c] && result[r][c] === result[r+2][c]){
                won = result[r][c];
                break;
            }
            c++;
            i++;
        }
        if (won && won === 'cross') {
            console.log('Player 1 won column');
            userWon(1);
            return true;
        } else if (won) {
            console.log('Player 2 won column');
            userWon(2);
            return true;
        }
        return false;
    }

    const isDiagonalWinner = (result: any) => {
        let r = 0;
        let c = 0;
        let i = 0;
        let won: any = false;

        if (result[r][c] === result[r+1][c+1] && result[r][c] === result[r+2][c+2]){
            won = result[r][c];
        } else if (result[r][c+2] === result[r+1][c+1] && result[r][c+2] === result[r+2][c]){
            won = result[r][c+2];
        }
        
        if (won && won === 'cross') {
            console.log('Player 1 won diagonal');
            userWon(1);
            return true;
        } else if (won) {
            console.log('Player 2 won diagonal');
            userWon(2);
            return true;
        }
        return false;
    }

    const isRowWinner = (result: any) => {
        let totalZeros =_.countBy(result, function (zero) {
            return zero == 'zero';
        });
        let totalCross =_.countBy(result, function (zero) {
            return zero == 'cross';
        });

        if (totalCross.true && totalCross.true === 3) {
            console.log('Player 1 won row');
            userWon(1);
            return true;
        } else if (totalZeros.true && totalZeros.true === 3) {
            console.log('Player 2 won row');
            userWon(2);
            return true;
        }

        return false;
    }
    const selectColumn = (rowNum: number, columnNum: number) => {
        if (gameDraw || winerUser > -1) {
            return;
        }
        let cGrid: any = currentGrid;
        let switchPlayer:  any = false;
        let rowWin: any = [];
        let emptyColumns: any = [];
        let isWinner: boolean = false;
        let isDraw: boolean = false;
        cGrid = cGrid.map((row: any, index: any) => {
            let continuesColumns: any = []
            if (row.rowNum === rowNum) {
                row.columns = row.columns.map((column: any, columnIndex: any) => {
                    if (column.columnNum === columnNum && !column.selected) {
                        if (currentPlayer === 2) {
                            column.selected = 'zero';
                        } else {
                            column.selected = 'cross';
                        }

                        switchPlayer = true;
                    }

                    continuesColumns.push(column.selected);
                    if (!column.selected) {
                        emptyColumns.push(column);
                    }
                    return column
                });

                isWinner = isRowWinner(continuesColumns);
            } else {
                row.columns.forEach((column: any) => {
                    if (!column.selected) {
                        emptyColumns.push(column);
                    }
                });
            }
            rowWin[index] = row.columns.map((item: any) => {
                return item.selected || false;
            });
            return row;
        });

        isWinner = (!isWinner) ? (isColumnWinner(rowWin) ? true : isDiagonalWinner(rowWin) ) : false;
        isDraw = emptyColumns.length ? false : true;
        if (!isWinner && isDraw) {
            console.log('Game draw');
            setGameDraw(true);
            reset();
        }
        if (switchPlayer) {
            if (currentPlayer == 1) {
                currentPlayer = 2;
            } else {
                currentPlayer = 1;
            }

            setCurrentGrid(cGrid);
        }
    }

    const renderSelection = (column: any) => {
        if (column && column.selected) {
            return (
                <div className={column.selected}></div>
            )
        }
        return (null);
    } 
    const renderColumn = (rowNum: number, columns: any) => {

        const columnsHtml = columns.map((column: any) =>
            <div className='column'>
                <div className='columnOverlay'></div>
                <div className='columnContent' onClick={ e => selectColumn(rowNum, column.columnNum)}>
                    {renderSelection(column)}
                </div>
            </div>
        );
        return columnsHtml;
    }
    const renderRows = () => {
        const rows = currentGrid.map((row: any) =>
            <div className='row row-2'>
                {renderColumn(row.rowNum, row.columns)}
            </div>
        );

        return rows;
    }

    const renderTurn = (playerIndex: any) => {
        if (gameDraw) {
            return (<div className="your-turn">DRAW</div>)
        }
        if (playerIndex === winerUser) {
            return (<div className="your-turn">WINNER</div>)
        }
        if (playerIndex === currentPlayer && winerUser === -1) {
            return (<div className="your-turn">Your Turn</div>)
        }
        return (<div className="your-turn"><br /></div>);
    }

    const renderStats = (playerIndex: any) => {
        let player: any = {};
        if (props.playersList && props.playersList[playerIndex - 1] && props.playersList[playerIndex-1].name) {
            player = props.playersList[playerIndex-1];
        }
        if (!player || !player.gameStats) {
            return (null);
        }
        return (
            <div className="dotWrapper">
                {player.gameStats.map((item: any, index: any) => (
                    <span className={"dot dot-" + item}></span>
                ))}
            </div>
        )
    }

    const renderPlayer = (playerIndex: any) => {
        let positon: any = (playerIndex == 1) ? 'left' : 'right';
        let isWinner: any = playerIndex === winerUser ? ' winner' : '';
        let isDraw: any = (gameDraw) ? ' draw' : '';
        let playerName: any = '';
        if (props.playersList && props.playersList[playerIndex - 1] && props.playersList[playerIndex-1].name) {
            playerName = (<h5>{props.playersList[playerIndex-1].name}</h5>)
        }
        const player = (
            <div className={"playerWraper " + positon + isWinner + isDraw}>
                {renderTurn(playerIndex)}
                <div className="player">
                    <small>PLAYER 1</small>
                    {playerName}
                    <div className="cross"></div>
                </div>
                {renderStats(playerIndex)}
            </div>
        )

        return player;
    }
    return (
        <div className="homeContainer">
            <div className="boxContainer">
                <div className="boxOverlay"></div>
                <div className="boxContent">
                    {renderRows()}
                </div>
            </div>
            {renderPlayer(1)}
            {renderPlayer(2)}
        </div>
    );
}

const MapStateToProps = (state: any) => {
    return {
        playersList: state.playersList
    };
};
const MapDispatchToProps = (dispatch: any) => {
    return {
        dispatch
    }
};

export default connect(MapStateToProps, MapDispatchToProps)(Board);

