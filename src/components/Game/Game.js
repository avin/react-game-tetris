import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import Board from './Board/Board';
import NextBar from './NextBar/NextBar';
import ScoreBar from './ScoreBar/ScoreBar';
import GameTimer from './GameTimer/GameTimer';

export class Game extends React.Component {
    render() {
        return (
            <div className={styles.game}>
                <Board />
                <NextBar />
                <ScoreBar />
                <GameTimer />
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
