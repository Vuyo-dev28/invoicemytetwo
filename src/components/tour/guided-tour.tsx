'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft, SkipForward } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export type TourStep = {
  id: string;
  target: string; // CSS selector or data attribute
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  route?: string; // Route to navigate to before showing this step
  action?: () => void; // Action to perform before showing step
};

type GuidedTourProps = {
  steps: TourStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  storageKey?: string;
};

export function GuidedTour({ 
  steps, 
  onComplete, 
  onSkip,
  storageKey = 'tour_completed'
}: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);
  const router = useRouter();
  const pathname = usePathname();

  const completeTour = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    if (onComplete) {
      onComplete();
    }
  };

  const skipTour = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    if (onSkip) {
      onSkip();
    }
  };

  const showStep = (stepIndex: number) => {
    if (stepIndex >= steps.length) {
      completeTour();
      return;
    }

    const step = steps[stepIndex];
    
    // Execute action if provided
    if (step.action) {
      step.action();
    }

    // Navigate to route if needed
    if (step.route && pathname !== step.route) {
      router.push(step.route);
      setTimeout(() => {
        findAndHighlightElement(step, stepIndex);
      }, 500);
    } else {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        findAndHighlightElement(step, stepIndex);
      }, 100);
    }
  };

  const startTour = () => {
    if (steps.length === 0) {
      console.warn('Tour has no steps');
      return;
    }
    
    const firstStep = steps[0];
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : pathname;
    
    // Navigate to first step's route if needed
    if (firstStep.route && currentPath !== firstStep.route) {
      router.push(firstStep.route);
      setTimeout(() => {
        showStep(0);
      }, 1000);
    } else {
      // Wait a bit longer to ensure DOM is ready
      setTimeout(() => {
        showStep(0);
      }, 500);
    }
  };

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    
    // Check if tour should be shown
    const tourCompleted = localStorage.getItem(storageKey);
    
    if (tourCompleted === 'true' || hasStartedRef.current) {
      return;
    }

    // Wait for DOM to be ready - use requestIdleCallback if available for better performance
    const startTourDelayed = () => {
      if (!hasStartedRef.current && steps.length > 0) {
        hasStartedRef.current = true;
        startTour();
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        setTimeout(startTourDelayed, 1000);
      }, { timeout: 2000 });
    } else {
      setTimeout(startTourDelayed, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const findAndHighlightElement = (step: TourStep, stepIndex: number) => {
    // Try data-tour attribute first, then CSS selector
    let element: HTMLElement | null = null;
    
    // If target looks like a data-tour attribute selector, extract the value
    if (step.target.startsWith('[data-tour="') && step.target.endsWith('"]')) {
      // Extract the value from [data-tour="value"]
      const value = step.target.slice(12, -2); // Remove '[data-tour="' and '"]'
      element = document.querySelector(`[data-tour="${value}"]`) as HTMLElement;
    } else if (step.target.startsWith('[') && step.target.endsWith(']')) {
      // Other attribute selector - use as is
      element = document.querySelector(step.target) as HTMLElement;
    } else {
      // CSS selector or plain data-tour value
      // If it's just a plain string, treat it as a data-tour value
      if (!step.target.includes(' ') && !step.target.startsWith('.') && !step.target.startsWith('#')) {
        element = document.querySelector(`[data-tour="${step.target}"]`) as HTMLElement;
      } else {
        // CSS selector
        element = document.querySelector(step.target) as HTMLElement;
      }
    }

    if (!element) {
      // If element not found, try again after a delay, then skip if still not found
      console.warn(`Tour step target not found: ${step.target}. Retrying...`);
      setTimeout(() => {
        const retryElement = document.querySelector(step.target.includes('[') ? step.target : `[data-tour="${step.target}"]`) as HTMLElement;
        if (retryElement) {
          findAndHighlightElement(step, stepIndex);
        } else {
          console.warn(`Tour step target still not found after retry: ${step.target}`);
          if (stepIndex < steps.length - 1) {
            showStep(stepIndex + 1);
          } else {
            completeTour();
          }
        }
      }, 1000);
      return;
    }

    setTargetElement(element);
    setCurrentStep(stepIndex);
    
    // Calculate position
    const rect = element.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    
    setPosition({
      top: rect.top + scrollY,
      left: rect.left + scrollX,
      width: rect.width,
      height: rect.height
    });

    // Scroll element into view
    try {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    } catch (e) {
      // If scrollIntoView fails, just continue
      console.warn('ScrollIntoView failed:', e);
    }
    
    // Wait for scroll to complete and ensure element is still in DOM
    setTimeout(() => {
      if (element && document.contains(element)) {
        setIsVisible(true);
      } else {
        console.warn('Element no longer in DOM, skipping step');
        if (stepIndex < steps.length - 1) {
          showStep(stepIndex + 1);
        } else {
          completeTour();
        }
      }
    }, 600);
  };

  const nextStep = () => {
    setIsVisible(false);
    setTimeout(() => {
      showStep(currentStep + 1);
    }, 300);
  };

  const prevStep = () => {
    if (currentStep === 0) return;
    setIsVisible(false);
    setTimeout(() => {
      showStep(currentStep - 1);
    }, 300);
  };

  if (!isVisible || currentStep >= steps.length) {
    return null;
  }

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  // Calculate tooltip position
  const tooltipPosition = step.position || 'bottom';
  let tooltipStyle: React.CSSProperties = {};
  
  switch (tooltipPosition) {
    case 'top':
      tooltipStyle = {
        top: position.top - 10,
        left: position.left + position.width / 2,
        transform: 'translate(-50%, -100%)'
      };
      break;
    case 'bottom':
      tooltipStyle = {
        top: position.top + position.height + 10,
        left: position.left + position.width / 2,
        transform: 'translate(-50%, 0)'
      };
      break;
    case 'left':
      tooltipStyle = {
        top: position.top + position.height / 2,
        left: position.left - 10,
        transform: 'translate(-100%, -50%)'
      };
      break;
    case 'right':
      tooltipStyle = {
        top: position.top + position.height / 2,
        left: position.left + position.width + 10,
        transform: 'translate(0, -50%)'
      };
      break;
    case 'center':
      tooltipStyle = {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
      break;
  }

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] bg-black/50 transition-opacity"
        onClick={skipTour}
      />
      
      {/* Highlight */}
      {targetElement && tooltipPosition !== 'center' && (
        <div
          className="fixed z-[9999] pointer-events-none border-2 border-primary rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] transition-all"
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
            height: position.height,
          }}
        />
      )}

      {/* Tooltip */}
      <Card
        className={cn(
          "fixed z-[10000] w-[90%] max-w-md shadow-2xl transition-all",
          tooltipPosition === 'center' && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        )}
        style={tooltipPosition !== 'center' ? tooltipStyle : undefined}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{step.title}</CardTitle>
              <CardDescription className="mt-2">{step.content}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={skipTour}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
            <div className="flex items-center gap-2">
              {!isFirst && (
                <Button variant="outline" size="sm" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={skipTour}>
                <SkipForward className="h-4 w-4 mr-1" />
                Skip
              </Button>
              <Button size="sm" onClick={isLast ? completeTour : nextStep}>
                {isLast ? 'Finish' : 'Next'}
                {!isLast && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

