import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallbackTemplate?: ReactNode;
  templateName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class TemplateErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Template render error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // If a fallback template is provided, render it
      if (this.props.fallbackTemplate) {
        return this.props.fallbackTemplate;
      }

      // Otherwise show error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-8">
          <div className="max-w-md text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold">Template Error</h2>
            <p className="text-muted-foreground text-sm">
              The "{this.props.templateName || 'selected'}" template encountered an error while rendering.
              This might be due to missing or invalid data.
            </p>
            <Button onClick={this.handleRetry} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
