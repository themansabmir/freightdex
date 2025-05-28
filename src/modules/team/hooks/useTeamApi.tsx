import { TeamHttpService } from '@api/endpoints/team.endpoint';
import { queryClient, useMutation, useQuery } from '@lib/react-query';
import { ITeam } from '../index.types';
import { GetAllParams } from '@api/endpoints/vendor.endpoint';
import { toast } from 'react-toastify';

export const useTeamApi = () => {
  const TEAM_KEY = 'team';

  /*
        Get all team
    */
  const useGetTeam = (queryString?: GetAllParams) =>
    useQuery<{ response: ITeam[]; total: number }>({
      queryKey: [TEAM_KEY, queryString],
      queryFn: () => TeamHttpService.getAll(queryString),
    });

  /*
    @ Create new team
    */
  const createTeamMutation = useMutation({
    mutationFn: (payload: ITeam) => TeamHttpService.create(payload),
    onError: ({ message }) => toast.error(message),
    onSettled: (data) => {
      if (data) {
        toast.success(`New member added successfully`);
        queryClient.setQueryData([TEAM_KEY], (old: ITeam[]) => {
          const withoutTemp = old?.filter((p) => !p.temp) ?? [];
          return [...withoutTemp, data];
        });
      }
    },
  });

  /*
    Update Team
    */
  const updateTeamMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ITeam> }) => TeamHttpService.update(id, payload),
    onError: ({ message }) => toast.error(message),
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [TEAM_KEY] });
        toast.success(`Team updated successfully`);
      }
    },
  });

  /*
    Delete Team
    */
  const deleteTeamMutation = useMutation({
    mutationFn: (id: string) => TeamHttpService.delete(id),
    onError: ({ message }) => toast.error(message),
    onSettled: (data) => {
      if (data) {
       queryClient.invalidateQueries({ queryKey: [TEAM_KEY] });
        toast.success(`Team member deleted successfully`);
      }
    },
  });

  return {
    // FNs
    createTeam: createTeamMutation.mutateAsync,
    updateTeam: updateTeamMutation.mutateAsync,
    removeTeam: deleteTeamMutation.mutateAsync,
    useGetTeam,
    //  loading states
    isCreating: createTeamMutation.isPending,
    isUpdating: updateTeamMutation.isPending,
    isDeleting: deleteTeamMutation.isPending,
  };
};
