import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import { CELL_SIZE_PX, FIGURES } from '../../../../constants/game';
import Cell from '../../Cell/Cell';

export default class NextFigure extends React.Component {
    static propTypes = {
        nextItemKey: PropTypes.string,
    };

    getContainerWidth() {
        const { nextItemKey } = this.props;
        const figure = FIGURES.get(nextItemKey);

        return figure.getIn(['matrix', 0]).size * CELL_SIZE_PX;
    }

    getContainerHeight() {
        const { nextItemKey } = this.props;
        const figure = FIGURES.get(nextItemKey);

        return Math.min(figure.getIn(['matrix']).size * CELL_SIZE_PX, 60);
    }

    renderCells() {
        const { nextItemKey } = this.props;
        const figure = FIGURES.get(nextItemKey);

        const resultCells = [];
        figure.get('matrix').forEach((row, y) => {
            row.forEach((matrixValue, x) => {
                if (matrixValue) {
                    resultCells.push(<Cell figure={figure} baked x={x} y={y} key={`${y}_${x}`} />);
                }
            });
        });

        return resultCells;
    }

    render() {
        const { nextItemKey } = this.props;
        if (!nextItemKey) {
            return null;
        }

        const height = this.getContainerHeight();
        const width = this.getContainerWidth();

        return (
            <div className={styles.container} style={{ width, height, paddingTop: height < 60 ? 10 : undefined }}>
                <div className={styles.inner}>{this.renderCells()}</div>
            </div>
        );
    }
}
