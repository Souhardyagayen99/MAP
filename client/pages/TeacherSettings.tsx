import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DEPARTMENTS } from '@shared/sampleUsers';
import { ArrowLeft, Save, Settings, Bell, Shield } from 'lucide-react';

interface TeacherSettingsData {
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  notificationsEnabled: boolean;
}

export default function TeacherSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<TeacherSettingsData>({
    name: 'Faculty User',
    email: 'faculty@sanjivani.edu.in',
    phone: '+91 9876543210',
    department: DEPARTMENTS[0],
    designation: 'Professor',
    notificationsEnabled: true,
  });

  useEffect(() => {
    const userDataRaw = localStorage.getItem('userData');
    if (userDataRaw) {
      try {
        const userData = JSON.parse(userDataRaw);
        setSettings(prev => ({
          ...prev,
          name: userData.name || prev.name,
          email: userData.email || prev.email,
          phone: userData.phone || prev.phone,
          department: userData.department || prev.department,
          designation: userData.designation || prev.designation,
          notificationsEnabled: userData.notificationsEnabled ?? prev.notificationsEnabled,
        }));
      } catch {}
    }
  }, []);

  const handleSave = () => {
    const userDataRaw = localStorage.getItem('userData');
    const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
    const updated = { ...userData, ...settings };
    localStorage.setItem('userData', JSON.stringify(updated));
    alert('Settings saved');
    navigate('/teacher');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => navigate('/teacher')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Teacher Settings</h1>
                <p className="text-sm text-gray-600">Manage your preferences and account details</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Profile</span>
              </CardTitle>
              <CardDescription>Basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={settings.name} onChange={(e) => setSettings(s => ({ ...s, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={settings.email} onChange={(e) => setSettings(s => ({ ...s, email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={settings.phone} onChange={(e) => setSettings(s => ({ ...s, phone: e.target.value }))} />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Academic</span>
              </CardTitle>
              <CardDescription>Set your department and designation</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={settings.department} onValueChange={(value) => setSettings(s => ({ ...s, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Select value={settings.designation} onValueChange={(value) => setSettings(s => ({ ...s, designation: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'].map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>Manage alerts and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Enable Notifications</div>
                  <div className="text-sm text-gray-600">Get approval requests and activity updates</div>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, notificationsEnabled: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </main>
    </div>
  );
}


