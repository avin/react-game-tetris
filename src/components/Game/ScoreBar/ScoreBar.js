import React from 'react';
import { connect } from 'react-redux';
import cn from 'clsx';
import FlashChange from '@avinlab/react-flash-change';
import styles from './styles.module.scss';

export class ScoreBar extends React.Component {
    render() {
        const { score, showIntro } = this.props;
        const visible = !showIntro;

        return (
            <div className={cn(styles.bar, { [styles.visible]: visible })}>
                <div className={styles.title}>SCORE</div>

                <FlashChange
                    value={score}
                    flashDuration={200}
                    className={styles.score}
                    compare={(prevProps, nextProps) => {
                        if (nextProps.value - prevProps.value === 5) {
                            return styles.superFlashScore;
                        }
                        if (nextProps.value > prevProps.value) {
                            return styles.flashScore;
                        }
                        return false;
                    }}
                >
                    {score}
                </FlashChange>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        showIntro: state.game.get('showIntro'),
        score: state.game.get('score'),
    };
}

export default connect(
    mapStateToProps,
    {},
)(ScoreBar);
