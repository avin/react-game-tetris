import * as Immutable from 'immutable';

export const GAME_TIME = 60 * 2 * 1000; // 2 минуты
export const TICK_TIME = 500;

export const CELL_SIZE_PX = 20;
export const CELL_MARGIN_PX = 1;

export const FIELD_WIDTH = 10;
export const FIELD_HEIGHT = 21;

export const NEXT_COUNT = 3;

export const KEY_REPEAT_TIME = 100;
export const KEY_DOWN_REPEAT_TIME = 30;

export const FIGURES = Immutable.fromJS({
    I: {
        // prettier-ignore
        matrix: [
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0],
        ],
        centerOffset: [-1, -2],
    },
    J: {
        // prettier-ignore
        matrix: [
            [0,0,0],
            [1,1,1],
            [0,0,1],
        ],
        centerOffset: [-1, -1],
    },
    L: {
        // prettier-ignore
        matrix: [
            [0,0,0],
            [1,1,1],
            [1,0,0],
        ],
        centerOffset: [-1, -1],
    },
    O: {
        // prettier-ignore
        matrix: [
            [1,1],
            [1,1],
        ],
        centerOffset: [0, 0],
    },
    S: {
        // prettier-ignore
        matrix: [
            [0,0,0],
            [0,1,1],
            [1,1,0],
        ],
        centerOffset: [-1, -1],
    },
    T: {
        // prettier-ignore
        matrix: [
            [0,0,0],
            [1,1,1],
            [0,1,0],
        ],
        centerOffset: [-1, -1],
    },
    Z: {
        // prettier-ignore
        matrix: [
            [0,0,0],
            [1,1,0],
            [0,1,1],
        ],
        centerOffset: [-1, -1],
    },
});

export const DIRECTION = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
};
