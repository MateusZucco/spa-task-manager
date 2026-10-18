"use client";

type AppHeaderProps = {
  state: {
    title: string;
    visible: boolean;
    action: {
      label: string;
      show: boolean;
      onClick: () => void;
    };
  };
};

export function AppHeader({ state }: AppHeaderProps) {
  if (!state.visible) return null;

  return (
    <div className="flex justify-between md:px-20 md:py-6 p-4">
      <h5 className="w-fit">{state.title}</h5>
      {state.action.show && (
        <button
          type="button"
          onClick={state.action.onClick}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          {state.action.label}
        </button>
      )}
    </div>
  );
}
