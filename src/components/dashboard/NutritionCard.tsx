import { Card } from "@/components/ui/card";

interface NutritionCardProps {
  title: string;
  value: number;
  unit: string;
  color: string;
}

export const NutritionCard = ({ title, value, unit, color }: NutritionCardProps) => {
  return (
    <Card className="p-3 sm:p-6 transition-transform hover:scale-105">
      <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="mt-1 sm:mt-2 flex items-baseline gap-1 sm:gap-2">
        <span className={`text-lg sm:text-2xl font-bold ${color}`}>{value}</span>
        <span className="text-xs sm:text-sm text-muted-foreground">{unit}</span>
      </div>
    </Card>
  );
};