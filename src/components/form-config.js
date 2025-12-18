// form-config.js
// Centralized form configurations for all forms in the system

// ==================== FIELD TYPES CONFIGURATION ====================
export const fieldTypes = {
  text: {
    component: 'Input',
    props: ['placeholder', 'maxLength', 'minLength', 'pattern'],
    validation: 'string'
  },
  textarea: {
    component: 'TextArea',
    props: ['placeholder', 'rows', 'maxLength', 'minLength'],
    validation: 'string'
  },
  select: {
    component: 'Select',
    props: ['options', 'placeholder', 'multiple', 'searchable'],
    validation: 'option'
  },
  date: {
    component: 'DatePicker',
    props: ['minDate', 'maxDate', 'dateFormat', 'disabledDates'],
    validation: 'date'
  },
  number: {
    component: 'InputNumber',
    props: ['min', 'max', 'step', 'placeholder', 'precision'],
    validation: 'number'
  },
  file: {
    component: 'FileUpload',
    props: ['multiple', 'accept', 'maxSize', 'maxFiles'],
    validation: 'file'
  },
  checkbox: {
    component: 'Checkbox',
    props: ['label', 'checked', 'disabled'],
    validation: 'boolean'
  },
  radio: {
    component: 'RadioGroup',
    props: ['options', 'defaultValue', 'inline'],
    validation: 'option'
  },
  email: {
    component: 'Input',
    props: ['placeholder', 'pattern'],
    validation: 'email'
  },
  phone: {
    component: 'Input',
    props: ['placeholder', 'pattern', 'countryCode'],
    validation: 'phone'
  },
  url: {
    component: 'Input',
    props: ['placeholder', 'pattern'],
    validation: 'url'
  },
  multiselect: {
    component: 'MultiSelect',
    props: ['options', 'placeholder', 'maxSelections'],
    validation: 'array'
  },
  richtext: {
    component: 'RichTextEditor',
    props: ['toolbar', 'maxLength', 'minLength'],
    validation: 'string'
  },
  switch: {
    component: 'Switch',
    props: ['label', 'checked', 'disabled'],
    validation: 'boolean'
  },
  time: {
    component: 'TimePicker',
    props: ['format', 'interval', 'minTime', 'maxTime'],
    validation: 'time'
  },
  datetime: {
    component: 'DateTimePicker',
    props: ['format', 'showTime', 'minDate', 'maxDate'],
    validation: 'datetime'
  },
  color: {
    component: 'ColorPicker',
    props: ['format', 'presetColors'],
    validation: 'string'
  },
  rating: {
    component: 'Rating',
    props: ['max', 'size', 'disabled'],
    validation: 'number'
  },
  table: {
    component: 'DynamicTable',
    props: ['columns', 'rows', 'addMore', 'validation'],
    validation: 'table'
  },
  signature: {
    component: 'SignaturePad',
    props: ['width', 'height', 'penColor'],
    validation: 'signature'
  },
  currency: {
    component: 'CurrencyInput',
    props: ['currency', 'precision', 'placeholder'],
    validation: 'number'
  }
};

// ==================== FORM VALIDATORS ====================
export const formValidators = {
  required: (value) => {
    if (value === null || value === undefined || value === '') {
      return 'This field is required';
    }
    if (Array.isArray(value) && value.length === 0) {
      return 'At least one item is required';
    }
    return true;
  },
  
  minLength: (value, length) => {
    if (value && value.length < length) {
      return `Minimum ${length} characters required`;
    }
    return true;
  },
  
  maxLength: (value, length) => {
    if (value && value.length > length) {
      return `Maximum ${length} characters allowed`;
    }
    return true;
  },
  
  email: (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    return true;
  },
  
  pattern: (value, pattern) => {
    if (value && !new RegExp(pattern).test(value)) {
      return 'Invalid format';
    }
    return true;
  },
  
  min: (value, min) => {
    if (value && Number(value) < min) {
      return `Value must be at least ${min}`;
    }
    return true;
  },
  
  max: (value, max) => {
    if (value && Number(value) > max) {
      return `Value must not exceed ${max}`;
    }
    return true;
  },
  
  url: (value) => {
    if (value && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
      return 'Please enter a valid URL';
    }
    return true;
  },
  
  phone: (value) => {
    if (value && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value)) {
      return 'Please enter a valid phone number';
    }
    return true;
  },
  
  fileSize: (files, maxSize) => {
    if (files) {
      const fileList = Array.isArray(files) ? files : [files];
      for (const file of fileList) {
        if (file.size > maxSize * 1024 * 1024) { // MB to bytes
          return `File size must not exceed ${maxSize}MB`;
        }
      }
    }
    return true;
  },
  
  fileType: (files, accept) => {
    if (files && accept) {
      const fileList = Array.isArray(files) ? files : [files];
      const allowedTypes = accept.split(',').map(type => type.trim());
      
      for (const file of fileList) {
        const fileType = file.type || file.name.split('.').pop();
        if (!allowedTypes.some(allowed => 
          allowed === fileType || 
          allowed === `.${fileType}` ||
          allowed === `*.${fileType}` ||
          allowed.includes(fileType)
        )) {
          return `File type not allowed. Accepted types: ${accept}`;
        }
      }
    }
    return true;
  }
};

// ==================== ALL FORM CONFIGURATIONS ====================
export const formsDatabase = {
  // Form 1 - Custom Form Interface
  'form-1': {
    id: 'form-1',
    name: 'Form 1 - Document Creation Form',
    description: 'Custom form interface with advanced features and attachments',
    category: 'Document Control',
    categoryGroup: 'general',
    icon: '📄',
    priorityOptions: true,
    department: 'all',
    comingSoon: false,
    formNumber: 'OF-DG-001',
    
    // Form fields configuration
    fields: [
      {
        id: 'title',
        label: 'Request Title',
        type: 'text',
        required: true,
        placeholder: 'Enter request title',
        validation: {
          minLength: 5,
          maxLength: 200
        }
      },
      {
        id: 'description',
        label: 'Detailed Description',
        type: 'textarea',
        required: true,
        placeholder: 'Provide detailed description of your request',
        validation: {
          minLength: 20,
          maxLength: 2000
        }
      },
      {
        id: 'priority',
        label: 'Priority Level',
        type: 'select',
        required: true,
        options: [
          { value: 'urgent', label: 'Urgent' },
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' }
        ]
      },
      {
        id: 'category',
        label: 'Request Category',
        type: 'select',
        required: true,
        options: [
          { value: 'general', label: 'General' },
          { value: 'technical', label: 'Technical' },
          { value: 'administrative', label: 'Administrative' },
          { value: 'financial', label: 'Financial' }
        ]
      },
      {
        id: 'dueDate',
        label: 'Required Completion Date',
        type: 'date',
        required: false
      },
      {
        id: 'attachments',
        label: 'Supporting Documents',
        type: 'file',
        multiple: true,
        accept: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png',
        validation: {
          fileSize: 25,
          maxFiles: 10
        }
      }
    ],
    
    // Form settings
    settings: {
      allowEdit: true,
      allowDuplication: true,
      allowWithdrawal: true,
      saveDraft: true,
      maxSubmissionsPerDay: 5
    },
    
    // Metadata
    metadata: {
      createdDate: '2024-01-01',
      version: '1.0.0',
      lastUpdated: '2024-01-15',
      createdBy: 'System Admin'
    }
  },
  
  // Form 2 - Document Approval
  'form-2': {
    id: 'form-2',
    name: 'Form 2 - Document Approval Request',
    description: 'Document approval request form with registration workflow',
    category: 'Document Control',
    categoryGroup: 'general',
    icon: '✅',
    priorityOptions: true,
    department: 'all',
    comingSoon: false,
    formNumber: 'OF-DG-002',
    
    fields: [
      {
        id: 'documentType',
        label: 'Document Type',
        type: 'select',
        required: true,
        options: [
          { value: 'policy', label: 'Policy Document' },
          { value: 'procedure', label: 'Procedure' },
          { value: 'report', label: 'Report' },
          { value: 'contract', label: 'Contract' },
          { value: 'manual', label: 'Manual' },
          { value: 'guideline', label: 'Guideline' }
        ]
      },
      {
        id: 'documentTitle',
        label: 'Document Title',
        type: 'text',
        required: true,
        placeholder: 'Enter document title',
        validation: {
          minLength: 10,
          maxLength: 500
        }
      },
      {
        id: 'referenceNumber',
        label: 'Reference Number',
        type: 'text',
        placeholder: 'Enter reference number if available',
        helpText: 'Leave blank if new document'
      },
      {
        id: 'version',
        label: 'Document Version',
        type: 'text',
        required: true,
        placeholder: 'e.g., 1.0.0'
      },
      {
        id: 'approvalLevel',
        label: 'Required Approval Level',
        type: 'select',
        required: true,
        options: [
          { value: 'level1', label: 'Level 1 - Department Head' },
          { value: 'level2', label: 'Level 2 - Director' },
          { value: 'level3', label: 'Level 3 - Executive' },
          { value: 'level4', label: 'Level 4 - Board' }
        ]
      },
      {
        id: 'approvers',
        label: 'Specific Approvers',
        type: 'multiselect',
        required: false,
        placeholder: 'Select specific approvers'
      },
      {
        id: 'effectiveDate',
        label: 'Requested Effective Date',
        type: 'date',
        required: true
      },
      {
        id: 'documentFile',
        label: 'Document File',
        type: 'file',
        required: true,
        accept: '.pdf,.doc,.docx',
        validation: {
          fileSize: 50
        }
      }
    ]
  },
  
  // Form 3 - Advanced Document Request
  'form-3': {
    id: 'form-3',
    name: 'Form 3 - Advanced Document Request',
    description: 'Advanced document request form with approval workflow',
    category: 'Document Control',
    categoryGroup: 'general',
    icon: '📊',
    priorityOptions: true,
    department: 'all',
    comingSoon: false,
    formNumber: 'OF-DG-003',
    
    fields: [
      {
        id: 'requestType',
        label: 'Request Type',
        type: 'select',
        required: true,
        options: [
          { value: 'new', label: 'New Document Creation' },
          { value: 'revision', label: 'Document Revision' },
          { value: 'withdrawal', label: 'Document Withdrawal' },
          { value: 'archival', label: 'Document Archival' },
          { value: 'distribution', label: 'Distribution Request' }
        ]
      },
      {
        id: 'documentDetails',
        label: 'Document Details',
        type: 'text',
        required: true,
        placeholder: 'Enter document details or reference'
      },
      {
        id: 'documentId',
        label: 'Document ID (if applicable)',
        type: 'text',
        required: false,
        placeholder: 'Enter existing document ID'
      },
      {
        id: 'reason',
        label: 'Reason for Request',
        type: 'textarea',
        required: true,
        placeholder: 'Explain the reason for this request',
        validation: {
          minLength: 30,
          maxLength: 1000
        }
      },
      {
        id: 'urgency',
        label: 'Urgency Level',
        type: 'select',
        required: true,
        options: [
          { value: 'normal', label: 'Normal (7 business days)' },
          { value: 'fast', label: 'Fast Track (3 business days)' },
          { value: 'immediate', label: 'Immediate (24 hours)' }
        ]
      }
    ]
  },
  
  // Form 4 - Training Schedule
  'form-4': {
    id: 'form-4',
    name: 'Form 4 - Training Schedule',
    description: 'Training schedule planning form with bilingual support',
    category: 'Training & Development',
    categoryGroup: 'general',
    icon: '📚',
    priorityOptions: true,
    department: 'HR',
    comingSoon: false,
    formNumber: 'OF-DG-004',
    
    fields: [
      {
        id: 'trainingTopic',
        label: 'Training Topic',
        type: 'text',
        required: true,
        placeholder: 'Enter training topic'
      },
      {
        id: 'trainingType',
        label: 'Training Type',
        type: 'select',
        required: true,
        options: [
          { value: 'technical', label: 'Technical Training' },
          { value: 'soft_skills', label: 'Soft Skills' },
          { value: 'compliance', label: 'Compliance Training' },
          { value: 'leadership', label: 'Leadership Development' },
          { value: 'onboarding', label: 'New Employee Onboarding' },
          { value: 'safety', label: 'Safety Training' }
        ]
      },
      {
        id: 'participantsCount',
        label: 'Number of Participants',
        type: 'number',
        required: true,
        min: 1,
        max: 100,
        step: 1
      },
      {
        id: 'trainingDate',
        label: 'Training Date',
        type: 'date',
        required: true
      },
      {
        id: 'duration',
        label: 'Duration',
        type: 'select',
        required: true,
        options: [
          { value: '2h', label: '2 Hours' },
          { value: '4h', label: '4 Hours' },
          { value: '1d', label: '1 Day' },
          { value: '2d', label: '2 Days' },
          { value: '3d', label: '3 Days' },
          { value: '5d', label: '5 Days' }
        ]
      },
      {
        id: 'language',
        label: 'Training Language',
        type: 'select',
        required: true,
        options: [
          { value: 'english', label: 'English' },
          { value: 'arabic', label: 'Arabic' },
          { value: 'bilingual', label: 'Bilingual (English & Arabic)' },
          { value: 'other', label: 'Other' }
        ]
      }
    ]
  },
  
  // Form 5 - File Movement
  'form-5': {
    id: 'form-5',
    name: 'Form 5 - File Movement Control',
    description: 'File movement tracking and transfer register form',
    category: 'Records Management',
    categoryGroup: 'general',
    icon: '📁',
    priorityOptions: true,
    department: 'all',
    comingSoon: false,
    formNumber: 'OF-DG-005',
    
    fields: [
      {
        id: 'fileNumber',
        label: 'File Number',
        type: 'text',
        required: true,
        placeholder: 'Enter file number',
        validation: {
          pattern: '^[A-Z]{2,3}-[0-9]{4,6}$'
        }
      },
      {
        id: 'fileTitle',
        label: 'File Title',
        type: 'text',
        required: true,
        placeholder: 'Enter file title'
      },
      {
        id: 'fromDepartment',
        label: 'From Department',
        type: 'select',
        required: true,
        options: [
          { value: 'hr', label: 'Human Resources' },
          { value: 'finance', label: 'Finance' },
          { value: 'it', label: 'IT Department' },
          { value: 'operations', label: 'Operations' },
          { value: 'sales', label: 'Sales' },
          { value: 'marketing', label: 'Marketing' }
        ]
      },
      {
        id: 'toDepartment',
        label: 'To Department',
        type: 'select',
        required: true,
        options: [
          { value: 'hr', label: 'Human Resources' },
          { value: 'finance', label: 'Finance' },
          { value: 'it', label: 'IT Department' },
          { value: 'operations', label: 'Operations' },
          { value: 'sales', label: 'Sales' },
          { value: 'marketing', label: 'Marketing' }
        ]
      },
      {
        id: 'transferDate',
        label: 'Transfer Date',
        type: 'date',
        required: true
      },
      {
        id: 'transferType',
        label: 'Transfer Type',
        type: 'select',
        required: true,
        options: [
          { value: 'permanent', label: 'Permanent Transfer' },
          { value: 'temporary', label: 'Temporary Transfer' },
          { value: 'review', label: 'For Review Only' },
          { value: 'reference', label: 'For Reference' }
        ]
      },
      {
        id: 'purpose',
        label: 'Purpose of Movement',
        type: 'textarea',
        required: true,
        rows: 3,
        placeholder: 'Explain the reason for file movement'
      }
    ]
  },
  
  // Form 6 - Incoming Records
  'form-6': {
    id: 'form-6',
    name: 'Form 6 - Incoming Records',
    description: 'Incoming records and document registration form',
    category: 'Records Management',
    categoryGroup: 'general',
    icon: '📋',
    priorityOptions: true,
    department: 'all',
    comingSoon: false,
    formNumber: 'OF-DG-003', // Master Document List
    
    fields: [
      {
        id: 'department',
        label: 'Department',
        type: 'select',
        required: true,
        options: [
          'Administration',
          'Finance',
          'Human Resources', 
          'Information Technology',
          'Operations',
          'Quality Assurance',
          'Security',
          'All Departments'
        ]
      },
      {
        id: 'recordType',
        label: 'Record Type',
        type: 'select',
        required: true,
        options: [
          { value: 'letter', label: 'Letter' },
          { value: 'memo', label: 'Memo' },
          { value: 'report', label: 'Report' },
          { value: 'invoice', label: 'Invoice' },
          { value: 'contract', label: 'Contract' }
        ]
      },
      {
        id: 'subject',
        label: 'Subject',
        type: 'text',
        required: true,
        placeholder: 'Enter subject of the record'
      },
      {
        id: 'receiptDate',
        label: 'Date Received',
        type: 'date',
        required: true
      },
      {
        id: 'actionRequired',
        label: 'Action Required',
        type: 'select',
        required: true,
        options: [
          { value: 'review', label: 'For Review' },
          { value: 'approval', label: 'For Approval' },
          { value: 'information', label: 'For Information Only' },
          { value: 'action', label: 'Requires Action' }
        ]
      },
      {
        id: 'priority',
        label: 'Priority Level',
        type: 'select',
        required: true,
        options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
          { value: 'urgent', label: 'Urgent' }
        ]
      }
    ]
  },
  
  // Form 7 - Access Controlled Records
  'form-7': {
    id: 'form-7',
    name: 'Form 7 - Access Controlled Records',
    description: 'Access controlled records registration and authorization form',
    category: 'Security & Compliance',
    categoryGroup: 'general',
    icon: '🔒',
    priorityOptions: true,
    department: 'all',
    comingSoon: false,
    formNumber: 'OF-SEC-001', // Custom security form number
    
    fields: [
      {
        id: 'recordClassification',
        label: 'Record Classification',
        type: 'select',
        required: true,
        options: [
          { value: 'public', label: 'Public' },
          { value: 'internal', label: 'Internal Use Only' },
          { value: 'confidential', label: 'Confidential' },
          { value: 'restricted', label: 'Restricted' },
          { value: 'secret', label: 'Secret' }
        ]
      },
      {
        id: 'recordTitle',
        label: 'Record Title',
        type: 'text',
        required: true,
        placeholder: 'Enter record title',
        validation: {
          minLength: 5,
          maxLength: 200
        }
      },
      {
        id: 'accessLevel',
        label: 'Required Access Level',
        type: 'select',
        required: true,
        options: [
          { value: 'level1', label: 'Level 1 - Basic Access (Read Only)' },
          { value: 'level2', label: 'Level 2 - Department Access' },
          { value: 'level3', label: 'Level 3 - Management Access' },
          { value: 'level4', label: 'Level 4 - Executive Access' }
        ]
      },
      {
        id: 'accessDuration',
        label: 'Access Duration',
        type: 'select',
        required: true,
        options: [
          { value: 'temporary', label: 'Temporary (30 days)' },
          { value: 'quarterly', label: 'Quarterly Review' },
          { value: 'annual', label: 'Annual Review' },
          { value: 'permanent', label: 'Permanent (with review)' }
        ]
      },
      {
        id: 'accessReason',
        label: 'Reason for Access',
        type: 'textarea',
        required: true,
        placeholder: 'Explain why access is required',
        validation: {
          minLength: 30,
          maxLength: 500
        }
      }
    ]
  },
  
  // Form 8 - File Closing Form (COMPLETE VERSION)
  'form-8': {
    id: 'form-8',
    name: 'Form 8 - File Closing Form',
    description: 'Close files officially and document closure reasons with authorization',
    category: 'General',
    categoryGroup: 'general',
    icon: '📂',
    priorityOptions: true,
    department: 'all',
    comingSoon: false,
    formNumber: 'OF/DG/008',
    
    // Form fields configuration based on the React component
    fields: [
      {
        id: 'fileNumber',
        label: 'የፋይል ቁጥር / File Number',
        type: 'text',
        required: true,
        placeholder: 'Enter file number',
        validation: {
          pattern: '^[A-Z]{2,3}-[0-9]{4,6}$',
          minLength: 3,
          maxLength: 20
        }
      },
      {
        id: 'reasonForClosing',
        label: 'ፋይሉ የተዘጋበት ምክንያት / Reason(s) for closing this File',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the reason(s) for closing this file...',
        validation: {
          minLength: 20,
          maxLength: 1000
        },
        rows: 3
      },
      {
        id: 'closureAuthorizedBy',
        label: 'ፋይሉ እንዲዘጋ የፈቀደው / Closure is authorized by',
        type: 'text',
        required: true,
        placeholder: 'Enter authorizer\'s name',
        validation: {
          minLength: 5,
          maxLength: 100
        }
      },
      {
        id: 'dateClosed',
        label: 'የተዘጋበት ቀን / Date closed',
        type: 'date',
        required: true,
        validation: {
          maxDate: new Date().toISOString().split('T')[0]
        }
      },
      {
        id: 'successiveFileNumber',
        label: 'ቀጣዩ የፋይል ቁጥር / The successive File Number',
        type: 'text',
        required: false,
        placeholder: 'Enter successive file number (if applicable)',
        validation: {
          pattern: '^[A-Z]{2,3}-[0-9]{4,6}$',
          maxLength: 20
        }
      },
      {
        id: 'custodianName',
        label: 'የፋይል ደህንነት ጠባቂ ስም / Name of the Custodian',
        type: 'text',
        required: false,
        placeholder: 'Enter custodian name',
        validation: {
          minLength: 5,
          maxLength: 100
        }
      },
      {
        id: 'closureNotes',
        label: 'Additional Notes / ተጨማሪ ማስታወሻ',
        type: 'textarea',
        required: false,
        placeholder: 'Any additional notes about the file closure...',
        validation: {
          maxLength: 500
        },
        rows: 2
      }
    ],
    
    // Form settings
    settings: {
      allowEdit: true,
      allowDuplication: true,
      allowWithdrawal: false,
      saveDraft: true,
      maxSubmissionsPerDay: 10,
      requiresApproval: false,
      retentionPeriod: 'Permanent',
      allowFileAttachment: true,
      attachmentTypes: ['.pdf', '.doc', '.docx'],
      maxAttachmentSize: 10
    },
    
    // Metadata
    metadata: {
      createdDate: '2024-01-01',
      version: '1.0.0',
      lastUpdated: '2024-01-15',
      createdBy: 'Records Management Department',
      confidentiality: 'Internal Use Only',
      retentionSchedule: 'Section 5.2',
      bilingualForm: true,
      languages: ['English', 'Amharic']
    },
    
    // Workflow configuration
    workflow: {
      steps: [
        {
          id: 'submission',
          name: 'Submitted',
          role: 'user',
          action: 'submit'
        },
        {
          id: 'verification',
          name: 'Records Verification',
          role: 'records_officer',
          action: 'verify'
        },
        {
          id: 'archiving',
          name: 'Archived',
          role: 'archivist',
          action: 'archive'
        },
        {
          id: 'closed',
          name: 'Closed',
          role: 'system',
          action: 'close'
        }
      ],
      transitions: [
        { from: 'submission', to: 'verification', condition: 'auto' },
        { from: 'verification', to: 'archiving', condition: 'verified' },
        { from: 'archiving', to: 'closed', condition: 'archived' }
      ],
      approvalRequired: false,
      autoArchiveDays: 30
    },
    
    // Default values
    defaultValues: {
      dateClosed: () => new Date().toISOString().split('T')[0]
    },
    
    // Field dependencies
    dependencies: {
      successiveFileNumber: {
        dependsOn: 'fileNumber',
        condition: (fileNumber) => fileNumber && fileNumber.length > 0,
        message: 'Successive file number is only required if replacing an existing file'
      }
    },
    
    // Audit trail configuration
    auditTrail: {
      trackChanges: true,
      trackFields: ['fileNumber', 'dateClosed', 'closureAuthorizedBy'],
      requireReasonForChange: true,
      logLevel: 'detailed'
    }
  },
  
  // Form 9 - Risk Assessment Form (COMPLETE VERSION)
  'form-9': {
    id: 'form-9',
    name: 'Form 9 - Risk Assessment Form',
    description: 'Comprehensive risk assessment and management planning',
    category: 'Risk Management',
    categoryGroup: 'general',
    icon: '⚠️',
    priorityOptions: true,
    department: 'all',
    comingSoon: false,
    formNumber: 'OF/DG/009',
    pages: 13,
    
    // Form fields configuration
    fields: [
      {
        id: 'directorateService',
        label: 'Directorate or Service',
        type: 'text',
        required: true,
        placeholder: 'Enter directorate/service',
        page: 1,
        validation: {
          minLength: 3,
          maxLength: 100
        }
      },
      {
        id: 'assessmentNo',
        label: 'Assessment Number',
        type: 'text',
        required: true,
        placeholder: 'Enter assessment number',
        page: 1,
        validation: {
          minLength: 2,
          maxLength: 50
        }
      },
      {
        id: 'assessmentDate',
        label: 'Assessment Date',
        type: 'date',
        required: true,
        page: 1
      },
      {
        id: 'reviewDate',
        label: 'Review Date',
        type: 'date',
        required: false,
        page: 1
      },
      {
        id: 'riskAreaDescription',
        label: 'Risk Area Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the risk area...',
        page: 2,
        rows: 8,
        validation: {
          minLength: 20,
          maxLength: 2000
        }
      },
      {
        id: 'riskAssessmentTeam',
        label: 'Risk Assessment Team',
        type: 'textarea',
        required: true,
        placeholder: 'List team members...',
        page: 3,
        rows: 4,
        validation: {
          minLength: 5,
          maxLength: 1000
        }
      },
      {
        id: 'consultants',
        label: 'Consultants',
        type: 'textarea',
        required: false,
        placeholder: 'List consultants...',
        page: 3,
        rows: 4
      },
      {
        id: 'physicalEnvironmentRisks',
        label: 'Physical Work Environment Risks',
        type: 'textarea',
        required: false,
        placeholder: 'Describe physical risks...',
        page: 3,
        rows: 6
      },
      {
        id: 'ergonomicRisks',
        label: 'Ergonomic Risks',
        type: 'textarea',
        required: false,
        placeholder: 'Describe ergonomic risks...',
        page: 3,
        rows: 6
      },
      {
        id: 'psychologicalRisks',
        label: 'Psychological Risks',
        type: 'textarea',
        required: false,
        placeholder: 'Describe psychological risks...',
        page: 3,
        rows: 6
      },
      {
        id: 'specificCircumstances',
        label: 'Specific Circumstances',
        type: 'textarea',
        required: false,
        placeholder: 'Describe specific circumstances...',
        page: 5,
        rows: 6
      },
      {
        id: 'identifiedRisks',
        label: 'Identified Risks',
        type: 'array',
        page: 4,
        fields: [
          {
            id: 'description',
            label: 'Risk Description',
            type: 'text',
            required: true,
            placeholder: 'Describe risk...'
          }
        ]
      },
      {
        id: 'riskAssessments',
        label: 'Risk Assessments',
        type: 'array',
        page: 7,
        fields: [
          {
            id: 'risk',
            label: 'Risk',
            type: 'text',
            required: true,
            placeholder: 'Enter risk description'
          },
          {
            id: 'consequence',
            label: 'Consequence',
            type: 'select',
            required: true,
            options: ['Critical', 'High', 'Medium', 'Low', 'Negligible'],
            placeholder: 'Select consequence level'
          },
          {
            id: 'likelihood',
            label: 'Likelihood',
            type: 'select',
            required: true,
            options: ['Almost Certain', 'Likely', 'Moderate', 'Unlikely', 'Rare'],
            placeholder: 'Select likelihood'
          },
          {
            id: 'rating',
            label: 'Rating',
            type: 'text',
            required: false,
            placeholder: 'Risk rating'
          }
        ]
      },
      {
        id: 'implementationPlan',
        label: 'Implementation Plan',
        type: 'array',
        page: 8,
        fields: [
          {
            id: 'controlOption',
            label: 'Control Option',
            type: 'text',
            required: true,
            placeholder: 'Enter control option'
          },
          {
            id: 'resources',
            label: 'Resources Required',
            type: 'text',
            required: false,
            placeholder: 'Enter required resources'
          },
          {
            id: 'responsiblePerson',
            label: 'Responsible Person',
            type: 'text',
            required: true,
            placeholder: 'Enter responsible person'
          },
          {
            id: 'implementationDate',
            label: 'Implementation Date',
            type: 'date',
            required: true
          }
        ]
      }
    ],
    
    // Form settings
    settings: {
      allowEdit: true,
      allowDuplication: true,
      allowWithdrawal: true,
      saveDraft: true,
      maxSubmissionsPerDay: 3,
      requiresApproval: true,
      approvalLevel: 'level2',
      retentionPeriod: '5 years'
    },
    
    // Metadata
    metadata: {
      createdDate: '2024-01-01',
      version: '1.0.0',
      lastUpdated: '2024-01-15',
      createdBy: 'Risk Management Department',
      confidentiality: 'Internal Use Only',
      basedOnStandard: 'ISO 31000',
      reviewFrequency: 'Annual'
    }
  },
    // Form 10 - Outgoing Document Registration
  'form-10': {
    id: 'form-10',
    name: 'Form 10 - Outgoing Document Registration',
    description: 'Register and track outgoing documents with comprehensive details',
    category: 'Document Management',
    categoryGroup: 'general',
    icon: '📤',
    priorityOptions: true,
    department: 'all',
    comingSoon: false,
    formNumber: 'OF/DG/010',
    
    // Form fields configuration
    fields: [
      {
        id: 'registrationTable',
        label: 'Outgoing Document Registration Table',
        type: 'array',
        required: true,
        fields: [
          {
            id: 'regNumber',
            label: 'Registration Number',
            type: 'text',
            required: true,
            placeholder: 'Enter registration number'
          },
          {
            id: 'dateRegistered',
            label: 'Date Registered',
            type: 'date',
            required: true
          },
          {
            id: 'title',
            label: 'Title of the Record/Document/Subject',
            type: 'text',
            required: true,
            placeholder: 'Enter document title'
          },
          {
            id: 'enclosures',
            label: 'Enclosures',
            type: 'text',
            required: false,
            placeholder: 'Enter enclosures if any'
          },
          {
            id: 'sendTo',
            label: 'Send to',
            type: 'text',
            required: true,
            placeholder: 'Enter recipient name/department'
          },
          {
            id: 'fileNo',
            label: 'File No. In which the Copy is Attached',
            type: 'text',
            required: false,
            placeholder: 'Enter file number'
          },
          {
            id: 'registeredBy',
            label: 'Registered by Name & Sign.',
            type: 'text',
            required: true,
            placeholder: 'Enter name and signature'
          },
          {
            id: 'implementation',
            label: 'Implementation',
            type: 'text',
            required: false,
            placeholder: 'Enter implementation details'
          },
          {
            id: 'signature',
            label: 'Signature',
            type: 'text',
            required: false,
            placeholder: 'Signature'
          }
        ]
      }
    ],
    
    // Form settings
    settings: {
      allowEdit: true,
      allowDuplication: true,
      allowWithdrawal: true,
      saveDraft: true,
      maxSubmissionsPerDay: 10,
      requiresApproval: false,
      retentionPeriod: '5 years',
      minRows: 1,
      maxRows: 50,
      defaultRows: 2
    },
    
    // Metadata
    metadata: {
      createdDate: '2024-01-01',
      version: '1.0.0',
      lastUpdated: '2024-01-15',
      createdBy: 'Records Management Department',
      confidentiality: 'Internal Use Only',
      documentType: 'Outgoing',
      trackingRequired: true,
      requiresAcknowledgement: false
    },
    
    // Workflow configuration
    workflow: {
      steps: [
        {
          id: 'registration',
          name: 'Registered',
          role: 'user',
          action: 'register'
        },
        {
          id: 'dispatch',
          name: 'Dispatched',
          role: 'dispatch_officer',
          action: 'dispatch'
        },
        {
          id: 'acknowledgement',
          name: 'Acknowledged',
          role: 'recipient',
          action: 'acknowledge'
        },
        {
          id: 'archived',
          name: 'Archived',
          role: 'archivist',
          action: 'archive'
        }
      ],
      transitions: [
        { from: 'registration', to: 'dispatch', condition: 'auto' },
        { from: 'dispatch', to: 'acknowledgement', condition: 'optional' },
        { from: 'acknowledgement', to: 'archived', condition: '30_days' }
      ],
      requiresAcknowledgement: false,
      acknowledgementDeadline: '7 days'
    },
    
    // Default values
    defaultValues: {
      dateRegistered: () => new Date().toISOString().split('T')[0]
    },
    
    // Validation rules
    validationRules: {
      registrationTable: {
        required: true,
        minRows: 1,
        rowValidation: {
          regNumber: { required: true, minLength: 3 },
          title: { required: true, minLength: 5 },
          sendTo: { required: true, minLength: 3 },
          registeredBy: { required: true, minLength: 3 }
        }
      }
    },
    
    // Column configurations for the table view
    tableColumns: [
      { id: 'regNumber', label: 'Reg No.', width: '100px', sortable: true },
      { id: 'dateRegistered', label: 'Date', width: '90px', type: 'date' },
      { id: 'title', label: 'Title', width: '200px', sortable: true },
      { id: 'enclosures', label: 'Enclosures', width: '100px' },
      { id: 'sendTo', label: 'Send To', width: '120px' },
      { id: 'fileNo', label: 'File No.', width: '100px' },
      { id: 'registeredBy', label: 'Registered By', width: '120px' },
      { id: 'implementation', label: 'Implementation', width: '120px' },
      { id: 'signature', label: 'Signature', width: '100px' }
    ]
  },
    // Form 11 - Disciplinary Case Submission Form
  'form-11': {
    id: 'form-11',
    name: 'Form 11 - Disciplinary Case Submission Form',
    description: 'Submit disciplinary complaints with evidence and witness details',
    category: 'Human Resources',
    categoryGroup: 'general',
    icon: '⚖️',
    priorityOptions: true,
    department: 'HR',
    comingSoon: false,
    formNumber: 'OF/DG/011',
    pages: 4,
    
    // Form fields configuration based on the React component
    fields: [
      {
        id: 'caseType',
        label: 'ክስ የቀረበበት ጉዳይ / Case Presented For',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'አዎ / Yes' },
          { value: 'no', label: 'አይደለም / No' }
        ],
        page: 1
      },
      {
        id: 'applicantName',
        label: 'የአመልካች ስም / Applicant\'s Name',
        type: 'text',
        required: true,
        placeholder: 'Enter applicant name',
        page: 1,
        validation: {
          minLength: 3,
          maxLength: 100
        }
      },
      {
        id: 'applicantSignature',
        label: 'Applicant Signature',
        type: 'text',
        required: false,
        placeholder: 'Signature',
        page: 1
      },
      {
        id: 'applicantDate',
        label: 'ቀን / Date',
        type: 'date',
        required: true,
        page: 1
      },
      {
        id: 'complaintSubject',
        label: 'የክሱ አድራሻ / Subject of the Complaint',
        type: 'text',
        required: true,
        placeholder: 'Enter complaint subject',
        page: 1,
        validation: {
          minLength: 5,
          maxLength: 200
        }
      },
      {
        id: 'accusedName',
        label: '1. ስም / Name',
        type: 'text',
        required: true,
        placeholder: 'Enter accused employee name',
        page: 2,
        validation: {
          minLength: 3,
          maxLength: 100
        }
      },
      {
        id: 'accusedPosition',
        label: '2. የስራ መደብ / Position',
        type: 'text',
        required: true,
        placeholder: 'Enter accused position',
        page: 2,
        validation: {
          minLength: 2,
          maxLength: 100
        }
      },
      {
        id: 'accusedId',
        label: '3. የሠራተኛ መለያ ቁጥር / ID No',
        type: 'text',
        required: true,
        placeholder: 'Enter employee ID',
        page: 2,
        validation: {
          minLength: 3,
          maxLength: 20
        }
      },
      {
        id: 'offenseDetails',
        label: 'የተከሰሰበት የዲሲፕሊን ግድፈት ዝርዝር / Details of the disciplinary offense',
        type: 'textarea',
        required: true,
        rows: 8,
        placeholder: 'Enter detailed description of the offense',
        page: 2,
        validation: {
          minLength: 20,
          maxLength: 2000
        }
      },
      {
        id: 'evidences',
        label: 'ለክሱ ማረጋገጫ የቀረቡ ማስረጃዎች / Evidences submitted for the case',
        type: 'array',
        page: 3,
        fields: [
          {
            id: 'evidence',
            label: 'Evidence',
            type: 'text',
            required: false,
            placeholder: 'Enter evidence description'
          }
        ]
      },
      {
        id: 'witnesses',
        label: 'የምስክር ስም ዝርዝር / List of Witnesses',
        type: 'array',
        page: 3,
        fields: [
          {
            id: 'witness',
            label: 'Witness Name',
            type: 'text',
            required: false,
            placeholder: 'Enter witness name'
          }
        ]
      },
      {
        id: 'concludingRequest',
        label: 'የመደምደሚያ ጥያቄ / Concluding Request',
        type: 'textarea',
        required: true,
        rows: 6,
        placeholder: 'Enter your requested solution/remedy',
        page: 4,
        validation: {
          minLength: 20,
          maxLength: 1000
        }
      },
      {
        id: 'complainantSignature',
        label: 'ክስ አቅራቢ ፊርማ / Complainant Signature',
        type: 'text',
        required: false,
        placeholder: 'Signature',
        page: 4
      },
      {
        id: 'complainantDate',
        label: 'ቀን / Date',
        type: 'date',
        required: false,
        page: 4
      }
    ],
    
    // Form settings
    settings: {
      allowEdit: true,
      allowDuplication: true,
      allowWithdrawal: true,
      saveDraft: true,
      maxSubmissionsPerDay: 3,
      requiresApproval: true,
      approvalLevel: 'level3',
      retentionPeriod: '10 years',
      confidentialityLevel: 'High',
      requiresHRReview: true,
      autoAssignToHR: true
    },
    
    // Metadata
    metadata: {
      createdDate: '2024-01-01',
      version: '1.0.0',
      lastUpdated: '2024-01-15',
      createdBy: 'Human Resources Department',
      confidentiality: 'Confidential',
      basedOnPolicy: 'Disciplinary Policy Section 4.2',
      requiresInvestigation: true,
      bilingualForm: true,
      languages: ['English', 'Amharic']
    },
    
    // Workflow configuration
    workflow: {
      steps: [
        {
          id: 'submission',
          name: 'Submitted',
          role: 'employee',
          action: 'submit'
        },
        {
          id: 'hr_review',
          name: 'HR Review',
          role: 'hr_officer',
          action: 'review'
        },
        {
          id: 'investigation',
          name: 'Under Investigation',
          role: 'investigator',
          action: 'investigate'
        },
        {
          id: 'hearing',
          name: 'Hearing Scheduled',
          role: 'hr_manager',
          action: 'schedule'
        },
        {
          id: 'decision',
          name: 'Decision Made',
          role: 'disciplinary_committee',
          action: 'decide'
        },
        {
          id: 'closed',
          name: 'Case Closed',
          role: 'system',
          action: 'close'
        }
      ],
      transitions: [
        { from: 'submission', to: 'hr_review', condition: 'auto' },
        { from: 'hr_review', to: 'investigation', condition: 'valid' },
        { from: 'investigation', to: 'hearing', condition: 'evidence_found' },
        { from: 'hearing', to: 'decision', condition: 'hearing_completed' },
        { from: 'decision', to: 'closed', condition: 'decision_made' }
      ],
      requiresHearing: true,
      maxInvestigationDays: 30,
      requiresDocumentation: true
    },
    
    // Default values
    defaultValues: {
      applicantDate: () => new Date().toISOString().split('T')[0],
      complainantDate: () => new Date().toISOString().split('T')[0],
      caseType: 'yes'
    },
    
    // Field dependencies
    dependencies: {
      accusedId: {
        dependsOn: 'accusedName',
        condition: (accusedName) => accusedName && accusedName.length > 0,
        message: 'Employee ID is required when an employee name is provided'
      }
    },
    
    // Investigation specific properties
    investigationProperties: {
      requiresEvidence: true,
      requiresWitnesses: false,
      maxWitnesses: 5,
      requiresAccusedStatement: true,
      requiresManagementReview: true,
      appealPeriod: '14 days'
    },
    
    // Legal compliance
    legalCompliance: {
      followsLaborLaws: true,
      requiresDocumentation: true,
      privacyProtected: true,
      rightToAppeal: true,
      fairHearingRequired: true
    }
  },
    // Form 12 - Master List of Document Form
  'form-12': {
    id: 'form-12',
    name: 'Form 12 - Master List of Document Form',
    description: 'Comprehensive master list for tracking all organizational documents',
    category: 'Document Control',
    categoryGroup: 'general',
    icon: '📋',
    priorityOptions: false,
    department: 'all',
    comingSoon: false,
    formNumber: 'OF/DG/012',
    
    // Form fields configuration based on the React component
    fields: [
      {
        id: 'masterListTable',
        label: 'Master Document List',
        type: 'array',
        required: true,
        fields: [
          {
            id: 'title',
            label: 'Document Title',
            type: 'text',
            required: true,
            placeholder: 'Enter document title'
          },
          {
            id: 'docNumber',
            label: 'Document Number',
            type: 'text',
            required: true,
            placeholder: 'Doc. No.'
          },
          {
            id: 'issueNumber',
            label: 'Issue Number',
            type: 'text',
            required: false,
            placeholder: 'Issue No.'
          },
          {
            id: 'directorate',
            label: 'Directorate',
            type: 'text',
            required: false,
            placeholder: 'Directorate'
          },
          {
            id: 'type',
            label: 'Type',
            type: 'text',
            required: false,
            placeholder: 'Type'
          },
          {
            id: 'remark',
            label: 'Remark',
            type: 'text',
            required: false,
            placeholder: 'Remark'
          }
        ]
      }
    ],
    
    // Form settings
    settings: {
      allowEdit: true,
      allowDuplication: true,
      allowWithdrawal: true,
      saveDraft: true,
      maxSubmissionsPerDay: 5,
      requiresApproval: false,
      retentionPeriod: 'Permanent',
      minRows: 2,
      maxRows: 100,
      defaultRows: 2
    },
    
    // Metadata
    metadata: {
      createdDate: '2024-01-01',
      version: '1.0.0',
      lastUpdated: '2024-01-15',
      createdBy: 'Document Control Department',
      confidentiality: 'Internal Use Only',
      documentType: 'Master List',
      requiresPeriodicReview: true,
      reviewFrequency: 'Quarterly',
      isMasterDocument: true
    },
    
    // Workflow configuration
    workflow: {
      steps: [
        {
          id: 'creation',
          name: 'Created',
          role: 'document_controller',
          action: 'create'
        },
        {
          id: 'verification',
          name: 'Verified',
          role: 'quality_officer',
          action: 'verify'
        },
        {
          id: 'approval',
          name: 'Approved',
          role: 'department_head',
          action: 'approve'
        },
        {
          id: 'published',
          name: 'Published',
          role: 'system',
          action: 'publish'
        }
      ],
      transitions: [
        { from: 'creation', to: 'verification', condition: 'auto' },
        { from: 'verification', to: 'approval', condition: 'verified' },
        { from: 'approval', to: 'published', condition: 'approved' }
      ],
      requiresApproval: true,
      approvalLevel: 'level2',
      autoPublish: true
    },
    
    // Default values
    defaultValues: {
      defaultRows: [
        { sn: 1, title: '', docNumber: '', issueNumber: '', directorate: '', type: '', remark: '' },
        { sn: 2, title: '', docNumber: '', issueNumber: '', directorate: '', type: '', remark: '' }
      ]
    },
    
    // Validation rules
    validationRules: {
      masterListTable: {
        required: true,
        minRows: 1,
        rowValidation: {
          title: { required: true, minLength: 3, maxLength: 200 },
          docNumber: { required: true, minLength: 3, maxLength: 50 }
        }
      }
    },
    
    // Column configurations for the table view
    tableColumns: [
      { id: 'sn', label: 'S.N', width: '60px', sortable: false },
      { id: 'title', label: 'Document Title', width: '250px', sortable: true },
      { id: 'docNumber', label: 'Doc. No.', width: '120px', sortable: true },
      { id: 'issueNumber', label: 'Issue No.', width: '100px', sortable: false },
      { id: 'directorate', label: 'Directorate', width: '150px', sortable: true },
      { id: 'type', label: 'Type', width: '100px', sortable: true },
      { id: 'remark', label: 'Remark', width: '150px', sortable: false }
    ],
    
    // Search and filter options
    searchOptions: {
      searchableColumns: ['title', 'docNumber', 'directorate', 'type'],
      filterableColumns: ['directorate', 'type'],
      defaultSort: { column: 'docNumber', direction: 'asc' }
    },
    
    // Export options
    exportOptions: {
      formats: ['pdf', 'excel', 'csv'],
      includeMetadata: true,
      includeAllRows: true,
      customHeaders: true
    }
  },
  // Add this to the formsDatabase object after form-9 and before form-18:

// Form 14 - Service Request Form
'form-14': {
  id: 'form-14',
  name: 'Form 14 - Service Request Form',
  description: 'Service request and delivery tracking form with follow-up mechanism',
  category: 'Service Management',
  categoryGroup: 'general',
  icon: '🛠️',
  priorityOptions: true,
  department: 'all',
  comingSoon: false,
  formNumber: 'OF/DG/014',
  
  // Form fields configuration based on the React component
  fields: [
    // Part A - Requesting Body
    {
      id: 'requestNo',
      label: 'Request No.',
      type: 'text',
      required: true,
      placeholder: 'Enter request number',
      validation: {
        pattern: '^SR-[0-9]{4}-[0-9]{3}$',
        minLength: 3,
        maxLength: 20
      },
      section: 'Part A'
    },
    {
      id: 'registrationNo',
      label: 'Registration No.',
      type: 'text',
      required: false,
      placeholder: 'Enter registration number',
      validation: {
        maxLength: 20
      },
      section: 'Part A'
    },
    {
      id: 'to',
      label: 'To',
      type: 'text',
      required: true,
      placeholder: 'Enter recipient',
      validation: {
        minLength: 3,
        maxLength: 200
      },
      section: 'Part A'
    },
    {
      id: 'requestedBy',
      label: 'Requested by',
      type: 'text',
      required: true,
      placeholder: 'Enter requester name',
      validation: {
        minLength: 5,
        maxLength: 100
      },
      section: 'Part A'
    },
    {
      id: 'serviceRequested',
      label: 'Service requested',
      type: 'textarea',
      required: true,
      placeholder: 'Describe the service requested...',
      validation: {
        minLength: 20,
        maxLength: 1000
      },
      rows: 4,
      section: 'Part A'
    },
    {
      id: 'attachedDocuments',
      label: 'Attached documents (Title and No. of pages)',
      type: 'text',
      required: false,
      placeholder: 'List attached documents',
      validation: {
        maxLength: 300
      },
      section: 'Part A'
    },
    {
      id: 'additionalInformation',
      label: 'Additional information (if any)',
      type: 'text',
      required: false,
      placeholder: 'Enter additional information',
      validation: {
        maxLength: 500
      },
      section: 'Part A'
    },
    {
      id: 'dateOfRequest',
      label: 'Date of request (YY/MM/DD/TIME)',
      type: 'text',
      required: true,
      placeholder: 'YYYY/MM/DD/HH:MM',
      validation: {
        pattern: '^[0-9]{4}/[0-9]{2}/[0-9]{2}/[0-9]{2}:[0-9]{2}$',
        maxLength: 16
      },
      section: 'Part A'
    },
    {
      id: 'authorizedBy',
      label: 'Authorized by',
      type: 'text',
      required: false,
      placeholder: 'Enter authorizer name',
      validation: {
        minLength: 5,
        maxLength: 100
      },
      section: 'Part A'
    },
    
    // Part B - Service Giving Body (Dynamic rows)
    {
      id: 'followUpRows',
      label: 'Follow-up Information',
      type: 'array',
      required: false,
      minItems: 1,
      addButtonText: 'Add Follow-up Entry',
      removeButtonText: 'Remove Entry',
      fields: [
        {
          id: 'sn',
          label: 'S/N',
          type: 'number',
          required: true,
          min: 1
        },
        {
          id: 'receivedBy',
          label: 'Received by',
          type: 'text',
          required: true,
          placeholder: 'Enter receiver name',
          validation: {
            minLength: 3,
            maxLength: 100
          }
        },
        {
          id: 'serviceDelivered',
          label: 'Service delivered',
          type: 'textarea',
          required: true,
          placeholder: 'Describe service delivered...',
          validation: {
            minLength: 10,
            maxLength: 500
          },
          rows: 3
        },
        {
          id: 'dateTime',
          label: 'Date/Time',
          type: 'text',
          required: true,
          placeholder: 'YYYY/MM/DD/HH:MM',
          validation: {
            pattern: '^[0-9]{4}/[0-9]{2}/[0-9]{2}/[0-9]{2}:[0-9]{2}$'
          }
        },
        {
          id: 'idSign',
          label: 'ID/Sign',
          type: 'text',
          required: true,
          placeholder: 'Enter ID or signature'
        }
      ],
      section: 'Part B'
    },
    
    // Common fields
    {
      id: 'submittedBy',
      label: 'Submitted By',
      type: 'text',
      required: false,
      readonly: true
    },
    {
      id: 'submissionDate',
      label: 'Submission Date',
      type: 'date',
      required: false,
      readonly: true
    }
  ],
  
  // Form settings
  settings: {
    allowEdit: true,
    allowDuplication: true,
    allowWithdrawal: true,
    saveDraft: true,
    maxSubmissionsPerDay: 20,
    requiresApproval: false,
    retentionPeriod: '2 years',
    allowFileAttachment: true,
    attachmentTypes: ['.pdf', '.doc', '.docx', '.jpg', '.png'],
    maxAttachmentSize: 10,
    requiresFollowUp: true,
    autoGenerateRequestNumber: true,
    requestNumberPrefix: 'SR',
    defaultFollowUpDays: 7
  },
  
  // Metadata
  metadata: {
    createdDate: '2024-01-01',
    version: '1.0.0',
    lastUpdated: '2024-01-15',
    createdBy: 'Service Management Department',
    confidentiality: 'Internal Use Only',
    serviceLevelAgreement: 'Standard',
    responseTime: '48 hours',
    escalationTime: '72 hours'
  },
  
  // Workflow configuration
  workflow: {
    steps: [
      {
        id: 'draft',
        name: 'Draft',
        role: 'requester',
        action: 'save_draft'
      },
      {
        id: 'submitted',
        name: 'Submitted',
        role: 'requester',
        action: 'submit'
      },
      {
        id: 'acknowledged',
        name: 'Acknowledged',
        role: 'service_desk',
        action: 'acknowledge'
      },
      {
        id: 'in_progress',
        name: 'In Progress',
        role: 'service_provider',
        action: 'start'
      },
      {
        id: 'completed',
        name: 'Completed',
        role: 'service_provider',
        action: 'complete'
      },
      {
        id: 'verified',
        name: 'Verified',
        role: 'requester',
        action: 'verify'
      },
      {
        id: 'closed',
        name: 'Closed',
        role: 'system',
        action: 'close'
      }
    ],
    transitions: [
      { from: 'draft', to: 'submitted', condition: 'submitted' },
      { from: 'submitted', to: 'acknowledged', condition: 'auto' },
      { from: 'acknowledged', to: 'in_progress', condition: 'assigned' },
      { from: 'in_progress', to: 'completed', condition: 'finished' },
      { from: 'completed', to: 'verified', condition: 'confirmed' },
      { from: 'verified', to: 'closed', condition: 'verified' }
    ],
    approvalRequired: false,
    autoAcknowledge: true,
    slaMonitoring: true,
    escalationRules: [
      { condition: 'pending_48h', action: 'escalate_to_supervisor' },
      { condition: 'pending_72h', action: 'escalate_to_manager' }
    ]
  },
  
  // Default values
  defaultValues: {
    dateOfRequest: () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${year}/${month}/${day}/${hours}:${minutes}`;
    },
    requestedBy: (user) => user?.name || '',
    followUpRows: [
      {
        id: 1,
        sn: 1,
        receivedBy: '',
        serviceDelivered: '',
        dateTime: '',
        idSign: ''
      }
    ]
  },
  
  // Service request specific properties
  serviceProperties: {
    categories: [
      'IT Support',
      'Facilities Management',
      'Administrative',
      'Technical',
      'Maintenance',
      'Consultation',
      'Other'
    ],
    priorities: [
      { value: 'urgent', label: 'Urgent (4 hours)', color: '#dc2626' },
      { value: 'high', label: 'High (24 hours)', color: '#ea580c' },
      { value: 'medium', label: 'Medium (48 hours)', color: '#ca8a04' },
      { value: 'low', label: 'Low (5 days)', color: '#16a34a' }
    ],
    statuses: [
      'New',
      'Acknowledged',
      'In Progress',
      'On Hold',
      'Resolved',
      'Closed',
      'Cancelled'
    ]
  },
  
  // Audit trail configuration
  auditTrail: {
    trackChanges: true,
    trackFields: ['requestNo', 'serviceRequested', 'followUpRows'],
    requireReasonForChange: true,
    logLevel: 'standard',
    trackResponseTimes: true
  },
  
  // Reporting configuration
  reporting: {
    generateReport: true,
    reportTemplates: ['service_summary', 'timeline', 'performance'],
    includeMetrics: true,
    metrics: ['response_time', 'resolution_time', 'satisfaction_rate'],
    autoGenerateCharts: true
  }
},
  // Add this to the formsDatabase object after form-14:

// Form 15 - Corrective Action Plan
'form-15': {
  id: 'form-15',
  name: 'Form 15 - Corrective Action Plan',
  description: 'Track and manage corrective actions for non-conformities with root cause analysis',
  category: 'Quality Assurance',
  categoryGroup: 'general',
  icon: '⚡',
  priorityOptions: true,
  department: 'all',
  comingSoon: false,
  formNumber: 'OF/DG/015',
  
  // Form fields configuration based on the React component
  fields: [
    // Top section
    {
      id: 'functionName',
      label: 'Name of the Function: (Planner)',
      type: 'text',
      required: true,
      placeholder: 'Enter function/planner name',
      validation: {
        minLength: 3,
        maxLength: 200
      },
      section: 'Basic Information'
    },
    {
      id: 'date',
      label: 'Date',
      type: 'date',
      required: true,
      validation: {
        maxDate: new Date().toISOString().split('T')[0]
      },
      section: 'Basic Information'
    },
    
    // Dynamic rows for corrective actions
    {
      id: 'correctiveActions',
      label: 'Corrective Action Items',
      type: 'array',
      required: true,
      minItems: 1,
      defaultRows: 5,
      addButtonText: 'Add Corrective Action',
      removeButtonText: 'Remove Action',
      fields: [
        {
          id: 'nonConformity',
          label: 'Actual/Potential Non-conformities',
          type: 'textarea',
          required: true,
          placeholder: 'Describe the non-conformity',
          validation: {
            minLength: 10,
            maxLength: 500
          },
          rows: 2
        },
        {
          id: 'ncrNo',
          label: 'NCR No. (if applicable)',
          type: 'text',
          required: false,
          placeholder: 'Enter NCR number',
          validation: {
            pattern: '^NCR-[0-9]{4}-[0-9]{3}$',
            maxLength: 20
          }
        },
        {
          id: 'rootCauses',
          label: 'Root Causes',
          type: 'textarea',
          required: true,
          placeholder: 'Identify root causes',
          validation: {
            minLength: 10,
            maxLength: 300
          },
          rows: 2
        },
        {
          id: 'actions',
          label: 'Actions to be taken',
          type: 'textarea',
          required: true,
          placeholder: 'Describe corrective actions',
          validation: {
            minLength: 10,
            maxLength: 500
          },
          rows: 2
        },
        {
          id: 'realizationDate',
          label: 'Specific Date of Realization',
          type: 'date',
          required: true,
          validation: {
            minDate: new Date().toISOString().split('T')[0]
          }
        },
        {
          id: 'followUpDate',
          label: 'Follow-up Date(s)',
          type: 'date',
          required: true,
          validation: {
            minDate: new Date().toISOString().split('T')[0]
          }
        },
        {
          id: 'responsibility',
          label: 'Responsibility',
          type: 'text',
          required: true,
          placeholder: 'Enter responsible person/team',
          validation: {
            minLength: 3,
            maxLength: 100
          }
        },
        {
          id: 'isClosed',
          label: 'Closed',
          type: 'checkbox',
          required: false
        },
        {
          id: 'isNotClosed',
          label: 'Not Closed',
          type: 'checkbox',
          required: false
        }
      ],
      section: 'Corrective Actions'
    },
    
    // Common fields
    {
      id: 'submittedBy',
      label: 'Submitted By',
      type: 'text',
      required: false,
      readonly: true
    },
    {
      id: 'submissionDate',
      label: 'Submission Date',
      type: 'date',
      required: false,
      readonly: true
    }
  ],
  
  // Form settings
  settings: {
    allowEdit: true,
    allowDuplication: true,
    allowWithdrawal: true,
    saveDraft: true,
    maxSubmissionsPerDay: 10,
    requiresApproval: true,
    approvalLevel: 'level2',
    retentionPeriod: '5 years',
    allowFileAttachment: true,
    attachmentTypes: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
    maxAttachmentSize: 10,
    requiresQualityManagerCopy: true,
    autoGenerateNCRNumbers: true,
    ncrNumberPrefix: 'NCR',
    defaultNumberOfRows: 5,
    maxNumberOfRows: 20
  },
  
  // Metadata
  metadata: {
    createdDate: '2024-01-01',
    version: '1.0.0',
    lastUpdated: '2024-01-15',
    createdBy: 'Quality Assurance Department',
    confidentiality: 'Internal Use Only',
    basedOnStandard: 'ISO 9001:2008',
    complianceLevel: 'Mandatory',
    relatedForms: ['form-18', 'form-19', 'form-20'],
    qualityManagerCopyRequired: true,
    bilingualForm: true,
    languages: ['English', 'Amharic']
  },
  
  // Workflow configuration
  workflow: {
    steps: [
      {
        id: 'draft',
        name: 'Draft',
        role: 'planner',
        action: 'save_draft'
      },
      {
        id: 'submitted',
        name: 'Submitted',
        role: 'planner',
        action: 'submit'
      },
      {
        id: 'quality_review',
        name: 'Quality Review',
        role: 'quality_manager',
        action: 'review'
      },
      {
        id: 'implementation',
        name: 'Implementation',
        role: 'responsible_party',
        action: 'implement'
      },
      {
        id: 'follow_up',
        name: 'Follow-up',
        role: 'quality_auditor',
        action: 'follow_up'
      },
      {
        id: 'verification',
        name: 'Verification',
        role: 'quality_manager',
        action: 'verify'
      },
      {
        id: 'closed',
        name: 'Closed',
        role: 'system',
        action: 'close'
      }
    ],
    transitions: [
      { from: 'draft', to: 'submitted', condition: 'submitted' },
      { from: 'submitted', to: 'quality_review', condition: 'auto' },
      { from: 'quality_review', to: 'implementation', condition: 'approved' },
      { from: 'implementation', to: 'follow_up', condition: 'implemented' },
      { from: 'follow_up', to: 'verification', condition: 'followed_up' },
      { from: 'verification', to: 'closed', condition: 'verified' }
    ],
    approvalRequired: true,
    requiresQualityManagerApproval: true,
    followUpRequired: true,
    defaultFollowUpDays: 30
  },
  
  // Default values
  defaultValues: {
    date: () => new Date().toISOString().split('T')[0],
    correctiveActions: () => Array(5).fill().map((_, index) => ({
      nonConformity: '',
      ncrNo: '',
      rootCauses: '',
      actions: '',
      realizationDate: '',
      followUpDate: '',
      responsibility: '',
      isClosed: false,
      isNotClosed: false
    }))
  },
  
  // Validation rules specific to Form15
  validationRules: {
    mutuallyExclusiveCheckboxes: {
      fields: ['isClosed', 'isNotClosed'],
      rule: 'only_one_can_be_true'
    },
    followUpDateAfterRealization: {
      field: 'followUpDate',
      dependsOn: 'realizationDate',
      rule: 'date_must_be_after'
    },
    ncrNumberFormat: {
      field: 'ncrNo',
      pattern: '^NCR-[0-9]{4}-[0-9]{3}$',
      message: 'NCR number must be in format: NCR-YYYY-NNN'
    }
  },
  
  // Corrective action specific properties
  correctiveActionProperties: {
    statusOptions: ['Open', 'In Progress', 'Completed', 'Verified', 'Closed'],
    priorityLevels: ['High', 'Medium', 'Low'],
    categories: [
      'Process Non-conformity',
      'Product Non-conformity',
      'Documentation Issue',
      'Equipment Failure',
      'Training Deficiency',
      'Other'
    ],
    effectivenessMeasures: [
      'Prevention of Recurrence',
      'Process Improvement',
      'Cost Reduction',
      'Customer Satisfaction',
      'Other'
    ]
  },
  
  // Audit trail configuration
  auditTrail: {
    trackChanges: true,
    trackFields: ['correctiveActions', 'functionName', 'date'],
    requireReasonForChange: true,
    logLevel: 'detailed',
    trackClosureDates: true,
    trackEffectiveness: true
  },
  
  // Reporting configuration
  reporting: {
    generateReport: true,
    reportTemplates: ['corrective_action_summary', 'timeline', 'effectiveness'],
    includeMetrics: true,
    metrics: ['completion_rate', 'timeliness', 'effectiveness_score'],
    autoGenerateCharts: true,
    exportFormats: ['pdf', 'excel']
  }
},
// Add this to the formsDatabase object after form-15:
// Add this to the formsDatabase object after form-15:

// Form 016 - Internal Audit Program
'form-16': {
  id: 'form-16',
  name: 'Form 016 - Internal Audit Program',
  description: 'Annual internal audit schedule and program with directorate-wise monthly planning',
  category: 'Quality Assurance',
  categoryGroup: 'general',
  icon: '📅',
  priorityOptions: true,
  department: 'all',
  comingSoon: false,
  formNumber: 'OF DG 016',
  
  // Form fields configuration based on the React component
  fields: [
    // Year field
    {
      id: 'year',
      label: 'Year',
      type: 'number',
      required: true,
      placeholder: 'Enter year',
      validation: {
        min: 2000,
        max: 2100
      },
      section: 'Program Information'
    },
    
    // Dynamic directorate rows
    {
      id: 'auditRows',
      label: 'Audit Schedule by Directorate',
      type: 'array',
      required: true,
      minItems: 1,
      defaultRows: 1,
      addButtonText: 'Add New Directorate',
      removeButtonText: 'Remove Directorate',
      fields: [
        {
          id: 'directorate',
          label: 'Directorate/Service',
          type: 'text',
          required: true,
          placeholder: 'Enter directorate/service name',
          validation: {
            minLength: 3,
            maxLength: 200
          }
        },
        // Monthly data - using a nested object structure
        {
          id: 'monthData',
          label: 'Monthly Audit Activities',
          type: 'object',
          fields: [
            {
              id: 'Sep',
              label: 'September',
              type: 'select',
              options: [
                { value: '', label: '--' },
                { value: 'IA', label: 'IA' },
                { value: 'MR', label: 'MR' },
                { value: 'CA&V', label: 'CA&V' },
                { value: 'IA, MR', label: 'IA, MR' },
                { value: 'IA, CA&V', label: 'IA, CA&V' },
                { value: 'MR, CA&V', label: 'MR, CA&V' },
                { value: 'IA, MR, CA&V', label: 'IA, MR, CA&V' }
              ]
            },
            {
              id: 'Oct',
              label: 'October',
              type: 'select',
              options: [
                { value: '', label: '--' },
                { value: 'IA', label: 'IA' },
                { value: 'MR', label: 'MR' },
                { value: 'CA&V', label: 'CA&V' },
                { value: 'IA, MR', label: 'IA, MR' },
                { value: 'IA, CA&V', label: 'IA, CA&V' },
                { value: 'MR, CA&V', label: 'MR, CA&V' },
                { value: 'IA, MR, CA&V', label: 'IA, MR, CA&V' }
              ]
            },
            {
              id: 'Nov',
              label: 'November',
              type: 'select',
              options: [
                { value: '', label: '--' },
                { value: 'IA', label: 'IA' },
                { value: 'MR', label: 'MR' },
                { value: 'CA&V', label: 'CA&V' },
                { value: 'IA, MR', label: 'IA, MR' },
                { value: 'IA, CA&V', label: 'IA, CA&V' },
                { value: 'MR, CA&V', label: 'MR, CA&V' },
                { value: 'IA, MR, CA&V', label: 'IA, MR, CA&V' }
              ]
            },
            {
              id: 'Dec',
              label: 'December',
              type: 'select',
              options: [
                { value: '', label: '--' },
                { value: 'IA', label: 'IA' },
                { value: 'MR', label: 'MR' },
                { value: 'CA&V', label: 'CA&V' },
                { value: 'IA, MR', label: 'IA, MR' },
                { value: 'IA, CA&V', label: 'IA, CA&V' },
                { value: 'MR, CA&V', label: 'MR, CA&V' },
                { value: 'IA, MR, CA&V', label: 'IA, MR, CA&V' }
              ]
            },
            {
              id: 'Jan',
              label: 'January',
              type: 'select',
              options: [
                { value: '', label: '--' },
                { value: 'IA', label: 'IA' },
                { value: 'MR', label: 'MR' },
                { value: 'CA&V', label: 'CA&V' },
                { value: 'IA, MR', label: 'IA, MR' },
                { value: 'IA, CA&V', label: 'IA, CA&V' },
                { value: 'MR, CA&V', label: 'MR, CA&V' },
                { value: 'IA, MR, CA&V', label: 'IA, MR, CA&V' }
              ]
            },
            {
              id: 'Feb',
              label: 'February',
              type: 'select',
              options: [
                { value: '', label: '--' },
                { value: 'IA', label: 'IA' },
                { value: 'MR', label: 'MR' },
                { value: 'CA&V', label: 'CA&V' },
                { value: 'IA, MR', label: 'IA, MR' },
                { value: 'IA, CA&V', label: 'IA, CA&V' },
                { value: 'MR, CA&V', label: 'MR, CA&V' },
                { value: 'IA, MR, CA&V', label: 'IA, MR, CA&V' }
              ]
            },
            {
              id: 'Mar',
              label: 'March',
              type: 'select',
              options: [
                { value: '', label: '--' },
                { value: 'IA', label: 'IA' },
                { value: 'MR', label: 'MR' },
                { value: 'CA&V', label: 'CA&V' },
                { value: 'IA, MR', label: 'IA, MR' },
                { value: 'IA, CA&V', label: 'IA, CA&V' },
                { value: 'MR, CA&V', label: 'MR, CA&V' },
                { value: 'IA, MR, CA&V', label: 'IA, MR, CA&V' }
              ]
            },
            {
              id: 'Apr',
              label: 'April',
              type: 'select',
              options: [
                { value: '', label: '--' },
                { value: 'IA', label: 'IA' },
                { value: 'MR', label: 'MR' },
                { value: 'CA&V', label: 'CA&V' },
                { value: 'IA, MR', label: 'IA, MR' },
                { value: 'IA, CA&V', label: 'IA, CA&V' },
                { value: 'MR, CA&V', label: 'MR, CA&V' },
                { value: 'IA, MR, CA&V', label: 'IA, MR, CA&V' }
              ]
            },
            {
              id: 'May',
              label: 'May',
              type: 'select',
              options: [
                { value: '', label: '--' },
                { value: 'IA', label: 'IA' },
                { value: 'MR', label: 'MR' },
                { value: 'CA&V', label: 'CA&V' },
                { value: 'IA, MR', label: 'IA, MR' },
                { value: 'IA, CA&V', label: 'IA, CA&V' },
                { value: 'MR, CA&V', label: 'MR, CA&V' },
                { value: 'IA, MR, CA&V', label: 'IA, MR, CA&V' }
              ]
            },
            {
              id: 'Jun',
              label: 'June',
              type: 'select',
              options: [
                { value: '', label: '--' },
                { value: 'IA', label: 'IA' },
                { value: 'MR', label: 'MR' },
                { value: 'CA&V', label: 'CA&V' },
                { value: 'IA, MR', label: 'IA, MR' },
                { value: 'IA, CA&V', label: 'IA, CA&V' },
                { value: 'MR, CA&V', label: 'MR, CA&V' },
                { value: 'IA, MR, CA&V', label: 'IA, MR, CA&V' }
              ]
            },
            {
              id: 'Jul',
              label: 'July',
              type: 'select',
              options: [
                { value: '', label: '--' },
                { value: 'IA', label: 'IA' },
                { value: 'MR', label: 'MR' },
                { value: 'CA&V', label: 'CA&V' },
                { value: 'IA, MR', label: 'IA, MR' },
                { value: 'IA, CA&V', label: 'IA, CA&V' },
                { value: 'MR, CA&V', label: 'MR, CA&V' },
                { value: 'IA, MR, CA&V', label: 'IA, MR, CA&V' }
              ]
            },
            {
              id: 'Aug',
              label: 'August',
              type: 'select',
              options: [
                { value: '', label: '--' },
                { value: 'IA', label: 'IA' },
                { value: 'MR', label: 'MR' },
                { value: 'CA&V', label: 'CA&V' },
                { value: 'IA, MR', label: 'IA, MR' },
                { value: 'IA, CA&V', label: 'IA, CA&V' },
                { value: 'MR, CA&V', label: 'MR, CA&V' },
                { value: 'IA, MR, CA&V', label: 'IA, MR, CA&V' }
              ]
            }
          ]
        }
      ],
      section: 'Audit Schedule'
    },
    
    // Common fields
    {
      id: 'submittedBy',
      label: 'Submitted By',
      type: 'text',
      required: false,
      readonly: true
    },
    {
      id: 'submissionDate',
      label: 'Submission Date',
      type: 'date',
      required: false,
      readonly: true
    }
  ],
  
  // Abbreviation definitions (for display/hints)
  abbreviations: {
    IA: 'Internal Audit',
    MR: 'Management Review',
    'CA&V': 'Corrective Action and Verification'
  },
  
  // Form settings
  settings: {
    allowEdit: true,
    allowDuplication: true,
    allowWithdrawal: true,
    saveDraft: true,
    maxSubmissionsPerDay: 2,
    requiresApproval: true,
    approvalLevel: 'level3',
    retentionPeriod: '3 years',
    allowFileAttachment: false,
    maxNumberOfRows: 15,
    defaultNumberOfRows: 1,
    fiscalYearFormat: true,
    fiscalYearStartMonth: 'September',
    requiresQualityManagerReview: true
  },
  
  // Metadata
  metadata: {
    createdDate: '2024-01-01',
    version: '1.0.0',
    lastUpdated: '2024-01-15',
    createdBy: 'Quality Assurance Department',
    confidentiality: 'Internal Use Only',
    basedOnStandard: 'ISO 9001:2015',
    complianceLevel: 'Mandatory',
    relatedForms: ['form-017', 'form-018', 'form-019'],
    fiscalYear: 'September - August',
    requiresAnnualUpdate: true,
    managementReviewRequired: true
  },
  
  // Workflow configuration
  workflow: {
    steps: [
      {
        id: 'draft',
        name: 'Draft',
        role: 'quality_manager',
        action: 'save_draft'
      },
      {
        id: 'submitted',
        name: 'Submitted',
        role: 'quality_manager',
        action: 'submit'
      },
      {
        id: 'department_review',
        name: 'Department Review',
        role: 'department_head',
        action: 'review'
      },
      {
        id: 'management_approval',
        name: 'Management Approval',
        role: 'executive_director',
        action: 'approve'
      },
      {
        id: 'published',
        name: 'Published',
        role: 'quality_manager',
        action: 'publish'
      },
      {
        id: 'in_progress',
        name: 'In Progress',
        role: 'audit_team',
        action: 'execute'
      },
      {
        id: 'completed',
        name: 'Completed',
        role: 'system',
        action: 'close'
      }
    ],
    transitions: [
      { from: 'draft', to: 'submitted', condition: 'submitted' },
      { from: 'submitted', to: 'department_review', condition: 'auto' },
      { from: 'department_review', to: 'management_approval', condition: 'reviewed' },
      { from: 'management_approval', to: 'published', condition: 'approved' },
      { from: 'published', to: 'in_progress', condition: 'year_start' },
      { from: 'in_progress', to: 'completed', condition: 'year_end' }
    ],
    approvalRequired: true,
    requiresMultipleApprovals: true,
    annualProgram: true,
    autoRollover: false
  },
  
  // Default values
  defaultValues: {
    year: () => new Date().getFullYear(),
    auditRows: () => [
      {
        id: 1,
        directorate: '',
        monthData: {
          Sep: '', Oct: '', Nov: '', Dec: '',
          Jan: '', Feb: '', Mar: '', Apr: '',
          May: '', Jun: '', Jul: '', Aug: ''
        }
      }
    ]
  },
  
  // Validation rules specific to Form016
  validationRules: {
    minDirectorates: {
      field: 'auditRows',
      minItems: 1,
      message: 'At least one Directorate/Service must be specified'
    },
    fiscalYearCompleteness: {
      rule: 'annual_coverage_check',
      message: 'All months should have appropriate audit activities assigned'
    }
  },
  
  // Audit program specific properties
  auditProgramProperties: {
    monthsOrder: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    activityTypes: ['IA', 'MR', 'CA&V'],
    combinedActivities: ['IA, MR', 'IA, CA&V', 'MR, CA&V', 'IA, MR, CA&V'],
    frequencyOptions: ['Monthly', 'Quarterly', 'Bi-Annually', 'Annually'],
    departmentOptions: [
      'Quality Assurance',
      'Production',
      'Engineering',
      'Purchasing',
      'Human Resources',
      'Finance',
      'Administration',
      'All Directorates'
    ]
  },
  
  // Audit trail configuration
  auditTrail: {
    trackChanges: true,
    trackFields: ['year', 'auditRows'],
    requireReasonForChange: true,
    logLevel: 'detailed',
    trackScheduleChanges: true,
    versionHistory: true
  },
  
  // Reporting configuration
  reporting: {
    generateReport: true,
    reportTemplates: ['annual_schedule', 'department_coverage', 'activity_summary'],
    includeMetrics: true,
    metrics: ['coverage_percentage', 'activity_distribution', 'compliance_rate'],
    autoGenerateCharts: true,
    exportFormats: ['pdf', 'excel', 'calendar']
  }
},
// Form 017 - Internal Quality Audit Plan
'form-17': {
  id: 'form-17',
  name: 'Form 017 - Internal Quality Audit Plan',
  description: 'Plan and schedule internal quality audits with detailed audit scope, objectives, and team assignments',
  category: 'Quality Assurance',
  categoryGroup: 'general',
  icon: '📋',
  priorityOptions: true,
  department: 'all',
  comingSoon: false,
  formNumber: 'OF/DG/017',
  
  // Form fields configuration based on the React component
  fields: [
    // Section 1: Basic Audit Information
    {
      id: 'auditee',
      label: '1. AUDITEE',
      type: 'text',
      required: true,
      placeholder: 'Enter auditee name/department',
      validation: {
        minLength: 3,
        maxLength: 200
      },
      section: 'Audit Information'
    },
    {
      id: 'auditNumber',
      label: '2. AUDIT NUMBER',
      type: 'text',
      required: true,
      placeholder: 'Enter audit number',
      validation: {
        pattern: '^AUD-[0-9]{4}-[0-9]{3}$',
        maxLength: 20
      },
      section: 'Audit Information'
    },
    {
      id: 'auditDate',
      label: '3. DATE OF AUDIT',
      type: 'date',
      required: true,
      validation: {
        minDate: new Date().toISOString().split('T')[0]
      },
      section: 'Audit Information'
    },
    {
      id: 'auditors',
      label: '4. AUDITORS',
      type: 'text',
      required: true,
      placeholder: 'Enter auditor names',
      validation: {
        minLength: 5,
        maxLength: 300
      },
      section: 'Audit Information'
    },
    {
      id: 'standard',
      label: '5. STANDARD',
      type: 'text',
      required: true,
      placeholder: 'e.g., ISO 9001:2015, ISO 14001:2015',
      validation: {
        minLength: 5,
        maxLength: 200
      },
      section: 'Audit Information'
    },
    {
      id: 'objectives',
      label: '6. OBJECTIVES',
      type: 'textarea',
      required: true,
      placeholder: 'Describe the audit objectives',
      validation: {
        minLength: 20,
        maxLength: 1000
      },
      rows: 3,
      section: 'Audit Information'
    },
    {
      id: 'scope',
      label: '7. SCOPE',
      type: 'textarea',
      required: true,
      placeholder: 'Define the audit scope',
      validation: {
        minLength: 20,
        maxLength: 1000
      },
      rows: 3,
      section: 'Audit Information'
    },
    
    // Section 2: Dynamic Audit Plan Rows
    {
      id: 'planRows',
      label: '8. AUDIT PLAN',
      type: 'array',
      required: true,
      minItems: 1,
      defaultRows: 5,
      addButtonText: 'Add Schedule Entry',
      removeButtonText: 'Remove Entry',
      fields: [
        {
          id: 'place',
          label: 'Place',
          type: 'text',
          required: true,
          placeholder: 'Enter location/place',
          validation: {
            minLength: 3,
            maxLength: 100
          }
        },
        {
          id: 'contact',
          label: 'Person to be contacted',
          type: 'text',
          required: true,
          placeholder: 'Enter contact person name',
          validation: {
            minLength: 3,
            maxLength: 100
          }
        },
        {
          id: 'dateTime',
          label: 'Date and Time',
          type: 'text',
          required: true,
          placeholder: 'DD/MM/YYYY HH:MM or specific time',
          validation: {
            minLength: 5,
            maxLength: 50
          }
        },
        {
          id: 'auditors',
          label: 'Auditor(s)',
          type: 'text',
          required: true,
          placeholder: 'Enter assigned auditor(s)',
          validation: {
            minLength: 3,
            maxLength: 100
          }
        }
      ],
      section: 'Audit Schedule'
    },
    
    // Section 3: Lead Auditor Information
    {
      id: 'leadAuditor',
      label: 'Lead Auditor\'s Name',
      type: 'text',
      required: true,
      placeholder: 'Enter lead auditor name',
      validation: {
        minLength: 5,
        maxLength: 100
      },
      section: 'Approval'
    },
    {
      id: 'signature',
      label: 'Signature',
      type: 'text',
      required: true,
      placeholder: 'Lead auditor signature/initials',
      validation: {
        minLength: 2,
        maxLength: 50
      },
      section: 'Approval'
    },
    {
      id: 'signDate',
      label: 'Date',
      type: 'date',
      required: true,
      validation: {
        maxDate: new Date().toISOString().split('T')[0]
      },
      section: 'Approval'
    },
    
    // Common fields
    {
      id: 'submittedBy',
      label: 'Submitted By',
      type: 'text',
      required: false,
      readonly: true
    },
    {
      id: 'submissionDate',
      label: 'Submission Date',
      type: 'date',
      required: false,
      readonly: true
    }
  ],
  
  // Form settings
  settings: {
    allowEdit: true,
    allowDuplication: true,
    allowWithdrawal: true,
    saveDraft: true,
    maxSubmissionsPerDay: 5,
    requiresApproval: true,
    approvalLevel: 'level2',
    retentionPeriod: '3 years',
    allowFileAttachment: true,
    attachmentTypes: ['.pdf', '.doc', '.docx'],
    maxAttachmentSize: 10,
    requiresLeadAuditorSignature: true,
    autoGenerateAuditNumber: true,
    auditNumberPrefix: 'AUD',
    defaultScheduleEntries: 5,
    maxScheduleEntries: 20,
    requiresAuditTeamAssignment: true
  },
  
  // Metadata
  metadata: {
    createdDate: '2024-01-01',
    version: '1.0.0',
    lastUpdated: '2024-01-15',
    createdBy: 'Quality Assurance Department',
    confidentiality: 'Internal Use Only',
    basedOnStandard: 'ISO 9001:2015',
    complianceLevel: 'Mandatory',
    relatedForms: ['form-18', 'form-19'],
    auditFrequency: 'Annual/Quarterly',
    requiresManagementReview: true,
    bilingualForm: true,
    languages: ['English', 'Amharic']
  },
  
  // Workflow configuration
  workflow: {
    steps: [
      {
        id: 'draft',
        name: 'Draft',
        role: 'lead_auditor',
        action: 'save_draft'
      },
      {
        id: 'submitted',
        name: 'Submitted',
        role: 'lead_auditor',
        action: 'submit'
      },
      {
        id: 'quality_review',
        name: 'Quality Review',
        role: 'quality_manager',
        action: 'review'
      },
      {
        id: 'management_approval',
        name: 'Management Approval',
        role: 'department_head',
        action: 'approve'
      },
      {
        id: 'audit_execution',
        name: 'Audit Execution',
        role: 'audit_team',
        action: 'execute'
      },
      {
        id: 'report_submission',
        name: 'Report Submission',
        role: 'lead_auditor',
        action: 'submit_report'
      },
      {
        id: 'closed',
        name: 'Closed',
        role: 'system',
        action: 'close'
      }
    ],
    transitions: [
      { from: 'draft', to: 'submitted', condition: 'submitted' },
      { from: 'submitted', to: 'quality_review', condition: 'auto' },
      { from: 'quality_review', to: 'management_approval', condition: 'reviewed' },
      { from: 'management_approval', to: 'audit_execution', condition: 'approved' },
      { from: 'audit_execution', to: 'report_submission', condition: 'completed' },
      { from: 'report_submission', to: 'closed', condition: 'submitted' }
    ],
    approvalRequired: true,
    requiresMultipleApprovals: true,
    auditTeamRequired: true,
    minimumAuditors: 2
  },
  
  // Default values
  defaultValues: {
    auditDate: () => {
      const date = new Date();
      date.setDate(date.getDate() + 14); // Default to 2 weeks from now
      return date.toISOString().split('T')[0];
    },
    signDate: () => new Date().toISOString().split('T')[0],
    standard: 'ISO 9001:2015',
    planRows: () => Array(5).fill().map((_, index) => ({
      place: '',
      contact: '',
      dateTime: '',
      auditors: ''
    }))
  },
  
  // Validation rules specific to Form017
  validationRules: {
    auditNumberFormat: {
      field: 'auditNumber',
      pattern: '^AUD-[0-9]{4}-[0-9]{3}$',
      message: 'Audit number must be in format: AUD-YYYY-NNN'
    },
    dateSequence: {
      field: 'auditDate',
      dependsOn: 'signDate',
      rule: 'date_must_be_after'
    },
    minimumAuditors: {
      field: 'auditors',
      minCount: 2,
      message: 'Minimum 2 auditors required for the audit team'
    }
  },
  
  // Audit plan specific properties
  auditPlanProperties: {
    auditTypes: ['Internal', 'External', 'Supplier', 'Process', 'System'],
    auditMethods: ['Document Review', 'Interview', 'Observation', 'Sampling'],
    durationOptions: ['Half Day', 'Full Day', '2 Days', '3 Days', '5 Days'],
    frequencyOptions: ['Monthly', 'Quarterly', 'Semi-Annually', 'Annually', 'As Needed'],
    departmentOptions: [
      'Quality Assurance',
      'Production',
      'Engineering',
      'Purchasing',
      'Human Resources',
      'Administration',
      'All Departments'
    ]
  },
  
  // Audit trail configuration
  auditTrail: {
    trackChanges: true,
    trackFields: ['auditNumber', 'auditee', 'planRows', 'leadAuditor'],
    requireReasonForChange: true,
    logLevel: 'detailed',
    trackAuditScheduleChanges: true,
    trackTeamAssignments: true
  },
  
  // Reporting configuration
  reporting: {
    generateReport: true,
    reportTemplates: ['audit_plan_summary', 'schedule', 'team_assignment'],
    includeMetrics: true,
    metrics: ['audit_coverage', 'schedule_adherence', 'team_utilization'],
    autoGenerateCharts: true,
    exportFormats: ['pdf', 'excel', 'calendar']
  }
},
  // Form 18 - Internal Audit Report
  'form-18': {
    id: 'form-18',
    name: 'Form 18 - Internal Audit Report',
    description: 'Document internal audit findings, non-conformities, and improvement opportunities',
    category: 'Audit',
    categoryGroup: 'general',
    icon: '📊',
    priorityOptions: true,
    department: 'all',
    comingSoon: false,
    formNumber: 'OF/DG/018',
    
    // Form fields configuration based on Form18 component
    fields: [
      {
        id: 'auditee',
        label: '1. Auditee',
        type: 'text',
        required: true,
        placeholder: 'Enter auditee name or department',
        validation: {
          minLength: 2,
          maxLength: 100
        }
      },
      {
        id: 'auditProcess',
        label: '2. Audit Process',
        type: 'text',
        required: true,
        placeholder: 'Enter audit process name',
        validation: {
          minLength: 5,
          maxLength: 200
        }
      },
      {
        id: 'description',
        label: '3. Short Description of the audit',
        type: 'textarea',
        required: true,
        rows: 2,
        placeholder: 'Provide a short description of the audit',
        validation: {
          minLength: 20,
          maxLength: 500
        }
      },
      {
        id: 'dateConducted',
        label: '4. Date Audit conducted',
        type: 'date',
        required: true
      },
      {
        id: 'objectives',
        label: '5. Objective(s) of the audit',
        type: 'textarea',
        required: true,
        rows: 3,
        placeholder: 'Describe the objectives of this audit',
        validation: {
          minLength: 30,
          maxLength: 1000
        }
      },
      {
        id: 'scope',
        label: '6. Scope of the audit',
        type: 'text',
        required: true,
        placeholder: 'Enter the scope of the audit',
        validation: {
          minLength: 10,
          maxLength: 300
        }
      },
      {
        id: 'documentsUsed',
        label: '7. Documents used',
        type: 'text',
        required: true,
        placeholder: 'List documents used during the audit',
        validation: {
          minLength: 5,
          maxLength: 200
        }
      },
      {
        id: 'auditPlan',
        label: '8. Audit Plan',
        type: 'text',
        required: true,
        placeholder: 'Enter audit plan reference',
        validation: {
          minLength: 5,
          maxLength: 200
        }
      },
      {
        id: 'strength',
        label: '9.1 Strength',
        type: 'textarea',
        required: false,
        rows: 3,
        placeholder: 'Document strengths found during audit'
      },
      {
        id: 'potentialImprovements',
        label: '9.2 Potential for Improvements',
        type: 'textarea',
        required: false,
        rows: 3,
        placeholder: 'Document potential improvement areas'
      },
      {
        id: 'nonConformities',
        label: '9.3 Agreed non-conformities',
        type: 'textarea',
        required: true,
        rows: 4,
        placeholder: 'Document all agreed non-conformities',
        validation: {
          minLength: 10
        }
      },
      {
        id: 'excludedRequirements',
        label: '10. Excluded requirements of ISO 9001:2008',
        type: 'text',
        required: false,
        placeholder: 'List excluded requirements if any'
      },
      {
        id: 'conclusion',
        label: '11. Conclusion',
        type: 'textarea',
        required: true,
        rows: 3,
        placeholder: 'Provide audit conclusion',
        validation: {
          minLength: 30,
          maxLength: 500
        }
      },
      {
        id: 'leadAuditor',
        label: 'Lead Auditor Name',
        type: 'text',
        required: true,
        placeholder: 'Enter lead auditor name',
        validation: {
          minLength: 5,
          maxLength: 100
        }
      },
      {
        id: 'signature',
        label: 'Signature',
        type: 'text',
        required: true,
        placeholder: 'Auditor signature or initials'
      },
      {
        id: 'date',
        label: 'Date',
        type: 'date',
        required: true
      }
    ],
    
    // Form settings
    settings: {
      allowEdit: true,
      allowDuplication: true,
      allowWithdrawal: true,
      saveDraft: true,
      maxSubmissionsPerDay: 3,
      requiresApproval: true,
      approvalLevel: 'level3',
      retentionPeriod: '7 years'
    },
    
    // Metadata
    metadata: {
      createdDate: '2024-01-01',
      version: '1.0.0',
      lastUpdated: '2024-01-15',
      createdBy: 'Quality Assurance Department',
      basedOnStandard: 'ISO 9001:2008',
      complianceLevel: 'Mandatory',
      frequency: 'Quarterly',
      confidentiality: 'Internal Use Only'
    }
  },
  
  // Form 19 - Non-Conformance Report
  'form-19': {
    id: 'form-19',
    name: 'Form 19 - Non-Conformance Report',
    description: 'Report and track non-conformities identified during audits with corrective actions',
    category: 'Audit',
    categoryGroup: 'general',
    icon: '⚠️',
    priorityOptions: true,
    department: 'all',
    comingSoon: false,
    formNumber: 'OF/DG/019',
    
    // Form fields configuration based on Form19 component
    fields: [
      {
        id: 'dateAuditConducted',
        label: '1. Date audit conducted',
        type: 'date',
        required: true
      },
      {
        id: 'auditRefNo',
        label: '2. Audit Reference Number',
        type: 'text',
        required: true,
        placeholder: 'Enter audit reference number',
        validation: {
          minLength: 3,
          maxLength: 50
        }
      },
      {
        id: 'ncrNo',
        label: '3. NCR Number',
        type: 'text',
        required: true,
        placeholder: 'Enter NCR number',
        validation: {
          minLength: 3,
          maxLength: 50
        }
      },
      {
        id: 'auditee',
        label: '5. Auditee',
        type: 'text',
        required: true,
        placeholder: 'Enter auditee name or department',
        validation: {
          minLength: 2,
          maxLength: 100
        }
      },
      {
        id: 'location',
        label: '6. Location',
        type: 'text',
        required: true,
        placeholder: 'Enter location of non-conformance',
        validation: {
          minLength: 2,
          maxLength: 200
        }
      },
      {
        id: 'ncrDescription',
        label: '7. Description of the non-conformity',
        type: 'textarea',
        required: true,
        rows: 3,
        placeholder: 'Describe the non-conformity in detail',
        validation: {
          minLength: 20,
          maxLength: 1000
        }
      },
      {
        id: 'objectiveEvidence',
        label: '8. Objective evidence for the non-conformity',
        type: 'textarea',
        required: true,
        rows: 3,
        placeholder: 'Provide objective evidence supporting the non-conformity',
        validation: {
          minLength: 20,
          maxLength: 1000
        }
      },
      {
        id: 'standardRequirement',
        label: '9. Relevant ISO 9001 standard requirement',
        type: 'textarea',
        required: true,
        rows: 2,
        placeholder: 'Reference the relevant standard requirement',
        validation: {
          minLength: 10,
          maxLength: 500
        }
      }
    ],
    
    // Form settings
    settings: {
      allowEdit: true,
      allowDuplication: true,
      allowWithdrawal: true,
      saveDraft: true,
      maxSubmissionsPerDay: 5,
      requiresApproval: true,
      approvalLevel: 'level2',
      retentionPeriod: '5 years'
    },
    
    // Workflow configuration
    workflow: {
      steps: [
        {
          id: 'submission',
          name: 'Submitted',
          role: 'auditor',
          action: 'submit'
        },
        {
          id: 'auditee_review',
          name: 'Auditee Review',
          role: 'auditee',
          action: 'review'
        },
        {
          id: 'correction_plan',
          name: 'Correction Plan Submitted',
          role: 'auditee',
          action: 'submit_correction'
        },
        {
          id: 'verification',
          name: 'Verification',
          role: 'qa_manager',
          action: 'verify'
        },
        {
          id: 'closed',
          name: 'Closed',
          role: 'system',
          action: 'close'
        }
      ],
      transitions: [
        { from: 'submission', to: 'auditee_review', condition: 'auto' },
        { from: 'auditee_review', to: 'correction_plan', condition: 'acknowledged' },
        { from: 'correction_plan', to: 'verification', condition: 'submitted' },
        { from: 'verification', to: 'closed', condition: 'verified' }
      ]
    },
    
    // Metadata
    metadata: {
      createdDate: '2024-01-01',
      version: '1.0.0',
      lastUpdated: '2024-01-15',
      createdBy: 'Quality Assurance Department',
      basedOnStandard: 'ISO 9001:2008',
      complianceLevel: 'Mandatory',
      confidentiality: 'Internal Use Only',
      relatedForm: 'form-18'
    },
    
    // Audit specific properties
    auditProperties: {
      requiresAuditorSignatures: true,
      requiresAuditeeAgreement: true,
      correctiveActionsRequired: true,
      maxCorrectiveActions: 4,
      followUpRequired: true,
      followUpPeriod: '30 days'
    }
  },
  
  // Form 20 - Root Cause Analysis Form
  'form-20': {
    id: 'form-20',
    name: 'Form 20 - Root Cause Analysis Form',
    description: 'Perform 5 Whys analysis for non-conformities and issues',
    category: 'Quality Assurance',
    categoryGroup: 'general',
    icon: '🔍',
    priorityOptions: true,
    department: 'QA',
    comingSoon: false,
    formNumber: 'OF/QA/020',
    
    fields: [
      {
        id: 'nonConformity',
        label: 'Non-Conformity',
        type: 'textarea',
        required: true,
        rows: 4,
        placeholder: 'Describe the non-conformity or issue',
        validation: {
          minLength: 20,
          maxLength: 1000
        }
      },
      {
        id: 'whys',
        label: '5 Whys Analysis',
        type: 'array',
        fields: [
          {
            id: 'question',
            label: 'Why',
            type: 'text',
            required: false,
            placeholder: 'Enter the "Why" question'
          },
          {
            id: 'answer',
            label: 'Because',
            type: 'textarea',
            required: false,
            placeholder: 'Enter the answer',
            rows: 2
          }
        ]
      },
      {
        id: 'rootCause',
        label: 'Root Cause',
        type: 'textarea',
        required: false,
        rows: 4,
        placeholder: 'Describe the identified root cause'
      }
    ],
    
    workflow: {
      requiresApproval: true,
      approvalLevels: 2,
      autoAssign: true
    }
  },
  
  // Coming Soon Forms
  'qa-form-1': {
    id: 'qa-form-1',
    name: 'Quality Audit Form',
    description: 'Quality assurance audit and inspection form',
    category: 'Quality Assurance',
    categoryGroup: 'qa',
    icon: '✅',
    priorityOptions: true,
    department: 'QA',
    comingSoon: true,
    formNumber: 'OF-QA-001'
  },
  
  'qa-form-2': {
    id: 'qa-form-2',
    name: 'Corrective Action Report',
    description: 'Report and track corrective actions for quality issues',
    category: 'Quality Assurance',
    categoryGroup: 'qa',
    icon: '⚡',
    priorityOptions: true,
    department: 'QA',
    comingSoon: true,
    formNumber: 'OF-QA-002'
  },
  
  'qa-form-3': {
    id: 'qa-form-3',
    name: 'Preventive Action Report',
    description: 'Document preventive actions to avoid quality issues',
    category: 'Quality Assurance',
    categoryGroup: 'qa',
    icon: '🛡️',
    priorityOptions: true,
    department: 'QA',
    comingSoon: true,
    formNumber: 'OF-QA-003'
  },
  
  'qa-form-4': {
    id: 'qa-form-4',
    name: 'Management Review Report',
    description: 'Management review meeting minutes and action items',
    category: 'Quality Assurance',
    categoryGroup: 'qa',
    icon: '👥',
    priorityOptions: true,
    department: 'QA',
    comingSoon: true,
    formNumber: 'OF-QA-004'
  },
  
  'hr-form-2': {
    id: 'hr-form-2',
    name: 'Leave Application',
    description: 'Apply for various types of leave',
    category: 'Human Resources',
    categoryGroup: 'hr',
    icon: '🏖️',
    priorityOptions: true,
    department: 'HR',
    comingSoon: true,
    formNumber: 'OF-HR-001'
  },
  
  'hr-form-3': {
    id: 'hr-form-3',
    name: 'Performance Review',
    description: 'Employee performance evaluation and feedback',
    category: 'Human Resources',
    categoryGroup: 'hr',
    icon: '📈',
    priorityOptions: true,
    department: 'HR',
    comingSoon: true,
    formNumber: 'OF-HR-002'
  },
  
  'hr-form-4': {
    id: 'hr-form-4',
    name: 'Recruitment Request',
    description: 'Request new employee recruitment',
    category: 'Human Resources',
    categoryGroup: 'hr',
    icon: '👔',
    priorityOptions: true,
    department: 'HR',
    comingSoon: true,
    formNumber: 'OF-HR-003'
  },
  
  'finance-form-1': {
    id: 'finance-form-1',
    name: 'Purchase Requisition',
    description: 'Request purchase of goods and services',
    category: 'Finance',
    categoryGroup: 'finance',
    icon: '💰',
    priorityOptions: true,
    department: 'Finance',
    comingSoon: true,
    formNumber: 'OF-FIN-001'
  },
  
  'finance-form-2': {
    id: 'finance-form-2',
    name: 'Expense Report',
    description: 'Submit business expense reports',
    category: 'Finance',
    categoryGroup: 'finance',
    icon: '💳',
    priorityOptions: true,
    department: 'Finance',
    comingSoon: true,
    formNumber: 'OF-FIN-002'
  },
  
  'finance-form-3': {
    id: 'finance-form-3',
    name: 'Budget Request',
    description: 'Request budget allocation or adjustment',
    category: 'Finance',
    categoryGroup: 'finance',
    icon: '📊',
    priorityOptions: true,
    department: 'Finance',
    comingSoon: true,
    formNumber: 'OF-FIN-003'
  },
  
  'finance-form-4': {
    id: 'finance-form-4',
    name: 'Invoice Processing',
    description: 'Process vendor invoices and payments',
    category: 'Finance',
    categoryGroup: 'finance',
    icon: '🧾',
    priorityOptions: true,
    department: 'Finance',
    comingSoon: true,
    formNumber: 'OF-FIN-004'
  },
  
  'ai-form-1': {
    id: 'ai-form-1',
    name: 'AI Model Request',
    description: 'Request AI/ML model development or deployment',
    category: 'AI & ML',
    categoryGroup: 'ai',
    icon: '🤖',
    priorityOptions: true,
    department: 'AI',
    comingSoon: true,
    formNumber: 'OF-AI-001'
  },
  
  'ai-form-2': {
    id: 'ai-form-2',
    name: 'Data Access Request',
    description: 'Request access to datasets for AI training',
    category: 'AI & ML',
    categoryGroup: 'ai',
    icon: '📊',
    priorityOptions: true,
    department: 'AI',
    comingSoon: true,
    formNumber: 'OF-AI-002'
  },
  
  'ai-form-3': {
    id: 'ai-form-3',
    name: 'Model Validation Request',
    description: 'Request AI model validation and testing',
    category: 'AI & ML',
    categoryGroup: 'ai',
    icon: '✅',
    priorityOptions: true,
    department: 'AI',
    comingSoon: true,
    formNumber: 'OF-AI-003'
  },
  
  'ai-form-4': {
    id: 'ai-form-4',
    name: 'Ethics Review Request',
    description: 'Request ethical review for AI projects',
    category: 'AI & ML',
    categoryGroup: 'ai',
    icon: '⚖️',
    priorityOptions: true,
    department: 'AI',
    comingSoon: true,
    formNumber: 'OF-AI-004'
  },
  
  'security-form-1': {
    id: 'security-form-1',
    name: 'Access Control Request',
    description: 'Request access to secure systems or areas',
    category: 'Security',
    categoryGroup: 'security',
    icon: '🔐',
    priorityOptions: true,
    department: 'Security',
    comingSoon: true,
    formNumber: 'OF-SEC-002'
  },
  
  'security-form-2': {
    id: 'security-form-2',
    name: 'Security Incident Report',
    description: 'Report security incidents or breaches',
    category: 'Security',
    categoryGroup: 'security',
    icon: '🚨',
    priorityOptions: true,
    department: 'Security',
    comingSoon: true,
    formNumber: 'OF-SEC-003'
  },
  
  'security-form-3': {
    id: 'security-form-3',
    name: 'Risk Assessment Report',
    description: 'Security risk assessment and mitigation plan',
    category: 'Security',
    categoryGroup: 'security',
    icon: '⚠️',
    priorityOptions: true,
    department: 'Security',
    comingSoon: true,
    formNumber: 'OF-SEC-004'
  }
};

// ==================== FORM UTILITIES ====================
export const formUtilities = {
  // Get form by ID
  getFormById: (formId) => {
    return formsDatabase[formId];
  },
  
  // Get forms by category
  getFormsByCategory: (category) => {
    return Object.values(formsDatabase).filter(
      form => form.category === category
    );
  },
  
  // Get forms by category group
  getFormsByCategoryGroup: (categoryGroup) => {
    return Object.values(formsDatabase).filter(
      form => form.categoryGroup === categoryGroup
    );
  },
  
  // Get all available categories
  getAllCategories: () => {
    const categories = new Set();
    Object.values(formsDatabase).forEach(form => {
      categories.add(form.category);
    });
    return Array.from(categories);
  },
  
  // Get all category groups
  getAllCategoryGroups: () => {
    const groups = new Set();
    Object.values(formsDatabase).forEach(form => {
      groups.add(form.categoryGroup);
    });
    return Array.from(groups);
  },
  
  // Get form validation rules
  getFormValidationRules: (formId) => {
    const form = formsDatabase[formId];
    return form ? form.validationRules || {} : {};
  },
  
  // Get form workflow
  getFormWorkflow: (formId) => {
    const form = formsDatabase[formId];
    return form ? form.workflow || {} : {};
  },
  
  // Validate form data
  validateFormData: (formId, formData) => {
    const form = formsDatabase[formId];
    if (!form) return { valid: false, errors: ['Form not found'] };
    
    const errors = {};
    let isValid = true;
    
    form.fields.forEach(field => {
      if (field.required) {
        const validator = formValidators.required;
        const result = validator(formData[field.id]);
        if (result !== true) {
          errors[field.id] = result;
          isValid = false;
        }
      }
      
      // Check validation rules
      if (field.validation && formData[field.id]) {
        for (const [rule, ruleValue] of Object.entries(field.validation)) {
          const validator = formValidators[rule];
          if (validator) {
            const result = validator(formData[field.id], ruleValue);
            if (result !== true) {
              errors[field.id] = result;
              isValid = false;
              break;
            }
          }
        }
      }
    });
    
    return { valid: isValid, errors };
  },
  
  // Generate form submission data
  generateSubmissionData: (formId, formData, user) => {
    const form = formsDatabase[formId];
    if (!form) return null;
    
    return {
      formId: form.id,
      formName: form.name,
      formCategory: form.category,
      formNumber: form.formNumber,
      formData: formData,
      submittedBy: user?.employeeId || 'unknown',
      submittedByName: user?.name || 'Unknown User',
      submittedByEmail: user?.email || '',
      submittedByDepartment: user?.department || '',
      submissionDate: new Date().toISOString(),
      status: 'pending',
      priority: formData.priority || 'medium'
    };
  },
  
  // Get form statistics
  getFormStatistics: () => {
    const stats = {
      totalForms: Object.keys(formsDatabase).length,
      activeForms: Object.values(formsDatabase).filter(f => !f.comingSoon).length,
      comingSoonForms: Object.values(formsDatabase).filter(f => f.comingSoon).length,
      byCategoryGroup: {},
      byDepartment: {},
      categories: {}
    };
    
    // Count by category group
    Object.values(formsDatabase).forEach(form => {
      if (!stats.byCategoryGroup[form.categoryGroup]) {
        stats.byCategoryGroup[form.categoryGroup] = { total: 0, active: 0 };
      }
      stats.byCategoryGroup[form.categoryGroup].total++;
      if (!form.comingSoon) {
        stats.byCategoryGroup[form.categoryGroup].active++;
      }
    });
    
    // Count by department
    Object.values(formsDatabase).forEach(form => {
      const dept = form.department;
      if (!stats.byDepartment[dept]) {
        stats.byDepartment[dept] = { total: 0, active: 0 };
      }
      stats.byDepartment[dept].total++;
      if (!form.comingSoon) {
        stats.byDepartment[dept].active++;
      }
    });
    
    // Count by category
    Object.values(formsDatabase).forEach(form => {
      if (!stats.categories[form.category]) {
        stats.categories[form.category] = 0;
      }
      stats.categories[form.category]++;
    });
    
    return stats;
  },
  
  // Export form configuration
  exportFormConfig: (formId) => {
    const form = formsDatabase[formId];
    if (!form) return null;
    
    return {
      ...form,
      exportDate: new Date().toISOString(),
      exportVersion: '1.0'
    };
  },
  
  // Import form configuration
  importFormConfig: (config) => {
    if (!config.id) {
      throw new Error('Form configuration must have an ID');
    }
    
    // Validate the config structure
    const requiredFields = ['name', 'description', 'category', 'fields'];
    for (const field of requiredFields) {
      if (!config[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Add to configurations
    formsDatabase[config.id] = {
      ...config,
      comingSoon: config.comingSoon || false,
      priorityOptions: config.priorityOptions || true,
      department: config.department || 'all'
    };
    
    return config.id;
  },
  
  // Get forms for a specific user based on department
  getFormsForUser: (userDepartment) => {
    return Object.values(formsDatabase).filter(form => {
      const departmentMatch = form.department === 'all' || 
                             form.department === userDepartment || 
                             userDepartment === 'admin';
      return departmentMatch;
    });
  },
  
  // Get forms sorted by priority
  getFormsSortedByPriority: () => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    return Object.values(formsDatabase)
      .filter(form => !form.comingSoon)
      .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  },
  
  // Get all form IDs for quick reference
  getAllFormIds: () => {
    return Object.keys(formsDatabase);
  },
  
  // Get available forms (not coming soon)
  getAvailableForms: () => {
    return Object.values(formsDatabase).filter(form => !form.comingSoon);
  },
  
  // Get coming soon forms
  getComingSoonForms: () => {
    return Object.values(formsDatabase).filter(form => form.comingSoon);
  },
  
  // Get forms with priority options
  getFormsWithPriority: () => {
    return Object.values(formsDatabase).filter(form => form.priorityOptions);
  },
  
  // Get forms by department
  getFormsByDepartment: (department) => {
    return Object.values(formsDatabase).filter(form => 
      form.department === 'all' || form.department === department || department === 'all'
    );
  },
  
  // Get forms with workflow
  getFormsWithWorkflow: () => {
    return Object.values(formsDatabase).filter(form => form.workflow);
  },
  
  // Get forms requiring approval
  getFormsRequiringApproval: () => {
    return Object.values(formsDatabase).filter(
      form => form.settings && form.settings.requiresApproval
    );
  },
  
  // Get audit forms
  getAuditForms: () => {
    return Object.values(formsDatabase).filter(
      form => form.category.includes('Audit') || form.category.includes('Quality')
    );
  },
  
  // Get forms by metadata property
  getFormsByMetadata: (property, value) => {
    return Object.values(formsDatabase).filter(
      form => form.metadata && form.metadata[property] === value
    );
  }
};

// ==================== DEFAULT EXPORTS ====================
// For backward compatibility with existing code
export const formConfigurations = formsDatabase;

// Default export
export default {
  formsDatabase,
  fieldTypes,
  formValidators,
  formUtilities
};