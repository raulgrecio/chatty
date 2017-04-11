import gql from 'graphql-tag';

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
      }
    }
  }
`;

export default USER_QUERY;
