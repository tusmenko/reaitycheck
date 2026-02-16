import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ModelStatsCardsProps {
  contextWindow: number | null | undefined;
  inputCostPer1MTokens: number | null | undefined;
  outputCostPer1MTokens: number | null | undefined;
  maxCompletionTokens: number | null | undefined;
}

export const ModelStatsCards = ({
  contextWindow,
  inputCostPer1MTokens,
  outputCostPer1MTokens,
  maxCompletionTokens,
}: ModelStatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 auto-rows-fr gap-2 md:max-w-sm md:gap-4 md:w-80">
      <Card className="py-2 flex flex-col">
        <CardHeader className="pb-0 px-3 pt-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Context
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-2 flex-1 flex items-center">
          <p className="text-base font-bold break-words">
            {contextWindow != null ? (
              <>
                {contextWindow.toLocaleString()}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  tokens
                </span>
              </>
            ) : (
              "–"
            )}
          </p>
        </CardContent>
      </Card>
      <Card className="py-2 flex flex-col">
        <CardHeader className="pb-0 px-3 pt-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Cost (Input)
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-2 flex-1 flex items-center">
          <p className="text-base font-bold break-words">
            {inputCostPer1MTokens != null ? (
              <>
                ${inputCostPer1MTokens.toFixed(2)}
                <span className="text-xs font-normal text-muted-foreground">
                  {" "}
                  /1M tokens
                </span>
              </>
            ) : (
              "–"
            )}
          </p>
        </CardContent>
      </Card>
      <Card className="py-2 flex flex-col">
        <CardHeader className="pb-0 px-3 pt-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Cost (Output)
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-2 flex-1 flex items-center">
          <p className="text-base font-bold break-words">
            {outputCostPer1MTokens != null ? (
              <>
                ${outputCostPer1MTokens.toFixed(2)}
                <span className="text-xs font-normal text-muted-foreground">
                  {" "}
                  /1M tokens
                </span>
              </>
            ) : (
              "–"
            )}
          </p>
        </CardContent>
      </Card>
      <Card className="py-2 flex flex-col">
        <CardHeader className="pb-0 px-3 pt-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Max completion tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-2 flex-1 flex items-center">
          <p className="text-base font-bold break-words">
            {maxCompletionTokens != null
              ? maxCompletionTokens.toLocaleString()
              : "–"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
