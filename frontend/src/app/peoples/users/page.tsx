'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  KeyRound, 
  Trash2, 
  X, 
  EyeOff, 
  ShieldCheck, 
  UserCheck, 
  UserX,
  Phone,
  Mail,
  User as UserIcon,
  CheckCircle2,
  Building2,
  Filter
} from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

export type UserRole = 'Admin' | 'Workshop Manager' | 'Technician' | 'Accountant / Cashier' | 'Service Advisor';
export type UserDepartment = 'Mechanical' | 'Electrical' | 'Body & Paint' | 'Front Desk' | 'Management';
export type AccountStatus = 'Active' | 'Inactive';

export interface UserAccount {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  department: UserDepartment;
  status: AccountStatus;
  avatarInitial: string;
  createdAt: string;
}

const STORAGE_KEY = 'mamun_erp_users_list';

const MOCK_FALLBACK_USERS: UserAccount[] = [
  {
    id: 'USR-001',
    fullName: 'Al-Mamun',
    username: 'mamun_admin',
    email: 'mamun@automobiles.com',
    phone: '+880 1711-102030',
    role: 'Admin',
    department: 'Management',
    status: 'Active',
    avatarInitial: 'M',
    createdAt: '2025-01-10'
  },
  {
    id: 'USR-002',
    fullName: 'Rahim Chowdhury',
    username: 'rahim_mgr',
    email: 'rahim.manager@automobiles.com',
    phone: '+880 1819-223344',
    role: 'Workshop Manager',
    department: 'Management',
    status: 'Active',
    avatarInitial: 'R',
    createdAt: '2025-02-01'
  },
  {
    id: 'USR-003',
    fullName: 'Samim Hossain',
    username: 'samim_tech',
    email: 'samim.ac@automobiles.com',
    phone: '+880 1912-556677',
    role: 'Technician',
    department: 'Electrical',
    status: 'Active',
    avatarInitial: 'S',
    createdAt: '2025-03-15'
  },
  {
    id: 'USR-004',
    fullName: 'Tariqul Islam',
    username: 'tariqul_cashier',
    email: 'tariqul.accounts@automobiles.com',
    phone: '+880 1611-998877',
    role: 'Accountant / Cashier',
    department: 'Front Desk',
    status: 'Active',
    avatarInitial: 'T',
    createdAt: '2025-04-05'
  },
  {
    id: 'USR-005',
    fullName: 'Sagor Ahmed',
    username: 'sagor_advisor',
    email: 'sagor.desk@automobiles.com',
    phone: '+880 1715-443322',
    role: 'Service Advisor',
    department: 'Front Desk',
    status: 'Inactive',
    avatarInitial: 'S',
    createdAt: '2025-05-12'
  }
];

const ROLES: UserRole[] = [
  'Admin',
  'Workshop Manager',
  'Technician',
  'Accountant / Cashier',
  'Service Advisor'
];

const DEPARTMENTS: UserDepartment[] = [
  'Mechanical',
  'Electrical',
  'Body & Paint',
  'Front Desk',
  'Management'
];

function UserManagementContent() {
  const { showToast } = useToast();

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Reset Password Modal State
  const [resetPassUser, setResetPassUser] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    fullName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    department: UserDepartment;
    status: AccountStatus;
  }>({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'Technician',
    department: 'Mechanical',
    status: 'Active'
  });

  const [showFormPassword, setShowFormPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load from localStorage with fallback
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUsers(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load users from localStorage', e);
    }
    setUsers(MOCK_FALLBACK_USERS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_FALLBACK_USERS));
    } catch (e) {
      // ignore
    }
  }, []);

  // Save to localStorage
  const saveUsersToStorage = (updatedUsers: UserAccount[]) => {
    setUsers(updatedUsers);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    } catch (e) {
      console.error('Failed to save users to localStorage', e);
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Search by Name, Username, Phone, Email
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = u.fullName.toLowerCase().includes(term);
        const matchesUsername = u.username.toLowerCase().includes(term);
        const matchesPhone = u.phone.toLowerCase().includes(term);
        const matchesEmail = u.email.toLowerCase().includes(term);
        if (!matchesName && !matchesUsername && !matchesPhone && !matchesEmail) {
          return false;
        }
      }
      // Role Filter
      if (roleFilter !== 'ALL' && u.role !== roleFilter) {
        return false;
      }
      // Status Filter
      if (statusFilter !== 'ALL' && u.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({
      fullName: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      role: 'Technician',
      department: 'Mechanical',
      status: 'Active'
    });
    setFormErrors({});
    setShowFormPassword(false);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      password: '', // Blank unless updating password
      role: user.role,
      department: user.department,
      status: user.status
    });
    setFormErrors({});
    setShowFormPassword(false);
    setIsModalOpen(true);
  };

  // Form Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }
    if (!formData.username.trim()) {
      errors.username = 'Username / Login ID is required';
    } else {
      // Check uniqueness
      const exists = users.some(
        u => u.username.toLowerCase() === formData.username.trim().toLowerCase() && u.id !== editingUser?.id
      );
      if (exists) {
        errors.username = 'Username / Login ID is already taken';
      }
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone Number is required';
    }
    if (!editingUser && !formData.password.trim()) {
      errors.password = 'Password is required for new user creation';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save User (Create or Update)
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const initial = formData.fullName.trim().charAt(0).toUpperCase() || 'U';

    if (editingUser) {
      // Update
      const updatedList = users.map(u => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            fullName: formData.fullName.trim(),
            username: formData.username.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            role: formData.role,
            department: formData.department,
            status: formData.status,
            avatarInitial: initial
          };
        }
        return u;
      });
      saveUsersToStorage(updatedList);
      showToast('User details updated successfully!', 'success');
    } else {
      // Create New
      const newUser: UserAccount = {
        id: `USR-${String(users.length + 1).padStart(3, '0')}`,
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        department: formData.department,
        status: formData.status,
        avatarInitial: initial,
        createdAt: new Date().toISOString().split('T')[0]
      };
      const updatedList = [newUser, ...users];
      saveUsersToStorage(updatedList);
      showToast('User created successfully!', 'success');
    }

    setIsModalOpen(false);
  };

  // Toggle Status
  const handleToggleStatus = (user: UserAccount) => {
    const newStatus: AccountStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    const updatedList = users.map(u => u.id === user.id ? { ...u, status: newStatus } : u);
    saveUsersToStorage(updatedList);
    showToast(`User status updated to ${newStatus}`, 'info');
  };

  // Delete User
  const handleDeleteUser = (user: UserAccount) => {
    if (window.confirm(`Are you sure you want to delete user "${user.fullName}" (${user.username})?`)) {
      const updatedList = users.filter(u => u.id !== user.id);
      saveUsersToStorage(updatedList);
      showToast('User deleted successfully', 'warning');
    }
  };

  // Password Reset Action
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      showToast('Please enter a new password', 'error');
      return;
    }
    showToast(`Password for ${resetPassUser?.fullName} reset successfully!`, 'success');
    setResetPassUser(null);
    setNewPassword('');
  };

  // Role Badge Styling Helper
  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
      case 'Workshop Manager':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
      case 'Technician':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
      case 'Accountant / Cashier':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
      case 'Service Advisor':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto text-slate-800 dark:text-slate-100 font-sans">
      {/* Top Breadcrumb & Page Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div>
          <div className="text-xs text-slate-500 space-x-1.5 mb-1.5 flex items-center">
            <Link href="/dashboard" prefetch={false} className="hover:underline text-slate-600 dark:text-slate-400">Dashboard</Link>
            <span>&gt;</span>
            <Link href="/peoples/users" prefetch={false} className="hover:underline text-slate-600 dark:text-slate-400">Peoples</Link>
            <span>&gt;</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Users & Staff</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#004e89]" />
            Users & Staff Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage system access credentials, role-based permissions, and workshop department assignments.
          </p>
        </div>

        <button 
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#004e89] hover:bg-[#003d6c] text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Users</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{users.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Staff</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{users.filter(u => u.status === 'Active').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Admins & Managers</p>
          <p className="text-2xl font-black text-[#004e89] mt-1">
            {users.filter(u => u.role === 'Admin' || u.role === 'Workshop Manager').length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Inactive Accounts</p>
          <p className="text-2xl font-black text-slate-400 mt-1">{users.filter(u => u.status === 'Inactive').length}</p>
        </div>
      </div>

      {/* Top Bar Search & Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search by Name, Username, Phone, or Email..." 
            aria-label="Search users"
            className="w-full py-2 px-3 pl-9 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#004e89] transition" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              aria-label="Filter by Role"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#004e89]"
            >
              <option value="ALL">All Roles</option>
              {ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            aria-label="Filter by Status"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#004e89]"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users List Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-4 whitespace-nowrap">User</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Username / ID</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Contact Details</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Role</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Department</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <UserX className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-xs">No users found matching your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors">
                    {/* Name & Avatar Initial */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#004e89] to-blue-700 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                          {user.avatarInitial}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs">{user.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Username / Login ID */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-700 dark:text-slate-300 font-semibold">
                      @{user.username}
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{user.email || 'N/A'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${getRoleBadgeStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{user.department}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {user.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit */}
                        <button 
                          onClick={() => handleOpenEditModal(user)} 
                          className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition" 
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Reset Password */}
                        <button 
                          onClick={() => { setResetPassUser(user); setNewPassword(''); }} 
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition" 
                          title="Reset Password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>

                        {/* Toggle Status */}
                        <button 
                          onClick={() => handleToggleStatus(user)} 
                          className={`p-1.5 rounded-lg transition ${
                            user.status === 'Active' 
                              ? 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700' 
                              : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                          }`} 
                          title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                        >
                          {user.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>

                        {/* Delete */}
                        <button 
                          onClick={() => handleDeleteUser(user)} 
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition" 
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingUser ? 'Edit User & Staff' : 'Add New User & Staff'}
                </h2>
                <p className="text-xs text-slate-500">Fill in system credentials and role permissions</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              {/* Full Name */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Al-Mamun or Tanvir Ahmed"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full py-2.5 px-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#004e89] transition ${
                    formErrors.fullName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {formErrors.fullName && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{formErrors.fullName}</p>}
              </div>

              {/* Username & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Username / Login ID <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. mamun_admin"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className={`w-full py-2.5 px-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#004e89] transition ${
                      formErrors.username ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {formErrors.username && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{formErrors.username}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. +880 1711-000000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full py-2.5 px-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#004e89] transition ${
                      formErrors.phone ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {formErrors.phone && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{formErrors.phone}</p>}
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input 
                  type="email"
                  placeholder="e.g. user@automobiles.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#004e89] transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {editingUser ? 'Password (Leave blank to keep existing)' : 'Password'} {!editingUser && <span className="text-rose-500">*</span>}
                </label>
                <div className="relative">
                  <input 
                    type={showFormPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full py-2.5 px-3.5 pr-10 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#004e89] transition ${
                      formErrors.password ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormPassword(!showFormPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formErrors.password && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{formErrors.password}</p>}
              </div>

              {/* Role & Department Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    User Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#004e89] transition font-semibold"
                  >
                    {ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value as UserDepartment })}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#004e89] transition font-semibold"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Account Status</p>
                  <p className="text-[11px] text-slate-400">Control login access for this user</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: formData.status === 'Active' ? 'Inactive' : 'Active' })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                    formData.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${formData.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  <span>{formData.status}</span>
                </button>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#004e89] hover:bg-[#003d6c] text-white font-bold transition shadow-md"
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetPassUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#004e89]" />
                Reset Password
              </h3>
              <button onClick={() => setResetPassUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Set a new password for <span className="font-bold text-slate-900 dark:text-white">{resetPassUser.fullName}</span> (@{resetPassUser.username}).
            </p>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password..."
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full py-2.5 px-3.5 pr-10 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#004e89]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetPassUser(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#004e89] hover:bg-[#003d6c] text-white shadow-md"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UsersManagementPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-xs font-semibold text-slate-400">
        Loading Users & Staff directory...
      </div>
    }>
      <UserManagementContent />
    </Suspense>
  );
}
