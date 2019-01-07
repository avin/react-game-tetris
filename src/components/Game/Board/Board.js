import React from 'react';
import { connect } from 'react-redux';
import createRepeat from '@avinlab/repeat';
import cn from 'clsx';
import styles from './styles.module.scss';
import {
    CELL_SIZE_PX,
    DIRECTION,
    FIELD_HEIGHT,
    FIELD_WIDTH,
    KEY_DOWN_REPEAT_TIME,
    KEY_REPEAT_TIME,
    TICK_TIME,
} from '../../../constants/game';
import Field from './Field/Field';
import LabelScreen from './LabelScreen/LabelScreen';
import { gameTick, moveCurrent, pauseGame, restartGame } from '../../../redux/modules/game/actions';
import CellsBackYard from '../CellsBackYard/CellsBackYard';

const IntroScreen = ({ active }) => (
    <LabelScreen
        active={active}
        label={
            <div>
                <div style={{ fontSize: 37, color: '#f5498b' }} className={styles.cool}>
                    Tetris Sprint
                </div>
                <div style={{ fontSize: 25, marginBottom: 40, color: '#293742' }}>
                    Get more score <br /> in 2 minutes!
                </div>
                <div style={{ fontSize: 30 }}>
                    Press
                    <div className={styles.spaceButton}>&lt; SPACE &gt;</div>
                    to start
                </div>
            </div>
        }
    />
);

export class Board extends React.Component {
    doGameTick = ({ skip = false, doNotRepeat = false } = {}) => {
        this.clearGameTickTimeout();

        const { gameTick } = this.props;
        gameTick();

        if (doNotRepeat) {
            return;
        }

        this.gameTickTimeoutId = setTimeout(() => this.doGameTick(), TICK_TIME);
    };

    clearGameTickTimeout() {
        if (this.gameTickTimeoutId) {
            clearTimeout(this.gameTickTimeoutId);
        }
    }

    handlePressSpace = e => {
        const { restartGame, pauseGame, pause, showIntro, gameOver, gameTick } = this.props;
        if (showIntro || gameOver) {
            if (!this.freezeSpaceButton) {
                return restartGame();
            }
        }
        if (pause) {
            return pauseGame(false);
        }

        gameTick({ forceDrop: true });
    };

    handlePressEsc = e => {
        const { pauseGame, pause } = this.props;

        if (pause) {
            pauseGame(false);
        } else {
            return pauseGame(true);
        }
    };

    handleKeyDownDown = () => {
        this.keyDownPressed = true;

        this.clearGameTickTimeout();

        this.doGameTick({ doNotRepeat: true });
        this.keyDownPressIntervalId = setInterval(() => {
            this.doGameTick({ doNotRepeat: true });
        }, KEY_DOWN_REPEAT_TIME);
    };

    handleKeyDownUp = () => {
        this.keyDownPressed = false;

        if (this.keyDownPressIntervalId) {
            clearInterval(this.keyDownPressIntervalId);
        }
        this.doGameTick({ skip: true });
    };

    componentDidMount() {
        const { moveCurrent } = this.props;
        this.keyboardListener = new window.keypress.Listener();

        this.keyboardListener.register_many([
            {
                keys: 'space',
                is_exclusive: true,
                on_keydown: this.handlePressSpace,
                prevent_repeat: true,
            },
            {
                keys: 'esc',
                is_exclusive: true,
                on_keydown: this.handlePressEsc,
                prevent_repeat: true,
            },
            {
                keys: 'right',
                is_exclusive: true,
                on_keydown: () => {
                    this.repeatKeyRight = createRepeat({
                        action: () => {
                            moveCurrent(DIRECTION.RIGHT);
                        },
                        delay: KEY_REPEAT_TIME,
                        firstTimeDelay: KEY_REPEAT_TIME * 2,
                    });
                    this.repeatKeyRight.start();
                },
                on_keyup: () => {
                    if (this.repeatKeyRight) {
                        this.repeatKeyRight.stop();
                        this.repeatKeyRight = null;
                    }
                },
                prevent_repeat: true,
            },
            {
                keys: 'left',
                is_exclusive: true,
                on_keydown: () => {
                    this.repeatKeyLeft = createRepeat({
                        action: () => {
                            moveCurrent(DIRECTION.LEFT);
                        },
                        delay: KEY_REPEAT_TIME,
                        firstTimeDelay: KEY_REPEAT_TIME * 2,
                    });
                    this.repeatKeyLeft.start();
                },
                on_keyup: () => {
                    if (this.repeatKeyLeft) {
                        this.repeatKeyLeft.stop();
                    }
                },
                prevent_repeat: true,
            },
            {
                keys: 'up',
                is_exclusive: true,
                on_keydown: () => {
                    moveCurrent(DIRECTION.UP);
                },
                prevent_repeat: true,
            },
            {
                keys: 'down',
                is_exclusive: true,
                on_keydown: this.handleKeyDownDown,
                on_keyup: this.handleKeyDownUp,
                prevent_repeat: true,
            },
        ]);
    }

    componentWillUnmount() {
        this.keyboardListener.reset();
        this.clearGameTickTimeout();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.inGame && this.props.inGame) {
            this.doGameTick({ skip: true });
        }

        if (prevProps.inGame && !this.props.inGame) {
            this.clearGameTickTimeout();
        }

        if (!prevProps.gameOver && this.props.gameOver) {
            // Фризим спейс чтоб случайно сразу не стартануть новую игру
            this.freezeSpaceButton = true;
            setTimeout(() => {
                this.freezeSpaceButton = false;
            }, 500);
        }

        if (prevProps.totalAdded !== this.props.totalAdded) {
            // Отжимаем нажатие вниз
            if (this.keyDownPressed) {
                this.handleKeyDownUp();
            }
        }
    }

    render() {
        const { pause, gameOver, showIntro, timeOver, score, newRecord, personalRecord } = this.props;

        const boardWidth = CELL_SIZE_PX * FIELD_WIDTH;
        const boardHeight = CELL_SIZE_PX * FIELD_HEIGHT;

        return (
            <div
                className={styles.board}
                style={{
                    width: boardWidth,
                    height: boardHeight,
                }}
            >
                <CellsBackYard />
                {!showIntro && <Field />}
                <IntroScreen active={showIntro} />
                <LabelScreen active={pause} label="Pause" blink />
                <LabelScreen
                    active={gameOver}
                    label={
                        <div>
                            <div style={{ marginBottom: 20 }}>{timeOver ? 'Time Over' : 'Game Over'}</div>
                            {newRecord && (
                                <div className={cn(styles.cool, styles.newRecord)} style={{ fontSize: 30 }}>
                                    NEW RECORD!!
                                </div>
                            )}
                            <div style={{ fontSize: 30 }}>Your score: {score}</div>
                            <div style={{ fontSize: 20 }}>( Personal record: {personalRecord} )</div>
                        </div>
                    }
                />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        showIntro: state.game.get('showIntro'),
        pause: state.game.get('pause'),
        inGame: state.game.get('inGame'),
        gameOver: state.game.get('gameOver'),
        timeOver: state.game.get('timeOver'),
        totalAdded: state.game.get('totalAdded'),
        score: state.game.get('score'),
        personalRecord: state.game.get('personalRecord'),
        newRecord: state.game.get('newRecord'),
    };
}

export default connect(
    mapStateToProps,
    {
        restartGame,
        gameTick,
        pauseGame,
        moveCurrent,
    },
)(Board);
