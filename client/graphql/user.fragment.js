import gql from 'graphql-tag';

import MESSAGE_FRAGMENT from './message.fragment';

const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    email
    username
    friends @include(if: $withFriends) {
      id
      username
    }
    groups @include(if: $withGroups) {
      id
      name
      messages(limit: 1) {
        ... MessageFragment
      }
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export default USER_FRAGMENT;
