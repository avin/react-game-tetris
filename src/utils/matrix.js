import * as Immutable from 'immutable';

/**
 * Перевернуть матрицу
 * @param matrix
 * @param reverse
 * @returns {List}
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function turnOverMatrix(matrix, reverse = false) {
    let result = new Immutable.List();

    if (reverse) {
        for (let y = 0; y < matrix.size; y += 1) {
            for (let x = matrix.get(0).size - 1; x >= 0; x -= 1) {
                if (!result.get(matrix.get(0).size - 1 - x)) {
                    result = result.set(matrix.get(0).size - 1 - x, new Immutable.List());
                }
                result = result.setIn([matrix.get(0).size - 1 - x, y], matrix.getIn([y, x]));
            }
        }
    } else {
        for (let y = matrix.size - 1; y >= 0; y -= 1) {
            for (let x = 0; x < matrix.get(0).size; x += 1) {
                if (!result.get(x)) {
                    result = result.set(x, new Immutable.List());
                }
                result = result.setIn([x, matrix.size - 1 - y], matrix.getIn([y, x]));
            }
        }
    }

    return result;
}
