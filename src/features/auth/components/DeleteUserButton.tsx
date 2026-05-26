'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { adminDeleteUserAction } from '../server/auth.actions';

interface DeleteUserButtonProps {
    userId: string;
}

export const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ userId }) => {
    const actionWrapper = async (formData: FormData) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            await adminDeleteUserAction(formData);
        }
    };

    return (
        <form action={actionWrapper}>
            <input type="hidden" name="id" value={userId} />
            <Button 
                variant="ghost" 
                size="sm" 
                type="submit"
                className="text-red-400 hover:bg-red-500/10" 
                title="Supprimer"
            >
                🗑️
            </Button>
        </form>
    );
};
