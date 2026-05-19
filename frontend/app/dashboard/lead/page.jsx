'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';

const input = "w-full bg-purple-950 border border-purple-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-400";
const select = "w-full bg-purple-950 border border-purple-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500";
const card = "bg-purple-900 border border-purple-700 p-6 rounded-xl shadow-lg";

export default function LeadDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'medium', status: 'pending', deadline: '', assignedEmployeeIds: [] });
  const [editingTask, setEditingTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ content: '', taskId: '' });
  const [editingComment, setEditingComment] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'project_lead')) router.push('/login');
    if (user) { fetchTasks(); fetchEmployees(); }
  }, [user, isLoading]);

  const fetchTasks = async () => { try { const res = await api.get('/lead/tasks'); setTasks(res.data); } catch (err) { console.error(err); } };
  const fetchEmployees = async () => { try { const res = await api.get('/admin/users'); setEmployees(res.data.filter((u) => u.role === 'employee')); } catch (err) { console.error(err); } };
  const fetchComments = async (taskId) => { try { const res = await api.get(`/lead/comments/${taskId}`); setComments(res.data); } catch (err) { console.error(err); } };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try { await api.post('/lead/tasks', taskForm); setTaskForm({ title: '', description: '', priority: 'medium', status: 'pending', deadline: '', assignedEmployeeIds: [] }); fetchTasks(); alert('Task created'); }
    catch { alert('Error creating task'); }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try { await api.patch(`/lead/tasks/${editingTask.id}`, editingTask); setEditingTask(null); fetchTasks(); alert('Task updated'); }
    catch { alert('Error updating task'); }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm('Are you sure?')) return;
    try { await api.delete(`/lead/tasks/${id}`); fetchTasks(); alert('Task deleted'); }
    catch { alert('Error deleting task'); }
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();
    try { await api.post('/lead/comments', commentForm); setCommentForm({ content: '', taskId: commentForm.taskId }); fetchComments(commentForm.taskId); alert('Comment added'); }
    catch { alert('Error adding comment'); }
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    try { await api.patch(`/lead/comments/${editingComment.id}`, { content: editingComment.content }); setEditingComment(null); fetchComments(selectedTaskId); alert('Comment updated'); }
    catch { alert('Error updating comment'); }
  };

  const handleDeleteComment = async (id) => {
    if (!confirm('Are you sure?')) return;
    try { await api.delete(`/lead/comments/${id}`); fetchComments(selectedTaskId); alert('Comment deleted'); }
    catch { alert('Error deleting comment'); }
  };

  if (isLoading) return <div style={{minHeight:'100vh',background:'#1a0533',display:'flex',alignItems:'center',justifyContent:'center'}}><p style={{color:'#c084fc'}}>Loading...</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: '#1a0533', color: 'white' }}>
      {/* NAVBAR */}
      <nav style={{ background: '#2d1054', borderBottom: '1px solid #6b21a8', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', background: '#7c3aed', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>PL</div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#c084fc' }}>Project Lead Portal</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#a78bfa', fontSize: '14px' }}>{user?.name}</span>
          <span style={{ background: '#6d28d9', color: '#ddd6fe', padding: '2px 10px', borderRadius: '20px', fontSize: '12px' }}>Project Lead</span>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#e9d5ff', marginBottom: '24px' }}>Dashboard Overview</h2>



        {/* Dashboard er porer grid box gula . */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#2d1054', border: '1px solid #6b21a8', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#a855f7' }}>{tasks.length}</p>
            <p style={{ color: '#c084fc', marginTop: '4px' }}>Total Tasks</p>
          </div>
          <div style={{ background: '#2d1054', border: '1px solid #6b21a8', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#818cf8' }}>{tasks.filter(t => t.status === 'in_progress').length}</p>
            <p style={{ color: '#c084fc', marginTop: '4px' }}>In Progress</p>
          </div>
          <div style={{ background: '#2d1054', border: '1px solid #6b21a8', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#34d399' }}>{tasks.filter(t => t.status === 'completed').length}</p>
            <p style={{ color: '#c084fc', marginTop: '4px' }}>Completed</p>
          </div>
        </div>




        {/* Task ar COmment er button er jonno */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['tasks', 'comments'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', textTransform: 'capitalize', background: activeTab === tab ? '#7c3aed' : '#2d1054', color: activeTab === tab ? 'white' : '#a78bfa', transition: 'all 0.2s' }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Task Creation ke flex kora hoise direction column diye  */}

        {activeTab === 'tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>


            {/* Task Creation er vitorer content shob gula */}

            <div style={{ background: '#2d1054', border: '1px solid #6b21a8', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ color: '#e9d5ff', fontWeight: 'bold', fontSize: '18px', marginBottom: '16px' }}>✦ Create New Task</h3>
              <form onSubmit={handleCreateTask}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input type="text" placeholder="Task Title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required style={{ background: '#1a0533', border: '1px solid #6b21a8', color: 'white', borderRadius: '8px', padding: '10px 14px', outline: 'none' }} />
                  <input type="date" value={taskForm.deadline} onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} style={{ background: '#1a0533', border: '1px solid #6b21a8', color: 'white', borderRadius: '8px', padding: '10px 14px', outline: 'none' }} />
                  <textarea placeholder="Task Description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} required style={{ background: '#1a0533', border: '1px solid #6b21a8', color: 'white', borderRadius: '8px', padding: '10px 14px', outline: 'none', gridColumn: 'span 2', minHeight: '80px' }} />
                  <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} style={{ background: '#1a0533', border: '1px solid #6b21a8', color: 'white', borderRadius: '8px', padding: '10px 14px', outline: 'none' }}>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <select value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })} style={{ background: '#1a0533', border: '1px solid #6b21a8', color: 'white', borderRadius: '8px', padding: '10px 14px', outline: 'none' }}>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ color: '#c084fc', fontSize: '14px', marginBottom: '6px', display: 'block' }}>Assign Employees (Hold Ctrl for multiple)</label>
                    <select multiple value={taskForm.assignedEmployeeIds} onChange={(e) => setTaskForm({ ...taskForm, assignedEmployeeIds: Array.from(e.target.selectedOptions, o => o.value) })} style={{ background: '#1a0533', border: '1px solid #6b21a8', color: 'white', borderRadius: '8px', padding: '10px 14px', outline: 'none', width: '100%', height: '100px' }}>
                      {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                    </select>
                  </div>
                  <button type="submit" style={{ gridColumn: 'span 2', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>Create Task</button>
                </div>
              </form>
            </div>



            {/* Assigned Task gula ke access korar box er kaj  */}


            {editingTask && (
              <div style={{ background: '#2d1054', border: '2px solid #7c3aed', borderRadius: '12px', padding: '24px' }}>

                <h3 style={{ color: '#e9d5ff', fontWeight: 'bold', fontSize: '18px', marginBottom: '16px' }}>✎ Edit Task</h3>

                <form onSubmit={handleUpdateTask}>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

                    <input type="text" value={editingTask.title} 
                           onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} 
                           required style={{ background: '#1a0533', border: '1px solid #6b21a8', color: 'white', borderRadius: '8px', padding: '10px 14px', outline: 'none' }} />

                    <input type="date" value={editingTask.deadline ? editingTask.deadline.split('T')[0] : ''} 
                          onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })} 
                          style={{ background: '#1a0533', border: '1px solid #6b21a8', color: 'white', borderRadius: '8px', padding: '10px 14px', outline: 'none' }} />

                    <textarea value={editingTask.description} 
                          onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} 
                          required style={{ background: '#1a0533', border: '1px solid #6b21a8', color: 'white', borderRadius: '8px', padding: '10px 14px', outline: 'none', gridColumn: 'span 2', minHeight: '80px' }} />

                    <select value={editingTask.priority} 
                          onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })} 
                          style={{ background: '#1a0533', border: '1px solid #6b21a8', color: 'white', borderRadius: '8px', padding: '10px 14px', outline: 'none' }}>

                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>

                    </select>

                    <select value={editingTask.status} 
                           onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })} 
                           style={{ background: '#1a0533', border: '1px solid #6b21a8', color: 'white', borderRadius: '8px', padding: '10px 14px', outline: 'none' }}>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>

                    </select>

                    <button type="submit" style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '600', cursor: 'pointer' }}>Save Changes</button>

                    <button type="button" onClick={() => setEditingTask(null)} style={{ background: '#4b5563', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>

                  </div>
                </form>
              </div>
            )}

            {/* Task jegula assign korsi ogular list  */}


            <div style={{ background: '#2d1054', border: '1px solid #6b21a8', borderRadius: '12px', padding: '24px' }}>

              <h3 style={{ color: '#e9d5ff', fontWeight: 'bold', fontSize: '18px', marginBottom: '16px' }}>My Tasks ({tasks.length})</h3>

              {tasks.length === 0 ? <p style={{ color: '#a78bfa' }}>No tasks yet.</p> : (

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {tasks.map(t => (
                    <div key={t.id} style={{ background: '#1a0533', border: '1px solid #6b21a8', borderRadius: '10px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>


                        <div>
                          <h4 style={{ color: '#e9d5ff', fontWeight: '600', fontSize: '16px' }}>{t.title}</h4>
                          <p style={{ color: '#a78bfa', fontSize: '14px', marginTop: '4px' }}>{t.description}</p>

                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>

                            <span style={{ background: t.priority === 'high' ? '#7f1d1d' : t.priority === 'medium' ? '#78350f' : '#14532d', color: t.priority === 'high' ? '#fca5a5' : t.priority === 'medium' ? '#fcd34d' : '#86efac', padding: '2px 10px', borderRadius: '20px', fontSize: '12px' }}>{t.priority}</span>

                            <span style={{ background: t.status === 'completed' ? '#14532d' : t.status === 'in_progress' ? '#1e3a5f' : '#3b1f6e', color: t.status === 'completed' ? '#86efac' : t.status === 'in_progress' ? '#93c5fd' : '#c4b5fd', padding: '2px 10px', borderRadius: '20px', fontSize: '12px' }}>{t.status.replace('_', ' ')}</span>
                            {t.deadline && <span style={{ color: '#a78bfa', fontSize: '12px' }}>📅 {new Date(t.deadline).toLocaleDateString()}</span>}
                          </div>

                          {t.assignedEmployees?.length > 0 && <p style={{ color: '#7c3aed', fontSize: '12px', marginTop: '6px' }}>👥 {t.assignedEmployees.map(e => e.name).join(', ')}</p>}
                        </div>


                        <div style={{ display: 'flex', gap: '8px' }}>

                          <button onClick={() => setEditingTask(t)} style={{ background: '#6d28d9', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Edit</button>

                          <button onClick={() => handleDeleteTask(t.id)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>

                          <button onClick={() => { setSelectedTaskId(t.id); setCommentForm({ content: '', taskId: t.id }); fetchComments(t.id); setActiveTab('comments'); }} style={{ background: '#0891b2', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Comments</button>

                        </div>

                      </div>
                    </div>
                  ))}
                </div>

              )}
            </div>
          </div>
        )}


        {/* Eta comment button click korar porer kaj   */}

        {activeTab === 'comments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: '#2d1054', border: '1px solid #6b21a8', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ color: '#e9d5ff', fontWeight: 'bold', fontSize: '18px', marginBottom: '16px' }}>💬 Add Comment</h3>
              <form onSubmit={handleCreateComment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <select value={commentForm.taskId} onChange={(e) => { setCommentForm({ ...commentForm, taskId: e.target.value }); fetchComments(e.target.value); }} required style={{ background: '#1a0533', border: '1px solid #6b21a8', color: 'white', borderRadius: '8px', padding: '10px 14px', outline: 'none' }}>
                  <option value="">Select Task</option>
                  {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
                <textarea placeholder="Write your comment..." value={commentForm.content} onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })} required style={{ background: '#1a0533', border: '1px solid #6b21a8', color: 'white', borderRadius: '8px', padding: '10px 14px', outline: 'none', minHeight: '100px' }} />
                <button type="submit" style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '600', cursor: 'pointer' }}>Add Comment</button>
              </form>
            </div>

            {/* Eta comment edit korar jnno  */}

            {editingComment && (
              <div style={{ background: '#2d1054', border: '2px solid #7c3aed', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ color: '#e9d5ff', fontWeight: 'bold', fontSize: '18px', marginBottom: '16px' }}>Edit Comment</h3>
                <form onSubmit={handleUpdateComment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <textarea value={editingComment.content} onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })} required style={{ background: '#1a0533', border: '1px solid #6b21a8', color: 'white', borderRadius: '8px', padding: '10px 14px', outline: 'none', minHeight: '80px' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer' }}>Save</button>
                    <button type="button" onClick={() => setEditingComment(null)} style={{ background: '#4b5563', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Eta comment footer  */}


            <div style={{ background: '#2d1054', border: '1px solid #6b21a8', borderRadius: '12px', padding: '24px' }}>

              <h3 style={{ color: '#e9d5ff', fontWeight: 'bold', fontSize: '18px', marginBottom: '16px' }}>Comments ({comments.length})</h3>

              {comments.length === 0 ? <p style={{ color: '#a78bfa' }}>No comments yet. Select a task to view comments.</p> : (
                

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                  {comments.map(c => (

                    <div key={c.id} style={{ background: '#1a0533', border: '1px solid #6b21a8', borderRadius: '10px', padding: '16px' }}>

                      <p style={{ color: '#e9d5ff' }}>{c.content}</p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>

                        <p style={{ color: '#7c3aed', fontSize: '12px' }}>By {c.author?.name} — {new Date(c.createdAt).toLocaleDateString()}</p>

                        {/* Comment er edit ar delete button */}

                        <div style={{ display: 'flex', gap: '8px' }}>

                          <button onClick={() => setEditingComment(c)} style={{ background: '#6d28d9', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>

                          <button onClick={() => handleDeleteComment(c.id)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}


            </div>

            {/* Footer er kaj shesh hoise ekhane */}


          </div>
        )}

        {/* comment button click er kaj shesh   */}
      </div>

        {/* Navbar bad e page layout    */}

    </div>

        
  );
}

{/* Full page layout er kaj shesh   */}