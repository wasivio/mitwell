export const getVerificationUrl = (rollNumber: string): string => {
  const envUrl = import.meta.env.VITE_APP_URL?.replace(/\/$/, '');
  const baseUrl = envUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://mitwelltech.com');
  return `${baseUrl}/verify/${encodeURIComponent(rollNumber.trim())}`;
};

export const downloadQRCodeAsPNG = (
  canvasId: string,
  rollNumber: string,
  studentName?: string
): boolean => {
  try {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.error(`Canvas element #${canvasId} not found`);
      return false;
    }

    // Create a high quality branded canvas with institute name and roll number
    const brandedCanvas = document.createElement('canvas');
    const padding = 24;
    const headerHeight = 50;
    const footerHeight = 40;
    
    brandedCanvas.width = canvas.width + padding * 2;
    brandedCanvas.height = canvas.height + padding * 2 + headerHeight + footerHeight;

    const ctx = brandedCanvas.getContext('2d');
    if (!ctx) return false;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, brandedCanvas.width, brandedCanvas.height);

    // Border
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, brandedCanvas.width - 12, brandedCanvas.height - 12);

    // Header Title
    ctx.fillStyle = '#0c1b33';
    ctx.font = 'bold 15px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MIT WELL TECH INSTITUTE', brandedCanvas.width / 2, 28);

    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 11px Arial, sans-serif';
    ctx.fillText('CERTIFICATE VERIFICATION QR', brandedCanvas.width / 2, 44);

    // Draw QR Code
    ctx.drawImage(canvas, padding, padding + headerHeight);

    // Footer - Student Details
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.fillText(`Roll: ${rollNumber.toUpperCase()}`, brandedCanvas.width / 2, brandedCanvas.height - 30);

    if (studentName) {
      ctx.fillStyle = '#64748b';
      ctx.font = '11px Arial, sans-serif';
      ctx.fillText(studentName.toUpperCase(), brandedCanvas.width / 2, brandedCanvas.height - 14);
    }

    // Trigger download
    const dataUrl = brandedCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `MIT-QR-${rollNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  } catch (err) {
    console.error('Failed to download QR code:', err);
    return false;
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Copy to clipboard failed:', err);
    return false;
  }
};
