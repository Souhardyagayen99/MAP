import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DEPARTMENTS, ACADEMIC_YEARS, DIVISIONS } from '@shared/sampleUsers';
import { ArrowLeft, Save, Settings, Bell, Moon, Sun } from 'lucide-react';

interface StudentSettingsData {
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  division: string;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

export default function StudentSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<StudentSettingsData>({
    name: 'Student User',
    email: 'student@sanjivani.edu.in',
    phone: '+91 9876543210',
    department: DEPARTMENTS[0],
    year: ACADEMIC_YEARS[0],
    division: DIVISIONS[0],
    notificationsEnabled: true,
    theme: 'system'
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
          year: userData.year || prev.year,
          division: userData.division || prev.division,
          theme: userData.theme || prev.theme,
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
    navigate('/student');
  };

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => navigate('/student')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Student Settings</h1>
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
              <CardDescription>Basic information used across the system</CardDescription>
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
              <CardTitle>Academic</CardTitle>
              <CardDescription>Set your department, year and division</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label>Academic Year</Label>
                <Select value={settings.year} onValueChange={(value) => setSettings(s => ({ ...s, year: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACADEMIC_YEARS.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Division</Label>
                <Select value={settings.division} onValueChange={(value) => setSettings(s => ({ ...s, division: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIVISIONS.map((div) => (
                      <SelectItem key={div} value={div}>{div}</SelectItem>
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
                  <div className="text-sm text-gray-600">Receive activity and approval updates</div>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, notificationsEnabled: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Moon className="h-5 w-5" />
                <Sun className="h-5 w-5" />
                <span>Theme</span>
              </CardTitle>
              <CardDescription>Choose how the app looks</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant={settings.theme === 'light' ? 'default' : 'outline'}
                onClick={() => { setSettings(s => ({ ...s, theme: 'light' })); applyTheme('light'); }}
              >
                Light
              </Button>
              <Button
                variant={settings.theme === 'dark' ? 'default' : 'outline'}
                onClick={() => { setSettings(s => ({ ...s, theme: 'dark' })); applyTheme('dark'); }}
              >
                Dark
              </Button>
              <Button
                variant={settings.theme === 'system' ? 'default' : 'outline'}
                onClick={() => { setSettings(s => ({ ...s, theme: 'system' })); applyTheme('system'); }}
              >
                System
              </Button>
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


