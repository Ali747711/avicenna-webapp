const SunIcon = ({ className = "w-8 h-8", color = "currentColor" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer rings */}
      <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="3" fill="none" opacity="0.3" />
      <circle cx="50" cy="50" r="37" stroke={color} strokeWidth="3" fill="none" opacity="0.5" />
      <circle cx="50" cy="50" r="29" stroke={color} strokeWidth="3" fill="none" opacity="0.7" />
      <circle cx="50" cy="50" r="21" stroke={color} strokeWidth="3" fill="none" opacity="0.9" />
      
      {/* Center solid circle */}
      <circle cx="50" cy="50" r="13" fill={color} />
    </svg>
  );
};

export default SunIcon; 