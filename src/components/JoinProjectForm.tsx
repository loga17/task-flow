"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { SquarePlus } from "lucide-react";
import { joinProject } from "@/actions/project";

export default function JoinProjectForm() {
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setIsLoading(true);

    const result = await joinProject(inviteCode);

    if (result.success) {
      toast.success(`Vous avez rejoint "${result.projectName}" !`);
      setInviteCode("");
      router.refresh();
    } else {
      toast.error(result.error || "Erreur lors de l'ajout");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex w-full max-w-md">
      <div className="mb-4 w-full">
        <input
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          type="text"
          placeholder="Code d'invitation"
          className="w-full p-2 input input-bordered"
          required
        />
      </div>
      <button
        onClick={handleSubmit}
        className="btn btn-primary ml-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <>
            Rejoindre
            <SquarePlus className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}