import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProviderStatsCardsProps {
  totalTestsSurvived: number;
  totalTestsFailed: number;
}

export const ProviderStatsCards = ({
  totalTestsSurvived,
  totalTestsFailed,
}: ProviderStatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 items-start gap-2 md:max-w-sm md:gap-4 md:w-80">
      <Card className="py-2">
        <CardHeader className="pb-0 px-3 pt-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Tests Survived
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-2">
          <p className="text-base font-bold">{totalTestsSurvived}</p>
        </CardContent>
      </Card>
      <Card className="py-2">
        <CardHeader className="pb-0 px-3 pt-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Tests Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-2">
          <p className="text-base font-bold">{totalTestsFailed}</p>
        </CardContent>
      </Card>
    </div>
  );
};
