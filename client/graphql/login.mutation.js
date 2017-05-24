import gql from 'graphql-tag';

import USER_FRAGMENT from './user.fragment';

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!, $withFriends: Boolean = false, $withGroups: Boolean = false) {
    login(email: $email, password: $password) {
      jwt
      ... UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

export default LOGIN_MUTATION;
