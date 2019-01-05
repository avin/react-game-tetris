import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'clsx';
import styles from './styles.module.scss';
import { CELL_SIZE_PX, FIGURES } from '../../../../../constants/game';

export class Cell extends React.Component {
    static propTypes = {
        cell: PropTypes.object.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    };

    render() {
        const { x, y, cell } = this.props;

        let cellClassName;

        if (cell.get('isGhost')) {
            cellClassName = styles.ghost;
        } else {
            switch (cell.get('figure')) {
                case FIGURES.get('I'): {
                    cellClassName = styles.figureI;
                    break;
                }
                case FIGURES.get('J'): {
                    cellClassName = styles.figureJ;
                    break;
                }
                case FIGURES.get('L'): {
                    cellClassName = styles.figureL;
                    break;
                }
                case FIGURES.get('O'): {
                    cellClassName = styles.figureO;
                    break;
                }
                case FIGURES.get('S'): {
                    cellClassName = styles.figureS;
                    break;
                }
                case FIGURES.get('T'): {
                    cellClassName = styles.figureT;
                    break;
                }
                case FIGURES.get('Z'): {
                    cellClassName = styles.figureZ;
                    break;
                }
                default:
                    cellClassName = styles.blankCell;
            }
        }

        return (
            <div
                className={cn(styles.cell, cellClassName)}
                style={{
                    left: x * CELL_SIZE_PX,
                    top: y * CELL_SIZE_PX,
                    width: CELL_SIZE_PX,
                    height: CELL_SIZE_PX,
                }}
            />
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { y, x } = ownProps;

    return {
        cell: state.game.getIn(['cells', y, x]),
    };
}

export default connect(
    mapStateToProps,
    {},
)(Cell);
