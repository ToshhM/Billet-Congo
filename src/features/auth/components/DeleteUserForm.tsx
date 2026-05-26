'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { adminDeleteUserAction } from '../server/auth.actions';

interface DeleteUserFormProps {
    userId: string;
    currentUserId: string;
}

export const DeleteUserForm = ({ userId, currentUserId }: DeleteUserFormProps) => {
    if (userId === currentUserId) return null;

    const handleDelete = async (formData: FormData) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
            await adminDeleteUserAction(formData);
        }
    };

    return (
        <form action={handleDelete}>
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
