import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Mail } from 'lucide-react';
import './MessengerChat.css';

interface MessengerChatProps {
  pageId?: string; // Facebook Page ID
  themeColor?: string;
}

const MessengerChat: React.FC<MessengerChatProps> = ({ 
  pageId = '100063714097270', // Young House Facebook Page ID - replace with actual
  themeColor = '#2d7dd2'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show tooltip after 5 seconds for first-time visitors
  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('messengerTooltipSeen');
    if (!hasSeenTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
        // Auto hide after 5 seconds
        setTimeout(() => {
          setShowTooltip(false);
          localStorage.setItem('messengerTooltipSeen', 'true');
        }, 5000);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const contactOptions = [
    {
      id: 'messenger',
      name: 'Messenger',
      icon: <MessageCircle size={24} />,
      color: '#0084ff',
      url: `https://m.me/${pageId}`,
      description: 'Chat trực tiếp qua Facebook'
    },
    {
      id: 'zalo',
      name: 'Zalo',
      icon: (
        <svg viewBox="0 0 48 48" width="24" height="24" fill="currentColor">
          <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm0 36c-8.822 0-16-7.178-16-16S15.178 8 24 8s16 7.178 16 16-7.178 16-16 16z"/>
          <path d="M35.653 28.049c-.368-.101-.638-.349-.88-.609-.383-.413-.608-.925-.75-1.469-.188-.722-.22-1.469-.22-2.212V17.44c0-.241.004-.483-.012-.724-.038-.577-.276-1.1-.737-1.473-.358-.29-.811-.389-1.27-.389H17.71c-.483 0-.962.036-1.395.274-.534.293-.862.79-.952 1.389-.047.312-.043.63-.043.946v11.146c0 .312-.004.625.02.936.07.863.577 1.505 1.399 1.717.25.064.51.086.768.086h16.14c.241 0 .483.004.724-.02.577-.058 1.085-.345 1.406-.836.22-.337.301-.732.305-1.128.008-.745-.166-1.42-.429-2.115v-.2z"/>
          <text x="14" y="28" fontSize="14" fontWeight="bold" fill="white">Z</text>
        </svg>
      ),
      color: '#0068ff',
      url: 'https://zalo.me/0372858098',
      description: 'Nhắn tin qua Zalo'
    },
    {
      id: 'phone',
      name: 'Gọi điện',
      icon: <Phone size={24} />,
      color: '#28a745',
      url: 'tel:0372858098',
      description: 'Hotline: 0372 858 098'
    }
  ];

  const handleContactClick = (url: string) => {
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="messenger-chat-widget">
      {/* Tooltip */}
      {showTooltip && !isOpen && (
        <div className="chat-tooltip">
          <span>Cần hỗ trợ? Chat với chúng tôi!</span>
          <button onClick={() => setShowTooltip(false)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Contact Options Panel */}
      <div className={`chat-options-panel ${isOpen ? 'open' : ''}`}>
        <div className="chat-options-header">
          <h3>Liên hệ với Young House</h3>
          <p>Chọn kênh liên lạc bạn muốn</p>
        </div>
        <div className="chat-options-list">
          {contactOptions.map(option => (
            <button
              key={option.id}
              className="chat-option-item"
              onClick={() => handleContactClick(option.url)}
              style={{ '--option-color': option.color } as React.CSSProperties}
            >
              <div className="option-icon" style={{ background: option.color }}>
                {option.icon}
              </div>
              <div className="option-info">
                <span className="option-name">{option.name}</span>
                <span className="option-desc">{option.description}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="chat-options-footer">
          <p>Hỗ trợ 24/7 từ Thứ 2 - Chủ nhật</p>
        </div>
      </div>

      {/* Main Chat Button */}
      <button 
        className={`chat-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        style={{ background: themeColor }}
        aria-label="Mở chat hỗ trợ"
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <MessageCircle size={28} />
        )}
        {!isOpen && (
          <span className="chat-pulse"></span>
        )}
      </button>
    </div>
  );
};

export default MessengerChat;
