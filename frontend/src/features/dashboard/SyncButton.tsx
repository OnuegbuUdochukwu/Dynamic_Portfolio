import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';

export function SyncButton() {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            await api.post('/sync');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['skills'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });

    return (
        <button
            onClick={() => mutate()}
            disabled={isPending}
            className={cn(
                "flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50",
                isPending && "cursor-not-allowed"
            )}
        >
            <RefreshCw className={cn("w-4 h-4", isPending && "animate-spin")} />
            {isPending ? 'Syncing...' : 'Sync GitHub'}
        </button>
    );
}
