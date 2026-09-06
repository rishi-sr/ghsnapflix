import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FaBolt, FaMagnifyingGlass, FaHeart, FaShareNodes, FaGear } from 'react-icons/fa6';
import './FloatingActionButton.css';

const FloatingActionButton = ({ onQuickAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleMainClick = () => {
        if (onQuickAction) {
            onQuickAction();
        }
        else {
            setIsOpen(!isOpen);
        }
    };
    const handleSubAction = (action) => {
        setIsOpen(false);
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
      <div className="fab-container">
        {/* Sub Actions */}
        <div className={`fab-sub-actions ${isOpen ? 'open' : ''}`}>
          <button className="fab-sub-action" onClick={() => handleSubAction('search')} title="Quick Search">
            <FaMagnifyingGlass />
          </button>
          <button className="fab-sub-action" onClick={() => handleSubAction('favorite')} title="Add to Favorites">
            <FaHeart />
          </button>
          <button className="fab-sub-action" onClick={() => handleSubAction('share')} title="Share">
            <FaShareNodes />
          </button>
          <button className="fab-sub-action" onClick={() => handleSubAction('settings')} title="Settings">
            <FaGear />
          </button>
        </div>

        {/* Main FAB */}
        <button className={`fab-main ${isOpen ? 'open' : ''}`} onClick={handleMainClick} title="Quick Actions">
          <span className="fab-icon"><FaBolt /></span>
        </button>
      </div>,
      document.body
    );
};
export default FloatingActionButton;
