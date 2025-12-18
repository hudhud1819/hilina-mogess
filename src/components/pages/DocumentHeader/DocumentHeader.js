import React from 'react';
import logo from "../../../assets/logo.png";
import './DocumentHeader.css'; 

/**
 * Reusable Header Component for all INSA documents.
 * @param {object} props - Properties passed to the component
 * @param {string} props.docTitle - The main title of the document (e.g., "DOCUMENT CREATION FORM")
 * @param {string} props.docNo - The unique document number (e.g., "OF/DG/001")
 * @param {string} props.issueNo - The current issue number (e.g., "1")
 * @param {string} props.pageInfo - The page information (e.g., "Page 1 of 1")
 */
const DocumentHeader = ({ docTitle, docNo, issueNo, pageInfo }) => {
  return (
    <div className="document-header">
      
      {/* ========================================================================= */}
      {/* 1. LOGO SECTION                                                           */}
      {/* ========================================================================= */}
      <div className="logo-section">
        <img src={logo} alt="Information Network Security Administration Logo" className="main-logo" />
      </div>
      
      {/* ========================================================================= */}
      {/* 2. INFO GRID SECTION                                                      */}
      {/* ========================================================================= */}
      <div className="info-grid">
        
        {/* Row 1: Company Name & Document No. */}
        <div className="grid-row grid-row-1">
          <div className="cell cell-company-name">
            <span className="label">Company Name:</span>
            <p className="company-text-amharic">የኢንፎርሜሽን ኔትወርክ ደህንነት አስተዳደር</p>
            <p className="company-text-english">INFORMATION NETWORK SECURITY ADMINISTRATION</p>
          </div>
          <div className="cell cell-document-no">
            <span className="label">Document No.:</span>
            <span className="value">{docNo}</span>
          </div>
        </div>
        
        {/* Row 2: Title & Issue/Page No. */}
        <div className="grid-row grid-row-2">
          <div className="cell cell-title">
            <span className="label">Title:</span>
            <span className="value">{docTitle}</span>
          </div>
          <div className="cell cell-issue-page-no">
            <div className="issue-section">
              <span className="label">Issue No.:</span>
              <span className="value">{issueNo}</span>
            </div>
            <div className="page-section">
              <span className="label">Page No.:</span>
              <span className="value">{pageInfo}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentHeader;