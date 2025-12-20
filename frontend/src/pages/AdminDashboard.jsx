import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Loader2, 
  Users, 
  FileText, 
  TrendingUp, 
  Trash2, 
  Shield, 
  User, 
  AlertCircle,
  CheckCircle2,
  Search,
  Calendar,
  BarChart3,
} from 'lucide-react';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

// Ensure only admin users can access this page
  useEffect(() => {
    if (user === null) {
      // User data is still loading, wait
      return;
    }
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Load admin data
  useEffect(() => {
    loadData();
  }, []);

  // Filter users list
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(u => 
          u.email.toLowerCase().includes(query) ||
          u.role.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsResponse, usersResponse] = await Promise.all([
        adminService.getStats(),
        adminService.getAllUsers(),
      ]);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      } else {
        console.error('Stats response error:', statsResponse);
        setError(statsResponse?.message || t('admin.errors.loadError'));
      }

      if (usersResponse.success && usersResponse.data) {
        setUsers(usersResponse.data);
        setFilteredUsers(usersResponse.data);
      } else {
        console.error('Users response error:', usersResponse);
        if (!statsResponse.success) {
          setError(usersResponse?.message || t('admin.errors.loadError'));
        }
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError(err.response?.data?.message || err.message || t('admin.errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      const response = await adminService.deleteUser(userToDelete._id);
      
      if (response.success) {
        setSuccess(t('admin.success.userDeleted', { email: userToDelete.email }));
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        // Recharger les données
        loadData();
      }
    } catch (err) {
      setError(err.response?.data?.message || t('admin.errors.deleteError'));
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-muted-foreground">{t('admin.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          {t('admin.title')}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t('admin.subtitle')}
        </p>
      </div>

      {/* Alerts */}
      {success && (
        <Alert className="border-green-500 bg-green-50 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="animate-in slide-in-from-top duration-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('admin.stats.totalUsers')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">{stats.users?.total || 0}</div>
              <p className="text-xs text-blue-600 mt-1">
                {t('admin.stats.recentUsers', { count: stats.users?.recent || 0 })}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-600 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t('admin.stats.totalCVs')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">{stats.cvs?.total || 0}</div>
              <p className="text-xs text-purple-600 mt-1">
                {t('admin.stats.recentCVs', { count: stats.cvs?.recent || 0 })}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t('admin.stats.avgCVs')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{stats.cvs?.avgPerUser || 0}</div>
              <p className="text-xs text-green-600 mt-1">
                {t('admin.stats.perUser')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-600 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t('admin.stats.admins')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700">{stats.users?.admin || 0}</div>
              <p className="text-xs text-orange-600 mt-1">
                {t('admin.stats.clients', { count: stats.users?.client || 0 })}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Users */}
      {stats && stats.topUsers && stats.topUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              {t('admin.topUsers.title')}
            </CardTitle>
            <CardDescription>{t('admin.topUsers.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topUsers.map((topUser, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{topUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="font-semibold">{topUser.cvCount}</span>
                    {t('admin.topUsers.cvs')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                {t('admin.users.title')}
              </CardTitle>
              <CardDescription>
                {t('admin.users.subtitle', { count: filteredUsers.length })}
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('admin.users.search')}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('admin.users.noResults')}</p>
              </div>
            ) : (
              filteredUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      u.role === 'admin' 
                        ? 'bg-gradient-to-br from-red-600 to-orange-600' 
                        : 'bg-gradient-to-br from-blue-600 to-purple-600'
                    }`}>
                      {u.role === 'admin' ? (
                        <Shield className="h-6 w-6 text-white" />
                      ) : (
                        <User className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{u.email}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          u.role === 'admin'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {u.role === 'admin' ? t('admin.users.roleAdmin') : t('admin.users.roleClient')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {u.createdAt ? formatDate(u.createdAt) : 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {t('admin.users.cvCount', { count: u.cvCount || 0 })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    {u._id !== user._id && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(u)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t('admin.users.delete')}
                      </Button>
                    )}
                    {u._id === user._id && (
                      <span className="text-xs text-muted-foreground italic">
                        {t('admin.users.currentUser')}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              {t('admin.deleteDialog.title')}
            </DialogTitle>
            <DialogDescription>
              {t('admin.deleteDialog.description', { email: userToDelete?.email })}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>{t('admin.deleteDialog.warning')}</strong>
            </p>
            <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
              <li>{t('admin.deleteDialog.consequence1')}</li>
              <li>{t('admin.deleteDialog.consequence2', { count: userToDelete?.cvCount || 0 })}</li>
              <li>{t('admin.deleteDialog.consequence3')}</li>
            </ul>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="gap-2"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('admin.deleteDialog.deleting')}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  {t('admin.deleteDialog.confirm')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;

