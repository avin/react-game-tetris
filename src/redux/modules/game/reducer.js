import * as Immutable from 'immutable';
import { SET_GAME_STATE } from './actionTypes';

const initialState = new Immutable.Map({
    inGame: false,
    showIntro: true,
    pause: false,
    gameOver: false,
    score: null,
    cells: null,
    newRecord: false,
});

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_GAME_STATE: {
            return action.state;
        }
        default:
            return state;
    }
}
