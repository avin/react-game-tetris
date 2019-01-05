import React from 'react';
import { connect } from 'react-redux';
import Cell from './Cell/Cell';
import styles from './styles.module.scss';
import { FIELD_HEIGHT, FIELD_WIDTH } from '../../../../constants/game';

export class Field extends React.Component {
    render() {
        const cells = [];
        for (let y = 0; y < FIELD_HEIGHT; y += 1) {
            for (let x = 0; x < FIELD_WIDTH; x += 1) {
                cells.push(<Cell x={x} y={y} key={`${y}_${x}`} />);
            }
        }

        return <div className={styles.field}>{cells}</div>;
    }
}

function mapStateToProps(state, ownProps) {
    return {
        cells: state.game.get('cells'),
    };
}

export default connect(
    mapStateToProps,
    {},
)(Field);
