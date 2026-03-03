import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Intentionally silent in production – errors are captured in state
    void errorInfo;
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
          <div className="p-4 rounded-full bg-destructive/10 mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {this.props.fallbackMessage || "Something went wrong"}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            An unexpected error occurred while rendering this section. Your data is safe.
          </p>
          <Button onClick={this.handleReset} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
