'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mail, MoreVertical, Search, Edit2, Share2, ChevronDown, ChevronUp, Plus, ArrowBigRight, FileText, X, Loader, Eye, Trash } from 'lucide-react';
import { handleDeleteJobApplication } from '@/lib/actions/application-management-actions';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { getApplicationsByJobIdWithScore, updateApplicationStatus } from '@/lib/api/applications';
import { useAuth } from '@/context/AuthContext';

interface Candidate {
  id: string;
  _id?: string;
  talentId?: string;
 
  fullName?: string;
  email: string;
  matchScore: number;
  currentRole?: string;
  createdAt?: string;
  image?: string;
  expanded?: boolean;
  experience: string;
  location: string;
  notice: string;
  skills: string[];
  summary: string;
  phoneNumber?: string;
  yearsOfExperience?: number;
  status?: 'Pending' | 'Reviewing' | 'Shortlisted' | 'Rejected' | 'Accepted';
}

// Remove the hardcoded CANDIDATES constant - we'll fetch from API instead



export default function JobPipeline() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const jobId = searchParams.get('jobId');
const jobTitle = searchParams.get('jobTitle')
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchScoreFilter, setMatchScoreFilter] = useState('0');
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);

  const handleDeleteClick = (candidate: Candidate) => {
    setCandidateToDelete(candidate);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!candidateToDelete) return;
    setDeletingId(candidateToDelete.id);
    try {
      const response = await handleDeleteJobApplication(candidateToDelete.id);
      if (response.success) {
        setCandidates((prev) => prev.filter((c) => c.id !== candidateToDelete.id));
        toast.success('Application deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete application');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete application');
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setCandidateToDelete(null);
    }
  };

  // Fetch applications for the job
  useEffect(() => {
    const fetchApplications = async () => {
      if (!jobId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get token from cookie via API call
      
        const response = await getApplicationsByJobIdWithScore(jobId);
        
        if (response.success && response.data) {
          // Map API response to Candidate format
          const mappedCandidates = Array.isArray(response.data)
            ? response.data.map((app: any, idx: number) => ({
              id: app._id || `app-${idx}`,
              _id: app._id,
              talentId: app.talentId,
                
                fullName: `${app.fullName || 'Unknown'}`,
                email: app.email || '',
                matchScore: app.matchScore ?? 0,
                currentRole: app.currentJobTitle || 'Not specified',
                createdAt: app.createdAt || new Date().toISOString(),
                image: app.profilePicturePath
                  ? `http://localhost:5050/profile_pictures/${app.profilePicturePath}`
                  : undefined,
                experience: `${app.yearsOfExperience || 0}+ Years`,
                location: app.currentLocation || 'Not specified',
                notice: app.noticePeriod || 'Not specified',
                skills: app.keySkills || [],
                summary: app.coverLetter || 'No summary provided',
                phoneNumber: app.phoneNumber || '',
                yearsOfExperience: app.yearsOfExperience || 0,
                status: app.status || 'Pending',
              }))
            : [];

          setCandidates(mappedCandidates);
          setFilteredCandidates(mappedCandidates);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  // Filter candidates based on search and match score
  useEffect(() => {
    let filtered = candidates;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.currentRole?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Match score filter
    const scoreThreshold = parseInt(matchScoreFilter);
    if (!Number.isNaN(scoreThreshold) && scoreThreshold > 0) {
      filtered = filtered.filter((candidate) => candidate.matchScore >= scoreThreshold);
    }

    setFilteredCandidates(filtered);
    setCurrentPage(1);
  }, [searchQuery, matchScoreFilter, candidates]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStatusUpdate = async (candidateId: string, newStatus: 'Reviewing' | 'Shortlisted' | 'Rejected') => {
    try {
      setStatusUpdating(candidateId);
      
      // Get token from cookie or localStorage
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1] || localStorage.getItem('auth_token') || '';

      if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
      }

      const response = await updateApplicationStatus(candidateId, newStatus);

      if (response.success) {
        // Update local state
        setCandidates((prev) =>
          prev.map((candidate) =>
            candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate
          )
        );
      } else {
        alert('Failed to update status: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating application status');
    } finally {
      setStatusUpdating(null);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 80) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  };

  const getAvatarColorClass = (fullName?: string, email?: string) => {
    const colorClasses = [
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
      'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    ];

    const seed = `${fullName || ''}${email || ''}`;
    const hash = seed
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return colorClasses[hash % colorClasses.length];
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">


      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Title Section */}
        <div className="py-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white">
            {`Applicants for ${jobTitle}`}
            </h2>
            {!jobId && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Select a job from the jobs table to view applications
              </p>
            )}
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
              <div className="flex h-2 w-2 rounded-full bg-green-500"></div>
              <span>Status: Active</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
             
            </div>
          </div>
       
        </div>



        {/* Filters and Actions */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email or current role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 dark:text-white"
              />
            </div>
          
         
          </div>
        </div>

        {/* Candidates Table */}
        <div className="pb-10">
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="animate-spin text-blue-600" size={40} />
                <span className="ml-3 text-slate-600 dark:text-slate-400">Loading applications...</span>
              </div>
            ) : !jobId ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400">No job selected</p>
                  <p className="text-xs text-slate-500 mt-2">Please select a job from the jobs table</p>
                </div>
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400">No candidates found</p>
                  <p className="text-xs text-slate-500 mt-2">Try adjusting your search or filters</p>
                </div>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="w-12 px-6 py-4"></th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                          Match Score <ChevronDown size={14} />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Current Role</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Date Applied</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredCandidates.map((candidate) => (
                      <React.Fragment key={candidate.id}>
                        <tr
                          className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group"
                          onClick={() => toggleExpand(candidate.id)}
                        >
                          <td className="px-6 py-4 text-center">
                            {expandedId === candidate.id ? (
                              <ChevronUp className="text-blue-600" size={20} />
                            ) : (
                              <ChevronDown className="text-slate-400 group-hover:text-blue-600 transition-colors" size={20} />
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {candidate.image ? (
                                <img
                                  src={candidate.image}
                                  alt={candidate.fullName}
                                  className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                />
                              ) : (
                                <div className={`h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm font-bold uppercase ${getAvatarColorClass(candidate.fullName, candidate.email)}`}>
                                  {(candidate.fullName?.trim()?.charAt(0) || '?')}
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                  {candidate.fullName}
                                </p>
                                <p className="text-xs text-slate-500">{candidate.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getMatchColor(candidate.matchScore)}`}>
                              {candidate.matchScore}% Match
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{candidate.currentRole}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {new Date(candidate.createdAt || '').toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => router.push(`/employer/jobs/applicants/${candidate.id}?userId=${candidate.talentId || candidate.id}&applicationId=${candidate._id || candidate.id}${jobId ? `&jobId=${jobId}` : ''}`)}
                                className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 hover:border-blue-600 transition-all"
                                title="View Profile"
                              >
                                <Eye size={18} />
                              </button>
                          
                              <button
                                className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all disabled:opacity-50"
                                title="Delete Application"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDeleteClick(candidate);
                                }}
                                disabled={deletingId === candidate.id}
                              >
                                {deletingId === candidate.id ? (
                                  <Loader size={18} className="animate-spin" />
                                ) : (
                                  <Trash size={18} />
                                )}
                              </button>
                                  {/* Delete Confirmation Modal */}
                                  <DeleteConfirmationModal
                                    isOpen={showDeleteModal}
                                    onClose={() => {
                                      setShowDeleteModal(false);
                                      setCandidateToDelete(null);
                                    }}
                                    onConfirm={handleConfirmDelete}
                                    isLoading={!!deletingId}
                                    candidateName={candidateToDelete?.fullName}
                                  />
                            </div>
                          </td>
                        </tr>
                        {expandedId === candidate.id && (
                          <tr className="bg-blue-50 dark:bg-blue-950/20">
                            <td colSpan={6} className="px-12 py-6">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Candidate Profile</h4>
                                  <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                    <p><strong>Experience:</strong> {candidate.experience}</p>
                                    <p><strong>Location:</strong> {candidate.location}</p>
                                    <p><strong>Notice Period:</strong> {candidate.notice}</p>
                                  </div>
                                  <div className="pt-2">
                                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Key Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {candidate.skills.map((skill) => (
                                        <span key={skill} className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-700 dark:text-slate-300">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="lg:col-span-2 flex flex-col gap-4">
                                  
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-between">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Showing {filteredCandidates.length} of {candidates.length} candidates
                  </p>
                  <div className="flex gap-2">
                    <button
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded hover:bg-white dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button className="px-3 py-1 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded hover:bg-white dark:hover:bg-slate-800 transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}