import { gql } from "@apollo/client";

export const CAR_FIELDS = gql`
  fragment CarFields on CarType {
    id
    make {
      id
      name
      logoUrl
    }
    model {
      id
      name
      bodyType
      segment
    }
    variant
    priceRange {
      min
      max
    }
    fuelType
    transmission
    topSafetyRating
    topMileage
    seatingCapacity
    images
    features
    isNew
    isEV
  }
`;
