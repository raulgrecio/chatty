import dotenv from 'dotenv';

dotenv.config({ silent: true });

export const { JWT_SECRET } = process.env;
export const { GRAPHQL_SERVER } = process.env;
export const { GRAPHQL_PORT } = process.env;

export default JWT_SECRET;
