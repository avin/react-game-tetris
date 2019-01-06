import React from 'react';
import { connect } from 'react-redux';
import cn from 'clsx';
import styles from './styles.module.scss';
import NextFigure from './NextFigure/NextFigure';

export class NextBar extends React.Component {
    render() {
        const { nextList } = this.props;
        const visible = !!nextList;

        return (
            <div className={cn(styles.bar, { [styles.visible]: visible })}>
                <div className={styles.title}>NEXT</div>
                <div className={styles.figures}>
                    <NextFigure nextItemKey={nextList && nextList.get(0)} />
                    <NextFigure nextItemKey={nextList && nextList.get(1)} />
                    <NextFigure nextItemKey={nextList && nextList.get(2)} />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        nextList: state.game.get('nextList'),
    };
}

export default connect(
    mapStateToProps,
    {},
)(NextBar);
