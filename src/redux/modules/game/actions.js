import * as Immutable from 'immutable';
import shortId from 'shortid';
import { SET_GAME_STATE } from './actionTypes';
import { DIRECTION, FIELD_HEIGHT, FIELD_WIDTH, FIGURES, NEXT_COUNT } from '../../../constants/game';
import { randomArrayElement } from '../../../utils/helpers';
import { turnOverMatrix } from '../../../utils/matrix';

const blankCell = new Immutable.Map({
    figure: null,
});

/**
 * Сгенерировать пустое поле
 * @returns {List}
 */
function generateBlankField() {
    let cells = new Immutable.Map();
    for (let y = 0; y < FIELD_HEIGHT; y += 1) {
        for (let x = 0; x < FIELD_WIDTH; x += 1) {
            cells = cells.setIn([y, x], blankCell);
        }
    }
    return cells;
}

/**
 * Убрать с поля клетки по результату ф-ии isDirtyCompare
 * @param cells
 * @param isDirtyCompare
 * @returns {*}
 */
function cleanCells(cells, isDirtyCompare) {
    return cells.map(row =>
        row.map(cell => {
            if (isDirtyCompare(cell)) {
                return blankCell;
            }
            return cell;
        }),
    );
}

/**
 * Перенести current на клетки
 * @param cells
 * @param current
 * @param modificators
 * @returns {*}
 */
function addCurrentToCells(cells, current) {
    current.get('matrix').forEach((row, y) => {
        row.forEach((matrixValue, x) => {
            if (matrixValue) {
                const id = shortId.generate();

                cells = cells.setIn(
                    [y + current.getIn(['offset', 'y']), x + current.getIn(['offset', 'x'])],
                    new Immutable.Map({
                        figure: current.get('figure'),
                        id,
                    }),
                );
            }
        });
    });

    return cells;
}

/**
 * Сгенерировать новый current
 * @param nextList
 * @returns {*[]}
 */
function getNewCurrent(nextList) {
    if (!nextList) {
        nextList = new Immutable.List();
        for (let i = 0; i < NEXT_COUNT; i += 1) {
            nextList = nextList.push(randomArrayElement(FIGURES.keySeq().toArray()));
        }
    } else {
        nextList = nextList.push(randomArrayElement(FIGURES.keySeq().toArray()));
    }

    // nextList = new Immutable.List(['O','O','O'])

    const nextListItem = nextList.get(0);
    nextList = nextList.slice(1);

    const figure = FIGURES.get(nextListItem);
    const current = new Immutable.Map({
        figure,
        offset: new Immutable.Map({
            y: 0 + figure.getIn(['centerOffset', 0]),
            x: FIELD_WIDTH / 2 + figure.getIn(['centerOffset', 1]),
        }),
        matrix: figure.get('matrix'),
        id: shortId.generate(),
    });

    return [current, nextList];
}

/**
 * Обработать завершенные строки в клетках
 * @param cells
 * @returns {*[]}
 */
function processCompletedRows(cells) {
    let completedRowsCount = 0;

    let result = generateBlankField();

    for (let y = FIELD_HEIGHT - 1; y >= 0; y -= 1) {
        let fullRow = true;
        for (let x = 0; x < FIELD_WIDTH; x += 1) {
            const cell = cells.getIn([y, x]);
            fullRow = fullRow && cell.get('figure') !== null;
        }
        if (fullRow) {
            completedRowsCount += 1;
        } else {
            result = result.set(y + completedRowsCount, cells.get(y));
        }
    }

    return [result, completedRowsCount];
}

/**
 * Получить current призрак у основания падения
 * @param cells
 * @param current
 * @returns {*|this|this|string[]|Cursor|this|this|this|this}
 */
function getGhost(cells, current) {
    let ghostCurrent = current;
    let isOk;
    let attemptGhostCurrent;
    do {
        attemptGhostCurrent = ghostCurrent.setIn(['offset', 'y'], ghostCurrent.getIn(['offset', 'y']) + 1);
        isOk = !testCurrentToCrash(cells, attemptGhostCurrent);

        if (isOk) {
            ghostCurrent = attemptGhostCurrent;
        }
    } while (isOk);

    return ghostCurrent;
}

/**
 * Проверить не пора ли фигуре прилипнуть к основанию
 */
function testCurrentToCrash(cells, current) {
    const offset = current.get('offset');

    let result = false;
    current.get('matrix').forEach((row, y) => {
        if (result) {
            return;
        }
        row.forEach((matrixValue, x) => {
            if (result) {
                return;
            }

            if (!matrixValue) {
                return;
            }

            // Если фигура зашла за потолок - пусть так и будет
            if (y + offset.get('y') < 0) {
                return;
            }

            const cell = cells.getIn([y + offset.get('y'), x + offset.get('x')]);

            if (!cell) {
                result = true;
                return;
            }
            if (cell.get('figure') !== null && !cell.get('isCurrent') && !cell.get('isGhost')) {
                result = true;
            }
        });
    });

    return result;
}

/**
 * Рестартануть игру
 */
export function restartGame() {
    const [current, nextList] = getNewCurrent();

    const cells = generateBlankField();

    const state = new Immutable.Map()
        .set('totalAdded', 0)
        .set('score', 0)
        .set('inGame', true)
        .set('showIntro', false)
        .set('pause', false)
        .set('nextList', nextList)
        .set('current', current)
        .set('cells', cells)
        .set('ghost', getGhost(cells, current))
        .set('gameOver', false);

    return {
        type: SET_GAME_STATE,
        state,
    };
}

/**
 * Поставить на паузу
 * @param value
 * @returns {{type: string, value: *}}
 */
export function pauseGame(value) {
    return (dispatch, getState) => {
        let { game } = getState();

        if (game.get('gameOver') || game.get('showIntro')) {
            return;
        }

        game = game.set('pause', value).set('inGame', !value);

        return dispatch({
            type: SET_GAME_STATE,
            state: game,
        });
    };
}

/**
 * Совершить одну итерацию в игре
 */
export function gameTick({ forceDrop = false } = {}) {
    return (dispatch, getState) => {
        let { game } = getState();

        if (!game.get('inGame')) {
            return;
        }

        let current = game.get('current');
        let cells = game.get('cells');
        let score = game.get('score');
        let nextList = game.get('nextList');

        cells = cleanCells(cells, cell => cell.get('isCurrent') || cell.get('isGhost'));

        const newCurrent = current.setIn(['offset', 'y'], current.getIn(['offset', 'y']) + 1);
        if (forceDrop) {
            current = getGhost(cells, current);
        }

        // Проверяем на готовность прилипнуть
        if (testCurrentToCrash(cells, newCurrent) || forceDrop) {
            // Запекаем текущий current
            cells = addCurrentToCells(cells, current);
            game = game.set('totalAdded', game.get('totalAdded') + 1);

            // Обрабатываем заполненные строки
            const [updatedCells, completedRowsCount] = processCompletedRows(cells);
            cells = updatedCells;
            if (completedRowsCount === 4) {
                score += 5;
            } else {
                score += completedRowsCount;
            }

            // Генерим новый current
            [current, nextList] = getNewCurrent();

            // Если новая фигура сразу врезается - то гамовер
            if (testCurrentToCrash(cells, current)) {
                game = game.set('gameOver', true).set('inGame', false);
            }
        } else {
            // Опускаем вниз
            current = current.setIn(['offset', 'y'], current.getIn(['offset', 'y']) + 1);
        }

        game = game
            .set('current', current)
            .set('ghost', getGhost(cells, current))
            .set('cells', cells)
            .set('score', score)
            .set('nextList', nextList);

        dispatch({
            type: SET_GAME_STATE,
            state: game,
        });
    };
}

export function moveCurrent(direction) {
    return (dispatch, getState) => {
        let { game } = getState();

        if (!game.get('inGame')) {
            return;
        }

        let current = game.get('current');
        let cells = game.get('cells');

        cells = cleanCells(cells, cell => cell.get('isCurrent') || cell.get('isGhost'));

        switch (direction) {
            case DIRECTION.UP: {
                current = current.set('matrix', turnOverMatrix(current.get('matrix'))).set('id', shortId.generate());
                break;
            }
            case DIRECTION.RIGHT: {
                current = current.setIn(['offset', 'x'], current.getIn(['offset', 'x']) + 1);
                break;
            }
            case DIRECTION.DOWN: {
                break;
            }
            case DIRECTION.LEFT: {
                current = current.setIn(['offset', 'x'], current.getIn(['offset', 'x']) - 1);
                break;
            }
            default:
        }

        // Если при новых условиях идет столкновение - ничего не делаем
        if (testCurrentToCrash(cells, current)) {
            return;
        }

        game = game
            .set('current', current)
            .set('cells', cells)
            .set('ghost', getGhost(cells, current));

        dispatch({
            type: SET_GAME_STATE,
            state: game,
        });
    };
}
