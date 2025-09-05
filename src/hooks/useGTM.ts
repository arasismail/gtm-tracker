// src/hooks/useGTM.ts
import { useCallback } from 'react';
import { useGTMContext } from '../providers/GTMProvider';
import { GTM_EVENTS } from '../constants';
import type { UseGTMReturn } from '../types';

export function useGTM(): UseGTMReturn {
  const { 
    pushEvent: pushEventCore, 
    pushPageView: pushPageViewCore, 
    updateConsent: updateConsentCore 
  } = useGTMContext();

  const trackButtonClick = useCallback((label: string, value?: any) => {
    pushEventCore(GTM_EVENTS.BUTTON_CLICK, {
      label,
      value
    });
  }, [pushEventCore]);

  const trackFormSubmit = useCallback((formName: string, formData?: Record<string, any>) => {
    pushEventCore(GTM_EVENTS.FORM_SUBMIT, {
      form_name: formName,
      form_data: formData
    });
  }, [pushEventCore]);

  const trackFileDownload = useCallback((fileName: string, fileType: string) => {
    pushEventCore(GTM_EVENTS.FILE_DOWNLOAD, {
      file_name: fileName,
      file_type: fileType
    });
  }, [pushEventCore]);

  return {
    pushEvent: pushEventCore,
    pushPageView: pushPageViewCore,
    updateConsent: updateConsentCore, // Artık Record<string, any> tipinde
    trackButtonClick,
    trackFormSubmit,
    trackFileDownload
  };
}