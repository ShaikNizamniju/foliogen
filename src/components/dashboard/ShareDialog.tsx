import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Download, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolioUrl: string;
}

export function ShareDialog({ open, onOpenChange, portfolioUrl }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Portfolio URL copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 300, 300);
      }
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'portfolio-qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();

      toast({
        title: "QR Code downloaded!",
        description: "Add it to your resume or business card.",
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Portfolio</DialogTitle>
          <DialogDescription>
            Share your portfolio link or download the QR code to add to your resume.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* URL Copy Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Your Portfolio URL</label>
            <div className="flex gap-2">
              <Input 
                readOnly 
                value={portfolioUrl} 
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopyUrl}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">QR Code</label>
            <div 
              ref={qrRef}
              className="flex justify-center p-6 bg-white rounded-lg border"
            >
              <QRCodeSVG 
                value={portfolioUrl} 
                size={200}
                level="H"
                includeMargin
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
            <Button 
              onClick={handleDownloadQR} 
              className="w-full"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
          </div>

          {/* Pro tip */}
          <p className="text-xs text-muted-foreground text-center">
            💡 Pro tip: Add this QR code to your printed resume so recruiters can instantly view your full portfolio!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
