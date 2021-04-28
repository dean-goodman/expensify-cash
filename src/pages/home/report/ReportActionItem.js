import _ from 'underscore';
import React, {Component} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {withOnyx} from 'react-native-onyx';
import ONYXKEYS from '../../../ONYXKEYS';
import ReportActionPropTypes from './ReportActionPropTypes';
import {
    getReportActionItemStyle,
    getMiniReportActionContextMenuWrapperStyle,
} from '../../../styles/getReportActionItemStyles';
import PressableWithSecondaryInteraction from '../../../components/PressableWithSecondaryInteraction';
import Hoverable from '../../../components/Hoverable';
import PopoverWithMeasuredContent from '../../../components/PopoverWithMeasuredContent';
import ReportActionItemSingle from './ReportActionItemSingle';
import ReportActionItemGrouped from './ReportActionItemGrouped';
import ReportActionContextMenu from './ReportActionContextMenu';
import UnreadActionIndicator from '../../../components/UnreadActionIndicator';

const propTypes = {
    // The ID of the report this action is on.
    reportID: PropTypes.number.isRequired,

    // All the data of the action item
    action: PropTypes.shape(ReportActionPropTypes).isRequired,

    // Should the comment have the appearance of being grouped with the previous comment?
    displayAsGroup: PropTypes.bool.isRequired,

    // Should we display the new indicator on top of the comment?
    shouldDisplayNewIndicator: PropTypes.bool.isRequired,

    /* --- Onyx Props --- */
    // Draft message - if this is set the comment is in 'edit' mode
    draftMessage: PropTypes.string,
};

const defaultProps = {
    draftMessage: '',
};

class ReportActionItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPopoverVisible: false,
        };

        // The horizontal and vertical position (relative to the screen) where the popover will display.
        this.popoverAnchorPosition = {
            horizontal: 0,
            vertical: 0,
        };

        this.showPopover = this.showPopover.bind(this);
        this.hidePopover = this.hidePopover.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.isPopoverVisible !== nextState.isPopoverVisible
            || this.props.displayAsGroup !== nextProps.displayAsGroup
            || !_.isEqual(this.props.action, nextProps.action)
            || this.props.draftMessage !== nextProps.draftMessage
            || this.props.shouldDisplayNewIndicator !== nextProps.shouldDisplayNewIndicator;
    }

    /**
     * Save the location of a native press event.
     *
     * @param {Object} nativeEvent
     */
    capturePressLocation(nativeEvent) {
        this.popoverAnchorPosition = {
            horizontal: nativeEvent.pageX,
            vertical: nativeEvent.pageY,
        };
    }

    /**
     * Show the ReportActionContextMenu modal popover.
     *
     * @param {Object} [event] - A press event.
     */
    showPopover(event) {
        const nativeEvent = event.nativeEvent || {};
        this.capturePressLocation(nativeEvent);
        this.setState({isPopoverVisible: true});
    }

    /**
     * Hide the ReportActionContextMenu modal popover.
     */
    hidePopover() {
        this.setState({isPopoverVisible: false});
    }

    render() {
        return (
            <PressableWithSecondaryInteraction onSecondaryInteraction={this.showPopover}>
                <Hoverable>
                    {hovered => (
                        <View>
                            {!hovered && this.props.shouldDisplayNewIndicator && (
                                <UnreadActionIndicator />
                            )}
                            <View style={getReportActionItemStyle(hovered || this.props.draftMessage)}>
                                {!this.props.displayAsGroup
                                    ? (
                                        <ReportActionItemSingle
                                            action={this.props.action}
                                            draftMessage={this.props.draftMessage}
                                            reportID={this.props.reportID}
                                        />
                                    ) : (
                                        <ReportActionItemGrouped
                                            action={this.props.action}
                                            draftMessage={this.props.draftMessage}
                                            reportID={this.props.reportID}
                                        />
                                    )}
                            </View>
                            <View style={getMiniReportActionContextMenuWrapperStyle(this.props.displayAsGroup)}>
                                <ReportActionContextMenu
                                    reportID={this.props.reportID}
                                    reportAction={this.props.action}
                                    isVisible={
                                        hovered
                                        && !this.state.isPopoverVisible
                                    }
                                    draftMessage={this.props.draftMessage}
                                    hidePopover={this.hidePopover}
                                    isMini
                                />
                            </View>
                            <PopoverWithMeasuredContent
                                isVisible={this.state.isPopoverVisible}
                                onClose={this.hidePopover}
                                anchorPosition={this.popoverAnchorPosition}
                                animationIn="fadeIn"
                                animationOutTiming={1}
                                measureContent={() => (
                                    <ReportActionContextMenu
                                        isVisible
                                        reportID={this.props.reportID}
                                        reportAction={this.props.action}
                                        hidePopover={this.hidePopover}
                                    />
                                )}
                            >
                                <ReportActionContextMenu
                                    isVisible
                                    reportID={this.props.reportID}
                                    reportAction={this.props.action}
                                    draftMessage={this.props.draftMessage}
                                    hidePopover={this.hidePopover}
                                />
                            </PopoverWithMeasuredContent>
                        </View>
                    )}
                </Hoverable>
            </PressableWithSecondaryInteraction>
        );
    }
}

ReportActionItem.propTypes = propTypes;
ReportActionItem.defaultProps = defaultProps;

export default withOnyx({
    draftMessage: {
        key: ({reportID, action}) => `${ONYXKEYS.COLLECTION.REPORT_ACTIONS_DRAFTS}${reportID}_${action.reportActionID}`,
    },
})(ReportActionItem);
