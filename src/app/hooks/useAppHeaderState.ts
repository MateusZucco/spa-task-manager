import { useMemo } from "react";
import { useAppStore } from "../stores/appStore";
import { useRouter } from "next/navigation";

export function useAppHeaderState(): {
  title: string;
  action: {
    label?: string;
    show: boolean;
    onClick?: () => void;
  };
} {
  const appState = useAppStore().state;
  const router = useRouter();

  const appStateHeader = useMemo(() => {
    switch (appState) {
      case "new":
        return {
          title: "New Task",
          action: {
            show: false,
          },
        };
      case "list":
        return {
          title: "Task List",
          action: {
            label: "New Task",
            show: true,
            onClick: () => {
              router.push("/task/new");
            },
          },
        };
      case "edit":
        return {
          title: "Edit Task",
          action: {
            show: false,
          },
        }
    }
  }, [appState]);

  return { ...appStateHeader };
}
