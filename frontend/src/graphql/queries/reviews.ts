import { gql } from "@apollo/client";

export const REVIEWS_QUERY = gql`
  query Reviews($variantId: ID!, $page: GraphQLPaginationInput) {
    reviews(variantId: $variantId, page: $page) {
      id
      variantId
      ratingOverall
      ratingValue
      ratingComfort
      ratingPerformance
      ratingMileage
      ratingFeatures
      ratingService
      body
      ownershipMonths
      upvotes
      isVerified
      createdAt
    }
  }
`;
