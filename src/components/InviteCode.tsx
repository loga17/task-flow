"use client";

import { Copy } from "lucide-react";
import { toast } from "react-toastify";

/**
 * Encart de code d'invitation avec bouton de copie.
 */
interface InviteCodeProps {
  code: string;
}

export default function InviteCode({ code }: InviteCodeProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copié !");
    } catch (error) {
      toast.error("Impossible de copier le code");
    }
  };

  return (
    <div className="flex items-center justify-between bg-base-200 rounded-lg px-3 py-2">
      <span className="text-sm font-mono text-base-content/80 truncate">
        {code}
      </span>
      <button
        onClick={handleCopy}
        className="btn btn-ghost btn-xs btn-square"
        aria-label="Copier le code"
      >
        <Copy className="w-4 h-4" />
      </button>
    </div>
  );
}