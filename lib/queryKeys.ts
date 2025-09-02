const queryKeys = {
    incidents: {
        list: (filters?: Record<string, any>) => ['incidents', filters] as const,
        detail: (id: string) => ['incidents', 'detail', id] as const,
        stats: () => ['incidents', 'stats'] as const,
    },
    users: {
        list: () => ['users'] as const,
    },
    cars: {
        list: () => ['cars'] as const,
    },
    carReadings: {
        list: () => ['carReadings'] as const,
    },
};

export default queryKeys