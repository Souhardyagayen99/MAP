import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Trophy, Users, BarChart3, MapPin, FileText, Shield } from 'lucide-react';
import { DEPARTMENTS, ACADEMIC_YEARS, DIVISIONS, PROGRAMS } from '@shared/sampleUsers';

export default function Index() {
  const [loginType, setLoginType] = useState<'student' | 'teacher' | 'admin'>('student');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  // Form state
  const [studentForm, setStudentForm] = useState({
    enrollmentNumber: '',
    name: '',
    email: '',
    password: '',
    department: '',
    year: '',
    division: '',
    program: ''
  });

  const [teacherForm, setTeacherForm] = useState({
    facultyId: '',
    name: '',
    email: '',
    password: '',
    department: '',
    designation: ''
  });

  const [adminForm, setAdminForm] = useState({
    adminId: '',
    name: '',
    email: '',
    password: ''
  });

  const loadAccounts = (role: 'student' | 'teacher' | 'admin') => {
    const key = `accounts_${role}`;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveAccounts = (role: 'student' | 'teacher' | 'admin', accounts: any[]) => {
    const key = `accounts_${role}`;
    localStorage.setItem(key, JSON.stringify(accounts));
  };

  const createAccount = (role: 'student' | 'teacher' | 'admin') => {
    if (role === 'student') {
      const required = ['enrollmentNumber', 'name', 'email', 'password', 'department', 'year', 'division', 'program'] as const;
      const missing = required.filter((k) => !(studentForm as any)[k]);
      if (missing.length) {
        alert('Please fill all fields');
        return;
      }
      const accounts = loadAccounts('student');
      if (accounts.some((a: any) => a.enrollmentNumber === studentForm.enrollmentNumber)) {
        alert('Account already exists with this Enrollment Number');
        return;
      }
      accounts.push({ ...studentForm });
      saveAccounts('student', accounts);
      alert('Student account created. Please login.');
      setAuthMode('login');
      return;
    }
    if (role === 'teacher') {
      const required = ['facultyId', 'name', 'email', 'password', 'department', 'designation'] as const;
      const missing = required.filter((k) => !(teacherForm as any)[k]);
      if (missing.length) {
        alert('Please fill all fields');
        return;
      }
      const accounts = loadAccounts('teacher');
      if (accounts.some((a: any) => a.facultyId === teacherForm.facultyId)) {
        alert('Account already exists with this Faculty ID');
        return;
      }
      accounts.push({ ...teacherForm });
      saveAccounts('teacher', accounts);
      alert('Teacher account created. Please login.');
      setAuthMode('login');
      return;
    }
    const required = ['adminId', 'name', 'email', 'password'] as const;
    const missing = required.filter((k) => !(adminForm as any)[k]);
    if (missing.length) {
      alert('Please fill all fields');
      return;
    }
    const accounts = loadAccounts('admin');
    if (accounts.some((a: any) => a.adminId === adminForm.adminId)) {
      alert('Account already exists with this Admin ID');
      return;
    }
    accounts.push({ ...adminForm, role: 'Administrator' });
    saveAccounts('admin', accounts);
    alert('Admin account created. Please login.');
    setAuthMode('login');
  };

  const handleLogin = (role: 'student' | 'teacher' | 'admin') => {
    let isValid = false;
    let userData: any = null;
    if (role === 'student') {
      const { enrollmentNumber, password } = studentForm;
      isValid = !!(enrollmentNumber && password);
      if (!isValid) { alert('Please fill in all required fields'); return; }
      const accounts = loadAccounts('student');
      const match = accounts.find((a: any) => a.enrollmentNumber === enrollmentNumber && a.password === password);
      if (!match) { alert('Invalid credentials or account not found'); return; }
      userData = { ...match };
    } else if (role === 'teacher') {
      const { facultyId, password } = teacherForm;
      isValid = !!(facultyId && password);
      if (!isValid) { alert('Please fill in all required fields'); return; }
      const accounts = loadAccounts('teacher');
      const match = accounts.find((a: any) => a.facultyId === facultyId && a.password === password);
      if (!match) { alert('Invalid credentials or account not found'); return; }
      userData = { ...match };
    } else {
      const { adminId, password } = adminForm;
      isValid = !!(adminId && password);
      if (!isValid) { alert('Please fill in all required fields'); return; }
      const accounts = loadAccounts('admin');
      const match = accounts.find((a: any) => a.adminId === adminId && a.password === password);
      if (!match) { alert('Invalid credentials or account not found'); return; }
      userData = { ...match };
    }

    localStorage.setItem('userType', role);
    const { password: _pw, ...safeUser } = userData;
    localStorage.setItem('userData', JSON.stringify(safeUser));
    navigate(`/${role}`);
  };

  // Use imported department, year, and division options
  const departments = DEPARTMENTS;
  const yearOptions = ACADEMIC_YEARS;
  const divisionOptions = DIVISIONS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sanjivani University</h1>
                <p className="text-sm text-gray-600">MAP Management System</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              Version 1.0
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Mandatory Activity Points
                <span className="block text-3xl text-primary">Management System</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Track, manage, and approve student activities as per university guidelines. 
                Build your portfolio with technical skills, sports, cultural activities, and more.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <Trophy className="h-6 w-6 text-accent mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Activity Tracking</h3>
                  <p className="text-sm text-gray-600">Log activities across 5 categories with automatic point calculation</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <BarChart3 className="h-6 w-6 text-accent mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Progress Analytics</h3>
                  <p className="text-sm text-gray-600">Real-time dashboards and compliance tracking</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <Users className="h-6 w-6 text-accent mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Role-based Access</h3>
                  <p className="text-sm text-gray-600">Student, Teacher, and Admin portals</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <FileText className="h-6 w-6 text-accent mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Digital Records</h3>
                  <p className="text-sm text-gray-600">Secure document storage and PDF transcripts</p>
                </div>
              </div>
            </div>

            {/* Activity Categories */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Activity Categories</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">A: Technical Skills</Badge>
                <Badge variant="outline">B: Sports & Cultural</Badge>
                <Badge variant="outline">C: Community Outreach</Badge>
                <Badge variant="outline">D: Innovation/IPR</Badge>
                <Badge variant="outline">E: Leadership</Badge>
              </div>
            </div>
          </div>

          {/* Right Column - Login */}
          <div className="lg:pl-8">
            <Card className="w-full max-w-md mx-auto shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Login to MAP System</CardTitle>
                <CardDescription>
                  Access your personalized dashboard to manage activities and track progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center gap-2 mb-4">
                  <Button variant={authMode === 'login' ? 'default' : 'outline'} size="sm" onClick={() => setAuthMode('login')}>Login</Button>
                  <Button variant={authMode === 'signup' ? 'default' : 'outline'} size="sm" onClick={() => setAuthMode('signup')}>Create Account</Button>
                </div>
                <Tabs value={loginType} onValueChange={(value) => setLoginType(value as any)} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="student">Student</TabsTrigger>
                    <TabsTrigger value="teacher">Teacher</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="student" className="space-y-4">
                    {authMode === 'signup' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="student-name">Full Name</Label>
                          <Input id="student-name" placeholder="Enter your full name" value={studentForm.name} onChange={(e) => setStudentForm(prev => ({...prev, name: e.target.value}))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="student-email">Email</Label>
                          <Input id="student-email" type="email" placeholder="you@sanjivani.edu.in" value={studentForm.email} onChange={(e) => setStudentForm(prev => ({...prev, email: e.target.value}))} />
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="enrollment">Enrollment Number</Label>
                      <Input
                        id="enrollment"
                        placeholder="Enter your enrollment number"
                        value={studentForm.enrollmentNumber}
                        onChange={(e) => setStudentForm(prev => ({...prev, enrollmentNumber: e.target.value}))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="student-department">Department</Label>
                        <Select
                          value={studentForm.department}
                          onValueChange={(value) => setStudentForm(prev => ({...prev, department: value}))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="student-year">Academic Year</Label>
                        <Select
                          value={studentForm.year}
                          onValueChange={(value) => setStudentForm(prev => ({...prev, year: value}))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {yearOptions.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student-division">Division</Label>
                      <Select
                        value={studentForm.division}
                        onValueChange={(value) => setStudentForm(prev => ({...prev, division: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select division" />
                        </SelectTrigger>
                        <SelectContent>
                          {divisionOptions.map((division) => (
                            <SelectItem key={division} value={division}>
                              {division}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {authMode === 'signup' && (
                      <div className="space-y-2">
                        <Label htmlFor="student-program">Program</Label>
                        <Select
                          value={studentForm.program}
                          onValueChange={(value) => setStudentForm(prev => ({...prev, program: value}))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select program" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROGRAMS.map((program) => (
                              <SelectItem key={program} value={program}>
                                {program}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={studentForm.password}
                        onChange={(e) => setStudentForm(prev => ({...prev, password: e.target.value}))}
                      />
                    </div>

                    {authMode === 'login' ? (
                      <Button className="w-full" onClick={() => handleLogin('student')}>
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Login as Student
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={() => createAccount('student')}>
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Create Student Account
                      </Button>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="teacher" className="space-y-4">
                    {authMode === 'signup' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="teacher-name">Full Name</Label>
                          <Input id="teacher-name" placeholder="Enter your full name" value={teacherForm.name} onChange={(e) => setTeacherForm(prev => ({...prev, name: e.target.value}))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="teacher-email">Email</Label>
                          <Input id="teacher-email" type="email" placeholder="you@sanjivani.edu.in" value={teacherForm.email} onChange={(e) => setTeacherForm(prev => ({...prev, email: e.target.value}))} />
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="faculty-id">Faculty ID</Label>
                      <Input
                        id="faculty-id"
                        placeholder="Enter your faculty ID"
                        value={teacherForm.facultyId}
                        onChange={(e) => setTeacherForm(prev => ({...prev, facultyId: e.target.value}))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teacher-department">Department</Label>
                      <Select
                        value={teacherForm.department}
                        onValueChange={(value) => setTeacherForm(prev => ({...prev, department: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {authMode === 'signup' && (
                      <div className="space-y-2">
                        <Label htmlFor="teacher-designation">Designation</Label>
                        <Select
                          value={teacherForm.designation}
                          onValueChange={(value) => setTeacherForm(prev => ({...prev, designation: value}))}
                        >
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
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="teacher-password">Password</Label>
                      <Input
                        id="teacher-password"
                        type="password"
                        placeholder="Enter your password"
                        value={teacherForm.password}
                        onChange={(e) => setTeacherForm(prev => ({...prev, password: e.target.value}))}
                      />
                    </div>

                    {authMode === 'login' ? (
                      <Button className="w-full" onClick={() => handleLogin('teacher')}>
                        <Users className="h-4 w-4 mr-2" />
                        Login as Teacher
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={() => createAccount('teacher')}>
                        <Users className="h-4 w-4 mr-2" />
                        Create Teacher Account
                      </Button>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="admin" className="space-y-4">
                    {authMode === 'signup' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="admin-name">Full Name</Label>
                          <Input id="admin-name" placeholder="Enter your full name" value={adminForm.name} onChange={(e) => setAdminForm(prev => ({...prev, name: e.target.value}))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-email">Email</Label>
                          <Input id="admin-email" type="email" placeholder="you@sanjivani.edu.in" value={adminForm.email} onChange={(e) => setAdminForm(prev => ({...prev, email: e.target.value}))} />
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="admin-id">Admin ID</Label>
                      <Input
                        id="admin-id"
                        placeholder="Enter your admin ID"
                        value={adminForm.adminId}
                        onChange={(e) => setAdminForm(prev => ({...prev, adminId: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm(prev => ({...prev, password: e.target.value}))}
                      />
                    </div>
                    {authMode === 'login' ? (
                      <Button className="w-full" onClick={() => handleLogin('admin')}>
                        <Shield className="h-4 w-4 mr-2" />
                        Login as Admin
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={() => createAccount('admin')}>
                        <Shield className="h-4 w-4 mr-2" />
                        Create Admin Account
                      </Button>
                    )}
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Need help? Contact IT Support at{' '}
                    <span className="text-primary font-medium">support@sanjivani.edu.in</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">2,500+</h3>
            <p className="text-gray-600">Active Students</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Trophy className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">15,000+</h3>
            <p className="text-gray-600">Activities Logged</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">85%</h3>
            <p className="text-gray-600">Compliance Rate</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">500+</h3>
            <p className="text-gray-600">Transcripts Generated</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Sanjivani University. All rights reserved.</p>
            <p className="text-sm mt-2">MAP Management System - Empowering Student Growth Through Activity Tracking</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
