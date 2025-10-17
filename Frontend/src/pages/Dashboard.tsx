import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Search, Upload, Mail, BookOpen, Award, TrendingUp, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { collaborators, grants } from '../data/sampleData';
import { sendChat } from '../lib/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello! I\'m your AI research assistant. How can I help you today?' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedGrant, setSelectedGrant] = useState<any>(null);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Dr. John Doe',
    title: 'Associate Professor, Computer Science',
    publications: 38,
    grants: 5,
    interests: ['Machine Learning', 'Natural Language Processing', 'Computer Vision', 'AI Ethics', 'Deep Learning']
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      alert(`Searching for: "${searchQuery}"\n\nThis would trigger a LangChain semantic search in production.`);
    }
  };

  const handleUploadCV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          // Simple CV parsing logic
          const lines = content.split('\n').filter(line => line.trim());
          let name = 'Unknown';
          let title = 'Unknown';
          let publications = 0;
          const interests: string[] = [];

          for (const line of lines) {
            if (line.includes('Dr.') || line.includes('Professor') || line.includes('Researcher')) {
              if (!name || name === 'Unknown') name = line.trim();
              else if (!title || title === 'Unknown') title = line.trim();
            }
            if (line.toLowerCase().includes('publication')) {
              const match = line.match(/\d+/);
              if (match) publications = parseInt(match[0]);
            }
            if (line.toLowerCase().includes('interest') || line.toLowerCase().includes('research')) {
              const nextLines = lines.slice(lines.indexOf(line) + 1, lines.indexOf(line) + 6);
              nextLines.forEach(nextLine => {
                if (nextLine.includes('-') && nextLine.length > 10) {
                  interests.push(nextLine.replace('-', '').trim());
                }
              });
            }
          }

          setProfile(prev => ({
            ...prev,
            name: name !== 'Unknown' ? name : prev.name,
            title: title !== 'Unknown' ? title : prev.title,
            publications: publications > 0 ? publications : prev.publications,
            interests: interests.length > 0 ? interests : prev.interests
          }));

          alert(`CV processed successfully!\n\nUpdated Profile:\nName: ${name}\nTitle: ${title}\nPublications: ${publications}\nInterests: ${interests.join(', ')}`);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleConnect = (collaboratorId: number) => {
    alert(`Connection request sent to collaborator ${collaboratorId}\n\nThis would create a collaboration request in production.`);
  };

  const handleRefineSearch = () => {
    alert('Refining search...\n\nThis would open advanced search filters in production.');
  };

  const handleViewDetails = (grantId: number) => {
    const grant = grants.find(g => g.id === grantId);
    if (grant) {
      setSelectedGrant(grant);
      setIsGrantModalOpen(true);
    }
  };

  const handleSave = (grantId: number) => {
    const grant = grants.find(g => g.id === grantId);
    if (grant) {
      const content = `Grant Details\n\nTitle: ${grant.title}\nAgency: ${grant.agency}\nCategory: ${grant.category}\nAmount: ${grant.amount}\nDeadline: ${grant.deadline}\nMatch Score: ${grant.matchScore}%\n`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${grant.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const userText = newMessage;
    setNewMessage('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }] );
    setIsLoading(true);
    try {
      const reply = await sendChat(
        [
          { role: 'system', content: 'You are an AI research assistant for the dashboard.' },
          { role: 'user', content: userText },
        ],
        { collaborators, grants }
      );
      setChatMessages((prev) => [...prev, { role: 'ai', text: reply }] );
    } catch (err: any) {
      setChatMessages((prev) => [...prev, { role: 'ai', text: err?.message || 'Failed to reach AI service.' }] );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Research Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back! Here's your research overview.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex relative">
                <input
                  type="text"
                  placeholder="Semantic search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      JD
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                      <p className="text-gray-600">{profile.title}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <BookOpen size={16} /> {profile.publications} Publications
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Award size={16} /> {profile.grants} Grants Awarded
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="secondary" className="flex items-center gap-2" onClick={handleUploadCV}>
                    <Upload size={18} />
                    Upload CV
                  </Button>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Research Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <span key={interest} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                  <TrendingUp size={32} className="mb-4" />
                  <div className="text-3xl font-bold mb-2">94%</div>
                  <div className="text-blue-100">Collaboration Success Rate</div>
                </Card>
                <Card className="bg-gradient-to-br from-blue-700 to-blue-800 text-white">
                  <Mail size={32} className="mb-4" />
                  <div className="text-3xl font-bold mb-2">12</div>
                  <div className="text-blue-100">Pending Invitations</div>
                </Card>
                <Card className="bg-gradient-to-br from-blue-800 to-blue-900 text-white">
                  <Award size={32} className="mb-4" />
                  <div className="text-3xl font-bold mb-2">$2.4M</div>
                  <div className="text-blue-100">Total Grants Awarded</div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Collaborators Tab */}
          {activeTab === 'collaborators' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Discover Collaborators</h2>
                  <p className="text-gray-600 mt-1">AI-matched researchers based on your profile</p>
                </div>
                <Button variant="primary" onClick={handleRefineSearch}>Refine Search</Button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {collaborators.map((collaborator) => (
                  <Card key={collaborator.id}>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {collaborator.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{collaborator.name}</h3>
                            <p className="text-sm text-gray-600">{collaborator.title}</p>
                            <p className="text-sm text-gray-500">{collaborator.department}</p>
                          </div>
                          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            {collaborator.matchScore}% Match
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {collaborator.researchInterests.map((interest) => (
                            <span key={interest} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {interest}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-gray-500">{collaborator.publications} Publications</span>
                          <Button variant="primary" className="text-sm px-4 py-2" onClick={() => handleConnect(collaborator.id)}>Connect</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Grants Tab */}
          {activeTab === 'grants' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Grant Opportunities</h2>
                  <p className="text-gray-600 mt-1">Funding opportunities matched to your research</p>
                </div>
                <Button variant="primary">Set Alerts</Button>
              </div>
              <div className="space-y-4">
                {grants.map((grant) => (
                  <Card key={grant.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{grant.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="font-semibold text-blue-600">{grant.agency}</span>
                              <span>•</span>
                              <span>{grant.category}</span>
                            </div>
                            <div className="flex items-center gap-6">
                              <div>
                                <span className="text-sm text-gray-500">Award Amount</span>
                                <div className="text-lg font-bold text-gray-900">{grant.amount}</div>
                              </div>
                              <div>
                                <span className="text-sm text-gray-500">Deadline</span>
                                <div className="text-lg font-bold text-gray-900">{grant.deadline}</div>
                              </div>
                              <div>
                                <span className="text-sm text-gray-500">Match Score</span>
                                <div className="text-lg font-bold text-green-600">{grant.matchScore}%</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="primary" className="text-sm px-4 py-2" onClick={() => handleViewDetails(grant.id)}>View Details</Button>
                        <Button variant="secondary" className="text-sm px-4 py-2" onClick={() => handleSave(grant.id)}>Save</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personalized Insights</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Trending Research Topics</h3>
                  <ul className="space-y-3">
                    {['Generative AI Applications', 'Quantum Machine Learning', 'Explainable AI', 'AI Safety & Alignment', 'Federated Learning'].map((topic, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {i + 1}
                        </div>
                        <span className="text-gray-700">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Actions</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-900 mb-1">Connect with Dr. Sarah Chen</div>
                      <p className="text-sm text-blue-700">High collaboration potential (95% match)</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="font-semibold text-green-900 mb-1">Apply: NSF AI Research Grant</div>
                      <p className="text-sm text-green-700">Deadline in 45 days • 92% match</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="font-semibold text-orange-900 mb-1">Update Research Profile</div>
                      <p className="text-sm text-orange-700">Add recent publications for better matches</p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
              <Card>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      {['New collaboration matches', 'Grant deadlines', 'Research insights', 'Connection requests'].map((pref) => (
                        <label key={pref} className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-700">{pref}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">AI Assistant Settings</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Enable proactive suggestions</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Share anonymized data for improved matching</span>
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:shadow-3xl transition-shadow"
      >
        <MessageCircle size={28} />
      </motion.button>

      {/* Chat Modal */}
      <Modal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} title="AI Research Assistant" fullScreen={true}>
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg mb-4">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about research..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} variant="primary" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Send'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Grant Details Modal */}
      {isGrantModalOpen && selectedGrant && (
        <Modal isOpen={isGrantModalOpen} onClose={() => setIsGrantModalOpen(false)} title="Grant Details">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{selectedGrant.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-semibold text-blue-600">{selectedGrant.agency}</span>
              <span>•</span>
              <span>{selectedGrant.category}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-500">Award Amount</span>
                <div className="text-lg font-bold">{selectedGrant.amount}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Deadline</span>
                <div className="text-lg font-bold">{selectedGrant.deadline}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Match Score</span>
                <div className="text-lg font-bold text-green-600">{selectedGrant.matchScore}%</div>
              </div>
            </div>
            <p className="text-gray-700">This is a detailed view of the grant opportunity. In production, this would include full description, requirements, and application instructions.</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
