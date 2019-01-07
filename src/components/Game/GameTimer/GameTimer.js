import React from 'react';
import { connect } from 'react-redux';
import cn from 'clsx';
import { GAME_TIME } from '../../../constants/game';
import styles from './styles.module.scss';
import { setTimeOver } from '../../../redux/modules/game/actions';

export class GameTimer extends React.Component {
    state = {
        time: null,
    };

    timerId = null;

    tick = () => {
        const timeDiff = 200;

        this.setState(state => ({
            time: state.time - timeDiff,
        }));
        if (this.state.time <= 0) {
            this.timeOver();
        } else {
            this.timerId = setTimeout(this.tick, timeDiff);
        }
    };

    timeOver() {
        const { setTimeOver } = this.props;

        this.pause();
        setTimeOver();
    }

    restartTimer() {
        this.setState(
            {
                time: GAME_TIME,
            },
            () => {
                this.tick();
            },
        );
    }

    pause() {
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
    }

    resume() {
        this.tick();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevProps.gameOver && !this.props.gameOver) || (prevProps.showIntro && !this.props.showIntro)) {
            this.restartTimer();
        }

        if (!prevProps.pause && this.props.pause) {
            this.pause();
        }

        if (prevProps.pause && !this.props.pause) {
            this.resume();
        }
    }

    render() {
        const { nextList, timeOver, gameOver } = this.props;
        const { time } = this.state;
        const visible = !!nextList && !timeOver && !gameOver;

        const widthPercent = (time / GAME_TIME) * 100;

        return (
            <div className={cn(styles.timerBar, { [styles.visible]: visible })}>
                <div
                    className={cn(styles.tracker, {
                        [styles.okTracker]: widthPercent >= 50,
                        [styles.warningTracker]: widthPercent >= 20 && widthPercent < 50,
                        [styles.dangerTracker]: widthPercent < 20 && widthPercent > 0,
                        [styles.noTracker]: widthPercent === 0,
                    })}
                    style={{ width: `${widthPercent}%` }}
                />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        showIntro: state.game.get('showIntro'),
        gameOver: state.game.get('gameOver'),
        pause: state.game.get('pause'),
        nextList: state.game.get('nextList'),
        timeOver: state.game.get('timeOver'),
    };
}

export default connect(
    mapStateToProps,
    {
        setTimeOver,
    },
)(GameTimer);
