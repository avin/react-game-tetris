import React from 'react';
import PropTypes from 'prop-types';
import cn from 'clsx';
import styles from './styles.module.scss';
import { CELL_SIZE_PX, FIGURES } from '../../../constants/game';

export default class Cell extends React.Component {
    static propTypes = {
        figure: PropTypes.object,
        current: PropTypes.bool,
        baked: PropTypes.bool,
        ghost: PropTypes.bool,
        odd: PropTypes.bool,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    };

    static defaultProps = {
        figure: null,
    };

    render() {
        const { x, y, figure, ghost, current, baked, odd } = this.props;

        let cellClassName;

        if (ghost) {
            cellClassName = styles.ghost;
        } else {
            switch (figure) {
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
                className={cn(
                    styles.cell,
                    cellClassName,
                    {
                        [styles.ghost]: ghost,
                        [styles.current]: current,
                        [styles.bakedCell]: baked,
                    },
                    { [styles.odd]: odd },
                )}
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
