import React, { useState } from 'react';
import './Form20.css';
import DocumentHeader from '../../DocumentHeader/DocumentHeader';
import FormFooter from '../../DocumentHeader/FormFooter';

const Form20 = ({ onBack, submitting }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        nonConformity: '',
        whys: [
            { question: '', answer: '' },
            { question: '', answer: '' },
            { question: '', answer: '' },
            { question: '', answer: '' },
            { question: '', answer: '' }
        ]
    });

    // Total pages reduced to 2
    const totalPages = 2;

    const handleWhyChange = (index, field, value) => {
        const updatedWhys = [...formData.whys];
        updatedWhys[index] = { ...updatedWhys[index], [field]: value };
        setFormData({ ...formData, whys: updatedWhys });
    };

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    const renderPageContent = () => {
        switch (currentPage) {
            case 1:
                return (
                    <div className="f20-page-container">
                        <div className="f20-grey-header-strip">Instruction:</div>
                        <div className="f20-instruction-content">
                            <ol className="f20-main-ol">
                                <li><strong> Define the Non-conformity:</strong> Start by clearly stating the specific issue you're trying to solve.</li>
                                <li><strong> Ask "Why" Five Times (or less):</strong> Begin with the problem statement and ask "Why" this problem happened.
                                    <ul className="f20-sub-ul">
                                        <li>Write down the answer clearly below the problem statement.</li>
                                        <li>Based on the answer to the first "Why," ask another "Why" question about that answer.</li>
                                        <li>Continue asking "Why" and recording the answers until you reach the root cause.</li>
                                    </ul>
                                </li>
                                <li><strong> Identify the Root Cause:</strong> The root cause should be the underlying reason for the problem, not just a symptom.</li>
                            </ol>
                        </div>

                        <div className="f20-grey-header-strip">5 Whys Technique</div>
                        
                        <div className="f20-main-input-area">
                            <div className="f20-row">
                                <span className="f20-bold-label">Non-Conformity:</span>
                                <textarea className="f20-large-input" rows="1" value={formData.nonConformity} onChange={(e) => setFormData({...formData, nonConformity: e.target.value})} />
                            </div>

                            {[0, 1, 2].map((i) => (
                                <div key={i} className="f20-why-set">
                                    <div className="f20-row">
                                        <span className="f20-bold-label">{i + 1}. Why</span>
                                        <input className="f20-large-input" value={formData.whys[i].question} onChange={(e) => handleWhyChange(i, 'question', e.target.value)} />
                                        <span className="f20-bold-label">?</span>
                                    </div>
                                    <div className="f20-row f20-indent-large f20-align-start">
                                        <span className="f20-bold-label">Because</span>
                                        <textarea 
                                            className="f20-large-input f20-two-line" 
                                            rows="2" 
                                            value={formData.whys[i].answer} 
                                            onChange={(e) => handleWhyChange(i, 'answer', e.target.value)} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="f20-page-container">
                        <div className="f20-main-input-area">
                            {[3, 4].map((i) => (
                                <div key={i} className="f20-why-set">
                                    <div className="f20-row">
                                        <span className="f20-bold-label">{i + 1}. Why</span>
                                        <input className="f20-large-input" value={formData.whys[i].question} onChange={(e) => handleWhyChange(i, 'question', e.target.value)} />
                                        <span className="f20-label">?</span>
                                    </div>
                                    <div className="f20-row f20-indent-large f20-align-start">
                                        <span className="f20-bold-label">Because</span>
                                        <textarea className="f20-large-input f20-two-line" rows="2" value={formData.whys[i].answer} onChange={(e) => handleWhyChange(i, 'answer', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="f20-grey-header-strip">An Example of root cause analysis</div>
                        
                        <div className="f20-padded-example">
                             <p><strong>Non-Conformity:</strong> Non-compliance with documentation requirements for organizational records</p>
                             <p><strong>1. Why is there non-compliance with documentation requirements for organizational records?</strong></p>
                             <p className="f20-indent-example">• Because the records are not consistently updated and maintained.</p>
                             
                             <p><strong>2. Why are the records not consistently updated and maintained?</strong></p>
                             <p className="f20-indent-example">• Because the secretaries are not following the document control procedure.</p>
                             
                             <p><strong>3. Why are the secretaries not following the record control procedure?</strong></p>
                             <p className="f20-indent-example">• Because they are not fully committed to following record control procedures for records.</p>
                             
                             <p><strong>4. Why are they not fully committed to following the record control procedure for organizational records?</strong></p>
                             <p className="f20-indent-example">• Because all secretaries are not aware of the relevance of the quality management system.</p>
                             
                             <p><strong>5. Why do secretaries are not aware of the relevance of quality management systems?</strong></p>
                             <p className="f20-indent-example">• Because the training has not been prepared for all secretaries</p>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="f20-document-container">
            <div className="f20-master-layout">
                <DocumentHeader 
                    docTitle="ROOT CAUSE ANALYSIS FORM" 
                    docNo="OF/DG/020" 
                    issueNo="1" 
                    pageInfo={`Page ${currentPage} of ${totalPages}`} 
                />
                <div className="f20-document-body">
                    {renderPageContent()}
                </div>
                <FormFooter 
                    onCancel={currentPage === 1 ? onBack : prevPage} 
                    onSubmit={currentPage === totalPages ? () => console.log(formData) : nextPage} 
                    isSubmitting={submitting}
                    submitText={currentPage === totalPages ? "SUBMIT" : "NEXT PAGE"}
                    cancelText={currentPage === 1 ? "CANCEL" : "BACK"}
                />
            </div>
        </div>
    );
};

export default Form20;