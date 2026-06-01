import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("UI error", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="app-container py-16">
          <div className="card-surface p-6 text-center">
            <h2 className="font-heading text-2xl">Something went wrong</h2>
            <p className="text-textSecondary">Please reload the page and try again.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
