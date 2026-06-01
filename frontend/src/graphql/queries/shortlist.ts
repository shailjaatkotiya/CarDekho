import { gql } from "@apollo/client";

export const SHORTLIST_QUERY = gql`
  query Shortlist($token: String) {
    shortlist(token: $token) {
      id
      variantId
      notes
      shareToken
      savedAt
    }
  }
`;
