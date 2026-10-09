/**
 * Badge component for displaying tags or status
 * @param {{ children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'error' | 'outline' }} props 
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const variants = {
    default: "bg-blue-100 text-blue-800",
    primary: "bg-blue-600 text-white",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    outline: "bg-transparent border border-gray-300 text-gray-600"
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
