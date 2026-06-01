import { gql } from "@apollo/client";

import { CAR_FIELDS } from "../fragments/car";

export const RECOMMEND_QUERY = gql`
  ${CAR_FIELDS}
  query Recommend($input: GraphQLDiscoveryInput!) {
    recommend(input: $input) {
      car {
        ...CarFields
      }
      confidenceScore
      reasoning
      matchReasons
      tradeoffs
      bestFor
    }
  }
`;
