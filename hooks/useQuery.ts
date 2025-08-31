import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { apiClient } from '@/lib/api/api-client';
import { IUser } from '@/lib/types/user.type';
import { ICar } from '@/lib/types/car.type';
import { Incident } from '@/lib/types/incident';

export interface IncidentFilters {
    status?: string;
    severity?: string;
    carId?: number;
    assignedToId?: number;
    startDate?: string;
    endDate?: string;
    query?: string;
    page?: number;
    limit?: number;
}

export interface IncidentStats {
    total: number;
    byStatus: Record<string, number>;
    bySeverity: Record<string, number>;
    avgResolutionTime: number;
    openIncidents: number;
}

// Query Functions
export const fetchIncidents = async (filters: IncidentFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
        }
    });

    const endpoint = params.toString() ? `/incidents?${params}` : '/incidents';
    return (await apiClient.get(endpoint)).data;
};

export const fetchIncidentDetail = async (id: string) => {
    return (await apiClient.get(`/incidents/${id}`)).data as Incident;
};

export const fetchIncidentStats = async () => {
    return apiClient.get<IncidentStats>('/incidents/stats');
};

export const fetchUsers = async () => {
    return (await apiClient.get('/users')).data as IUser[]
}

export const fetchCars = async () => {
    return (await apiClient.get('/cars')).data as ICar[]
}

export const fetchCarReadings = async () => {
    return apiClient.get('/car-readings')
}

// Custom Hooks
export const useIncidents = (filters: IncidentFilters = {}) => {
    return useQuery({
        queryKey: queryKeys.incidents.list(filters),
        queryFn: () => fetchIncidents(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes
        placeholderData: (previousData) => previousData,
    });
};

export const useIncidentDetail = (id: string) => {
    return useQuery({
        queryKey: queryKeys.incidents.detail(id),
        queryFn: () => fetchIncidentDetail(id),
        enabled: !!id,
        staleTime: 1 * 60 * 1000,
    });
};

export const useIncidentStats = () => {
    return useQuery({
        queryKey: queryKeys.incidents.stats(),
        queryFn: fetchIncidentStats,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useFetchUsers = () => {
    return useQuery({
        queryKey: queryKeys.users.list(),
        queryFn: fetchUsers,
        staleTime: 2 * 60 * 1000
    })
}

export const useFetchCars = () => {
    return useQuery({
        queryKey: queryKeys.cars.list(),
        queryFn: fetchCars,
        staleTime: 2 * 60 * 1000
    })
}

export const useFetchCarReadings = () => {
    return useQuery({
        queryKey: queryKeys.carReadings.list(),
        queryFn: fetchCarReadings,
        staleTime: 2 * 60 * 1000
    })
}

// Mutations
export const useCreateIncident = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => {
            console.log("is FormData:", data instanceof FormData);
            return apiClient.post('/incidents', data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.incidents.list() });
            queryClient.invalidateQueries({ queryKey: queryKeys.incidents.stats() });
        },
    });
};

export const useUpdateIncident = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) =>
            apiClient.put(`/incidents/${id}`, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.incidents.list() });
            queryClient.invalidateQueries({ queryKey: queryKeys.incidents.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.incidents.stats() });
        },
    });
};

export const useAddIncidentComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, comment }: { id: string; comment: string }) =>
            apiClient.post(`/incidents/${id}/updates`, { message: comment, updateType: 'COMMENT' }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.incidents.detail(variables.id) });
        },
    });
};