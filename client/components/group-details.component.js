// TODO: update group functionality
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Button,
  Image,
  ListView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import { NavigationActions } from 'react-navigation';

import GROUP_QUERY from '../graphql/group.query';
import DELETE_GROUP_MUTATION from '../graphql/deleteGroup.mutation';
import LEAVE_GROUP_MUTATION from '../graphql/leaveGroup.mutation';

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'Main' }),
  ],
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listView: {

  },
  groupImageContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 6,
    alignItems: 'center',
  },
  groupName: {
    color: 'black',
  },
  groupNameBorder: {
    borderBottomWidth: 1,
    borderColor: '#dbdbdb',
    borderTopWidth: 1,
    flex: 1,
    paddingVertical: 8,
  },
  groupImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  participants: {
    borderBottomWidth: 1,
    borderColor: '#dbdbdb',
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 6,
    backgroundColor: '#dbdbdb',
    color: '#777',
  },
  user: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#dbdbdb',
    flexDirection: 'row',
    padding: 10,
  },
  username: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

class GroupDetails extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
  });

  constructor(props) {
    super(props);

    console.log(props);

    this.state = {
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        .cloneWithRows(props.loading ? [] : props.group.users),
    };

    this.deleteGroup = this.deleteGroup.bind(this);
    this.leaveGroup = this.leaveGroup.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.group && nextProps.group.users && nextProps.group !== this.props.group) {
      this.setState({
        ds: this.state.ds.cloneWithRows(nextProps.group.users),
      });
    }
  }

  deleteGroup() {
    this.props.deleteGroup(this.props.navigation.state.params.id)
      .then(() => {
        this.props.navigation.dispatch(resetAction);
      })
      .catch((e) => {
        console.log(e);   // eslint-disable-line no-console
      });
  }

  leaveGroup() {
    this.props.leaveGroup(this.props.navigation.state.params.id)
      .then(() => {
        this.props.navigation.dispatch(resetAction);
      })
      .catch((e) => {
        console.log(e);   // eslint-disable-line no-console
      });
  }

  render() {
    const { group, loading } = this.props;

    // render loading placeholder while we fetch messages
    if (!group || loading) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ListView
          style={styles.listView}
          enableEmptySections
          dataSource={this.state.ds}
          renderHeader={() => (
            <View>
              <View style={styles.detailsContainer}>
                <TouchableOpacity style={styles.groupImageContainer} onPress={this.pickGroupImage}>
                  <Image
                    style={styles.groupImage}
                    source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }}
                  />
                  <Text>edit</Text>
                </TouchableOpacity>
                <View style={styles.groupNameBorder}>
                  <Text style={styles.groupName}>{group.name}</Text>
                </View>
              </View>
              <Text style={styles.participants}>
                {`participants: ${group.users.length}`.toUpperCase()}
              </Text>
            </View>
          )}
          renderFooter={() => (
            <View>
              <Button title={'Leave Group'} onPress={this.leaveGroup} />
              <Button title={'Delete Group'} onPress={this.deleteGroup} />
            </View>
          )}
          renderRow={user => (
            <View style={styles.user}>
              <Image
                style={styles.avatar}
                source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }}
              />
              <Text style={styles.username}>{user.username}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}

GroupDetails.propTypes = {
  loading: PropTypes.bool,
  group: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    users: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string,
    })),
  }),
  deleteGroup: PropTypes.func.isRequired,
  leaveGroup: PropTypes.func.isRequired,
};

const groupQuery = graphql(GROUP_QUERY, {
  options: ownProps => ({ variables: { groupId: ownProps.navigation.state.params.id } }),
  props: ({ data: { loading, group } }) => ({
    loading,
    group,
  }),
});

const deleteGroup = graphql(DELETE_GROUP_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    deleteGroup: id =>
      mutate({
        variables: { id },
        updateQueries: {
          user: (previousResult, { mutationResult }) => {
            const removedGroup = mutationResult.data.deleteGroup;

            if (!previousResult.user.groups) {
              return;
            }

            return update(previousResult, {
              user: {
                groups: {
                  $set: previousResult.user.groups
                    .filter(g => removedGroup.id !== g.id),
                },
              },
            });
          },
        },
      }),
  }),
});

const leaveGroup = graphql(LEAVE_GROUP_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    leaveGroup: id =>
      mutate({
        variables: { id },
        updateQueries: {
          user: (previousResult, { mutationResult }) => {
            const removedGroup = mutationResult.data.leaveGroup;

            if (!previousResult.user.groups) {
              return;
            }

            return update(previousResult, {
              user: {
                groups: {
                  $set: previousResult.user.groups
                    .filter(g => removedGroup.id !== g.id),
                },
              },
            });
          },
        },
      }),
  }),
});

export default compose(
  groupQuery,
  deleteGroup,
  leaveGroup,
)(GroupDetails);
