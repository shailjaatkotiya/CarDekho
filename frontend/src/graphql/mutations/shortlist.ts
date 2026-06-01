import { gql } from "@apollo/client";

export const SAVE_SHORTLIST_MUTATION = gql`
  mutation SaveShortlist($carId: ID!, $token: String) {
    saveShortlist(carId: $carId, token: $token) {
      id
      variantId
      notes
      shareToken
      savedAt
    }
  }
`;

export const REMOVE_SHORTLIST_MUTATION = gql`
  mutation RemoveShortlist($carId: ID!, $token: String) {
    removeShortlist(carId: $carId, token: $token)
  }
`;
