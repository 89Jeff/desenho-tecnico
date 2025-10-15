// src/components/Toolbar.jsx (VERSÃO ORIGINAL - REINSTALE ESSA)
import React from 'react';

// Estilos de botão inline
const buttonStyles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '15px 10px 30px',
    maxWidth: '95vw',
    margin: '10px auto 0',
  },
  base: {
    margin: '10px 6px', 
    padding: '18px 30px', 
    fontSize: '18px', 
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '12px', 
    cursor: 'pointer',
    color: '#ffffff',
    flexGrow: 1, 
    minWidth: '140px',
    maxWidth: '48%', 
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', 
    transition: 'all 0.2s ease-in-out',
  }
};

const getButtonStyle = (currentMode, targetMode, color, activeColor) => ({
  ...buttonStyles.base,
  backgroundColor: currentMode === targetMode ? activeColor : color,
  color: targetMode === 'eraser' ? '#333' : '#fff'
});

const Toolbar = ({ mode, setMode, onClear, onSave }) => {
  return (
    <div style={buttonStyles.container}>
        
      {/* Botão de Texto */}
      <button 
        style={getButtonStyle(mode, 'text', '#007bff', '#17a2b8')} 
        onClick={() => setMode(mode === 'text' ? 'draw' : 'text')}
      >
        🅣 Inserir Texto
      </button>
      
      {/* Botão de Borracha */}
      <button 
        style={getButtonStyle(mode, 'eraser', '#ffc107', '#ffcd39')} 
        onClick={() => setMode(mode === 'eraser' ? 'draw' : 'eraser')}
      >
        🧽 Borracha
      </button>
      
      {/* Botão de Salvar */}
      <button 
        style={{ ...buttonStyles.base, backgroundColor: '#28a745' }} 
        onClick={onSave} // CHAMAVA onSave DIRETAMENTE
      >
        💾 Salvar Croqui
      </button>
      
      {/* Botão de Limpar */}
      <button 
        style={{ ...buttonStyles.base, backgroundColor: '#dc3545' }} 
        onClick={onClear} // CHAMAVA onClear DIRETAMENTE
      >
        🗑 Limpar Tudo
      </button>
    </div>
  );
};

export default Toolbar;