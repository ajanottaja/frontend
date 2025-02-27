import colors from "tailwindcss/colors";

interface TooltipProps {
  children: React.ReactNode;
}

export const Tooltip = ({ children }: TooltipProps) => (
  <div className="bg-stone-900/95 backdrop-blur-sm text-gray-200 text-xs rounded-lg p-3 border border-stone-700">
    {children}
  </div>
);

export const tooltipTheme = {
  tooltip: {
    container: {
      background: colors.stone[800],
      color: colors.gray[300],
      opacity: 0.90,
      fontSize: 12,
      borderRadius: '8px',
      padding: '8px 12px',
    }
  }
}; 