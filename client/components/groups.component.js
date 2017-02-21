import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import {
  ActivityIndicator,
  Image,
  ListView,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { graphql, compose } from 'react-apollo';
import Icon from 'react-native-vector-icons/FontAwesome';

import { USER_QUERY } from '../graphql/user.query';

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 64 : 54, // nav bar height
    flex: 1,
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
  },
  groupContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  groupTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 6,
  },
  groupImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  groupTitleContainer: {
    flexDirection: 'row',
  },
  groupName: {
    fontWeight: 'bold',
    flex: 0.7,
  },
  groupLastUpdated: {
    flex: 0.3,
    color: '#8c8c8c',
    fontSize: 11,
    textAlign: 'right',
  },
  groupUsername: {
    paddingVertical: 4,
  },
  warning: {
    textAlign: 'center',
    padding: 12,
  },
});

// format createdAt with moment
const formatCreatedAt = createdAt => moment(createdAt).calendar(null, {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: 'dddd',
  sameElse: 'DD/MM/YYYY',
});

export class Group extends Component {
  constructor(props) {
    super(props);
    this.goToMessages = this.props.goToMessages.bind(this, this.props.group);
  }

  render() {
    const { id, name, messages } = this.props.group;

    return (
      <TouchableHighlight
        key={id}
        onPress={this.goToMessages}
      >
        <View style={styles.groupContainer}>
          <Image
            style={styles.groupImage}
            source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }}
          />
          <View style={styles.groupTextContainer}>
            <View style={styles.groupTitleContainer}>
              <Text style={styles.groupName}>{`${name}`}</Text>
              <Text style={styles.groupLastUpdated}>
                {messages.length ? formatCreatedAt(messages[0].createdAt) : ''}
              </Text>
            </View>
            <Text style={styles.groupUsername}>
              {messages.length ? `${messages[0].from.username}:` : ''}
            </Text>
            <Text numberOfLines={1}>{messages.length ? messages[0].text : ''}</Text>
          </View>
          <Icon
            name="angle-right"
            size={24}
            color={'#8c8c8c'}
          />
        </View>
      </TouchableHighlight>
    );
  }
}

Group.propTypes = {
  goToMessages: PropTypes.func.isRequired,
  group: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    messages: PropTypes.array,
  }),
};

export class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
    };

    this.goToMessages = this.goToMessages.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log('oldProps', this.props);
    console.log('nextProps', nextProps);
    const oldData = this.props;
    const newData = nextProps;

    // check for new messages
    if (!!newData.user && !!newData.user.groups &&
      (!oldData || !oldData.user || newData.user.groups !== oldData.user.groups)) {
      // convert groups Array to ListView.DataSource
      // we will use this.state.ds to populate our ListView
      this.setState({
        // cloneWithRows computes a diff and decides whether to rerender
        ds: this.state.ds.cloneWithRows(newData.user.groups),
      });
    }
  }

  goToMessages(group) {
    Actions.messages({ user: this.props.user, groupId: group.id, title: group.name });
  }

  render() {
    const { loading, user } = this.props;

    // render loading placeholder while we fetch messages
    if (loading) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    if (!!user && !user.groups.length) {
      return (
        <View style={styles.container}>
          <Text style={styles.warning}>{'You do not have any groups.'}</Text>
        </View>
      );
    }

    // render list of groups for user
    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections
          dataSource={this.state.ds}
          renderRow={(group => (
            <Group group={group} goToMessages={this.goToMessages} />
          ))}
        />
      </View>
    );
  }
}
Groups.propTypes = {
  loading: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.number,
    groups: PropTypes.array,
  }),
};

const userQuery = graphql(USER_QUERY, {
  options: () => ({ variables: { id: 1 } }),
  props: ({ data: { loading, user } }) => ({
    loading, user,
  }),
});

export default compose(
  userQuery,
)(Groups);
