import { CalendarIcon, QueueListIcon } from "@heroicons/react/16/solid";
import { Button } from "./ui/button";
import { useView } from "@/contexts/view-context";

export function ViewButton() {
  const { view, setView } = useView();

  function handleViewChange() {
    if (view === "list") {
      setView("timeline");
    } else if (view === "timeline") {
      setView("list");
    }
  }

  return (
    <Button onClick={handleViewChange} variant="primary" className="px-2">
      {view === "list" ? (
        <QueueListIcon className="h-4 w-4" />
      ) : (
        <CalendarIcon className="h-4 w-4" />
      )}
    </Button>
  );
}
