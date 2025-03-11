
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['USER', 'ADMIN']),
  plan: z.enum(['FREE', 'PREMIUM']),
  remainingTime: z.number().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserFormProps {
  user: any;
  onSuccess: () => void;
}

const EditUserForm = ({ user, onSuccess }: EditUserFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.displayName || '',
      role: user.role || 'USER',
      plan: user.plan || 'FREE',
      remainingTime: user.remainingTime || null,
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const userRef = doc(db, 'users', user.id);
      
      // Prepare update data
      const updateData: any = {
        displayName: data.name,
        role: data.role,
        plan: data.plan,
      };
      
      // If plan changed from PREMIUM to FREE, set remaining time
      if (user.plan === 'PREMIUM' && data.plan === 'FREE') {
        updateData.remainingTime = 2700; // 45 minutes in seconds
      }
      
      // If plan changed from FREE to PREMIUM, remove remaining time limit
      if (user.plan === 'FREE' && data.plan === 'PREMIUM') {
        updateData.remainingTime = 0; // Unlimited
      }
      
      // If a specific remaining time was set
      if (data.remainingTime !== null && data.remainingTime !== undefined) {
        updateData.remainingTime = data.remainingTime;
      }
      
      // Update the user document
      await updateDoc(userRef, updateData);
      
      // Sync with Postgres
      await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.id,
          email: user.email,
          name: data.name,
          role: data.role,
          plan: data.plan,
          remainingTime: updateData.remainingTime
        }),
      });
      
      onSuccess();
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Email: {user.email}</p>
        </div>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="User's full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subscription plan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {form.watch('plan') === 'FREE' && (
          <FormField
            control={form.control}
            name="remainingTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remaining Time (seconds)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Default: 2700 (45 minutes)" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditUserForm;
