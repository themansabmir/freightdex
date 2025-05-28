// hooks/useFormValidation.ts
import { isEqual } from 'lodash';
import { useEffect, useReducer, useRef } from 'react';
import { ZodError, ZodSchema } from 'zod';

type FormState<T> = {
  values: T;
  errors: Partial<Record<keyof T, string>>;
};

type FormAction<T> =
  | { type: 'SET_ALL_FIELDS'; values: T }
  | { type: 'UPDATE_FIELD'; field: keyof T; value: string }
  | { type: 'SET_ERRORS'; errors: Partial<Record<keyof T, string>> }
  | { type: 'RESET' };

function formReducer<T>(state: FormState<T>, action: FormAction<T>): FormState<T> {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        errors: {},
      };
    case 'SET_ALL_FIELDS':
      return {
        ...state,
        values: action.values,
        errors: {},
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    // case 'RESET':
    //   const emptyValues = Object.fromEntries(Object.keys(state.values).map((key) => [key, ''])) as T;
    //   return { values: emptyValues, errors: {} };
    default:
      return state;
  }
}

export function useFormValidation<T extends Record<string, any>>(schema: ZodSchema<T>, initialValues: T) {
  const [state, dispatch] = useReducer(formReducer<T>, {
    values: initialValues,
    errors: {},
  });

  const previousValuesRef = useRef<T>(initialValues);

  useEffect(() => {
    if (!isEqual(previousValuesRef.current, initialValues)) {
      previousValuesRef.current = initialValues;
      dispatch({ type: 'SET_ALL_FIELDS', values: initialValues });
    }
  }, [initialValues]);

  const handleChange = (name: string, value) => {
    dispatch({ type: 'UPDATE_FIELD', field: name as keyof T, value });
  };

  const validate = (): boolean => {
    try {
      schema.parse(state.values);
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.reduce((acc, curr) => {
          const key = curr.path.join('.') as keyof T;
          acc[key] = curr.message;
          return acc;
        }, {} as Partial<Record<keyof T, string>>);
        dispatch({ type: 'SET_ERRORS', errors });
      }
      return false;
    }
  };

  const reset = () => dispatch({ type: 'RESET' });

  return {
    values: state.values,
    errors: state.errors,
    handleChange,
    validate,
    reset,
  };
}
