import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import Board from './Board/Board';

export class Game extends React.Component {
    render() {
        return (
            <div className={styles.game}>
                <Board />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {};
}

export default connect(
    mapStateToProps,
    {},
)(Game);
