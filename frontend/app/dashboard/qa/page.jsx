'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';

export default function QaDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reviewForm, setReviewForm] = useState({ notes: '', feedback: '', taskId: '' });
  const [editingReview, setEditingReview] = useState(null);
  const [bugForm, setBugForm] = useState({ title: '', description: '', severity: 'medium', suggestedCorrection: '', taskId: '' });
  const [editingBug, setEditingBug] = useState(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'qa_tester')) router.push('/login');
    if (user) { fetchReviews(); fetchBugs(); fetchTasks(); }
  }, [user, isLoading]);

  const fetchReviews = async () => { try { const res = await api.get('/qa/reviews'); setReviews(res.data); } catch (err) { console.error(err); } };
  const fetchBugs = async () => { try { const res = await api.get('/qa/bugs'); setBugs(res.data); } catch (err) { console.error(err); } };
  const fetchTasks = async () => { try { const res = await api.get('/admin/tasks'); setTasks(res.data); } catch (err) { console.error(err); } };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    try { await api.post('/qa/reviews', reviewForm); setReviewForm({ notes: '', feedback: '', taskId: '' }); fetchReviews(); }
    catch { alert('Error creating review'); }
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try { await api.patch(`/qa/reviews/${editingReview.id}`, { notes: editingReview.notes, feedback: editingReview.feedback, status: editingReview.status }); setEditingReview(null); fetchReviews(); }
    catch { alert('Error updating review'); }
  };

  const handleDeleteReview = async (id) => {
    if (!confirm('Delete this review?')) return;
    try { await api.delete(`/qa/reviews/${id}`); fetchReviews(); }
    catch { alert('Error deleting'); }
  };

  const handleCreateBug = async (e) => {
    e.preventDefault();
    try { await api.post('/qa/bugs', bugForm); setBugForm({ title: '', description: '', severity: 'medium', suggestedCorrection: '', taskId: '' }); fetchBugs(); }
    catch { alert('Error reporting bug'); }
  };

  const handleUpdateBug = async (e) => {
    e.preventDefault();
    try { await api.patch(`/qa/bugs/${editingBug.id}`, { title: editingBug.title, description: editingBug.description, severity: editingBug.severity, status: editingBug.status, suggestedCorrection: editingBug.suggestedCorrection }); setEditingBug(null); fetchBugs(); }
    catch { alert('Error updating bug'); }
  };

  const handleDeleteBug = async (id) => {
    if (!confirm('Delete this bug report?')) return;
    try { await api.delete(`/qa/bugs/${id}`); fetchBugs(); }
    catch { alert('Error deleting'); }
  };

  const handleApproveTask = async (taskId) => {
    try { await api.patch(`/qa/tasks/${taskId}/approve`); fetchTasks(); alert('Task approved'); }
    catch { alert('Error approving'); }
  };

  const handleRejectTask = async (taskId) => {
    try { await api.patch(`/qa/tasks/${taskId}/reject`); fetchTasks(); alert('Task rejected'); }
    catch { alert('Error rejecting'); }
  };

  if (isLoading) return (
    <div style={{ minHeight: '100vh', background: '#13111c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#a78bfa' }}>Loading...</p>
    </div>
  );

  const severityColor = (s) => s === 'critical' ? '#ef4444' : s === 'high' ? '#f97316' : s === 'medium' ? '#eab308' : '#22c55e';
  const statusColor = (s) => s === 'resolved' || s === 'approved' || s === 'completed' ? '#22c55e' : s === 'in_progress' ? '#3b82f6' : s === 'rejected' || s === 'open' ? '#ef4444' : '#6b7280';

  return (
    <div style={{ minHeight: '100vh', background: '#13111c', color: '#e2e8f0' }}>

      {/* TOP BAR */}
      <div style={{ background: '#1e1a2e', borderBottom: '1px solid #2d2a3e', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🔍</span>
            <span style={{ color: '#a78bfa', fontWeight: '700', fontSize: '16px', letterSpacing: '0.5px' }}>QA Control</span>
          </div>
          {/* Tab bar inline with header */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { key: 'reviews', label: 'Reviews', count: reviews.length },
              { key: 'bugs', label: 'Bug Reports', count: bugs.length },
              { key: 'tasks', label: 'Validate Tasks', count: tasks.length },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '6px 14px', background: activeTab === tab.key ? '#2d2a3e' : 'transparent', color: activeTab === tab.key ? '#a78bfa' : '#64748b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {tab.label}
                <span style={{ background: activeTab === tab.key ? '#a78bfa' : '#2d2a3e', color: activeTab === tab.key ? '#1e1a2e' : '#64748b', padding: '1px 6px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>{tab.count}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>{user?.name}</span>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} style={{ background: 'transparent', color: '#64748b', border: '1px solid #2d2a3e', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Logout</button>
        </div>
      </div>

      {/* STATS ROW */}
      <div style={{ background: '#1e1a2e', borderBottom: '1px solid #2d2a3e', padding: '12px 24px', display: 'flex', gap: '24px' }}>
        {[
          { label: 'Total Reviews', value: reviews.length, color: '#a78bfa' },
          { label: 'Bug Reports', value: bugs.length, color: '#f97316' },
          { label: 'Approved', value: tasks.filter(t => t.status === 'completed').length, color: '#22c55e' },
          { label: 'Rejected', value: tasks.filter(t => t.status === 'rejected').length, color: '#ef4444' },
          { label: 'Pending Review', value: tasks.filter(t => t.status === 'pending').length, color: '#eab308' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: '700', color: s.color }}>{s.value}</span>
            <span style={{ color: '#64748b', fontSize: '12px' }}>{s.label}</span>
            <span style={{ color: '#2d2a3e', fontSize: '12px' }}>|</span>
          </div>
        ))}
      </div>

      {/* MAIN PANEL */}
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* REVIEWS TAB - Split panel */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '20px' }}>
            {/* Left Panel - Form */}
            <div>
              <div style={{ background: '#1e1a2e', border: '1px solid #2d2a3e', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ background: '#2d2a3e', padding: '12px 16px' }}>
                  <h3 style={{ color: '#a78bfa', fontWeight: '600', fontSize: '14px', margin: 0 }}>
                    {editingReview ? '✏️ Edit Review' : '+ New Review'}
                  </h3>
                </div>
                <div style={{ padding: '16px' }}>
                  <form onSubmit={editingReview ? handleUpdateReview : handleCreateReview} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {!editingReview && (
                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Task</label>
                        <select value={reviewForm.taskId} onChange={(e) => setReviewForm({ ...reviewForm, taskId: e.target.value })} required style={{ width: '100%', background: '#13111c', border: '1px solid #2d2a3e', color: '#e2e8f0', borderRadius: '6px', padding: '8px 10px', outline: 'none', fontSize: '13px' }}>
                          <option value="">Select a task...</option>
                          {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                        </select>
                      </div>
                    )}
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Review Notes</label>
                      <textarea value={editingReview ? editingReview.notes : reviewForm.notes} onChange={(e) => editingReview ? setEditingReview({ ...editingReview, notes: e.target.value }) : setReviewForm({ ...reviewForm, notes: e.target.value })} required placeholder="Write your review..." style={{ width: '100%', background: '#13111c', border: '1px solid #2d2a3e', color: '#e2e8f0', borderRadius: '6px', padding: '8px 10px', outline: 'none', fontSize: '13px', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Feedback (optional)</label>
                      <textarea value={editingReview ? editingReview.feedback || '' : reviewForm.feedback} onChange={(e) => editingReview ? setEditingReview({ ...editingReview, feedback: e.target.value }) : setReviewForm({ ...reviewForm, feedback: e.target.value })} placeholder="Additional feedback..." style={{ width: '100%', background: '#13111c', border: '1px solid #2d2a3e', color: '#e2e8f0', borderRadius: '6px', padding: '8px 10px', outline: 'none', fontSize: '13px', minHeight: '60px', resize: 'vertical', boxSizing: 'border-box' }} />
                    </div>
                    {editingReview && (
                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Status</label>
                        <select value={editingReview.status} onChange={(e) => setEditingReview({ ...editingReview, status: e.target.value })} style={{ width: '100%', background: '#13111c', border: '1px solid #2d2a3e', color: '#e2e8f0', borderRadius: '6px', padding: '8px 10px', outline: 'none', fontSize: '13px' }}>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <button type="submit" style={{ flex: 1, background: '#7c3aed', color: 'white', border: 'none', borderRadius: '6px', padding: '9px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                        {editingReview ? 'Save' : 'Submit Review'}
                      </button>
                      {editingReview && <button type="button" onClick={() => setEditingReview(null)} style={{ background: '#2d2a3e', color: '#94a3b8', border: 'none', borderRadius: '6px', padding: '9px 14px', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Panel - List */}
            <div>
              <h3 style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '15px', marginBottom: '12px' }}>All Reviews ({reviews.length})</h3>
              {reviews.length === 0 ? (
                <div style={{ background: '#1e1a2e', border: '1px solid #2d2a3e', borderRadius: '10px', padding: '60px', textAlign: 'center', color: '#64748b' }}>
                  <p style={{ fontSize: '32px', marginBottom: '8px' }}>📝</p>
                  <p>No reviews submitted yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {reviews.map(r => (
                    <div key={r.id} style={{ background: '#1e1a2e', border: '1px solid #2d2a3e', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, marginRight: '12px' }}>
                        <p style={{ color: '#e2e8f0', fontSize: '14px', marginBottom: '4px', lineHeight: '1.5' }}>{r.notes}</p>
                        {r.feedback && <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>💬 {r.feedback}</p>}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#64748b', fontSize: '11px' }}>Task: {r.task?.title}</span>
                          <span style={{ width: '4px', height: '4px', background: '#2d2a3e', borderRadius: '50%', display: 'inline-block' }} />
                          <span style={{ background: statusColor(r.status) + '22', color: statusColor(r.status), padding: '1px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600' }}>{r.status}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button onClick={() => setEditingReview(r)} style={{ background: '#2d2a3e', color: '#a78bfa', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                        <button onClick={() => handleDeleteReview(r.id)} style={{ background: '#2d2a3e', color: '#ef4444', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* BUGS TAB - Split panel */}
        {activeTab === 'bugs' && (
          <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '20px' }}>
            {/* Left - Form */}
            <div>
              <div style={{ background: '#1e1a2e', border: '1px solid #2d2a3e', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ background: '#2d2a3e', padding: '12px 16px' }}>
                  <h3 style={{ color: '#f97316', fontWeight: '600', fontSize: '14px', margin: 0 }}>
                    {editingBug ? '✏️ Edit Bug Report' : '🐛 Report New Bug'}
                  </h3>
                </div>
                <div style={{ padding: '16px' }}>
                  <form onSubmit={editingBug ? handleUpdateBug : handleCreateBug} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Bug Title</label>
                      <input type="text" value={editingBug ? editingBug.title : bugForm.title} onChange={(e) => editingBug ? setEditingBug({ ...editingBug, title: e.target.value }) : setBugForm({ ...bugForm, title: e.target.value })} required placeholder="Brief description..." style={{ width: '100%', background: '#13111c', border: '1px solid #2d2a3e', color: '#e2e8f0', borderRadius: '6px', padding: '8px 10px', outline: 'none', fontSize: '13px', boxSizing: 'border-box' }} />
                    </div>
                    {!editingBug && (
                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Related Task</label>
                        <select value={bugForm.taskId} onChange={(e) => setBugForm({ ...bugForm, taskId: e.target.value })} required style={{ width: '100%', background: '#13111c', border: '1px solid #2d2a3e', color: '#e2e8f0', borderRadius: '6px', padding: '8px 10px', outline: 'none', fontSize: '13px' }}>
                          <option value="">Select task...</option>
                          {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                        </select>
                      </div>
                    )}
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Description</label>
                      <textarea value={editingBug ? editingBug.description : bugForm.description} onChange={(e) => editingBug ? setEditingBug({ ...editingBug, description: e.target.value }) : setBugForm({ ...bugForm, description: e.target.value })} required placeholder="Detailed description..." style={{ width: '100%', background: '#13111c', border: '1px solid #2d2a3e', color: '#e2e8f0', borderRadius: '6px', padding: '8px 10px', outline: 'none', fontSize: '13px', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Severity</label>
                      <select value={editingBug ? editingBug.severity : bugForm.severity} onChange={(e) => editingBug ? setEditingBug({ ...editingBug, severity: e.target.value }) : setBugForm({ ...bugForm, severity: e.target.value })} style={{ width: '100%', background: '#13111c', border: '1px solid #2d2a3e', color: '#e2e8f0', borderRadius: '6px', padding: '8px 10px', outline: 'none', fontSize: '13px' }}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    {editingBug && (
                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Status</label>
                        <select value={editingBug.status} onChange={(e) => setEditingBug({ ...editingBug, status: e.target.value })} style={{ width: '100%', background: '#13111c', border: '1px solid #2d2a3e', color: '#e2e8f0', borderRadius: '6px', padding: '8px 10px', outline: 'none', fontSize: '13px' }}>
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    )}
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Suggested Fix (optional)</label>
                      <input type="text" value={editingBug ? editingBug.suggestedCorrection || '' : bugForm.suggestedCorrection} onChange={(e) => editingBug ? setEditingBug({ ...editingBug, suggestedCorrection: e.target.value }) : setBugForm({ ...bugForm, suggestedCorrection: e.target.value })} placeholder="Suggested correction..." style={{ width: '100%', background: '#13111c', border: '1px solid #2d2a3e', color: '#e2e8f0', borderRadius: '6px', padding: '8px 10px', outline: 'none', fontSize: '13px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <button type="submit" style={{ flex: 1, background: '#c2410c', color: 'white', border: 'none', borderRadius: '6px', padding: '9px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                        {editingBug ? 'Save Changes' : 'Report Bug'}
                      </button>
                      {editingBug && <button type="button" onClick={() => setEditingBug(null)} style={{ background: '#2d2a3e', color: '#94a3b8', border: 'none', borderRadius: '6px', padding: '9px 14px', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right - Bug List */}
            <div>
              <h3 style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '15px', marginBottom: '12px' }}>Bug Reports ({bugs.length})</h3>
              {bugs.length === 0 ? (
                <div style={{ background: '#1e1a2e', border: '1px solid #2d2a3e', borderRadius: '10px', padding: '60px', textAlign: 'center', color: '#64748b' }}>
                  <p style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</p>
                  <p>No bugs reported yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {bugs.map(b => (
                    <div key={b.id} style={{ background: '#1e1a2e', border: `1px solid ${severityColor(b.severity)}33`, borderLeft: `3px solid ${severityColor(b.severity)}`, borderRadius: '10px', padding: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, marginRight: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ color: severityColor(b.severity), fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{b.severity}</span>
                            <span style={{ width: '3px', height: '3px', background: '#2d2a3e', borderRadius: '50%', display: 'inline-block' }} />
                            <span style={{ background: statusColor(b.status) + '22', color: statusColor(b.status), padding: '1px 8px', borderRadius: '10px', fontSize: '11px' }}>{b.status.replace('_', ' ')}</span>
                          </div>
                          <p style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{b.title}</p>
                          <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.4', marginBottom: '4px' }}>{b.description}</p>
                          <p style={{ color: '#64748b', fontSize: '11px' }}>Task: {b.task?.title}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                          <button onClick={() => setEditingBug(b)} style={{ background: '#2d2a3e', color: '#a78bfa', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                          <button onClick={() => handleDeleteBug(b.id)} style={{ background: '#2d2a3e', color: '#ef4444', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TASK VALIDATION TAB */}
        {activeTab === 'tasks' && (
          <div>
            <h3 style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '15px', marginBottom: '16px' }}>Task Validation Queue ({tasks.length})</h3>
            {tasks.length === 0 ? (
              <div style={{ background: '#1e1a2e', border: '1px solid #2d2a3e', borderRadius: '10px', padding: '60px', textAlign: 'center', color: '#64748b' }}>
                <p style={{ fontSize: '32px', marginBottom: '8px' }}>✅</p>
                <p>No tasks to validate</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
                {tasks.map(t => (
                  <div key={t.id} style={{ background: '#1e1a2e', border: '1px solid #2d2a3e', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #2d2a3e' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h4 style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '14px', margin: 0 }}>{t.title}</h4>
                        <span style={{ background: statusColor(t.status) + '22', color: statusColor(t.status), padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600', flexShrink: 0, marginLeft: '8px' }}>{t.status.replace('_', ' ')}</span>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>
                        Priority: <span style={{ color: severityColor(t.priority === 'high' ? 'high' : t.priority === 'medium' ? 'medium' : 'low') }}>{t.priority}</span>
                        {t.assignedEmployees?.length > 0 && <span> · 👤 {t.assignedEmployees.map(e => e.name).join(', ')}</span>}
                      </p>
                    </div>
                    <div style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleApproveTask(t.id)} style={{ flex: 1, background: '#14532d', color: '#22c55e', border: '1px solid #22c55e33', borderRadius: '6px', padding: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                        ✓ Approve
                      </button>
                      <button onClick={() => handleRejectTask(t.id)} style={{ flex: 1, background: '#450a0a', color: '#ef4444', border: '1px solid #ef444433', borderRadius: '6px', padding: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}