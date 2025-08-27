import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Settings, 
  Shield, 
  Users, 
  Database,
  Save,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  category: string;
}

const MOCK_PERMISSIONS: Permission[] = [
  {
    id: 'view_students',
    name: 'View Students',
    description: 'View student profiles and information',
    category: 'Student Management',
    enabled: true
  },
  {
    id: 'manage_students',
    name: 'Manage Students',
    description: 'Add, edit, and delete student accounts',
    category: 'Student Management',
    enabled: true
  },
  {
    id: 'view_teachers',
    name: 'View Teachers',
    description: 'View teacher profiles and information',
    category: 'Teacher Management',
    enabled: true
  },
  {
    id: 'manage_teachers',
    name: 'Manage Teachers',
    description: 'Add, edit, and delete teacher accounts',
    category: 'Teacher Management',
    enabled: true
  },
  {
    id: 'approve_activities',
    name: 'Approve Activities',
    description: 'Approve or reject student activity submissions',
    category: 'Activity Management',
    enabled: true
  },
  {
    id: 'create_events',
    name: 'Create Events',
    description: 'Create and manage events for students',
    category: 'Activity Management',
    enabled: true
  },
  {
    id: 'system_admin',
    name: 'System Administration',
    description: 'Full system access and configuration',
    category: 'System',
    enabled: true
  },
  {
    id: 'view_reports',
    name: 'View Reports',
    description: 'Access system reports and analytics',
    category: 'Reporting',
    enabled: true
  },
  {
    id: 'export_data',
    name: 'Export Data',
    description: 'Export system data and reports',
    category: 'Reporting',
    enabled: true
  }
];

const MOCK_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: ['view_students', 'manage_students', 'view_teachers', 'manage_teachers', 'approve_activities', 'create_events', 'system_admin', 'view_reports', 'export_data'],
    userCount: 3
  },
  {
    id: 'teacher',
    name: 'Teacher',
    description: 'Faculty members with activity approval permissions',
    permissions: ['view_students', 'approve_activities', 'create_events', 'view_reports'],
    userCount: 89
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Students with limited access to submit activities',
    permissions: [],
    userCount: 2543
  },
  {
    id: 'head_teacher',
    name: 'Head Teacher',
    description: 'Department heads with extended permissions',
    permissions: ['view_students', 'manage_students', 'view_teachers', 'approve_activities', 'create_events', 'view_reports', 'export_data'],
    userCount: 12
  }
];

const MOCK_SYSTEM_CONFIG: SystemConfig[] = [
  {
    id: '1',
    key: 'MAP_POINTS_REQUIRED_BTECH',
    value: '60',
    description: 'Minimum MAP points required for B.Tech students',
    type: 'number',
    category: 'Academic Requirements'
  },
  {
    id: '2',
    key: 'MAP_POINTS_REQUIRED_MBA',
    value: '70',
    description: 'Minimum MAP points required for MBA students',
    type: 'number',
    category: 'Academic Requirements'
  },
  {
    id: '3',
    key: 'FILE_UPLOAD_MAX_SIZE',
    value: '10485760',
    description: 'Maximum file upload size in bytes (10MB)',
    type: 'number',
    category: 'System Limits'
  },
  {
    id: '4',
    key: 'EMAIL_NOTIFICATIONS_ENABLED',
    value: 'true',
    description: 'Enable email notifications for users',
    type: 'boolean',
    category: 'Notifications'
  },
  {
    id: '5',
    key: 'ACTIVITY_AUTO_APPROVAL',
    value: 'false',
    description: 'Enable automatic approval for certain activities',
    type: 'boolean',
    category: 'Activity Management'
  },
  {
    id: '6',
    key: 'UNIVERSITY_NAME',
    value: 'Sanjivani University',
    description: 'Official university name displayed in the system',
    type: 'string',
    category: 'General'
  }
];

export default function SystemSettings() {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<Permission[]>(MOCK_PERMISSIONS);
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [systemConfig, setSystemConfig] = useState<SystemConfig[]>(MOCK_SYSTEM_CONFIG);
  const [activeTab, setActiveTab] = useState('permissions');

  const handlePermissionToggle = (permissionId: string) => {
    setPermissions(prev => 
      prev.map(p => 
        p.id === permissionId ? { ...p, enabled: !p.enabled } : p
      )
    );
  };

  const handleConfigUpdate = (configId: string, value: string) => {
    setSystemConfig(prev =>
      prev.map(config =>
        config.id === configId ? { ...config, value } : config
      )
    );
  };

  const getPermissionsByCategory = (category: string) => {
    return permissions.filter(p => p.category === category);
  };

  const getConfigByCategory = (category: string) => {
    return systemConfig.filter(c => c.category === category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">System Settings</h1>
                <p className="text-sm text-gray-600">Manage permissions, roles, and system configuration</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="roles">User Roles</TabsTrigger>
            <TabsTrigger value="config">System Config</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Permissions Management */}
          <TabsContent value="permissions">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>System Permissions</span>
                  </CardTitle>
                  <CardDescription>
                    Manage individual permissions available in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {['Student Management', 'Teacher Management', 'Activity Management', 'System', 'Reporting'].map(category => (
                      <div key={category} className="space-y-3">
                        <h3 className="font-medium text-gray-900">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {getPermissionsByCategory(category).map(permission => (
                            <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium">{permission.name}</div>
                                <div className="text-sm text-gray-600">{permission.description}</div>
                              </div>
                              <Switch
                                checked={permission.enabled}
                                onCheckedChange={() => handlePermissionToggle(permission.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Role Management */}
          <TabsContent value="roles">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>User Roles</span>
                      </CardTitle>
                      <CardDescription>
                        Manage user roles and their associated permissions
                      </CardDescription>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Role
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roles.map(role => (
                      <Card key={role.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-medium">{role.name}</h3>
                                <Badge variant="outline">{role.userCount} users</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {role.permissions.map(permissionId => {
                                  const permission = permissions.find(p => p.id === permissionId);
                                  return permission ? (
                                    <Badge key={permissionId} variant="secondary" className="text-xs">
                                      {permission.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" disabled={role.id === 'admin'}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Configuration */}
          <TabsContent value="config">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>System Configuration</span>
                  </CardTitle>
                  <CardDescription>
                    Configure system-wide settings and parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {['General', 'Academic Requirements', 'System Limits', 'Notifications', 'Activity Management'].map(category => (
                      <div key={category} className="space-y-3">
                        <h3 className="font-medium text-gray-900">{category}</h3>
                        <div className="space-y-3">
                          {getConfigByCategory(category).map(config => (
                            <div key={config.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">{config.key}</div>
                                <div className="text-sm text-gray-600">{config.description}</div>
                              </div>
                              <div>
                                <Badge variant="outline" className="text-xs">
                                  {config.type}
                                </Badge>
                              </div>
                              <div>
                                {config.type === 'boolean' ? (
                                  <Switch
                                    checked={config.value === 'true'}
                                    onCheckedChange={(checked) => 
                                      handleConfigUpdate(config.id, checked.toString())
                                    }
                                  />
                                ) : config.type === 'number' ? (
                                  <Input
                                    type="number"
                                    value={config.value}
                                    onChange={(e) => handleConfigUpdate(config.id, e.target.value)}
                                    className="w-full"
                                  />
                                ) : (
                                  <Input
                                    value={config.value}
                                    onChange={(e) => handleConfigUpdate(config.id, e.target.value)}
                                    className="w-full"
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Configure security policies and access controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Password Policy</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Minimum Password Length</Label>
                          <Input type="number" defaultValue="8" className="w-20" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Require Special Characters</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Require Numbers</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Password Expiry (days)</Label>
                          <Input type="number" defaultValue="90" className="w-20" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Session Management</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Session Timeout (minutes)</Label>
                          <Input type="number" defaultValue="60" className="w-20" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Max Login Attempts</Label>
                          <Input type="number" defaultValue="5" className="w-20" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Account Lockout Duration (minutes)</Label>
                          <Input type="number" defaultValue="30" className="w-20" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Enable Two-Factor Authentication</Label>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-4">Access Control</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">IP Whitelist</div>
                          <div className="text-sm text-gray-600">Restrict access to specific IP addresses</div>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Audit Logging</div>
                          <div className="text-sm text-gray-600">Log all user actions for security auditing</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Force HTTPS</div>
                          <div className="text-sm text-gray-600">Redirect all HTTP traffic to HTTPS</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-4">Data Protection</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Data Retention Period (days)</Label>
                        <Input type="number" defaultValue="2555" placeholder="7 years" />
                        <p className="text-xs text-gray-500">How long to keep user data before automatic deletion</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Backup Frequency</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
