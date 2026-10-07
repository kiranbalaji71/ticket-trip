"use client";

import { FormEvent, useCallback, useReducer } from "react";

import { createReservation } from "@/lib/api";

export interface ReservationFormValues {
  name: string;
  date: string;
  person: number;
}

export type ReservationStatus = "idle" | "submitting" | "success" | "error";

interface ReservationFormState {
  values: ReservationFormValues;
  status: ReservationStatus;
  message: string;
}

type ReservationFormAction =
  | {
      type: "changed";
      field: keyof ReservationFormValues;
      value: string | number;
    }
  | { type: "submitted" }
  | { type: "succeeded" }
  | { type: "failed"; message: string };

const INITIAL_STATE: ReservationFormState = {
  values: { name: "", date: "", person: 1 },
  status: "idle",
  message: "",
};

function reservationReducer(
  state: ReservationFormState,
  action: ReservationFormAction,
): ReservationFormState {
  switch (action.type) {
    case "changed":
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
      };
    case "submitted":
      return { ...state, status: "submitting", message: "" };
    case "succeeded":
      return {
        ...INITIAL_STATE,
        status: "success",
        message: "Reservation created successfully!",
      };
    case "failed":
      return { ...state, status: "error", message: action.message };
    default:
      return state;
  }
}

export function useReservationForm(
  adventureId: string,
  onReserved?: () => void | Promise<void>,
) {
  const [state, dispatch] = useReducer(reservationReducer, INITIAL_STATE);

  const setField = useCallback(
    (field: keyof ReservationFormValues, value: string | number) =>
      dispatch({ type: "changed", field, value }),
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      dispatch({ type: "submitted" });

      try {
        await createReservation({ ...state.values, adventure: adventureId });
      } catch (error) {
        dispatch({
          type: "failed",
          message: error instanceof Error ? error.message : "Reservation failed",
        });

        return;
      }

      dispatch({ type: "succeeded" });

      try {
        await onReserved?.();
      } catch (error) {
        console.error("Failed to refresh adventure after reservation:", error);
      }
    },
    [adventureId, onReserved, state.values],
  );

  return {
    values: state.values,
    status: state.status,
    message: state.message,
    setField,
    handleSubmit,
  };
}
