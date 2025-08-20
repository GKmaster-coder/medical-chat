import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InteractiveChat = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [userResponses, setUserResponses] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  // Chat flow configuration
  const chatSteps = [
    {
      type: 'welcome',
      message: "Welcome! We'll help determine if you qualify for our program. This will only take a few moments. All information is confidential.",
      controls: [{ type: 'button', label: 'Start Assessment', value: 'start' }]
    },
    {
      type: 'question',
      message: "Were you exposed to the substance between 1990-2010?",
      controls: [
        { type: 'button', label: 'Yes', value: 'yes' },
        { type: 'button', label: 'No', value: 'no' }
      ]
    },
    {
      type: 'question',
      message: "When did the exposure occur?",
      controls: [
        { type: 'button', label: 'Before 2005', value: 'pre-2005' },
        { type: 'button', label: '2005-2015', value: '2005-2015' },
        { type: 'button', label: 'After 2015', value: 'post-2015' }
      ]
    },
    {
      type: 'question',
      message: "Have you received a medical diagnosis related to this exposure?",
      controls: [
        { type: 'button', label: 'Yes, I have a diagnosis', value: 'diagnosed' },
        { type: 'button', label: 'No official diagnosis', value: 'undiagnosed' },
        { type: 'button', label: 'I suspect but not confirmed', value: 'suspected' }
      ]
    },
    {
      type: 'question',
      message: "Are you currently working with a lawyer?",
      controls: [
        { type: 'button', label: 'Yes', value: 'yes' },
        { type: 'button', label: 'No', value: 'no' }
      ]
    },
    {
      type: 'success',
      message: "Based on your answers, you may qualify for compensation! Please provide your contact information and we'll follow up with more details.",
      fields: [
        { type: 'text', name: 'name', label: 'Full Name', required: true },
        { type: 'email', name: 'email', label: 'Email Address', required: true },
        { type: 'tel', name: 'phone', label: 'Phone Number', required: true }
      ]
    },
    {
      type: 'failure',
      message: "Based on your answers, it doesn't appear you qualify at this time. If your situation changes, please check back with us. Thank you for your time."
    }
  ];

  // Simulate typing animation
  useEffect(() => {
    if (currentStep >= chatSteps.length) return;
    
    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [currentStep]);

  // Handle user response
  const handleResponse = (value, stepType) => {
    if (stepType === 'welcome' && value === 'start') {
      setCurrentStep(1);
      return;
    }

    // For questions, store response and move to next step
    if (stepType === 'question') {
      setUserResponses({...userResponses, [currentStep]: value});
      
      // Simple qualification logic
      if (currentStep === 1 && value === 'no') {
        setCurrentStep(6); // Jump to failure
      } else if (currentStep === 4 && value === 'yes') {
        setCurrentStep(6); // Jump to failure if already have lawyer
      } else if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep(5); // Success step
      }
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue(value);
    
    // Clear previous errors
    if (inputError) setInputError('');
    
    // Validation for specific field types
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setInputError('Please enter a valid email address');
      }
    } else if (name === 'phone') {
      const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
      if (!phoneRegex.test(value)) {
        setInputError('Please enter a valid phone number');
      }
    }
  };

  // Handle form submission
  const handleFormSubmit = () => {
    // Validate all required fields
    const currentFields = chatSteps[5].fields;
    const emptyField = currentFields.find(field => 
      field.required && !userResponses[field.name]
    );
    
    if (emptyField) {
      setInputError(`Please fill in the ${emptyField.label} field`);
      return;
    }
    
    if (inputError) return;
    
    // In a real application, you would submit the data to a server here
    alert('Thank you for your information! We will be in touch soon.');
    // Reset the form or redirect
  };

  // Render appropriate controls based on step type
  const renderControls = () => {
    const step = chatSteps[currentStep];
    
    if (!step || isTyping) return null;
    
    if (step.type === 'welcome' || step.type === 'question') {
      return (
        <div className="flex flex-wrap gap-2 mt-4">
          {step.controls.map((control, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              onClick={() => handleResponse(control.value, step.type)}
            >
              {control.label}
            </motion.button>
          ))}
        </div>
      );
    }
    
    if (step.type === 'success') {
      return (
        <div className="mt-4 space-y-4">
          {step.fields.map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type}
                name={field.name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={userResponses[field.name] || ''}
                onChange={(e) => {
                  setUserResponses({...userResponses, [field.name]: e.target.value});
                  handleInputChange(e);
                }}
                required={field.required}
              />
            </div>
          ))}
          
          {inputError && (
            <div className="text-red-500 text-sm mt-2">{inputError}</div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors mt-4"
            onClick={handleFormSubmit}
          >
            Submit Information
          </motion.button>
        </div>
      );
    }
    
    if (step.type === 'failure') {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors mt-4"
          onClick={() => {
            setCurrentStep(0);
            setUserResponses({});
          }}
        >
          Start Over
        </motion.button>
      );
    }
    
    return null;
  };

  return (
    <div className="max-w-md mx-auto p-4  bg-white rounded-xl shadow-lg">
      {/* Progress indicator */}
      {currentStep > 0 && currentStep <= 4 && (
        <div className="text-sm text-gray-500 mb-2">
          Step {currentStep} of 4
        </div>
      )}
      
      {/* Progress bar */}
      {currentStep > 0 && currentStep <= 4 && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
          <motion.div 
            className="bg-blue-600 h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / 4) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
      
      {/* Chat area */}
      <div className="mb-6">
        <AnimatePresence>
          {currentStep < chatSteps.length && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex mb-4"
            >
              <div className="flex-shrink-0 mr-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  B
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                {isTyping ? (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                ) : (
                  <p>{chatSteps[currentStep].message}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* User responses */}
        {Object.entries(userResponses).map(([step, response]) => (
          <motion.div 
            key={step} 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-end mb-4"
          >
            <div className="bg-blue-100 p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
              {response}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Controls */}
      <div className="mt-4">
        {renderControls()}
      </div>
    </div>
  );
};

export default InteractiveChat;