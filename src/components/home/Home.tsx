import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './Home.scss'

import { PLAYERS_LIST } from '../../store/actions/players';

const Home = (props: any) => {
    
    const history = useHistory();
    const dispatch = useDispatch();
    const [players, setPlayers] = useState([]);

    const onPlayerNameChange = (playerIndex: number, playerName: string) => {
        let tempPlayers: any = players;
        tempPlayers[playerIndex] = {
            name: playerName,
            gameStats: [0, 0, 0, 0, 0, 0]
        };
        setPlayers(tempPlayers);
    }

    const onContinue = () => {
        
        if (players.length === 2) {
            dispatch({
                type: PLAYERS_LIST,
                payload: players
            });
            setTimeout(() => {
                history.push('/board')
            });
        }
    }

    return (
        <div className="homeContainer">
            <div className="boxContainer">
                <div className="boxOverlay"></div>
                <div className="boxContent">
                    <h3>Welcome to <span>TIC TAC TOE</span></h3>
                    <div className="formContainer">
                        <div className="formGroup">
                            <label>
                                PLAYER 1
                            </label>
                            <input type="text" placeholder="PLAYER 1"
                                onChange={e => onPlayerNameChange(0, e.target.value)}  />
                        </div>
                        <div className="formGroup">
                            <label>
                                PLAYER 2
                            </label>
                            <input type="text" placeholder="PLAYER 2"
                                onChange={e => onPlayerNameChange(1, e.target.value)} />
                        </div>
                        <div className="formGroup">
                            <input type="button" value="Continue" className="btnSubmit"
                                onClick={onContinue} />
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

export default connect(MapStateToProps, MapDispatchToProps)(Home);

//export default Home;
