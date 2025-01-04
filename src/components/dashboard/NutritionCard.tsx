import { Card } from "@/components/ui/card";

interface NutritionCardProps {
  title: string;
  value: number;
  unit: string;
  color: string;
}

export const NutritionCard = ({ title, value, unit, color }: NutritionCardProps) => {
  return (
    <Card className="p-6 transition-transform hover:scale-105">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
    </Card>
  );
};