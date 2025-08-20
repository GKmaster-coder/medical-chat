import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InteractiveChat = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [userResponses, setUserResponses] = useState({});
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

  // Typing effect
  useEffect(() => {
    if (currentStep >= chatSteps.length) return;
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 1200);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Handle responses
  const handleResponse = (value, stepType) => {
    if (stepType === 'welcome' && value === 'start') {
      setCurrentStep(1);
      return;
    }

    if (stepType === 'question') {
      setUserResponses({ ...userResponses, [currentStep]: value });

      if (currentStep === 1 && value === 'no') setCurrentStep(6); // failure
      else if (currentStep === 4 && value === 'yes') setCurrentStep(6); // failure
      else if (currentStep < 4) setCurrentStep(currentStep + 1);
      else setCurrentStep(5); // success
    }
  };

  // Form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserResponses({ ...userResponses, [name]: value });
    if (inputError) setInputError('');
  };

  // Submit form
  const handleFormSubmit = () => {
    const currentFields = chatSteps[5].fields;
    const emptyField = currentFields.find(
      (field) => field.required && !userResponses[field.name]
    );
    if (emptyField) {
      setInputError(`Please fill in the ${emptyField.label} field`);
      return;
    }
    alert('Thank you for your information! We will be in touch soon.');
  };

  // Controls UI
  const renderControls = () => {
    const step = chatSteps[currentStep];
    if (!step || isTyping) return null;

    if (step.type === 'welcome' || step.type === 'question') {
      return (
        <div className="flex flex-wrap gap-3 mt-4">
          {step.controls.map((control, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
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
        <div className="mt-6 space-y-4">
          {step.fields.map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type}
                name={field.name}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={userResponses[field.name] || ''}
                onChange={handleInputChange}
                required={field.required}
              />
            </div>
          ))}
          {inputError && <p className="text-red-500 text-sm">{inputError}</p>}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
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
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 mt-4"
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
    <div className="w-full max-w-lg mx-auto p-2 px-4 bg-white rounded-2xl shadow-xl flex flex-col h-full">
      {/* Progress */}
      {currentStep > 0 && currentStep <= 4 && (
        <>
          <div className="text-sm text-gray-500 mb-2">Step {currentStep} of 4</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto pr-1 mb-4 space-y-4">
        <AnimatePresence>
          {currentStep < chatSteps.length && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-start"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full mr-3">B</div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow max-w-[80%]">
                {isTyping ? (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400" />
                  </div>
                ) : (
                  <p>{chatSteps[currentStep].message}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {Object.entries(userResponses).map(([step, response]) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-end"
          >
            <div className="bg-blue-100 px-4 py-3 rounded-2xl rounded-tr-none shadow max-w-[80%]">
              {response}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div>{renderControls()}</div>
    </div>
  );
};

export default InteractiveChat;
