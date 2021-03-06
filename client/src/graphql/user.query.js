import gql from 'graphql-tag';

import MESSAGE_FRAGMENT from './message.fragment';

// get the user and all user's groups
const USER_QUERY = gql`
  query user($id: Int) {
    user(id: $id) {
      id
      email
      username
      friends {
        id
        username
      }
      groups {
        id
        name
        messages(limit: 1) {
          ... MessageFragment
        }
      }
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export default USER_QUERY;
