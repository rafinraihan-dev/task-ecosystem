'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import api from '../../lib/axios';

const inputClass = "w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400";
const selectClass = "w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
const cardClass = "bg-slate-800 border border-slate-700 p-6 rounded-lg shadow";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [editingUser, setEditingUser] = useState(null);
  const [resetPasswordData, setResetPasswordData] = useState({ id: '', password: '' });

  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'medium', status: 'pending', deadline: '', assignedEmployeeIds: [] });
  const [editingTask, setEditingTask] = useState(null);

  const [stats, setStats] = useState({ totalUsers: 0, totalTasks: 0 });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.push('/login');
    if (user) { fetchUsers(); fetchTasks(); fetchStats(); }
  }, [user, isLoading]);

  const fetchUsers = async () => { try { const res = await api.get('/admin/users'); setUsers(res.data); } catch (err) { console.error(err); } };
  const fetchTasks = async () => { try { const res = await api.get('/admin/tasks'); setTasks(res.data); } catch (err) { console.error(err); } };
  const fetchStats = async () => { try { const res = await api.get('/admin/stats'); setStats(res.data); } catch (err) { console.error(err); } };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try { await api.post('/admin/users', userForm); setUserForm({ name: '', email: '', password: '', role: 'employee' }); fetchUsers(); fetchStats(); alert('User created successfully'); }
    catch { alert('Error creating user'); }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try { await api.patch(`/admin/users/${editingUser.id}`, editingUser); setEditingUser(null); fetchUsers(); alert('User updated successfully'); }
    catch { alert('Error updating user'); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure?')) return;
    try { await api.delete(`/admin/users/${id}`); fetchUsers(); fetchStats(); alert('User deleted'); }
    catch { alert('Error deleting user'); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try { await api.patch(`/admin/users/${resetPasswordData.id}/password`, { password: resetPasswordData.password }); setResetPasswordData({ id: '', password: '' }); alert('Password reset successfully'); }
    catch { alert('Error resetting password'); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try { await api.post('/admin/tasks', taskForm); setTaskForm({ title: '', description: '', priority: 'medium', status: 'pending', deadline: '', assignedEmployeeIds: [] }); fetchTasks(); fetchStats(); alert('Task created'); }
    catch { alert('Error creating task'); }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try { await api.patch(`/admin/tasks/${editingTask.id}`, editingTask); setEditingTask(null); fetchTasks(); alert('Task updated'); }
    catch { alert('Error updating task'); }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm('Are you sure?')) return;
    try { await api.delete(`/admin/tasks/${id}`); fetchTasks(); fetchStats(); alert('Task deleted'); }
    catch { alert('Error deleting task'); }
  };

  const employees = users.filter((u) => u.role === 'employee');
  if (isLoading) return <p className="text-center mt-10 text-slate-300">Loading...</p>;

  return (


    <div className="min-h-screen bg-slate-900">

       
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>
          
         {/* Buttons array er maddhome declare kora */}
        <div className="flex gap-2 mb-6">
          {['overview', 'users', 'tasks'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded capitalize font-medium transition ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              {tab}
            </button>

          ))}
        </div>

         {/* Overview er grid  */}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${cardClass} text-center`}>
              <p className="text-4xl font-bold text-blue-400">{stats.totalUsers}</p>
              <p className="text-slate-400 mt-2">Total Users</p>
            </div>
            <div className={`${cardClass} text-center`}>
              <p className="text-4xl font-bold text-green-400">{stats.totalTasks}</p>
              <p className="text-slate-400 mt-2">Total Tasks</p>
            </div>
          </div>
        )}

         {/* Users active howar pore ei code execute hobe */}
        


        {activeTab === 'users' && (

          <div className="space-y-6">

            <div className={cardClass}>

              <h2 className="text-lg font-bold text-white mb-4">Create New User</h2>

              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input type="text" placeholder="Full Name" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} className={inputClass} required />

                <input type="email" placeholder="Email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className={inputClass} required />

                <input type="password" placeholder="Password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} className={inputClass} required />

                <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} className={selectClass}>

                  <option value="employee">Employee</option>
                  <option value="project_lead">Project Lead</option>
                  <option value="qa_tester">QA Tester</option>
                </select>

                <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium">Create User</button>

              </form>
            </div>

            <div className={cardClass}>

              <h2 className="text-lg font-bold text-white mb-4">Reset User Password</h2>

              <form onSubmit={handleResetPassword} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <select value={resetPasswordData.id} onChange={(e) => setResetPasswordData({ ...resetPasswordData, id: e.target.value })} className={selectClass} required>

                  <option value="">Select User</option>
                  {users.map((u) => (<option key={u.id} value={u.id}>{u.name} ({u.role})</option>))}
                </select>

                <input type="password" placeholder="New Password" value={resetPasswordData.password} onChange={(e) => setResetPasswordData({ ...resetPasswordData, password: e.target.value })} className={inputClass} required />

                <button type="submit" className="md:col-span-2 bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 font-medium">Reset Password</button>

              </form>
            </div>

             {/* All Users e edit click korar por kaj korbe  */}

            {editingUser && (
              <div className={`${cardClass} border-2 border-blue-500`}>
                <h2 className="text-lg font-bold text-white mb-4">Edit User</h2>
                <form onSubmit={handleUpdateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} className={inputClass} required />
                  <input type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} className={inputClass} required />
                  <select value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} className={selectClass}>
                    <option value="employee">Employee</option>
                    <option value="project_lead">Project Lead</option>
                    <option value="qa_tester">QA Tester</option>
                  </select>
                  <select value={editingUser.isActive} onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.value === 'true' })} className={selectClass}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium">Save Changes</button>
                  <button type="button" onClick={() => setEditingUser(null)} className="bg-slate-600 text-white py-2 rounded hover:bg-slate-500 font-medium">Cancel</button>
                </form>
              </div>
            )}
             {/* All users Section */}

            <div className={cardClass}>

              <h2 className="text-lg font-bold text-white mb-4">All Users ({users.length})</h2>

              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead>
                    <tr className="bg-slate-700">
                      <th className="text-left p-3 text-slate-300">Name</th>
                      <th className="text-left p-3 text-slate-300">Email</th>
                      <th className="text-left p-3 text-slate-300">Role</th>
                      <th className="text-left p-3 text-slate-300">Status</th>
                      <th className="text-left p-3 text-slate-300">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t border-slate-700 hover:bg-slate-750">

                        <td className="p-3 text-slate-200">{u.name}</td>
                        <td className="p-3 text-slate-300">{u.email}</td>
                        <td className="p-3 text-slate-300 capitalize">{u.role.replace('_', ' ')}</td>
                        <td className="p-3">

                          <span className={`px-2 py-1 rounded text-xs font-medium ${u.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>

                        </td>

                        <td className="p-3">

                          <div className="flex gap-2">
                            <button onClick={() => setEditingUser(u)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">Edit</button>
                            <button onClick={() => handleDeleteUser(u.id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">Delete</button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>
            </div>
          </div>
        )}

         {/* Task button active hoile then kaj korbe */}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className={cardClass}>
              <h2 className="text-lg font-bold text-white mb-4">Create New Task</h2>
              <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Task Title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} className={inputClass} required />
                <input type="date" value={taskForm.deadline} onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} className={inputClass} />
                <textarea placeholder="Task Description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} className={`${inputClass} md:col-span-2`} required />
                <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} className={selectClass}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <select value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })} className={selectClass}>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="md:col-span-2">
                  <label className="block text-slate-300 text-sm font-medium mb-1">Assign Employees</label>
                  <select multiple value={taskForm.assignedEmployeeIds} onChange={(e) => setTaskForm({ ...taskForm, assignedEmployeeIds: Array.from(e.target.selectedOptions, (o) => o.value) })} className={`${selectClass} h-28`}>
                    {employees.map((emp) => (<option key={emp.id} value={emp.id}>{emp.name}</option>))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">Hold Ctrl to select multiple</p>
                </div>
                <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium">Create Task</button>
              </form>
            </div>

            {editingTask && (
              <div className={`${cardClass} border-2 border-blue-500`}>
                <h2 className="text-lg font-bold text-white mb-4">Edit Task</h2>
                <form onSubmit={handleUpdateTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} className={inputClass} required />
                  <input type="date" value={editingTask.deadline ? editingTask.deadline.split('T')[0] : ''} onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })} className={inputClass} />
                  <textarea value={editingTask.description} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} className={`${inputClass} md:col-span-2`} required />
                  <select value={editingTask.priority} onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })} className={selectClass}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <select value={editingTask.status} onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })} className={selectClass}>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium">Save Changes</button>
                  <button type="button" onClick={() => setEditingTask(null)} className="bg-slate-600 text-white py-2 rounded hover:bg-slate-500 font-medium">Cancel</button>
                </form>
              </div>
            )}

            <div className={cardClass}>
              <h2 className="text-lg font-bold text-white mb-4">All Tasks ({tasks.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-700">
                      <th className="text-left p-3 text-slate-300">Title</th>
                      <th className="text-left p-3 text-slate-300">Priority</th>
                      <th className="text-left p-3 text-slate-300">Status</th>
                      <th className="text-left p-3 text-slate-300">Deadline</th>
                      <th className="text-left p-3 text-slate-300">Assigned To</th>
                      <th className="text-left p-3 text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t) => (
                      <tr key={t.id} className="border-t border-slate-700">
                        <td className="p-3 text-slate-200">{t.title}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${t.priority === 'high' ? 'bg-red-900 text-red-300' : t.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'}`}>{t.priority}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${t.status === 'completed' ? 'bg-green-900 text-green-300' : t.status === 'in_progress' ? 'bg-blue-900 text-blue-300' : t.status === 'rejected' ? 'bg-red-900 text-red-300' : 'bg-slate-700 text-slate-300'}`}>{t.status.replace('_', ' ')}</span>
                        </td>
                        <td className="p-3 text-slate-300">{t.deadline ? new Date(t.deadline).toLocaleDateString() : 'No deadline'}</td>
                        <td className="p-3 text-slate-300">{t.assignedEmployees?.map((e) => e.name).join(', ') || 'None'}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button onClick={() => setEditingTask(t)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">Edit</button>
                            <button onClick={() => handleDeleteTask(t.id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}