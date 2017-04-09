import gql from 'graphql-tag';

// get the user, all user's groups, and the most recent message for each group
const MESSAGE_FRAGMENT = gql`
  fragment MessageFragment on Message {
    id
    from {
      id
      username
    }
    createdAt
    text
  }
`;

export default MESSAGE_FRAGMENT;
