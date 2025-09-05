// src/components/CookieConsent/CookieConsent.tsx
'use client';

import * as React from 'react';
import { useCookieConsent } from '../../hooks/useCookieConsent';
import { CookieConsentProps } from '../../types';

const { useState } = React;

export function CookieConsent({
  title = 'Cookie Settings',
  description = 'We use cookies to improve your experience on our website.',
  acceptLabel = 'Accept All',
  rejectLabel = 'Reject All',
  customizeLabel = 'Customize',
  privacyPolicyUrl = '/privacy-policy',
  className = '',
  position = 'bottom'
}: CookieConsentProps) {
  const { 
    acceptAll, 
    rejectAll,
    isConsentGiven 
  } = useCookieConsent();
  
  const [showCustomize, setShowCustomize] = useState(false);

  // Don't show if consent already given
  if (isConsentGiven) {
    return null;
  }

  // Position styles
  const positionClasses = {
    bottom: 'fixed bottom-0 left-0 right-0',
    top: 'fixed top-0 left-0 right-0',
    center: 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  return (
    <div className={`${positionClasses[position]} z-50 p-4 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto border border-gray-200">
        {/* Main Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-600">
              {description}{' '}
              {privacyPolicyUrl && (
                <a 
                  href={privacyPolicyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </a>
              )}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={rejectAll}
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              {rejectLabel}
            </button>
            
            <button
              onClick={() => setShowCustomize(!showCustomize)}
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              {customizeLabel}
            </button>
            
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {acceptLabel}
            </button>
          </div>
        </div>

        {/* Customize Panel (TODO: Implement later) */}
        {showCustomize && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Customize panel will be implemented in next version
            </p>
          </div>
        )}
      </div>
    </div>
  );
}