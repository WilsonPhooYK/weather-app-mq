import { forwardRef, memo, useEffect, useImperativeHandle, useState } from "react";
import imgSpinner from '@/assets/spinner.svg';

export type LoadingScreenHandle = {
  setIsLoading: (isLoading: boolean) => void;
};

export default memo(forwardRef(function LoadingScreen(_, ref) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useImperativeHandle<unknown, LoadingScreenHandle>(
    ref,
    () => {
      return { 
        setIsLoading: (isLoading: boolean) => setIsLoading(isLoading),
      };
    },
    [],
  );

  useEffect(() => {
    if (isLoading) {
      // Disable focus
      // document.body.style.overflow = "hidden";
      document.body.setAttribute("aria-hidden", "true");

      return () => {
        // Re-enable focus
        // document.body.style.overflow = "";
        document.body.removeAttribute("aria-hidden");
      };
    }
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <div
      className="bg-primary-dark/50 fixed inset-0 z-50 flex justify-center items-center"
      aria-live="assertive"
      role="status"
      tabIndex={-1} // Block focus on the overlay
    >
      <img src={imgSpinner} alt="Spinner" className="animate-spin w-10 h-10 object-contain" />
    </div>
  );
}));
