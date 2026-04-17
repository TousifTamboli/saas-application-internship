import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  colorClass: string; // e.g. 'primary', 'tertiary'
  isPositive?: boolean;
}

export default function StatCard({ title, value, change, icon, colorClass, isPositive = true }: StatCardProps) {
  const isGreen = colorClass === 'primary';

  return (
    <div className={cn(
      'bg-surface-container p-6 rounded-xl transition-all hover:scale-[1.01] cursor-default',
      isGreen ? 'border-l-4 border-primary/20 hover:border-primary' : 'border-l-4 border-tertiary/20 hover:border-tertiary'
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          'p-2 rounded-lg',
          isGreen ? 'bg-primary/10' : 'bg-tertiary/10'
        )}>
          <div className={isGreen ? 'text-primary' : 'text-tertiary'}>
            {icon}
          </div>
        </div>
        <span className={cn(
          'text-xs font-bold flex items-center gap-0.5',
          isPositive ? (isGreen ? 'text-primary' : 'text-primary') : 'text-tertiary'
        )}>
          {change}
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        </span>
      </div>
      <h3 className="text-on-surface-variant text-[10px] font-semibold uppercase tracking-wider mb-1">
        {title}
      </h3>
      <p className="font-headline text-3xl font-bold text-on-surface">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
}
