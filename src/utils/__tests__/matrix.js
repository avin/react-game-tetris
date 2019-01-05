import * as Immutable from 'immutable';
import { turnOverMatrix } from '../matrix';

describe('turnOverMatrix', () => {
    test('isOk!', () => {
        expect(
            turnOverMatrix(
                Immutable.fromJS([
                    // prettier-ignore
                    [1, 1, 1],
                    [0, 0, 1],
                ]),
            ),
        ).toEqual(
            Immutable.fromJS([
                // prettier-ignore
                [0, 1],
                [0, 1],
                [1, 1],
            ]),
        );

        expect(
            turnOverMatrix(
                Immutable.fromJS([
                    // prettier-ignore
                    [1, 1, 0],
                    [0, 1, 1],
                ]),
            ),
        ).toEqual(
            Immutable.fromJS([
                // prettier-ignore
                [0, 1],
                [1, 1],
                [1, 0],
            ]),
        );

        expect(
            turnOverMatrix(
                Immutable.fromJS([
                    // prettier-ignore
                    [1, 1, 1, 1],
                ]),
            ),
        ).toEqual(
            Immutable.fromJS([
                // prettier-ignore
                [1],
                [1],
                [1],
                [1],
            ]),
        );

        expect(
            turnOverMatrix(
                Immutable.fromJS([
                    // prettier-ignore
                    [1],
                    [1],
                    [1],
                    [1],
                ]),
            ),
        ).toEqual(
            Immutable.fromJS([
                // prettier-ignore
                [1, 1, 1, 1],
            ]),
        );
    });

    test('isOk reverse!', () => {
        expect(
            turnOverMatrix(
                Immutable.fromJS([
                    // prettier-ignore
                    [1, 1, 1],
                    [0, 0, 1],
                ]),
                true,
            ),
        ).toEqual(
            Immutable.fromJS([
                // prettier-ignore
                [1, 1],
                [1, 0],
                [1, 0],
            ]),
        );

        expect(
            turnOverMatrix(
                Immutable.fromJS([
                    // prettier-ignore
                    [1, 1, 0],
                    [0, 1, 1],
                ]),
                true,
            ),
        ).toEqual(
            Immutable.fromJS([
                // prettier-ignore
                [0, 1],
                [1, 1],
                [1, 0],
            ]),
        );
    });
});
