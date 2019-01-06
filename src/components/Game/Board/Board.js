import React from 'react';
import { connect } from 'react-redux';
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
import CellsBackYard from './CellsBackYard/CellsBackYard';

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
            return restartGame();
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
                    moveCurrent(DIRECTION.RIGHT);
                    this.keyRightPressIntervalId = setInterval(() => {
                        moveCurrent(DIRECTION.RIGHT);
                    }, KEY_REPEAT_TIME);
                },
                on_keyup: () => {
                    if (this.keyRightPressIntervalId) {
                        clearInterval(this.keyRightPressIntervalId);
                    }
                },
                prevent_repeat: true,
            },
            {
                keys: 'left',
                is_exclusive: true,
                on_keydown: () => {
                    moveCurrent(DIRECTION.LEFT);
                    this.keyLeftPressIntervalId = setInterval(() => {
                        moveCurrent(DIRECTION.LEFT);
                    }, KEY_REPEAT_TIME);
                },
                on_keyup: () => {
                    if (this.keyLeftPressIntervalId) {
                        clearInterval(this.keyLeftPressIntervalId);
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
        if (prevProps.totalAdded !== this.props.totalAdded) {
            // Отжимаем нажатие вниз
            if (this.keyDownPressed) {
                this.handleKeyDownUp();
            }
        }
    }

    render() {
        const { pause, gameOver, showIntro } = this.props;

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
                <LabelScreen
                    active={showIntro}
                    label={
                        <div>
                            Press
                            <br />
                            &lt; SPACE &gt;
                            <br />
                            to start
                        </div>
                    }
                />
                <LabelScreen active={pause} label="Pause" blink />
                <LabelScreen active={gameOver} label="Game Over" />
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
        totalAdded: state.game.get('totalAdded'),
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
