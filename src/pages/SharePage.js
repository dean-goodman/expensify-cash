import React from 'react';
import {View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context/src/SafeAreaContext';
import {SafeAreaInsetsContext} from 'react-native-safe-area-context';
import {withOnyx} from 'react-native-onyx';
import PropTypes from 'prop-types';
import styles from '../styles/styles';
import ONYXKEYS from '../ONYXKEYS';
import {redirect} from '../libs/actions/App';
import {clear as clearSharedItem} from '../libs/actions/SharedItem';
import {hide as hideSidebar} from '../libs/actions/Sidebar';
import ROUTES from '../ROUTES';
import CustomStatusBar from '../components/CustomStatusBar';
import SidebarLinks from './home/sidebar/SidebarLinks';
import FAB from '../components/FAB';
import CreateMenu from '../components/CreateMenu';
import * as ChatSwitcher from '../libs/actions/ChatSwitcher';

const propTypes = {
    // Currently viewed reportID
    currentlyViewedReportID: PropTypes.string,
};

const defaultProps = {
    currentlyViewedReportID: '',
};

class SharePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isCreateMenuActive: false,
        };

        this.onCloseButtonClick = this.onCloseButtonClick.bind(this);
        this.onLinkClick = this.onLinkClick.bind(this);
        this.onCreateMenuItemSelected = this.onCreateMenuItemSelected.bind(this);
        this.toggleCreateMenu = this.toggleCreateMenu.bind(this);
    }

    /**
     * Clears the shared item and closes Share Page.
     */
    onCloseButtonClick() {
        clearSharedItem();
        redirect(this.props.currentlyViewedReportID !== ''
            ? ROUTES.getReportRoute(this.props.currentlyViewedReportID)
            : ROUTES.HOME);
    }

    /**
     * Hides navigation menu on redirect to report page.
     */
    onLinkClick() {
        hideSidebar();
    }

    /**
     * Method called when a Create Menu item is selected.
     */
    onCreateMenuItemSelected() {
        this.toggleCreateMenu();
        ChatSwitcher.show();
    }

    /**
     * Method called when we click the floating action button

     * Method called either when:
     * Pressing the floating action button to open the CreateMenu modal
     * Selecting an item on CreateMenu or closing it by clicking outside of the modal component
     */
    toggleCreateMenu() {
        this.setState(state => ({
            isCreateMenuActive: !state.isCreateMenuActive,
        }));
    }

    render() {
        return (
            <SafeAreaProvider>
                <CustomStatusBar />
                <SafeAreaInsetsContext.Consumer style={[styles.flex1]}>
                    {insets => (
                        <>
                            <View style={[styles.flex1, styles.sidebar]}>
                                <SidebarLinks
                                    title="Send to..."
                                    showAvatar={false}
                                    showCloseButton
                                    insets={insets}
                                    onCloseButtonClick={this.onCloseButtonClick}
                                    onLinkClick={this.onLinkClick}
                                />
                                <FAB
                                    isActive={this.state.isCreateMenuActive}
                                    onPress={this.toggleCreateMenu}
                                />
                            </View>
                            <CreateMenu
                                onClose={this.toggleCreateMenu}
                                isVisible={this.state.isCreateMenuActive}
                                onItemSelected={this.onCreateMenuItemSelected}
                            />
                        </>
                    )}
                </SafeAreaInsetsContext.Consumer>
            </SafeAreaProvider>
        );
    }
}

SharePage.propTypes = propTypes;
SharePage.defaultProps = defaultProps;

export default withOnyx({
    currentlyViewedReportID: {
        key: ONYXKEYS.CURRENTLY_VIEWED_REPORTID,
    },
})(SharePage);
