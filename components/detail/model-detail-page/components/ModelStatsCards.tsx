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
    <div className="
      grid auto-rows-fr grid-cols-2 gap-2
      md:w-80 md:max-w-sm md:gap-4
    ">
      <Card className="flex flex-col py-2">
        <CardHeader className="px-3 pt-2 pb-0">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Context
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 items-center px-3 pb-2">
          <p className="text-base font-bold wrap-break-word">
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
      <Card className="flex flex-col py-2">
        <CardHeader className="px-3 pt-2 pb-0">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Cost (Input)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 items-center px-3 pb-2">
          <p className="text-base font-bold wrap-break-word">
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
      <Card className="flex flex-col py-2">
        <CardHeader className="px-3 pt-2 pb-0">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Cost (Output)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 items-center px-3 pb-2">
          <p className="text-base font-bold wrap-break-word">
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
      <Card className="flex flex-col py-2">
        <CardHeader className="px-3 pt-2 pb-0">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Max completion tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 items-center px-3 pb-2">
          <p className="text-base font-bold wrap-break-word">
            {maxCompletionTokens != null
              ? maxCompletionTokens.toLocaleString()
              : "–"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
