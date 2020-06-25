import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './Result.scss'

import { PLAYERS_LIST } from '../../store/actions/players';

const Result = (props: any) => {
    const [winner, setWinner] = useState('')
    const [winnerMark, setWinnerMark] = useState('')
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        let totalWin: any = 0;
        let winnerPlayer: any = {};
        if (!props.playersList || !props.playersList.length) {
            history.push('/')
        }
        props.playersList.forEach((item: any, index: any) => {
            let winCount = item.gameStats.filter((res: any) => {
                return res === 1
            });

            if (winCount.length > totalWin) {
                totalWin = winCount.length;
                winnerPlayer = item;
                if (index === 0) {
                    setWinnerMark('cross')
                } else {
                    setWinnerMark('zero')
                }
            }
        });
        setWinner(winnerPlayer.name);
    });
    return (
        <div className="resultContainer">
            <div className="boxContainer">
                <div className="boxOverlay"></div>
                <div className="boxContent">
                    <div className="resultWrapper">
                        <h3>WINNER!</h3>
                        <div className="resultBox">
                            <small>PLAYER 1</small>
                            <h4>{winner}</h4>
                            <div className={winnerMark}></div>
                        </div>
                    </div>
                </div>
            </div>
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

export default connect(MapStateToProps, MapDispatchToProps)(Result);