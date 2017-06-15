import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const BORDER_RADIUS = 7.5;
const MESSAGE_OUT_BACKGROUND_COLOR = '#dcf8c6';
const TAIL_WIDTH = 8;
const TAIL_HEIGHT = 12;

const messageShadow = {
  shadowColor: 'rgba(0, 0, 0, .36)',
  shadowOpacity: 0.5,
  shadowRadius: 1,
  shadowOffset: {
    height: 1,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  containerIn: {
    justifyContent: 'flex-start',
  },
  containerOut: {
    justifyContent: 'flex-end',
  },
  message: {
    borderRadius: BORDER_RADIUS,
    marginHorizontal: 16,
    marginVertical: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    maxWidth: '80%',
    ...messageShadow,
  },
  messageIn: {
    backgroundColor: 'white',
    //alignSelf: 'flex-end'
  },
  messageOut: {
    backgroundColor: MESSAGE_OUT_BACKGROUND_COLOR,
    //alignSelf: 'flex-start'
  },
  messageSpacer: {
    marginTop: 12,
  },
  messageOutTail: {
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: 0,
  },
  messageInTail: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: BORDER_RADIUS,
  },
  messageUsername: {
    color: 'red',
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  messageTimeContainer: {
    position: 'absolute',
    bottom: 3,
    right: 6,
  },
  messageTime: {
    color: 'rgba(0,0,0,0.45)',
    fontSize: 11,
    textAlign: 'right',
  },
  tailContainer: {
    position: 'absolute',
    top: 0,
    width: TAIL_WIDTH,
    height: TAIL_HEIGHT,
    overflow: 'hidden',
  },
  tailContainerIn: {
    left: -TAIL_WIDTH,
  },
  tailContainerOut: {
    right: -TAIL_WIDTH,
  },
  tail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: TAIL_WIDTH,
    borderTopWidth: TAIL_HEIGHT,
    borderRightColor: 'transparent',
    ...messageShadow,
  },
  tailIn: {
    borderTopColor: 'white',
    transform: [
      { scaleX: -1 },
    ],
  },
  tailOut: {
    borderTopColor: MESSAGE_OUT_BACKGROUND_COLOR,
  },
});

const Message = ({ color, message, isCurrentUser, isChangeUser }) => (
  <View key={message.id} style={[styles.container, isCurrentUser ? styles.containerOut : styles.containerIn]}>

    <View
      style={[
        styles.message,
        isCurrentUser ? styles.messageOut : styles.messageIn,
        isChangeUser && styles.messageSpacer,
        isChangeUser && !isCurrentUser && styles.messageInTail,
        isChangeUser && isCurrentUser && styles.messageOutTail,
      ]}
    >
      {isChangeUser ?
        <View
          style={[
            styles.tailContainer,
            isCurrentUser ? styles.tailContainerOut : styles.tailContainerIn,
          ]}
        >
          <View
            style={[
              styles.tail,
              isCurrentUser ? styles.tailOut : styles.tailIn,
            ]}
          />
        </View> : undefined
      }

      {isChangeUser && !isCurrentUser ?
        <Text
          style={[
            styles.messageUsername,
            { color },
          ]}
        >{message.from.username}</Text> : undefined
      }

      <Text>{message.text + new Array(21 + 1).join('\u00a0')}</Text>
      <View style={styles.messageTimeContainer}>
        <Text style={styles.messageTime}>{moment(message.createdAt).format('hh:mm')}</Text>
      </View>

    </View>
  </View>
);

Message.propTypes = {
  color: PropTypes.string.isRequired,
  message: PropTypes.shape({
    createdAt: PropTypes.string.isRequired,
    from: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }),
    text: PropTypes.string.isRequired,
  }).isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
  isChangeUser: PropTypes.bool.isRequired,
};

export default Message;
