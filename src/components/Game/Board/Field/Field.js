import React from 'react';
import { connect } from 'react-redux';
import Cell from '../../Cell/Cell';
import styles from './styles.module.scss';
import { FIELD_HEIGHT, FIELD_WIDTH } from '../../../../constants/game';

export class Field extends React.Component {
    renderGhost() {
        const { ghost } = this.props;

        const resultCells = [];
        ghost.get('matrix').forEach((row, y) => {
            row.forEach((matrixValue, x) => {
                if (matrixValue) {
                    resultCells.push(
                        <Cell
                            figure={ghost.get('figure')}
                            ghost
                            x={x + ghost.getIn(['offset', 'x'])}
                            y={y + ghost.getIn(['offset', 'y'])}
                            key={`GHOST_${y}_${x}`}
                        />,
                    );
                }
            });
        });

        return resultCells;
    }

    renderCurrent() {
        const { current } = this.props;
        const resultCells = [];
        current.get('matrix').forEach((row, y) => {
            row.forEach((matrixValue, x) => {
                if (matrixValue) {
                    resultCells.push(
                        <Cell
                            figure={current.get('figure')}
                            current
                            x={x + current.getIn(['offset', 'x'])}
                            y={y + current.getIn(['offset', 'y'])}
                            key={`${current.get('id')}_${y}_${x}`}
                        />,
                    );
                }
            });
        });

        return resultCells;
    }

    renderBackedCells() {
        const { cells } = this.props;
        const resultCells = [];
        for (let y = 0; y < FIELD_HEIGHT; y += 1) {
            for (let x = 0; x < FIELD_WIDTH; x += 1) {
                if (cells.getIn([y, x, 'figure'])) {
                    resultCells.push(
                        <Cell
                            figure={cells.getIn([y, x, 'figure'])}
                            baked
                            x={x}
                            y={y}
                            key={cells.getIn([y, x, 'id'])}
                        />,
                    );
                }
            }
        }

        return resultCells;
    }

    render() {
        return (
            <div className={styles.field}>
                {this.renderBackedCells()}
                {this.renderGhost()}
                {this.renderCurrent()}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        cells: state.game.get('cells'),
        current: state.game.get('current'),
        ghost: state.game.get('ghost'),
    };
}

export default connect(
    mapStateToProps,
    {},
)(Field);
