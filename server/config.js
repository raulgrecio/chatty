import dotenv from 'dotenv';

dotenv.config({ silent: true });

export const { JWT_SECRET } = process.env;

export const { GRAPHQL_SERVER } = '127.0.0.1';
export const { GRAPHQL_PORT } = '8080';
export const { GRAPHQL_PATH } = '/graphql';
export const { SUBSCRIPTIONS_PATH } = '/subscriptions';

export default JWT_SECRET;
