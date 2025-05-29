import { AirportHttpService } from '@api/endpoints/airport.endpoint';
import { queryClient, useMutation, useQuery } from '@lib/react-query';
import { toast } from 'react-toastify';
import {
  CreateAirportRequest,
  GetAllAirportResponse,
  IAirport,
  AirportGetAllParams,
} from '../index.types';

export const useAirportApi = () => {
  const AIRPORT_KEY = 'airports';

  const createAirportMutation = useMutation({
    mutationFn: (payload: CreateAirportRequest) =>
      AirportHttpService.create(payload),
    onError: ({ message }) => toast.error(message),
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [AIRPORT_KEY] });
        toast.success(`${data.airport_name} created successfully`);
      }
    },
  });

  const useGetAirports = (queryString: AirportGetAllParams) =>
    useQuery<GetAllAirportResponse>({
      queryKey: [AIRPORT_KEY, queryString],
      queryFn: () => AirportHttpService.getAll(queryString),
    });

  const updateAirportMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id?: string;
      payload: Partial<IAirport>;
    }) => AirportHttpService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [AIRPORT_KEY] });
      queryClient.invalidateQueries({ queryKey: ['airport', id] });
      toast.success('Airport updated successfully');
    },
  });

  const deleteAirportMutation = useMutation({
    mutationFn: (id: string) => AirportHttpService.delete(id),
    onSuccess: () => {
      toast.success('Airport deleted successfully');
      return queryClient.invalidateQueries({ queryKey: [AIRPORT_KEY] });
    },
  });

  return {
    createAirport: createAirportMutation.mutateAsync,
    updateAirport: updateAirportMutation.mutateAsync,
    deleteAirport: deleteAirportMutation.mutateAsync,
    useGetAirports,
    isCreating: createAirportMutation.isPending,
    isUpdating: updateAirportMutation.isPending,
    isDeleting: deleteAirportMutation.isPending,
  };
};
