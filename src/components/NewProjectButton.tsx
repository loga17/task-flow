"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import NewProjectModal from "./NewProjectModal";

export default function NewProjectButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary gap-2"
      >
        Nouveau Projet
        <Plus className="w-4 h-4" />
      </button>
      <NewProjectModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}