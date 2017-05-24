import gql from 'graphql-tag';

import USER_FRAGMENT from './user.fragment';

const SIGNUP_MUTATION = gql`
  mutation signup($email: String!, $password: String!, $withFriends: Boolean = false, $withGroups: Boolean = false) {
    signup(email: $email, password: $password) {
      jwt
    }
  }
  ${USER_FRAGMENT}
`;

export default SIGNUP_MUTATION;
