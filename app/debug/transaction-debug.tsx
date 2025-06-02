import { cn } from "@/lib/utils";
import { useTransactionStore } from "@/stores/transactions";

export function TransactionDebug() {
  const transactions = useTransactionStore((state) => state.transactions);
  const index = useTransactionStore((state) => state.index);

  if (import.meta.env.DEV) {
    return (
      <div className="fixed mr-auto w-72 inset-x-4 inset-y-4 flex flex-col p-3 text-xs gap-1 h-fit bg-gray-100 rounded-xl">
        <div className="font-bold text-gray-500">transaction debug</div>
        <div className="inline-flex gap-1 items-center flex-wrap">
          tx buffer:
          <ul className="inline-flex gap-2 flex-wrap">
            {transactions.map((k, idx) => (
              <div
                className={cn(
                  "border border-gray-200 p-1 rounded inline-flex gap-1",
                  index === idx ? "bg-gray-50" : "",
                )}
              >
                <div>{JSON.stringify(k, null, 3)}</div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
