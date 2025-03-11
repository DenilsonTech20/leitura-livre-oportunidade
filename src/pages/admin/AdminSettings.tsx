
import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Database, Shield, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { syncAllData } from '@/services/syncService';
import { createAdminUser } from '@/lib/firebase';

const AdminSettings = () => {
  const [syncLoading, setSyncLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  
  const handleSync = async () => {
    try {
      setSyncLoading(true);
      await syncAllData();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setSyncLoading(false);
    }
  };
  
  const handleCreateAdmin = async () => {
    try {
      setAdminLoading(true);
      // This would normally prompt for email/password, but for demo we'll hardcode
      await createAdminUser('admin@example.com', 'admin123');
      toast({
        title: 'Admin user created',
        description: 'Admin user has been created or updated successfully.',
      });
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast({
        title: 'Error creating admin',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setAdminLoading(false);
    }
  };
  
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage system settings and synchronization</p>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>View current system status and information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Environment:</span>
                    <span className="font-medium">Production</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version:</span>
                    <span className="font-medium">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Sync:</span>
                    <span className="font-medium">N/A</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="database" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Synchronization</CardTitle>
                <CardDescription>
                  Synchronize data between Firebase and PostgreSQL
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This will sync all users, books, and loans from Firebase to the PostgreSQL database.
                  Use this if you're seeing data inconsistencies between the two databases.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      This operation may take some time depending on the amount of data. 
                      Do not close the browser during synchronization.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSync} 
                  disabled={syncLoading}
                >
                  <Database className="mr-2 h-4 w-4" />
                  {syncLoading ? 'Syncing...' : 'Sync Now'}
                  {syncLoading && <RefreshCw className="ml-2 h-4 w-4 animate-spin" />}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Administrator Access</CardTitle>
                <CardDescription>
                  Manage administrator accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a default admin user in case you need to reset access.
                  This will create or update the admin user with the default credentials.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      Only use this function if you need to reset admin access. 
                      The default admin email will be admin@example.com with password admin123.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleCreateAdmin} 
                  disabled={adminLoading}
                  variant="outline"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  {adminLoading ? 'Creating...' : 'Create Default Admin'}
                  {adminLoading && <RefreshCw className="ml-2 h-4 w-4 animate-spin" />}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettings;
