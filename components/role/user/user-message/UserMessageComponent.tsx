'use client';

import React, { useState } from 'react';
import {
  Paperclip,
  Send,
  MoreVertical,
  Search,
  Archive,
  Check,
  CheckCheck,
  Bell,
  Calendar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  company: string;
  position: string;
  location: string;
  lastMessage: string;
  time: string;
  isRead: boolean;
}

export default function UserMessageComponent() {
  const [activeTab, setActiveTab] = useState<'unread' | 'pending' | 'archived'>(
    'unread',
  );
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const conversations: Message[] = [
    {
      id: '1',
      company: 'Acme Corp',
      position: 'Développeur Frontend',
      location: 'Paris',
      lastMessage:
        'Bonjour, nous avons bien reçu votre candidature pour le poste de Développeur Frontend.',
      time: '14:30',
      isRead: false,
    },
    {
      id: '2',
      company: 'Tech Solutions',
      position: 'Full Stack Developer',
      location: 'Lyon',
      lastMessage: 'Merci pour votre intérêt pour le poste...',
      time: '12:45',
      isRead: true,
    },
  ];

  const handleArchive = () => {
    setShowMenu(false);
    // Add archive logic here
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setShowNotification(true);
    setNewMessage('');

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      (conv.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!dateFilter || conv.time.includes(dateFilter)),
  );

  return (
    <div className="min-h-full w-full px-12 py-6">
      <main className="flex-1 transition-all duration-300">
        <div className="flex gap-6 h-[calc(100vh-3rem)]">
          {/* Success Notification */}
          <AnimatePresence>
            {showNotification && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                Message envoyé avec succès
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conversations List */}
          <div className="w-96 bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-gray-200 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une conversation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--u-primary-color)] focus:ring-2 focus:ring-[var(--u-primary-color)]/20"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--u-primary-color)] focus:ring-2 focus:ring-[var(--u-primary-color)]/20"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === 'unread'
                    ? 'text-[var(--u-primary-color)] border-b-2 border-[var(--u-primary-color)]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Bell className="w-4 h-4" />
                Conversations
              </button>
            </div>

            {/* Conversations */}
            <div className="overflow-y-auto h-[calc(100vh-13rem)]">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Aucune conversation trouvée
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <motion.button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id
                        ? 'bg-[var(--u-primary-color)]/5'
                        : ''
                    } ${!conversation.isRead ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            <span
                              className={
                                !conversation.isRead
                                  ? 'bg-[var(--u-primary-color)]/10 px-2 py-0.5 rounded-md'
                                  : ''
                              }
                            >
                              {conversation.company}
                            </span>
                          </h3>
                          <div className="flex items-center gap-2">
                            {conversation.isRead ? (
                              <CheckCheck className="w-4 h-4 text-[var(--u-primary-color)]" />
                            ) : (
                              <Check className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-500">
                              {conversation.time}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {conversation.position} • {conversation.location}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden">
            {selectedConversation && (
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className="font-semibold text-gray-900">Acme Corp</h2>
                      <p className="text-sm text-gray-600">
                        Développeur Frontend • Paris
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mr-4">
                      <button className="px-4 py-2 bg-[#06B6D4] text-white rounded-full hover:bg-[#0891b2] transition-colors text-sm font-medium">
                        Mon CV pour ce poste
                      </button>
                      <button className="px-4 py-2 bg-[#8B5CF6] text-white rounded-full hover:bg-[#7c3aed] transition-colors text-sm font-medium">
                        La fiche de poste
                      </button>
                    </div>
                    <div className="flex items-center gap-2 relative">
                      <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {showMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10"
                          >
                            <button
                              onClick={handleArchive}
                              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Archive className="w-4 h-4" />
                              Archiver la conversation
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 min-h-0">
                  <div className="flex items-start gap-3 max-w-2xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium">A</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white rounded-xl p-3 shadow-md">
                        <p className="text-gray-900">
                          Bonjour, nous avons bien reçu votre candidature pour
                          le poste de Développeur Frontend.
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 ml-2">14:30</span>
                    </div>
                  </div>

                  <div className="flex items-start justify-end gap-3 max-w-2xl ml-auto">
                    <div className="flex-1">
                      <div className="bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-white rounded-xl p-3 shadow-md">
                        <p>
                          Merci pour votre retour ! Je suis très intéressé par
                          cette opportunité.
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 ml-2">14:35</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium">V</span>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 bg-white border-t shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Écrivez votre message..."
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 bg-gray-50"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-3 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-white rounded-full hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
