import { gql } from "@apollo/client";

import { CAR_FIELDS } from "../fragments/car";

export const CARS_QUERY = gql`
  ${CAR_FIELDS}
  query Cars($filter: GraphQLCarFilterInput, $page: GraphQLPaginationInput) {
    cars(filter: $filter, page: $page) {
      nodes {
        ...CarFields
      }
      pageInfo {
        total
        limit
        offset
      }
    }
  }
`;

export const CAR_DETAIL_QUERY = gql`
  ${CAR_FIELDS}
  query Car($id: ID!) {
    car(id: $id) {
      ...CarFields
      featureGroups {
        category
        items
      }
    }
  }
`;

export const SIMILAR_CARS_QUERY = gql`
  ${CAR_FIELDS}
  query SimilarCars($id: ID!, $limit: Int) {
    similarCars(id: $id, limit: $limit) {
      ...CarFields
    }
  }
`;

export const UPCOMING_QUERY = gql`
  ${CAR_FIELDS}
  query Upcoming($page: GraphQLPaginationInput) {
    upcomingCars(page: $page) {
      nodes {
        ...CarFields
      }
      pageInfo {
        total
        limit
        offset
      }
    }
  }
`;
