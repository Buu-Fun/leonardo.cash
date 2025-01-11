import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: ['http://localhost:42069'],
  documents: './src/gql/documents/**/*.ts',
  generates: {
    './src/gql/types/': {
      preset: 'client-preset',
    },
  },
};
export default config;
