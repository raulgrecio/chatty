import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, TabNavigator } from 'react-navigation';

import Groups from './groups.component';
import Messages from './messages.component';

import FinalizeGroup from './finalize-group.component';
import GroupDetails from './group-details.component';
import NewGroup from './new-group.component';
import Signin from './signin.component';
import Settings from './settings.component';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarStyle: {
    backgroundColor: '#dbdbdb',
  },
  tabText: {
    color: '#777',
    fontSize: 10,
    justifyContent: 'center',
  },
  selected: {
    color: 'blue',
  },
});

const TabIcon = ({ title, selected }) => (
  <View style={styles.container}>
    <Text style={[styles.tabText, selected ? styles.selected : undefined]}>
      {title}
    </Text>
  </View>
);
TabIcon.propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

const MainScreenNavigator = TabNavigator({
  Chats: { screen: Groups },
  Settings: { screen: Settings },
});

export const AppNavigator = StackNavigator({
  Main: { screen: MainScreenNavigator },
  Signin: { screen: Signin },
  Messages: { screen: Messages },
  GroupDetails: { screen: GroupDetails },
  NewGroup: { screen: NewGroup },
  FinalizeGroup: { screen: FinalizeGroup },
}, {
  mode: 'modal',
});

const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const initialNavState = AppNavigator.router.getStateForAction(
  tempNavState,
);

export const navigationReducer = (state = initialNavState, action) => {
  let nextState;
  switch (action.type) {
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);

// // create scenes via Actions.create() or it will be re-created every time Router renders
// export const Scenes = Actions.create(
//   <Scene key="root">
//     <Scene key="tabs" tabBarStyle={styles.tabBarStyle} tabs>
//       <Scene key="chatsTab" title="Chats" icon={TabIcon}>
//         <Scene
//           key="groups"
//           component={Groups}
//           title="Chats"
//           hideBackImage
//         />
//       </Scene>
//       <Scene key="settingsTab" title="Settings" icon={TabIcon}>
//         <Scene
//           key="settings"
//           component={Settings}
//           title="Settings"
//           hideBackImage
//         />
//       </Scene>
//     </Scene>
//     <Scene key="signin" direction="vertical">
//       <Scene
//         key="signinModal"
//         component={Signin}
//         title="Chatty"
//         schema="modal"
//         panHandlers={null}
//       />
//     </Scene>
//     <Scene key="newGroup" direction="vertical">
//       <Scene
//         key="newGroupModal"
//         component={NewGroup}
//         title="New Group"
//         schema="modal"
//         panHandlers={null}
//       />
//       <Scene
//         key="finalizeGroup"
//         component={FinalizeGroup}
//         title="New Group"
//       />
//     </Scene>
//     <Scene
//       key="messages"
//       component={Messages}
//     />
//     <Scene key="groupDetails" component={GroupDetails} title="Group Info" />
//   </Scene>,
// );

// export const Routes = connect()(Router);
