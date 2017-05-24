import gql from 'graphql-tag';

import USER_FRAGMENT from './user.fragment';

// get the user and all user's groups
const USER_QUERY = gql`
  query user($id: Int, $withGroups: Boolean = false, $withFriends: Boolean = false) {
    user(id: $id) {
      ... UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

export default USER_QUERY;
