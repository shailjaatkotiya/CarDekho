import { gql } from "@apollo/client";

export const ON_ROAD_PRICE_MUTATION = gql`
  mutation OnRoadPrice($variantId: ID!, $stateCode: String!) {
    calculateOnRoadPrice(variantId: $variantId, stateCode: $stateCode) {
      exShowroomPrice
      rtoAmount
      greenTax
      handlingCharge
      totalOnRoadPrice
    }
  }
`;
