import { gql } from "@apollo/client";

export const SUBMIT_REVIEW_MUTATION = gql`
  mutation SubmitReview($input: ReviewInput!) {
    submitReview(input: $input) {
      id
      variantId
      ratingOverall
      body
    }
  }
`;
