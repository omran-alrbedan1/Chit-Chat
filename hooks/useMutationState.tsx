import { useMutation } from "convex/react";
import { useState } from "react";

export const useMutationState = (mutationToRun: any) => {
  const [pending, setPending] = useState(false);

  const mutationFn = useMutation(mutationToRun);

  const mutate = async   (payload: any) => {
    setPending(false);
    return mutationFn(payload)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => setPending(false));
  };
  return { mutate, pending };
};
