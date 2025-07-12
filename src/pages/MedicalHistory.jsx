import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Clock, AlertTriangle, MessageCircle, Trash2, Download, Filter, ChevronDown, RotateCcw, FileText } from 'lucide-react';
import { useAuth } from '../contexts/FirebaseAuthContext';
import SunIcon from '../components/SunIcon';
import { exportMedicalHistoryToPDF, exportSingleConversationToPDF } from '../utils/pdfExport';

const MedicalHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, userProfile, getMedicalHistory, deleteMedicalEntry, isAuthenticated } = useAuth();
  
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'recent', 'urgent'
  const [lastDocument, setLastDocument] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Load initial medical history
  useEffect(() => {
    loadMedicalHistory(true);
  }, []);

  const loadMedicalHistory = async (isInitial = false) => {
    if (!isAuthenticated) return;
    
    if (isInitial) {
      setIsLoading(true);
      setMedicalHistory([]);
      setLastDocument(null);
      setHasMore(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const result = await getMedicalHistory(20, isInitial ? null : lastDocument);
      
      if (result.success) {
        if (isInitial) {
          setMedicalHistory(result.entries);
        } else {
          setMedicalHistory(prev => [...prev, ...result.entries]);
        }
        
        setLastDocument(result.lastDocument);
        setHasMore(result.hasMore);
        setTotalCount(prev => isInitial ? result.entries.length : prev + result.entries.length);
      } else {
        console.error('Failed to load medical history:', result.error);
      }
    } catch (err) {
      console.error('Error loading medical history:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Delete entry
  const handleDeleteEntry = async (entryId) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;
    
    try {
      const result = await deleteMedicalEntry(entryId);
      if (result.success) {
        setMedicalHistory(prev => prev.filter(entry => entry.id !== entryId));
        setTotalCount(prev => prev - 1);
      } else {
        alert('Failed to delete conversation');
      }
    } catch (err) {
      console.error('Error deleting entry:', err);
      alert('Failed to delete conversation');
    }
  };

  // Load more entries
  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      loadMedicalHistory(false);
    }
  };

  // Filter history based on selected filter
  const filteredHistory = medicalHistory.filter(entry => {
    if (filter === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      let entryDate;
      if (entry.timestamp?.toDate) {
        entryDate = entry.timestamp.toDate();
      } else if (entry.timestamp instanceof Date) {
        entryDate = entry.timestamp;
      } else {
        entryDate = new Date(entry.timestamp);
      }
      
      return entryDate >= oneWeekAgo;
    }
    if (filter === 'urgent') {
      return entry.aiResponse?.analysis?.urgency === 'emergency_care' || entry.aiResponse?.analysis?.urgency === 'see_doctor_soon';
    }
    return true;
  });

  const formatDate = (timestamp) => {
    let date;
    if (timestamp?.toDate) {
      // Firestore timestamp
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      // Regular Date object
      date = timestamp;
    } else {
      // String timestamp
      date = new Date(timestamp);
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency_care':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'see_doctor_soon':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'monitor_at_home':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case 'emergency_care':
        return 'Emergency Care';
      case 'see_doctor_soon':
        return 'See Doctor Soon';
      case 'monitor_at_home':
        return 'Monitor at Home';
      default:
        return 'No Assessment';
    }
  };

  // Export filtered history as PDF
  const exportHistoryPDF = () => {
    exportMedicalHistoryToPDF(filteredHistory, userProfile);
  };

  // Export as JSON (backup option)
  const exportHistoryJSON = () => {
    const dataStr = JSON.stringify(filteredHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `avicenna-medical-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Export single conversation as PDF
  const exportSingleConversation = (entry) => {
    exportSingleConversationToPDF(entry, userProfile);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-indigo-900/95 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/20 via-transparent to-accent-600/20"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-400/20 rounded-full animate-float blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-accent-400/20 rounded-full animate-float blur-xl" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link 
            to="/profile" 
            className="text-white/80 hover:text-white transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center space-x-3">
            <SunIcon className="w-8 h-8 drop-shadow-lg" color="#F59E0B" />
            <span className="text-xl font-display font-bold text-white">
              Medical History
            </span>
          </div>
          <div className="w-10 h-10"></div> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 px-3 md:px-4 pb-6 md:pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="enhanced-glass-card rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 space-y-4 md:space-y-0">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                  Your Medical History
                </h1>
                <p className="text-white/70 text-base md:text-lg">
                  {totalCount} saved conversations
                  {hasMore && <span className="text-white/50"> (showing {filteredHistory.length})</span>}
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                {/* Refresh Button */}
                <button
                  onClick={() => loadMedicalHistory(true)}
                  disabled={isLoading}
                  className="mobile-btn flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-3 py-2 md:px-4 md:py-2 rounded-full hover:bg-white/20 hover:border-white/30 hover:scale-105 active:scale-95 transition-all duration-300 font-medium disabled:opacity-50 min-h-[40px]"
                >
                  <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden md:inline">Refresh</span>
                </button>
                
                {/* Filter Dropdown */}
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="mobile-form-input bg-white/10 backdrop-blur-sm text-white border border-white/20 px-3 py-2 md:px-4 md:py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-accent-400 min-h-[40px] text-sm md:text-base"
                  >
                    <option value="all" className="bg-gray-800 text-white">All Entries</option>
                    <option value="recent" className="bg-gray-800 text-white">Last Week</option>
                    <option value="urgent" className="bg-gray-800 text-white">Urgent Only</option>
                  </select>
                </div>
                
                {/* Export Buttons */}
                {filteredHistory.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={exportHistoryPDF}
                      className="flex items-center space-x-2 bg-gradient-to-r from-red-500/80 to-red-600/80 backdrop-blur-sm text-white border border-red-400/30 px-4 md:px-6 py-2 rounded-full hover:from-red-500 hover:to-red-600 hover:scale-105 transition-all duration-300 font-medium"
                      title="Export as PDF"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="hidden md:inline">PDF</span>
                    </button>
                    <button
                      onClick={exportHistoryJSON}
                      className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-4 md:px-6 py-2 rounded-full hover:bg-white/20 hover:border-white/30 hover:scale-105 transition-all duration-300 font-medium"
                      title="Export as JSON"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden md:inline">JSON</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* History List */}
          {isLoading ? (
            <div className="enhanced-glass-card rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
              <p className="text-white/70">Loading your medical history...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="enhanced-glass-card rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
              <MessageCircle className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {filter === 'all' ? 'No Medical History Yet' : 'No Entries Found'}
              </h3>
              <p className="text-white/70 mb-6">
                {filter === 'all' 
                  ? 'Start using Avicenna chat to build your medical history automatically'
                  : 'Try adjusting your filter or check back later'
                }
              </p>
              <Link 
                to="/chat"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-6 py-3 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Start New Conversation</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6">
                {filteredHistory.map((entry, index) => (
                  <div 
                    key={entry.id || index}
                    className="enhanced-glass-card rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Calendar className="w-4 h-4 text-white/60" />
                          <span className="text-white/80 text-sm">
                            {formatDate(entry.timestamp)}
                          </span>
                          <span className="text-white/40">•</span>
                          <span className="text-white/60 text-sm capitalize">
                            {entry.language || 'English'}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white mb-2">
                          Symptom Analysis
                        </h3>
                        
                        <p className="text-white/80 text-sm line-clamp-2">
                          {entry.userMessage || entry.symptoms}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        {entry.aiResponse?.analysis?.urgency && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(entry.aiResponse.analysis.urgency)}`}>
                            {getUrgencyText(entry.aiResponse.analysis.urgency)}
                          </span>
                        )}
                        
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <button 
                            onClick={() => exportSingleConversation(entry)}
                            className="text-white/60 hover:text-red-400 transition-colors p-1"
                            title="Export this conversation as PDF"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          
                          <button 
                            onClick={() => setSelectedEntry(selectedEntry === entry ? null : entry)}
                            className="text-white/60 hover:text-white transition-colors p-1"
                            title="Expand conversation details"
                          >
                            <ChevronDown className={`w-4 h-4 transform transition-transform ${selectedEntry === entry ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-red-400/60 hover:text-red-400 transition-colors p-1"
                            title="Delete conversation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Content */}
                    {selectedEntry === entry && entry.aiResponse?.analysis && (
                      <div className="mt-6 pt-6 border-t border-white/20">
                        <div className="space-y-4">
                          {/* User Message */}
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <h4 className="font-semibold text-white mb-2">Your Symptoms:</h4>
                            <p className="text-white/80 text-sm">
                              {entry.userMessage || entry.symptoms}
                            </p>
                          </div>
                          
                          {/* AI Analysis */}
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <h4 className="font-semibold text-white mb-2">AI Analysis:</h4>
                            
                            {/* Conditions */}
                            {entry.aiResponse.analysis.conditions && entry.aiResponse.analysis.conditions.length > 0 && (
                              <div className="mb-4">
                                <h5 className="font-medium text-white/90 mb-2">Possible Conditions:</h5>
                                <div className="space-y-2">
                                  {entry.aiResponse.analysis.conditions.map((condition, idx) => (
                                    <div key={idx} className="bg-white/10 rounded-lg p-3">
                                      <h6 className="font-medium text-white text-sm">{condition.name}</h6>
                                      <p className="text-white/70 text-xs mt-1">{condition.explanation}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Doctor Recommendation */}
                            {entry.aiResponse.analysis.doctor_type && (
                              <div className="mb-4">
                                <h5 className="font-medium text-white/90 mb-2">Recommended Specialist:</h5>
                                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
                                  <span className="text-blue-200 font-medium text-sm">
                                    {entry.aiResponse.analysis.doctor_type}
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            {/* Recommendations */}
                            {entry.aiResponse.analysis.recommendations && entry.aiResponse.analysis.recommendations.length > 0 && (
                              <div>
                                <h5 className="font-medium text-white/90 mb-2">Recommendations:</h5>
                                <ul className="space-y-1">
                                  {entry.aiResponse.analysis.recommendations.map((rec, idx) => (
                                    <li key={idx} className="text-white/70 text-sm flex items-start space-x-2">
                                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-3 rounded-full hover:bg-white/20 hover:border-white/30 hover:scale-105 transition-all duration-300 font-medium disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span>Load More</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory; 