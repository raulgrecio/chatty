import { _ } from 'lodash';
import {
  ListView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { Component, PropTypes } from 'react';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: '#e5ddd5',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 32,
  },
  loading: {
    justifyContent: 'center',
  },
  titleWrapper: {
    alignItems: 'center',
    marginTop: 10,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 15,
      },
      android: {
        top: 5,
      },
    }),
    left: 0,
    right: 0,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleImage: {
    marginRight: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

const fakeData = () => _.times(100, i => ({
  id: i,
  createdAt: new Date().toISOString(),
  from: {
    username: 'Username',
  },
  text: `Message ${i}`,
}));

const Message = ({ message }) => (
  <View key={message.id} style={{ paddingVertical: 10 }}>
    <View>
      <Text>{message.from.username}</Text>
      <Text>{message.text}</Text>
      <Text style={styles.messageTime}>{moment(message.createdAt).format('h:mm A')}</Text>
    </View>
  </View>
);
Message.propTypes = {
  message: PropTypes.shape({
    createdAt: PropTypes.string.isRequired,
    from: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }),
    text: PropTypes.string.isRequired,
  }).isRequired,
};

export class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        .cloneWithRows(fakeData()),
    };
  }

  render() {
    // render list of messages for group
    return (
      <View style={styles.container}>
        <ListView
          style={styles.listView}
          enableEmptySections
          dataSource={this.state.ds}
          renderRow={message => (
            <Message message={message} />
          )}
        />
      </View>
    );
  }
}

Messages.propTypes = {
  groupId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default Messages;
