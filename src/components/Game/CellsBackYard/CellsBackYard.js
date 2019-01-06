import React from 'react';
import { FIELD_HEIGHT, FIELD_WIDTH } from '../../../constants/game';
import Cell from '../Cell/Cell';

export default class CellsBackYard extends React.Component {
    render() {
        const cells = [];

        for (let y = 0; y < FIELD_HEIGHT; y += 1) {
            for (let x = 0; x < FIELD_WIDTH; x += 1) {
                cells.push(<Cell x={x} y={y} key={`BACK_${y}_${x}`} odd={y % 2 ? !!(x % 2) : !(x % 2)} />);
            }
        }

        return <>{cells}</>;
    }
}
