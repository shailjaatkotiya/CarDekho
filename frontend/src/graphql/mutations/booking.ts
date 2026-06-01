import { gql } from "@apollo/client";

export const BOOK_TEST_DRIVE_MUTATION = gql`
  mutation BookTestDrive($input: TestDriveInput!) {
    bookTestDrive(input: $input) {
      status
      message
    }
  }
`;
