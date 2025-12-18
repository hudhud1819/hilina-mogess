import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder array for your 64 documents
// In a real app, this data would come from an API or a config file.
const documentList = [
    { id: '01', title: 'Document Creation Form', docNo: 'OF/DG/001' },
    { id: '02', title: 'Document Approval Request Form', docNo: 'OF/DG/002' },
    // You would add the remaining 62 documents here...
    { id: '64', title: 'Some Other Document', docNo: 'OF/DG/064' }, 
];

const DocumentSelector = () => {
  return (
    <div className="document-selector">
      <h1>INSA Document Portal Index</h1>
      <p>Please select a form to view and fill out:</p>

      <ul style={{ listStyleType: 'none', padding: 0, width: '600px', margin: '20px auto' }}>
        {documentList.map((doc) => (
          <li 
            key={doc.id} 
            style={{ 
              marginBottom: '10px', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '5px',
              backgroundColor: '#fff'
            }}
          >
            {/* The Link component navigates to the dynamic route: /documents/:formId */}
            <Link 
              to={`/documents/${doc.id}`} 
              style={{ textDecoration: 'none', color: '#0056b3', fontWeight: 'bold' }}
            >
              {`[${doc.docNo}] - ${doc.title}`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentSelector;