import { useMutation } from "@tanstack/react-query";
import { gql } from "@apollo/client";

import { apolloClient } from "../../../lib/apollo";

const SET_ALERT_MUTATION = gql`
  mutation SetAlert($input: AlertInput!) {
    setAlert(input: $input)
  }
`;

export const useAlerts = () =>
  useMutation({
    mutationFn: async (payload: { alertType: string; targetId?: number; thresholdPrice?: number }) => {
      await apolloClient.mutate({
        mutation: SET_ALERT_MUTATION,
        variables: {
          input: {
            alertType: payload.alertType,
            targetId: payload.targetId,
            thresholdPrice: payload.thresholdPrice
          }
        }
      });
    }
  });
