import React from 'react';
import Form01 from './pages/DocumentHeader/Form/Form01';
import Form02 from './pages/DocumentHeader/Form/Form02';
import Form03 from './pages/DocumentHeader/Form/Form03';
import Form04 from './pages/DocumentHeader/Form/Form04';
import Form05 from './pages/DocumentHeader/Form/Form05';
import Form06 from './pages/DocumentHeader/Form/Form06';
import Form07 from './pages/DocumentHeader/Form/Form07';
import Form08 from './pages/DocumentHeader/Form/Form08'; 
import Form09 from './pages/DocumentHeader/Form/Form09';
import Form10 from './pages/DocumentHeader/Form/Form10'; 
import Form11 from './pages/DocumentHeader/Form/Form11'; 
import Form12 from './pages/DocumentHeader/Form/Form12';
import Form14 from './pages/DocumentHeader/Form/Form14';
import Form15 from './pages/DocumentHeader/Form/Form15';  
import Form16 from './pages/DocumentHeader/Form/Form16';
import Form17 from './pages/DocumentHeader/Form/Form17';
import Form18 from './pages/DocumentHeader/Form/Form18';
import Form19 from './pages/DocumentHeader/Form/Form19';
import Form20 from './pages/DocumentHeader/Form/Form20';
import { formConfigurations } from './form-config';

// Form components mapping
export const formComponents = {
  'form-1': Form01,
  'form-2': Form02,
  'form-3': Form03,
  'form-4': Form04,
  'form-5': Form05,
  'form-6': Form06,
  'form-7': Form07,
  'form-8': Form08,
  'form-9': Form09, 
  'form-10': Form10,
  'form-11': Form11,
  'form-12': Form12,
  'form-14': Form14,
  'form-15': Form15,
  'form-16': Form16,
  'form-17': Form17,
  'form-18': Form18,
  'form-19': Form19,
  'form-20': Form20,
};

// Category group configuration
export const categoryGroups = [
  { id: 'general', name: 'General Forms', icon: '📝', description: 'General purpose forms for all departments including audit reports' },
  { id: 'hr', name: 'HR Forms', icon: '👥', description: 'Human resources and personnel forms' },
  { id: 'security', name: 'Security Forms', icon: '🔒', description: 'Security and compliance forms' },
  { id: 'qa', name: 'QA Forms', icon: '✅', description: 'Quality assurance and testing forms' },
  { id: 'ai', name: 'AI Forms', icon: '🤖', description: 'Artificial intelligence and machine learning forms' },
  { id: 'finance', name: 'Finance Forms', icon: '💰', description: 'Financial and budget approval forms' }
];

// Generate forms from configuration
export const generateForms = (currentUser, handleBackFromCustomComponent, BACKEND_URL) => {
  const forms = [];
  
  // Generate forms from configurations
  Object.entries(formConfigurations).forEach(([formId, config]) => {
    const formComponent = formComponents[formId];
    
    forms.push({
      id: formId,
      name: config.name,
      description: config.description,
      category: config.category,
      categoryGroup: config.categoryGroup || 'general',
      icon: config.icon,
      priorityOptions: config.priorityOptions !== false,
      department: config.department || 'all',
      comingSoon: config.comingSoon || false,
      fields: config.fields || [],
      config: {
        ...config,
        formId: formId,
        user: currentUser,
        onBack: handleBackFromCustomComponent,
        backendUrl: BACKEND_URL
      },
      component: formComponent
    });
  });

  // Add Form20 if not already in configurations
  const form20Exists = forms.some(form => form.id === 'form-20');
  if (!form20Exists && formComponents['form-20']) {
    forms.push({
      id: 'form-20',
      name: 'Root Cause Analysis Form',
      description: 'Perform 5 Whys analysis for non-conformities and issues',
      category: 'Quality Assurance',
      categoryGroup: 'qa',
      icon: '🔍',
      priorityOptions: true,
      department: 'QA',
      comingSoon: false,
      fields: [],
      config: {
        formId: 'form-20',
        name: 'Root Cause Analysis Form',
        description: 'Perform 5 Whys analysis for non-conformities and issues',
        user: currentUser,
        onBack: handleBackFromCustomComponent,
        backendUrl: BACKEND_URL
      },
      component: formComponents['form-20']
    });
  }

  // Add forms 14, 15, 16, 17 that have components but might not be in configurations
  if (formComponents['form-14'] && !forms.some(form => form.id === 'form-14')) {
    forms.push({
      id: 'form-14',
      name: 'Form 14 - Service Request Form',
      description: 'Service request and delivery tracking form',
      category: 'General',
      categoryGroup: 'general',
      icon: '🛠️',
      priorityOptions: true,
      department: 'all',
      comingSoon: false,
      fields: [],
      config: {
        formId: 'form-14',
        name: 'Form 14 - Service Request Form',
        description: 'Service request and delivery tracking form',
        user: currentUser,
        onBack: handleBackFromCustomComponent,
        backendUrl: BACKEND_URL
      },
      component: formComponents['form-14']
    });
  }

  if (formComponents['form-15'] && !forms.some(form => form.id === 'form-15')) {
    forms.push({
      id: 'form-15',
      name: 'Form 15 - Corrective Action Plan',
      description: 'Track and manage corrective actions for non-conformities',
      category: 'Quality Assurance',
      categoryGroup: 'qa',
      icon: '⚡',
      priorityOptions: true,
      department: 'QA',
      comingSoon: false,
      fields: [],
      config: {
        formId: 'form-15',
        name: 'Form 15 - Corrective Action Plan',
        description: 'Track and manage corrective actions for non-conformities',
        user: currentUser,
        onBack: handleBackFromCustomComponent,
        backendUrl: BACKEND_URL
      },
      component: formComponents['form-15']
    });
  }

  if (formComponents['form-16'] && !forms.some(form => form.id === 'form-16')) {
    forms.push({
      id: 'form-16',
      name: 'Form 16 - Internal Audit Program',
      description: 'Annual internal audit schedule and program',
      category: 'Quality Assurance',
      categoryGroup: 'qa',
      icon: '📅',
      priorityOptions: true,
      department: 'QA',
      comingSoon: false,
      fields: [],
      config: {
        formId: 'form-16',
        name: 'Form 16 - Internal Audit Program',
        description: 'Annual internal audit schedule and program',
        user: currentUser,
        onBack: handleBackFromCustomComponent,
        backendUrl: BACKEND_URL
      },
      component: formComponents['form-16']
    });
  }

  if (formComponents['form-17'] && !forms.some(form => form.id === 'form-17')) {
    forms.push({
      id: 'form-17',
      name: 'Form 17 - Internal Quality Audit Plan',
      description: 'Plan and schedule internal quality audits',
      category: 'Quality Assurance',
      categoryGroup: 'qa',
      icon: '📋',
      priorityOptions: true,
      department: 'QA',
      comingSoon: false,
      fields: [],
      config: {
        formId: 'form-17',
        name: 'Form 17 - Internal Quality Audit Plan',
        description: 'Plan and schedule internal quality audits',
        user: currentUser,
        onBack: handleBackFromCustomComponent,
        backendUrl: BACKEND_URL
      },
      component: formComponents['form-17']
    });
  }

  // Add more forms to General category (starting from Form 8)
  for (let i = 8; i <= 9; i++) {
    forms.push({
      id: `form-${i}`,
      name: `Form ${i}`,
      description: `Form ${i} - General purpose form with standard workflow`,
      category: 'General',
      categoryGroup: 'general',
      icon: '📄',
      priorityOptions: i % 2 === 0,
      department: 'all',
      comingSoon: true,
      fields: [],
      config: {
        id: `form-${i}`,
        name: `Form ${i}`,
        description: `Form ${i} description`
      },
      component: null
    });
  }
  
  // QA Forms (all coming soon - starting from QA Form 1, but skip if we already have Form20)
  for (let i = 1; i <= 4; i++) {
    if (i === 1) continue; // Skip QA Form 1 since we have Form20 as the main QA form
    
    forms.push({
      id: `qa-form-${i}`,
      name: `QA Form ${i}`,
      description: `QA Form ${i} - Quality assurance and testing form`,
      category: 'QA',
      categoryGroup: 'qa',
      icon: '✅',
      priorityOptions: true,
      department: 'QA',
      comingSoon: true,
      fields: [],
      config: {
        id: `qa-form-${i}`,
        name: `QA Form ${i}`,
        description: `QA Form ${i} description`
      },
      component: null
    });
  }
  
  // More HR Forms (coming soon)
  for (let i = 2; i <= 4; i++) {
    forms.push({
      id: `hr-form-${i}`,
      name: `HR Form ${i}`,
      description: `HR Form ${i} - Human resources and personnel management`,
      category: 'HR',
      categoryGroup: 'hr',
      icon: '👥',
      priorityOptions: i % 2 === 0,
      department: 'HR',
      comingSoon: true,
      fields: [],
      config: {
        id: `hr-form-${i}`,
        name: `HR Form ${i}`,
        description: `HR Form ${i} description`
      },
      component: null
    });
  }
  
  // AI Forms (all coming soon)
  for (let i = 1; i <= 4; i++) {
    forms.push({
      id: `ai-form-${i}`,
      name: `AI Form ${i}`,
      description: `AI Form ${i} - Artificial intelligence and machine learning requests`,
      category: 'AI',
      categoryGroup: 'ai',
      icon: '🤖',
      priorityOptions: true,
      department: 'AI',
      comingSoon: true,
      fields: [],
      config: {
        id: `ai-form-${i}`,
        name: `AI Form ${i}`,
        description: `AI Form ${i} description`
      },
      component: null
    });
  }
  
  // Finance Forms (all coming soon)
  for (let i = 1; i <= 4; i++) {
    forms.push({
      id: `finance-form-${i}`,
      name: `Finance Form ${i}`,
      description: `Finance Form ${i} - Financial requests and budget approvals`,
      category: 'Finance',
      categoryGroup: 'finance',
      icon: '💰',
      priorityOptions: i % 2 === 0,
      department: 'Finance',
      comingSoon: true,
      fields: [],
      config: {
        id: `finance-form-${i}`,
        name: `Finance Form ${i}`,
        description: `Finance Form ${i} description`
      },
      component: null
    });
  }
  
  // Security Forms (coming soon)
  for (let i = 1; i <= 3; i++) {
    forms.push({
      id: `security-form-${i}`,
      name: `Security Form ${i}`,
      description: `Security Form ${i} - Security and compliance forms`,
      category: 'Security',
      categoryGroup: 'security',
      icon: '🔒',
      priorityOptions: true,
      department: 'Security',
      comingSoon: true,
      fields: [],
      config: {
        id: `security-form-${i}`,
        name: `Security Form ${i}`,
        description: `Security Form ${i} description`
      },
      component: null
    });
  }
  
  return forms;
};

// Filter forms based on category group and search
export const filterForms = (forms, selectedCategoryGroup, searchTerm) => {
  if (!selectedCategoryGroup) return [];
  
  return forms.filter(form => {
    const matchesCategoryGroup = form.categoryGroup === selectedCategoryGroup;
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategoryGroup && matchesSearch;
  });
};

// Sort forms by favorites
export const sortFormsByFavorites = (forms, favoriteForms) => {
  return [...forms].sort((a, b) => {
    const aIsFavorite = favoriteForms.includes(a.id);
    const bIsFavorite = favoriteForms.includes(b.id);
    return aIsFavorite === bIsFavorite ? 0 : aIsFavorite ? -1 : 1;
  });
};

// Handle form selection
export const handleFormSelect = (formConfig, setSelectedComponent, currentUser, handleBackFromCustomComponent, BACKEND_URL, showTempNotification) => {
  if (formConfig.comingSoon) {
    showTempNotification(`${formConfig.name} is coming soon!`, 'info');
    return;
  }
  
  // Check if this form has a custom component
  if (formConfig.component) {
    // Add CSS to hide sidebar and header when form is open
    document.body.classList.add('form-full-page-mode');
    
    setSelectedComponent({
      component: formConfig.component,
      config: {
        ...formConfig.config,
        formId: formConfig.id,
        user: currentUser,
        onBack: handleBackFromCustomComponent,
        backendUrl: BACKEND_URL
      },
      user: currentUser
    });
  } else {
    showTempNotification(`${formConfig.name} is not available yet!`, 'error');
  }
};

// Handle edit request
export const handleEditRequest = (request, availableForms, setSelectedComponent, currentUser, handleBackFromCustomComponent, BACKEND_URL, setShowRequestModal, showTempNotification) => {
  const formConfig = availableForms.find(f => f.id === request.formId);
  
  if (formConfig) {
    if (formConfig.component) {
      // Add CSS to hide sidebar and header when form is open
      document.body.classList.add('form-full-page-mode');
      
      setSelectedComponent({
        component: formConfig.component,
        config: {
          ...formConfig.config,
          editMode: true,
          existingData: request.formData,
          requestId: request._id,
          formId: request.formId,
          user: currentUser,
          onBack: handleBackFromCustomComponent,
          backendUrl: BACKEND_URL
        },
        user: currentUser
      });
    } else {
      showTempNotification(`${formConfig.name} is coming soon!`, 'info');
    }
    setShowRequestModal(false);
  }
};

// Handle duplicate request
export const handleDuplicateRequest = (request, availableForms, setSelectedComponent, currentUser, handleBackFromCustomComponent, BACKEND_URL, setShowRequestModal, showTempNotification) => {
  const formConfig = availableForms.find(f => f.id === request.formId);
  
  if (formConfig) {
    if (formConfig.component) {
      // Add CSS to hide sidebar and header when form is open
      document.body.classList.add('form-full-page-mode');
      
      setSelectedComponent({
        component: formConfig.component,
        config: {
          ...formConfig.config,
          duplicateData: request.formData,
          formId: request.formId,
          user: currentUser,
          onBack: handleBackFromCustomComponent,
          backendUrl: BACKEND_URL
        },
        user: currentUser
      });
    } else {
      showTempNotification(`${formConfig.name} is coming soon!`, 'info');
    }
    setShowRequestModal(false);
  }
};

// Get form categories for filters
export const getFormCategories = (forms) => {
  const categories = [...new Set(forms.map(form => form.category))];
  return ['all', ...categories];
};

// Get most used forms
export const getMostUsedForms = (forms, requests) => {
  const formUsage = {};
  requests.forEach(request => {
    formUsage[request.formId] = (formUsage[request.formId] || 0) + 1;
  });
  
  return forms
    .map(form => ({
      ...form,
      usageCount: formUsage[form.id] || 0
    }))
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 5);
};

// Get form statistics from configuration
export const getFormStatistics = () => {
  const forms = Object.values(formConfigurations);
  const availableForms = forms.filter(f => !f.comingSoon);
  
  return {
    total: forms.length,
    available: availableForms.length,
    comingSoon: forms.filter(f => f.comingSoon).length,
    categories: {}
  };
};

// Initialize favorite forms from localStorage
export const initializeFavoriteForms = (currentUser, setFavoriteForms) => {
  const savedFavorites = localStorage.getItem(`favorites_${currentUser.employeeId}`);
  if (savedFavorites) {
    setFavoriteForms(JSON.parse(savedFavorites));
  }
};

// Save favorite forms to localStorage
export const saveFavoriteForms = (currentUser, favoriteForms) => {
  localStorage.setItem(`favorites_${currentUser.employeeId}`, JSON.stringify(favoriteForms));
};

// Toggle favorite form
export const toggleFavorite = (formId, favoriteForms, setFavoriteForms, showTempNotification, e) => {
  e?.stopPropagation();
  if (favoriteForms.includes(formId)) {
    setFavoriteForms(favoriteForms.filter(id => id !== formId));
    showTempNotification('Removed from favorites', 'info');
  } else {
    setFavoriteForms([...favoriteForms, formId]);
    showTempNotification('Added to favorites', 'info');
  }
};

// Get forms for quick access
export const getQuickAccessForms = (forms, favoriteForms, count = 4) => {
  return forms
    .filter(form => !form.comingSoon || favoriteForms.includes(form.id))
    .slice(0, count);
};

// Default export
export default {
  formComponents,
  categoryGroups,
  generateForms,
  filterForms,
  sortFormsByFavorites,
  handleFormSelect,
  handleEditRequest,
  handleDuplicateRequest,
  getFormCategories,
  getMostUsedForms,
  getFormStatistics,
  initializeFavoriteForms,
  saveFavoriteForms,
  toggleFavorite,
  getQuickAccessForms
};