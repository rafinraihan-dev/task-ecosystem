'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';

export default function EmployeeDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState([]);
  const [comments, setComments] = useState([]);
  const [progressForm, setProgressForm] = useState({ content: '', statusRemark: '', taskId: '' });
  const [editingProgress, setEditingProgress] = useState(null);
  const [commentForm, setCommentForm] = useState({ content: '', taskId: '' });
  const [editingComment, setEditingComment] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState('');

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'employee')) router.push('/login');
    if (user) { fetchTasks(); fetchProgress(); }
  }, [user, isLoading]);

  const fetchTasks = async () => { try { const res = await api.get('/employee/tasks'); setTasks(res.data); } catch (err) { console.error(err); } };
  const fetchProgress = async () => { try { const res = await api.get('/employee/progress'); setProgress(res.data); } catch (err) { console.error(err); } };
  const fetchComments = async (taskId) => { try { const res = await api.get(`/employee/comments/${taskId}`); setComments(res.data); } catch (err) { console.error(err); } };

  const handleUpdateStatus = async (taskId, status) => {
    try { await api.patch(`/employee/tasks/${taskId}/status`, { status }); fetchTasks(); }
    catch { alert('Error updating status'); }
  };

  const handleCreateProgress = async (e) => {
    e.preventDefault();
    try { await api.post('/employee/progress', progressForm); setProgressForm({ content: '', statusRemark: '', taskId: '' }); fetchProgress(); alert('Progress added'); }
    catch { alert('Error adding progress'); }
  };

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    try { await api.patch(`/employee/progress/${editingProgress.id}`, { content: editingProgress.content, statusRemark: editingProgress.statusRemark }); setEditingProgress(null); fetchProgress(); }
    catch { alert('Error updating progress'); }
  };

  const handleDeleteProgress = async (id) => {
    if (!confirm('Delete this progress update?')) return;
    try { await api.delete(`/employee/progress/${id}`); fetchProgress(); }
    catch { alert('Error deleting'); }
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();
    try { await api.post('/employee/comments', commentForm); setCommentForm({ content: '', taskId: commentForm.taskId }); fetchComments(commentForm.taskId); }
    catch { alert('Error adding comment'); }
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    try { await api.patch(`/employee/comments/${editingComment.id}`, { content: editingComment.content }); setEditingComment(null); fetchComments(selectedTaskId); }
    catch { alert('Error updating comment'); }
  };

  const handleDeleteComment = async (id) => {
    if (!confirm('Delete this comment?')) return;
    try { await api.delete(`/employee/comments/${id}`); fetchComments(selectedTaskId); }
    catch { alert('Error deleting'); }
  };

  if (isLoading) return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#58a6ff' }}>Loading...</p>
    </div>
  );

  const sidebarItems = [
    { key: 'tasks', icon: '📋', label: 'My Tasks' },
    { key: 'progress', icon: '📈', label: 'Progress' },
    { key: 'comments', icon: '💬', label: 'Comments' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d1117', color: '#c9d1d9' }}>

      {/* SIDEBAR */}
      <div style={{ width: '240px', background: '#161b22', borderRight: '1px solid #30363d', display: 'flex', flexDirection: 'column', padding: '0', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #30363d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', background: '#238636', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: 'white' }}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p style={{ color: '#f0f6fc', fontWeight: '600', fontSize: '14px', margin: 0 }}>{user?.name}</p>
              <p style={{ color: '#8b949e', fontSize: '11px', margin: 0 }}>Employee</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ padding: '12px 0', flex: 1 }}>
          {sidebarItems.map(item => (
            <button key={item.key} onClick={() => setActiveTab(item.key)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', background: activeTab === item.key ? '#21262d' : 'transparent', color: activeTab === item.key ? '#58a6ff' : '#8b949e', border: 'none', cursor: 'pointer', fontSize: '14px', textAlign: 'left', borderLeft: activeTab === item.key ? '3px solid #58a6ff' : '3px solid transparent', transition: 'all 0.2s' }}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Stats at bottom of sidebar */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #30363d' }}>
          <p style={{ color: '#8b949e', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Stats</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8b949e', fontSize: '12px' }}>Total Tasks</span>
              <span style={{ color: '#58a6ff', fontWeight: '600', fontSize: '12px' }}>{tasks.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8b949e', fontSize: '12px' }}>In Progress</span>
              <span style={{ color: '#f0883e', fontWeight: '600', fontSize: '12px' }}>{tasks.filter(t => t.status === 'in_progress').length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8b949e', fontSize: '12px' }}>Completed</span>
              <span style={{ color: '#3fb950', fontWeight: '600', fontSize: '12px' }}>{tasks.filter(t => t.status === 'completed').length}</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #30363d' }}>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} style={{ width: '100%', background: '#21262d', color: '#f85149', border: '1px solid #30363d', borderRadius: '6px', padding: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {/* Top Header */}
        <div style={{ background: '#161b22', borderBottom: '1px solid #30363d', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: '#f0f6fc', fontWeight: '600', fontSize: '20px', margin: 0 }}>
              {activeTab === 'tasks' ? '📋 My Tasks' : activeTab === 'progress' ? '📈 Progress Updates' : '💬 Comments'}
            </h1>
            <p style={{ color: '#8b949e', fontSize: '13px', margin: '2px 0 0 0' }}>Employee Workspace</p>
          </div>
          <div style={{ background: '#238636', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
            Active
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '24px', flex: 1 }}>

          {/* TASKS TAB */}
          {activeTab === 'tasks' && (
            <div>
              {tasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#8b949e' }}>
                  <p style={{ fontSize: '48px', marginBottom: '16px' }}>📭</p>
                  <p style={{ fontSize: '18px' }}>No tasks assigned yet</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                  {tasks.map(t => (
                    <div key={t.id} style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '16px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: t.priority === 'high' ? '#f85149' : t.priority === 'medium' ? '#f0883e' : '#3fb950' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 style={{ color: '#f0f6fc', fontWeight: '600', fontSize: '15px', margin: 0 }}>{t.title}</h3>
                        <span style={{ background: t.priority === 'high' ? '#3d0d0d' : t.priority === 'medium' ? '#3d2a00' : '#0d2d0d', color: t.priority === 'high' ? '#f85149' : t.priority === 'medium' ? '#f0883e' : '#3fb950', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', flexShrink: 0 }}>{t.priority}</span>
                      </div>
                      <p style={{ color: '#8b949e', fontSize: '13px', marginBottom: '12px', lineHeight: '1.5' }}>{t.description}</p>
                      {t.deadline && <p style={{ color: '#8b949e', fontSize: '12px', marginBottom: '12px' }}>⏰ Due: {new Date(t.deadline).toLocaleDateString()}</p>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ background: t.status === 'completed' ? '#0d2d0d' : t.status === 'in_progress' ? '#0d1f3d' : '#21262d', color: t.status === 'completed' ? '#3fb950' : t.status === 'in_progress' ? '#58a6ff' : '#8b949e', padding: '3px 10px', borderRadius: '12px', fontSize: '12px' }}>{t.status.replace('_', ' ')}</span>
                        <select value={t.status} onChange={(e) => handleUpdateStatus(t.id, e.target.value)} style={{ background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer', outline: 'none' }}>
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROGRESS TAB */}
          {activeTab === 'progress' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Left: Form */}
              <div>
                <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '20px', marginBottom: '16px' }}>
                  <h3 style={{ color: '#f0f6fc', fontWeight: '600', marginBottom: '16px', fontSize: '15px' }}>
                    {editingProgress ? '✏️ Edit Progress' : '➕ New Progress Update'}
                  </h3>
                  <form onSubmit={editingProgress ? handleUpdateProgress : handleCreateProgress} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {!editingProgress && (
                      <select value={progressForm.taskId} onChange={(e) => setProgressForm({ ...progressForm, taskId: e.target.value })} required style={{ background: '#0d1117', border: '1px solid #30363d', color: '#c9d1d9', borderRadius: '6px', padding: '8px 12px', outline: 'none', fontSize: '13px' }}>
                        <option value="">Select Task</option>
                        {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                      </select>
                    )}
                    <textarea
                      placeholder="Describe your progress..."
                      value={editingProgress ? editingProgress.content : progressForm.content}
                      onChange={(e) => editingProgress ? setEditingProgress({ ...editingProgress, content: e.target.value }) : setProgressForm({ ...progressForm, content: e.target.value })}
                      required
                      style={{ background: '#0d1117', border: '1px solid #30363d', color: '#c9d1d9', borderRadius: '6px', padding: '8px 12px', outline: 'none', minHeight: '100px', fontSize: '13px', resize: 'vertical' }}
                    />
                    <input
                      type="text"
                      placeholder="Status remark (optional)"
                      value={editingProgress ? editingProgress.statusRemark || '' : progressForm.statusRemark}
                      onChange={(e) => editingProgress ? setEditingProgress({ ...editingProgress, statusRemark: e.target.value }) : setProgressForm({ ...progressForm, statusRemark: e.target.value })}
                      style={{ background: '#0d1117', border: '1px solid #30363d', color: '#c9d1d9', borderRadius: '6px', padding: '8px 12px', outline: 'none', fontSize: '13px' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="submit" style={{ flex: 1, background: '#238636', color: 'white', border: 'none', borderRadius: '6px', padding: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                        {editingProgress ? 'Save Changes' : 'Add Update'}
                      </button>
                      {editingProgress && (
                        <button type="button" onClick={() => setEditingProgress(null)} style={{ background: '#21262d', color: '#c9d1d9', border: '1px solid #30363d', borderRadius: '6px', padding: '10px 16px', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Right: List */}
              <div>
                <h3 style={{ color: '#f0f6fc', fontWeight: '600', marginBottom: '16px', fontSize: '15px' }}>My Updates ({progress.length})</h3>
                {progress.length === 0 ? (
                  <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '40px', textAlign: 'center', color: '#8b949e' }}>
                    <p>No progress updates yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {progress.map(p => (
                      <div key={p.id} style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '14px' }}>
                        <p style={{ color: '#c9d1d9', fontSize: '13px', marginBottom: '6px', lineHeight: '1.5' }}>{p.content}</p>
                        {p.statusRemark && <p style={{ color: '#8b949e', fontSize: '12px', marginBottom: '6px' }}>📝 {p.statusRemark}</p>}
                        <p style={{ color: '#58a6ff', fontSize: '11px', marginBottom: '8px' }}>Task: {p.task?.title}</p>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => setEditingProgress(p)} style={{ background: '#21262d', color: '#58a6ff', border: '1px solid #30363d', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Edit</button>
                          <button onClick={() => handleDeleteProgress(p.id)} style={{ background: '#21262d', color: '#f85149', border: '1px solid #30363d', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* COMMENTS TAB */}
          {activeTab === 'comments' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Left: Form */}
              <div>
                <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '20px' }}>
                  <h3 style={{ color: '#f0f6fc', fontWeight: '600', marginBottom: '16px', fontSize: '15px' }}>
                    {editingComment ? '✏️ Edit Comment' : '➕ New Comment'}
                  </h3>
                  <form onSubmit={editingComment ? handleUpdateComment : handleCreateComment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {!editingComment && (
                      <select value={commentForm.taskId} onChange={(e) => { setCommentForm({ ...commentForm, taskId: e.target.value }); setSelectedTaskId(e.target.value); fetchComments(e.target.value); }} required style={{ background: '#0d1117', border: '1px solid #30363d', color: '#c9d1d9', borderRadius: '6px', padding: '8px 12px', outline: 'none', fontSize: '13px' }}>
                        <option value="">Select Task</option>
                        {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                      </select>
                    )}
                    <textarea
                      placeholder="Write your comment..."
                      value={editingComment ? editingComment.content : commentForm.content}
                      onChange={(e) => editingComment ? setEditingComment({ ...editingComment, content: e.target.value }) : setCommentForm({ ...commentForm, content: e.target.value })}
                      required
                      style={{ background: '#0d1117', border: '1px solid #30363d', color: '#c9d1d9', borderRadius: '6px', padding: '8px 12px', outline: 'none', minHeight: '120px', fontSize: '13px', resize: 'vertical' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="submit" style={{ flex: 1, background: '#238636', color: 'white', border: 'none', borderRadius: '6px', padding: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                        {editingComment ? 'Save Changes' : 'Post Comment'}
                      </button>
                      {editingComment && (
                        <button type="button" onClick={() => setEditingComment(null)} style={{ background: '#21262d', color: '#c9d1d9', border: '1px solid #30363d', borderRadius: '6px', padding: '10px 16px', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Right: Comments List */}
              <div>
                <h3 style={{ color: '#f0f6fc', fontWeight: '600', marginBottom: '16px', fontSize: '15px' }}>Comments ({comments.length})</h3>
                {comments.length === 0 ? (
                  <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '40px', textAlign: 'center', color: '#8b949e' }}>
                    <p>Select a task to view comments</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {comments.map(c => (
                      <div key={c.id} style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '14px' }}>
                        <p style={{ color: '#c9d1d9', fontSize: '13px', lineHeight: '1.5', marginBottom: '8px' }}>{c.content}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p style={{ color: '#8b949e', fontSize: '11px' }}>By {c.author?.name} · {new Date(c.createdAt).toLocaleDateString()}</p>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => setEditingComment(c)} style={{ background: '#21262d', color: '#58a6ff', border: '1px solid #30363d', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Edit</button>
                            <button onClick={() => handleDeleteComment(c.id)} style={{ background: '#21262d', color: '#f85149', border: '1px solid #30363d', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}