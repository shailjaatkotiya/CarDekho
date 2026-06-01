import { gql } from "@apollo/client";

import { CAR_FIELDS } from "../fragments/car";

export const COMPARE_QUERY = gql`
  ${CAR_FIELDS}
  query Compare($variantIds: [ID!]!) {
    compare(variantIds: $variantIds) {
      cars {
        ...CarFields
      }
      winnerPerRow {
        key
        label
        winnerVariantId
        values
      }
      verdict
      buyerTypeMatch
    }
  }
`;
